import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { ReportView } from "@/components/report/ReportView";
import type { EvaluationResult } from "@/lib/exam/scoring";
import { enrichExplanation, enrichTrick } from "@/lib/exam/enrichSolution";

export default async function ReportPage({
  params,
}: {
  params: Promise<{ attemptId: string }>;
}) {
  const { attemptId } = await params;

  const attempt = await prisma.attempt.findUnique({
    where: { id: attemptId },
    include: {
      paper: { include: { questions: { orderBy: { qIndex: "asc" } } } },
      answers: true,
    },
  });

  if (!attempt || !attempt.analysisJson) notFound();

  const analysis = JSON.parse(attempt.analysisJson) as EvaluationResult;
  const answerByQ = Object.fromEntries(attempt.answers.map((a) => [a.questionId, a]));

  const review = attempt.paper.questions.map((q) => {
    const a = answerByQ[q.id];
    return {
      id: q.id,
      qIndex: q.qIndex,
      sectionKey: q.sectionKey,
      subject: q.subject,
      topic: q.topic,
      subtopic: q.subtopic,
      stemEn: q.stemEn,
      optionA: q.optionA,
      optionB: q.optionB,
      optionC: q.optionC,
      optionD: q.optionD,
      correctOption: q.correctOption,
      explanation: enrichExplanation(q.topic, q.explanation, q.stemEn),
      trick: enrichTrick(q.topic, q.trick),
      selected: a?.selected ?? null,
      timeSpentMs: a?.timeSpentMs ?? 0,
      changeCount: a?.changeCount ?? 0,
    };
  });

  return (
    <ReportView
      paperTitle={attempt.paper.title}
      score={attempt.score ?? analysis.score}
      maxScore={attempt.maxScore ?? analysis.maxScore}
      correctCount={attempt.correctCount ?? analysis.correctCount}
      wrongCount={attempt.wrongCount ?? analysis.wrongCount}
      unattempted={attempt.unattempted ?? analysis.unattempted}
      analysis={analysis}
      destQualified={attempt.destQualified}
      destAccuracy={attempt.destAccuracy}
      destKeystrokes={attempt.destKeystrokes}
      review={review}
    />
  );
}
