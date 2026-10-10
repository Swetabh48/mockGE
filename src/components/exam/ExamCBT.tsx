"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  getBlueprint,
  type ExamBlueprint,
  type ExamTier,
  type SectionKey,
} from "@/lib/exam/blueprints";

export type ExamQuestion = {
  id: string;
  qIndex: number;
  sectionKey: string;
  subject: string;
  topic: string;
  stemEn: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  marks: number;
  negativeMarks: number;
};

type AnswerState = {
  selected: string | null;
  markedReview: boolean;
  visited: boolean;
  timeSpentMs: number;
  changeCount: number;
};

type Props = {
  paperId: string;
  paperTitle: string;
  tier: ExamTier;
  focusSection?: SectionKey;
  mode?: string | null;
  exam?: string | null;
  iesPaper?: string | null;
  questions: ExamQuestion[];
  attemptId: string;
};

function formatTime(totalSeconds: number) {
  const s = Math.max(0, totalSeconds);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  if (h > 0) {
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
  }
  return `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
}

export function ExamCBT({
  paperId,
  paperTitle,
  tier,
  focusSection,
  mode,
  exam,
  iesPaper,
  questions,
  attemptId,
}: Props) {
  const router = useRouter();
  const blueprint = useMemo(
    () =>
      getBlueprint(tier, focusSection, {
        questionCount: questions.length,
        mode,
        title: paperTitle,
        exam,
        iesPaper,
      }),
    [tier, focusSection, mode, exam, iesPaper, questions.length, paperTitle],
  );
  const untimed = Boolean(blueprint.untimed);
  const [timerGroupIndex, setTimerGroupIndex] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(
    blueprint.timerGroups[0]?.durationSeconds ?? 3600,
  );
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [currentId, setCurrentId] = useState(questions[0]?.id ?? "");
  const [answers, setAnswers] = useState<Record<string, AnswerState>>(() => {
    const init: Record<string, AnswerState> = {};
    for (const q of questions) {
      init[q.id] = {
        selected: null,
        markedReview: false,
        visited: false,
        timeSpentMs: 0,
        changeCount: 0,
      };
    }
    return init;
  });
  const [submitting, setSubmitting] = useState(false);
  const [warn, setWarn] = useState<string | null>(null);
  const lastTick = useRef(Date.now());
  const answersRef = useRef(answers);
  answersRef.current = answers;
  const currentIdRef = useRef(currentId);
  currentIdRef.current = currentId;

  const activeGroup = blueprint.timerGroups[timerGroupIndex]!;
  const activeSectionKeys = new Set(activeGroup.sectionKeys);

  const visibleQuestions = useMemo(
    () => questions.filter((q) => activeSectionKeys.has(q.sectionKey as SectionKey)),
    [questions, activeSectionKeys],
  );

  const current = questions.find((q) => q.id === currentId) ?? visibleQuestions[0];
  const currentVisibleIndex = visibleQuestions.findIndex((q) => q.id === current?.id);

  // Ensure current question is in active section
  useEffect(() => {
    if (current && !activeSectionKeys.has(current.sectionKey as SectionKey)) {
      const first = visibleQuestions[0];
      if (first) setCurrentId(first.id);
    }
  }, [timerGroupIndex, current, activeSectionKeys, visibleQuestions]);

  // Mark visited
  useEffect(() => {
    if (!current) return;
    setAnswers((prev) => ({
      ...prev,
      [current.id]: { ...prev[current.id]!, visited: true },
    }));
  }, [current?.id]);

  // Accrue time on current question
  useEffect(() => {
    lastTick.current = Date.now();
    const id = window.setInterval(() => {
      const now = Date.now();
      const delta = now - lastTick.current;
      lastTick.current = now;
      const qid = currentIdRef.current;
      if (!qid) return;
      setAnswers((prev) => ({
        ...prev,
        [qid]: {
          ...prev[qid]!,
          timeSpentMs: prev[qid]!.timeSpentMs + delta,
        },
      }));
    }, 1000);
    return () => window.clearInterval(id);
  }, [currentId]);

  const serializeAnswers = useCallback(() => {
    return Object.entries(answersRef.current).map(([questionId, a]) => ({
      questionId,
      selected: a.selected,
      markedReview: a.markedReview,
      visited: a.visited,
      timeSpentMs: a.timeSpentMs,
      changeCount: a.changeCount,
    }));
  }, []);

  const submitPaperRef = useRef<() => Promise<void>>(async () => undefined);
  const advanceRef = useRef<() => Promise<void>>(async () => undefined);

  const submitPaper = useCallback(async () => {
    if (submitting) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/attempts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          paperId,
          attemptId,
          action: "submit",
          answers: serializeAnswers(),
        }),
      });
      const data = await res.json();
      if (data.needsDest) {
        router.push(`/exam/${paperId}/dest?attemptId=${attemptId}`);
      } else {
        router.push(`/report/${attemptId}`);
      }
    } catch {
      setSubmitting(false);
      setWarn("Submission failed. Try again.");
    }
  }, [submitting, paperId, attemptId, serializeAnswers, router]);

  const advanceSectionOrSubmit = useCallback(async () => {
    if (timerGroupIndex < blueprint.timerGroups.length - 1) {
      const next = timerGroupIndex + 1;
      setTimerGroupIndex(next);
      setSecondsLeft(blueprint.timerGroups[next]!.durationSeconds);
      setWarn(
        `${activeGroup.label} has closed. ${blueprint.timerGroups[next]!.label} has started.`,
      );
      const nextKeys = new Set(blueprint.timerGroups[next]!.sectionKeys);
      const first = questions.find((q) => nextKeys.has(q.sectionKey as SectionKey));
      if (first) setCurrentId(first.id);
      await fetch("/api/attempts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          paperId,
          attemptId,
          action: "save",
          currentSection: first?.sectionKey,
          answers: serializeAnswers(),
        }),
      });
    } else {
      await submitPaper();
    }
  }, [
    timerGroupIndex,
    blueprint,
    activeGroup.label,
    questions,
    paperId,
    attemptId,
    serializeAnswers,
    submitPaper,
  ]);

  submitPaperRef.current = submitPaper;
  advanceRef.current = advanceSectionOrSubmit;

  // Countdown — tests only (practice is untimed / book-style)
  useEffect(() => {
    if (untimed || (blueprint.timerGroups[timerGroupIndex]?.durationSeconds ?? 0) <= 0) {
      return;
    }
    const id = window.setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          window.clearInterval(id);
          void advanceRef.current();
          return 0;
        }
        if (prev === 300) setWarn("5 minutes remaining in this section.");
        if (prev === 60) setWarn("1 minute remaining in this section.");
        return prev - 1;
      });
    }, 1000);
    return () => window.clearInterval(id);
  }, [timerGroupIndex, untimed, blueprint.timerGroups]);

  // Practice stopwatch — counts up from 00:00
  useEffect(() => {
    if (!untimed) return;
    setElapsedSeconds(0);
    const id = window.setInterval(() => {
      setElapsedSeconds((s) => s + 1);
    }, 1000);
    return () => window.clearInterval(id);
  }, [untimed]);

  // Fullscreen — exam-like for tests; optional for practice
  useEffect(() => {
    if (untimed) return;
    const el = document.documentElement;
    if (el.requestFullscreen) {
      el.requestFullscreen().catch(() => undefined);
    }
    const onExit = () => {
      if (!document.fullscreenElement) {
        setWarn("You left fullscreen. Return to fullscreen for an exam-like environment.");
      }
    };
    document.addEventListener("fullscreenchange", onExit);
    return () => document.removeEventListener("fullscreenchange", onExit);
  }, [untimed]);

  // Prevent accidental navigation
  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, []);

  function selectOption(opt: string) {
    if (!current) return;
    if (!activeSectionKeys.has(current.sectionKey as SectionKey)) return;
    setAnswers((prev) => {
      const cur = prev[current.id]!;
      const changed = cur.selected !== null && cur.selected !== opt;
      return {
        ...prev,
        [current.id]: {
          ...cur,
          selected: opt,
          changeCount: changed ? cur.changeCount + 1 : cur.changeCount,
        },
      };
    });
  }

  function clearResponse() {
    if (!current) return;
    setAnswers((prev) => ({
      ...prev,
      [current.id]: { ...prev[current.id]!, selected: null },
    }));
  }

  function toggleReview() {
    if (!current) return;
    setAnswers((prev) => ({
      ...prev,
      [current.id]: {
        ...prev[current.id]!,
        markedReview: !prev[current.id]!.markedReview,
      },
    }));
  }

  function markReviewAndNext() {
    if (!current) return;
    setAnswers((prev) => ({
      ...prev,
      [current.id]: {
        ...prev[current.id]!,
        markedReview: true,
        visited: true,
      },
    }));
    if (currentVisibleIndex < visibleQuestions.length - 1) {
      setCurrentId(visibleQuestions[currentVisibleIndex + 1]!.id);
    }
  }

  function saveAndNext() {
    if (!current) return;
    setAnswers((prev) => ({
      ...prev,
      [current.id]: {
        ...prev[current.id]!,
        visited: true,
      },
    }));
    goNext();
  }

  /** Skip unanswered question and move on (still counts as visited / not answered). */
  function skipAndNext() {
    if (!current) return;
    setAnswers((prev) => ({
      ...prev,
      [current.id]: {
        ...prev[current.id]!,
        visited: true,
      },
    }));
    goNext();
  }

  function goNext() {
    if (currentVisibleIndex < visibleQuestions.length - 1) {
      setCurrentId(visibleQuestions[currentVisibleIndex + 1]!.id);
    }
  }

  function goPrev() {
    if (currentVisibleIndex > 0) {
      setCurrentId(visibleQuestions[currentVisibleIndex - 1]!.id);
    }
  }

  function endSectionEarly() {
    const last = timerGroupIndex >= blueprint.timerGroups.length - 1;
    const msg = last
      ? "End this section and submit the paper? (In the real SSC exam you must wait for the sectional timer.)"
      : "End this section now and move to the next? Unused time will be discarded. (Real SSC exam does not allow this — practice convenience only.)";
    if (!window.confirm(msg)) return;
    void advanceRef.current();
  }

  function paletteClass(q: ExamQuestion) {
    const a = answers[q.id]!;
    if (a.markedReview && a.selected) return "bg-violet-700 text-white";
    if (a.markedReview) return "bg-amber-500 text-ink";
    if (a.selected) return "bg-emerald-700 text-white";
    if (a.visited) return "bg-red-700 text-white";
    return "bg-slate-200 text-ink";
  }

  const counts = useMemo(() => {
    let answered = 0;
    let notAnswered = 0;
    let marked = 0;
    let notVisited = 0;
    for (const q of visibleQuestions) {
      const a = answers[q.id]!;
      if (a.markedReview) marked += 1;
      if (a.selected) answered += 1;
      else if (a.visited) notAnswered += 1;
      else notVisited += 1;
    }
    return { answered, notAnswered, marked, notVisited };
  }, [answers, visibleQuestions]);

  if (!current) {
    return <div className="p-8">No questions available.</div>;
  }

  return (
    <div className="exam-shell flex h-screen flex-col bg-[#eef1f4] text-[#1a1f2b]">
      <header className="flex items-center justify-between border-b border-[#c5ccd6] bg-[#1e3a5f] px-4 py-2 text-white">
        <div>
          <div className="font-display text-lg tracking-wide">mockGE</div>
          <div className="text-xs text-slate-200">{paperTitle}</div>
        </div>
        <div className="text-center text-sm">
          <div className="text-xs uppercase tracking-wider text-slate-300">
            {untimed ? "Stopwatch" : activeGroup.label}
          </div>
          <div
            className={`font-mono text-2xl tabular-nums ${
              !untimed && secondsLeft <= 60 ? "text-amber-300" : ""
            }`}
          >
            {untimed ? formatTime(elapsedSeconds) : formatTime(secondsLeft)}
          </div>
        </div>
        <div className="flex items-center gap-3">
          {!untimed && (
            <button
              type="button"
              className="border border-amber-300/80 bg-amber-500/20 px-3 py-1.5 text-sm text-amber-50 hover:bg-amber-500/30"
              onClick={endSectionEarly}
              title="Practice only — real SSC does not allow ending a section early"
            >
              Submit Section
            </button>
          )}
          {!untimed && (
            <button
              type="button"
              className="border border-white/40 px-3 py-1.5 text-sm hover:bg-white/10"
              onClick={() => {
                if (document.fullscreenElement) {
                  document.exitFullscreen().catch(() => undefined);
                } else {
                  document.documentElement.requestFullscreen().catch(() => undefined);
                }
              }}
            >
              Fullscreen
            </button>
          )}
          <button
            type="button"
            disabled={submitting}
            className="bg-[#c45c26] px-4 py-1.5 text-sm font-medium text-white hover:bg-[#a84c1f] disabled:opacity-60"
            onClick={() => {
              if (
                window.confirm(
                  untimed
                    ? "Finish this practice set and see solutions + tricks?"
                    : "Submit the entire paper? You cannot change answers after submission.",
                )
              ) {
                void submitPaper();
              }
            }}
          >
            {submitting ? "Submitting..." : untimed ? "Finish & see solutions" : "Submit Paper"}
          </button>
        </div>
      </header>

      {warn && (
        <div className="border-b border-amber-300 bg-amber-50 px-4 py-2 text-sm text-amber-950">
          {warn}
          <button
            type="button"
            className="ml-3 underline"
            onClick={() => setWarn(null)}
          >
            Dismiss
          </button>
        </div>
      )}

      <div className="flex min-h-0 flex-1">
        <main className="flex min-w-0 flex-1 flex-col border-r border-[#c5ccd6] bg-white">
          <div className="flex items-center justify-between border-b border-[#e2e6eb] px-4 py-2 text-sm">
            <span>
              Question {current.qIndex}{" "}
              <span className="text-[#5a6577]">({current.subject} · {current.topic})</span>
            </span>
            <span className="text-[#5a6577]">
              Marks: +{current.marks} / −{current.negativeMarks}
            </span>
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-5">
            <p className="mb-6 whitespace-pre-wrap text-[15px] leading-relaxed">
              {current.stemEn}
            </p>
            <div className="space-y-3">
              {(["A", "B", "C", "D"] as const).map((opt) => {
                const text =
                  opt === "A"
                    ? current.optionA
                    : opt === "B"
                      ? current.optionB
                      : opt === "C"
                        ? current.optionC
                        : current.optionD;
                const selected = answers[current.id]?.selected === opt;
                return (
                  <label
                    key={opt}
                    className={`flex cursor-pointer gap-3 border px-3 py-2.5 text-sm ${
                      selected
                        ? "border-[#1e3a5f] bg-[#e8eef6]"
                        : "border-[#d5dbe3] hover:border-[#9aa6b5]"
                    }`}
                  >
                    <input
                      type="radio"
                      name={`q-${current.id}`}
                      checked={selected}
                      onChange={() => selectOption(opt)}
                      className="mt-0.5"
                    />
                    <span>
                      <span className="mr-2 font-medium">({opt})</span>
                      {text}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 border-t border-[#e2e6eb] bg-[#f7f8fa] px-4 py-3">
            <button
              type="button"
              onClick={goPrev}
              disabled={currentVisibleIndex <= 0}
              className="border border-[#c5ccd6] bg-white px-3 py-1.5 text-sm disabled:opacity-40"
            >
              Previous
            </button>
            <button
              type="button"
              onClick={clearResponse}
              className="border border-[#c5ccd6] bg-white px-3 py-1.5 text-sm"
            >
              Clear Response
            </button>
            <button
              type="button"
              onClick={skipAndNext}
              disabled={currentVisibleIndex >= visibleQuestions.length - 1}
              className="border border-[#c5ccd6] bg-white px-3 py-1.5 text-sm disabled:opacity-40"
              title="Leave unanswered and go to next question"
            >
              Skip
            </button>
            <button
              type="button"
              onClick={toggleReview}
              className={`border px-3 py-1.5 text-sm ${
                answers[current.id]?.markedReview
                  ? "border-amber-600 bg-amber-400 text-ink"
                  : "border-amber-500 bg-amber-50 text-amber-950"
              }`}
            >
              {answers[current.id]?.markedReview ? "Unmark Review" : "Mark for Review"}
            </button>
            <button
              type="button"
              onClick={markReviewAndNext}
              className="border border-violet-700 bg-violet-700 px-3 py-1.5 text-sm text-white"
            >
              Mark for Review & Next
            </button>
            <button
              type="button"
              onClick={saveAndNext}
              className="ml-auto bg-[#1e3a5f] px-4 py-1.5 text-sm text-white"
            >
              {currentVisibleIndex >= visibleQuestions.length - 1 ? "Save" : "Save & Next"}
            </button>
          </div>
        </main>

        <aside className="flex w-[300px] shrink-0 flex-col bg-[#f3f5f8]">
          <div className="border-b border-[#c5ccd6] px-3 py-3 text-xs">
            <div className="mb-2 font-medium uppercase tracking-wide text-[#5a6577]">
              Legend
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Legend swatch="bg-emerald-700" label={`Answered (${counts.answered})`} />
              <Legend swatch="bg-red-700" label={`Not Answered (${counts.notAnswered})`} />
              <Legend swatch="bg-amber-500" label={`Marked (${counts.marked})`} />
              <Legend swatch="bg-violet-700" label="Answered + Marked" />
              <Legend swatch="bg-slate-200" label={`Not Visited (${counts.notVisited})`} />
            </div>
            <p className="mt-2 text-[11px] leading-snug text-[#5a6577]">
              Use palette to jump within this section only. Mark for Review & Next flags and moves
              forward. Skip leaves a question unanswered.
            </p>
          </div>
          <div className="flex-1 overflow-y-auto p-3">
            <div className="mb-2 text-xs font-medium uppercase tracking-wide text-[#5a6577]">
              Question Palette
            </div>
            <div className="grid grid-cols-5 gap-1.5">
              {visibleQuestions.map((q) => (
                <button
                  key={q.id}
                  type="button"
                  onClick={() => setCurrentId(q.id)}
                  className={`h-9 text-xs font-medium ${paletteClass(q)} ${
                    q.id === current.id ? "ring-2 ring-[#1e3a5f] ring-offset-1" : ""
                  }`}
                >
                  {q.qIndex}
                </button>
              ))}
            </div>
          </div>
          <SectionNav blueprint={blueprint} activeId={activeGroup.id} />
        </aside>
      </div>
    </div>
  );
}

function Legend({ swatch, label }: { swatch: string; label: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className={`inline-block h-4 w-4 ${swatch}`} />
      <span>{label}</span>
    </div>
  );
}

function SectionNav({
  blueprint,
  activeId,
}: {
  blueprint: ExamBlueprint;
  activeId: string;
}) {
  return (
    <div className="border-t border-[#c5ccd6] px-3 py-2 text-xs text-[#5a6577]">
      {blueprint.timerGroups.map((g) => (
        <div
          key={g.id}
          className={`py-0.5 ${g.id === activeId ? "font-medium text-[#1e3a5f]" : ""}`}
        >
          {g.id === activeId ? "• " : ""}
          {g.label}
        </div>
      ))}
    </div>
  );
}
