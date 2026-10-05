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
    topic,
    subtopic,
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

async function loadBanned(focusTopic?: string | null) {
  const prior = await prisma.question.findMany({
    where: focusTopic
      ? { paper: { focusTopic, tier: "practice" } }
      : { paper: { tier: "practice" } },
    orderBy: { id: "desc" },
    take: 500,
    select: { stemEn: true },
  });
  const bannedStems = prior.map((q) => q.stemEn);
  return {
    bannedStems,
    bannedFingerprints: new Set(bannedStems.map(stemFingerprint)),
  };
}

/**
 * Practice Generate always prefers the cloud/local model.
 * PDFs are never copied into sets. Prior stems are fingerprint-banned.
 */
export async function POST(request: Request) {
  try {
    return await handleGenerate(request);
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Generate failed";
    return NextResponse.json({ error: msg }, { status: 500 });
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
  const setNo =
    existing * 9973 + (Date.now() % 1_000_003) + Math.floor(Math.random() * 100_000);

  const modelUp = await ollamaAvailable();

  // ---------- TOPIC DRILL ----------
  if (kind === "topic") {
    const topic = body.topicId ? findTopic(subjectKey, body.topicId) : subject.topics[0];
    if (!topic) {
      return NextResponse.json({ error: "Unknown topic" }, { status: 400 });
    }
    const sub =
      topic.subtopics.find((s) => s.id === body.subtopicId) ?? topic.subtopics[0]!;
    const { bannedStems, bannedFingerprints } = await loadBanned(topic.id);
    const need = 10;
    let questions: SeedQuestion[] = [];
    let source = "algorithmic";
    let modelTried = false;

    if (modelUp) {
      modelTried = true;
      try {
        const invented = await generateUniqueTopicSet({
          subjectTitle: subject.title,
          topicTitle: topic.title,
          subtopicTitle: sub.title,
          need,
          bannedFingerprints,
          bannedStems,
          maxAttempts: 3,
        });
        questions = invented.map((q, i) =>
          toSeed(q, i, subjectKey, subject.title, topic.title, sub.title),
        );
        source = questions.length >= need ? "model" : "model+partial";
      } catch {
        questions = [];
      }
    }

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
            source: modelTried ? "model+algo" : "algorithmic",
          });
          if (questions.length >= need) break;
        }
      }
      if (modelTried && questions.some((q) => q.source === "model")) source = "model+algo";
      else if (!modelTried) source = "algorithmic";
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
      modelOnline: modelUp,
      unique: true,
      bannedPrior: bannedStems.length,
    });
  }

  // ---------- SECTION DRILL (also uses model) ----------
  // Keep model calls short: Vercel kills long runs and returns plain text
  // ("An error occurred...") which the UI cannot parse as JSON.
  const need = 25;
  const { bannedStems, bannedFingerprints } = await loadBanned(null);
  let questions: SeedQuestion[] = [];
  let source = "algorithmic";
  let modelTried = false;
  const deadline = Date.now() + 100_000; // leave headroom under maxDuration

  if (modelUp) {
    modelTried = true;
    try {
      // 2 topics × 1 attempt keeps Unlimited drills under ~1–2 min
      const topics = subject.topics.slice(0, 2);
      const per = Math.ceil(Math.min(12, need) / Math.max(1, topics.length));
      const seen = new Set(bannedFingerprints);
      const avoid = [...bannedStems];

      for (const t of topics) {
        if (questions.length >= need || Date.now() > deadline) break;
        const sub = t.subtopics[0];
        const invented = await generateUniqueTopicSet({
          subjectTitle: subject.title,
          topicTitle: t.title,
          subtopicTitle: sub?.title,
          need: per,
          bannedFingerprints: seen,
          bannedStems: avoid,
          maxAttempts: 1,
        });
        for (const q of invented) {
          if (!isNovelStem(q.stemEn, seen)) continue;
          seen.add(stemFingerprint(q.stemEn));
          avoid.push(q.stemEn);
          questions.push(
            toSeed(
              q,
              questions.length,
              subjectKey,
              subject.title,
              t.title,
              sub?.title,
            ),
          );
          if (questions.length >= need) break;
        }
      }
      source =
        questions.length >= 8
          ? questions.length >= need
            ? "model"
            : "model+partial"
          : "model+partial";
    } catch {
      // fall through to algorithmic pad — still return JSON
    }
  }

  if (questions.length < need) {
    const seen = new Set([
      ...bannedFingerprints,
      ...questions.map((q) => stemFingerprint(q.stemEn)),
    ]);
    const pad = buildSectionPractice(subjectKey, setNo);
    for (const p of pad) {
      if (!isNovelStem(p.stemEn, seen)) continue;
      seen.add(stemFingerprint(p.stemEn));
      questions.push({
        ...p,
        qIndex: questions.length + 1,
        source: modelTried ? "model+algo" : "algorithmic",
      });
      if (questions.length >= need) break;
    }
    // more rounds if needed
    for (let r = 1; r < 8 && questions.length < need; r++) {
      const more = buildSectionPractice(subjectKey, setNo + r * 1301);
      for (const p of more) {
        if (!isNovelStem(p.stemEn, seen)) continue;
        seen.add(stemFingerprint(p.stemEn));
        questions.push({
          ...p,
          qIndex: questions.length + 1,
          source: modelTried ? "model+algo" : "algorithmic",
        });
        if (questions.length >= need) break;
      }
    }
    if (modelTried && questions.some((q) => q.source === "model")) source = "model+algo";
    else if (!modelTried) source = "algorithmic";
  }

  const paper = await prisma.paper.create({
    data: {
      title: `${subject.title} — Unlimited drill #${existing + 1} (${Math.min(need, questions.length)} Q)`,
      tier: "practice",
      mode: "practice",
      focusSection: subjectKey,
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
    modelOnline: modelUp,
    unique: true,
    bannedPrior: bannedStems.length,
    syllabusTopics: PRACTICE_SYLLABUS.find((s) => s.key === subjectKey)?.topics.length,
  });
}
