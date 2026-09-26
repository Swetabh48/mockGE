import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { getBlueprint, type ExamTier, type SectionKey } from "@/lib/exam/blueprints";
import { InstructionsGate } from "@/components/exam/InstructionsGate";

export default async function ExamInstructionsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const paper = await prisma.paper.findUnique({
    where: { id },
    include: { _count: { select: { questions: true } } },
  });
  if (!paper) notFound();

  const blueprint = getBlueprint(
    paper.tier as ExamTier,
    (paper.focusSection as SectionKey) || undefined,
    {
      questionCount: paper._count.questions,
      mode: paper.mode,
      title: paper.title,
    },
  );

  return (
    <InstructionsGate
      paperId={paper.id}
      paperTitle={paper.title}
      blueprint={blueprint}
    />
  );
}
