"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { EPFO_SECTIONS, SECTION_BY_KEY } from "@/lib/epfo/sections";
import type { Mark } from "@/lib/epfo/scoring";
import { saveSession, type OnlineSession } from "@/lib/epfo/storage";
import { OPTION_LETTERS, type EpfoPaper } from "@/lib/epfo/types";

export function fmtClock(sec: number) {
  const s = Math.max(0, Math.floor(sec));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const ss = s % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(ss).padStart(2, "0")}`;
}

type Props = {
  paper: EpfoPaper;
  session: OnlineSession;
  onSubmit: (marks: Mark[], timeSpent: number[], usedSec: number) => void;
  onExit: () => void;
};

export function EpfoCbt({ paper, session, onSubmit, onExit }: Props) {
  const n = paper.questions.length;
  const total = paper.durationMin * 60;
  const [marks, setMarks] = useState<Mark[]>(session.marks);
  const [review, setReview] = useState<boolean[]>(session.review);
  const [visited, setVisited] = useState<boolean[]>(() => session.visited.map((v, i) => v || i === session.current));
  const [timeSpent, setTimeSpent] = useState<number[]>(session.timeSpent);
  const [current, setCurrent] = useState(session.current);
  const [now, setNow] = useState(() => Date.now());
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const submitted = useRef(false);
  const state = useRef({ marks, timeSpent, current });
  useEffect(() => {
    state.current = { marks, timeSpent, current };
  }, [marks, timeSpent, current]);

  const remaining = total - (now - session.startedAt) / 1000;
  const q = paper.questions[current]!;

  const doSubmit = useCallback(() => {
    if (submitted.current) return;
    submitted.current = true;
    const used = Math.min(total, Math.round((Date.now() - session.startedAt) / 1000));
    onSubmit(state.current.marks, state.current.timeSpent, used);
  }, [onSubmit, session.startedAt, total]);

  const submitRef = useRef(doSubmit);
  useEffect(() => {
    submitRef.current = doSubmit;
  }, [doSubmit]);

  // clock + per-question time + auto-submit (all inside the interval callback)
  useEffect(() => {
    const tick = () => {
      const t = Date.now();
      setNow(t);
      const left = Math.floor(total - (t - session.startedAt) / 1000);
      if (left <= 0) {
        submitRef.current();
        return;
      }
      if (left === 600) setNotice("10 minutes left. Review the questions you have marked.");
      if (left === 60) setNotice("1 minute left.");
      if (document.visibilityState === "visible") {
        setTimeSpent((prev) => {
          const next = [...prev];
          next[state.current.current] = (next[state.current.current] ?? 0) + 1;
          return next;
        });
      }
    };
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [total, session.startedAt]);

  // autosave so a reload / iPad sleep does not lose the attempt
  useEffect(() => {
    if (submitted.current) return;
    saveSession(paper.id, { mode: "online", startedAt: session.startedAt, marks, review, visited, timeSpent, current });
  }, [paper.id, session.startedAt, marks, review, visited, timeSpent, current]);

  useEffect(() => {
    const h = (e: BeforeUnloadEvent) => {
      if (!submitted.current) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", h);
    return () => window.removeEventListener("beforeunload", h);
  }, []);

  const go = useCallback(
    (i: number) => {
      if (i < 0 || i >= n) return;
      setCurrent(i);
      setVisited((v) => (v[i] ? v : v.map((x, j) => x || j === i)));
      setPaletteOpen(false);
    },
    [n],
  );

  const choose = useCallback(
    (o: number) => {
      setMarks((m) => {
        const next = [...m];
        next[current] = next[current] === o ? null : o;
        return next;
      });
    },
    [current],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (confirming) return;
      const t = e.target as HTMLElement | null;
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA")) return;
      const k = e.key.toLowerCase();
      if (["a", "b", "c", "d"].includes(k)) choose("abcd".indexOf(k));
      else if (["1", "2", "3", "4"].includes(k)) choose(Number(k) - 1);
      else if (e.key === "ArrowRight") go(current + 1);
      else if (e.key === "ArrowLeft") go(current - 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [choose, go, current, confirming]);

  const counts = useMemo(() => {
    let answered = 0, marked = 0, notAnswered = 0, notVisited = 0;
    for (let i = 0; i < n; i++) {
      if (marks[i] !== null) answered++;
      else if (visited[i]) notAnswered++;
      else notVisited++;
      if (review[i]) marked++;
    }
    return { answered, marked, notAnswered, notVisited };
  }, [marks, review, visited, n]);

  const tone = (i: number) => {
    const a = marks[i] !== null;
    if (review[i] && a) return "bg-violet-700 text-white border-violet-700";
    if (review[i]) return "bg-amber-400 text-[#1a1f2b] border-amber-500";
    if (a) return "bg-emerald-700 text-white border-emerald-700";
    if (visited[i]) return "bg-red-700 text-white border-red-700";
    return "bg-white text-[#1a1f2b] border-[#c5ccd6]";
  };

  const palette = (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-2 text-xs">
        <Legend c="bg-emerald-700" l={`Answered (${counts.answered})`} />
        <Legend c="bg-red-700" l={`Not answered (${counts.notAnswered})`} />
        <Legend c="bg-amber-400" l={`Marked (${counts.marked})`} />
        <Legend c="bg-white border border-[#c5ccd6]" l={`Not visited (${counts.notVisited})`} />
        <Legend c="bg-violet-700" l="Answered + marked" />
      </div>
      {EPFO_SECTIONS.map((s) => {
        const idx = paper.questions.map((qq, i) => (qq.sec === s.key ? i : -1)).filter((i) => i >= 0);
        if (!idx.length) return null;
        return (
          <div key={s.key}>
            <div className="mb-1.5 text-[11px] font-medium uppercase tracking-wide text-[#5a6577]">{s.short}</div>
            <div className="grid grid-cols-6 gap-1.5 sm:grid-cols-8 lg:grid-cols-5">
              {idx.map((i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => go(i)}
                  className={`h-10 border text-sm font-medium ${tone(i)} ${i === current ? "ring-2 ring-[#1e3a5f] ring-offset-1" : ""}`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );

  return (
    <div className="exam-shell flex h-[100dvh] flex-col bg-[#eef1f4] text-[#1a1f2b]">
      <header className="flex items-center justify-between gap-2 border-b border-[#c5ccd6] bg-[#1e3a5f] px-3 py-2 text-white sm:px-4">
        <div className="min-w-0">
          <div className="font-display text-base sm:text-lg">mockGE · EPFO APFC</div>
          <div className="truncate text-[11px] text-slate-200 sm:text-xs">{paper.title} · online</div>
        </div>
        <div className="text-center">
          <div className="text-[10px] uppercase tracking-wider text-slate-300">Time left</div>
          <div className={`font-mono text-xl tabular-nums sm:text-2xl ${remaining <= 300 ? "text-amber-300" : ""}`}>{fmtClock(remaining)}</div>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setPaletteOpen(true)}
            className="min-h-[44px] border border-white/40 px-3 text-sm lg:hidden"
          >
            Questions
          </button>
          <button
            type="button"
            onClick={() => setConfirming(true)}
            className="min-h-[44px] bg-[#c45c26] px-3 text-sm font-medium hover:bg-[#a84c1f] sm:px-4"
          >
            Submit
          </button>
        </div>
      </header>

      {notice && (
        <div className="flex items-center justify-between border-b border-amber-300 bg-amber-50 px-4 py-2 text-sm text-amber-950">
          <span>{notice}</span>
          <button type="button" className="min-h-[36px] px-2 underline" onClick={() => setNotice(null)}>
            OK
          </button>
        </div>
      )}

      <div className="flex min-h-0 flex-1">
        <main className="flex min-w-0 flex-1 flex-col bg-white lg:border-r lg:border-[#c5ccd6]">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#e2e6eb] px-4 py-2 text-sm">
            <span className="font-medium">
              Question {current + 1} <span className="font-normal text-[#5a6577]">of {n}</span>
            </span>
            <span className="text-xs text-[#5a6577]">
              {SECTION_BY_KEY[q.sec].short} · +{paper.marksPerQ} / −{paper.negPerQ.toFixed(2)}
            </span>
          </div>
          <div className="flex-1 overflow-y-auto overscroll-contain px-4 py-5 sm:px-6">
            {q.p && (
              <div className="mb-5 border-l-4 border-[#1e3a5f] bg-[#f4f6f9] p-4 text-[15px] leading-relaxed">
                <div className="mb-1 text-xs font-medium uppercase tracking-wide text-[#5a6577]">Passage</div>
                <p className="whitespace-pre-line">{q.p}</p>
              </div>
            )}
            <p className="mb-6 whitespace-pre-line text-[16px] leading-relaxed">{q.q}</p>
            <div className="space-y-3">
              {q.o.map((opt, oi) => {
                const sel = marks[current] === oi;
                return (
                  <button
                    key={oi}
                    type="button"
                    onClick={() => choose(oi)}
                    aria-pressed={sel}
                    className={`flex min-h-[52px] w-full items-start gap-3 border px-4 py-3 text-left text-[15px] transition-colors ${
                      sel ? "border-[#1e3a5f] bg-[#e5ecf5]" : "border-[#d5dbe3] bg-white active:bg-[#f2f4f7]"
                    }`}
                  >
                    <span
                      className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-sm font-semibold ${
                        sel ? "border-[#1e3a5f] bg-[#1e3a5f] text-white" : "border-[#9aa6b5] text-[#1e3a5f]"
                      }`}
                    >
                      {OPTION_LETTERS[oi]}
                    </span>
                    <span className="whitespace-pre-line pt-0.5">{opt}</span>
                  </button>
                );
              })}
            </div>
            <p className="mt-4 text-xs text-[#8a93a3]">Tap the selected option again to clear it.</p>
          </div>
          <div className="grid grid-cols-2 gap-2 border-t border-[#e2e6eb] bg-[#f7f8fa] p-3 sm:flex sm:flex-wrap">
            <button type="button" onClick={() => go(current - 1)} disabled={current === 0} className="min-h-[44px] border border-[#c5ccd6] bg-white px-4 text-sm disabled:opacity-40">
              ← Previous
            </button>
            <button
              type="button"
              onClick={() => setMarks((m) => m.map((v, i) => (i === current ? null : v)))}
              className="min-h-[44px] border border-[#c5ccd6] bg-white px-4 text-sm"
            >
              Clear response
            </button>
            <button
              type="button"
              onClick={() => {
                setReview((r) => r.map((v, i) => (i === current ? !v : v)));
                if (!review[current]) go(current + 1);
              }}
              className={`min-h-[44px] border px-4 text-sm ${review[current] ? "border-amber-600 bg-amber-400" : "border-amber-500 bg-amber-50 text-amber-950"}`}
            >
              {review[current] ? "Unmark review" : "Mark for review & next"}
            </button>
            <button
              type="button"
              onClick={() => (current < n - 1 ? go(current + 1) : setConfirming(true))}
              className="min-h-[44px] bg-[#1e3a5f] px-5 text-sm font-medium text-white sm:ml-auto"
            >
              {current < n - 1 ? "Save & next →" : "Save & finish"}
            </button>
          </div>
        </main>

        <aside className="hidden w-[300px] shrink-0 overflow-y-auto bg-[#f3f5f8] p-4 lg:block">{palette}</aside>
      </div>

      {paletteOpen && (
        <div className="fixed inset-0 z-40 flex justify-end bg-black/40 lg:hidden" onClick={() => setPaletteOpen(false)}>
          <div
            className="h-full w-[min(92vw,420px)] overflow-y-auto bg-[#f3f5f8] p-4 pb-10 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-3 flex items-center justify-between">
              <span className="font-medium text-[#1e3a5f]">Question palette</span>
              <button type="button" onClick={() => setPaletteOpen(false)} className="min-h-[44px] px-3 text-sm underline">
                Close
              </button>
            </div>
            {palette}
          </div>
        </div>
      )}

      {confirming && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md bg-white p-5 shadow-xl">
            <h2 className="font-display text-xl text-[#1e3a5f]">Submit the paper?</h2>
            <dl className="mt-3 grid grid-cols-2 gap-2 text-sm">
              <div className="border border-[#e2e6eb] p-2">Answered: <b>{counts.answered}</b></div>
              <div className="border border-[#e2e6eb] p-2">Unanswered: <b>{n - counts.answered}</b></div>
              <div className="border border-[#e2e6eb] p-2">Marked for review: <b>{counts.marked}</b></div>
              <div className="border border-[#e2e6eb] p-2">Time left: <b>{fmtClock(remaining)}</b></div>
            </dl>
            <p className="mt-3 text-sm text-[#5a6577]">You cannot change answers after submitting.</p>
            <div className="mt-4 flex flex-wrap justify-end gap-2">
              <button type="button" onClick={() => setConfirming(false)} className="min-h-[44px] border border-[#c5ccd6] px-4 text-sm">
                Back to test
              </button>
              <button type="button" onClick={doSubmit} className="min-h-[44px] bg-[#c45c26] px-4 text-sm font-medium text-white">
                Submit & see result
              </button>
            </div>
            <button
              type="button"
              onClick={() => {
                if (window.confirm("Leave the test? Your answers stay saved on this device and you can resume until time runs out.")) onExit();
              }}
              className="mt-3 text-xs text-[#5a6577] underline"
            >
              Pause and leave (resume later)
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function Legend({ c, l }: { c: string; l: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className={`inline-block h-4 w-4 ${c}`} />
      <span>{l}</span>
    </div>
  );
}
