import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";
import { Pool } from "pg";
import { buildIesDemoPaper, buildIesPracticeSet } from "../src/lib/exam/iesQuestionBank";
import { IES_SYLLABUS } from "../src/lib/exam/iesTaxonomy";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });

async function main() {
  const existing = await prisma.paper.count({
    where: { exam: "ies_civil", mode: "full_mock", source: "seed" },
  });
  if (existing === 0) {
    for (const paper of ["ce_paper1", "ce_paper2"] as const) {
      const questions = buildIesDemoPaper(paper, 1, 30);
      const label = paper === "ce_paper1" ? "Paper-I" : "Paper-II";
      await prisma.paper.create({
        data: {
          title: `IES Civil ${label} Demo Mock (30 Q · 3h pattern)`,
          tier: paper === "ce_paper1" ? "ies_paper1" : "ies_paper2",
          exam: "ies_civil",
          iesPaper: paper,
          year: 2024,
          mode: "full_mock",
          source: "seed",
          difficulty: "hard",
          questions: { create: questions },
        },
      });
      console.log("Seeded demo", label);
    }
  } else {
    console.log("Mocks already present:", existing);
  }

  const prac = await prisma.paper.count({
    where: { exam: "ies_civil", mode: "topic_practice" },
  });
  if (prac === 0) {
    for (const sub of IES_SYLLABUS.slice(0, 6)) {
      const questions = buildIesPracticeSet(sub.key, 1, 10);
      await prisma.paper.create({
        data: {
          title: `IES · ${sub.title} drill (10 Q)`,
          tier: "practice",
          exam: "ies_civil",
          iesPaper: sub.paper === "both" ? "ce_paper1" : sub.paper,
          mode: "topic_practice",
          focusSection: sub.key,
          focusTopic: sub.topics[0]?.id,
          source: "seed",
          difficulty: "hard",
          questions: { create: questions },
        },
      });
    }
    console.log("Seeded practice drills");
  } else {
    console.log("Practice already present:", prac);
  }
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
