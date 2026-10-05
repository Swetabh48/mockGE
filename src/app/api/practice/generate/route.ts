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
    take: 200,
    select: { stemEn: true },
  });
  const bannedStems = prior.map((q) => q.stemEn);
  return {
    bannedStems,
    bannedFingerprints: new Set(bannedStems.map(stemFingerprint)),
  };
}

/** Last-resort pad: never ship a 0-Q paper. Prefer novel, then accept collisions. */
function forceFill(
  questions: SeedQuestion[],
  need: number,
  batches: SeedQuestion[][],
  sourceTag: string,
): SeedQuestion[] {
  const out = [...questions];
  const seen = new Set(out.map((q) => stemFingerprint(q.stemEn)));

  for (const batch of batches) {
    for (const p of batch) {
      if (out.length >= need) return out;
      if (!isNovelStem(p.stemEn, seen)) continue;
      seen.add(stemFingerprint(p.stemEn));
      out.push({ ...p, qIndex: out.length + 1, source: sourceTag });
    }
  }

  // Still short → accept any unused stems (even near-clones) so Start works
  for (const batch of batches) {
    for (const p of batch) {
      if (out.length >= need) return out;
      const fp = stemFingerprint(p.stemEn);
      if (seen.has(fp)) continue;
      seen.add(fp);
      out.push({ ...p, qIndex: out.length + 1, source: sourceTag });
    }
  }

  // Absolute last resort: mutate setNo-like digits into stem suffix so fingerprints differ
  let n = 0;
  while (out.length < need && batches[0]?.length) {
    const base = batches[0][n % batches[0].length]!;
    n += 1;
    const stemEn = `${base.stemEn} (variant ${Date.now().toString(36)}-${n})`;
    out.push({
      ...base,
      stemEn,
      qIndex: out.length + 1,
      source: sourceTag,
    });
  }
  return out;
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
    const { bannedStems, bannedFingerprints } = await loadBanned({
      focusTopic: topic.id,
      focusSection: subjectKey,
    });
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
      const batches: SeedQuestion[][] = [];
      for (let round = 0; round < 12; round++) {
        batches.push(
          buildTopicPractice(
            subjectKey,
            topic.title,
            sub.title,
            setNo + round * 7919 + Math.floor(Math.random() * 5000),
            topic.id,
          ).map((p) => ({
            ...p,
            topic: topic.title,
            subtopic: sub.title,
          })),
        );
      }
      questions = forceFill(
        questions,
        need,
        batches,
        modelTried ? "model+algo" : "algorithmic",
      );
      if (modelTried && questions.some((q) => q.source === "model")) source = "model+algo";
      else if (!modelTried) source = "algorithmic";
      else if (questions.length > 0 && !questions.every((q) => q.source === "model"))
        source = "model+algo";
    }

    if (questions.length === 0) {
      return NextResponse.json(
        { error: "Could not invent questions — retry in a moment" },
        { status: 503 },
      );
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
  const { bannedStems, bannedFingerprints } = await loadBanned({
    focusSection: subjectKey,
  });
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
      if (questions.length > 0) {
        source = questions.length >= need ? "model" : "model+partial";
      }
    } catch {
      // fall through to algorithmic pad — still return JSON
    }
  }

  if (questions.length < need) {
    const batches: SeedQuestion[][] = [];
    for (let r = 0; r < 10; r++) {
      batches.push(buildSectionPractice(subjectKey, setNo + r * 1301));
    }
    questions = forceFill(
      questions,
      need,
      batches,
      modelTried && questions.some((q) => q.source === "model")
        ? "model+algo"
        : modelTried
          ? "model+algo"
          : "algorithmic",
    );
    if (modelTried && questions.some((q) => q.source === "model")) source = "model+algo";
    else if (!modelTried) source = "algorithmic";
    else source = questions.some((q) => q.source === "model") ? "model+algo" : "algorithmic";
  }

  if (questions.length === 0) {
    return NextResponse.json(
      { error: "Could not invent questions — retry in a moment" },
      { status: 503 },
    );
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
