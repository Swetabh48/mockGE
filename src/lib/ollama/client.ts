const OLLAMA_URL = process.env.OLLAMA_URL ?? "http://127.0.0.1:11434";
const PREFERRED_MODELS = ["qwen2.5", "qwen2.5:7b", "llama3.2", "llama3.1", "llama3"];

export type OllamaStatus = {
  connected: boolean;
  model: string | null;
  models: string[];
  message: string;
};

export async function getOllamaStatus(): Promise<OllamaStatus> {
  try {
    const res = await fetch(`${OLLAMA_URL}/api/tags`, {
      signal: AbortSignal.timeout(2500),
    });
    if (!res.ok) {
      return {
        connected: false,
        model: null,
        models: [],
        message: "Ollama not reachable",
      };
    }
    const data = (await res.json()) as {
      models?: { name: string }[];
    };
    const models = (data.models ?? []).map((m) => m.name);
    const model =
      PREFERRED_MODELS.find((p) => models.some((m) => m === p || m.startsWith(`${p}:`))) ??
      models[0] ??
      null;
    return {
      connected: true,
      model,
      models,
      message: model ? `Connected (${model})` : "Connected (no preferred model pulled)",
    };
  } catch {
    return {
      connected: false,
      model: null,
      models: [],
      message: "Ollama not reachable",
    };
  }
}

export type GeneratedQuestion = {
  stemEn: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctOption: "A" | "B" | "C" | "D";
  topic: string;
  explanation: string;
};

export async function generateQuestionsWithOllama(params: {
  subject: string;
  topic: string;
  count: number;
  model: string;
}): Promise<GeneratedQuestion[]> {
  const prompt = `You are an SSC CGL exam question setter. Generate exactly ${params.count} original multiple-choice questions for subject "${params.subject}" focusing on topic "${params.topic}".
Return ONLY valid JSON array. Each item must have keys: stemEn, optionA, optionB, optionC, optionD, correctOption (A|B|C|D), topic, explanation.
Questions must be exam-appropriate, unambiguous, with exactly one correct option. Do not copy copyrighted papers verbatim.`;

  const res = await fetch(`${OLLAMA_URL}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: params.model,
      stream: false,
      format: "json",
      messages: [
        { role: "system", content: "Output JSON only." },
        { role: "user", content: prompt },
      ],
    }),
    signal: AbortSignal.timeout(180000),
  });

  if (!res.ok) {
    throw new Error(`Ollama error: ${res.status}`);
  }

  const data = (await res.json()) as { message?: { content?: string } };
  const content = data.message?.content ?? "[]";
  let parsed: unknown;
  try {
    parsed = JSON.parse(content);
  } catch {
    const match = content.match(/\[[\s\S]*\]/);
    if (!match) throw new Error("Model did not return JSON array");
    parsed = JSON.parse(match[0]);
  }

  const arr = Array.isArray(parsed)
    ? parsed
    : Array.isArray((parsed as { questions?: unknown }).questions)
      ? (parsed as { questions: unknown[] }).questions
      : [];

  return arr
    .map((raw) => {
      const q = raw as Record<string, string>;
      const correct = (q.correctOption ?? "A").toUpperCase();
      if (!["A", "B", "C", "D"].includes(correct)) return null;
      if (!q.stemEn || !q.optionA || !q.optionB || !q.optionC || !q.optionD) return null;
      return {
        stemEn: String(q.stemEn),
        optionA: String(q.optionA),
        optionB: String(q.optionB),
        optionC: String(q.optionC),
        optionD: String(q.optionD),
        correctOption: correct as "A" | "B" | "C" | "D",
        topic: String(q.topic || params.topic),
        explanation: String(q.explanation || ""),
      };
    })
    .filter(Boolean) as GeneratedQuestion[];
}
