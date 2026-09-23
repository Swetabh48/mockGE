import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";
import { Pool } from "pg";
import {
  buildTier1Paper,
  buildTier2Paper,
  buildSectionPractice,
  DEST_PASSAGES,
} from "../src/lib/exam/questionBank";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL is required");
}

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function seed() {
  await prisma.answerEvent.deleteMany();
  await prisma.attempt.deleteMany();
  await prisma.question.deleteMany();
  await prisma.paper.deleteMany();

  for (let i = 1; i <= 3; i++) {
    const questions = buildTier1Paper(i);
    await prisma.paper.create({
      data: {
        title:
          i === 2
            ? `Tier-I PYQ-Style Hard Mock ${i}`
            : `Tier-I Full Mock ${i} (Hard · 4×15 min)`,
        tier: "tier1",
        mode: i === 2 ? "pyq" : "full_mock",
        source: i === 2 ? "pyq_style" : "seed",
        difficulty: "hard",
        questions: { create: questions },
      },
    });
    console.log(`Seeded Tier-I ${i}`);
  }

  for (let i = 1; i <= 2; i++) {
    const questions = buildTier2Paper(i);
    await prisma.paper.create({
      data: {
        title: `Tier-II Paper-I Hard Mock ${i}`,
        tier: "tier2",
        mode: "full_mock",
        source: i === 2 ? "pyq_style" : "seed",
        difficulty: "hard",
        destPassage: DEST_PASSAGES[(i - 1) % DEST_PASSAGES.length],
        questions: { create: questions },
      },
    });
    console.log(`Seeded Tier-II ${i}`);
  }

  const subjects = [
    { key: "reasoning", title: "Reasoning" },
    { key: "quant", title: "Quantitative Aptitude" },
    { key: "english", title: "English" },
    { key: "ga", title: "General Awareness / GK" },
  ] as const;

  for (const s of subjects) {
    for (let setNo = 1; setNo <= 2; setNo++) {
      const questions = buildSectionPractice(s.key, setNo);
      await prisma.paper.create({
        data: {
          title: `${s.title} — Practice Set ${setNo} (25 Q · 15 min)`,
          tier: "practice",
          mode: "practice",
          focusSection: s.key,
          source: "seed",
          difficulty: "hard",
          questions: { create: questions },
        },
      });
      console.log(`Seeded practice ${s.key} set ${setNo}`);
    }
  }

  console.log("Seed complete");
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
