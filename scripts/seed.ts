import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";
import { Pool } from "pg";
import {
  buildTier1Paper,
  buildTier2Paper,
  buildSectionPractice,
  buildTopicPractice,
  DEST_PASSAGES,
} from "../src/lib/exam/questionBank";
import { PRACTICE_SYLLABUS } from "../src/lib/exam/taxonomy";

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
    { key: "reasoning" as const, title: "Reasoning" },
    { key: "quant" as const, title: "Quantitative Aptitude" },
    { key: "english" as const, title: "English" },
    { key: "ga" as const, title: "General Awareness / GK" },
  ];

  for (const s of subjects) {
    for (let setNo = 1; setNo <= 2; setNo++) {
      const questions = buildSectionPractice(s.key, setNo);
      await prisma.paper.create({
        data: {
          title: `${s.title} — Section Drill ${setNo} (25 Q · 15 min)`,
          tier: "practice",
          mode: "practice",
          focusSection: s.key,
          source: "seed",
          difficulty: "hard",
          questions: { create: questions },
        },
      });
      console.log(`Seeded section practice ${s.key} set ${setNo}`);
    }
  }

  // Topic / subtopic drills (10 Q each) — Practice section
  for (const subject of PRACTICE_SYLLABUS) {
    for (const topic of subject.topics) {
      for (const sub of topic.subtopics) {
        const questions = buildTopicPractice(subject.key, topic.title, sub.title, 1);
        await prisma.paper.create({
          data: {
            title: `${subject.title} · ${topic.title} · ${sub.title} (10 Q)`,
            tier: "practice",
            mode: "topic_practice",
            focusSection: subject.key,
            focusTopic: topic.id,
            focusSubtopic: sub.id,
            source: "topic_practice",
            difficulty: "hard",
            questions: { create: questions },
          },
        });
      }
      console.log(`Seeded topic drills: ${subject.key}/${topic.id}`);
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
