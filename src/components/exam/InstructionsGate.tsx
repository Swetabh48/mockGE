"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { ExamBlueprint } from "@/lib/exam/blueprints";

type Props = {
  paperId: string;
  paperTitle: string;
  blueprint: ExamBlueprint;
};

export function InstructionsGate({ paperId, paperTitle, blueprint }: Props) {
  const router = useRouter();
  const [checked, setChecked] = useState(false);
  const [starting, setStarting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function startExam() {
    if (!checked || starting) return;
    setStarting(true);
    setError(null);
    try {
      const res = await fetch("/api/attempts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paperId, action: "start" }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not start");
      router.push(`/exam/${paperId}/live?attemptId=${data.attemptId}`);
    } catch (e) {
      setStarting(false);
      setError(e instanceof Error ? e.message : "Could not start examination");
    }
  }

  return (
    <div className="min-h-screen bg-[#eef1f4] text-[#1a1f2b]">
      <header className="border-b border-[#c5ccd6] bg-[#1e3a5f] px-6 py-4 text-white">
        <div className="mx-auto max-w-3xl">
          <div className="font-display text-xl">mockGE</div>
          <div className="mt-1 text-sm text-slate-200">Instructions</div>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-8">
        <h1 className="font-display text-2xl text-[#1e3a5f]">{blueprint.title}</h1>
        <p className="mt-1 text-sm text-[#5a6577]">{paperTitle}</p>

        <section className="mt-6 border border-[#c5ccd6] bg-white p-5">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-[#5a6577]">
            Please read carefully
          </h2>
          <ol className="list-decimal space-y-2 pl-5 text-sm leading-relaxed">
            {blueprint.instructions.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ol>
        </section>

        <section className="mt-4 border border-[#c5ccd6] bg-white p-5 text-sm">
          <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-[#5a6577]">
            Summary
          </h2>
          <ul className="space-y-1 text-[#3a4556]">
            <li>Total questions: {blueprint.totalQuestions}</li>
            <li>Maximum marks: {blueprint.maxScore}</li>
            {blueprint.untimed ? (
              <li>Time limit: none (book-style practice)</li>
            ) : (
              <li>
                Timed sections:{" "}
                {blueprint.timerGroups.map((g) => `${g.label}`).join("; ")}
              </li>
            )}
            {blueprint.hasDest && (
              <li>
                DEST: {blueprint.destDurationSeconds / 60} minutes, target{" "}
                {blueprint.destTargetKeystrokes} key depressions (practice pass accuracy{" "}
                {blueprint.destPassAccuracy}%)
              </li>
            )}
          </ul>
        </section>

        <label className="mt-6 flex items-start gap-3 text-sm">
          <input
            type="checkbox"
            checked={checked}
            onChange={(e) => setChecked(e.target.checked)}
            className="mt-1"
          />
          <span>
            I have read and understood the instructions. I am ready to begin the examination
            in fullscreen mode.
          </span>
        </label>

        {error && <p className="mt-3 text-sm text-red-700">{error}</p>}

        <div className="mt-6 flex gap-3">
          <button
            type="button"
            onClick={() => router.push("/")}
            className="border border-[#c5ccd6] bg-white px-4 py-2 text-sm"
          >
            Back
          </button>
          <button
            type="button"
            disabled={!checked || starting}
            onClick={() => void startExam()}
            className="bg-[#1e3a5f] px-5 py-2 text-sm text-white disabled:opacity-40"
          >
            {starting ? "Starting..." : "Start Examination"}
          </button>
        </div>
      </main>
    </div>
  );
}
