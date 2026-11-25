/**
 * 2025-pattern aptitude & reasoning generators: lengthier, puzzle-style items of the
 * kind reported in the 30 Nov 2025 EPFO paper (logs/digits, candles, alphanumeric
 * series, coded blood relations, work & wages, meeting trains, card probability).
 */
import { frac, gcd, inr, lcm, rs } from "../rng";
import { options, textOptions, type Generator } from "./common";
import { QUANT_GENERATORS } from "./quant";

const LOGS: Record<number, number> = { 2: 0.301, 3: 0.4771, 6: 0.7781, 7: 0.8451, 12: 1.0792, 18: 1.2553, 24: 1.3802 };

const digitsByLog: Generator = {
  id: "digits-log",
  topic: "Number System",
  make(r) {
    const base = r.pick([2, 3, 6, 7, 12, 18, 24]);
    const n = r.int(18, 60);
    const digits = String(BigInt(base) ** BigInt(n)).length;
    const lg = LOGS[base]!;
    const given = base === 2 || base === 3 || base === 7 ? `log₁₀ ${base} = ${lg}` : "log₁₀ 2 = 0.3010 and log₁₀ 3 = 0.4771";
    const product = n * lg;
    return {
      topic: "Number System",
      q: `Given ${given}, how many digits are there in ${base}^${n}?`,
      o: options(digits, [digits - 1, digits + 1, Math.round(product)], (v) => String(v), 1),
      x: `log₁₀(${base}^${n}) = ${n} × log₁₀ ${base} = ${n} × ${lg} = ${product.toFixed(4)}.\nThe characteristic is ${Math.floor(product)}, so the number of digits = ${Math.floor(product)} + 1 = ${digits}.`,
    };
  },
};

const candles: Generator = {
  id: "candles",
  topic: "Time & Work",
  make(r) {
    const fmt = (m: number) => `${Math.floor(m / 60)} h ${m % 60} min`;
    for (let t = 0; t < 400; t++) {
      const a = r.int(4, 12);
      const b = r.int(2, a - 1);
      const tm = (a * b * 60) / (2 * a - b);
      if (!Number.isInteger(tm) || tm >= b * 60) continue;
      return {
        topic: "Time & Work",
        q: `Two candles of the same length are lit at the same time. The first burns out completely in ${a} hours and the second in ${b} hours, each burning at a uniform rate. After how long will the first candle be exactly twice as long as the second?`,
        o: textOptions(fmt(tm), [fmt(Math.round((a * b * 60) / (a + b))), fmt(Math.round(tm + 30)), fmt(Math.round((a * b * 60) / (a + 2 * b)))], () => fmt(r.int(30, b * 60 - 1))),
        x: `After t hours the first candle has (1 − t/${a}) of its length left and the second (1 − t/${b}).\n1 − t/${a} = 2(1 − t/${b}) ⇒ t(2/${b} − 1/${a}) = 1 ⇒ t = ${a}×${b}/(2×${a} − ${b}) = ${a * b}/${2 * a - b} h = ${fmt(tm)}.`,
      };
    }
    throw new Error("candles: no integer case");
  },
};

const alphaNumSeries: Generator = {
  id: "alphanumeric-series",
  topic: "Series",
  make(r) {
    const L = (i: number) => String.fromCharCode(65 + (((i % 26) + 26) % 26));
    const s = r.int(0, 10);
    const step = r.int(2, 4);
    const gap = r.pick([2, 3]);
    const n0 = r.int(2, 9);
    const add = r.int(1, 4);
    const nums = [n0];
    for (let i = 1; i < 5; i++) nums.push(nums[i - 1]! + add * i);
    const term = (i: number) => `${L(s + i * step)}${nums[i]}${L(s + i * step + gap)}`;
    const ans = term(4);
    return {
      topic: "Series",
      q: `Find the next term in the series: ${[0, 1, 2, 3].map(term).join(", ")}, ?`,
      o: [
        ans,
        `${L(s + 4 * step + 1)}${nums[4]}${L(s + 4 * step + gap + 1)}`,
        `${L(s + 4 * step)}${nums[4]! + 1}${L(s + 4 * step + gap)}`,
        `${L(s + 4 * step)}${nums[4]}${L(s + 4 * step + gap - 1)}`,
      ],
      x: `First letters advance by ${step} (${[0, 1, 2, 3, 4].map((i) => L(s + i * step)).join(", ")}); the last letter is always ${gap} places after the first; the numbers increase by ${add}, ${add * 2}, ${add * 3}, … (${nums.join(", ")}).\nNext term: ${ans}.`,
    };
  },
};

type Rel = "father" | "mother" | "brother" | "sister" | "son" | "daughter" | "husband" | "wife";
const relWord: Record<Rel, string> = {
  father: "the father of",
  mother: "the mother of",
  brother: "the brother of",
  sister: "the sister of",
  son: "the son of",
  daughter: "the daughter of",
  husband: "the husband of",
  wife: "the wife of",
};
/** Relation of X to Z when X r1 Y and Y r2 Z (one family, conventional exam assumptions). */
const COMPOSE: Record<string, string> = {
  "brother-father": "Paternal uncle",
  "sister-father": "Paternal aunt",
  "brother-mother": "Maternal uncle",
  "sister-mother": "Maternal aunt",
  "father-father": "Paternal grandfather",
  "mother-father": "Paternal grandmother",
  "father-mother": "Maternal grandfather",
  "mother-mother": "Maternal grandmother",
  "son-brother": "Nephew",
  "daughter-brother": "Niece",
  "son-sister": "Nephew",
  "daughter-sister": "Niece",
  "wife-father": "Mother",
  "husband-mother": "Father",
  "son-son": "Grandson",
  "daughter-son": "Granddaughter",
  "son-daughter": "Grandson",
  "daughter-daughter": "Granddaughter",
  "wife-brother": "Sister-in-law",
  "husband-sister": "Brother-in-law",
};

const codedRelations: Generator = {
  id: "coded-relations",
  topic: "Blood Relations",
  make(r) {
    const pair = r.pick(Object.keys(COMPOSE));
    const [r1, r2] = pair.split("-") as [Rel, Rel];
    const syms = r.shuffle(["+", "−", "×", "÷", "@", "#", "$", "%"]).slice(0, 4);
    const all: Rel[] = ["father", "mother", "brother", "sister", "son", "daughter", "husband", "wife"];
    const extra = r.shuffle(all.filter((x) => x !== r1 && x !== r2)).slice(0, 2);
    const rels: Rel[] = r.shuffle([...new Set<Rel>([r1, r2, ...extra])]).slice(0, 4);
    const legend = rels.map((rel, i) => `'A ${syms[i]} B' means A is ${relWord[rel]} B`).join("; ");
    const s1 = syms[rels.indexOf(r1)]!;
    const s2 = syms[rels.indexOf(r2)]!;
    const [P, Q, R] = r.shuffle(["P", "Q", "R", "M", "N", "T", "K"]).slice(0, 3) as [string, string, string];
    const ans = COMPOSE[pair]!;
    const male = ["father", "brother", "son", "husband"].includes(r1);
    const femaleWords = /aunt|mother|sister|niece|daughter|grandmother/i;
    const pool = [...new Set(Object.values(COMPOSE))].filter((a) => a !== ans && (male ? !femaleWords.test(a) : femaleWords.test(a)));
    const fallback = [...new Set(Object.values(COMPOSE))].filter((a) => a !== ans);
    const others = r.shuffle(pool.length >= 3 ? pool : fallback).slice(0, 3);
    return {
      topic: "Blood Relations",
      q: `In a certain code, ${legend}. If '${P} ${s1} ${Q} ${s2} ${R}' (read as ${P} ${s1} ${Q} and ${Q} ${s2} ${R}), how is ${P} related to ${R}?`,
      o: [ans, ...others],
      x: `${P} ${s1} ${Q}: ${P} is ${relWord[r1]} ${Q}. ${Q} ${s2} ${R}: ${Q} is ${relWord[r2]} ${R}.\nCombining the two (all persons taken to be of one family, as is conventional): ${P} is the ${ans.toLowerCase()} of ${R}.`,
    };
  },
};

const workWages: Generator = {
  id: "work-wages",
  topic: "Time & Work",
  make(r) {
    for (let t = 0; t < 400; t++) {
      const a = r.int(6, 30);
      const b = r.int(6, 30);
      const c = r.int(8, 40);
      if (a === b || b === c || a === c) continue;
      const L = lcm(lcm(a, b), c);
      const ra = L / a;
      const rb = L / b;
      const rc = L / c;
      const sum = ra + rb + rc;
      const W = sum * 100 * r.int(1, 8);
      if (W < 5000 || W > 200000) continue;
      const shareC = (W * rc) / sum;
      return {
        topic: "Time & Work",
        q: `A, B and C can complete a contract alone in ${a}, ${b} and ${c} days respectively. Working together they finish it and receive ${rs(W)}. If payment is in proportion to the work done, C's share is:`,
        o: options(shareC, [W / 3, (W * ra) / sum, (W * c) / (a + b + c)], (v) => rs(Math.round(v)), 100),
        x: `Daily work rates are 1/${a} : 1/${b} : 1/${c} = ${ra} : ${rb} : ${rc} (LCM ${L}).\nWorking together, work done is in the same ratio, so C gets ${rc}/${sum} × ${inr(W)} = ${rs(shareC)}.`,
      };
    }
    throw new Error("work-wages: no case");
  },
};

const meetingTrains: Generator = {
  id: "meeting-trains",
  topic: "Speed, Time & Distance",
  make(r) {
    const [t1, t2] = r.shuffle([4, 9, 16, 25, 36, 49, 64, 81, 100]).slice(0, 2) as [number, number];
    const a = Math.sqrt(t2);
    const b = Math.sqrt(t1);
    const g = gcd(a, b);
    const ans = `${a / g} : ${b / g}`;
    const gt = gcd(t1, t2);
    return {
      topic: "Speed, Time & Distance",
      q: `Two trains start at the same time from stations X and Y towards each other. After they cross, they take ${t1} hours and ${t2} hours respectively to reach Y and X. The ratio of the speed of the train from X to that of the train from Y is:`,
      o: textOptions(ans, [`${b / g} : ${a / g}`, `${t2 / gt} : ${t1 / gt}`, `${t1 / gt} : ${t2 / gt}`], () => `${r.int(1, 9)} : ${r.int(1, 9)}`),
      x: `Standard result: S₁ : S₂ = √t₂ : √t₁, where t₁ and t₂ are the times taken after meeting.\n= √${t2} : √${t1} = ${a} : ${b} = ${ans}.`,
    };
  },
};

type Card = { s: string; k: string; red: boolean; face: boolean };
const DECK: Card[] = ["hearts", "diamonds", "clubs", "spades"].flatMap((s) =>
  ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"].map((k) => ({
    s,
    k,
    red: s === "hearts" || s === "diamonds",
    face: k === "J" || k === "Q" || k === "K",
  })),
);
const cardProb: Generator = {
  id: "card-probability",
  topic: "Probability",
  make(r) {
    const events: { d: string; f: (c: Card) => boolean }[] = [
      { d: "a face card or a spade", f: (c) => c.face || c.s === "spades" },
      { d: "a red card or a king", f: (c) => c.red || c.k === "K" },
      { d: "a black face card", f: (c) => !c.red && c.face },
      { d: "neither a heart nor a queen", f: (c) => c.s !== "hearts" && c.k !== "Q" },
      { d: "an ace or a diamond", f: (c) => c.k === "A" || c.s === "diamonds" },
      { d: "a numbered card (2 to 10) of a black suit", f: (c) => !c.red && !c.face && c.k !== "A" },
      { d: "a red face card or a black ace", f: (c) => (c.red && c.face) || (!c.red && c.k === "A") },
      { d: "a club that is not a face card", f: (c) => c.s === "clubs" && !c.face },
    ];
    const e = r.pick(events);
    const n = DECK.filter(e.f).length;
    return {
      topic: "Probability",
      q: `One card is drawn at random from a well-shuffled pack of 52 playing cards. What is the probability that it is ${e.d}?`,
      o: textOptions(frac(n, 52), [frac(n + 1, 52), frac(Math.max(1, n - 3), 52), frac(n + 4, 52)], () => frac(r.int(1, 51), 52)),
      x: `Count the favourable cards, removing any overlap between the two conditions: ${n} cards.\nP = ${n}/52 = ${frac(n, 52)}.`,
    };
  },
};

/** 2025-pattern pool: classic generators (minus the simplest) plus the puzzle-style ones above. */
export const QUANT25_GENERATORS: Generator[] = [
  ...QUANT_GENERATORS.filter((g) => !["odd-one", "letter-coding"].includes(g.id)),
  digitsByLog,
  candles,
  alphaNumSeries,
  codedRelations,
  workWages,
  meetingTrains,
  cardProb,
];
