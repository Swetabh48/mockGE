import type { SectionKey } from "./types";

export type SectionMeta = {
  key: SectionKey;
  label: string;
  short: string;
  /** Average questions per 120-question paper (individual papers vary between min and max). */
  count: number;
  min: number;
  max: number;
  /** What to revise when this section is weak. */
  tips: string[];
};

/**
 * Section order follows the published APFC syllabus (UPSC advt.). UPSC does not
 * fix a subject-wise split, so each paper varies within [min, max] around the
 * averages below, which are calibrated to analyses of recent EPFO papers
 * (e.g. 2023: English high, labour laws + social security ~18–21, accounting ~10,
 * computers ~9 + science ~8, aptitude 12–16). Labour + Social Security together
 * stay between 18 and 24 per paper.
 */
export const EPFO_SECTIONS: SectionMeta[] = [
  {
    key: "english",
    label: "General English",
    short: "English",
    count: 15,
    min: 13,
    max: 17,
    tips: [
      "Read one editorial daily and note 5 new words with usage, synonyms and antonyms.",
      "For error spotting, check subject–verb agreement, tense sequence, prepositions and articles in that order.",
      "In comprehension, answer only from the passage — eliminate options that add outside facts.",
    ],
  },
  {
    key: "history",
    label: "Indian Freedom Struggle",
    short: "Freedom Struggle",
    count: 10,
    min: 8,
    max: 12,
    tips: [
      "Make a 1857–1947 timeline: movements, INC sessions with presidents, Acts and commissions.",
      "Link each leader with organisations founded, newspapers edited and books written.",
      "Revise Gandhian movements (Champaran → Quit India) with dates, places and outcomes.",
    ],
  },
  {
    key: "current",
    label: "Current Events & Developmental Issues",
    short: "Current Events",
    count: 11,
    min: 9,
    max: 13,
    tips: [
      "Revise flagship government schemes: launch year, ministry, target group and benefit.",
      "Keep a list of international organisations, their headquarters and India-hosted summits.",
      "Read the Economic Survey summary and the reports/indices published by each body.",
    ],
  },
  {
    key: "polity",
    label: "Indian Polity",
    short: "Polity",
    count: 10,
    min: 8,
    max: 12,
    tips: [
      "Memorise key Articles (Fundamental Rights, DPSP, Parliament, Judiciary, Emergency).",
      "Revise major amendments (42nd, 44th, 73rd, 74th, 86th, 101st, 103rd, 106th).",
      "Practise statement questions on powers of President, Governor, Speaker and CAG.",
    ],
  },
  {
    key: "economy",
    label: "Indian Economy",
    short: "Economy",
    count: 10,
    min: 8,
    max: 12,
    tips: [
      "Revise national income concepts (GDP, GNP, NDP, deflator) and deficit formulas.",
      "Understand RBI tools — repo, reverse repo, CRR, SLR, OMO — and their direction of effect.",
      "Link committees with their subject (Narasimham, Rangarajan, Tendulkar, Urjit Patel).",
    ],
  },
  {
    key: "accounting",
    label: "General Accounting Principles",
    short: "Accounting",
    count: 10,
    min: 8,
    max: 12,
    tips: [
      "Drill the golden rules and 30–40 standard journal entries until they are automatic.",
      "Practise depreciation (SLM/WDV), BRS, final-account adjustments and ratio formulas.",
      "Revise accounting concepts/conventions and the subject of key Accounting Standards.",
    ],
  },
  {
    key: "labour",
    label: "Industrial Relations & Labour Laws",
    short: "Labour Laws & IR",
    count: 12,
    min: 10,
    max: 14,
    tips: [
      "Learn the four Labour Codes (in force from 21 Nov 2025): which laws each subsumes and key thresholds.",
      "Make a threshold table — 10/20/50/300 workers, notice periods, time limits and penalties.",
      "Revise landmark labour cases, ILO conventions and the history of Indian trade unions.",
    ],
  },
  {
    key: "social",
    label: "Social Security in India",
    short: "Social Security",
    count: 9,
    min: 7,
    max: 11,
    tips: [
      "Master EPF, EPS-1995 and EDLI-1976: contribution rates, wage ceiling, benefits and formulas.",
      "Revise ESI benefits, gratuity, maternity benefit and their computation rules.",
      "Compare NPS, APY, PM-SYM, PMJJBY, PMSBY, Ayushman Bharat and e-Shram (age, premium, benefit).",
    ],
  },
  {
    key: "science",
    label: "General Science & Computer Applications",
    short: "Science & Computers",
    count: 17,
    min: 15,
    max: 19,
    tips: [
      "Revise NCERT (Class 8–10) basics: units, human body, nutrition, diseases, everyday chemistry.",
      "For computers: memory hierarchy, number systems, networking terms, MS Office shortcuts, cyber security.",
      "Note recent space and technology missions with their objectives.",
    ],
  },
  {
    key: "quant",
    label: "General Mental Ability & Quantitative Aptitude",
    short: "Aptitude & Reasoning",
    count: 15,
    min: 13,
    max: 17,
    tips: [
      "Practise percentages, ratio, SI/CI, time–work and speed–distance with a 60-second target each.",
      "For reasoning, draw diagrams for directions, rankings and seating; write cyclicity tables for clocks and calendars.",
      "Attempt aptitude after the GS sections so that time sinks do not eat into easy marks.",
    ],
  },
];

export const SECTION_BY_KEY: Record<SectionKey, SectionMeta> = Object.fromEntries(
  EPFO_SECTIONS.map((s) => [s.key, s]),
) as Record<SectionKey, SectionMeta>;

export const TOTAL_QUESTIONS = EPFO_SECTIONS.reduce((n, s) => n + s.count, 0);

/** Combined bound for labour laws + social security per paper. */
export const LABOUR_SOCIAL_RANGE: [number, number] = [18, 24];
