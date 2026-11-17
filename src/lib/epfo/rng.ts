/** Deterministic random helpers so every paper build is reproducible. */

export function hashStr(s: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

export type Rng = {
  next(): number;
  int(min: number, max: number): number;
  pick<T>(arr: readonly T[]): T;
  shuffle<T>(arr: readonly T[]): T[];
  chance(p: number): boolean;
};

export function makeRng(seed: number | string): Rng {
  let a = (typeof seed === "string" ? hashStr(seed) : seed) >>> 0;
  const next = () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  const rng: Rng = {
    next,
    int(min, max) {
      return min + Math.floor(next() * (max - min + 1));
    },
    pick(arr) {
      return arr[Math.floor(next() * arr.length)]!;
    },
    shuffle(arr) {
      const out = [...arr];
      for (let i = out.length - 1; i > 0; i--) {
        const j = Math.floor(next() * (i + 1));
        [out[i], out[j]] = [out[j]!, out[i]!];
      }
      return out;
    },
    chance(p) {
      return next() < p;
    },
  };
  return rng;
}

export function gcd(a: number, b: number): number {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b) [a, b] = [b, a % b];
  return a;
}

export function lcm(a: number, b: number): number {
  return (a / gcd(a, b)) * b;
}

/** Indian digit grouping: 1234567 → 12,34,567 */
export function inr(n: number): string {
  const neg = n < 0;
  const abs = Math.abs(n);
  const [intPart, dec] = (Number.isInteger(abs) ? String(abs) : abs.toFixed(2)).split(".");
  let s = intPart!;
  if (s.length > 3) {
    const last3 = s.slice(-3);
    let rest = s.slice(0, -3);
    const parts: string[] = [];
    while (rest.length > 2) {
      parts.unshift(rest.slice(-2));
      rest = rest.slice(0, -2);
    }
    if (rest) parts.unshift(rest);
    s = `${parts.join(",")},${last3}`;
  }
  return `${neg ? "-" : ""}${s}${dec && dec !== "00" ? `.${dec}` : ""}`;
}

export function rs(n: number): string {
  return `₹${inr(n)}`;
}

/** Trim a number to at most `d` decimals without trailing zeros. */
export function num(n: number, d = 2): string {
  const r = Math.round(n * 10 ** d) / 10 ** d;
  return String(r);
}

export function frac(n: number, d: number): string {
  const g = gcd(n, d);
  const nn = n / g;
  const dd = d / g;
  return dd === 1 ? String(nn) : `${nn}/${dd}`;
}
