"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { TIER2_BLUEPRINT } from "@/lib/exam/blueprints";

type Props = {
  paperId: string;
  attemptId: string;
  passage: string;
};

export function DestTest({ paperId, attemptId, passage }: Props) {
  const router = useRouter();
  const duration = TIER2_BLUEPRINT.destDurationSeconds;
  const target = TIER2_BLUEPRINT.destTargetKeystrokes;
  const passAccuracy = TIER2_BLUEPRINT.destPassAccuracy;

  const [secondsLeft, setSecondsLeft] = useState(duration);
  const [typed, setTyped] = useState("");
  const [started, setStarted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    document.documentElement.requestFullscreen?.().catch(() => undefined);
  }, []);

  useEffect(() => {
    if (!started) return;
    const id = window.setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          window.clearInterval(id);
          void finish();
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => window.clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [started]);

  const stats = useMemo(() => {
    const keystrokes = typed.length;
    let correct = 0;
    const len = Math.min(typed.length, passage.length);
    for (let i = 0; i < len; i++) {
      if (typed[i] === passage[i]) correct += 1;
    }
    const accuracy = typed.length === 0 ? 100 : Math.round((correct / typed.length) * 1000) / 10;
    const elapsedMin = Math.max((duration - secondsLeft) / 60, 1 / 60);
    const wpm = Math.round(typed.trim().split(/\s+/).filter(Boolean).length / elapsedMin);
    const qualified = keystrokes >= target * 0.9 && accuracy >= passAccuracy;
    return { keystrokes, accuracy, wpm, qualified };
  }, [typed, passage, duration, secondsLeft, target, passAccuracy]);

  async function finish() {
    if (submitting) return;
    setSubmitting(true);
    await fetch("/api/attempts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        paperId,
        attemptId,
        action: "dest",
        dest: {
          keystrokes: stats.keystrokes,
          accuracy: stats.accuracy,
          qualified: stats.qualified,
        },
      }),
    });
    router.push(`/report/${attemptId}`);
  }

  const m = Math.floor(secondsLeft / 60);
  const s = secondsLeft % 60;

  return (
    <div className="flex h-screen flex-col bg-[#eef1f4] text-[#1a1f2b]">
      <header className="flex items-center justify-between border-b border-[#c5ccd6] bg-[#1e3a5f] px-4 py-2 text-white">
        <div>
          <div className="font-display text-lg">mockGE</div>
          <div className="text-xs text-slate-200">Session-II · Data Entry Speed Test (DEST)</div>
        </div>
        <div className="font-mono text-2xl tabular-nums">
          {String(m).padStart(2, "0")}:{String(s).padStart(2, "0")}
        </div>
        <button
          type="button"
          disabled={submitting || !started}
          onClick={() => void finish()}
          className="bg-[#c45c26] px-4 py-1.5 text-sm disabled:opacity-50"
        >
          {submitting ? "Saving..." : "Submit DEST"}
        </button>
      </header>

      <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-4 p-4">
        <div className="border border-[#c5ccd6] bg-white p-4 text-sm leading-relaxed">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[#5a6577]">
            Passage (type exactly)
          </p>
          <p className="whitespace-pre-wrap">{passage}</p>
        </div>

        {!started ? (
          <div className="border border-[#c5ccd6] bg-white p-4 text-sm">
            <p>
              Target: approximately {target} key depressions in {duration / 60} minutes.
              Practice qualifying standard: at least 90% of target keystrokes with accuracy
              of {passAccuracy}% or above.
            </p>
            <button
              type="button"
              className="mt-4 bg-[#1e3a5f] px-4 py-2 text-white"
              onClick={() => setStarted(true)}
            >
              Begin DEST
            </button>
          </div>
        ) : (
          <>
            <textarea
              className="min-h-[180px] flex-1 border border-[#c5ccd6] bg-white p-3 font-mono text-sm outline-none focus:border-[#1e3a5f]"
              value={typed}
              onChange={(e) => setTyped(e.target.value)}
              spellCheck={false}
              autoFocus
              placeholder="Start typing the passage here..."
            />
            <div className="grid grid-cols-4 gap-3 border border-[#c5ccd6] bg-white p-3 text-center text-sm">
              <div>
                <div className="text-xs text-[#5a6577]">Keystrokes</div>
                <div className="font-medium">
                  {stats.keystrokes} / {target}
                </div>
              </div>
              <div>
                <div className="text-xs text-[#5a6577]">Accuracy</div>
                <div className="font-medium">{stats.accuracy}%</div>
              </div>
              <div>
                <div className="text-xs text-[#5a6577]">WPM</div>
                <div className="font-medium">{stats.wpm}</div>
              </div>
              <div>
                <div className="text-xs text-[#5a6577]">Practice status</div>
                <div className="font-medium">
                  {stats.qualified ? "Qualifying pace" : "Below target"}
                </div>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
