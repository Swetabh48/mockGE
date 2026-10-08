import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { ReportView } from "@/components/report/ReportView";
import type { EvaluationResult } from "@/lib/exam/scoring";
import {
  enrichExplanationFromQuestion,
  enrichTrickFromQuestion,
} from "@/lib/exam/enrichSolution";
import { inferTopicFromStem, verifiedSolutionNotesAsync } from "@/lib/exam/validateMcq";

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

  const review = await Promise.all(
    attempt.paper.questions.map(async (q) => {
      const a = answerByQ[q.id];
      const verified = await verifiedSolutionNotesAsync({
        stem: q.stemEn,
        topic: q.topic,
        optionA: q.optionA,
        optionB: q.optionB,
        optionC: q.optionC,
        optionD: q.optionD,
        correctOption: q.correctOption,
        explanation: q.explanation,
      });
      const inferred = inferTopicFromStem(q.stemEn, q.topic);
      const correctOption = verified?.correctOption || q.correctOption;
      const topic = verified?.topic || inferred.topic || q.topic;
      const subtopic = verified?.subtopic || inferred.subtopic || q.subtopic;
      const ctx = {
        topic,
        subtopic,
        subject: q.subject,
        sectionKey: q.sectionKey,
        stem: q.stemEn,
        optionA: q.optionA,
        optionB: q.optionB,
        optionC: q.optionC,
        optionD: q.optionD,
        correctOption,
        explanation: verified?.explanation || q.explanation,
        trick: verified?.trick || q.trick,
      };
      return {
        id: q.id,
        qIndex: q.qIndex,
        sectionKey: q.sectionKey,
        subject: q.subject,
        topic,
        subtopic,
        stemEn: q.stemEn,
        optionA: q.optionA,
        optionB: q.optionB,
        optionC: q.optionC,
        optionD: q.optionD,
        correctOption,
        explanation: enrichExplanationFromQuestion(ctx),
        trick: enrichTrickFromQuestion(ctx),
        selected: a?.selected ?? null,
        timeSpentMs: a?.timeSpentMs ?? 0,
        changeCount: a?.changeCount ?? 0,
      };
    }),
  );

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
