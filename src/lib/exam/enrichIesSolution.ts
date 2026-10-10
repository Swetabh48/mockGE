/**
 * Textbook-grounded detailed solutions for IES Civil questions.
 * Uses local chunk index under data/ies_textbook_index/ when present,
 * then Gemini (or fallback prose) to write the solution.
 */

import { readFileSync, existsSync, readdirSync } from "fs";
import { join } from "path";
import { geminiTextbookSolution } from "./geminiClient";
import { iesSubjectLabel } from "./iesTaxonomy";

export type IesSolutionContext = {
  stem: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctOption: string;
  subject: string;
  topic: string;
  explanation?: string | null;
  solutionDetail?: string | null;
};

type Chunk = { id: string; source: string; text: string; tokens?: string[] };

let chunkCache: Chunk[] | null = null;

function loadChunks(): Chunk[] {
  if (chunkCache) return chunkCache;
  const indexDir = join(process.cwd(), "data", "ies_textbook_index");
  const chunksPath = join(indexDir, "chunks.jsonl");
  const chunks: Chunk[] = [];
  if (existsSync(chunksPath)) {
    const lines = readFileSync(chunksPath, "utf-8").split("\n").filter(Boolean);
    for (const line of lines) {
      try {
        const o = JSON.parse(line) as Chunk;
        if (o.text) chunks.push(o);
      } catch {
        /* skip */
      }
    }
  }
  // Also ingest any plain .txt notes in textbooks folder
  const notesDir = join(process.cwd(), "data", "ies_textbooks");
  if (existsSync(notesDir)) {
    for (const name of readdirSync(notesDir)) {
      if (!name.endsWith(".txt") && !name.endsWith(".md")) continue;
      const text = readFileSync(join(notesDir, name), "utf-8");
      const parts = text.split(/\n{2,}/).filter((p) => p.trim().length > 80);
      parts.forEach((p, i) => {
        chunks.push({ id: `${name}-${i}`, source: name, text: p.trim().slice(0, 2000) });
      });
    }
  }
  chunkCache = chunks;
  return chunks;
}

function scoreChunk(chunk: Chunk, query: string): number {
  const q = query.toLowerCase().split(/\W+/).filter((w) => w.length > 3);
  const hay = chunk.text.toLowerCase();
  let score = 0;
  for (const w of q) {
    if (hay.includes(w)) score += 1;
  }
  return score;
}

export function retrieveTextbookContext(
  stem: string,
  subject: string,
  topic: string,
  k = 4,
): { context: string; citations: string[] } {
  const chunks = loadChunks();
  if (chunks.length === 0) {
    return { context: "", citations: [] };
  }
  const query = `${subject} ${topic} ${stem}`;
  const ranked = chunks
    .map((c) => ({ c, s: scoreChunk(c, query) }))
    .filter((x) => x.s > 0)
    .sort((a, b) => b.s - a.s)
    .slice(0, k);
  const citations = ranked.map((x) => x.c.source);
  const context = ranked
    .map((x) => `[${x.c.source}]\n${x.c.text}`)
    .join("\n\n---\n\n");
  return { context, citations };
}

export async function enrichIesSolution(
  ctx: IesSolutionContext,
): Promise<{ solutionDetail: string; solutionCitations: string }> {
  if (ctx.solutionDetail && ctx.solutionDetail.length > 80) {
    return {
      solutionDetail: ctx.solutionDetail,
      solutionCitations: "[]",
    };
  }

  const { context, citations } = retrieveTextbookContext(
    ctx.stem,
    ctx.subject,
    ctx.topic,
  );

  const { solutionDetail, citations: more } = await geminiTextbookSolution({
    stem: ctx.stem,
    options: {
      A: ctx.optionA,
      B: ctx.optionB,
      C: ctx.optionC,
      D: ctx.optionD,
    },
    correctOption: ctx.correctOption,
    subject: iesSubjectLabel(ctx.subject) || ctx.subject,
    topic: ctx.topic,
    textbookContext: context || undefined,
  });

  const allCites = [...new Set([...citations, ...more])];
  let detail = solutionDetail;
  if (ctx.explanation && !detail.includes(ctx.explanation.slice(0, 40))) {
    detail = `${detail}\n\nKey note: ${ctx.explanation}`;
  }

  return {
    solutionDetail: detail,
    solutionCitations: JSON.stringify(allCites),
  };
}

/** Sync fallback for report rendering when async enrichment is skipped. */
export function enrichIesSolutionSync(ctx: IesSolutionContext): string {
  if (ctx.solutionDetail && ctx.solutionDetail.length > 40) return ctx.solutionDetail;
  const { context, citations } = retrieveTextbookContext(ctx.stem, ctx.subject, ctx.topic, 2);
  const citeLine = citations.length ? `\nSources: ${citations.join(", ")}` : "";
  if (context) {
    return (
      `Correct option: ${ctx.correctOption}.\n\n` +
      `Textbook anchors:\n${context.slice(0, 1500)}\n\n` +
      (ctx.explanation || "") +
      citeLine
    );
  }
  return (
    (ctx.explanation || `Correct option ${ctx.correctOption}.`) +
    `\n\nReview ${iesSubjectLabel(ctx.subject)} (${ctx.topic}) in standard IES Civil textbooks` +
    " (e.g. strength of materials, fluid mechanics, soil mechanics, environmental engg. as applicable)." +
    citeLine
  );
}
