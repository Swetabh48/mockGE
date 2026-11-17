/**
 * Build the 30 EPFO APFC mock papers into public/epfo/.
 *   npm run epfo:build               → strict (fails if the bank is short)
 *   npm run epfo:build -- --allow-short   → dev preview with partial papers
 */
import { mkdirSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { buildPapers, nearDuplicates } from "../src/lib/epfo/build";
import type { EpfoPaperMeta } from "../src/lib/epfo/types";

const allowShort = process.argv.includes("--allow-short");
const { papers, report, warnings } = buildPapers({ allowShort });

const outDir = join(process.cwd(), "public", "epfo", "papers");
mkdirSync(outDir, { recursive: true });
for (const f of readdirSync(outDir)) if (f.endsWith(".json")) rmSync(join(outDir, f));

const index: EpfoPaperMeta[] = [];
for (const p of papers) {
  writeFileSync(join(outDir, `${p.id}.json`), JSON.stringify(p));
  index.push({ id: p.id, number: p.number, band: p.band, title: p.title, questionCount: p.questions.length });
}
writeFileSync(join(process.cwd(), "public", "epfo", "index.json"), JSON.stringify({ papers: index }, null, 1));

console.log("Section bank usage:");
for (const r of report) {
  const flag = r.available < r.needed ? `  SHORT by ${r.needed - r.available}` : r.unused ? `  (+${r.unused} spare)` : "";
  console.log(`  ${r.sec.padEnd(11)} ${String(r.available).padStart(4)} / ${r.needed}${flag}`);
}
const letters = [0, 0, 0, 0];
for (const p of papers) for (const q of p.questions) letters[q.a]! += 1;
console.log(`Answer spread a/b/c/d: ${letters.join(" / ")}`);
for (const w of warnings) console.log(`WARN ${w}`);
const dups = nearDuplicates(0.75);
console.log(`Near-duplicate authored stems (Jaccard ≥ 0.75): ${dups.length}`);
for (const [a, b, j] of dups.slice(0, 40)) console.log(`  ${j.toFixed(2)} | ${a.slice(0, 70)} || ${b.slice(0, 70)}`);
console.log(`Wrote ${papers.length} papers to public/epfo/papers`);
