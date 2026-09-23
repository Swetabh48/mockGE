export type SectionKey =
  | "reasoning"
  | "ga"
  | "quant"
  | "english"
  | "maths"
  | "computer"
  | "dest";

export type ExamTier = "tier1" | "tier2" | "practice";

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

export function practiceBlueprint(section: SectionKey): ExamBlueprint {
  const labels: Record<string, string> = {
    reasoning: "Reasoning Practice",
    ga: "General Awareness Practice",
    quant: "Quantitative Aptitude Practice",
    english: "English Practice",
    maths: "Mathematics Practice",
    computer: "Computer Practice",
  };
  return {
    tier: "practice",
    title: labels[section] ?? "Section Practice",
    totalQuestions: 25,
    maxScore: 50,
    hasDest: false,
    destDurationSeconds: 0,
    destTargetKeystrokes: 0,
    destPassAccuracy: 0,
    sections: [
      {
        key: section,
        label: labels[section] ?? section,
        questionCount: 25,
        marksPerQuestion: 2,
        negativeMarks: 0.5,
        timerGroup: "practice",
      },
    ],
    timerGroups: [
      {
        id: "practice",
        label: `${labels[section]} — 15 minutes`,
        durationSeconds: 15 * 60,
        sectionKeys: [section],
        autoClose: true,
      },
    ],
    instructions: [
      `This is a sectional practice set: 25 questions, 15 minutes (same pace as one Tier-I section).`,
      "Each correct answer: +2. Each wrong answer: −0.50.",
      "On time expiry the set is submitted automatically.",
    ],
  };
}

export function getBlueprint(tier: ExamTier | string, focusSection?: SectionKey): ExamBlueprint {
  if (tier === "practice" && focusSection) return practiceBlueprint(focusSection);
  if (tier === "tier2") return TIER2_BLUEPRINT;
  return TIER1_BLUEPRINT;
}

export function sectionLabel(key: SectionKey): string {
  const all = [...TIER1_BLUEPRINT.sections, ...TIER2_BLUEPRINT.sections];
  return all.find((s) => s.key === key)?.label ?? key;
}
