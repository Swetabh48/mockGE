import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  const paper = await prisma.paper.findUnique({
    where: { id },
    include: {
      questions: { orderBy: { qIndex: "asc" } },
    },
  });

  if (!paper) {
    return NextResponse.json({ error: "Paper not found" }, { status: 404 });
  }

  // Hide correct answers during exam fetch for client — still needed for local scoring after submit via attempt API
  // Client receives answers only after submit; during exam we omit correctOption/explanation
  const questions = paper.questions.map((q) => ({
    id: q.id,
    qIndex: q.qIndex,
    sectionKey: q.sectionKey,
    subject: q.subject,
    topic: q.topic,
    stemEn: q.stemEn,
    stemHi: q.stemHi,
    optionA: q.optionA,
    optionB: q.optionB,
    optionC: q.optionC,
    optionD: q.optionD,
    marks: q.marks,
    negativeMarks: q.negativeMarks,
  }));

  return NextResponse.json({
    paper: {
      id: paper.id,
      title: paper.title,
      tier: paper.tier,
      difficulty: paper.difficulty,
      destPassage: paper.destPassage,
      questions,
    },
  });
}
