import type { Rng } from "../rng";

export type Level = 1 | 2 | 3;

export type GenOut = { topic: string; q: string; o: string[]; x: string };

export type Generator = {
  id: string;
  topic: string;
  make: (r: Rng, lvl: Level) => GenOut;
};

/** Build 4 distinct options: correct first, then distractors from candidates, then perturbations. */
export function options(
  correct: number,
  cands: number[],
  fmt: (n: number) => string,
  step = 1,
  allowNonPositive = false,
): string[] {
  const c = fmt(correct);
  const seen = new Set([c]);
  const out: string[] = [];
  const tryAdd = (v: number) => {
    if (out.length >= 3 || !Number.isFinite(v)) return;
    if (!allowNonPositive && v <= 0) return;
    const s = fmt(v);
    if (seen.has(s)) return;
    seen.add(s);
    out.push(s);
  };
  for (const v of cands) tryAdd(v);
  for (let k = 1; out.length < 3 && k < 60; k++) {
    tryAdd(correct + k * step);
    tryAdd(correct - k * step);
  }
  return [c, ...out];
}

/** Same as options() but for already-formatted string candidates. */
export function textOptions(correct: string, cands: string[], extra: () => string): string[] {
  const seen = new Set([correct]);
  const out: string[] = [];
  for (const c of cands) {
    if (out.length >= 3) break;
    if (!seen.has(c)) {
      seen.add(c);
      out.push(c);
    }
  }
  let guard = 0;
  while (out.length < 3 && guard++ < 100) {
    const e = extra();
    if (!seen.has(e)) {
      seen.add(e);
      out.push(e);
    }
  }
  return [correct, ...out];
}

export function pickTemplate<T>(r: Rng, arr: readonly T[]): T {
  return r.pick(arr);
}

export function fact(n: number): number {
  let f = 1;
  for (let i = 2; i <= n; i++) f *= i;
  return f;
}

export function comb(n: number, k: number): number {
  if (k < 0 || k > n) return 0;
  return Math.round(fact(n) / (fact(k) * fact(n - k)));
}

export function multisetPerms(letters: string[]): number {
  const counts = new Map<string, number>();
  for (const l of letters) counts.set(l, (counts.get(l) ?? 0) + 1);
  let den = 1;
  for (const c of counts.values()) den *= fact(c);
  return Math.round(fact(letters.length) / den);
}

export function repeatsNote(letters: string[]): string {
  const counts = new Map<string, number>();
  for (const l of letters) counts.set(l, (counts.get(l) ?? 0) + 1);
  const rep = [...counts.entries()].filter(([, c]) => c > 1);
  if (rep.length === 0) return "all letters are distinct";
  return rep.map(([l, c]) => `${l} appears ${c} times`).join(", ");
}

export function repeatsDen(letters: string[]): string {
  const counts = new Map<string, number>();
  for (const l of letters) counts.set(l, (counts.get(l) ?? 0) + 1);
  const rep = [...counts.values()].filter((c) => c > 1);
  return rep.length ? rep.map((c) => `${c}!`).join(" × ") : "1";
}
