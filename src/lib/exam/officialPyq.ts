import { readFileSync, existsSync } from "fs";
import path from "path";
import type { SeedQuestion } from "./questionBank";

export type OfficialMcq = {
  sourcePaper: string;
  qNo: number;
  subjectKey: string;
  topicId: string;
  stemEn: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctOption: string;
  explanation: string;
};

let cache: OfficialMcq[] | null = null;

export function loadOfficialPyqs(): OfficialMcq[] {
  if (cache) return cache;
  const file = path.join(process.cwd(), "data", "sscgl_official.json");
  if (!existsSync(file)) {
    cache = [];
    return cache;
  }
  try {
    const raw = JSON.parse(readFileSync(file, "utf8")) as { questions?: OfficialMcq[] };
    cache = raw.questions ?? [];
  } catch {
    cache = [];
  }
  return cache;
}

export function officialForTopic(topicId: string, setNo: number, limit: number): SeedQuestion[] {
  const all = loadOfficialPyqs().filter((q) => q.topicId === topicId);
  if (all.length === 0) return [];
  const out: SeedQuestion[] = [];
  for (let i = 0; i < Math.min(limit, all.length); i++) {
    const q = all[(setNo + i) % all.length]!;
    out.push({
      qIndex: i + 1,
      sectionKey: q.subjectKey === "quant" ? "quant" : q.subjectKey,
      subject:
        q.subjectKey === "quant"
          ? "Quantitative Aptitude"
          : q.subjectKey === "ga"
            ? "General Awareness"
            : q.subjectKey === "english"
              ? "English"
              : "Reasoning",
      topic: q.topicId,
      difficulty: "hard",
      stemEn: q.stemEn,
      optionA: q.optionA,
      optionB: q.optionB,
      optionC: q.optionC,
      optionD: q.optionD,
      correctOption: q.correctOption,
      explanation: q.explanation,
      trick: "Official PYQ — solve with the topic shortcut from Formulas & Tricks.",
      marks: 2,
      negativeMarks: 0.5,
      source: "sscgl_official",
    });
  }
  return out;
}
