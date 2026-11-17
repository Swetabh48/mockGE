"use client";

import { OPTION_LETTERS, type EpfoPaper } from "@/lib/epfo/types";

/** Read-only question booklet (no answers) for the offline mode. */
export function PaperReader({ paper }: { paper: EpfoPaper }) {
  return (
    <ol className="divide-y divide-[#e2e6eb] border border-[#c5ccd6] bg-white">
      {paper.questions.map((q, i) => {
        const prev = paper.questions[i - 1];
        const showPassage = q.p && (!prev || prev.p !== q.p);
        return (
          <li key={q.n} className="p-4 sm:p-5">
            {showPassage && (
              <div className="mb-4 border-l-4 border-[#1e3a5f] bg-[#f4f6f9] p-3 text-[15px] leading-relaxed">
                <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-[#5a6577]">
                  Directions: read the passage and answer the questions that follow
                </div>
                <p className="whitespace-pre-line">{q.p}</p>
              </div>
            )}
            <p className="whitespace-pre-line text-[15px] leading-relaxed">
              <span className="mr-2 font-semibold">{q.n}.</span>
              {q.q}
            </p>
            <ul className="mt-2 grid gap-1.5 sm:grid-cols-2">
              {q.o.map((o, i) => (
                <li key={i} className="flex gap-2 text-[15px]">
                  <span className="font-medium">({OPTION_LETTERS[i]})</span>
                  <span className="whitespace-pre-line">{o}</span>
                </li>
              ))}
            </ul>
          </li>
        );
      })}
    </ol>
  );
}
