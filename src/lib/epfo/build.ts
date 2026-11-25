/**
 * Assembles the EPFO APFC mock papers from authored banks + computed generators.
 * Deterministic: same input → same papers. Run via `npm run epfo:build`.
 *
 *  - Classic series (papers 1–30): 10 easy, 10 medium, 10 hard; fixed section split.
 *  - 2025-pattern series (papers 31–40, ids epfo-h11…h20): all hard, analytical items
 *    from `bank25/`, section mix varied per paper around the 2025 Recruitment Test.
 *
 * No question stem appears twice anywhere across both series.
 */
import { BANKS } from "./bank";
import { BANKS25 } from "./bank25";
import type { Item } from "./bank/dsl";
import { ACCOUNTING_GENERATORS, ECONOMY_GENERATORS, SOCIAL_GENERATORS } from "./gen/applied";
import type { Generator, Level } from "./gen/common";
import { QUANT_GENERATORS } from "./gen/quant";
import { QUANT25_GENERATORS } from "./gen/quant25";
import { SOCIAL25_GENERATORS } from "./gen/social25";
import { hashStr, makeRng, type Rng } from "./rng";
import { EPFO_SECTIONS, LABOUR_SOCIAL_RANGE } from "./sections";
import { EPFO_EXAM, type Band, type EpfoPaper, type EpfoQuestion, type SectionKey } from "./types";

export const PAPERS_PER_BAND = 10;

type GenSpec = Partial<Record<SectionKey, { n: number | "all"; gens: Generator[] }>>;
type Layout = Record<SectionKey, number>[];

type Series = {
  key: "classic" | "y25";
  seed: string;
  bands: Band[];
  banks: Record<SectionKey, Item[]>;
  generated: GenSpec;
  layout: () => Layout;
  level: (bandIndex: number) => Level;
  id: (band: Band, k: number) => string;
  number: (bandIndex: number, k: number) => number;
  title: (band: Band, number: number) => string;
  pattern?: "2025";
};

function generatedCount(spec: GenSpec, sec: SectionKey, sectionCount: number): number {
  const g = spec[sec];
  if (!g) return 0;
  return g.n === "all" ? sectionCount : Math.min(g.n, sectionCount);
}

const cap1 = (s: string) => s[0]!.toUpperCase() + s.slice(1);

/** Classic: fixed counts for all 30 papers. */
function classicLayout(): Layout {
  return Array.from({ length: 30 }, () => Object.fromEntries(EPFO_SECTIONS.map((s) => [s.key, s.count])) as Record<SectionKey, number>);
}

/**
 * 2025 pattern: start from the averages and apply random 2×2 swaps between papers,
 * keeping every paper at 120, every section inside [min, max], labour + social security
 * inside LABOUR_SOCIAL_RANGE, and each section's total across the series unchanged.
 */
export function y25Layout(seed = "epfo-apfc-2025"): Layout {
  const keys = EPFO_SECTIONS.map((s) => s.key);
  const meta = Object.fromEntries(EPFO_SECTIONS.map((s) => [s.key, s])) as Record<SectionKey, (typeof EPFO_SECTIONS)[number]>;
  const layout: Layout = Array.from({ length: PAPERS_PER_BAND }, () =>
    Object.fromEntries(EPFO_SECTIONS.map((s) => [s.key, s.y25[0]])) as Record<SectionKey, number>,
  );
  const rng = makeRng(`${seed}:layout`);
  const ok = (row: Record<SectionKey, number>) =>
    keys.every((k) => row[k] >= meta[k].y25[1] && row[k] <= meta[k].y25[2]) &&
    row.labour + row.social >= LABOUR_SOCIAL_RANGE[0] &&
    row.labour + row.social <= LABOUR_SOCIAL_RANGE[1];
  for (let it = 0; it < 1200; it++) {
    const p = rng.int(0, PAPERS_PER_BAND - 1);
    let q = rng.int(0, PAPERS_PER_BAND - 1);
    if (q === p) q = (q + 1) % PAPERS_PER_BAND;
    const a = rng.pick(keys);
    const b = rng.pick(keys);
    if (a === b) continue;
    const P = { ...layout[p]! };
    const Q = { ...layout[q]! };
    P[a] += 1;
    P[b] -= 1;
    Q[a] -= 1;
    Q[b] += 1;
    if (ok(P) && ok(Q)) {
      layout[p] = P;
      layout[q] = Q;
    }
  }
  return layout;
}

export const SERIES: Series[] = [
  {
    key: "classic",
    seed: "epfo-apfc-v1",
    bands: ["easy", "medium", "hard"],
    banks: BANKS,
    generated: {
      quant: { n: 14, gens: QUANT_GENERATORS },
      accounting: { n: 7, gens: ACCOUNTING_GENERATORS },
      social: { n: 2, gens: SOCIAL_GENERATORS },
      economy: { n: 1, gens: ECONOMY_GENERATORS },
    },
    layout: classicLayout,
    level: (bi) => (bi + 1) as Level,
    id: (band, k) => `epfo-${band[0]}${String(k + 1).padStart(2, "0")}`,
    number: (bi, k) => bi * PAPERS_PER_BAND + k + 1,
    title: (band, n) => `APFC Mock ${String(n).padStart(2, "0")} · ${cap1(band)}`,
  },
  {
    key: "y25",
    seed: "epfo-apfc-2025",
    bands: ["hard"],
    banks: BANKS25,
    generated: {
      quant: { n: "all", gens: QUANT25_GENERATORS },
      accounting: { n: 4, gens: ACCOUNTING_GENERATORS },
      social: { n: 3, gens: SOCIAL25_GENERATORS },
      economy: { n: 1, gens: ECONOMY_GENERATORS },
    },
    layout: () => y25Layout(),
    level: () => 3,
    id: (_band, k) => `epfo-h${String(k + 11).padStart(2, "0")}`,
    number: (_bi, k) => 31 + k,
    title: (_band, n) => `APFC Mock ${n} · Hard · 2025 pattern`,
    pattern: "2025",
  },
];

export function bankNeeds(series: Series, sec: SectionKey, layout: Layout): number[] {
  return layout.map((row) => row[sec] - generatedCount(series.generated, sec, row[sec]));
}

export function normStem(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

type Unit = { items: Item[]; d: number; topic: string; tie: number };

function toUnits(items: Item[], rng: Rng): Unit[] {
  const byPassage = new Map<string, Item[]>();
  const units: Unit[] = [];
  for (const it of items) {
    if (it.p) {
      const arr = byPassage.get(it.p) ?? [];
      arr.push(it);
      byPassage.set(it.p, arr);
    } else {
      units.push({ items: [it], d: it.d, topic: it.topic, tie: rng.next() });
    }
  }
  for (const arr of byPassage.values()) {
    units.push({
      items: arr,
      d: arr.reduce((a, b) => a + b.d, 0) / arr.length,
      topic: "Reading Comprehension",
      tie: rng.next(),
    });
  }
  return units;
}

export type SectionReport = {
  series: string;
  sec: SectionKey;
  available: number;
  needed: number;
  unused: number;
};

/** Returns per-paper bank items: index = band*10 + k. `caps[i]` = bank questions for paper i. */
function allocate(
  seed: string,
  seriesKey: string,
  nBands: number,
  sec: SectionKey,
  items: Item[],
  caps: number[],
  allowShort: boolean,
  report: SectionReport[],
): Item[][] {
  const rng = makeRng(`${seed}:${sec}`);
  const units = toUnits(items, rng).sort((a, b) => a.d - b.d || a.tie - b.tie);
  const out: Item[][] = Array.from({ length: caps.length }, () => []);
  const needed = caps.reduce((a, b) => a + b, 0);
  report.push({ series: seriesKey, sec, available: items.length, needed, unused: Math.max(0, items.length - needed) });
  if (needed === 0) return out;
  if (items.length < needed && !allowShort) {
    throw new Error(`[${seriesKey}] Section ${sec}: bank has ${items.length} items, needs ${needed}.`);
  }
  const remaining = [...units];
  // multi-question units (reading passages) are spread evenly across bands first,
  // so every paper gets its passages; singles then fill by difficulty.
  const multi = remaining.filter((u) => u.items.length > 1);
  for (const u of multi) remaining.splice(remaining.indexOf(u), 1);
  const perBandMulti = Math.floor(multi.length / nBands);
  const multiByBand: Unit[][] = Array.from({ length: nBands }, (_, bi) =>
    multi.slice(bi * perBandMulti, bi === nBands - 1 ? multi.length : (bi + 1) * perBandMulti),
  );
  for (let bi = 0; bi < nBands; bi++) {
    const bandCaps = caps.slice(bi * PAPERS_PER_BAND, (bi + 1) * PAPERS_PER_BAND);
    const bandUnits: Unit[] = [...multiByBand[bi]!];
    let need = bandCaps.reduce((a, b) => a + b, 0) - bandUnits.reduce((n, u) => n + u.items.length, 0);
    for (let i = 0; i < remaining.length && need > 0; ) {
      const u = remaining[i]!;
      if (u.items.length <= need) {
        bandUnits.push(u);
        need -= u.items.length;
        remaining.splice(i, 1);
      } else i++;
    }
    // multi-question units first, then singles; spread topics across the papers
    bandUnits.sort((a, b) => b.items.length - a.items.length || a.tie - b.tie);
    const cap = [...bandCaps];
    const topicCount: Map<string, number>[] = Array.from({ length: PAPERS_PER_BAND }, () => new Map());
    for (const u of bandUnits) {
      let best = -1;
      let bestScore = Infinity;
      for (let k = 0; k < PAPERS_PER_BAND; k++) {
        if (cap[k]! < u.items.length) continue;
        const score = (topicCount[k]!.get(u.topic) ?? 0) * 1000 - cap[k]! * 10 + rng.next();
        if (score < bestScore) {
          bestScore = score;
          best = k;
        }
      }
      if (best < 0) {
        if (!allowShort) throw new Error(`[${seriesKey}] Section ${sec}: could not place a ${u.items.length}-question unit`);
        continue;
      }
      cap[best]! -= u.items.length;
      topicCount[best]!.set(u.topic, (topicCount[best]!.get(u.topic) ?? 0) + 1);
      out[bi * PAPERS_PER_BAND + best]!.push(...u.items);
    }
  }
  return out;
}

type Draft = Omit<EpfoQuestion, "n" | "a" | "o"> & { opts: string[]; correct: number; fixed: boolean };

export type BuildResult = { papers: EpfoPaper[]; report: SectionReport[]; warnings: string[] };

function buildSeries(series: Series, seen: Map<string, string>, allowShort: boolean, report: SectionReport[], warnings: string[]): EpfoPaper[] {
  const SEED = series.seed;
  const layout = series.layout();
  const perSection = new Map<SectionKey, Item[][]>();
  for (const s of EPFO_SECTIONS) {
    perSection.set(
      s.key,
      allocate(SEED, series.key, series.bands.length, s.key, series.banks[s.key], bankNeeds(series, s.key, layout), allowShort, report),
    );
  }

  const papers: EpfoPaper[] = [];
  for (let bi = 0; bi < series.bands.length; bi++) {
    for (let k = 0; k < PAPERS_PER_BAND; k++) {
      const idx = bi * PAPERS_PER_BAND + k;
      const band = series.bands[bi]!;
      const lvl = series.level(bi);
      const prng = makeRng(`${SEED}:paper:${idx}`);
      const drafts: Draft[] = [];

      for (const s of EPFO_SECTIONS) {
        const secDrafts: Draft[] = [];
        const bankItems = perSection.get(s.key)![idx]!;
        for (const it of bankItems) {
          const ans = it.o[it.a]!;
          const x = it.x.length < 70 && !it.x.toLowerCase().includes(ans.toLowerCase()) ? `Correct answer: ${ans}. ${it.x}` : it.x;
          secDrafts.push({ sec: s.key, topic: it.topic, q: it.q, x, p: it.p, opts: it.o, correct: it.a, fixed: it.fixed });
        }
        const g = series.generated[s.key];
        const nGen = generatedCount(series.generated, s.key, layout[idx]![s.key]);
        if (g && nGen > 0) {
          const gens = prng.shuffle(g.gens).slice(0, nGen);
          let gi = 0;
          while (gens.length < nGen) gens.push(g.gens[gi++ % g.gens.length]!);
          for (const gen of gens) {
            let made = null as ReturnType<Generator["make"]> | null;
            for (let attempt = 0; attempt < 60; attempt++) {
              const gr = makeRng(hashStr(`${SEED}:${idx}:${gen.id}:${attempt}:${drafts.length + secDrafts.length}`));
              let lv: Level = lvl;
              // a little spread inside a band
              if (gr.chance(0.2)) lv = Math.max(1, Math.min(3, lvl + (gr.chance(0.5) ? 1 : -1))) as Level;
              const c = gen.make(gr, lv);
              const key = normStem(c.q);
              if (seen.has(key)) continue;
              if (new Set(c.o).size !== 4) continue;
              seen.set(key, s.key);
              made = c;
              break;
            }
            if (!made) throw new Error(`Generator ${gen.id} could not produce a unique question`);
            secDrafts.push({ sec: s.key, topic: made.topic, q: made.q, x: made.x, opts: made.o, correct: 0, fixed: false });
          }
        }
        // order inside section: shuffle singles, keep passage groups together at the end
        const singles = prng.shuffle(secDrafts.filter((d) => !d.p));
        const grouped = secDrafts.filter((d) => d.p);
        drafts.push(...singles, ...grouped);
      }

      // balance answer letters across the paper
      const target = [0, 0, 0, 0];
      for (const d of drafts) if (d.fixed) target[d.correct]! += 1;
      const per = drafts.length / 4;
      const bag: number[] = [];
      for (let L = 0; L < 4; L++) for (let c = 0; c < Math.max(0, Math.round(per - target[L]!)); c++) bag.push(L);
      const free = drafts.filter((d) => !d.fixed).length;
      while (bag.length < free) bag.push(prng.int(0, 3));
      const shuffledBag = prng.shuffle(bag).slice(0, free);
      let bpos = 0;

      const questions: EpfoQuestion[] = drafts.map((d, i) => {
        let o: string[];
        let a: number;
        if (d.fixed) {
          o = d.opts;
          a = d.correct;
        } else {
          const correctText = d.opts[d.correct]!;
          const others = prng.shuffle(d.opts.filter((_, j) => j !== d.correct));
          a = shuffledBag[bpos++]!;
          o = [...others];
          o.splice(a, 0, correctText);
        }
        return {
          n: i + 1,
          sec: d.sec,
          topic: d.topic,
          q: d.q,
          o: o as [string, string, string, string],
          a: a as 0 | 1 | 2 | 3,
          x: d.x,
          ...(d.p ? { p: d.p } : {}),
        };
      });

      const number = series.number(bi, k);
      if (questions.length !== EPFO_EXAM.questions) {
        warnings.push(`Paper ${number} has ${questions.length} questions (expected ${EPFO_EXAM.questions}).`);
      }

      papers.push({
        id: series.id(band, k),
        number,
        band,
        title: series.title(band, number),
        durationMin: EPFO_EXAM.durationMin,
        marksPerQ: EPFO_EXAM.marksPerQ,
        negPerQ: EPFO_EXAM.negPerQ,
        ...(series.pattern ? { pattern: series.pattern } : {}),
        questions,
      });
    }
  }
  return papers;
}

export function buildPapers(opts: { allowShort?: boolean } = {}): BuildResult {
  const allowShort = Boolean(opts.allowShort);
  const report: SectionReport[] = [];
  const warnings: string[] = [];
  const seen = new Map<string, string>();
  const papers: EpfoPaper[] = [];

  // Each series registers its bank stems just before it is built, so the classic
  // series is reproduced exactly; every later series is checked against everything before it.
  for (const series of SERIES) {
    for (const s of EPFO_SECTIONS) {
      for (const it of series.banks[s.key]) {
        const k = normStem(it.q + (it.p ? ` ${it.p}` : ""));
        if (seen.has(k)) throw new Error(`Duplicate stem (${series.key}/${s.key}): ${it.q.slice(0, 90)}`);
        seen.set(k, s.key);
      }
    }
    papers.push(...buildSeries(series, seen, allowShort, report, warnings));
  }
  return { papers, report, warnings };
}

/** Token-set similarity for spotting near-duplicate authored stems across all banks. */
export function nearDuplicates(threshold = 0.8): [string, string, number][] {
  const all: string[] = [];
  for (const series of SERIES) for (const s of EPFO_SECTIONS) for (const it of series.banks[s.key]) all.push(it.q);
  // ignore boilerplate tokens shared by many stems ("choose", "following", "statements"...)
  const df = new Map<string, number>();
  const raw = all.map((q) => new Set(normStem(q).split(" ").filter((w) => w.length > 3)));
  for (const s of raw) for (const w of s) df.set(w, (df.get(w) ?? 0) + 1);
  const toks = raw.map((s) => new Set([...s].filter((w) => (df.get(w) ?? 0) <= 12)));
  const out: [string, string, number][] = [];
  for (let i = 0; i < all.length; i++) {
    for (let j = i + 1; j < all.length; j++) {
      const A = toks[i]!, B = toks[j]!;
      if (A.size < 4 || B.size < 4) continue;
      let inter = 0;
      for (const w of A) if (B.has(w)) inter++;
      const jac = inter / (A.size + B.size - inter);
      if (jac >= threshold) out.push([all[i]!, all[j]!, jac]);
    }
  }
  return out;
}
