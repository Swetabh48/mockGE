"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { EPFO_SECTIONS } from "@/lib/epfo/sections";
import { fetchIndex, listAttempts, type EpfoAttempt } from "@/lib/epfo/storage";
import { EPFO_EXAM, type Band, type EpfoPaperMeta } from "@/lib/epfo/types";
import { MailButton } from "./MailButton";

const BANDS: { band: Band; label: string; blurb: string; tone: string }[] = [
  { band: "easy", label: "Easy", blurb: "Concept check · direct questions", tone: "border-emerald-600 text-emerald-800" },
  { band: "medium", label: "Medium", blurb: "Exam level · statements & matching", tone: "border-amber-500 text-amber-900" },
  { band: "hard", label: "Hard", blurb: "Above exam level · multi-step & tricky", tone: "border-red-600 text-red-800" },
];

export function EpfoHome() {
  const [papers, setPapers] = useState<EpfoPaperMeta[]>([]);
  const [attempts, setAttempts] = useState<EpfoAttempt[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let alive = true;
    void fetchIndex().then((p) => {
      if (!alive) return;
      setPapers(p);
      setAttempts(listAttempts());
      setLoaded(true);
    });
    return () => {
      alive = false;
    };
  }, []);

  const best = useMemo(() => {
    const m = new Map<string, EpfoAttempt>();
    for (const a of attempts) {
      const b = m.get(a.paperId);
      if (!b || a.score > b.score) m.set(a.paperId, a);
    }
    return m;
  }, [attempts]);

  return (
    <div className="space-y-6">
      <section className="grid gap-4 border border-[#c5ccd6] bg-white p-5 lg:grid-cols-[1.3fr_1fr]">
        <div>
          <h2 className="font-display text-2xl text-[#1e3a5f]">EPFO APFC mock tests</h2>
          <p className="mt-1 text-sm leading-relaxed text-[#3a4556]">
            40 original full-length papers for the UPSC recruitment test of Assistant Provident Fund Commissioner, including 10 hard papers modelled on the 30 November 2025 exam. Every question is written fresh for mockGE — no question repeats across papers — and each comes with a detailed solution.
          </p>
          <div className="mt-3 flex flex-wrap gap-2 text-xs">
            {[
              `${EPFO_EXAM.questions} MCQs`,
              "2 hours",
              `${EPFO_EXAM.maxMarks} marks`,
              "−⅓ negative marking",
              "Offline OMR or online",
              "Labour Codes 2025 updated",
            ].map((c) => (
              <span key={c} className="border border-[#c5ccd6] px-2 py-1 text-[#3a4556]">
                {c}
              </span>
            ))}
          </div>
        </div>
        <div className="text-sm">
          <div className="mb-1 flex items-baseline justify-between text-xs font-semibold uppercase tracking-wide text-[#5a6577]">
            <span>Questions per paper</span>
            <span className="flex gap-3 normal-case">
              <span>Papers 1–30</span>
              <span className="text-red-800">2025 pattern</span>
            </span>
          </div>
          <div>
            {EPFO_SECTIONS.map((s) => (
              <div key={s.key} className="flex justify-between gap-2 border-b border-[#eef1f4] py-0.5">
                <span className="truncate">{s.label}</span>
                <span className="flex shrink-0 gap-3 tabular-nums text-[#5a6577]">
                  <span className="w-[4.5rem] text-right">{s.count}</span>
                  <span className="w-[5.5rem] text-right text-red-800">
                    {s.y25[1]}–{s.y25[2]}
                  </span>
                </span>
              </div>
            ))}
          </div>
          <p className="mt-1 text-xs text-[#8a93a3]">2025-pattern papers vary the section mix from paper to paper, as the real exam does; total is always 120.</p>
        </div>
      </section>

      {!loaded && <p className="text-sm text-[#5a6577]">Loading papers…</p>}
      {loaded && papers.length === 0 && (
        <p className="border border-[#c5ccd6] bg-white p-4 text-sm text-[#5a6577]">
          Papers are not built yet. Run <code>npm run epfo:build</code>.
        </p>
      )}

      <div className="grid gap-5 lg:grid-cols-3">
        {BANDS.map((b) => (
          <section key={b.band} className="border border-[#c5ccd6] bg-white">
            <div className={`border-t-4 ${b.tone} px-4 py-3`}>
              <h3 className="font-display text-xl">{b.label}</h3>
              <p className="text-xs text-[#5a6577]">{b.blurb}</p>
            </div>
            <PaperList papers={papers.filter((p) => p.band === b.band && !p.pattern)} best={best} />
            {papers.some((p) => p.band === b.band && p.pattern === "2025") && (
              <>
                <div className="border-t-2 border-red-600 bg-[#fbf4f4] px-4 py-2.5">
                  <div className="flex items-center gap-2">
                    <h4 className="font-display text-lg text-red-800">2025 pattern</h4>
                    <span className="border border-red-700 px-1.5 text-[10px] font-semibold uppercase tracking-wide text-red-800">New</span>
                  </div>
                  <p className="text-xs text-[#5a6577]">
                    Modelled on the 30 Nov 2025 paper: statement, assertion–reason, match and case-based questions, two reading passages, and a section mix that changes from paper to paper.
                  </p>
                </div>
                <PaperList papers={papers.filter((p) => p.band === b.band && p.pattern === "2025")} best={best} />
              </>
            )}
          </section>
        ))}
      </div>

      <section>
        <h3 className="font-display mb-2 text-xl text-[#1e3a5f]">Your EPFO attempts</h3>
        {attempts.length === 0 ? (
          <p className="text-sm text-[#5a6577]">No attempts on this device yet. Results are stored in this browser.</p>
        ) : (
          <div className="overflow-x-auto border border-[#c5ccd6] bg-white">
            <table className="w-full min-w-[520px] text-left text-sm">
              <thead className="border-b border-[#e2e6eb] bg-[#f7f8fa] text-xs uppercase text-[#5a6577]">
                <tr>
                  <th className="px-4 py-2">Paper</th>
                  <th className="px-4 py-2">Mode</th>
                  <th className="px-4 py-2">Score</th>
                  <th className="px-4 py-2">Date</th>
                  <th className="px-4 py-2" />
                </tr>
              </thead>
              <tbody>
                {attempts.slice(0, 15).map((a) => (
                  <tr key={a.id} className="border-b border-[#e2e6eb] last:border-0">
                    <td className="px-4 py-2">{a.paperTitle}</td>
                    <td className="px-4 py-2 capitalize">{a.mode}</td>
                    <td className="px-4 py-2 tabular-nums">
                      {a.score} / {a.maxScore}
                    </td>
                    <td className="px-4 py-2 text-[#5a6577]">{new Date(a.submittedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</td>
                    <td className="px-4 py-2 text-right">
                      <Link href={`/epfo/${a.paperId}?attempt=${a.id}`} className="inline-flex min-h-[40px] items-center text-[#1e3a5f] underline">
                        Result
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#c5ccd6] pt-4">
        <p className="text-xs text-[#8a93a3]">Original practice material by mockGE — not affiliated with UPSC or EPFO.</p>
        <MailButton />
      </div>
    </div>
  );
}

function PaperList({ papers, best }: { papers: EpfoPaperMeta[]; best: Map<string, EpfoAttempt> }) {
  return (
    <ul className="divide-y divide-[#e2e6eb]">
      {papers.map((p) => {
        const a = best.get(p.id);
        return (
          <li key={p.id} className="flex items-center justify-between gap-3 px-4 py-2.5">
            <div className="min-w-0">
              <div className="truncate text-sm font-medium">{p.pattern ? p.title.replace(/ · 2025 pattern$/, "") : p.title}</div>
              <div className="text-xs text-[#5a6577]">
                {p.questionCount} Q · 2 h{p.pattern ? " · 2025 pattern" : ""}
                {a ? ` · best ${a.score}/${a.maxScore}` : ""}
              </div>
            </div>
            <Link href={`/epfo/${p.id}`} className="inline-flex min-h-[44px] shrink-0 items-center bg-[#1e3a5f] px-4 text-sm text-white hover:bg-[#152a45]">
              {a ? "Retake" : "Start"}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
