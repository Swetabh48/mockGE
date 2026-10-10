/**
 * Load data/ies_civil_official.json into Postgres as IES PYQ papers.
 * Replaces existing official_pyq papers for ies_civil (keeps mocks/practice).
 */
import "dotenv/config";
import { readFileSync, existsSync } from "fs";
import { join } from "path";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";
import { Pool } from "pg";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error("DATABASE_URL is required");

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const NEG = 2 / 3;
const JSON_PATH = join(process.cwd(), "data", "ies_civil_official.json");

type Q = {
  sourcePaper: string;
  year: number;
  iesPaper: string;
  qNo: number;
  subjectKey: string;
  topicId: string;
  stemEn: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctOption: string;
  explanation?: string;
};

async function main() {
  if (!existsSync(JSON_PATH)) {
    console.log("No data/ies_civil_official.json — run download + import first.");
    return;
  }
  const raw = JSON.parse(readFileSync(JSON_PATH, "utf-8")) as {
    questions: Q[];
  };
  const questions = raw.questions ?? [];
  if (questions.length === 0) {
    console.log("JSON has 0 questions — nothing to seed.");
    return;
  }

  // Remove prior official PYQ imports
  const old = await prisma.paper.findMany({
    where: { exam: "ies_civil", source: "official_pyq" },
    select: { id: true },
  });
  for (const p of old) {
    await prisma.paper.delete({ where: { id: p.id } });
  }

  const groups = new Map<string, Q[]>();
  for (const q of questions) {
    const key = `${q.year}|${q.iesPaper}`;
    const list = groups.get(key) ?? [];
    list.push(q);
    groups.set(key, list);
  }

  for (const [key, qs] of groups) {
    const [yearStr, iesPaper] = key.split("|");
    const year = Number(yearStr);
    const label = iesPaper === "ce_paper1" ? "Paper-I" : "Paper-II";
    qs.sort((a, b) => a.qNo - b.qNo);
    await prisma.paper.create({
      data: {
        title: `ESE ${year} Civil ${label} (Official PYQ · 3 hours)`,
        tier: iesPaper === "ce_paper1" ? "ies_paper1" : "ies_paper2",
        exam: "ies_civil",
        iesPaper,
        year,
        mode: "pyq",
        source: "official_pyq",
        difficulty: "hard",
        questions: {
          create: qs.map((q, i) => ({
            qIndex: i + 1,
            sectionKey: "ies_ce",
            subject: q.subjectKey,
            topic: q.topicId,
            difficulty: "hard",
            stemEn: q.stemEn,
            optionA: q.optionA,
            optionB: q.optionB,
            optionC: q.optionC,
            optionD: q.optionD,
            correctOption: q.correctOption,
            explanation: q.explanation ?? null,
            marks: 2,
            negativeMarks: NEG,
            source: "official_pyq",
          })),
        },
      },
    });
    console.log(`Seeded ESE ${year} ${label} (${qs.length} Q)`);
  }
  console.log("IES official PYQ seed complete");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
