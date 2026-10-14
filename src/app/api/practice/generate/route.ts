import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import {
  PRACTICE_SYLLABUS,
  findSubject,
  findTopic,
  type PracticeSubjectKey,
} from "@/lib/exam/taxonomy";
import {
  generateUniqueTopicSet,
  ollamaAvailable,
  stemFingerprint,
} from "@/lib/exam/modelGenerate";
import {
  materializePaper,
  sampleSection,
  sampleTopic,
  type BankRow,
} from "@/lib/exam/bankSample";
import { buildTopicPractice, buildSectionPractice } from "@/lib/exam/questionBank";
import { validateAndRepairMcqAsync } from "@/lib/exam/validateMcq";
import type { SeedQuestion } from "@/lib/exam/questionBank";

export const maxDuration = 300;

/**
 * Practice Generate: bank-first. Invent+verify only to top up thin topics.
 */
export async function POST(request: Request) {
  try {
    return await handleGenerate(request);
  } catch (e) {
    const aborted =
      !!e &&
      typeof e === "object" &&
      /abort/i.test(`${(e as Error).name} ${(e as Error).message}`);
    return NextResponse.json(
      {
        error: aborted
          ? "Request aborted. Click Generate again."
          : e instanceof Error
            ? e.message
            : "Generate failed",
      },
      { status: aborted ? 503 : 500 },
    );
  }
}

function seedToBankish(q: SeedQuestion, topicId: string): BankRow {
  return {
    id: `tmp-${stemFingerprint(q.stemEn)}`,
    sectionKey: q.sectionKey,
    topicId,
    subtopicId: null,
    subject: q.subject,
    topic: q.topic,
    subtopic: q.subtopic ?? null,
    difficulty: q.difficulty,
    stemEn: q.stemEn,
    optionA: q.optionA,
    optionB: q.optionB,
    optionC: q.optionC,
    optionD: q.optionD,
    correctOption: q.correctOption,
    explanation: q.explanation,
    trick: q.trick ?? null,
    source: q.source,
    fingerprint: stemFingerprint(q.stemEn),
  };
}

async function inventTopicTopUp(args: {
  subjectTitle: string;
  topicTitle: string;
  subtopicTitle?: string;
  topicId: string;
  sectionKey: string;
  need: number;
  banned: Set<string>;
}): Promise<BankRow[]> {
  if (args.need <= 0) return [];
  const modelUp = await ollamaAvailable();
  if (!modelUp) return [];

  try {
    const invented = await generateUniqueTopicSet({
      subjectTitle: args.subjectTitle,
      topicTitle: args.topicTitle,
      subtopicTitle: args.subtopicTitle,
      need: args.need,
      bannedFingerprints: args.banned,
      bannedStems: [],
      maxAttempts: 4,
      deadlineMs: Date.now() + 120_000,
    });
    const out: BankRow[] = [];
    for (const q of invented) {
      const repaired = await validateAndRepairMcqAsync({
        ...q,
        topic: args.topicTitle,
        subtopic: args.subtopicTitle,
      });
      if (!repaired) continue;
      const fp = stemFingerprint(repaired.stemEn);
      if (args.banned.has(fp)) continue;
      args.banned.add(fp);
      out.push({
        id: `invent-${fp}`,
        sectionKey: args.sectionKey,
        topicId: args.topicId,
        subtopicId: null,
        subject: args.subjectTitle,
        topic: repaired.topic || args.topicTitle,
        subtopic: repaired.subtopic || args.subtopicTitle || null,
        difficulty: "hard",
        stemEn: repaired.stemEn,
        optionA: repaired.optionA,
        optionB: repaired.optionB,
        optionC: repaired.optionC,
        optionD: repaired.optionD,
        correctOption: repaired.correctOption,
        explanation: repaired.explanation,
        trick: repaired.trick,
        source: "model",
        fingerprint: fp,
      });
    }
    return out;
  } catch {
    return [];
  }
}

async function handleGenerate(request: Request) {
  const body = (await request.json().catch(() => ({}))) as {
    kind?: "section" | "topic";
    subject?: PracticeSubjectKey;
    topicId?: string;
    subtopicId?: string;
  };

  const kind = body.kind ?? "section";
  const subjectKey = (body.subject ?? "quant") as PracticeSubjectKey;
  const subject = findSubject(subjectKey);
  if (!subject) {
    return NextResponse.json({ error: "Unknown subject" }, { status: 400 });
  }

  const existing = await prisma.paper.count({
    where: {
      tier: "practice",
      focusSection: subjectKey,
      ...(kind === "topic" && body.topicId
        ? { focusTopic: body.topicId, focusSubtopic: body.subtopicId ?? undefined }
        : { mode: "practice" }),
    },
  });

  const prior = await prisma.question.findMany({
    where: {
      paper: {
        tier: "practice",
        focusSection: subjectKey,
        ...(kind === "topic" && body.topicId ? { focusTopic: body.topicId } : {}),
      },
    },
    orderBy: { id: "desc" },
    take: 150,
    select: { stemEn: true },
  });
  const banned = new Set(prior.map((q) => stemFingerprint(q.stemEn)));

  // ---------- TOPIC ----------
  if (kind === "topic") {
    const topic = body.topicId ? findTopic(subjectKey, body.topicId) : subject.topics[0];
    if (!topic) {
      return NextResponse.json({ error: "Unknown topic" }, { status: 400 });
    }
    const sub =
      topic.subtopics.find((s) => s.id === body.subtopicId) ?? topic.subtopics[0];
    const need = 10;

    let rows = await sampleTopic(topic.id, need, banned, Date.now());
    for (const r of rows) banned.add(r.fingerprint);

    if (rows.length < need) {
      const invent = await inventTopicTopUp({
        subjectTitle: subject.title,
        topicTitle: topic.title,
        subtopicTitle: sub?.title,
        topicId: topic.id,
        sectionKey: subjectKey,
        need: need - rows.length,
        banned,
      });
      rows = [...rows, ...invent];
    }

    if (rows.length < need) {
      const algo = buildTopicPractice(
        subjectKey,
        topic.title,
        sub?.title,
        existing * 7919 + Date.now() % 100000,
        topic.id,
      );
      for (const q of algo) {
        if (rows.length >= need) break;
        const fp = stemFingerprint(q.stemEn);
        if (banned.has(fp)) continue;
        banned.add(fp);
        rows.push(seedToBankish({ ...q, topic: topic.title, subtopic: sub?.title }, topic.id));
      }
    }

    if (rows.length < 5) {
      return NextResponse.json(
        {
          error: `Not enough bank questions for ${topic.title} (${rows.length}). Run db seed bank.`,
          bankShort: true,
        },
        { status: 503 },
      );
    }

    const paper = await materializePaper({
      title: `${subject.title} · ${topic.title}${sub ? ` · ${sub.title}` : ""} (${rows.length} Q)`,
      mode: "topic_practice",
      focusSection: subjectKey,
      focusTopic: topic.id,
      focusSubtopic: sub?.id,
      source: rows.every((r) => r.source.startsWith("bank") || r.source === "generator")
        ? "bank"
        : "bank+fill",
      rows: rows.slice(0, need),
    });

    return NextResponse.json({
      paperId: paper.paperId,
      questionCount: paper.questionCount,
      title: paper.title,
      source: "bank",
      model: false,
      modelOnline: true,
      unique: true,
      fromBank: true,
    });
  }

  // ---------- SECTION ----------
  const need = 25;
  let rows = await sampleSection(subjectKey, need, banned, Date.now());
  for (const r of rows) banned.add(r.fingerprint);

  if (rows.length < need) {
    const pad = buildSectionPractice(subjectKey, existing * 1301 + (Date.now() % 50000));
    for (const q of pad) {
      if (rows.length >= need) break;
      const fp = stemFingerprint(q.stemEn);
      if (banned.has(fp)) continue;
      banned.add(fp);
      rows.push(
        seedToBankish(q, subject.topics[0]?.id ?? subjectKey),
      );
    }
  }

  if (rows.length < 10) {
    return NextResponse.json(
      {
        error: `Bank short for ${subject.title} (${rows.length} Q). Run seed bank.`,
        bankShort: true,
      },
      { status: 503 },
    );
  }

  const paper = await materializePaper({
    title: `${subject.title} — ${Math.min(need, rows.length)} new questions`,
    mode: "practice",
    focusSection: subjectKey,
    source: "bank",
    rows: rows.slice(0, need),
  });

  return NextResponse.json({
    paperId: paper.paperId,
    questionCount: paper.questionCount,
    title: paper.title,
    source: "bank",
    model: false,
    modelOnline: true,
    unique: true,
    fromBank: true,
    syllabusTopics: PRACTICE_SYLLABUS.find((s) => s.key === subjectKey)?.topics.length,
  });
}
