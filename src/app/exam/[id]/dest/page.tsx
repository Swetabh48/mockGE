import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { DestTest } from "@/components/exam/DestTest";

export default async function DestPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ attemptId?: string }>;
}) {
  const { id } = await params;
  const { attemptId } = await searchParams;
  if (!attemptId) notFound();

  const paper = await prisma.paper.findUnique({ where: { id } });
  const attempt = await prisma.attempt.findUnique({ where: { id: attemptId } });

  if (!paper || !attempt || attempt.paperId !== paper.id || !paper.destPassage) {
    notFound();
  }

  return (
    <DestTest
      paperId={paper.id}
      attemptId={attempt.id}
      passage={paper.destPassage}
    />
  );
}
