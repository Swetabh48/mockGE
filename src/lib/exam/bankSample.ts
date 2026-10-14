/**
 * Sample from BankQuestion into Paper + Question rows for CBT.
 */

import { prisma } from "@/lib/db";
import { PRACTICE_SYLLABUS, type PracticeSubjectKey } from "./taxonomy";
import { stemFingerprint } from "./modelGenerate";

export type BankRow = {
  id: string;
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
};

function shuffleInPlace<T>(arr: T[], salt: number): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.abs(salt * 17 + i * 13) % (i + 1);
    [a[i], a[j]] = [a[j]!, a[i]!];
  }
  return a;
}

function toCreateQuestion(b: BankRow, qIndex: number) {
  return {
    qIndex,
    sectionKey: b.sectionKey,
    subject: b.subject,
    topic: b.topic,
    subtopic: b.subtopic ?? undefined,
    difficulty: b.difficulty,
    stemEn: b.stemEn,
    optionA: b.optionA,
    optionB: b.optionB,
    optionC: b.optionC,
    optionD: b.optionD,
    correctOption: b.correctOption,
    explanation: b.explanation ?? undefined,
    trick: b.trick ?? undefined,
    marks: 2,
    negativeMarks: 0.5,
    source: b.source.startsWith("bank") ? b.source : `bank:${b.source}`,
  };
}

async function fetchPool(args: {
  sectionKey?: string;
  topicId?: string;
  take?: number;
}): Promise<BankRow[]> {
  return prisma.bankQuestion.findMany({
    where: {
      ...(args.sectionKey ? { sectionKey: args.sectionKey } : {}),
      ...(args.topicId ? { topicId: args.topicId } : {}),
    },
    orderBy: { id: "asc" },
    take: args.take ?? 2000,
  });
}

function pickNovel(
  pool: BankRow[],
  need: number,
  banned: Set<string>,
  salt: number,
): BankRow[] {
  const shuffled = shuffleInPlace(pool, salt);
  const out: BankRow[] = [];
  const seen = new Set(banned);
  for (const q of shuffled) {
    if (out.length >= need) break;
    const fp = q.fingerprint || stemFingerprint(q.stemEn);
    if (seen.has(fp)) continue;
    seen.add(fp);
    out.push(q);
  }
  return out;
}

/** Sample N questions for one taxonomy topicId. */
export async function sampleTopic(
  topicId: string,
  n: number,
  bannedFingerprints: Set<string> = new Set(),
  salt = Date.now(),
): Promise<BankRow[]> {
  const pool = await fetchPool({ topicId, take: 3000 });
  return pickNovel(pool, n, bannedFingerprints, salt);
}

/** Sample N questions for a section, round-robin across topics. */
export async function sampleSection(
  sectionKey: PracticeSubjectKey,
  n: number,
  bannedFingerprints: Set<string> = new Set(),
  salt = Date.now(),
): Promise<BankRow[]> {
  const subject = PRACTICE_SYLLABUS.find((s) => s.key === sectionKey);
  const topics = subject?.topics ?? [];
  if (topics.length === 0) {
    const pool = await fetchPool({ sectionKey, take: 3000 });
    return pickNovel(pool, n, bannedFingerprints, salt);
  }

  const per = Math.max(1, Math.ceil(n / topics.length));
  const banned = new Set(bannedFingerprints);
  const out: BankRow[] = [];
  let i = 0;
  for (const t of topics) {
    if (out.length >= n) break;
    const need = Math.min(per, n - out.length);
    const batch = await sampleTopic(t.id, need, banned, salt + i * 97);
    for (const q of batch) {
      banned.add(q.fingerprint);
      out.push(q);
      if (out.length >= n) break;
    }
    i += 1;
  }
  if (out.length < n) {
    const pool = await fetchPool({ sectionKey, take: 3000 });
    const more = pickNovel(pool, n - out.length, banned, salt + 999);
    out.push(...more);
  }
  return out.slice(0, n);
}

/** 25 Quant + 25 Reasoning + 25 English + 25 GA. */
export async function sampleDaily100(
  bannedFingerprints: Set<string> = new Set(),
  salt = Date.now(),
): Promise<BankRow[]> {
  const sections: PracticeSubjectKey[] = ["quant", "reasoning", "english", "ga"];
  const banned = new Set(bannedFingerprints);
  const out: BankRow[] = [];
  for (let i = 0; i < sections.length; i++) {
    const batch = await sampleSection(sections[i]!, 25, banned, salt + i * 1009);
    for (const q of batch) {
      banned.add(q.fingerprint);
      out.push(q);
    }
  }
  return out;
}

export async function materializePaper(args: {
  title: string;
  mode: string;
  focusSection?: string | null;
  focusTopic?: string | null;
  focusSubtopic?: string | null;
  source?: string;
  rows: BankRow[];
}): Promise<{ paperId: string; questionCount: number; title: string }> {
  if (args.rows.length === 0) {
    throw new Error("Cannot materialize empty paper");
  }
  const paper = await prisma.paper.create({
    data: {
      title: args.title,
      tier: "practice",
      mode: args.mode,
      focusSection: args.focusSection ?? undefined,
      focusTopic: args.focusTopic ?? undefined,
      focusSubtopic: args.focusSubtopic ?? undefined,
      source: args.source ?? "bank",
      difficulty: "hard",
      questions: {
        create: args.rows.map((r, i) => toCreateQuestion(r, i + 1)),
      },
    },
  });
  return {
    paperId: paper.id,
    questionCount: args.rows.length,
    title: paper.title,
  };
}

export async function bankStats(): Promise<{
  total: number;
  bySection: Record<string, number>;
  byTopic: Record<string, number>;
}> {
  const [total, sections, topics] = await Promise.all([
    prisma.bankQuestion.count(),
    prisma.bankQuestion.groupBy({ by: ["sectionKey"], _count: { _all: true } }),
    prisma.bankQuestion.groupBy({ by: ["topicId"], _count: { _all: true } }),
  ]);
  const bySection: Record<string, number> = {};
  for (const s of sections) bySection[s.sectionKey] = s._count._all;
  const byTopic: Record<string, number> = {};
  for (const t of topics) byTopic[t.topicId] = t._count._all;
  return { total, bySection, byTopic };
}

/** Fingerprints from recent daily packs for a guest (last N days). */
export async function bannedFingerprintsForGuest(
  guestId: string,
  lastDays = 7,
): Promise<Set<string>> {
  const since = new Date();
  since.setUTCDate(since.getUTCDate() - lastDays);
  const packs = await prisma.dailyPack.findMany({
    where: { guestId, createdAt: { gte: since } },
    select: { paperId: true },
    take: 14,
  });
  if (packs.length === 0) return new Set();
  const qs = await prisma.question.findMany({
    where: { paperId: { in: packs.map((p) => p.paperId) } },
    select: { stemEn: true },
    take: 800,
  });
  return new Set(qs.map((q) => stemFingerprint(q.stemEn)));
}

export function utcDateString(d = new Date()): string {
  return d.toISOString().slice(0, 10);
}
