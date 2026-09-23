import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  const attempt = await prisma.attempt.findUnique({
    where: { id },
    include: {
      paper: {
        include: {
          questions: { orderBy: { qIndex: "asc" } },
        },
      },
      answers: true,
    },
  });

  if (!attempt) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const answerByQ = Object.fromEntries(attempt.answers.map((a) => [a.questionId, a]));
  const analysis = attempt.analysisJson ? JSON.parse(attempt.analysisJson) : null;

  return NextResponse.json({
    attempt: {
      id: attempt.id,
      status: attempt.status,
      tier: attempt.tier,
      score: attempt.score,
      maxScore: attempt.maxScore,
      correctCount: attempt.correctCount,
      wrongCount: attempt.wrongCount,
      unattempted: attempt.unattempted,
      startedAt: attempt.startedAt,
      submittedAt: attempt.submittedAt,
      destQualified: attempt.destQualified,
      destAccuracy: attempt.destAccuracy,
      destKeystrokes: attempt.destKeystrokes,
      analysis,
      paper: {
        id: attempt.paper.id,
        title: attempt.paper.title,
        destPassage: attempt.paper.destPassage,
      },
      review: attempt.paper.questions.map((q) => {
        const a = answerByQ[q.id];
        return {
          id: q.id,
          qIndex: q.qIndex,
          sectionKey: q.sectionKey,
          subject: q.subject,
          topic: q.topic,
          stemEn: q.stemEn,
          optionA: q.optionA,
          optionB: q.optionB,
          optionC: q.optionC,
          optionD: q.optionD,
          correctOption: q.correctOption,
          explanation: q.explanation,
          selected: a?.selected ?? null,
          timeSpentMs: a?.timeSpentMs ?? 0,
          changeCount: a?.changeCount ?? 0,
        };
      }),
    },
  });
}
