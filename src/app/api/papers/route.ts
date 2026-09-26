import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const tier = searchParams.get("tier");

  const papers = await prisma.paper.findMany({
    where: tier ? { tier } : undefined,
    orderBy: { createdAt: "asc" },
    include: {
      _count: { select: { questions: true, attempts: true } },
    },
  });

  return NextResponse.json({
    papers: papers.map((p) => ({
      id: p.id,
      title: p.title,
      tier: p.tier,
      source: p.source,
      difficulty: p.difficulty,
      mode: p.mode,
      focusSection: p.focusSection,
      focusTopic: p.focusTopic,
      focusSubtopic: p.focusSubtopic,
      questionCount: p._count.questions,
      attemptCount: p._count.attempts,
      hasDest: Boolean(p.destPassage),
      createdAt: p.createdAt,
    })),
  });
}
