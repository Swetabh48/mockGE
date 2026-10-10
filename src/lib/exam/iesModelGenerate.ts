/**
 * Hybrid IES Civil invent: Gemini (English framing) + optional mockge-ies-civil (Ollama).
 */

import {
  geminiConfigured,
  geminiGenerateMcqs,
  type GeminiMcq,
} from "./geminiClient";
import {
  iesSubjectsForPaper,
  classifyIesStem,
  type IesSubjectKey,
  IES_SYLLABUS,
} from "./iesTaxonomy";
import { buildIesDemoPaper, buildIesPracticeSet, type IesMcq } from "./iesQuestionBank";

const OLLAMA_IES_BASE = (
  process.env.OLLAMA_IES_BASE_URL ||
  process.env.OLLAMA_BASE_URL ||
  "http://127.0.0.1:11434"
).replace(/\/$/, "");
const OLLAMA_IES_MODEL = process.env.OLLAMA_IES_MODEL || "mockge-ies-civil";
const OLLAMA_API_KEY = process.env.OLLAMA_API_KEY || process.env.OLLAMA_IES_API_KEY || "";

const NEG = 2 / 3;

function ollamaHeaders(): HeadersInit {
  const h: Record<string, string> = { "Content-Type": "application/json" };
  if (OLLAMA_API_KEY) h.Authorization = `Bearer ${OLLAMA_API_KEY}`;
  return h;
}

export async function iesOllamaAvailable(): Promise<boolean> {
  try {
    const res = await fetch(`${OLLAMA_IES_BASE}/api/tags`, {
      headers: ollamaHeaders(),
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return false;
    const data = (await res.json()) as { models?: { name?: string }[] };
    return (data.models || []).some(
      (m) =>
        m.name === OLLAMA_IES_MODEL || m.name?.startsWith(`${OLLAMA_IES_MODEL}:`),
    );
  } catch {
    return false;
  }
}

async function ollamaRefine(mcq: GeminiMcq, subject: string, topic: string): Promise<GeminiMcq> {
  try {
    const prompt = `You are mockge-ies-civil, an UPSC ESE Civil Engineering setter.
Rewrite this MCQ for authentic ESE difficulty while keeping the same correct option letter if still valid.
Return JSON only with keys: stemEn, optionA, optionB, optionC, optionD, correctOption, topic, explanation.

Subject: ${subject}
Topic: ${topic}
Draft:
${JSON.stringify(mcq)}`;

    const res = await fetch(`${OLLAMA_IES_BASE}/api/generate`, {
      method: "POST",
      headers: ollamaHeaders(),
      body: JSON.stringify({
        model: OLLAMA_IES_MODEL,
        prompt,
        stream: false,
        format: "json",
        options: { temperature: 0.7 },
      }),
      signal: AbortSignal.timeout(120000),
    });
    if (!res.ok) return mcq;
    const data = (await res.json()) as { response?: string };
    const raw = JSON.parse(data.response || "{}") as Partial<GeminiMcq>;
    if (!raw.stemEn || String(raw.stemEn).length < 20) return mcq;
    const correct = String(raw.correctOption || mcq.correctOption)
      .toUpperCase()
      .slice(0, 1) as GeminiMcq["correctOption"];
    return {
      stemEn: String(raw.stemEn).slice(0, 1200),
      optionA: String(raw.optionA || mcq.optionA).slice(0, 400),
      optionB: String(raw.optionB || mcq.optionB).slice(0, 400),
      optionC: String(raw.optionC || mcq.optionC).slice(0, 400),
      optionD: String(raw.optionD || mcq.optionD).slice(0, 400),
      correctOption: ["A", "B", "C", "D"].includes(correct) ? correct : mcq.correctOption,
      topic: String(raw.topic || topic),
      subject,
      explanation: String(raw.explanation || mcq.explanation || "").slice(0, 2000),
    };
  } catch {
    return mcq;
  }
}

function toIesMcq(m: GeminiMcq, index: number, source: string): IesMcq {
  const cls = classifyIesStem(m.stemEn);
  return {
    qIndex: index + 1,
    sectionKey: "ies_ce",
    subject: m.subject || cls.subject,
    topic: m.topic || cls.topic,
    difficulty: "hard",
    stemEn: m.stemEn,
    optionA: m.optionA,
    optionB: m.optionB,
    optionC: m.optionC,
    optionD: m.optionD,
    correctOption: m.correctOption,
    explanation: m.explanation || m.short_reason || `Correct option ${m.correctOption}.`,
    marks: 2,
    negativeMarks: NEG,
    source,
  };
}

async function inventBatch(
  subjects: { key: string; title: string; topics: { id: string; title: string }[] }[],
  count: number,
  paperLabel: string,
): Promise<IesMcq[]> {
  const out: IesMcq[] = [];
  const useGemini = geminiConfigured();
  const useOllama = await iesOllamaAvailable();
  const source = useGemini
    ? useOllama
      ? "hybrid_gemini_ies"
      : "gemini"
    : useOllama
      ? "model_ies"
      : "seed_fallback";

  if (!useGemini && !useOllama) {
    // Deterministic demo bank fallback so Generate never hard-fails locally
    return buildIesDemoPaper(
      paperLabel.includes("Paper-I") ? "ce_paper1" : "ce_paper2",
      Date.now() % 1000,
      count,
    );
  }

  // Official paper is 150 Q — invent a high-quality Gemini core, then pad to full length.
  // Generating all 150 live would exceed typical serverless timeouts.
  const inventTarget = useGemini || useOllama ? Math.min(count, 45) : count;

  let guard = 0;
  while (out.length < inventTarget && guard < inventTarget * 3) {
    guard++;
    const sub = subjects[out.length % subjects.length]!;
    const topic = sub.topics[out.length % sub.topics.length]!;
    const need = Math.min(3, inventTarget - out.length);

    let drafts: GeminiMcq[] = [];
    if (useGemini) {
      try {
        drafts = await geminiGenerateMcqs({
          subject: sub.title,
          topic: topic.title,
          count: need,
          paperLabel,
          banStems: out.map((q) => q.stemEn.slice(0, 80)),
        });
      } catch (e) {
        console.warn("Gemini batch failed", e);
      }
    }

    if (drafts.length === 0 && useOllama) {
      // Ask Ollama to invent directly
      try {
        const res = await fetch(`${OLLAMA_IES_BASE}/api/generate`, {
          method: "POST",
          headers: ollamaHeaders(),
          body: JSON.stringify({
            model: OLLAMA_IES_MODEL,
            prompt: `Write ${need} ESE Civil MCQs as a JSON array on ${sub.title} / ${topic.title}. Keys: stemEn, optionA, optionB, optionC, optionD, correctOption, topic, explanation.`,
            stream: false,
            format: "json",
          }),
          signal: AbortSignal.timeout(180000),
        });
        if (res.ok) {
          const data = (await res.json()) as { response?: string };
          const parsed = JSON.parse(data.response || "[]");
          const list = Array.isArray(parsed) ? parsed : parsed.questions || [parsed];
          drafts = list.filter((x: GeminiMcq) => x?.stemEn);
        }
      } catch {
        /* ignore */
      }
    }

    for (let d of drafts) {
      if (out.length >= count) break;
      if (useOllama && useGemini) {
        d = await ollamaRefine(d, sub.key, topic.id);
      }
      out.push(toIesMcq(d, out.length, source));
    }

    if (drafts.length === 0) break;
  }

  if (out.length < count) {
    const filler = buildIesDemoPaper(
      paperLabel.includes("Paper-I") ? "ce_paper1" : "ce_paper2",
      99,
      count - out.length,
    );
    for (const f of filler) {
      out.push({ ...f, qIndex: out.length + 1, source: `${source}+fallback` });
    }
  }

  return out.slice(0, count);
}

export async function inventIesPaper(
  iesPaper: "ce_paper1" | "ce_paper2",
  questionCount = 150,
): Promise<IesMcq[]> {
  const subjects = iesSubjectsForPaper(iesPaper).map((s) => ({
    key: s.key,
    title: s.title,
    topics: s.topics,
  }));
  const label = iesPaper === "ce_paper1" ? "Civil Paper-I" : "Civil Paper-II";
  return inventBatch(subjects, questionCount, label);
}

export async function inventIesPractice(
  subject: IesSubjectKey,
  questionCount = 10,
): Promise<IesMcq[]> {
  const sub = IES_SYLLABUS.find((s) => s.key === subject);
  if (!sub) return buildIesPracticeSet(subject, 1, questionCount);
  if (!geminiConfigured() && !(await iesOllamaAvailable())) {
    return buildIesPracticeSet(subject, Date.now() % 100, questionCount);
  }
  return inventBatch(
    [{ key: sub.key, title: sub.title, topics: sub.topics }],
    questionCount,
    `Practice · ${sub.title}`,
  );
}
