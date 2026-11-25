/** EPFO APFC (UPSC Recruitment Test) — shared types. */

export type SectionKey =
  | "english"
  | "history"
  | "current"
  | "polity"
  | "economy"
  | "accounting"
  | "labour"
  | "social"
  | "science"
  | "quant";

export type Band = "easy" | "medium" | "hard";

export type OptionIndex = 0 | 1 | 2 | 3;

/** One question as shipped to the browser (public/epfo/papers/*.json). */
export type EpfoQuestion = {
  /** 1-based question number in the paper. */
  n: number;
  sec: SectionKey;
  topic: string;
  /** Stem. May contain newlines (statements, lists, tables). */
  q: string;
  o: [string, string, string, string];
  /** Correct option index (0 = a). */
  a: OptionIndex;
  /** Detailed solution / explanation. */
  x: string;
  /** Optional reading passage shared by consecutive questions. */
  p?: string;
};

export type EpfoPaper = {
  id: string;
  number: number;
  band: Band;
  title: string;
  durationMin: number;
  marksPerQ: number;
  negPerQ: number;
  /** Set on the 2025-pattern series (papers 31–40). */
  pattern?: "2025";
  questions: EpfoQuestion[];
};

export type EpfoPaperMeta = {
  id: string;
  number: number;
  band: Band;
  title: string;
  questionCount: number;
  pattern?: "2025";
};

export const OPTION_LETTERS = ["a", "b", "c", "d"] as const;

export const EPFO_EXAM = {
  name: "UPSC EPFO — Assistant Provident Fund Commissioner (APFC)",
  short: "EPFO APFC",
  questions: 120,
  durationMin: 120,
  marksPerQ: 2.5,
  maxMarks: 300,
  /** One-third of the marks of the question. */
  negPerQ: 2.5 / 3,
} as const;
