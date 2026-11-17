/**
 * Assembles the 30 EPFO APFC mock papers (10 easy, 10 medium, 10 hard) from the
 * authored bank + computed generators. Deterministic: same input → same papers.
 * Run via `npm run epfo:build` (scripts/build_epfo_papers.ts).
 */
import { BANKS } from "./bank";
import type { Item } from "./bank/dsl";
import { ACCOUNTING_GENERATORS, ECONOMY_GENERATORS, SOCIAL_GENERATORS } from "./gen/applied";
import type { Generator, Level } from "./gen/common";
import { QUANT_GENERATORS } from "./gen/quant";
import { hashStr, makeRng, type Rng } from "./rng";
import { EPFO_SECTIONS, LABOUR_SOCIAL_RANGE } from "./sections";
import { EPFO_EXAM, type Band, type EpfoPaper, type EpfoQuestion, type SectionKey } from "./types";

export const BANDS: Band[] = ["easy", "medium", "hard"];
export const PAPERS_PER_BAND = 10;
const SEED = "epfo-apfc-v2";
const PAPER_COUNT = BANDS.length * PAPERS_PER_BAND;

/**
 * How many questions of each section come from generators; the rest come from the bank.
 * `n: "all"` = the whole section is generated (aptitude & reasoning).
 */
export const GENERATED: Partial<Record<SectionKey, { n: number | "all"; gens: Generator[] }>> = {
  quant: { n: "all", gens: QUANT_GENERATORS },
  accounting: { n: 5, gens: ACCOUNTING_GENERATORS },
  social: { n: 2, gens: SOCIAL_GENERATORS },
  economy: { n: 1, gens: ECONOMY_GENERATORS },
};

function generatedCount(sec: SectionKey, sectionCount: number): number {
  const g = GENERATED[sec];
  if (!g) return 0;
  return g.n === "all" ? sectionCount : Math.min(g.n, sectionCount);
}

/**
 * Per-paper section counts. Every paper sums to 120; each section stays inside its
 * [min, max]; labour + social security stays inside LABOUR_SOCIAL_RANGE; and the
 * total per section within each difficulty band equals 10 × the section average, so
 * the bank is used evenly. Built by random 2×2 swaps between papers of the same band.
 */
export function sectionLayout(): Record<SectionKey, number>[] {
  const keys = EPFO_SECTIONS.map((s) => s.key);
  const meta = Object.fromEntries(EPFO_SECTIONS.map((s) => [s.key, s])) as Record<SectionKey, (typeof EPFO_SECTIONS)[number]>;
  const layout: Record<SectionKey, number>[] = Array.from({ length: PAPER_COUNT }, () =>
    Object.fromEntries(EPFO_SECTIONS.map((s) => [s.key, s.count])) as Record<SectionKey, number>,
  );
  const rng = makeRng(`${SEED}:layout`);
  const ok = (row: Record<SectionKey, number>) =>
    keys.every((k) => row[k] >= meta[k].min && row[k] <= meta[k].max) &&
    row.labour + row.social >= LABOUR_SOCIAL_RANGE[0] &&
    row.labour + row.social <= LABOUR_SOCIAL_RANGE[1];
  for (let bi = 0; bi < BANDS.length; bi++) {
    for (let it = 0; it < 900; it++) {
      const p = bi * PAPERS_PER_BAND + rng.int(0, PAPERS_PER_BAND - 1);
      let q = bi * PAPERS_PER_BAND + rng.int(0, PAPERS_PER_BAND - 1);
      if (q === p) q = bi * PAPERS_PER_BAND + ((q - bi * PAPERS_PER_BAND + 1) % PAPERS_PER_BAND);
      const a = rng.pick(keys);
      const b = rng.pick(keys);
      if (a === b) continue;
      const P = { ...layout[p]! };
      const Q = { ...layout[q]! };
      P[a] += 1; P[b] -= 1;
      Q[a] -= 1; Q[b] += 1;
      if (ok(P) && ok(Q)) {
        layout[p] = P;
        layout[q] = Q;
      }
    }
  }
  return layout;
}

export function bankNeeds(sec: SectionKey, layout: Record<SectionKey, number>[]): number[] {
  return layout.map((row) => row[sec] - generatedCount(sec, row[sec]));
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
  sec: SectionKey;
  available: number;
  needed: number;
  unused: number;
};

/** Returns per-paper bank items: index = band*10 + k. `caps[i]` = bank questions for paper i. */
function allocate(sec: SectionKey, items: Item[], caps: number[], allowShort: boolean, report: SectionReport[]): Item[][] {
  const rng = makeRng(`${SEED}:${sec}`);
  const units = toUnits(items, rng).sort((a, b) => a.d - b.d || a.tie - b.tie);
  const out: Item[][] = Array.from({ length: PAPER_COUNT }, () => []);
  const needed = caps.reduce((a, b) => a + b, 0);
  report.push({ sec, available: items.length, needed, unused: Math.max(0, items.length - needed) });
  if (needed === 0) return out;
  if (items.length < needed && !allowShort) {
    throw new Error(`Section ${sec}: bank has ${items.length} items, needs ${needed}.`);
  }
  const remaining = [...units];
  // multi-question units (reading passages) are spread evenly across bands first,
  // so every paper gets its passage; singles then fill by difficulty.
  const multi = remaining.filter((u) => u.items.length > 1);
  for (const u of multi) remaining.splice(remaining.indexOf(u), 1);
  const perBandMulti = Math.floor(multi.length / BANDS.length);
  const multiByBand: Unit[][] = BANDS.map((_, bi) =>
    multi.slice(bi * perBandMulti, bi === BANDS.length - 1 ? multi.length : (bi + 1) * perBandMulti),
  );
  BANDS.forEach((_, bi) => {
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
    // multi-question units first, then singles; spread topics across the 10 papers
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
        if (!allowShort) throw new Error(`Section ${sec}: could not place a ${u.items.length}-question unit in band ${BANDS[bi]}`);
        continue;
      }
      cap[best]! -= u.items.length;
      topicCount[best]!.set(u.topic, (topicCount[best]!.get(u.topic) ?? 0) + 1);
      out[bi * PAPERS_PER_BAND + best]!.push(...u.items);
    }
  });
  return out;
}

type Draft = Omit<EpfoQuestion, "n" | "a" | "o"> & { opts: string[]; correct: number; fixed: boolean };

export type BuildResult = { papers: EpfoPaper[]; report: SectionReport[]; warnings: string[] };

export function buildPapers(opts: { allowShort?: boolean } = {}): BuildResult {
  const allowShort = Boolean(opts.allowShort);
  const report: SectionReport[] = [];
  const warnings: string[] = [];
  const seen = new Map<string, string>();

  // bank-level duplicate check
  for (const s of EPFO_SECTIONS) {
    for (const it of BANKS[s.key]) {
      const k = normStem(it.q + (it.p ? ` ${it.p}` : ""));
      if (seen.has(k)) throw new Error(`Duplicate stem in bank (${s.key}): ${it.q.slice(0, 90)}`);
      seen.set(k, s.key);
    }
  }

  const layout = sectionLayout();
  const perSection = new Map<SectionKey, Item[][]>();
  for (const s of EPFO_SECTIONS) {
    perSection.set(s.key, allocate(s.key, BANKS[s.key], bankNeeds(s.key, layout), allowShort, report));
  }

  const papers: EpfoPaper[] = [];
  for (let bi = 0; bi < BANDS.length; bi++) {
    for (let k = 0; k < PAPERS_PER_BAND; k++) {
      const idx = bi * PAPERS_PER_BAND + k;
      const band = BANDS[bi]!;
      const lvl = (bi + 1) as Level;
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
        const g = GENERATED[s.key];
        const nGen = generatedCount(s.key, layout[idx]![s.key]);
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

      if (questions.length !== EPFO_EXAM.questions) {
        warnings.push(`Paper ${idx + 1} has ${questions.length} questions (expected ${EPFO_EXAM.questions}).`);
      }

      const number = idx + 1;
      const local = k + 1;
      papers.push({
        id: `epfo-${band[0]}${String(local).padStart(2, "0")}`,
        number,
        band,
        title: `APFC Mock ${String(number).padStart(2, "0")} · ${band[0]!.toUpperCase()}${band.slice(1)}`,
        durationMin: EPFO_EXAM.durationMin,
        marksPerQ: EPFO_EXAM.marksPerQ,
        negPerQ: EPFO_EXAM.negPerQ,
        questions,
      });
    }
  }
  return { papers, report, warnings };
}

/** Token-set similarity for spotting near-duplicate authored stems. */
export function nearDuplicates(threshold = 0.8): [string, string, number][] {
  const all: string[] = [];
  for (const s of EPFO_SECTIONS) for (const it of BANKS[s.key]) all.push(it.q);
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
