import { NextResponse } from "next/server";
import { bankStats } from "@/lib/exam/bankSample";

export async function GET() {
  try {
    const stats = await bankStats();
    return NextResponse.json(stats);
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "stats failed", total: 0, bySection: {}, byTopic: {} },
      { status: 500 },
    );
  }
}
