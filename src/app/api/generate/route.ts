import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import {
  buildTier1Paper,
  buildTier2Paper,
  DEST_PASSAGES,
} from "@/lib/exam/questionBank";

export async function GET() {
  const paperCount = await prisma.paper.count();
  return NextResponse.json({
    ready: true,
    paperCount,
    message: "Seed / algorithmic paper generator ready",
  });
}

export async function POST(request: Request) {
  const body = (await request.json()) as {
    tier: "tier1" | "tier2";
  };

  const tier = body.tier ?? "tier1";
  const n = (await prisma.paper.count({ where: { tier } })) + 1;
  const questions = tier === "tier1" ? buildTier1Paper(n) : buildTier2Paper(n);
  const paper = await prisma.paper.create({
    data: {
      title:
        tier === "tier1"
          ? `SSC CGL Tier-I Mock ${n}`
          : `SSC CGL Tier-II Paper-I Mock ${n}`,
      tier,
      source: "seed",
      difficulty: "standard",
      destPassage: tier === "tier2" ? DEST_PASSAGES[n % DEST_PASSAGES.length] : null,
      questions: { create: questions },
    },
  });
  return NextResponse.json({
    paperId: paper.id,
    source: "seed",
    questionCount: questions.length,
  });
}
