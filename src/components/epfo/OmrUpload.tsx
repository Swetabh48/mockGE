"use client";

import { useRef, useState } from "react";
import { readOmrImage, type OmrResult } from "@/lib/epfo/omrReader";
import { MULTI, type Mark } from "@/lib/epfo/scoring";
import { OPTION_LETTERS, type EpfoPaper } from "@/lib/epfo/types";

type Props = {
  paper: EpfoPaper;
  onScore: (marks: Mark[]) => void;
  onReviewOnly: () => void;
  onBack: () => void;
};

export function OmrUpload({ paper, onScore, onReviewOnly, onBack }: Props) {
  const n = paper.questions.length;
  const [busy, setBusy] = useState(false);
  const [res, setRes] = useState<OmrResult | null>(null);
  const [marks, setMarks] = useState<Mark[] | null>(null);
  const [manual, setManual] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  async function onFile(f: File | undefined) {
    if (!f) return;
    setError(null);
    if (!f.type.startsWith("image/") && !/\.(jpe?g|png|webp|heic|heif)$/i.test(f.name)) {
      setError("Please upload a photo or scan saved as an image (JPG / PNG). If you scanned to PDF, take a screenshot or export the page as an image.");
      return;
    }
    setBusy(true);
    try {
      // yield to paint the spinner on slower iPads
      await new Promise((r) => setTimeout(r, 30));
      const out = await readOmrImage(f, n);
      setRes(out);
      setMarks(out.ok ? out.marks : null);
      if (!out.ok) setError(out.message);
    } catch (e) {
      setError(e instanceof Error ? `Could not read the image: ${e.message}` : "Could not read the image.");
    } finally {
      setBusy(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  const editing = marks !== null;
  const answered = marks ? marks.filter((m) => m !== null).length : 0;
  const uncertain = new Set(res?.ok ? res.uncertain : []);

  function setMark(q: number, o: number) {
    setMarks((prev) => {
      const next = [...(prev ?? Array(n).fill(null))];
      next[q] = next[q] === o ? null : o;
      return next;
    });
  }

  return (
    <div className="mx-auto max-w-5xl space-y-5 px-4 py-6 sm:px-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-2xl text-[#1e3a5f]">Upload your OMR sheet</h2>
          <p className="text-sm text-[#5a6577]">Photograph the filled mockGE OMR sheet (or scan it to an image). Everything is processed on this device — nothing is uploaded to a server.</p>
        </div>
        <button type="button" onClick={onBack} className="min-h-[44px] border border-[#c5ccd6] bg-white px-4 text-sm">
          Back
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-[1fr_1fr]">
        <div className="space-y-3 border border-[#c5ccd6] bg-white p-4">
          <label className="flex min-h-[120px] cursor-pointer flex-col items-center justify-center gap-2 border-2 border-dashed border-[#9aa6b5] bg-[#f7f8fa] p-4 text-center active:bg-[#eef1f4]">
            <span className="text-base font-medium text-[#1e3a5f]">{busy ? "Reading the sheet…" : "Tap to take a photo or choose an image"}</span>
            <span className="text-xs text-[#5a6577]">JPG / PNG · whole sheet visible · all 4 corner squares in frame</span>
            <input ref={fileRef} type="file" accept="image/*" className="sr-only" disabled={busy} onChange={(e) => void onFile(e.target.files?.[0])} />
          </label>
          <ul className="list-disc space-y-1 pl-5 text-xs text-[#5a6577]">
            <li>Lay the sheet flat on a plain, darker surface in even light; avoid shadows across the bubbles.</li>
            <li>Hold the camera straight above the sheet. Slight tilt is fine — the corner squares correct it.</li>
            <li>After reading, check every answer below. Tap a bubble to correct a mistake before scoring.</li>
          </ul>
          <div className="flex flex-wrap gap-2 pt-1">
            <button
              type="button"
              onClick={() => {
                setManual(true);
                setMarks((m) => m ?? Array(n).fill(null));
              }}
              className="min-h-[44px] border border-[#1e3a5f] px-4 text-sm text-[#1e3a5f]"
            >
              Enter answers manually
            </button>
            <button type="button" onClick={onReviewOnly} className="min-h-[44px] border border-[#c5ccd6] px-4 text-sm">
              Skip — just review solutions
            </button>
          </div>
          {error && <p className="border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">{error}</p>}
          {res?.ok && <p className="border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-900">{res.message}</p>}
        </div>
        <div className="border border-[#c5ccd6] bg-white p-2">
          {res ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={res.preview} alt="Detected OMR sheet" className="mx-auto max-h-[520px] w-auto" />
          ) : (
            <div className="flex h-full min-h-[200px] items-center justify-center p-6 text-center text-sm text-[#8a93a3]">
              The photo with detected bubbles (green = read, amber = please check, red = multiple marks) will appear here.
            </div>
          )}
        </div>
      </div>

      {editing && (
        <section className="border border-[#c5ccd6] bg-white">
          <div className="sticky top-0 z-10 flex flex-wrap items-center justify-between gap-2 border-b border-[#e2e6eb] bg-white/95 p-3 backdrop-blur">
            <div className="text-sm">
              <b>{answered}</b> of {n} answered {manual && !res?.ok ? "(manual entry)" : ""}
              {uncertain.size > 0 && <span className="ml-2 text-amber-700">· {uncertain.size} to check</span>}
            </div>
            <button
              type="button"
              onClick={() => marks && onScore(marks)}
              className="min-h-[44px] bg-[#c45c26] px-5 text-sm font-medium text-white"
            >
              Score my sheet
            </button>
          </div>
          <div className="grid gap-x-6 gap-y-1 p-3 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: n }, (_, q) => (
              <div key={q} className={`flex items-center gap-2 py-1 ${uncertain.has(q) ? "bg-amber-50" : ""}`}>
                <span className="w-8 text-right text-sm font-medium tabular-nums">{q + 1}</span>
                {[0, 1, 2, 3].map((o) => {
                  const m = marks![q];
                  const on = m === o;
                  return (
                    <button
                      key={o}
                      type="button"
                      onClick={() => setMark(q, o)}
                      aria-label={`Question ${q + 1} option ${OPTION_LETTERS[o]}`}
                      className={`flex h-10 w-10 items-center justify-center rounded-full border text-sm ${
                        on ? "border-[#1a1f2b] bg-[#1a1f2b] text-white" : m === MULTI ? "border-red-500 text-red-700" : "border-[#9aa6b5] text-[#5a6577]"
                      }`}
                    >
                      {OPTION_LETTERS[o]}
                    </button>
                  );
                })}
                {marks![q] === MULTI && <span className="text-[10px] font-medium text-red-700">multi</span>}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
