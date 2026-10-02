import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import {
  buildSectionPractice,
  buildTopicPractice,
} from "@/lib/exam/questionBank";
import {
  PRACTICE_SYLLABUS,
  findSubject,
  findTopic,
  type PracticeSubjectKey,
} from "@/lib/exam/taxonomy";
import {
  generateUniqueTopicSet,
  isNovelStem,
  ollamaAvailable,
  stemFingerprint,
} from "@/lib/exam/modelGenerate";
import type { SeedQuestion } from "@/lib/exam/questionBank";

export const maxDuration = 300;

/**
 * Unlimited practice: MODEL invents new stems every click.
 * Official PDFs are NEVER injected into Generate.
 * Prior stems for this topic are banned (fingerprint-level).
 */
export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as {
    kind?: "section" | "topic";
    subject?: PracticeSubjectKey;
    topicId?: string;
    subtopicId?: string;
    count?: number;
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
  const setNo =
    existing * 9973 +
    (Date.now() % 1_000_003) +
    Math.floor(Math.random() * 100_000);

  if (kind === "topic") {
    const topic = body.topicId ? findTopic(subjectKey, body.topicId) : subject.topics[0];
    if (!topic) {
      return NextResponse.json({ error: "Unknown topic" }, { status: 400 });
    }
    const sub =
      topic.subtopics.find((s) => s.id === body.subtopicId) ?? topic.subtopics[0]!;

    // Ban everything this student has already seen on this topic (up to 500)
    const prior = await prisma.question.findMany({
      where: { paper: { focusTopic: topic.id, tier: "practice" } },
      orderBy: { id: "desc" },
      take: 500,
      select: { stemEn: true },
    });
    const bannedStems = prior.map((q) => q.stemEn);
    const bannedFingerprints = new Set(bannedStems.map(stemFingerprint));

    const need = 10;
    let questions: SeedQuestion[] = [];
    let source = "algorithmic";

    const modelUp = await ollamaAvailable();
    if (modelUp) {
      try {
        const invented = await generateUniqueTopicSet({
          subjectTitle: subject.title,
          topicTitle: topic.title,
          subtopicTitle: sub.title,
          need,
          bannedFingerprints,
          bannedStems,
        });
        questions = invented.map((q, i) => ({
          qIndex: i + 1,
          sectionKey: subjectKey,
          subject: subject.title,
          topic: topic.title,
          subtopic: sub.title,
          difficulty: "hard",
          stemEn: q.stemEn,
          optionA: q.optionA,
          optionB: q.optionB,
          optionC: q.optionC,
          optionD: q.optionD,
          correctOption: q.correctOption,
          explanation: q.explanation,
          trick: q.trick,
          marks: 2,
          negativeMarks: 0.5,
          source: "model",
        }));
        source = questions.length >= need ? "model" : "model+partial";
      } catch {
        questions = [];
        source = "algorithmic";
      }
    }

    // Emergency fill: algorithmic ONLY with fingerprints not yet used (never PDFs)
    if (questions.length < need) {
      const seen = new Set([
        ...bannedFingerprints,
        ...questions.map((q) => stemFingerprint(q.stemEn)),
      ]);
      for (let round = 0; round < 40 && questions.length < need; round++) {
        const batch = buildTopicPractice(
          subjectKey,
          topic.title,
          sub.title,
          setNo + round * 7919 + Math.floor(Math.random() * 5000),
          topic.id,
        );
        for (const p of batch) {
          if (!isNovelStem(p.stemEn, seen)) continue;
          seen.add(stemFingerprint(p.stemEn));
          questions.push({
            ...p,
            qIndex: questions.length + 1,
            topic: topic.title,
            subtopic: sub.title,
            source: questions.some((q) => q.source === "model") ? "model+algo" : "algorithmic",
          });
          if (questions.length >= need) break;
        }
      }
      if (!source.startsWith("model")) source = "algorithmic";
      else if (questions.some((q) => q.source !== "model")) source = "model+algo";
    }

    const paper = await prisma.paper.create({
      data: {
        title: `${subject.title} · ${topic.title} · ${sub.title} (fresh #${existing + 1})`,
        tier: "practice",
        mode: "topic_practice",
        focusSection: subjectKey,
        focusTopic: topic.id,
        focusSubtopic: sub.id,
        source,
        difficulty: "hard",
        questions: {
          create: questions.slice(0, need).map((q, i) => ({ ...q, qIndex: i + 1 })),
        },
      },
    });

    return NextResponse.json({
      paperId: paper.id,
      questionCount: Math.min(need, questions.length),
      title: paper.title,
      source,
      model: source.startsWith("model"),
      unique: true,
      bannedPrior: bannedStems.length,
    });
  }

  const questions = buildSectionPractice(subjectKey, setNo);
  const paper = await prisma.paper.create({
    data: {
      title: `${subject.title} — Unlimited drill #${existing + 1} (${questions.length} Q)`,
      tier: "practice",
      mode: "practice",
      focusSection: subjectKey,
      source: "unlimited_practice",
      difficulty: "hard",
      questions: { create: questions },
    },
  });

  return NextResponse.json({
    paperId: paper.id,
    questionCount: questions.length,
    title: paper.title,
    syllabusTopics: PRACTICE_SYLLABUS.find((s) => s.key === subjectKey)?.topics.length,
  });
}
