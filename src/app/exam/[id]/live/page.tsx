import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { ExamCBT } from "@/components/exam/ExamCBT";
import type { ExamTier, SectionKey } from "@/lib/exam/blueprints";

export default async function ExamLivePage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ attemptId?: string }>;
}) {
  const { id } = await params;
  const { attemptId } = await searchParams;
  if (!attemptId) notFound();

  const [paper, attempt] = await Promise.all([
    prisma.paper.findUnique({
      where: { id },
      include: { questions: { orderBy: { qIndex: "asc" } } },
    }),
    prisma.attempt.findUnique({ where: { id: attemptId } }),
  ]);

  if (!paper || !attempt || attempt.paperId !== paper.id) notFound();

  const questions = paper.questions.map((q) => ({
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
    marks: q.marks,
    negativeMarks: q.negativeMarks,
  }));

  return (
    <ExamCBT
      paperId={paper.id}
      paperTitle={paper.title}
      tier={paper.tier as ExamTier}
      focusSection={(paper.focusSection as SectionKey) || undefined}
      mode={paper.mode}
      questions={questions}
      attemptId={attempt.id}
    />
  );
}
