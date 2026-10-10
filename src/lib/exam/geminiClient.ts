/**
 * Google Gemini client for IES Civil question framing (clear English + JSON MCQs).
 */

export type GeminiMcq = {
  stemEn: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctOption: "A" | "B" | "C" | "D";
  topic: string;
  subject?: string;
  explanation?: string;
  short_reason?: string;
};

const GEMINI_KEY = process.env.GEMINI_API_KEY || "";
const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-3.8-flash";

export function geminiConfigured(): boolean {
  return Boolean(GEMINI_KEY);
}

function extractJsonArray(text: string): unknown {
  const cleaned = text.replace(/```json\s*/gi, "").replace(/```/g, "").trim();
  const arrMatch = cleaned.match(/\[[\s\S]*\]/);
  if (arrMatch) return JSON.parse(arrMatch[0]);
  const objMatch = cleaned.match(/\{[\s\S]*\}/);
  if (objMatch) return [JSON.parse(objMatch[0])];
  return JSON.parse(cleaned);
}

export async function geminiGenerateMcqs(opts: {
  subject: string;
  topic: string;
  count: number;
  paperLabel: string;
  banStems?: string[];
}): Promise<GeminiMcq[]> {
  if (!GEMINI_KEY) {
    throw new Error("GEMINI_API_KEY is not set");
  }

  const ban =
    opts.banStems && opts.banStems.length
      ? `Do NOT paraphrase these stems:\n${opts.banStems.slice(0, 8).join("\n")}`
      : "";

  const prompt = `You are an UPSC ESE/IES Civil Engineering prelims question setter.
Write ${opts.count} ORIGINAL objective MCQs for ${opts.paperLabel}.
Subject: ${opts.subject}
Topic: ${opts.topic}
Difficulty: ESE prelims (hard, conceptual + numerical mix).

Rules:
- Clear, grammatical Indian exam English (no slang).
- Exactly one correct option (A–D).
- Plausible distractors that catch common mistakes.
- No copyrighted verbatim previous-year stems.
- Reply with a JSON array only. Each object keys:
  stemEn, optionA, optionB, optionC, optionD, correctOption, topic, subject, explanation, short_reason
${ban}`;

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_KEY}`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.85,
        maxOutputTokens: 8192,
        responseMimeType: "application/json",
      },
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Gemini ${res.status}: ${errText.slice(0, 200)}`);
  }

  const data = (await res.json()) as {
    candidates?: { content?: { parts?: { text?: string }[] } }[];
  };
  const text = data.candidates?.[0]?.content?.parts?.map((p) => p.text || "").join("") || "";
  if (!text) throw new Error("Gemini returned empty content");

  const parsed = extractJsonArray(text);
  const list = Array.isArray(parsed) ? parsed : [parsed];
  const out: GeminiMcq[] = [];
  for (const raw of list) {
    if (!raw || typeof raw !== "object") continue;
    const o = raw as Record<string, unknown>;
    const correct = String(o.correctOption || "A").toUpperCase().slice(0, 1);
    if (!["A", "B", "C", "D"].includes(correct)) continue;
    const stem = String(o.stemEn || "").trim();
    if (stem.length < 20) continue;
    out.push({
      stemEn: stem.slice(0, 1200),
      optionA: String(o.optionA || "").slice(0, 400),
      optionB: String(o.optionB || "").slice(0, 400),
      optionC: String(o.optionC || "").slice(0, 400),
      optionD: String(o.optionD || "").slice(0, 400),
      correctOption: correct as "A" | "B" | "C" | "D",
      topic: String(o.topic || opts.topic),
      subject: String(o.subject || opts.subject),
      explanation: String(o.explanation || o.short_reason || "").slice(0, 2000),
      short_reason: String(o.short_reason || "").slice(0, 500),
    });
  }
  return out;
}

export async function geminiTextbookSolution(opts: {
  stem: string;
  options: { A: string; B: string; C: string; D: string };
  correctOption: string;
  subject: string;
  topic: string;
  textbookContext?: string;
}): Promise<{ solutionDetail: string; citations: string[] }> {
  if (!GEMINI_KEY) {
    return {
      solutionDetail:
        opts.textbookContext ||
        `Correct option ${opts.correctOption}. Review ${opts.subject} / ${opts.topic} in standard CE textbooks (BC Punmia, Garg, Subramanian, Modi & Seth as relevant).`,
      citations: [],
    };
  }

  const prompt = `You are an IES Civil Engineering tutor writing a DETAILED textbook-style solution.

Question (${opts.subject} · ${opts.topic}):
${opts.stem}
A) ${opts.options.A}
B) ${opts.options.B}
C) ${opts.options.C}
D) ${opts.options.D}
Correct: ${opts.correctOption}

Textbook excerpts (may be empty):
${opts.textbookContext || "(none — use standard CE theory)"}

Write:
1) Concept / governing equation
2) Step-by-step numerical or logical solution
3) Why the correct option wins
4) Why each wrong option fails (traps)
5) One exam tip

Plain text, no markdown fences. Be precise with units and codes (IS codes when relevant).`;

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_KEY}`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.4, maxOutputTokens: 4096 },
    }),
  });
  if (!res.ok) {
    return {
      solutionDetail: `Correct option ${opts.correctOption}. (Gemini solution unavailable: HTTP ${res.status})`,
      citations: [],
    };
  }
  const data = (await res.json()) as {
    candidates?: { content?: { parts?: { text?: string }[] } }[];
  };
  const text =
    data.candidates?.[0]?.content?.parts?.map((p) => p.text || "").join("\n") ||
    `Correct option ${opts.correctOption}.`;
  const citations: string[] = [];
  if (opts.textbookContext) {
    const lines = opts.textbookContext.split("\n").filter((l) => l.startsWith("["));
    for (const l of lines.slice(0, 5)) citations.push(l.replace(/^\[|\]$/g, "").slice(0, 120));
  }
  return { solutionDetail: text.trim().slice(0, 8000), citations };
}
