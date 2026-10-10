import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getBlueprint, type ExamTier } from "@/lib/exam/blueprints";
import { evaluateAttempt, type ScoredAnswer } from "@/lib/exam/scoring";
import type { SectionKey } from "@/lib/exam/blueprints";

export async function GET() {
  const attempts = await prisma.attempt.findMany({
    orderBy: { startedAt: "desc" },
    take: 20,
    include: {
      paper: { select: { title: true, tier: true } },
    },
  });

  return NextResponse.json({
    attempts: attempts.map((a) => ({
      id: a.id,
      paperId: a.paperId,
      paperTitle: a.paper.title,
      tier: a.tier,
      status: a.status,
      score: a.score,
      maxScore: a.maxScore,
      startedAt: a.startedAt,
      submittedAt: a.submittedAt,
      destQualified: a.destQualified,
    })),
  });
}

export async function POST(request: Request) {
  const body = (await request.json()) as {
    paperId: string;
    action: "start" | "save" | "submit" | "dest";
    attemptId?: string;
    currentSection?: string;
    answers?: {
      questionId: string;
      selected: string | null;
      markedReview: boolean;
      visited: boolean;
      timeSpentMs: number;
      changeCount: number;
    }[];
    dest?: {
      keystrokes: number;
      accuracy: number;
      qualified: boolean;
    };
  };

  if (body.action === "start") {
    const paper = await prisma.paper.findUnique({
      where: { id: body.paperId },
      include: { questions: { select: { id: true, sectionKey: true } } },
    });
    if (!paper) {
      return NextResponse.json({ error: "Paper not found" }, { status: 404 });
    }

    const blueprint = getBlueprint(
      paper.tier as ExamTier,
      (paper.focusSection as SectionKey) || undefined,
      { exam: paper.exam, iesPaper: paper.iesPaper, mode: paper.mode },
    );
    const firstSection = blueprint.sections[0]?.key ?? "reasoning";

    const attempt = await prisma.attempt.create({
      data: {
        paperId: paper.id,
        tier: paper.tier,
        status: "in_progress",
        currentSection: firstSection,
        answers: {
          create: paper.questions.map((q) => ({
            questionId: q.id,
            selected: null,
            markedReview: false,
            visited: false,
            timeSpentMs: 0,
            changeCount: 0,
          })),
        },
      },
    });

    return NextResponse.json({ attemptId: attempt.id, currentSection: firstSection });
  }

  if (!body.attemptId) {
    return NextResponse.json({ error: "attemptId required" }, { status: 400 });
  }

  const attempt = await prisma.attempt.findUnique({
    where: { id: body.attemptId },
    include: {
      paper: { include: { questions: true } },
      answers: true,
    },
  });

  if (!attempt) {
    return NextResponse.json({ error: "Attempt not found" }, { status: 404 });
  }

  if (body.action === "save" && body.answers) {
    for (const a of body.answers) {
      const existing = await prisma.answerEvent.findUnique({
        where: {
          attemptId_questionId: {
            attemptId: attempt.id,
            questionId: a.questionId,
          },
        },
      });
      await prisma.answerEvent.update({
        where: {
          attemptId_questionId: {
            attemptId: attempt.id,
            questionId: a.questionId,
          },
        },
        data: {
          selected: a.selected,
          markedReview: a.markedReview,
          visited: a.visited,
          timeSpentMs: a.timeSpentMs,
          changeCount: a.changeCount,
          lastChangeAt: new Date(),
          firstViewAt: existing?.firstViewAt ?? (a.visited ? new Date() : null),
        },
      });
    }
    if (body.currentSection) {
      await prisma.attempt.update({
        where: { id: attempt.id },
        data: { currentSection: body.currentSection },
      });
    }
    return NextResponse.json({ ok: true });
  }

  if (body.action === "dest" && body.dest) {
    await prisma.attempt.update({
      where: { id: attempt.id },
      data: {
        destKeystrokes: body.dest.keystrokes,
        destAccuracy: body.dest.accuracy,
        destQualified: body.dest.qualified,
        status: "submitted",
        submittedAt: attempt.submittedAt ?? new Date(),
      },
    });
    return NextResponse.json({ ok: true });
  }

  if (body.action === "submit") {
    if (body.answers) {
      for (const a of body.answers) {
        await prisma.answerEvent.update({
          where: {
            attemptId_questionId: {
              attemptId: attempt.id,
              questionId: a.questionId,
            },
          },
          data: {
            selected: a.selected,
            markedReview: a.markedReview,
            visited: a.visited,
            timeSpentMs: a.timeSpentMs,
            changeCount: a.changeCount,
          },
        });
      }
    }

    const fresh = await prisma.attempt.findUnique({
      where: { id: attempt.id },
      include: {
        paper: { include: { questions: true } },
        answers: true,
      },
    });
    if (!fresh) {
      return NextResponse.json({ error: "Attempt missing" }, { status: 404 });
    }

    const qById = Object.fromEntries(fresh.paper.questions.map((q) => [q.id, q]));
    const scored: ScoredAnswer[] = fresh.answers.map((a) => {
      const q = qById[a.questionId]!;
      return {
        questionId: a.questionId,
        sectionKey: q.sectionKey as SectionKey,
        subject: q.subject,
        topic: q.topic,
        correctOption: q.correctOption,
        selected: a.selected,
        marks: q.marks,
        negativeMarks: q.negativeMarks,
        timeSpentMs: a.timeSpentMs,
        changeCount: a.changeCount,
        markedReview: a.markedReview,
      };
    });

    const blueprint = getBlueprint(
      fresh.tier as ExamTier,
      (fresh.paper.focusSection as SectionKey) || undefined,
      {
        exam: fresh.paper.exam,
        iesPaper: fresh.paper.iesPaper,
        mode: fresh.paper.mode,
        questionCount: fresh.paper.questions.length,
      },
    );
    const duration = blueprint.timerGroups.reduce((s, g) => s + g.durationSeconds, 0);
    const qIndexById = Object.fromEntries(
      fresh.paper.questions.map((q) => [q.id, q.qIndex]),
    );
    const evaluation = evaluateAttempt(scored, qIndexById, duration);

    await prisma.attempt.update({
      where: { id: fresh.id },
      data: {
        status: fresh.paper.tier === "tier2" && fresh.destQualified === null ? "awaiting_dest" : "submitted",
        submittedAt: new Date(),
        score: evaluation.score,
        maxScore: evaluation.maxScore,
        correctCount: evaluation.correctCount,
        wrongCount: evaluation.wrongCount,
        unattempted: evaluation.unattempted,
        analysisJson: JSON.stringify(evaluation),
      },
    });

    // If tier2 and DEST not done, keep awaiting; client routes to DEST
    const updated = await prisma.attempt.findUnique({ where: { id: fresh.id } });

    return NextResponse.json({
      attemptId: fresh.id,
      evaluation,
      status: updated?.status,
      needsDest: fresh.paper.tier === "tier2" && updated?.destQualified === null,
    });
  }

  return NextResponse.json({ error: "Unknown action" }, { status: 400 });
}
