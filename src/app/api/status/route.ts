import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  const [paperCount, attemptCount, questionCount] = await Promise.all([
    prisma.paper.count(),
    prisma.attempt.count({ where: { status: "submitted" } }),
    prisma.question.count(),
  ]);

  return NextResponse.json({
    questionBankReady: paperCount > 0,
    paperCount,
    attemptCount,
    questionCount,
    bank: {
      ready: paperCount > 0,
      message:
        paperCount > 0
          ? `Question bank ready · ${paperCount} papers · ${questionCount} questions`
          : "Question bank empty — generate a mock or practice set",
    },
  });
}
