import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getOllamaStatus, generateQuestionsWithOllama } from "@/lib/ollama/client";
import {
  buildTier1Paper,
  buildTier2Paper,
  DEST_PASSAGES,
} from "@/lib/exam/questionBank";

export async function GET() {
  const status = await getOllamaStatus();
  return NextResponse.json(status);
}

export async function POST(request: Request) {
  const body = (await request.json()) as {
    tier: "tier1" | "tier2";
    mode?: "full_seed" | "ollama_mix";
  };

  const tier = body.tier ?? "tier1";
  const status = await getOllamaStatus();

  // Always able to create a new paper from algorithmic bank
  if (!status.connected || !status.model || body.mode === "full_seed") {
    const n = (await prisma.paper.count({ where: { tier } })) + 1;
    const questions =
      tier === "tier1" ? buildTier1Paper(n) : buildTier2Paper(n);
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
      ollama: status,
      questionCount: questions.length,
    });
  }

  // Hybrid: base paper + refresh GA/English topics via Ollama when possible
  try {
    const n = (await prisma.paper.count({ where: { tier } })) + 1;
    const base = tier === "tier1" ? buildTier1Paper(n) : buildTier2Paper(n);

    const gaGen = await generateQuestionsWithOllama({
      subject: "General Awareness",
      topic: "India Polity Geography Economy",
      count: 5,
      model: status.model,
    });

    let replaced = 0;
    for (const g of gaGen) {
      const idx = base.findIndex((q) => q.sectionKey === "ga" && !q.stemEn.includes("[GEN]"));
      if (idx === -1) break;
      const prev = base[idx]!;
      base[idx] = {
        ...prev,
        stemEn: `[GEN] ${g.stemEn}`,
        optionA: g.optionA,
        optionB: g.optionB,
        optionC: g.optionC,
        optionD: g.optionD,
        correctOption: g.correctOption,
        topic: g.topic || prev.topic,
        explanation: g.explanation || prev.explanation,
        source: "generated",
      };
      replaced += 1;
    }

    const paper = await prisma.paper.create({
      data: {
        title:
          tier === "tier1"
            ? `SSC CGL Tier-I Generated ${n}`
            : `SSC CGL Tier-II Generated ${n}`,
        tier,
        source: "generated",
        difficulty: "standard",
        destPassage: tier === "tier2" ? DEST_PASSAGES[n % DEST_PASSAGES.length] : null,
        questions: { create: base },
      },
    });

    return NextResponse.json({
      paperId: paper.id,
      source: "generated",
      replaced,
      ollama: status,
      questionCount: base.length,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Generation failed";
    return NextResponse.json({ error: message, ollama: status }, { status: 500 });
  }
}
