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
            30 original full-length papers for the UPSC recruitment test of Assistant Provident Fund Commissioner. Every question is written fresh for mockGE — no question repeats across papers — and each comes with a detailed solution.
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
          <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-[#5a6577]">Questions per paper</div>
          <div className="grid grid-cols-2 gap-x-4">
            {EPFO_SECTIONS.map((s) => (
              <div key={s.key} className="flex justify-between border-b border-[#eef1f4] py-0.5">
                <span className="truncate pr-2">{s.short}</span>
                <span className="tabular-nums text-[#5a6577]">{s.count}</span>
              </div>
            ))}
          </div>
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
            <ul className="divide-y divide-[#e2e6eb]">
              {papers
                .filter((p) => p.band === b.band)
                .map((p) => {
                  const a = best.get(p.id);
                  return (
                    <li key={p.id} className="flex items-center justify-between gap-3 px-4 py-2.5">
                      <div className="min-w-0">
                        <div className="truncate text-sm font-medium">{p.title}</div>
                        <div className="text-xs text-[#5a6577]">
                          {p.questionCount} Q · 2 h{a ? ` · best ${a.score}/${a.maxScore}` : ""}
                        </div>
                      </div>
                      <Link href={`/epfo/${p.id}`} className="inline-flex min-h-[44px] shrink-0 items-center bg-[#1e3a5f] px-4 text-sm text-white hover:bg-[#152a45]">
                        {a ? "Retake" : "Start"}
                      </Link>
                    </li>
                  );
                })}
            </ul>
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
