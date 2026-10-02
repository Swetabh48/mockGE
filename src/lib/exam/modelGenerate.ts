/**
 * Live question generation via local Ollama model (mockge-ssc).
 * Used for practice sets so each generate call produces NEW stems.
 */

export type ModelMcq = {
  stemEn: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctOption: string;
  explanation: string;
  trick: string;
  topic: string;
  subtopic?: string;
};

const OLLAMA_BASE = (process.env.OLLAMA_BASE_URL || "http://127.0.0.1:11434").replace(
  /\/$/,
  "",
);
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || "mockge-ssc";
const OLLAMA_API_KEY = process.env.OLLAMA_API_KEY || "";

function ollamaHeaders(): HeadersInit {
  const h: Record<string, string> = { "Content-Type": "application/json" };
  if (OLLAMA_API_KEY) h.Authorization = `Bearer ${OLLAMA_API_KEY}`;
  return h;
}

export async function ollamaAvailable(): Promise<boolean> {
  try {
    const ctrl = new AbortController();
    // Modal cold start can exceed a few seconds; keep probe short and fail soft
    const t = setTimeout(() => ctrl.abort(), 8000);
    const res = await fetch(`${OLLAMA_BASE}/api/tags`, {
      signal: ctrl.signal,
      headers: ollamaHeaders(),
    });
    clearTimeout(t);
    if (!res.ok) return false;
    const data = (await res.json()) as { models?: { name: string }[] };
    return (data.models ?? []).some(
      (m) => m.name === OLLAMA_MODEL || m.name.startsWith(`${OLLAMA_MODEL}:`),
    );
  } catch {
    return false;
  }
}

function extractJson(text: string): unknown {
  const trimmed = text.trim();
  try {
    return JSON.parse(trimmed);
  } catch {
    const start = trimmed.indexOf("{");
    const end = trimmed.lastIndexOf("}");
    if (start >= 0 && end > start) {
      return JSON.parse(trimmed.slice(start, end + 1));
    }
    throw new Error("Model did not return JSON");
  }
}

function normalizeMcq(raw: Record<string, unknown>, topicTitle: string, sub?: string): ModelMcq | null {
  const stemEn = String(raw.stemEn || raw.stem || raw.question || "").trim();
  const optionA = String(raw.optionA || raw.A || "").trim();
  const optionB = String(raw.optionB || raw.B || "").trim();
  const optionC = String(raw.optionC || raw.C || "").trim();
  const optionD = String(raw.optionD || raw.D || "").trim();
  let correctOption = String(raw.correctOption || raw.answer || "A")
    .trim()
    .toUpperCase()
    .slice(0, 1);
  if (!["A", "B", "C", "D"].includes(correctOption)) correctOption = "A";
  if (!stemEn || stemEn.length < 25) return null;
  if (![optionA, optionB, optionC, optionD].every((o) => o.length > 0)) return null;
  // Reject obvious off-topic if topic keywords conflict badly
  const hay = `${stemEn} ${topicTitle}`.toLowerCase();
  if (/time\s*&\s*work|work\s*&\s*wages|pipes/i.test(topicTitle + " " + (sub || ""))) {
    if (/compound interest|simple interest|marked price|successive discount/i.test(stemEn) && !/work|wage|pipe|day|hour|efficien/i.test(stemEn)) {
      return null;
    }
  }
  void hay;
  return {
    stemEn,
    optionA,
    optionB,
    optionC,
    optionD,
    correctOption,
    explanation: String(raw.explanation || "Solve using the standard method for this pattern.").trim(),
    trick: String(raw.trick || "Use the topic shortcut from Formulas & Tricks; verify with one line of working.").trim(),
    topic: topicTitle,
    subtopic: sub,
  };
}

export async function generateTopicQuestionsWithModel(args: {
  subjectTitle: string;
  topicTitle: string;
  subtopicTitle?: string;
  count: number;
  avoidStems?: string[];
}): Promise<ModelMcq[]> {
  const avoid = (args.avoidStems ?? []).slice(0, 8).map((s) => s.slice(0, 80)).join("\n- ");
  const prompt = `You are an SSC CGL question author. Create EXACTLY ${args.count} NEW hard MCQs.

Subject: ${args.subjectTitle}
Topic: ${args.topicTitle}
Subtopic: ${args.subtopicTitle || "general"}

Rules:
- Every question MUST be strictly about ${args.topicTitle}${args.subtopicTitle ? ` / ${args.subtopicTitle}` : ""}. Do NOT mix other topics.
- Use fresh numbers and wording. Do not copy classic textbook clones.
- Provide 4 options A-D, exactly one correct.
- Include step-by-step explanation and a short exam trick with a mini example.
- Return ONLY JSON:
{"questions":[{"stemEn":"","optionA":"","optionB":"","optionC":"","optionD":"","correctOption":"A","explanation":"","trick":""}]}

Avoid repeating these stems:
- ${avoid || "(none)"}`;

  const res = await fetch(`${OLLAMA_BASE}/api/generate`, {
    method: "POST",
    headers: ollamaHeaders(),
    body: JSON.stringify({
      model: OLLAMA_MODEL,
      prompt,
      stream: false,
      format: "json",
      options: { temperature: 0.95, top_p: 0.9, num_predict: 2200 },
    }),
  });
  if (!res.ok) throw new Error(`Ollama generate failed: ${res.status}`);
  const data = (await res.json()) as { response?: string };
  const parsed = extractJson(data.response || "{}") as {
    questions?: Record<string, unknown>[];
  };
  const list = Array.isArray(parsed.questions) ? parsed.questions : [];
  const out: ModelMcq[] = [];
  for (const raw of list) {
    const q = normalizeMcq(raw, args.topicTitle, args.subtopicTitle);
    if (q) out.push(q);
  }
  return out;
}
