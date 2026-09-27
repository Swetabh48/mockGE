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

/**
 * Unlimited practice: spawn a fresh set from the algorithmic bank
 * (rotated by how many practice papers already exist).
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
  // Wide rotation so consecutive "Generate" clicks don't recycle the same stems
  const setNo = existing * 17 + Date.now() % 997;

  if (kind === "topic") {
    const topic = body.topicId ? findTopic(subjectKey, body.topicId) : subject.topics[0];
    if (!topic) {
      return NextResponse.json({ error: "Unknown topic" }, { status: 400 });
    }
    const sub =
      topic.subtopics.find((s) => s.id === body.subtopicId) ?? topic.subtopics[0]!;
    const questions = buildTopicPractice(
      subjectKey,
      topic.title,
      sub.title,
      setNo,
      topic.id,
    );
    const paper = await prisma.paper.create({
      data: {
        title: `${subject.title} · ${topic.title} · ${sub.title} (fresh #${existing + 1})`,
        tier: "practice",
        mode: "topic_practice",
        focusSection: subjectKey,
        focusTopic: topic.id,
        focusSubtopic: sub.id,
        source: "unlimited_practice",
        difficulty: "hard",
        questions: { create: questions },
      },
    });
    return NextResponse.json({
      paperId: paper.id,
      questionCount: questions.length,
      title: paper.title,
    });
  }

  const questions = buildSectionPractice(subjectKey, setNo);
  const paper = await prisma.paper.create({
    data: {
      title: `${subject.title} — Unlimited drill #${existing + 1} (${questions.length} Q · no timer)`,
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
