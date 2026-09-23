import { NextResponse } from "next/server";
import { getOllamaStatus } from "@/lib/ollama/client";
import { prisma } from "@/lib/db";

export async function GET() {
  const [ollama, paperCount, attemptCount] = await Promise.all([
    getOllamaStatus(),
    prisma.paper.count(),
    prisma.attempt.count({ where: { status: "submitted" } }),
  ]);

  return NextResponse.json({
    questionBankReady: paperCount > 0,
    paperCount,
    attemptCount,
    ollama,
  });
}
