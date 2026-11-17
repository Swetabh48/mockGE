"use client";

import { useMemo, useState } from "react";
import { downloadReport } from "@/lib/epfo/pdf";
import { MULTI, type Evaluation, type Mark } from "@/lib/epfo/scoring";
import { EPFO_SECTIONS, SECTION_BY_KEY } from "@/lib/epfo/sections";
import { OPTION_LETTERS, type EpfoPaper, type SectionKey } from "@/lib/epfo/types";

type Filter = "all" | "wrong" | "skipped" | "correct";

type Props = {
  paper: EpfoPaper;
  /** null → review-only (solutions without a score) */
  marks: Mark[] | null;
  evaluation: Evaluation | null;
  mode?: "online" | "offline";
  date?: string;
  usedSec?: number;
  onBack: () => void;
  onUploadInstead?: () => void;
};

export function EpfoResult({ paper, marks, evaluation: ev, mode, date, usedSec, onBack, onUploadInstead }: Props) {
  const [filter, setFilter] = useState<Filter>("all");
  const [sec, setSec] = useState<SectionKey | "all">("all");
  const [busy, setBusy] = useState(false);

  const list = useMemo(
    () =>
      paper.questions
        .map((q, i) => ({ q, i, m: marks ? marks[i] ?? null : undefined }))
        .filter(({ q, m }) => {
          if (sec !== "all" && q.sec !== sec) return false;
          if (!marks || filter === "all") return true;
          if (filter === "skipped") return m === null;
          if (filter === "correct") return m === q.a;
          return m !== null && m !== q.a;
        }),
    [paper, marks, filter, sec],
  );

  async function pdf() {
    setBusy(true);
    try {
      await downloadReport(paper, marks, ev, mode && date ? { mode, date } : undefined);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-[100dvh] bg-[#eef1f4] text-[#1a1f2b]">
      <header className="border-b border-[#c5ccd6] bg-[#1e3a5f] text-white">
        <div className="mx-auto flex max-w-5xl flex-wrap items-end justify-between gap-3 px-4 py-5 sm:px-6">
          <div>
            <div className="text-xs uppercase tracking-[0.2em] text-slate-300">EPFO APFC · {ev ? "Result" : "Solutions"}</div>
            <h1 className="font-display mt-1 text-2xl sm:text-3xl">{paper.title}</h1>
            {date && <div className="mt-1 text-xs text-slate-300">{mode === "online" ? "Online test" : "Offline (OMR)"} · {date}</div>}
          </div>
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={pdf} disabled={busy} className="min-h-[44px] bg-[#c45c26] px-4 text-sm font-medium hover:bg-[#a84c1f] disabled:opacity-60">
              {busy ? "Preparing PDF…" : ev ? "Download result PDF" : "Download solutions PDF"}
            </button>
            <button type="button" onClick={onBack} className="min-h-[44px] border border-white/40 px-4 text-sm hover:bg-white/10">
              Back
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl space-y-6 px-4 py-6 sm:px-6">
        {!ev && onUploadInstead && (
          <div className="flex flex-wrap items-center justify-between gap-3 border border-[#c5ccd6] bg-white px-4 py-3 text-sm">
            <span>Reviewing solutions without a score. Want your marks and weak areas?</span>
            <button type="button" onClick={onUploadInstead} className="min-h-[44px] border border-[#1e3a5f] px-4 text-[#1e3a5f]">
              Upload OMR sheet
            </button>
          </div>
        )}

        {ev && (
          <>
            <section className="grid grid-cols-2 gap-px border border-[#c5ccd6] bg-[#c5ccd6] sm:grid-cols-3 lg:grid-cols-6">
              <Stat big label="Score" value={`${ev.score}`} sub={`of ${ev.maxScore}`} />
              <Stat label="Correct" value={String(ev.correct)} sub={`+${ev.correct * paper.marksPerQ}`} tone="text-emerald-700" />
              <Stat label="Wrong" value={String(ev.wrong)} sub={`−${ev.negLost}`} tone="text-red-700" />
              <Stat label="Unattempted" value={String(ev.unattempted)} />
              <Stat label="Accuracy" value={`${ev.accuracy}%`} sub={`${ev.attempted} attempted`} />
              <Stat label="Time used" value={usedSec != null ? `${Math.floor(usedSec / 60)}m` : "—"} sub={usedSec != null ? `of ${paper.durationMin}m` : mode === "offline" ? "offline" : ""} />
            </section>

            <section className="border border-[#c5ccd6] bg-white p-4 sm:p-5">
              <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-[#5a6577]">Section-wise performance</h2>
              <div className="space-y-3">
                {ev.sections.map((s) => {
                  const pct = Math.max(0, (s.score / s.max) * 100);
                  return (
                    <div key={s.key}>
                      <div className="flex flex-wrap justify-between gap-2 text-sm">
                        <span className="font-medium">{s.label}</span>
                        <span className="text-[#5a6577]">
                          {s.correct}✓ · {s.wrong}✗ · {s.unattempted} skipped · <b className="text-[#1a1f2b]">{s.score}</b>/{s.max}
                          {s.timeSec !== undefined ? ` · ${Math.round(s.timeSec / 60)} min` : ""}
                        </span>
                      </div>
                      <div className="mt-1 h-3 w-full bg-[#e8ebef]">
                        <div className={`h-3 ${pct >= 60 ? "bg-emerald-700" : pct >= 35 ? "bg-amber-500" : "bg-red-700"}`} style={{ width: `${Math.min(100, pct)}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            <section className="grid gap-4 md:grid-cols-3">
              <div className="border border-[#c5ccd6] bg-white p-4 sm:p-5 md:col-span-2">
                <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-[#c45c26]">Where you need to improve</h2>
                <ol className="space-y-3">
                  {ev.improvements.map((imp, i) => (
                    <li key={i} className="border-l-2 border-[#c45c26] pl-3">
                      <div className="text-sm font-medium">{imp.title}</div>
                      <p className="mt-0.5 text-sm leading-relaxed text-[#3a4556]">{imp.detail}</p>
                    </li>
                  ))}
                </ol>
              </div>
              <div className="border border-[#c5ccd6] bg-white p-4 sm:p-5">
                <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-emerald-800">Strengths</h2>
                {ev.strengths.length ? (
                  <ul className="list-disc space-y-1.5 pl-5 text-sm">
                    {ev.strengths.map((s) => (
                      <li key={s}>{s}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-[#5a6577]">No section crossed 75% accuracy with enough attempts yet.</p>
                )}
              </div>
            </section>
          </>
        )}

        <section className="border border-[#c5ccd6] bg-white">
          <div className="sticky top-0 z-10 flex flex-wrap items-center gap-2 border-b border-[#e2e6eb] bg-white/95 p-3 backdrop-blur">
            <h2 className="mr-auto text-sm font-semibold uppercase tracking-wide text-[#5a6577]">Questions & solutions ({list.length})</h2>
            {marks && (
              <div className="flex flex-wrap gap-1">
                {(["all", "wrong", "skipped", "correct"] as Filter[]).map((f) => (
                  <button
                    key={f}
                    type="button"
                    onClick={() => setFilter(f)}
                    className={`min-h-[40px] border px-3 text-sm capitalize ${filter === f ? "border-[#1e3a5f] bg-[#1e3a5f] text-white" : "border-[#c5ccd6] bg-white"}`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            )}
            <select
              value={sec}
              onChange={(e) => setSec(e.target.value as SectionKey | "all")}
              className="min-h-[40px] border border-[#c5ccd6] bg-white px-2 text-sm"
              aria-label="Filter by section"
            >
              <option value="all">All sections</option>
              {EPFO_SECTIONS.map((s) => (
                <option key={s.key} value={s.key}>
                  {s.short}
                </option>
              ))}
            </select>
          </div>
          <ol className="divide-y divide-[#e2e6eb]">
            {list.map(({ q, i, m }) => {
              const status = m === undefined ? null : m === null ? "Not attempted" : m === q.a ? "Correct" : m === MULTI ? "Multiple marked" : "Wrong";
              const prev = paper.questions[i - 1];
              const showPassage = q.p && (!prev || prev.p !== q.p || list[0]?.i === i);
              return (
                <li key={q.n} className="p-4 sm:p-5">
                  <div className="mb-2 flex flex-wrap items-center gap-2 text-xs text-[#5a6577]">
                    <span className="font-semibold text-[#1a1f2b]">Q{q.n}</span>
                    <span>{SECTION_BY_KEY[q.sec].short}</span>
                    <span>· {q.topic}</span>
                    {status && (
                      <span
                        className={`ml-auto px-2 py-0.5 font-medium ${
                          status === "Correct" ? "bg-emerald-50 text-emerald-800" : status === "Not attempted" ? "bg-slate-100 text-slate-700" : "bg-red-50 text-red-800"
                        }`}
                      >
                        {status}
                      </span>
                    )}
                  </div>
                  {showPassage && (
                    <details className="mb-3 border border-[#e2e6eb] bg-[#f7f8fa] p-3 text-sm">
                      <summary className="cursor-pointer font-medium text-[#1e3a5f]">Passage</summary>
                      <p className="mt-2 whitespace-pre-line leading-relaxed">{q.p}</p>
                    </details>
                  )}
                  <p className="mb-3 whitespace-pre-line text-[15px] leading-relaxed">{q.q}</p>
                  <ul className="space-y-1.5">
                    {q.o.map((o, oi) => {
                      const isKey = oi === q.a;
                      const isMine = m === oi;
                      return (
                        <li
                          key={oi}
                          className={`flex gap-2 border px-3 py-2 text-sm ${
                            isKey ? "border-emerald-600 bg-emerald-50" : isMine ? "border-red-500 bg-red-50" : "border-[#e2e6eb]"
                          }`}
                        >
                          <span className="font-semibold">({OPTION_LETTERS[oi]})</span>
                          <span className="whitespace-pre-line">{o}</span>
                          {isKey && <span className="ml-auto shrink-0 text-xs font-medium text-emerald-800">Answer</span>}
                          {isMine && !isKey && <span className="ml-auto shrink-0 text-xs font-medium text-red-700">Your answer</span>}
                        </li>
                      );
                    })}
                  </ul>
                  <div className="mt-3 border-l-2 border-[#1e3a5f] bg-[#f6f8fb] py-2 pl-3 pr-2">
                    <div className="text-[11px] font-medium uppercase tracking-wide text-[#5a6577]">Solution</div>
                    <p className="mt-1 whitespace-pre-line text-sm leading-relaxed">{q.x}</p>
                  </div>
                </li>
              );
            })}
          </ol>
          {list.length === 0 && <p className="p-5 text-sm text-[#5a6577]">No questions match this filter.</p>}
        </section>
      </main>
    </div>
  );
}

function Stat({ label, value, sub, tone, big }: { label: string; value: string; sub?: string; tone?: string; big?: boolean }) {
  return (
    <div className="bg-white p-3 sm:p-4">
      <div className="text-[11px] uppercase tracking-wide text-[#5a6577]">{label}</div>
      <div className={`mt-1 font-medium ${big ? "text-3xl text-[#1e3a5f]" : "text-xl"} ${tone ?? ""}`}>{value}</div>
      {sub && <div className="text-xs text-[#8a93a3]">{sub}</div>}
    </div>
  );
}
