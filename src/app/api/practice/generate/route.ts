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
  inventSectionWithModel,
  ollamaAvailable,
  stemFingerprint,
} from "@/lib/exam/modelGenerate";
import type { SeedQuestion } from "@/lib/exam/questionBank";

export const maxDuration = 300;

function toSeed(
  q: {
    stemEn: string;
    optionA: string;
    optionB: string;
    optionC: string;
    optionD: string;
    correctOption: string;
    explanation: string;
    trick: string;
    topic?: string;
    subtopic?: string;
  },
  i: number,
  sectionKey: string,
  subject: string,
  topic: string,
  subtopic?: string,
): SeedQuestion {
  return {
    qIndex: i + 1,
    sectionKey,
    subject,
    topic: q.topic || topic,
    subtopic: q.subtopic || subtopic,
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
  };
}

async function loadBanned(opts?: {
  focusTopic?: string | null;
  focusSection?: string | null;
}) {
  const prior = await prisma.question.findMany({
    where: {
      paper: {
        tier: "practice",
        ...(opts?.focusTopic ? { focusTopic: opts.focusTopic } : {}),
        ...(opts?.focusSection ? { focusSection: opts.focusSection } : {}),
      },
    },
    orderBy: { id: "desc" },
    take: 120,
    select: { stemEn: true },
  });
  const bannedStems = prior.map((q) => q.stemEn);
  return {
    bannedStems,
    bannedFingerprints: new Set(bannedStems.map(stemFingerprint)),
  };
}

/**
 * Practice Generate = model invent only (mockge-ssc on Modal).
 * Never pads with static banks / PDF-like stems. If the model cannot invent, fail clearly.
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
          ? "Cloud model request was aborted (cold start). Click Generate again."
          : e instanceof Error
            ? e.message
            : "Generate failed",
      },
      { status: aborted ? 503 : 500 },
    );
  }
}

async function handleGenerate(request: Request) {
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

  const modelUp = await ollamaAvailable();
  if (!modelUp) {
    return NextResponse.json(
      {
        error:
          "Cloud model (mockge-ssc) did not respond. Wait 20 seconds for Modal to wake, then Generate again.",
        modelOnline: false,
        model: false,
      },
      { status: 503 },
    );
  }

  // ---------- TOPIC DRILL ----------
  if (kind === "topic") {
    const topic = body.topicId ? findTopic(subjectKey, body.topicId) : subject.topics[0];
    if (!topic) {
      return NextResponse.json({ error: "Unknown topic" }, { status: 400 });
    }
    const sub =
      topic.subtopics.find((s) => s.id === body.subtopicId) ?? topic.subtopics[0]!;
    const { bannedStems, bannedFingerprints } = await loadBanned({
      focusTopic: topic.id,
      focusSection: subjectKey,
    });
    const need = 10;

    let invented;
    try {
      invented = await generateUniqueTopicSet({
        subjectTitle: subject.title,
        topicTitle: topic.title,
        subtopicTitle: sub.title,
        need,
        bannedFingerprints,
        bannedStems,
        maxAttempts: 8,
        deadlineMs: Date.now() + 280_000,
      });
    } catch (e) {
      const aborted = e instanceof Error && /abort/i.test(e.name + e.message);
      return NextResponse.json(
        {
          error: aborted
            ? "Cloud model was still waking (request aborted). Click Generate again — the second try is usually fast."
            : e instanceof Error
              ? e.message
              : "Model invent failed",
          modelOnline: true,
          model: false,
        },
        { status: 503 },
      );
    }

    if (invented.length < 8) {
      return NextResponse.json(
        {
          error:
            invented.length === 0
              ? "Cloud model timed out inventing questions. Wait a few seconds and click Generate again (cold start)."
              : `Model only invented ${invented.length} new questions. Retry Generate.`,
          modelOnline: true,
          model: false,
          invented: invented.length,
        },
        { status: 503 },
      );
    }

    const questions = invented.map((q, i) =>
      toSeed(q, i, subjectKey, subject.title, topic.title, sub.title),
    );
    const source = questions.length >= need ? "model" : "model";

    const paper = await prisma.paper.create({
      data: {
        title: `${subject.title} · ${topic.title} · ${sub.title} (${questions.length} new Q)`,
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
      model: true,
      modelOnline: true,
      unique: true,
      bannedPrior: bannedStems.length,
    });
  }

  // ---------- SECTION DRILL (model invent only) ----------
  const need = 15;
  const { bannedStems, bannedFingerprints } = await loadBanned({
    focusSection: subjectKey,
  });

  const topicSpecs = subject.topics.map((t) => ({
    title: t.title,
    subtopic: t.subtopics[0]?.title,
  }));

  let invented;
  try {
    invented = await inventSectionWithModel({
      subjectTitle: subject.title,
      topics: topicSpecs,
      need,
      bannedFingerprints,
      bannedStems,
      deadlineMs: Date.now() + 280_000,
    });
  } catch (e) {
    const aborted = e instanceof Error && /abort/i.test(e.name + e.message);
    return NextResponse.json(
      {
        error: aborted
          ? "Cloud model was still waking (request aborted). Click Generate again — the second try is usually fast."
          : e instanceof Error
            ? e.message
            : "Model invent failed",
        modelOnline: true,
        model: false,
      },
      { status: 503 },
    );
  }

  if (invented.length < 10) {
    return NextResponse.json(
      {
        error:
          invented.length === 0
            ? "Cloud model timed out inventing questions. Wait a few seconds and click Generate again (cold start)."
            : `Model only invented ${invented.length} new questions. Retry Generate.`,
        modelOnline: true,
        model: false,
        invented: invented.length,
      },
      { status: 503 },
    );
  }

  const questions = invented.map((q, i) =>
    toSeed(q, i, subjectKey, subject.title, q.topic, q.subtopic),
  );

  const paper = await prisma.paper.create({
    data: {
      title: `${subject.title} — ${questions.length} new questions`,
      tier: "practice",
      mode: "practice",
      focusSection: subjectKey,
      source: "model",
      difficulty: "hard",
      questions: {
        create: questions.map((q, i) => ({ ...q, qIndex: i + 1 })),
      },
    },
  });

  return NextResponse.json({
    paperId: paper.id,
    questionCount: questions.length,
    title: paper.title,
    source: "model",
    model: true,
    modelOnline: true,
    unique: true,
    bannedPrior: bannedStems.length,
    syllabusTopics: PRACTICE_SYLLABUS.find((s) => s.key === subjectKey)?.topics.length,
  });
}
