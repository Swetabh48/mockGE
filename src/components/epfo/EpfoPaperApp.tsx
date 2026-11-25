"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { downloadOmrSheet, downloadQuestionPaper } from "@/lib/epfo/pdf";
import { evaluate, type Mark } from "@/lib/epfo/scoring";
import { EPFO_SECTIONS } from "@/lib/epfo/sections";
import {
  clearSession,
  fetchPaper,
  getAttempt,
  getSession,
  newId,
  saveAttempt,
  saveSession,
  type EpfoAttempt,
  type OfflineSession,
  type OnlineSession,
} from "@/lib/epfo/storage";
import type { EpfoPaper } from "@/lib/epfo/types";
import { EpfoCbt, fmtClock } from "./EpfoCbt";
import { EpfoResult } from "./EpfoResult";
import { MailButton } from "./MailButton";
import { OmrUpload } from "./OmrUpload";
import { PaperReader } from "./PaperReader";

type Phase =
  | "loading"
  | "error"
  | "choose"
  | "online-instructions"
  | "online-test"
  | "offline-home"
  | "offline-timer"
  | "offline-after"
  | "omr"
  | "result"
  | "review";

const BAND_STYLE = {
  easy: "bg-emerald-50 text-emerald-800 border-emerald-200",
  medium: "bg-amber-50 text-amber-900 border-amber-200",
  hard: "bg-red-50 text-red-800 border-red-200",
} as const;

export function EpfoPaperApp({ paperId, attemptId }: { paperId: string; attemptId?: string }) {
  const router = useRouter();
  const [paper, setPaper] = useState<EpfoPaper | null>(null);
  const [phase, setPhase] = useState<Phase>("loading");
  const [error, setError] = useState("");
  const [online, setOnline] = useState<OnlineSession | null>(null);
  const [offline, setOffline] = useState<OfflineSession | null>(null);
  const [attempt, setAttempt] = useState<EpfoAttempt | null>(null);
  const [showPaper, setShowPaper] = useState(false);
  const [pdfBusy, setPdfBusy] = useState<"" | "paper" | "omr">("");
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    let alive = true;
    fetchPaper(paperId)
      .then((p) => {
        if (!alive) return;
        setPaper(p);
        if (attemptId) {
          const a = getAttempt(attemptId);
          if (a && a.paperId === p.id) {
            setAttempt(a);
            setPhase("result");
            return;
          }
        }
        const s = getSession<OnlineSession | OfflineSession>(p.id);
        setNow(Date.now());
        if (s?.mode === "online") setOnline(s);
        if (s?.mode === "offline") {
          if (s.startedAt && !s.finishedAt && Date.now() - s.startedAt >= p.durationMin * 60000) {
            const done: OfflineSession = { ...s, finishedAt: s.startedAt + p.durationMin * 60000 };
            saveSession(p.id, done);
            setOffline(done);
            setPhase("offline-after");
            return;
          }
          setOffline(s);
          if (s.startedAt && !s.finishedAt) {
            setPhase("offline-timer");
            return;
          }
          if (s.finishedAt) {
            setPhase("offline-after");
            return;
          }
        }
        setPhase("choose");
      })
      .catch((e: unknown) => {
        if (!alive) return;
        setError(e instanceof Error ? e.message : "Could not load the paper");
        setPhase("error");
      });
    return () => {
      alive = false;
    };
  }, [paperId, attemptId]);

  // offline countdown
  const offlineRemaining = paper && offline?.startedAt ? paper.durationMin * 60 - (now - offline.startedAt) / 1000 : 0;
  const finishRef = useRef<() => void>(() => undefined);

  const finishOffline = useCallback(() => {
    if (!paper || !offline) return;
    const s: OfflineSession = { ...offline, finishedAt: Date.now() };
    setOffline(s);
    saveSession(paper.id, s);
    setShowPaper(false);
    setPhase("offline-after");
  }, [paper, offline]);

  useEffect(() => {
    finishRef.current = finishOffline;
  }, [finishOffline]);

  useEffect(() => {
    if (phase !== "offline-timer" || !paper || !offline?.startedAt) return;
    const end = offline.startedAt + paper.durationMin * 60000;
    const id = window.setInterval(() => {
      const t = Date.now();
      setNow(t);
      if (t >= end) finishRef.current();
    }, 1000);
    return () => window.clearInterval(id);
  }, [phase, paper, offline?.startedAt]);

  const onlineRemaining = paper && online ? paper.durationMin * 60 - (now - online.startedAt) / 1000 : 0;

  function record(marks: Mark[], mode: "online" | "offline", timeSpent?: number[], usedSec?: number) {
    if (!paper) return;
    const ev = evaluate(paper, marks, timeSpent);
    const a: EpfoAttempt = {
      id: newId(),
      paperId: paper.id,
      paperTitle: paper.title,
      band: paper.band,
      mode,
      marks,
      timeSpent,
      usedSec,
      submittedAt: new Date().toISOString(),
      score: ev.score,
      maxScore: ev.maxScore,
      correct: ev.correct,
      wrong: ev.wrong,
      unattempted: ev.unattempted,
    };
    saveAttempt(a);
    clearSession(paper.id);
    setOnline(null);
    setOffline(null);
    setAttempt(a);
    setPhase("result");
    window.history.replaceState(null, "", `/epfo/${paper.id}?attempt=${a.id}`);
    window.scrollTo({ top: 0 });
  }

  function startOnline(resume: boolean) {
    if (!paper) return;
    const n = paper.questions.length;
    const s: OnlineSession =
      resume && online
        ? online
        : {
            mode: "online",
            startedAt: Date.now(),
            marks: Array(n).fill(null),
            review: Array(n).fill(false),
            visited: Array(n).fill(false),
            timeSpent: Array(n).fill(0),
            current: 0,
          };
    setOnline(s);
    saveSession(paper.id, s);
    setPhase("online-test");
    const el = document.documentElement as HTMLElement & { webkitRequestFullscreen?: () => void };
    try {
      if (el.requestFullscreen) void el.requestFullscreen().catch(() => undefined);
      else el.webkitRequestFullscreen?.();
    } catch {
      /* iPad Safari may refuse — the test works without fullscreen */
    }
  }

  function startOffline() {
    if (!paper) return;
    const s: OfflineSession = { mode: "offline", startedAt: Date.now(), finishedAt: null };
    setOffline(s);
    saveSession(paper.id, s);
    setNow(Date.now());
    setPhase("offline-timer");
  }

  async function pdf(kind: "paper" | "omr") {
    if (!paper) return;
    setPdfBusy(kind);
    try {
      if (kind === "paper") await downloadQuestionPaper(paper);
      else await downloadOmrSheet(paper);
    } finally {
      setPdfBusy("");
    }
  }

  if (phase === "loading") return <Shell><p className="p-8 text-sm text-[#5a6577]">Loading paper…</p></Shell>;
  if (phase === "error" || !paper)
    return (
      <Shell>
        <div className="p-8">
          <p className="text-sm text-red-700">{error || "Paper not found."}</p>
          <Link href="/?exam=epfo" className="mt-3 inline-block text-sm text-[#1e3a5f] underline">
            Back to EPFO mocks
          </Link>
        </div>
      </Shell>
    );

  if (phase === "online-test" && online) {
    return (
      <EpfoCbt
        paper={paper}
        session={online}
        onSubmit={(marks, ts, used) => {
          if (document.fullscreenElement) void document.exitFullscreen().catch(() => undefined);
          record(marks, "online", ts, used);
        }}
        onExit={() => {
          if (document.fullscreenElement) void document.exitFullscreen().catch(() => undefined);
          setOnline(getSession<OnlineSession>(paper.id));
          setNow(Date.now());
          setPhase("choose");
        }}
      />
    );
  }

  if (phase === "result" && attempt) {
    const ev = evaluate(paper, attempt.marks, attempt.timeSpent);
    return (
      <EpfoResult
        paper={paper}
        marks={attempt.marks}
        evaluation={ev}
        mode={attempt.mode}
        date={new Date(attempt.submittedAt).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}
        usedSec={attempt.usedSec}
        onBack={() => router.push("/?exam=epfo")}
      />
    );
  }

  if (phase === "review") {
    return (
      <EpfoResult
        paper={paper}
        marks={null}
        evaluation={null}
        onBack={() => setPhase(offline?.finishedAt ? "offline-after" : "choose")}
        onUploadInstead={() => setPhase("omr")}
      />
    );
  }

  const header = (
    <header className="border-b border-[#c5ccd6] bg-[#1e3a5f] text-white">
      <div className="mx-auto flex max-w-5xl flex-wrap items-end justify-between gap-3 px-4 py-5 sm:px-6">
        <div>
          <div className="text-xs uppercase tracking-[0.2em] text-slate-300">UPSC EPFO · APFC recruitment test · mock</div>
          <h1 className="font-display mt-1 text-2xl sm:text-3xl">{paper.title}</h1>
        </div>
        <Link href="/?exam=epfo" className="min-h-[40px] border border-white/40 px-3 py-2 text-sm hover:bg-white/10">
          All EPFO mocks
        </Link>
      </div>
    </header>
  );

  return (
    <Shell>
      {header}
      {phase === "omr" ? (
        <OmrUpload
          paper={paper}
          onBack={() => setPhase(offline?.finishedAt ? "offline-after" : "offline-home")}
          onReviewOnly={() => setPhase("review")}
          onScore={(m) => record(m, "offline")}
        />
      ) : (
        <main className="mx-auto max-w-5xl space-y-5 px-4 py-6 sm:px-6">
          <section className="flex flex-wrap items-center gap-2 text-sm">
            <span className={`border px-2 py-1 text-xs font-medium capitalize ${BAND_STYLE[paper.band]}`}>{paper.band}</span>
            {paper.pattern === "2025" && <span className="border border-red-700 px-2 py-1 text-xs font-medium text-red-800">2025 pattern</span>}
            <Chip>{paper.questions.length} MCQs</Chip>
            <Chip>{paper.durationMin / 60} hours</Chip>
            <Chip>{paper.questions.length * paper.marksPerQ} marks · {paper.marksPerQ} each</Chip>
            <Chip>−⅓ for a wrong answer</Chip>
            <Chip>No sectional timing</Chip>
          </section>

          {phase === "choose" && (
            <>
              {online && onlineRemaining > 0 && (
                <div className="flex flex-wrap items-center justify-between gap-3 border border-amber-300 bg-amber-50 p-4 text-sm">
                  <span>
                    You have an online attempt in progress — <b>{fmtClock(onlineRemaining)}</b> left.
                  </span>
                  <button type="button" onClick={() => startOnline(true)} className="min-h-[44px] bg-[#1e3a5f] px-4 text-white">
                    Resume online test
                  </button>
                </div>
              )}
              {online && onlineRemaining <= 0 && (
                <div className="flex flex-wrap items-center justify-between gap-3 border border-amber-300 bg-amber-50 p-4 text-sm">
                  <span>Time ran out on your previous online attempt.</span>
                  <button type="button" onClick={() => record(online.marks, "online", online.timeSpent, paper.durationMin * 60)} className="min-h-[44px] bg-[#1e3a5f] px-4 text-white">
                    See its result
                  </button>
                </div>
              )}
              <h2 className="font-display text-2xl text-[#1e3a5f]">How would you like to take this test?</h2>
              <p className="-mt-3 text-sm text-[#5a6577]">The real APFC recruitment test is an offline, pen-and-paper exam with an OMR answer sheet. Pick whichever suits you today.</p>
              <div className="grid gap-4 md:grid-cols-2">
                <ModeCard
                  title="Online"
                  tag="Take it on this device"
                  points={[
                    "Same pattern: 120 questions, 2-hour single timer, free navigation",
                    "Tap to answer, mark for review, question palette",
                    "Instant score, section-wise analysis and where to improve",
                    "Questions + answers + solutions, downloadable as PDF",
                  ]}
                  cta="Choose online"
                  onClick={() => setPhase("online-instructions")}
                />
                <ModeCard
                  title="Offline"
                  tag="Exam-hall style with OMR"
                  points={[
                    "View the question paper here or download it as PDF",
                    "Download and print the OMR answer sheet",
                    "Press Start test — the 2-hour timer begins",
                    "Then upload a photo of your OMR for the score, or just review solutions",
                  ]}
                  cta="Choose offline"
                  onClick={() => setPhase("offline-home")}
                />
              </div>
              <SyllabusMix paper={paper} />
            </>
          )}

          {phase === "online-instructions" && (
            <section className="space-y-4 border border-[#c5ccd6] bg-white p-5">
              <h2 className="font-display text-2xl text-[#1e3a5f]">Instructions — online mode</h2>
              <ol className="list-decimal space-y-2 pl-5 text-sm leading-relaxed">
                <li>The paper has {paper.questions.length} multiple-choice questions to be finished in {paper.durationMin} minutes. There is one timer for the whole paper.</li>
                <li>Each correct answer earns {paper.marksPerQ} marks. Each wrong answer deducts one-third of that ({paper.negPerQ.toFixed(2)} marks). Unanswered questions carry no penalty.</li>
                <li>Move freely between questions using Previous / Save &amp; next or the question palette. Tap a chosen option again to clear it.</li>
                <li>Use “Mark for review” for questions you want to revisit; marked questions that have an answer are still evaluated.</li>
                <li>The paper is submitted automatically when the timer reaches zero. Answers are saved on this device as you go, so an accidental refresh will not lose them.</li>
                <li>On a keyboard you may press A–D (or 1–4) to answer and ← / → to move.</li>
              </ol>
              <div className="flex flex-wrap gap-2">
                <button type="button" onClick={() => startOnline(false)} className="min-h-[48px] bg-[#c45c26] px-6 text-base font-medium text-white">
                  I am ready — start the test
                </button>
                <button type="button" onClick={() => setPhase("choose")} className="min-h-[48px] border border-[#c5ccd6] px-5 text-sm">
                  Back
                </button>
              </div>
            </section>
          )}

          {phase === "offline-home" && (
            <>
              <section className="grid gap-4 md:grid-cols-2">
                <div className="space-y-3 border border-[#c5ccd6] bg-white p-5">
                  <div className="text-xs font-semibold uppercase tracking-wide text-[#5a6577]">Step 1 · Question paper</div>
                  <p className="text-sm text-[#3a4556]">Read it on this screen during the test, or download and print it.</p>
                  <div className="flex flex-wrap gap-2">
                    <button type="button" onClick={() => setShowPaper((v) => !v)} className="min-h-[44px] border border-[#1e3a5f] px-4 text-sm text-[#1e3a5f]">
                      {showPaper ? "Hide question paper" : "View question paper"}
                    </button>
                    <button type="button" disabled={pdfBusy !== ""} onClick={() => void pdf("paper")} className="min-h-[44px] border border-[#c5ccd6] px-4 text-sm disabled:opacity-60">
                      {pdfBusy === "paper" ? "Preparing…" : "Download paper (PDF)"}
                    </button>
                  </div>
                </div>
                <div className="space-y-3 border border-[#c5ccd6] bg-white p-5">
                  <div className="text-xs font-semibold uppercase tracking-wide text-[#5a6577]">Step 2 · OMR answer sheet (optional)</div>
                  <p className="text-sm text-[#3a4556]">Download-only. Print on A4, mark answers with a black/blue pen, and photograph it after the test for automatic scoring.</p>
                  <button type="button" disabled={pdfBusy !== ""} onClick={() => void pdf("omr")} className="min-h-[44px] border border-[#c5ccd6] px-4 text-sm disabled:opacity-60">
                    {pdfBusy === "omr" ? "Preparing…" : "Download OMR sheet (PDF)"}
                  </button>
                </div>
              </section>
              <section className="flex flex-wrap items-center justify-between gap-4 border border-[#1e3a5f] bg-white p-5">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wide text-[#5a6577]">Step 3 · Start</div>
                  <p className="mt-1 text-sm text-[#3a4556]">The 2-hour timer starts the moment you press the button. When it ends you can upload your OMR sheet or simply review the solutions.</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button type="button" onClick={startOffline} className="min-h-[52px] bg-[#c45c26] px-7 text-base font-medium text-white">
                    Start test
                  </button>
                  <button type="button" onClick={() => setPhase("choose")} className="min-h-[52px] border border-[#c5ccd6] px-4 text-sm">
                    Back
                  </button>
                </div>
              </section>
              {showPaper && <PaperReader paper={paper} />}
            </>
          )}

          {phase === "offline-timer" && (
            <>
              <section className="sticky top-0 z-20 flex flex-wrap items-center justify-between gap-3 border border-[#1e3a5f] bg-[#1e3a5f] p-4 text-white shadow-md">
                <div>
                  <div className="text-xs uppercase tracking-wider text-slate-300">Offline test running · time left</div>
                  <div className={`font-mono text-4xl tabular-nums ${offlineRemaining <= 600 ? "text-amber-300" : ""}`}>{fmtClock(offlineRemaining)}</div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button type="button" onClick={() => setShowPaper((v) => !v)} className="min-h-[44px] border border-white/50 px-4 text-sm">
                    {showPaper ? "Hide question paper" : "View question paper"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (window.confirm("Stop the timer and finish the test now?")) finishOffline();
                    }}
                    className="min-h-[44px] bg-[#c45c26] px-4 text-sm font-medium"
                  >
                    I have finished
                  </button>
                </div>
              </section>
              {!showPaper && (
                <div className="border border-[#c5ccd6] bg-white p-5 text-sm leading-relaxed text-[#3a4556]">
                  Mark your answers on the printed OMR sheet (or on rough paper numbered 1–120). The timer keeps running even if you lock the iPad or close this tab; come back to this page any time.
                  <div className="mt-3 flex flex-wrap gap-2">
                    <button type="button" disabled={pdfBusy !== ""} onClick={() => void pdf("paper")} className="min-h-[44px] border border-[#c5ccd6] px-4 text-sm">
                      {pdfBusy === "paper" ? "Preparing…" : "Download paper (PDF)"}
                    </button>
                    <button type="button" disabled={pdfBusy !== ""} onClick={() => void pdf("omr")} className="min-h-[44px] border border-[#c5ccd6] px-4 text-sm">
                      {pdfBusy === "omr" ? "Preparing…" : "Download OMR sheet (PDF)"}
                    </button>
                  </div>
                </div>
              )}
              {showPaper && <PaperReader paper={paper} />}
            </>
          )}

          {phase === "offline-after" && (
            <section className="space-y-4">
              <div className="border border-[#c5ccd6] bg-white p-5">
                <h2 className="font-display text-2xl text-[#1e3a5f]">Time&apos;s up — pens down</h2>
                <p className="mt-1 text-sm text-[#5a6577]">Choose what you want to do next. Uploading the OMR is optional.</p>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <ModeCard
                  title="Upload OMR sheet"
                  tag="Get score + weak areas"
                  points={["Photo or scan of the filled mockGE OMR", "Answers are matched with the answer key", "Score, section-wise analysis, solutions and PDF"]}
                  cta="Upload OMR"
                  onClick={() => setPhase("omr")}
                />
                <ModeCard
                  title="Just review"
                  tag="Questions with solutions"
                  points={["See every question with its answer and detailed solution", "No score is calculated", "Download the solutions as PDF"]}
                  cta="Review solutions"
                  onClick={() => setPhase("review")}
                />
              </div>
              <button
                type="button"
                onClick={() => {
                  clearSession(paper.id);
                  setOffline(null);
                  setPhase("choose");
                }}
                className="text-sm text-[#5a6577] underline"
              >
                Discard this offline attempt and start over
              </button>
            </section>
          )}

          <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-[#c5ccd6] pt-4 text-xs text-[#8a93a3]">
            <span>Original practice paper by mockGE — not an official UPSC paper.</span>
            <MailButton context={paper.title} />
          </footer>
        </main>
      )}
    </Shell>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return <div className="min-h-[100dvh] bg-[#eef1f4] text-[#1a1f2b]">{children}</div>;
}

function Chip({ children }: { children: React.ReactNode }) {
  return <span className="border border-[#c5ccd6] bg-white px-2 py-1 text-xs text-[#3a4556]">{children}</span>;
}

function ModeCard({ title, tag, points, cta, onClick }: { title: string; tag: string; points: string[]; cta: string; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className="group flex flex-col border border-[#c5ccd6] bg-white p-5 text-left hover:border-[#c45c26] active:bg-[#fffaf6]">
      <div className="text-xs uppercase tracking-wide text-[#8a93a3]">{tag}</div>
      <div className="font-display mt-1 text-2xl text-[#1e3a5f]">{title}</div>
      <ul className="mt-3 flex-1 list-disc space-y-1 pl-5 text-sm text-[#3a4556]">
        {points.map((p) => (
          <li key={p}>{p}</li>
        ))}
      </ul>
      <span className="mt-4 inline-flex min-h-[44px] items-center justify-center bg-[#1e3a5f] px-4 text-sm font-medium text-white group-hover:bg-[#c45c26]">{cta}</span>
    </button>
  );
}

function SyllabusMix({ paper }: { paper: EpfoPaper }) {
  const counts = new Map<string, number>();
  for (const q of paper.questions) counts.set(q.sec, (counts.get(q.sec) ?? 0) + 1);
  return (
    <section className="border border-[#c5ccd6] bg-white p-5">
      <h3 className="text-sm font-semibold uppercase tracking-wide text-[#5a6577]">What this paper covers</h3>
      <div className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
        {EPFO_SECTIONS.map((s) => (
          <div key={s.key} className="flex justify-between border-b border-[#eef1f4] py-1">
            <span>{s.label}</span>
            <span className="tabular-nums text-[#5a6577]">{counts.get(s.key) ?? 0} Q</span>
          </div>
        ))}
      </div>
      {paper.pattern === "2025" && (
        <p className="mt-3 text-xs leading-relaxed text-[#5a6577]">
          Modelled on the 30 November 2025 paper: most questions are statement-based (&ldquo;how many of the above&rdquo;, assertion–reason, match the lists) or case-based, English includes two reading passages, and the section mix differs slightly from paper to paper.
        </p>
      )}
    </section>
  );
}
