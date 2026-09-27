"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { PRACTICE_SYLLABUS, type PracticeSubjectKey } from "@/lib/exam/taxonomy";
import { REVISION_NOTES, revisionsForSubject } from "@/lib/exam/revisionNotes";

export default function RevisePage() {
  const [subject, setSubject] = useState<PracticeSubjectKey>("quant");
  const [topicId, setTopicId] = useState<string | null>(null);

  const subjectMeta = PRACTICE_SYLLABUS.find((s) => s.key === subject)!;
  const notes = useMemo(() => {
    const all = revisionsForSubject(subject);
    if (!topicId) return all;
    return all.filter((n) => n.topicId === topicId);
  }, [subject, topicId]);

  return (
    <div className="min-h-screen bg-[#eef1f4] text-[#1a1f2b]">
      <header className="border-b border-[#c5ccd6] bg-[#1e3a5f] text-white">
        <div className="mx-auto flex max-w-6xl flex-wrap items-end justify-between gap-4 px-6 py-8">
          <div>
            <Link href="/" className="text-xs uppercase tracking-[0.2em] text-slate-300 hover:text-white">
              ← mockGE
            </Link>
            <h1 className="font-display mt-2 text-3xl sm:text-4xl">Formulas &amp; Tricks</h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-200">
              Every pattern has a real shortcut, a worked numerical example, and a YouTube reference —
              so you can revise without guessing what the trick means.
            </p>
          </div>
          <Link
            href="/"
            className="border border-white/40 px-3 py-1.5 text-sm hover:bg-white/10"
          >
            Back to Practice
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-6xl space-y-6 px-6 py-8">
        <nav className="flex flex-wrap gap-2 border-b border-[#c5ccd6] pb-3">
          {PRACTICE_SYLLABUS.map((s) => (
            <button
              key={s.key}
              type="button"
              onClick={() => {
                setSubject(s.key);
                setTopicId(null);
              }}
              className={`px-3 py-2 text-sm ${
                subject === s.key
                  ? "border-b-2 border-[#1e3a5f] font-medium text-[#1e3a5f]"
                  : "text-[#5a6577]"
              }`}
            >
              {s.title}
            </button>
          ))}
        </nav>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setTopicId(null)}
            className={`border px-3 py-1.5 text-xs ${
              topicId === null ? "border-[#1e3a5f] bg-[#1e3a5f] text-white" : "border-[#c5ccd6] bg-white"
            }`}
          >
            All topics
          </button>
          {subjectMeta.topics
            .filter((t) => REVISION_NOTES.some((n) => n.topicId === t.id && n.subjectKey === subject))
            .map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setTopicId(t.id)}
                className={`border px-3 py-1.5 text-xs ${
                  topicId === t.id
                    ? "border-[#c45c26] bg-[#c45c26] text-white"
                    : "border-[#c5ccd6] bg-white"
                }`}
              >
                {t.title}
              </button>
            ))}
        </div>

        {notes.length === 0 ? (
          <p className="text-sm text-[#5a6577]">
            Revision cards for this filter are being expanded. Pick Quant / Reasoning topics for the
            densest formula sheets.
          </p>
        ) : (
          <div className="space-y-8">
            {notes.map((note) => (
              <section key={note.topicId} className="border border-[#c5ccd6] bg-white">
                <div className="border-b border-[#e2e6eb] bg-[#f7f8fa] px-4 py-3">
                  <h2 className="font-display text-xl text-[#1e3a5f]">{note.topicTitle}</h2>
                  <p className="text-xs text-[#5a6577]">
                    {note.patterns.length} question pattern{note.patterns.length === 1 ? "" : "s"}
                  </p>
                </div>
                <ul className="divide-y divide-[#e2e6eb]">
                  {note.patterns.map((p) => (
                    <li key={p.pattern} className="space-y-4 px-4 py-5">
                      <div>
                        <div className="text-[11px] uppercase tracking-wide text-[#5a6577]">
                          Pattern type
                        </div>
                        <div className="font-medium text-[#1a1f2b]">{p.pattern}</div>
                      </div>
                      <div>
                        <div className="text-[11px] uppercase tracking-wide text-[#5a6577]">
                          Formula
                        </div>
                        <pre className="mt-1 whitespace-pre-wrap rounded bg-[#f7f8fa] px-3 py-2 font-mono text-sm text-[#1e3a5f]">
                          {p.formula}
                        </pre>
                      </div>
                      <div>
                        <div className="text-[11px] uppercase tracking-wide text-[#5a6577]">
                          How to use
                        </div>
                        <p className="text-sm leading-relaxed">{p.howToUse}</p>
                      </div>
                      <div className="border-l-2 border-[#c45c26] pl-3">
                        <div className="text-[11px] uppercase tracking-wide text-[#c45c26]">
                          Exam trick (what to do instead of long calc)
                        </div>
                        <p className="text-sm leading-relaxed">{p.examTip}</p>
                      </div>
                      <div className="rounded border border-[#e2e6eb] bg-[#fbfcfd] px-3 py-3">
                        <div className="text-[11px] uppercase tracking-wide text-[#5a6577]">
                          Worked example
                        </div>
                        <p className="mt-1 whitespace-pre-line text-sm leading-relaxed text-[#1a1f2b]">
                          {p.workedExample}
                        </p>
                      </div>
                      {p.video && (
                        <div>
                          <div className="text-[11px] uppercase tracking-wide text-[#5a6577]">
                            Video reference
                          </div>
                          <a
                            href={p.video.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-1 inline-block text-sm font-medium text-[#1e3a5f] underline underline-offset-2 hover:text-[#c45c26]"
                          >
                            {p.video.title}
                            {p.video.channel ? ` · ${p.video.channel}` : ""} →
                          </a>
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
