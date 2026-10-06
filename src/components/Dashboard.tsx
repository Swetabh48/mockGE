"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { PRACTICE_SYLLABUS, type PracticeSubjectKey } from "@/lib/exam/taxonomy";

type Paper = {
  id: string;
  title: string;
  tier: string;
  source: string;
  difficulty: string;
  mode?: string;
  focusSection?: string | null;
  focusTopic?: string | null;
  focusSubtopic?: string | null;
  questionCount: number;
  attemptCount: number;
  hasDest: boolean;
};

type Attempt = {
  id: string;
  paperTitle: string;
  tier: string;
  status: string;
  score: number | null;
  maxScore: number | null;
  submittedAt: string | null;
};

type Status = {
  questionBankReady: boolean;
  paperCount: number;
  attemptCount: number;
  questionCount?: number;
  bank?: { ready: boolean; message: string };
  backend?: string;
};

function failMessage(e: unknown): string {
  const msg = e instanceof Error ? e.message : "Failed";
  if (/abort/i.test(msg)) {
    return "Request aborted while the cloud model was waking. Click Generate again — second try is usually fast.";
  }
  return msg;
}

async function readApiJson(res: Response): Promise<Record<string, unknown>> {
  const text = await res.text();
  try {
    return JSON.parse(text) as Record<string, unknown>;
  } catch {
    const snippet = text.replace(/\s+/g, " ").trim().slice(0, 160);
    if (/an error occurred/i.test(snippet) || res.status === 504 || res.status === 502) {
      throw new Error(
        "Generate timed out on the server. Wait a few seconds and try again (cloud model was still inventing).",
      );
    }
    throw new Error(snippet || `Server returned non-JSON (${res.status})`);
  }
}

type Area = "test" | "practice";
type TestTab = "mocks" | "pyq" | "tier2";

export function Dashboard() {
  const [papers, setPapers] = useState<Paper[]>([]);
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [status, setStatus] = useState<Status | null>(null);
  const [area, setArea] = useState<Area>("test");
  const [testTab, setTestTab] = useState<TestTab>("mocks");
  const [practiceSubject, setPracticeSubject] = useState<PracticeSubjectKey | "section">("section");
  const [practiceTopic, setPracticeTopic] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function load() {
    const [p, a, s] = await Promise.all([
      fetch("/api/papers").then((r) => r.json()),
      fetch("/api/attempts").then((r) => r.json()),
      fetch("/api/status").then((r) => r.json()),
    ]);
    setPapers(p.papers ?? []);
    setAttempts(a.attempts ?? []);
    setStatus(s);
  }

  useEffect(() => {
    void load();
  }, []);

  async function generateHardMock() {
    setGenerating(true);
    setMessage(null);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tier: "tier1",
        }),
      });
      const data = await readApiJson(res);
      if (!res.ok) throw new Error(String(data.error || "Failed"));
      setMessage(`Hard mock created (${data.questionCount} questions).`);
      await load();
    } catch (e) {
      setMessage(failMessage(e));
    } finally {
      setGenerating(false);
    }
  }

  async function generateUnlimitedPractice() {
    setGenerating(true);
    setMessage(
      "mockge-ssc inventing new questions… first click after idle can take ~2 minutes. Keep this tab open.",
    );
    try {
      let requestBody: {
        kind: "section" | "topic";
        subject: PracticeSubjectKey;
        topicId?: string;
      };

      if (practiceSubject === "section") {
        // Default fresh Quant section drill from the "section drills" tab
        requestBody = { kind: "section", subject: "quant" };
      } else if (practiceTopic) {
        requestBody = { kind: "topic", subject: practiceSubject, topicId: practiceTopic };
      } else {
        // Subject selected, all topics — mint another section drill for that subject
        requestBody = { kind: "section", subject: practiceSubject };
      }

      const res = await fetch("/api/practice/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      setMessage(
        `Ready: ${data.title}. Open it from the list below.`,
      );
      await load();
    } catch (e) {
      setMessage(failMessage(e));
    } finally {
      setGenerating(false);
    }
  }

  const subjectMeta = PRACTICE_SYLLABUS.find((s) => s.key === practiceSubject);

  const filtered = useMemo(() => {
    if (area === "test") {
      if (testTab === "mocks") {
        return papers.filter(
          (p) => p.tier === "tier1" && (p.mode === "full_mock" || (!p.mode && p.source !== "pyq_style")),
        );
      }
      if (testTab === "pyq") {
        return papers.filter(
          (p) => p.mode === "pyq" || p.source === "pyq_style" || p.title.toLowerCase().includes("pyq"),
        );
      }
      return papers.filter((p) => p.tier === "tier2");
    }

    // Practice
    if (practiceSubject === "section") {
      return papers.filter((p) => p.mode === "practice" && !p.focusTopic);
    }
    if (!practiceTopic) {
      return papers.filter(
        (p) => p.mode === "topic_practice" && p.focusSection === practiceSubject,
      );
    }
    return papers.filter(
      (p) =>
        p.mode === "topic_practice" &&
        p.focusSection === practiceSubject &&
        p.focusTopic === practiceTopic,
    );
  }, [papers, area, testTab, practiceSubject, practiceTopic]);

  return (
    <div className="min-h-screen bg-[#eef1f4] text-[#1a1f2b]">
      <header className="border-b border-[#c5ccd6] bg-[#1e3a5f] text-white">
        <div className="mx-auto flex max-w-6xl flex-wrap items-end justify-between gap-4 px-6 py-10">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-slate-300">SSC CGL 2026 pattern</p>
            <h1 className="font-display mt-2 text-4xl tracking-tight sm:text-5xl">mockGE</h1>
            <p className="mt-3 max-w-xl text-sm text-slate-200">
              Test = full mocks & PYQ. Practice = untimed drills with solutions. Revise = formulas &
              tricks by pattern.
            </p>
          </div>
          <div className="flex flex-col items-end gap-2 text-xs text-slate-200">
            <Link
              href="/revise"
              className="border border-white/40 px-3 py-1.5 text-sm text-white hover:bg-white/10"
            >
              Formulas &amp; Tricks
            </Link>
            <span>
              {status?.bank?.message ??
                (status?.questionBankReady
                  ? `Bank ready · ${status.paperCount} papers`
                  : "Bank empty — run npm run db:seed")}
            </span>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl space-y-8 px-6 py-8">
        <div className="flex flex-wrap gap-2">
          {(
            [
              { id: "test" as const, label: "Test", blurb: "Mocks · PYQ · Tier-II" },
              { id: "practice" as const, label: "Practice", blurb: "Topics · stopwatch" },
            ] as const
          ).map((a) => (
            <button
              key={a.id}
              type="button"
              onClick={() => {
                setArea(a.id);
                setPracticeTopic(null);
              }}
              className={`min-w-[9rem] border px-4 py-3 text-left ${
                area === a.id
                  ? "border-[#1e3a5f] bg-[#1e3a5f] text-white"
                  : "border-[#c5ccd6] bg-white text-[#1a1f2b] hover:border-[#1e3a5f]"
              }`}
            >
              <div className="text-sm font-medium">{a.label}</div>
              <div className={`text-[11px] ${area === a.id ? "text-slate-200" : "text-[#8a93a3]"}`}>
                {a.blurb}
              </div>
            </button>
          ))}
          <Link
            href="/revise"
            className="min-w-[9rem] border border-[#c45c26] bg-white px-4 py-3 text-left text-[#c45c26] hover:bg-[#c45c26] hover:text-white"
          >
            <div className="text-sm font-medium">Revise</div>
            <div className="text-[11px] opacity-80">Formulas · pattern tricks</div>
          </Link>
        </div>

        {area === "test" ? (
          <nav className="flex flex-wrap gap-2 border-b border-[#c5ccd6] pb-3">
            {(
              [
                { id: "mocks" as const, label: "Full Mocks", blurb: "100 Q · 4×15 min" },
                { id: "pyq" as const, label: "PYQ Style", blurb: "Hard pattern" },
                { id: "tier2" as const, label: "Tier-II", blurb: "Paper-I + DEST" },
              ] as const
            ).map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setTestTab(t.id)}
                className={`px-3 py-2 text-left text-sm ${
                  testTab === t.id
                    ? "border-b-2 border-[#1e3a5f] font-medium text-[#1e3a5f]"
                    : "text-[#5a6577] hover:text-[#1a1f2b]"
                }`}
              >
                <div>{t.label}</div>
                <div className="text-[11px] text-[#8a93a3]">{t.blurb}</div>
              </button>
            ))}
          </nav>
        ) : (
          <div className="space-y-4">
            <nav className="flex flex-wrap gap-2 border-b border-[#c5ccd6] pb-3">
              <button
                type="button"
                onClick={() => {
                  setPracticeSubject("section");
                  setPracticeTopic(null);
                }}
                className={`px-3 py-2 text-sm ${
                  practiceSubject === "section"
                    ? "border-b-2 border-[#1e3a5f] font-medium text-[#1e3a5f]"
                    : "text-[#5a6577]"
                }`}
              >
                Section drills (25 Q)
              </button>
              {PRACTICE_SYLLABUS.map((s) => (
                <button
                  key={s.key}
                  type="button"
                  onClick={() => {
                    setPracticeSubject(s.key);
                    setPracticeTopic(null);
                  }}
                  className={`px-3 py-2 text-sm ${
                    practiceSubject === s.key
                      ? "border-b-2 border-[#1e3a5f] font-medium text-[#1e3a5f]"
                      : "text-[#5a6577]"
                  }`}
                >
                  {s.title}
                </button>
              ))}
            </nav>

            {subjectMeta && (
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setPracticeTopic(null)}
                  className={`border px-3 py-1.5 text-xs ${
                    practiceTopic === null
                      ? "border-[#1e3a5f] bg-[#1e3a5f] text-white"
                      : "border-[#c5ccd6] bg-white"
                  }`}
                >
                  All topics
                </button>
                {subjectMeta.topics.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setPracticeTopic(t.id)}
                    className={`border px-3 py-1.5 text-xs ${
                      practiceTopic === t.id
                        ? "border-[#c45c26] bg-[#c45c26] text-white"
                        : "border-[#c5ccd6] bg-white"
                    }`}
                  >
                    {t.title}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        <section className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-display text-2xl text-[#1e3a5f]">
              {area === "test"
                ? testTab === "mocks"
                  ? "Full Mocks"
                  : testTab === "pyq"
                    ? "PYQ Style"
                    : "Tier-II"
                : practiceSubject === "section"
                  ? "Section drills"
                  : subjectMeta?.title ?? "Practice"}
            </h2>
            <p className="text-sm text-[#5a6577]">
              {area === "test" && testTab === "mocks" &&
                "Official Tier-I lock: Reasoning → GA → Quant → English. 15 minutes each."}
              {area === "test" && testTab === "pyq" &&
                "Harder sets modelled on previous-year difficulty and topic mix."}
              {area === "test" && testTab === "tier2" &&
                "Paper-I with sectional session timing and DEST practice."}
              {area === "practice" &&
                "Book-style practice: no timer. Generate unlimited fresh sets anytime."}
            </p>
          </div>
          {area === "test" && testTab === "mocks" && (
            <button
              type="button"
              disabled={generating}
              onClick={() => void generateHardMock()}
              className="border border-[#1e3a5f] px-3 py-1.5 text-sm text-[#1e3a5f] hover:bg-[#1e3a5f] hover:text-white disabled:opacity-50"
            >
              {generating ? "Creating..." : "Create new hard mock"}
            </button>
          )}
          {area === "practice" && (
            <div className="flex flex-wrap gap-2">
              {practiceSubject === "section" &&
                (["quant", "reasoning", "english", "ga"] as PracticeSubjectKey[]).map((sk) => (
                  <button
                    key={sk}
                    type="button"
                    disabled={generating}
                    onClick={() => {
                      setPracticeSubject(sk);
                      void (async () => {
                        setGenerating(true);
                        setMessage(
                          "mockge-ssc inventing new questions… first click after idle can take ~2 minutes. Keep this tab open.",
                        );
                        try {
                          const res = await fetch("/api/practice/generate", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ kind: "section", subject: sk }),
                          });
                          const data = await readApiJson(res);
                          if (!res.ok) throw new Error(String(data.error || "Failed"));
                          setMessage(`Ready: ${data.title}. Open it from the list below.`);
                          await load();
                        } catch (e) {
                          setMessage(failMessage(e));
                        } finally {
                          setGenerating(false);
                        }
                      })();
                    }}
                    className="border border-[#c45c26] px-3 py-1.5 text-sm text-[#c45c26] hover:bg-[#c45c26] hover:text-white disabled:opacity-50"
                  >
                    + {sk === "ga" ? "GA" : sk[0]!.toUpperCase() + sk.slice(1)} set
                  </button>
                ))}
              {practiceSubject !== "section" && (
                <button
                  type="button"
                  disabled={generating}
                  onClick={() => void generateUnlimitedPractice()}
                  className="border border-[#c45c26] px-3 py-1.5 text-sm text-[#c45c26] hover:bg-[#c45c26] hover:text-white disabled:opacity-50"
                >
                  {generating ? "Creating..." : "Generate more questions"}
                </button>
              )}
            </div>
          )}
        </section>

        {message && (
          <p className="border border-[#c5ccd6] bg-white px-4 py-2 text-sm">{message}</p>
        )}

        <PaperTable
          papers={filtered}
          emptyHint={
            area === "practice"
              ? "No practice papers yet. Run npm run db:seed."
              : "No papers in this section. Run npm run db:seed."
          }
        />

        <section>
          <h2 className="font-display mb-3 text-xl text-[#1e3a5f]">Recent attempts</h2>
          {attempts.length === 0 ? (
            <p className="text-sm text-[#5a6577]">No attempts yet.</p>
          ) : (
            <div className="border border-[#c5ccd6] bg-white">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-[#e2e6eb] bg-[#f7f8fa] text-xs uppercase text-[#5a6577]">
                  <tr>
                    <th className="px-4 py-2">Paper</th>
                    <th className="px-4 py-2">Score</th>
                    <th className="px-4 py-2">Status</th>
                    <th className="px-4 py-2" />
                  </tr>
                </thead>
                <tbody>
                  {attempts.slice(0, 12).map((a) => (
                    <tr key={a.id} className="border-b border-[#e2e6eb] last:border-0">
                      <td className="px-4 py-2">{a.paperTitle}</td>
                      <td className="px-4 py-2">
                        {a.score != null ? `${a.score} / ${a.maxScore}` : "—"}
                      </td>
                      <td className="px-4 py-2 capitalize">{a.status.replace("_", " ")}</td>
                      <td className="px-4 py-2 text-right">
                        {a.score != null ? (
                          <Link href={`/report/${a.id}`} className="text-[#1e3a5f] underline">
                            Result
                          </Link>
                        ) : (
                          "—"
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

function PaperTable({ papers, emptyHint }: { papers: Paper[]; emptyHint: string }) {
  if (papers.length === 0) {
    return <p className="text-sm text-[#5a6577]">{emptyHint}</p>;
  }
  return (
    <ul className="divide-y divide-[#e2e6eb] border border-[#c5ccd6] bg-white">
      {papers.map((p) => (
        <li key={p.id} className="flex flex-wrap items-center justify-between gap-3 px-4 py-3">
          <div>
            <div className="font-medium">{p.title}</div>
            <div className="text-xs text-[#5a6577]">
              {p.questionCount} questions · {p.difficulty}
              {p.mode === "topic_practice"
                ? " · topic drill · no timer · solutions + tricks"
                : p.mode === "practice"
                  ? " · no timer · book-style"
                  : p.tier === "tier1"
                    ? " · sectional 15×4"
                    : ""}
            </div>
          </div>
          <Link
            href={`/exam/${p.id}`}
            className="bg-[#1e3a5f] px-4 py-1.5 text-sm text-white hover:bg-[#152a45]"
          >
            Start
          </Link>
        </li>
      ))}
    </ul>
  );
}
