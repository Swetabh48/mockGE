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
  generateTopicQuestionsWithModel,
  ollamaAvailable,
} from "@/lib/exam/modelGenerate";
import type { SeedQuestion } from "@/lib/exam/questionBank";

export const maxDuration = 300;

/**
 * Unlimited practice: prefer live model generation (mockge-ssc via Ollama),
 * fall back to topic-locked algorithmic bank when model is offline.
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
  const setNo = existing * 97 + (Date.now() % 10007) + Math.floor(Math.random() * 500);

  if (kind === "topic") {
    const topic = body.topicId ? findTopic(subjectKey, body.topicId) : subject.topics[0];
    if (!topic) {
      return NextResponse.json({ error: "Unknown topic" }, { status: 400 });
    }
    const sub =
      topic.subtopics.find((s) => s.id === body.subtopicId) ?? topic.subtopics[0]!;

    const recent = await prisma.question.findMany({
      where: {
        paper: { focusTopic: topic.id, tier: "practice" },
      },
      orderBy: { qIndex: "asc" },
      take: 40,
      select: { stemEn: true },
    });
    const avoidStems = recent.map((q) => q.stemEn);

    let questions: SeedQuestion[] = [];
    let source = "algorithmic";

    const modelUp = await ollamaAvailable();
    if (modelUp) {
      try {
        // Generate in two batches for reliability
        const need = 10;
        const batch1 = await generateTopicQuestionsWithModel({
          subjectTitle: subject.title,
          topicTitle: topic.title,
          subtopicTitle: sub.title,
          count: 6,
          avoidStems,
        });
        const batch2 = await generateTopicQuestionsWithModel({
          subjectTitle: subject.title,
          topicTitle: topic.title,
          subtopicTitle: sub.title,
          count: 6,
          avoidStems: [...avoidStems, ...batch1.map((q) => q.stemEn)],
        });
        const merged = [...batch1, ...batch2].filter(
          (q, i, arr) => arr.findIndex((x) => x.stemEn === q.stemEn) === i,
        );
        questions = merged.slice(0, need).map((q, i) => ({
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
        if (questions.length >= 6) {
          source = "model";
        } else {
          // pad with algorithmic unique variants
          const pad = buildTopicPractice(
            subjectKey,
            topic.title,
            sub.title,
            setNo + 333,
            topic.id,
          );
          for (const p of pad) {
            if (questions.length >= need) break;
            if (!questions.some((q) => q.stemEn === p.stemEn)) {
              questions.push({ ...p, qIndex: questions.length + 1, source: "model+algo" });
            }
          }
          source = questions.some((q) => q.source === "model") ? "model+algo" : "algorithmic";
        }
      } catch {
        questions = buildTopicPractice(
          subjectKey,
          topic.title,
          sub.title,
          setNo,
          topic.id,
        );
        source = "algorithmic";
      }
    } else {
      questions = buildTopicPractice(
        subjectKey,
        topic.title,
        sub.title,
        setNo,
        topic.id,
      );
      source = "algorithmic";
    }

    // Final uniqueness: drop near-duplicate stems within the set
    const uniq: SeedQuestion[] = [];
    for (const q of questions) {
      const key = q.stemEn.replace(/\d+/g, "#").slice(0, 100);
      if (uniq.some((u) => u.stemEn.replace(/\d+/g, "#").slice(0, 100) === key)) continue;
      uniq.push({ ...q, qIndex: uniq.length + 1 });
    }
    while (uniq.length < 10) {
      const more = buildTopicPractice(
        subjectKey,
        topic.title,
        sub.title,
        setNo + uniq.length * 91 + Date.now() % 50,
        topic.id,
      );
      for (const m of more) {
        const key = m.stemEn.replace(/\d+/g, "#").slice(0, 100);
        if (uniq.some((u) => u.stemEn.replace(/\d+/g, "#").slice(0, 100) === key)) continue;
        uniq.push({ ...m, qIndex: uniq.length + 1 });
        if (uniq.length >= 10) break;
      }
      if (more.length === 0) break;
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
        questions: { create: uniq.slice(0, 10) },
      },
    });
    return NextResponse.json({
      paperId: paper.id,
      questionCount: Math.min(10, uniq.length),
      title: paper.title,
      source,
      model: source.startsWith("model"),
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
