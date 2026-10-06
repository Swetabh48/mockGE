"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Cell,
} from "recharts";
import type { EvaluationResult } from "@/lib/exam/scoring";

type ReviewItem = {
  id: string;
  qIndex: number;
  sectionKey: string;
  subject: string;
  topic: string;
  subtopic?: string | null;
  stemEn: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctOption: string;
  explanation: string | null;
  trick: string | null;
  selected: string | null;
  timeSpentMs: number;
  changeCount: number;
};

type Props = {
  paperTitle: string;
  score: number;
  maxScore: number;
  correctCount: number;
  wrongCount: number;
  unattempted: number;
  analysis: EvaluationResult;
  destQualified: boolean | null;
  destAccuracy: number | null;
  destKeystrokes: number | null;
  review: ReviewItem[];
};

function optText(q: ReviewItem, letter: string) {
  if (letter === "A") return q.optionA;
  if (letter === "B") return q.optionB;
  if (letter === "C") return q.optionC;
  return q.optionD;
}

/** Turn plain URLs in trick text into clickable links. */
function LinkifiedText({ text }: { text: string }) {
  const parts = text.split(/(https?:\/\/[^\s]+)/g);
  return (
    <>
      {parts.map((part, i) =>
        /^https?:\/\//.test(part) ? (
          <a
            key={i}
            href={part}
            target="_blank"
            rel="noopener noreferrer"
            className="break-all font-medium text-[#1e3a5f] underline underline-offset-2"
          >
            {part}
          </a>
        ) : (
          <span key={i}>{part}</span>
        ),
      )}
    </>
  );
}

export function ReportView(props: Props) {
  const { analysis } = props;
  const sectionData = analysis.sections.map((s) => ({
    name: s.label,
    score: s.score,
    max: s.maxScore,
    accuracy: s.accuracy,
  }));

  const timeData = analysis.timeAnalysis.perQuestion
    .filter((q) => q.timeSpentMs > 0)
    .slice(0, 40)
    .map((q) => ({
      q: `Q${q.qIndex}`,
      seconds: Math.round(q.timeSpentMs / 1000),
      status: q.status,
    }));

  const paceSec = Math.round(analysis.timeAnalysis.suggestedPaceMs / 1000);
  const avgSec = Math.round(analysis.timeAnalysis.avgTimePerQuestionMs / 1000);

  return (
    <div className="min-h-screen bg-[#eef1f4] text-[#1a1f2b]">
      <header className="border-b border-[#c5ccd6] bg-[#1e3a5f] px-6 py-4 text-white">
        <div className="mx-auto flex max-w-5xl items-end justify-between">
          <div>
            <div className="font-display text-xl">mockGE</div>
            <div className="mt-1 text-sm text-slate-200">Result · {props.paperTitle}</div>
          </div>
          <a href="/" className="border border-white/40 px-3 py-1.5 text-sm hover:bg-white/10">
            Dashboard
          </a>
        </div>
      </header>

      <main className="mx-auto max-w-5xl space-y-6 px-6 py-8">
        <section className="grid gap-4 border border-[#c5ccd6] bg-white p-5 sm:grid-cols-4">
          <Stat label="Score" value={`${props.score} / ${props.maxScore}`} />
          <Stat label="Correct" value={String(props.correctCount)} />
          <Stat label="Wrong" value={String(props.wrongCount)} />
          <Stat label="Unattempted" value={String(props.unattempted)} />
        </section>

        {props.destQualified !== null && (
          <section className="border border-[#c5ccd6] bg-white p-5 text-sm">
            <h2 className="mb-2 font-semibold text-[#1e3a5f]">DEST (Session-II)</h2>
            <p>
              Keystrokes: {props.destKeystrokes ?? 0} · Accuracy: {props.destAccuracy ?? 0}% ·{" "}
              {props.destQualified ? "Qualified (practice standard)" : "Not qualified (practice standard)"}
            </p>
          </section>
        )}

        <section className="grid gap-4 md:grid-cols-2">
          <div className="border border-[#c5ccd6] bg-white p-5">
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-[#5a6577]">
              Section scores
            </h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={sectionData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e6eb" />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Bar dataKey="score" fill="#1e3a5f" name="Score" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="border border-[#c5ccd6] bg-white p-5">
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-[#5a6577]">
              Section accuracy (%)
            </h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={sectionData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e6eb" />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Bar dataKey="accuracy" name="Accuracy">
                    {sectionData.map((entry) => (
                      <Cell
                        key={entry.name}
                        fill={entry.accuracy >= 60 ? "#2f6b4f" : "#a33b3b"}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>

        <section className="border border-[#c5ccd6] bg-white p-5">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-[#5a6577]">
            Time analysis
          </h2>
          <div className="mb-4 grid gap-3 text-sm sm:grid-cols-4">
            <Stat label="Avg time / Q" value={`${avgSec}s`} />
            <Stat label="Suggested pace" value={`${paceSec}s`} />
            <Stat
              label="Time on wrong"
              value={`${Math.round(analysis.timeAnalysis.timeOnWrongMs / 1000)}s`}
            />
            <Stat
              label="Frequent changes"
              value={String(analysis.timeAnalysis.highChangeQuestions)}
            />
          </div>
          <p className="mb-3 text-sm text-[#5a6577]">
            Time spent on the first 40 questions with recorded activity. Bars above the
            suggested pace indicate where time could have been used elsewhere.
          </p>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={timeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e6eb" />
                <XAxis dataKey="q" tick={{ fontSize: 10 }} interval={2} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="seconds" name="Seconds">
                  {timeData.map((entry) => (
                    <Cell
                      key={entry.q}
                      fill={
                        entry.status === "correct"
                          ? "#2f6b4f"
                          : entry.status === "wrong"
                            ? "#a33b3b"
                            : "#8a93a3"
                      }
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2">
          <div className="border border-[#c5ccd6] bg-white p-5">
            <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-[#5a6577]">
              Strengths
            </h2>
            {analysis.strengths.length === 0 ? (
              <p className="text-sm text-[#5a6577]">Not enough attempted questions yet.</p>
            ) : (
              <ul className="list-disc space-y-1 pl-5 text-sm">
                {analysis.strengths.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
            )}
          </div>
          <div className="border border-[#c5ccd6] bg-white p-5">
            <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-[#5a6577]">
              Weaknesses
            </h2>
            {analysis.weaknesses.length === 0 ? (
              <p className="text-sm text-[#5a6577]">No clear weak topics from this attempt.</p>
            ) : (
              <ul className="list-disc space-y-1 pl-5 text-sm">
                {analysis.weaknesses.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
            )}
          </div>
        </section>

        <section className="border border-[#c5ccd6] bg-white p-5">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-[#5a6577]">
            Question review
          </h2>
          <div className="space-y-4">
            {props.review.map((q) => {
              const ok = q.selected === q.correctOption;
              const status = !q.selected ? "Unattempted" : ok ? "Correct" : "Wrong";
              return (
                <div key={q.id} className="border-b border-[#e2e6eb] pb-4 last:border-0">
                  <div className="mb-1 flex flex-wrap items-center gap-2 text-xs text-[#5a6577]">
                    <span className="font-medium text-[#1a1f2b]">Q{q.qIndex}</span>
                    <span>{q.subject}</span>
                    <span>· {q.topic}</span>
                    <span
                      className={
                        status === "Correct"
                          ? "text-emerald-700"
                          : status === "Wrong"
                            ? "text-red-700"
                            : ""
                      }
                    >
                      · {status}
                    </span>
                    <span>· {Math.round(q.timeSpentMs / 1000)}s</span>
                  </div>
                  <p className="mb-2 text-sm">{q.stemEn}</p>
                  <p className="text-sm">
                    Your answer:{" "}
                    {q.selected
                      ? `(${q.selected}) ${optText(q, q.selected)}`
                      : "—"}
                  </p>
                  <p className="text-sm">
                    Correct: ({q.correctOption}) {optText(q, q.correctOption)}
                  </p>
                  {q.explanation && (
                    <div className="mt-2 border-l-2 border-[#1e3a5f] pl-3">
                      <div className="text-[11px] uppercase tracking-wide text-[#5a6577]">
                        Notes & solution (this question)
                      </div>
                      <p className="whitespace-pre-line text-sm leading-relaxed text-[#1a1f2b]">
                        {q.explanation}
                      </p>
                    </div>
                  )}
                  {q.trick && (
                    <div className="mt-2 border-l-2 border-[#c45c26] bg-[#fff8f4] py-2 pl-3 pr-2">
                      <div className="text-[11px] uppercase tracking-wide text-[#c45c26]">
                        Exam trick (this question only)
                      </div>
                      <p className="mt-1 whitespace-pre-line text-sm leading-relaxed text-[#1a1f2b]">
                        <LinkifiedText text={q.trick} />
                      </p>
                      {q.trick.includes("https://") && (
                        <p className="mt-2 text-xs text-[#5a6577]">
                          Tip: open the YouTube link above, or revise all patterns at{" "}
                          <a href="/revise" className="font-medium text-[#1e3a5f] underline">
                            Formulas &amp; Tricks
                          </a>
                          .
                        </p>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-xs uppercase tracking-wide text-[#5a6577]">{label}</div>
      <div className="mt-1 text-xl font-medium text-[#1e3a5f]">{value}</div>
    </div>
  );
}
