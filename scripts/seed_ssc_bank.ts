/**
 * Seed BankQuestion to ≥1000 SSC-tagged MCQs (fast batch insert).
 * Usage: npx tsx scripts/seed_ssc_bank.ts
 */

import "dotenv/config";
import { createHash } from "crypto";
import { readFileSync, existsSync } from "fs";
import path from "path";
import { prisma } from "../src/lib/db";
import { PRACTICE_SYLLABUS } from "../src/lib/exam/taxonomy";
import { stemFingerprint } from "../src/lib/exam/modelGenerate";
import { generateBankBatch } from "../src/lib/exam/bankFillGenerators";
import type { SeedQuestion } from "../src/lib/exam/questionBank";

const TARGET = 1000;
const PER_TOPIC = 40;

function bankFp(stem: string): string {
  const soft = stemFingerprint(stem);
  const hard = createHash("sha1").update(stem.toLowerCase().trim()).digest("hex").slice(0, 10);
  return `${soft}::${hard}`;
}

type Row = {
  sectionKey: string;
  topicId: string;
  subtopicId: string | null;
  subject: string;
  topic: string;
  subtopic: string | null;
  difficulty: string;
  stemEn: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctOption: string;
  explanation: string | null;
  trick: string | null;
  source: string;
  fingerprint: string;
  verified: boolean;
  quality: number;
};

function clean(s: string | null | undefined): string {
  return String(s ?? "")
    .replace(/\u0000/g, "")
    .replace(/[\uD800-\uDFFF]/g, "")
    .trim();
}

function toRow(q: SeedQuestion, topicId: string, subtopicId?: string): Row | null {
  const stemEn = clean(q.stemEn);
  if (stemEn.length < 15) return null;
  const optionA = clean(q.optionA);
  const optionB = clean(q.optionB);
  const optionC = clean(q.optionC);
  const optionD = clean(q.optionD);
  if (![optionA, optionB, optionC, optionD].every((o) => o.length > 0)) return null;
  return {
    sectionKey: clean(q.sectionKey) || "quant",
    topicId,
    subtopicId: subtopicId ?? null,
    subject: clean(q.subject) || "Quant",
    topic: clean(q.topic) || topicId,
    subtopic: q.subtopic ? clean(q.subtopic) : null,
    difficulty: clean(q.difficulty) || "medium",
    stemEn,
    optionA,
    optionB,
    optionC,
    optionD,
    correctOption: clean(q.correctOption).slice(0, 1).toUpperCase() || "A",
    explanation: clean(q.explanation) || null,
    trick: q.trick ? clean(q.trick) : null,
    source: clean(q.source) || "generator",
    fingerprint: bankFp(stemEn),
    verified: q.sectionKey === "quant",
    quality: 1,
  };
}

function loadOfficial(): SeedQuestion[] {
  const file = path.join(process.cwd(), "data", "sscgl_official.json");
  if (!existsSync(file)) return [];
  try {
    const raw = JSON.parse(readFileSync(file, "utf8")) as {
      questions?: Array<Record<string, string>>;
    };
    const list = raw.questions ?? [];
    return list.map((q, i) => ({
      qIndex: i + 1,
      sectionKey: q.sectionKey || "ga",
      subject: q.subject || "General Awareness",
      topic: q.topic || "Static GK",
      difficulty: "medium",
      stemEn: String(q.stemEn || q.stem || ""),
      optionA: q.optionA,
      optionB: q.optionB,
      optionC: q.optionC,
      optionD: q.optionD,
      correctOption: q.correctOption,
      explanation: q.explanation || "",
      marks: 2,
      negativeMarks: 0.5,
      source: "sscgl_official",
    }));
  } catch {
    return [];
  }
}

function guessTopicId(sectionKey: string, topicTitle: string): string {
  const subj = PRACTICE_SYLLABUS.find((s) => s.key === sectionKey);
  if (!subj) return sectionKey;
  const t = topicTitle.toLowerCase();
  for (const topic of subj.topics) {
    if (
      t.includes(topic.title.toLowerCase().slice(0, 6)) ||
      topic.title.toLowerCase().includes(t.slice(0, 6))
    ) {
      return topic.id;
    }
  }
  return subj.topics[0]?.id ?? sectionKey;
}

async function flush(rows: Row[]) {
  if (rows.length === 0) return 0;
  // Dedupe within batch
  const map = new Map<string, Row>();
  for (const r of rows) map.set(r.fingerprint, r);
  const unique = [...map.values()];
  const result = await prisma.bankQuestion.createMany({
    data: unique,
    skipDuplicates: true,
  });
  return result.count;
}

async function main() {
  console.log("Seeding SSC BankQuestion (batch)…");
  const buffer: Row[] = [];
  let inserted = 0;

  for (const q of loadOfficial()) {
    const topicId = guessTopicId(q.sectionKey, q.topic);
    const row = toRow(q, topicId);
    if (row) buffer.push(row);
  }

  for (const subject of PRACTICE_SYLLABUS) {
    for (const topic of subject.topics) {
      const sub = topic.subtopics[0];
      for (let round = 0; round < 8; round++) {
        const batch = generateBankBatch({
          sectionKey: subject.key,
          topicId: topic.id,
          topicTitle: topic.title,
          subtopicTitle: sub?.title,
          setNo: 2000 + round * 1009 + subject.key.length * 50 + topic.id.length * 7,
          count: Math.ceil(PER_TOPIC / 4),
        });
        for (const q of batch) {
          const row = toRow(
            { ...q, topic: topic.title, subtopic: sub?.title },
            topic.id,
            sub?.id,
          );
          if (row) buffer.push(row);
        }
      }
      console.log(` buffered ${subject.key}/${topic.id}`);
    }
  }

  // Flush in chunks of 200
  for (let i = 0; i < buffer.length; i += 200) {
    const chunk = buffer.slice(i, i + 200);
    inserted += await flush(chunk);
    console.log(`  inserted so far ~${inserted}`);
  }

  const total = await prisma.bankQuestion.count();
  console.log(`Done. BankQuestion total = ${total} (target ${TARGET}, new this run ~${inserted})`);
  await prisma.$disconnect();
}

main().catch(async (e) => {
  console.error(e);
  await prisma.$disconnect();
  process.exit(1);
});
