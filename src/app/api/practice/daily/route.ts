import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import {
  bannedFingerprintsForGuest,
  materializePaper,
  sampleDaily100,
  utcDateString,
} from "@/lib/exam/bankSample";

export const maxDuration = 120;

function guestFrom(request: Request): string {
  const h = request.headers.get("x-guest-id")?.trim();
  if (h && h.length >= 8 && h.length <= 80) return h;
  return "guest-anonymous";
}

/**
 * GET/POST: get-or-create today's Daily 100 (25×4) for this guest.
 */
export async function GET(request: Request) {
  return handle(request);
}

export async function POST(request: Request) {
  return handle(request);
}

async function handle(request: Request) {
  try {
    const guestId = guestFrom(request);
    const date = utcDateString();

    const existing = await prisma.dailyPack.findUnique({
      where: { guestId_date: { guestId, date } },
    });

    if (existing) {
      const paper = await prisma.paper.findUnique({
        where: { id: existing.paperId },
        include: { _count: { select: { questions: true } } },
      });
      if (paper) {
        return NextResponse.json({
          paperId: paper.id,
          title: paper.title,
          questionCount: paper._count.questions,
          date,
          guestId,
          created: false,
        });
      }
    }

    const bankCount = await prisma.bankQuestion.count();
    if (bankCount < 100) {
      return NextResponse.json(
        {
          error: `Bank has only ${bankCount} questions. Run: npx tsx scripts/seed_ssc_bank.ts`,
          bankCount,
        },
        { status: 503 },
      );
    }

    const banned = await bannedFingerprintsForGuest(guestId, 7);
    const rows = await sampleDaily100(banned, Date.now());
    if (rows.length < 80) {
      return NextResponse.json(
        {
          error: `Could only sample ${rows.length}/100. Seed more bank questions.`,
          sampled: rows.length,
        },
        { status: 503 },
      );
    }

    const paper = await materializePaper({
      title: `Daily 100 — ${date}`,
      mode: "daily",
      focusSection: "daily",
      source: "daily_bank",
      rows,
    });

    await prisma.dailyPack.upsert({
      where: { guestId_date: { guestId, date } },
      create: { guestId, date, paperId: paper.paperId },
      update: { paperId: paper.paperId },
    });

    return NextResponse.json({
      paperId: paper.paperId,
      title: paper.title,
      questionCount: paper.questionCount,
      date,
      guestId,
      created: true,
    });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Daily pack failed" },
      { status: 500 },
    );
  }
}
