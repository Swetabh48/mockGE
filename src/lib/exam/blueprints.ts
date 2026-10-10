export type SectionKey =
  | "reasoning"
  | "ga"
  | "quant"
  | "english"
  | "maths"
  | "computer"
  | "dest"
  | "ies_ce";

export type ExamTier =
  | "tier1"
  | "tier2"
  | "practice"
  | "ies_paper1"
  | "ies_paper2";

export type ExamProduct = "ssc_cgl" | "ies_civil";

export interface SectionBlueprint {
  key: SectionKey;
  label: string;
  questionCount: number;
  marksPerQuestion: number;
  negativeMarks: number;
  timerGroup: string;
}

export interface TimerGroupBlueprint {
  id: string;
  label: string;
  durationSeconds: number;
  sectionKeys: SectionKey[];
  autoClose: boolean;
}

export interface ExamBlueprint {
  tier: ExamTier;
  title: string;
  totalQuestions: number;
  maxScore: number;
  instructions: string[];
  sections: SectionBlueprint[];
  timerGroups: TimerGroupBlueprint[];
  hasDest: boolean;
  destDurationSeconds: number;
  destTargetKeystrokes: number;
  destPassAccuracy: number;
  /** Book-style practice: no countdown, no auto-submit. */
  untimed?: boolean;
  exam?: ExamProduct;
}

/** SSC CGL 2026 Tier-I: 15 minutes locked per section (official). */
export const TIER1_BLUEPRINT: ExamBlueprint = {
  tier: "tier1",
  title: "SSC CGL Tier-I (Computer Based Examination)",
  totalQuestions: 100,
  maxScore: 200,
  hasDest: false,
  destDurationSeconds: 0,
  destTargetKeystrokes: 0,
  destPassAccuracy: 0,
  sections: [
    {
      key: "reasoning",
      label: "General Intelligence and Reasoning",
      questionCount: 25,
      marksPerQuestion: 2,
      negativeMarks: 0.5,
      timerGroup: "sec_reasoning",
    },
    {
      key: "ga",
      label: "General Awareness",
      questionCount: 25,
      marksPerQuestion: 2,
      negativeMarks: 0.5,
      timerGroup: "sec_ga",
    },
    {
      key: "quant",
      label: "Quantitative Aptitude",
      questionCount: 25,
      marksPerQuestion: 2,
      negativeMarks: 0.5,
      timerGroup: "sec_quant",
    },
    {
      key: "english",
      label: "English Comprehension",
      questionCount: 25,
      marksPerQuestion: 2,
      negativeMarks: 0.5,
      timerGroup: "sec_english",
    },
  ],
  timerGroups: [
    {
      id: "sec_reasoning",
      label: "Section A — Reasoning (15 min)",
      durationSeconds: 15 * 60,
      sectionKeys: ["reasoning"],
      autoClose: true,
    },
    {
      id: "sec_ga",
      label: "Section B — General Awareness (15 min)",
      durationSeconds: 15 * 60,
      sectionKeys: ["ga"],
      autoClose: true,
    },
    {
      id: "sec_quant",
      label: "Section C — Quantitative Aptitude (15 min)",
      durationSeconds: 15 * 60,
      sectionKeys: ["quant"],
      autoClose: true,
    },
    {
      id: "sec_english",
      label: "Section D — English (15 min)",
      durationSeconds: 15 * 60,
      sectionKeys: ["english"],
      autoClose: true,
    },
  ],
  instructions: [
    "Tier-I has 100 objective questions for 200 marks.",
    "Four sections of 25 questions each: Reasoning, General Awareness, Quantitative Aptitude, English Comprehension.",
    "SECTIONAL TIMER (SSC CGL 2026): each section is locked for 15 minutes. Unused time cannot be carried to the next section. You cannot return to a closed section.",
    "Order of sections is fixed. When 15 minutes end, the section auto-submits and the next section starts.",
    "Each correct answer: +2 marks. Each wrong answer: −0.50. Unattempted: 0.",
    "Use the palette to navigate within the active section only.",
    "Do not refresh or close the browser during the examination.",
  ],
};

export const TIER2_BLUEPRINT: ExamBlueprint = {
  tier: "tier2",
  title: "SSC CGL Tier-II Paper-I",
  totalQuestions: 150,
  maxScore: 450,
  hasDest: true,
  destDurationSeconds: 15 * 60,
  destTargetKeystrokes: 2000,
  destPassAccuracy: 85,
  sections: [
    {
      key: "maths",
      label: "Mathematical Abilities",
      questionCount: 30,
      marksPerQuestion: 3,
      negativeMarks: 1,
      timerGroup: "section1",
    },
    {
      key: "reasoning",
      label: "Reasoning and General Intelligence",
      questionCount: 30,
      marksPerQuestion: 3,
      negativeMarks: 1,
      timerGroup: "section1",
    },
    {
      key: "english",
      label: "English Language and Comprehension",
      questionCount: 45,
      marksPerQuestion: 3,
      negativeMarks: 1,
      timerGroup: "section2",
    },
    {
      key: "ga",
      label: "General Awareness",
      questionCount: 25,
      marksPerQuestion: 3,
      negativeMarks: 1,
      timerGroup: "section2",
    },
    {
      key: "computer",
      label: "Computer Knowledge Test",
      questionCount: 20,
      marksPerQuestion: 3,
      negativeMarks: 1,
      timerGroup: "section3",
    },
  ],
  timerGroups: [
    {
      id: "section1",
      label: "Section-I (Maths + Reasoning)",
      durationSeconds: 60 * 60,
      sectionKeys: ["maths", "reasoning"],
      autoClose: true,
    },
    {
      id: "section2",
      label: "Section-II (English + GA)",
      durationSeconds: 60 * 60,
      sectionKeys: ["english", "ga"],
      autoClose: true,
    },
    {
      id: "section3",
      label: "Section-III (Computer Knowledge)",
      durationSeconds: 15 * 60,
      sectionKeys: ["computer"],
      autoClose: true,
    },
  ],
  instructions: [
    "Paper-I is compulsory and is conducted in two sessions on the same day.",
    "Session-I: Section-I (60 min), Section-II (60 min), Section-III Computer (15 min).",
    "Negative marking of 1 mark for each wrong answer in Sections I–III.",
    "Session-II is DEST (15 minutes). DEST is qualifying.",
    "After a section closes, you cannot return to it.",
  ],
};

/** ESE Civil objective paper: 3 hours, ~150 MCQs, +2 / −2/3. */
const IES_NEG = 2 / 3;
const IES_MARKS = 2;
const IES_DEFAULT_Q = 150;
const IES_DURATION = 3 * 60 * 60;

function iesPaperBlueprint(
  which: "ce_paper1" | "ce_paper2",
  opts?: { questionCount?: number; title?: string },
): ExamBlueprint {
  const n = opts?.questionCount ?? IES_DEFAULT_Q;
  const label =
    which === "ce_paper1"
      ? "Civil Engineering Paper-I"
      : "Civil Engineering Paper-II";
  const tier: ExamTier = which === "ce_paper1" ? "ies_paper1" : "ies_paper2";
  return {
    tier,
    exam: "ies_civil",
    title: opts?.title ?? `UPSC ESE/IES ${label} (Objective)`,
    totalQuestions: n,
    maxScore: n * IES_MARKS,
    hasDest: false,
    destDurationSeconds: 0,
    destTargetKeystrokes: 0,
    destPassAccuracy: 0,
    sections: [
      {
        key: "ies_ce",
        label,
        questionCount: n,
        marksPerQuestion: IES_MARKS,
        negativeMarks: IES_NEG,
        timerGroup: "ies_full",
      },
    ],
    timerGroups: [
      {
        id: "ies_full",
        label: `${label} (3 hours)`,
        durationSeconds: IES_DURATION,
        sectionKeys: ["ies_ce"],
        autoClose: true,
      },
    ],
    instructions: [
      `${label}: objective MCQs for UPSC Engineering Services (Civil) pattern.`,
      `Duration: 3 hours (180 minutes). Entire paper is one timed block — no sectional lock.`,
      `Each correct answer: +${IES_MARKS} marks. Each wrong answer: −${(IES_NEG).toFixed(2)} (⅓ of marks). Unattempted: 0.`,
      "Navigate freely with the question palette. Mark for review as needed.",
      "A full prelims day pack is Paper-I (3h) then Paper-II (3h) — 6 hours total.",
      "Do not refresh or close the browser during the examination.",
    ],
  };
}

export const IES_CE_PAPER1_BLUEPRINT = iesPaperBlueprint("ce_paper1");
export const IES_CE_PAPER2_BLUEPRINT = iesPaperBlueprint("ce_paper2");

/** UI metadata for a same-day Paper-I + Paper-II session. */
export const IES_CE_DAY = {
  label: "Full day — CE Paper-I + Paper-II",
  paperCount: 2,
  totalDurationSeconds: 2 * IES_DURATION,
  blurb: "3 hours + 3 hours = 6 hours. Take Paper-I first; start Paper-II after you submit.",
} as const;

export function iesPracticeBlueprint(
  opts?: { questionCount?: number; title?: string; subjectLabel?: string },
): ExamBlueprint {
  const n = opts?.questionCount ?? 25;
  const title = opts?.title ?? opts?.subjectLabel ?? "IES Civil Practice";
  return {
    tier: "practice",
    exam: "ies_civil",
    title,
    totalQuestions: n,
    maxScore: n * IES_MARKS,
    hasDest: false,
    destDurationSeconds: 0,
    destTargetKeystrokes: 0,
    destPassAccuracy: 0,
    untimed: true,
    sections: [
      {
        key: "ies_ce",
        label: title,
        questionCount: n,
        marksPerQuestion: IES_MARKS,
        negativeMarks: IES_NEG,
        timerGroup: "practice",
      },
    ],
    timerGroups: [
      {
        id: "practice",
        label: "Practice · stopwatch from 00:00",
        durationSeconds: 0,
        sectionKeys: ["ies_ce"],
        autoClose: false,
      },
    ],
    instructions: [
      "Book-style IES Civil practice: stopwatch from 00:00 (no countdown).",
      `This set has ${n} questions. Generate more from the Practice tab.`,
      `Scoring feedback uses +${IES_MARKS} / −${IES_NEG.toFixed(2)} (ESE style).`,
      "Submit when finished — Result shows textbook-style solutions where available.",
    ],
  };
}

export function practiceBlueprint(
  section: SectionKey,
  opts?: { questionCount?: number; title?: string },
): ExamBlueprint {
  const labels: Record<string, string> = {
    reasoning: "Reasoning Practice",
    ga: "General Awareness Practice",
    quant: "Quantitative Aptitude Practice",
    english: "English Practice",
    maths: "Mathematics Practice",
    computer: "Computer Practice",
  };
  const n = opts?.questionCount ?? 25;
  const title = opts?.title ?? labels[section] ?? "Section Practice";
  return {
    tier: "practice",
    title,
    totalQuestions: n,
    maxScore: n * 2,
    hasDest: false,
    destDurationSeconds: 0,
    destTargetKeystrokes: 0,
    destPassAccuracy: 0,
    untimed: true,
    sections: [
      {
        key: section,
        label: title,
        questionCount: n,
        marksPerQuestion: 2,
        negativeMarks: 0.5,
        timerGroup: "practice",
      },
    ],
    timerGroups: [
      {
        id: "practice",
        label: "Practice · stopwatch from 00:00",
        durationSeconds: 0,
        sectionKeys: [section],
        autoClose: false,
      },
    ],
    instructions: [
      "Book-style practice: stopwatch from 00:00 (no countdown). Solve at your own pace.",
      `This set has ${n} questions. You can generate unlimited new sets from the Practice tab.`,
      "Each correct answer: +2. Each wrong answer: −0.50 (for score feedback only).",
      "When you finish, click Submit Paper — Result shows Detailed solution + Exam trick for every question.",
    ],
  };
}

export function getBlueprint(
  tier: ExamTier | string,
  focusSection?: SectionKey,
  opts?: {
    questionCount?: number;
    mode?: string | null;
    title?: string;
    exam?: string | null;
    iesPaper?: string | null;
  },
): ExamBlueprint {
  const isIes =
    opts?.exam === "ies_civil" ||
    tier === "ies_paper1" ||
    tier === "ies_paper2" ||
    opts?.iesPaper === "ce_paper1" ||
    opts?.iesPaper === "ce_paper2";

  if (isIes) {
    if (
      tier === "practice" ||
      opts?.mode === "topic_practice" ||
      opts?.mode === "practice"
    ) {
      return iesPracticeBlueprint({
        questionCount: opts?.questionCount,
        title: opts?.title,
      });
    }
    const which: "ce_paper1" | "ce_paper2" =
      opts?.iesPaper === "ce_paper1" || tier === "ies_paper1"
        ? "ce_paper1"
        : "ce_paper2";
    return iesPaperBlueprint(which, {
      questionCount: opts?.questionCount,
      title: opts?.title,
    });
  }

  if (
    (tier === "practice" ||
      opts?.mode === "topic_practice" ||
      opts?.mode === "practice") &&
    focusSection
  ) {
    return practiceBlueprint(focusSection, {
      questionCount: opts?.questionCount,
      title: opts?.title,
    });
  }
  if (tier === "tier2") return TIER2_BLUEPRINT;
  return TIER1_BLUEPRINT;
}

export function sectionLabel(key: SectionKey | string): string {
  if (key === "ies_ce") return "Civil Engineering";
  const all = [...TIER1_BLUEPRINT.sections, ...TIER2_BLUEPRINT.sections];
  return all.find((s) => s.key === key)?.label ?? key;
}
