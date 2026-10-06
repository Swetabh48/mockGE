/**
 * Live question generation via mockge-ssc (Ollama / Modal).
 * Every Generate call must invent NEW stems — never reuse PDFs or prior sets.
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

/** Fingerprint ignores numbers so "A in 10 days" ≈ "A in 12 days" counts as same pattern clone. */
export function stemFingerprint(stem: string): string {
  return stem
    .toLowerCase()
    .replace(/rs\.?\s*/g, "")
    .replace(/[\d.,]+/g, "#")
    .replace(/[^a-z#\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 160);
}

export function isNovelStem(stem: string, seen: Set<string>): boolean {
  const fp = stemFingerprint(stem);
  if (!fp || fp.length < 20) return false;
  if (seen.has(fp)) return false;
  return true;
}

function isAbortError(e: unknown): boolean {
  if (!e || typeof e !== "object") return false;
  const name = "name" in e ? String((e as { name?: string }).name) : "";
  const msg = "message" in e ? String((e as { message?: string }).message) : "";
  return name === "AbortError" || /aborted|abort/i.test(msg);
}

let modelWarmed = false;

export async function ollamaAvailable(): Promise<boolean> {
  try {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 20_000);
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
    // Cold start / probe abort — still try generate; don't 503 as "offline"
    return true;
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
  if (/time\s*&\s*work|work\s*&\s*wages|pipes/i.test(topicTitle + " " + (sub || ""))) {
    if (
      /compound interest|simple interest|marked price|successive discount/i.test(stemEn) &&
      !/work|wage|pipe|day|hour|efficien/i.test(stemEn)
    ) {
      return null;
    }
  }
  return {
    stemEn,
    optionA,
    optionB,
    optionC,
    optionD,
    correctOption,
    explanation: String(raw.explanation || "Solve using the standard method for this pattern.").trim(),
    trick: String(
      raw.trick || "Use the topic shortcut from Formulas & Tricks; verify with one line of working.",
    ).trim(),
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
  noveltyNonce?: string;
}): Promise<ModelMcq[]> {
  const avoidList = args.avoidStems ?? [];
  const avoid = avoidList
    .slice(-30)
    .map((s) => s.slice(0, 90))
    .join("\n- ");
  const nonce =
    args.noveltyNonce ||
    `${Date.now()}-${Math.random().toString(36).slice(2, 10)}-${Math.floor(Math.random() * 1e9)}`;

  const count = Math.max(1, Math.min(3, args.count));
  const prompt = `You are mockGE's trained SSC-CGL question setter (mockge-ssc). Invent EXACTLY ${count} brand-new hard MCQs.

Novelty id (must change names, facts, and numbers): ${nonce}

Subject: ${args.subjectTitle}
Topic: ${args.topicTitle}
Subtopic: ${args.subtopicTitle || "general"}

HARD RULES:
1. STRICTLY only ${args.topicTitle}${args.subtopicTitle ? ` / ${args.subtopicTitle}` : ""}.
2. Invent NEW questions from trained exam knowledge. Do NOT copy PYQs or PDFs.
3. Do NOT reuse stems under AVOID.
4. 4 options A–D, exactly one correct.
5. explanation: 2–4 sentences on why the correct option is right (specific to this stem).
6. trick: one unique 10-second memory for THIS stem only.
7. JSON ONLY:
{"questions":[{"stemEn":"","optionA":"","optionB":"","optionC":"","optionD":"","correctOption":"A","explanation":"","trick":""}]}

AVOID:
- ${avoid || "(none yet)"}`;

  const waitMs = modelWarmed ? 90_000 : 140_000;
  const ctrl = new AbortController();
  const kill = setTimeout(() => ctrl.abort(), waitMs);
  try {
    const res = await fetch(`${OLLAMA_BASE}/api/generate`, {
      method: "POST",
      headers: ollamaHeaders(),
      signal: ctrl.signal,
      body: JSON.stringify({
        model: OLLAMA_MODEL,
        prompt,
        stream: false,
        format: "json",
        options: {
          temperature: 1.15,
          top_p: 0.95,
          top_k: 80,
          num_predict: 1100,
          seed: Math.floor(Math.random() * 2_147_483_647),
        },
      }),
    });
    if (!res.ok) return [];
    modelWarmed = true;
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
  } catch (e) {
    if (isAbortError(e)) return [];
    return [];
  } finally {
    clearTimeout(kill);
  }
}

/** Keep calling the model until we have `need` novel questions or attempts/deadline exhausted. */
export async function generateUniqueTopicSet(args: {
  subjectTitle: string;
  topicTitle: string;
  subtopicTitle?: string;
  need: number;
  bannedFingerprints: Set<string>;
  bannedStems: string[];
  maxAttempts?: number;
  deadlineMs?: number;
}): Promise<ModelMcq[]> {
  const collected: ModelMcq[] = [];
  const seen = new Set(args.bannedFingerprints);
  const avoid = [...args.bannedStems];
  const maxAttempts = args.maxAttempts ?? 6;
  const deadline = args.deadlineMs ?? Date.now() + 200_000;

  for (let attempt = 0; attempt < maxAttempts && collected.length < args.need; attempt++) {
    if (Date.now() > deadline) break;
    const batch = await generateTopicQuestionsWithModel({
      subjectTitle: args.subjectTitle,
      topicTitle: args.topicTitle,
      subtopicTitle: args.subtopicTitle,
      count: Math.min(3, args.need - collected.length),
      avoidStems: avoid,
      noveltyNonce: `set-${Date.now()}-try-${attempt}-${Math.random().toString(36).slice(2)}`,
    });
    for (const q of batch) {
      if (!isNovelStem(q.stemEn, seen)) continue;
      seen.add(stemFingerprint(q.stemEn));
      avoid.push(q.stemEn);
      collected.push(q);
      if (collected.length >= args.need) break;
    }
  }
  return collected;
}

/**
 * Invent a full section set by round-robining topics through the model only.
 * Never touches PDF banks or static question banks.
 */
export async function inventSectionWithModel(args: {
  subjectTitle: string;
  topics: { title: string; subtopic?: string }[];
  need: number;
  bannedFingerprints: Set<string>;
  bannedStems: string[];
  deadlineMs?: number;
}): Promise<ModelMcq[]> {
  const collected: ModelMcq[] = [];
  const seen = new Set(args.bannedFingerprints);
  const avoid = [...args.bannedStems];
  const topics = args.topics.length ? args.topics : [{ title: args.subjectTitle }];
  const deadline = args.deadlineMs ?? Date.now() + 200_000;
  let topicIdx = 0;
  let rounds = 0;
  const maxRounds = Math.min(8, Math.max(topics.length * 2, 6));

  while (collected.length < args.need && rounds < maxRounds && Date.now() < deadline) {
    const t = topics[topicIdx % topics.length]!;
    topicIdx += 1;
    rounds += 1;
    const batch = await generateTopicQuestionsWithModel({
      subjectTitle: args.subjectTitle,
      topicTitle: t.title,
      subtopicTitle: t.subtopic,
      count: Math.min(3, args.need - collected.length),
      avoidStems: avoid,
      noveltyNonce: `sec-${Date.now()}-r${rounds}-${Math.random().toString(36).slice(2)}`,
    });
    for (const q of batch) {
      if (!isNovelStem(q.stemEn, seen)) continue;
      seen.add(stemFingerprint(q.stemEn));
      avoid.push(q.stemEn);
      collected.push({ ...q, topic: t.title, subtopic: t.subtopic });
      if (collected.length >= args.need) break;
    }
  }
  return collected;
}
