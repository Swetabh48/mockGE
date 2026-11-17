/**
 * Small authoring DSL for the EPFO APFC question bank.
 *
 * Every item is original, written for mockGE. Conventions:
 *  - b.q(...)  : options[0] is the correct answer; order is shuffled at build time.
 *  - b.qf(...) : fixed option order with explicit answer index.
 *  - b.st(...) : UPSC "consider the following statements" with computed answer codes.
 *  - b.hm(...) : "how many of the above statements are correct?"
 *  - b.mt(...) : match List-I with List-II (codes generated).
 *  - b.ar(...) : Assertion–Reason.
 *  - b.er(...) : English error spotting (three parts + "No error").
 *  - b.rc(...) : reading comprehension question bound to a passage.
 *  - b.pool(...): correct answer + distractors drawn from a pool.
 */
import { hashStr, makeRng } from "../rng";

export type Difficulty = 1 | 2 | 3;

export type Item = {
  d: Difficulty;
  topic: string;
  q: string;
  o: string[];
  /** index of correct option in `o` */
  a: number;
  /** true = keep option order as authored */
  fixed: boolean;
  x: string;
  p?: string;
};

const AR_OPTIONS = [
  "Both A and R are true, and R is the correct explanation of A",
  "Both A and R are true, but R is NOT the correct explanation of A",
  "A is true, but R is false",
  "A is false, but R is true",
];

function codeLabel(set: number[], n: number): string {
  const s = [...set].sort((x, y) => x - y);
  if (s.length === 1) return `${s[0]} only`;
  if (s.length === n) {
    if (n === 2) return "Both 1 and 2";
    return `${s.slice(0, -1).join(", ")} and ${s[s.length - 1]}`;
  }
  return `${s.slice(0, -1).join(", ")} and ${s[s.length - 1]} only`;
}

function subsets(n: number): number[][] {
  const out: number[][] = [];
  for (let m = 1; m < 1 << n; m++) {
    const s: number[] = [];
    for (let i = 0; i < n; i++) if (m & (1 << i)) s.push(i + 1);
    out.push(s);
  }
  return out;
}

export class Bank {
  items: Item[] = [];
  private cur = "General";

  constructor(private readonly prefix: string) {}

  t(topic: string): this {
    this.cur = topic;
    return this;
  }

  private push(it: Omit<Item, "topic"> & { topic?: string }) {
    if (it.o.length !== 4) {
      throw new Error(`[${this.prefix}] needs 4 options: ${it.q.slice(0, 80)}`);
    }
    const set = new Set(it.o.map((s) => s.trim().toLowerCase()));
    if (set.size !== 4) {
      throw new Error(`[${this.prefix}] duplicate options: ${it.q.slice(0, 80)}`);
    }
    this.items.push({ ...it, topic: it.topic ?? this.cur });
  }

  /** Correct answer first; shuffled at build. */
  q(d: Difficulty, q: string, o: [string, string, string, string], x: string): this {
    this.push({ d, q, o, a: 0, fixed: false, x });
    return this;
  }

  /** Fixed order; `a` is the index of the correct option. */
  qf(d: Difficulty, q: string, o: [string, string, string, string], a: number, x: string): this {
    this.push({ d, q, o, a, fixed: true, x });
    return this;
  }

  /** Correct answer + 3 distractors picked from `pool`. */
  pool(d: Difficulty, q: string, correct: string, pool: readonly string[], x: string): this {
    const rng = makeRng(hashStr(q));
    const others = rng.shuffle(pool.filter((p) => p.trim().toLowerCase() !== correct.trim().toLowerCase()));
    const uniq: string[] = [];
    for (const o of others) {
      if (!uniq.some((u) => u.toLowerCase() === o.toLowerCase())) uniq.push(o);
      if (uniq.length === 3) break;
    }
    if (uniq.length < 3) throw new Error(`[${this.prefix}] pool too small for: ${q}`);
    this.push({ d, q, o: [correct, ...uniq], a: 0, fixed: false, x });
    return this;
  }

  /**
   * Statement question. `truth` = 1-based statement numbers that satisfy `ask`
   * (by default: which are correct). Options are UPSC-style codes.
   */
  st(
    d: Difficulty,
    lead: string,
    statements: string[],
    truth: number[],
    x: string,
    ask = "Which of the statements given above is/are correct?",
  ): this {
    const n = statements.length;
    const body = `${lead ? `${lead}\n` : ""}${statements.map((s, i) => `${i + 1}. ${s}`).join("\n")}\n${ask}`;
    const askNeg = /not correct|incorrect|wrong/i.test(ask);
    x = `${statements
      .map((_, i) => `Statement ${i + 1} ${truth.includes(i + 1) ? (askNeg ? "is incorrect" : "is correct") : askNeg ? "is correct" : "is incorrect"}`)
      .join("; ")}.\n${x}`;
    if (n === 2) {
      const opts = ["1 only", "2 only", "Both 1 and 2", "Neither 1 nor 2"];
      const key = truth.length === 0 ? 3 : truth.length === 2 ? 2 : truth[0] === 1 ? 0 : 1;
      this.push({ d, q: body, o: opts, a: key, fixed: true, x });
      return this;
    }
    if (truth.length === 0) throw new Error(`[${this.prefix}] empty truth for ${n} statements`);
    const rng = makeRng(hashStr(body));
    const correct = codeLabel(truth, n);
    const pool = subsets(n)
      .map((s) => codeLabel(s, n))
      .filter((l) => l !== correct);
    const picks = rng.shuffle(pool).slice(0, 3);
    const all = [correct, ...picks];
    const order = (l: string) => {
      const nums = l.match(/\d/g)!.map(Number);
      return nums.length * 100 + nums.reduce((acc, v) => acc * 10 + v, 0) / 10 ** nums.length;
    };
    all.sort((p, q2) => order(p) - order(q2));
    this.push({ d, q: body, o: all, a: all.indexOf(correct), fixed: true, x });
    return this;
  }

  /** "How many of the above statements are correct?" */
  hm(d: Difficulty, lead: string, statements: string[], correctCount: number, x: string, ask = "How many of the above statements are correct?"): this {
    const n = statements.length;
    const body = `${lead ? `${lead}\n` : ""}${statements.map((s, i) => `${i + 1}. ${s}`).join("\n")}\n${ask}`;
    x = `${correctCount} of the ${n} listed items satisfy the condition asked.\n${x}`;
    const words = ["None", "Only one", "Only two", "Only three", "All four"];
    let opts: string[];
    if (n === 3) opts = ["Only one", "Only two", "All three", "None"];
    else opts = ["Only one", "Only two", "Only three", "All four"];
    let label: string;
    if (n === 3) label = correctCount === 3 ? "All three" : words[correctCount]!;
    else label = words[correctCount]!;
    if (!opts.includes(label)) {
      // n=4 with 0 correct: replace "Only one"
      opts = ["None", "Only one", "Only two", "Only three"];
    }
    this.push({ d, q: body, o: opts, a: opts.indexOf(label), fixed: true, x });
    return this;
  }

  /** Match the following; `pairs` are the correct matches in order. */
  mt(
    d: Difficulty,
    lead: string,
    pairs: [string, string][],
    x: string,
    h1 = "List-I",
    h2 = "List-II",
  ): this {
    const rng = makeRng(hashStr(lead + pairs.map((p) => p.join("|")).join("#")));
    const k = pairs.length;
    const letters = ["A", "B", "C", "D", "E"].slice(0, k);
    // List-II order shuffled so the answer is not trivially A-1, B-2 ...
    let perm = rng.shuffle([...Array(k).keys()]);
    if (perm.every((v, i) => v === i)) perm = [...perm.slice(1), perm[0]!];
    const listII = perm.map((i) => pairs[i]![1]);
    const code = (assign: number[]) => letters.map((l, i) => `${l}-${assign[i]}`).join(", ");
    // correct assignment: letter i -> position of pairs[i][1] in listII (1-based)
    const correctAssign = pairs.map((_, i) => perm.indexOf(i) + 1);
    const correct = code(correctAssign);
    const seen = new Set([correct]);
    const distract: string[] = [];
    let guard = 0;
    while (distract.length < 3 && guard++ < 200) {
      const a = [...correctAssign];
      const i = rng.int(0, k - 1);
      let j = rng.int(0, k - 1);
      if (i === j) j = (j + 1) % k;
      [a[i], a[j]] = [a[j]!, a[i]!];
      if (rng.chance(0.5)) {
        const p = rng.int(0, k - 1);
        let r = rng.int(0, k - 1);
        if (p === r) r = (r + 1) % k;
        [a[p], a[r]] = [a[r]!, a[p]!];
      }
      const c = code(a);
      if (!seen.has(c)) {
        seen.add(c);
        distract.push(c);
      }
    }
    x = `Correct matching — ${pairs.map((p, i) => `${letters[i]} (${p[0]}) → ${perm.indexOf(i) + 1} (${p[1]})`).join("; ")}.\n${x}`;
    const body =
      `${lead}\n${h1}:\n${pairs.map((p, i) => `${letters[i]}. ${p[0]}`).join("\n")}\n` +
      `${h2}:\n${listII.map((v, i) => `${i + 1}. ${v}`).join("\n")}\nSelect the correct answer using the code given below:`;
    this.push({ d, q: body, o: [correct, ...distract], a: 0, fixed: false, x });
    return this;
  }

  /** Assertion (A) and Reason (R); code a/b/c/d per AR_OPTIONS. */
  ar(d: Difficulty, assertion: string, reason: string, code: "a" | "b" | "c" | "d", x: string): this {
    const q = `Consider the following:\nAssertion (A): ${assertion}\nReason (R): ${reason}\nSelect the correct answer:`;
    const verdict = {
      a: "A is true and R is true; R correctly explains A.",
      b: "A is true and R is true, but R does not explain A.",
      c: "A is true but R is false.",
      d: "A is false but R is true.",
    }[code];
    this.push({ d, q, o: [...AR_OPTIONS], a: "abcd".indexOf(code), fixed: true, x: `${verdict} ${x}` });
    return this;
  }

  /** Error spotting: three parts; k = 0..2 erroneous part, 3 = no error. */
  er(d: Difficulty, parts: [string, string, string], k: 0 | 1 | 2 | 3, x: string): this {
    const q =
      "Identify the segment of the sentence that contains a grammatical error. If the sentence is correct, choose 'No error'.\n" +
      parts.join(" / ");
    const where = k === 3 ? "The sentence is grammatically correct as written." : `The error is in part (${"abc"[k]}): '${parts[k]!.replace(/[.,;:]+$/, "")}'.`;
    this.push({ d, q, o: [...parts, "No error"], a: k, fixed: true, x: `${where} ${x}`, topic: "Error Spotting" });
    return this;
  }

  /** Comprehension question bound to a passage (kept together in one paper). */
  rc(d: Difficulty, passage: string, q: string, o: [string, string, string, string], x: string): this {
    const full = `Answer: '${o[0]}'. ${x} The other options either add ideas not found in the passage or contradict it.`;
    this.push({ d, q, o, a: 0, fixed: false, x: full, p: passage, topic: "Reading Comprehension" });
    return this;
  }
}

/** Plausible nearby years for year-recall questions. */
export function nearYears(year: number, seed: string): string[] {
  const rng = makeRng(hashStr(seed));
  const out = new Set<number>();
  const deltas = rng.shuffle([-11, -8, -6, -5, -4, -3, -2, 2, 3, 4, 5, 6, 7, 9, 12]);
  for (const dlt of deltas) {
    const y = year + dlt;
    if (y > 1700 && y <= 2026) out.add(y);
    if (out.size === 3) break;
  }
  return [...out].map(String);
}
