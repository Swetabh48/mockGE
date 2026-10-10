import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import {
  inventIesPaper,
  inventIesPractice,
  iesOllamaAvailable,
} from "@/lib/exam/iesModelGenerate";
import { geminiConfigured } from "@/lib/exam/geminiClient";
import type { IesSubjectKey } from "@/lib/exam/iesTaxonomy";
import { enrichIesSolution } from "@/lib/exam/enrichIesSolution";

export const maxDuration = 300;

export async function POST(request: Request) {
  const body = (await request.json()) as {
    kind?: "full_mock" | "practice";
    iesPaper?: "ce_paper1" | "ce_paper2" | "day";
    subject?: IesSubjectKey;
    questionCount?: number;
    enrichSolutions?: boolean;
  };

  const kind = body.kind ?? "full_mock";
  // Official ESE CE objective paper: 150 Q · 3 h · 300 marks (skip solution enrich on full papers — too slow)
  const n = Math.min(
    Math.max(body.questionCount ?? (kind === "practice" ? 10 : 150), 5),
    150,
  );
  if (body.enrichSolutions === undefined && kind === "full_mock") {
    body.enrichSolutions = false;
  }
  const gemini = geminiConfigured();
  const ollama = await iesOllamaAvailable();

  async function persistPaper(opts: {
    title: string;
    iesPaper: "ce_paper1" | "ce_paper2";
    mode: string;
    questions: Awaited<ReturnType<typeof inventIesPaper>>;
    focusSection?: string;
    focusTopic?: string;
  }) {
    const enriched = [];
    for (const q of opts.questions) {
      let solutionDetail = q.solutionDetail ?? null;
      let solutionCitations: string | null = null;
      if (body.enrichSolutions !== false && opts.mode !== "practice") {
        try {
          const e = await enrichIesSolution({
            stem: q.stemEn,
            optionA: q.optionA,
            optionB: q.optionB,
            optionC: q.optionC,
            optionD: q.optionD,
            correctOption: q.correctOption,
            subject: q.subject,
            topic: q.topic,
            explanation: q.explanation,
            solutionDetail: q.solutionDetail,
          });
          solutionDetail = e.solutionDetail;
          solutionCitations = e.solutionCitations;
        } catch {
          /* keep short explanation */
        }
      }
      enriched.push({
        qIndex: q.qIndex,
        sectionKey: q.sectionKey,
        subject: q.subject,
        topic: q.topic,
        subtopic: q.subtopic,
        difficulty: q.difficulty,
        stemEn: q.stemEn,
        optionA: q.optionA,
        optionB: q.optionB,
        optionC: q.optionC,
        optionD: q.optionD,
        correctOption: q.correctOption,
        explanation: q.explanation,
        trick: q.trick,
        solutionDetail,
        solutionCitations,
        marks: q.marks,
        negativeMarks: q.negativeMarks,
        source: q.source,
      });
    }

    return prisma.paper.create({
      data: {
        title: opts.title,
        tier: opts.iesPaper === "ce_paper1" ? "ies_paper1" : "ies_paper2",
        exam: "ies_civil",
        iesPaper: opts.iesPaper,
        mode: opts.mode,
        source: enriched[0]?.source?.includes("hybrid")
          ? "hybrid_gemini_ies"
          : enriched[0]?.source || "model",
        difficulty: "hard",
        focusSection: opts.focusSection,
        focusTopic: opts.focusTopic,
        questions: { create: enriched },
      },
      include: { _count: { select: { questions: true } } },
    });
  }

  try {
    if (kind === "practice") {
      if (!body.subject) {
        return NextResponse.json({ error: "subject required for practice" }, { status: 400 });
      }
      const questions = await inventIesPractice(body.subject, n);
      const paper = await persistPaper({
        title: `IES · ${body.subject} practice (${n} Q)`,
        iesPaper: "ce_paper1",
        mode: "topic_practice",
        questions,
        focusSection: body.subject,
      });
      return NextResponse.json({
        id: paper.id,
        title: paper.title,
        questionCount: paper._count.questions,
        engines: { gemini, ollama },
        message: `Ready: ${paper.title}`,
      });
    }

    if (body.iesPaper === "day") {
      const q1 = await inventIesPaper("ce_paper1", n);
      const q2 = await inventIesPaper("ce_paper2", n);
      const stamp = new Date().toISOString().slice(0, 10);
      const p1 = await persistPaper({
        title: `IES Civil Paper-I Mock · ${stamp} (3h)`,
        iesPaper: "ce_paper1",
        mode: "full_mock",
        questions: q1,
      });
      const p2 = await persistPaper({
        title: `IES Civil Paper-II Mock · ${stamp} (3h)`,
        iesPaper: "ce_paper2",
        mode: "full_mock",
        questions: q2,
      });
      return NextResponse.json({
        id: p1.id,
        id2: p2.id,
        title: p1.title,
        questionCount: p1._count.questions + p2._count.questions,
        engines: { gemini, ollama },
        message: `Day pack ready: ${p1.title} + ${p2.title}. Start Paper-I first.`,
      });
    }

    const iesPaper = body.iesPaper === "ce_paper1" ? "ce_paper1" : "ce_paper2";
    const label = iesPaper === "ce_paper1" ? "Paper-I" : "Paper-II";
    const questions = await inventIesPaper(iesPaper, n);
    const stamp = new Date().toISOString().slice(0, 10);
    const paper = await persistPaper({
      title: `IES Civil ${label} Mock · ${stamp} (3h)`,
      iesPaper,
      mode: "full_mock",
      questions,
    });
    return NextResponse.json({
      id: paper.id,
      title: paper.title,
      questionCount: paper._count.questions,
      engines: { gemini, ollama },
      message: `Ready: ${paper.title}${!gemini && !ollama ? " (demo bank — set GEMINI_API_KEY / OLLAMA_IES_*)" : ""}`,
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "IES generate failed" },
      { status: 500 },
    );
  }
}
