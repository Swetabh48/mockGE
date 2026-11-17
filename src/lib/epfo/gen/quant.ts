/**
 * General Mental Ability & Quantitative Aptitude generators.
 * Every question is computed, so keys and worked solutions are exact.
 */
import { frac, gcd, lcm, num, rs, inr } from "../rng";
import {
  comb,
  fact,
  multisetPerms,
  options,
  repeatsDen,
  repeatsNote,
  textOptions,
  type Generator,
  type Level,
} from "./common";

const pc = (v: number) => (Math.abs(v) < 1e-9 ? "No change" : v > 0 ? `${num(v)}% increase` : `${num(-v)}% decrease`);

const percentChange: Generator = {
  id: "percent-change",
  topic: "Percentage",
  make(r, lvl) {
    const subj = r.pick([
      "The price of a litre of edible oil",
      "The monthly salary of a clerk",
      "The population of a hill town",
      "The membership of a cooperative society",
      "The daily output of a cement plant",
      "The fare of an inter-city bus",
      "The number of claims settled by a regional office",
      "The rent of a warehouse",
    ]);
    if (lvl === 1) {
      const b = r.pick([10, 20, 30, 15, 25, 5, 40]);
      const net = -(b * b) / 100;
      const q = `${subj} is first raised by ${b}% and the new value is then reduced by ${b}%. Compared with the original, the final value shows a:`;
      return {
        topic: "Percentage",
        q,
        o: textOptions(pc(net), [pc(0), pc(b * b / 100), pc(-2 * b * b / 100)], () => pc(-r.int(1, 30))),
        x: `Successive change formula: net % = a + b + ab/100 with a = +${b}, b = −${b}.\nNet = ${b} − ${b} − (${b}×${b})/100 = −${num(b * b / 100)}%.\nAn equal rise and fall always ends in a loss of (x²/100)%. So it is a ${num(b * b / 100)}% decrease.`,
      };
    }
    if (lvl === 2) {
      const a = r.pick([10, 20, 25, 30, 40, 50]);
      const b = r.pick([10, 12, 15, 20, 25, 30].filter((v) => v !== a));
      const net = a - b - (a * b) / 100;
      const q = `${subj} increases by ${a}% in the first year and decreases by ${b}% in the second year. The net percentage change over the two years is:`;
      return {
        topic: "Percentage",
        q,
        o: textOptions(pc(net), [pc(a - b), pc(a - b + (a * b) / 100), pc(-net)], () => pc(net + r.int(1, 9))),
        x: `Net % = a + b + ab/100 with a = +${a}, b = −${b}.\n= ${a} − ${b} − (${a}×${b})/100 = ${a - b} − ${num((a * b) / 100)} = ${num(net)}%.\nResult: ${pc(net)}.`,
      };
    }
    const a = r.pick([10, 20, 25, 50]);
    const b = r.pick([10, 20, 25]);
    const c = r.pick([5, 10, 20]);
    const f = (1 + a / 100) * (1 - b / 100) * (1 + c / 100);
    const net = (f - 1) * 100;
    const q = `${subj} rises by ${a}%, then falls by ${b}%, and finally rises by ${c}%. The overall percentage change is:`;
    return {
      topic: "Percentage",
      q,
      o: textOptions(pc(net), [pc(a - b + c), pc(net - 2), pc(-net)], () => pc(net + r.int(1, 7))),
      x: `Multiply the growth factors: (1 + ${a}/100) × (1 − ${b}/100) × (1 + ${c}/100) = ${num(1 + a / 100, 2)} × ${num(1 - b / 100, 2)} × ${num(1 + c / 100, 2)} = ${num(f, 4)}.\nOverall change = (${num(f, 4)} − 1) × 100 = ${num(net)}% → ${pc(net)}.\nNote: simply adding (${a} − ${b} + ${c}) is wrong because each change acts on a new base.`,
    };
  },
};

const profitLoss: Generator = {
  id: "profit-loss",
  topic: "Profit & Loss",
  make(r, lvl) {
    if (lvl === 1) {
      const p = r.pick([5, 8, 10, 12, 15, 20, 25, 30]);
      let cp = r.int(8, 60) * 50;
      while ((cp * p) % 100 !== 0) cp += 50;
      const sp = (cp * (100 + p)) / 100;
      const item = r.pick(["an office chair", "a ceiling fan", "a printer cartridge", "a bicycle", "a water purifier", "a steel almirah"]);
      return {
        topic: "Profit & Loss",
        q: `A trader buys ${item} for ${rs(cp)} and sells it for ${rs(sp)}. His profit per cent is:`,
        o: options(p, [((sp - cp) / sp) * 100, p + 5, p - 2], (v) => `${num(v)}%`),
        x: `Profit = SP − CP = ${rs(sp)} − ${rs(cp)} = ${rs(sp - cp)}.\nProfit % = (Profit / CP) × 100 = (${inr(sp - cp)} / ${inr(cp)}) × 100 = ${p}%.\n(Profit % is always on cost price, not on selling price.)`,
      };
    }
    if (lvl === 2) {
      const m = r.pick([20, 25, 30, 40, 50, 60]);
      const d = r.pick([10, 12, 15, 20, 25]);
      const res = (1 + m / 100) * (1 - d / 100) * 100 - 100;
      return {
        topic: "Profit & Loss",
        q: `A shopkeeper marks his goods ${m}% above the cost price and allows a discount of ${d}% on the marked price. His gain or loss per cent is:`,
        o: textOptions(
          res >= 0 ? `${num(res)}% gain` : `${num(-res)}% loss`,
          [`${num(m - d)}% gain`, `${num(Math.abs(res) + 2)}% gain`, `${num(Math.abs(res))}% loss`],
          () => `${r.int(1, 30)}% gain`,
        ),
        x: `Let CP = 100. Marked price = ${100 + m}.\nSP after ${d}% discount = ${100 + m} × ${(100 - d) / 100} = ${num((100 + m) * (1 - d / 100))}.\nGain = ${num((100 + m) * (1 - d / 100))} − 100 = ${num(res)} on 100 → ${res >= 0 ? `${num(res)}% gain` : `${num(-res)}% loss`}.\nShortcut: m − d − md/100 = ${m} − ${d} − ${num((m * d) / 100)} = ${num(res)}%.`,
      };
    }
    const m = r.pick([40, 50, 60, 80]);
    const d1 = r.pick([10, 20, 25]);
    const d2 = r.pick([5, 10, 15, 20]);
    const f = (1 + m / 100) * (1 - d1 / 100) * (1 - d2 / 100);
    const res = (f - 1) * 100;
    return {
      topic: "Profit & Loss",
      q: `An article is marked ${m}% above its cost. Two successive discounts of ${d1}% and ${d2}% are then given on the marked price. The resulting gain or loss per cent is:`,
      o: textOptions(
        res >= 0 ? `${num(res)}% gain` : `${num(-res)}% loss`,
        [`${num(m - d1 - d2)}% gain`, `${num(Math.abs(res) + 3)}% gain`, `${num(Math.abs(res))}% loss`],
        () => `${r.int(1, 40)}% gain`,
      ),
      x: `Take CP = 100 → MP = ${100 + m}.\nAfter ${d1}%: ${num((100 + m) * (1 - d1 / 100))}; after a further ${d2}%: ${num(f * 100)}.\nNet = ${num(f * 100)} − 100 = ${num(res)} → ${res >= 0 ? `${num(res)}% gain` : `${num(-res)}% loss`}.\nSuccessive discounts are multiplied, never added (${d1}% + ${d2}% ≠ ${d1 + d2}%).`,
    };
  },
};

const simpleInterest: Generator = {
  id: "simple-interest",
  topic: "Simple Interest",
  make(r, lvl) {
    if (lvl === 1) {
      const p = r.int(4, 40) * 500;
      const rate = r.pick([4, 5, 6, 7.5, 8, 9, 10, 12]);
      const t = r.pick([2, 3, 4, 5, 6]);
      const si = (p * rate * t) / 100;
      return {
        topic: "Simple Interest",
        q: `What simple interest will ${rs(p)} earn in ${t} years at ${rate}% per annum?`,
        o: options(si, [p * rate / 100, si + p * rate / 100, p + si], (v) => rs(v), 50),
        x: `SI = P × R × T / 100 = ${inr(p)} × ${rate} × ${t} / 100 = ${rs(si)}.`,
      };
    }
    if (lvl === 2) {
      const p = r.int(6, 40) * 500;
      const rate = r.pick([4, 5, 6, 8, 10, 12, 15]);
      const t1 = r.int(2, 4);
      const t2 = t1 + r.int(2, 4);
      const a1 = p + (p * rate * t1) / 100;
      const a2 = p + (p * rate * t2) / 100;
      return {
        topic: "Simple Interest",
        q: `A sum of money lent at simple interest amounts to ${rs(a1)} in ${t1} years and to ${rs(a2)} in ${t2} years. The rate of interest per annum is:`,
        o: options(rate, [rate + 2, rate / 2, ((a2 - a1) / a1) * 100], (v) => `${num(v)}%`, 1),
        x: `Interest for (${t2} − ${t1}) = ${t2 - t1} years = ${rs(a2)} − ${rs(a1)} = ${rs(a2 - a1)}, so one year's interest = ${rs((a2 - a1) / (t2 - t1))}.\nPrincipal = ${rs(a1)} − ${t1} × ${inr((a2 - a1) / (t2 - t1))} = ${rs(p)}.\nRate = (${inr((a2 - a1) / (t2 - t1))} / ${inr(p)}) × 100 = ${rate}% p.a.`,
      };
    }
    const n = r.pick([5, 6, 8, 10, 12, 16, 20]);
    const k = r.pick([3, 4, 5]);
    const ans = (k - 1) * n;
    return {
      topic: "Simple Interest",
      q: `At simple interest a sum doubles itself in ${n} years. In how many years will it become ${k} times itself at the same rate?`,
      o: options(ans, [k * n, (k - 1) * n + n / 2, (k / 2) * n], (v) => `${num(v)} years`, n / 2),
      x: `Doubling means interest = 1 × principal in ${n} years, i.e. rate = 100/${n} = ${num(100 / n)}% p.a.\nTo become ${k} times, interest must be ${k - 1} × principal.\nTime = (${k - 1} × 100) / ${num(100 / n)} = ${ans} years. (Rule: time ∝ number of times the principal is earned as interest.)`,
    };
  },
};

const compoundInterest: Generator = {
  id: "compound-interest",
  topic: "Compound Interest",
  make(r, lvl) {
    if (lvl === 1) {
      const p = r.int(2, 30) * 1000;
      const rate = r.pick([5, 10, 20, 4, 8]);
      const amt = p * (1 + rate / 100) ** 2;
      const ci = amt - p;
      return {
        topic: "Compound Interest",
        q: `Find the compound interest on ${rs(p)} for 2 years at ${rate}% per annum, compounded annually.`,
        o: options(ci, [(p * rate * 2) / 100, amt, ci + (p * rate) / 100 / 2], (v) => rs(Math.round(v * 100) / 100), 10),
        x: `Amount = P(1 + R/100)² = ${inr(p)} × (${num(1 + rate / 100, 2)})² = ${rs(Math.round(amt * 100) / 100)}.\nCI = Amount − P = ${rs(Math.round(ci * 100) / 100)}.\nCheck: SI for 2 years = ${rs((p * rate * 2) / 100)}; CI exceeds it by P(R/100)² = ${rs(Math.round(p * (rate / 100) ** 2 * 100) / 100)}.`,
      };
    }
    if (lvl === 2) {
      const rate = r.pick([4, 5, 8, 10, 12, 15, 20]);
      const p = r.int(4, 50) * 500;
      const diff = p * (rate / 100) ** 2;
      if (!Number.isInteger(diff * 100)) return compoundInterest.make(r, lvl);
      return {
        topic: "Compound Interest",
        q: `The difference between the compound interest (compounded annually) and the simple interest on a certain sum for 2 years at ${rate}% per annum is ${rs(diff)}. The sum is:`,
        o: options(p, [p * 2, diff * (100 / rate), p / 2], (v) => rs(v), 500),
        x: `For 2 years, CI − SI = P(R/100)².\n${inr(diff)} = P × (${rate}/100)² = P × ${num((rate / 100) ** 2, 4)}.\nP = ${inr(diff)} / ${num((rate / 100) ** 2, 4)} = ${rs(p)}.`,
      };
    }
    const p = r.int(8, 64) * 1000;
    const rate = r.pick([10, 20, 8, 12]);
    const half = rate / 2;
    const amt = p * (1 + half / 100) ** 2;
    const ci = amt - p;
    const yearly = (p * rate) / 100;
    return {
      topic: "Compound Interest",
      q: `${rs(p)} is invested for 1 year at ${rate}% per annum, interest being compounded half-yearly. The compound interest earned is:`,
      o: options(Math.round(ci * 100) / 100, [yearly, Math.round(p * ((1 + rate / 100) ** 1 - 1) * 100) / 100 + 1, Math.round((ci + half * 10) * 100) / 100], (v) => rs(v), 10),
      x: `Half-yearly: rate per period = ${rate}/2 = ${half}%, number of periods = 2.\nAmount = ${inr(p)} × (1 + ${half}/100)² = ${rs(Math.round(amt * 100) / 100)}.\nCI = ${rs(Math.round(ci * 100) / 100)} (slightly more than annual compounding, which gives ${rs(yearly)}).`,
    };
  },
};

const ratioShare: Generator = {
  id: "ratio-share",
  topic: "Ratio & Proportion",
  make(r, lvl) {
    if (lvl === 1) {
      const parts = r.shuffle([2, 3, 4, 5, 7]).slice(0, 3);
      const k = r.int(5, 40) * 100;
      const total = (parts[0]! + parts[1]! + parts[2]!) * k;
      const who = r.pick(["three partners", "three siblings", "three welfare funds", "three branches"]);
      return {
        topic: "Ratio & Proportion",
        q: `${rs(total)} is divided among ${who} in the ratio ${parts.join(" : ")}. The largest share is:`,
        o: options(Math.max(...parts) * k, [Math.min(...parts) * k, parts[1]! * k, (total / 3)], (v) => rs(Math.round(v)), k),
        x: `Sum of ratio terms = ${parts.join(" + ")} = ${parts[0]! + parts[1]! + parts[2]!}.\nOne part = ${inr(total)} / ${parts[0]! + parts[1]! + parts[2]!} = ${rs(k)}.\nLargest share = ${Math.max(...parts)} × ${inr(k)} = ${rs(Math.max(...parts) * k)}.`,
      };
    }
    if (lvl === 2) {
      const x = r.int(2, 5), y = r.int(2, 6), p = r.int(2, 6), qv = r.int(2, 7);
      // A:B = x:y, B:C = p:q -> A:B:C = xp : yp : yq
      let A = x * p, B = y * p, C = y * qv;
      const g = gcd(gcd(A, B), C);
      A /= g; B /= g; C /= g;
      if (A === B || B === C) return ratioShare.make(r, lvl);
      const k = r.int(2, 20) * 50;
      const total = (A + B + C) * k;
      return {
        topic: "Ratio & Proportion",
        q: `If A : B = ${x} : ${y} and B : C = ${p} : ${qv}, and a sum of ${rs(total)} is shared among A, B and C in that combined ratio, C receives:`,
        o: options(C * k, [A * k, B * k, (total * qv) / (p + qv)], (v) => rs(Math.round(v)), k),
        x: `Make B common: A : B = ${x * p} : ${y * p}, B : C = ${y * p} : ${y * qv}.\nA : B : C = ${x * p} : ${y * p} : ${y * qv} = ${A} : ${B} : ${C}.\nC's share = ${C}/${A + B + C} × ${inr(total)} = ${rs(C * k)}.`,
      };
    }
    // incomes / expenditures with equal savings
    for (let tries = 0; tries < 200; tries++) {
      const a = r.int(3, 9), b = r.int(2, 8), c = r.int(2, 9), d = r.int(1, 8);
      if (a === b || c === d || gcd(a, b) !== 1 || gcd(c, d) !== 1) continue;
      if ((a - b) * (c - d) <= 0) continue;
      const k = r.int(2, 12) * 500;
      const m = ((a - b) * k) / (c - d);
      if (!Number.isInteger(m) || m <= 0) continue;
      const s = a * k - c * m;
      if (s <= 0 || b * k - d * m !== s) continue;
      return {
        topic: "Ratio & Proportion",
        q: `The monthly incomes of P and Q are in the ratio ${a} : ${b} and their monthly expenditures are in the ratio ${c} : ${d}. If each of them saves ${rs(s)} a month, P's monthly income is:`,
        o: options(a * k, [b * k, a * k + s, c * m], (v) => rs(v), 500),
        x: `Let incomes = ${a}k, ${b}k and expenditures = ${c}m, ${d}m.\n${a}k − ${c}m = ${b}k − ${d}m = ${inr(s)} → ${a - b}k = ${c - d}m.\nSolving gives k = ${inr(k)}, m = ${inr(m)}.\nP's income = ${a} × ${inr(k)} = ${rs(a * k)} (check: ${rs(a * k)} − ${rs(c * m)} = ${rs(s)}).`,
      };
    }
    return ratioShare.make(r, 2);
  },
};

const averages: Generator = {
  id: "averages",
  topic: "Averages",
  make(r, lvl) {
    if (lvl === 1) {
      const n = r.int(8, 24);
      const avg = r.int(30, 70);
      const newAvg = avg + r.pick([1, 2, 3]);
      const x = newAvg * (n + 1) - avg * n;
      return {
        topic: "Averages",
        q: `The average weight of ${n} parcels is ${avg} kg. When one more parcel is added, the average becomes ${newAvg} kg. The weight of the new parcel is:`,
        o: options(x, [newAvg, avg + (newAvg - avg) * n, x - (newAvg - avg)], (v) => `${v} kg`),
        x: `Old total = ${n} × ${avg} = ${n * avg} kg. New total = ${n + 1} × ${newAvg} = ${(n + 1) * newAvg} kg.\nNew parcel = ${(n + 1) * newAvg} − ${n * avg} = ${x} kg.\nShortcut: new value = new average + (increase × old count) = ${newAvg} + ${newAvg - avg} × ${n} = ${x} kg.`,
      };
    }
    if (lvl === 2) {
      const n = r.int(20, 40);
      const avg = r.int(10, 16);
      const inc = r.pick([0.5, 1, 1.5]);
      const t = (avg + inc) * (n + 1) - avg * n;
      if (!Number.isInteger(t)) return averages.make(r, lvl);
      return {
        topic: "Averages",
        q: `The average age of ${n} trainees in a batch is ${avg} years. When the instructor's age is also included, the average rises by ${inc} year${inc === 1 ? "" : "s"}. The instructor's age is:`,
        o: options(t, [avg + inc * n, t - inc, t + n * inc - avg], (v) => `${num(v)} years`),
        x: `Total of trainees = ${n} × ${avg} = ${n * avg}.\nWith instructor: ${n + 1} × ${num(avg + inc)} = ${num((n + 1) * (avg + inc))}.\nInstructor = ${num((n + 1) * (avg + inc))} − ${n * avg} = ${num(t)} years.`,
      };
    }
    const total = r.pick([11, 13, 9]);
    const half = (total + 1) / 2;
    const a = r.int(40, 60), b = r.int(40, 60), c = r.int(40, 60);
    const mid = half * b + half * c - total * a;
    if (mid <= 0 || mid > 200) return averages.make(r, lvl);
    return {
      topic: "Averages",
      q: `The average of ${total} observations is ${a}. The average of the first ${half} is ${b} and that of the last ${half} is ${c}. The ${half}th observation is:`,
      o: options(mid, [half * b - (half - 1) * a, (b + c) / 2, mid + a - b], (v) => num(v)),
      x: `Sum of all ${total} = ${total} × ${a} = ${total * a}.\nFirst ${half} + last ${half} = ${half}×${b} + ${half}×${c} = ${half * b + half * c}; the middle observation is counted twice.\nMiddle = ${half * b + half * c} − ${total * a} = ${mid}.`,
    };
  },
};

function niceWorkPairs(): [number, number, number][] {
  const out: [number, number, number][] = [];
  for (let a = 6; a <= 60; a++)
    for (let b = a + 2; b <= 90; b++) {
      const t = (a * b) / (a + b);
      if (Number.isInteger(t)) out.push([a, b, t]);
    }
  return out;
}
const WORK_PAIRS = niceWorkPairs();

const timeWork: Generator = {
  id: "time-work",
  topic: "Time & Work",
  make(r, lvl) {
    const [a, b, t] = r.pick(WORK_PAIRS);
    const names = r.pick([["Asha", "Bhavna"], ["Ravi", "Kiran"], ["a clerk", "an assistant"], ["Team X", "Team Y"]]);
    const job = r.pick(["file the returns of a branch", "digitise a set of records", "audit a ledger", "paint a hall", "verify a batch of claims"]);
    if (lvl === 1) {
      return {
        topic: "Time & Work",
        q: `${names[0]} can ${job} in ${a} days and ${names[1]} can do it in ${b} days. Working together, they will finish it in:`,
        o: options(t, [(a + b) / 2, b - a, t + 2], (v) => `${num(v)} days`),
        x: `One day's work: 1/${a} + 1/${b} = ${b + a}/${a * b} = 1/${t}.\nTogether they need ${t} days. (Product/Sum: ${a}×${b}/(${a}+${b}) = ${t}.)`,
      };
    }
    if (lvl === 2) {
      return {
        topic: "Time & Work",
        q: `${names[0]} and ${names[1]} together can ${job} in ${t} days. ${names[0]} alone can do it in ${a} days. How many days will ${names[1]} alone take?`,
        o: options(b, [a - t, a + t, 2 * t], (v) => `${num(v)} days`),
        x: `${names[1]}'s one-day work = 1/${t} − 1/${a} = (${a} − ${t})/${a * t} = ${frac(a - t, a * t)}.\nSo ${names[1]} alone takes ${b} days.`,
      };
    }
    // A works k days then leaves; B completes
    const k = r.int(2, Math.max(2, t - 1));
    const remaining = 1 - k * (1 / a + 1 / b);
    const daysB = remaining * b;
    if (!Number.isInteger(Math.round(daysB * 100) / 100) || daysB <= 0) return timeWork.make(r, 2);
    const total = k + daysB;
    return {
      topic: "Time & Work",
      q: `${names[0]} can ${job} in ${a} days and ${names[1]} in ${b} days. They start together, but ${names[0]} leaves after ${k} days. In how many days in all is the work completed?`,
      o: options(total, [t, k + b / 2, total + 1], (v) => `${num(v)} days`),
      x: `Work done together in ${k} days = ${k} × (1/${a} + 1/${b}) = ${k}/${t} = ${frac(k, t)}.\nRemaining = ${frac(t - k, t)}, done by ${names[1]} alone in ${frac(t - k, t)} × ${b} = ${num(daysB)} days.\nTotal = ${k} + ${num(daysB)} = ${num(total)} days.`,
    };
  },
};

function nicePipeTriples(): [number, number, number, number][] {
  const out: [number, number, number, number][] = [];
  for (let a = 4; a <= 30; a++)
    for (let b = a + 1; b <= 40; b++)
      for (let c = 6; c <= 60; c++) {
        const L = lcm(lcm(a, b), c);
        const rate = L / a + L / b - L / c;
        if (rate <= 0) continue;
        const t = L / rate;
        if (Number.isInteger(t) && t <= 60 && c > a && c !== b) out.push([a, b, c, t]);
      }
  return out;
}
const PIPE_TRIPLES = nicePipeTriples();

const pipes: Generator = {
  id: "pipes",
  topic: "Pipes & Cisterns",
  make(r) {
    const [a, b, c, t] = r.pick(PIPE_TRIPLES);
    const L = lcm(lcm(a, b), c);
    const tank = r.pick(["an overhead tank", "a reservoir", "a cistern", "a storage tank"]);
    return {
      topic: "Pipes & Cisterns",
      q: `Two inlet pipes can fill ${tank} in ${a} hours and ${b} hours respectively, while an outlet pipe can empty the full tank in ${c} hours. If all three are opened together on an empty tank, it will be full in:`,
      o: options(t, [(a * b) / (a + b), t + 2, Math.round(((a + b + c) / 3) * 10) / 10], (v) => `${num(v)} hours`),
      x: `Take tank capacity = LCM(${a}, ${b}, ${c}) = ${L} units.\nRates: +${L / a}, +${L / b}, −${L / c} units/hour → net ${L / a + L / b - L / c} units/hour.\nTime = ${L} / ${L / a + L / b - L / c} = ${t} hours.`,
    };
  },
};

const trains: Generator = {
  id: "trains",
  topic: "Speed, Time & Distance",
  make(r, lvl) {
    const speeds = [36, 54, 72, 90, 108];
    if (lvl === 1) {
      const s = r.pick(speeds);
      const v = (s * 5) / 18;
      const t = r.int(8, 20);
      const L = v * t;
      return {
        topic: "Speed, Time & Distance",
        q: `A train ${L} m long passes a signal post in ${t} seconds. Its speed in km/h is:`,
        o: options(s, [v, s + 18, (L / t) * 3.6 + 9], (v2) => `${num(v2)} km/h`, 6),
        x: `Speed = length / time = ${L}/${t} = ${v} m/s.\nIn km/h: ${v} × 18/5 = ${s} km/h.`,
      };
    }
    if (lvl === 2) {
      const s = r.pick(speeds);
      const v = (s * 5) / 18;
      const L = r.int(10, 40) * 10;
      const t = r.int(12, 40);
      const P = v * t - L;
      if (P <= 50) return trains.make(r, lvl);
      return {
        topic: "Speed, Time & Distance",
        q: `A train ${L} m long running at ${s} km/h crosses a platform in ${t} seconds. The length of the platform is:`,
        o: options(P, [v * t, P + L / 2, v * t + L], (v2) => `${num(v2)} m`, 10),
        x: `Speed = ${s} × 5/18 = ${v} m/s. Distance covered in ${t} s = ${v * t} m = train + platform.\nPlatform = ${v * t} − ${L} = ${P} m.`,
      };
    }
    const s1 = r.pick(speeds), s2 = r.pick([36, 54, 72].filter((x) => x !== s1));
    const L1 = r.int(10, 30) * 10, L2 = r.int(10, 30) * 10;
    const rel = ((s1 + s2) * 5) / 18;
    const t = (L1 + L2) / rel;
    if (!Number.isInteger(t * 10)) return trains.make(r, 2);
    return {
      topic: "Speed, Time & Distance",
      q: `Two trains of lengths ${L1} m and ${L2} m run on parallel tracks in opposite directions at ${s1} km/h and ${s2} km/h. How long do they take to cross each other completely?`,
      o: options(t, [(L1 + L2) / ((Math.abs(s1 - s2) * 5) / 18 || 1), t + 3, (L1 + L2) / ((s1 * 5) / 18)], (v) => `${num(v, 1)} seconds`, 1),
      x: `Opposite directions → relative speed = ${s1} + ${s2} = ${s1 + s2} km/h = ${num(rel)} m/s.\nDistance = sum of lengths = ${L1 + L2} m.\nTime = ${L1 + L2} / ${num(rel)} = ${num(t, 1)} s.`,
    };
  },
};

const avgSpeed: Generator = {
  id: "avg-speed",
  topic: "Speed, Time & Distance",
  make(r, lvl) {
    const pairs: [number, number][] = [];
    for (let u = 10; u <= 90; u += 2) for (let v = u + 4; v <= 120; v += 2) if ((2 * u * v) % (u + v) === 0) pairs.push([u, v]);
    const [u, v] = r.pick(pairs);
    const avg = (2 * u * v) / (u + v);
    if (lvl <= 2) {
      const who = r.pick(["An inspector drives", "A courier van travels", "A cyclist rides", "A bus runs"]);
      return {
        topic: "Speed, Time & Distance",
        q: `${who} from town P to town Q at ${u} km/h and returns along the same road at ${v} km/h. The average speed for the whole journey is:`,
        o: options(avg, [(u + v) / 2, avg - 2, Math.sqrt(u * v)], (x) => `${num(x)} km/h`, 2),
        x: `For equal distances, average speed = 2uv/(u + v) (harmonic mean), not (u + v)/2.\n= 2 × ${u} × ${v} / (${u} + ${v}) = ${2 * u * v}/${u + v} = ${num(avg)} km/h.`,
      };
    }
    // boats & streams
    const b = r.int(6, 20), s = r.int(1, 5);
    const d = (b + s) * r.int(2, 5);
    const tDown = d / (b + s);
    const tUp = d / (b - s);
    if (!Number.isInteger(tUp * 10)) return avgSpeed.make(r, 2);
    return {
      topic: "Boats & Streams",
      q: `A motor boat goes ${d} km downstream in ${num(tDown)} hours and returns the same distance upstream in ${num(tUp, 1)} hours. The speed of the stream is:`,
      o: options(s, [b, (b + s) / 2, s + 2], (x) => `${num(x)} km/h`),
      x: `Downstream speed = ${d}/${num(tDown)} = ${b + s} km/h; upstream speed = ${d}/${num(tUp, 1)} = ${b - s} km/h.\nStream = (down − up)/2 = (${b + s} − ${b - s})/2 = ${s} km/h (boat in still water = ${b} km/h).`,
    };
  },
};

const mixture: Generator = {
  id: "mixture",
  topic: "Mixtures & Alligation",
  make(r, lvl) {
    if (lvl <= 2) {
      const p1 = r.int(4, 12) * 10, gap = r.int(3, 10) * 5;
      const p2 = p1 + gap * r.int(2, 4);
      const pm = r.int(p1 + 5, p2 - 5);
      const g = gcd(p2 - pm, pm - p1);
      const x = (p2 - pm) / g, y = (pm - p1) / g;
      if (x === y) return mixture.make(r, lvl);
      const item = r.pick(["rice", "tea", "pulses", "sugar", "coffee seeds"]);
      return {
        topic: "Mixtures & Alligation",
        q: `In what ratio must ${item} costing ₹${p1} per kg be mixed with ${item} costing ₹${p2} per kg so that the mixture is worth ₹${pm} per kg?`,
        o: textOptions(`${x} : ${y}`, [`${y} : ${x}`, `${x + 1} : ${y}`, `${p1 / gcd(p1, p2)} : ${p2 / gcd(p1, p2)}`], () => `${r.int(1, 9)} : ${r.int(1, 9)}`),
        x: `Alligation: (dearer − mean) : (mean − cheaper) = (${p2} − ${pm}) : (${pm} − ${p1}) = ${p2 - pm} : ${pm - p1} = ${x} : ${y}.\nThis is cheaper : dearer.`,
      };
    }
    const combos: [number, number][] = [[40, 4], [80, 8], [50, 10], [100, 10], [60, 12], [20, 2], [120, 12], [90, 9], [30, 6], [75, 15], [200, 20], [160, 16], [25, 5], [70, 7]];
    const [x, y] = r.pick(combos);
    const left = x * (1 - y / x) ** 2;
    return {
      topic: "Mixtures & Alligation",
      q: `A vessel holds ${x} litres of pure milk. ${y} litres are drawn out and replaced with water. This operation is repeated once more. How much milk is now in the vessel?`,
      o: options(Math.round(left * 100) / 100, [x - 2 * y, x - y, Math.round(left * 100) / 100 - 2], (v) => `${num(v)} litres`, 1),
      x: `After n replacements, milk = x(1 − y/x)ⁿ.\n= ${x} × (1 − ${y}/${x})² = ${x} × (${num(1 - y / x, 3)})² = ${num(left)} litres.\nRemoving 2 × ${y} directly is wrong because the second draw removes a mixture, not pure milk.`,
    };
  },
};

const numberSeries: Generator = {
  id: "number-series",
  topic: "Number Series",
  make(r, lvl) {
    let terms: number[] = [];
    let next = 0;
    let rule = "";
    const kind = lvl === 1 ? r.pick(["diff", "mulAdd"]) : lvl === 2 ? r.pick(["sq", "mulAdd2", "cube"]) : r.pick(["alt", "incMul", "diffSq"]);
    if (kind === "diff") {
      const a = r.int(3, 40), d = r.int(2, 6), k = r.int(1, 4);
      terms = [a];
      for (let i = 0; i < 5; i++) terms.push(terms[i]! + d + i * k);
      next = terms[5]!;
      terms = terms.slice(0, 5);
      rule = `Differences are ${d}, ${d + k}, ${d + 2 * k}, ${d + 3 * k} — increasing by ${k}. Next difference = ${d + 4 * k}, so next term = ${terms[4]} + ${d + 4 * k} = ${next}.`;
    } else if (kind === "mulAdd") {
      const a = r.int(2, 9), m = r.pick([2, 3]), c = r.pick([1, 2, -1, 3]);
      terms = [a];
      for (let i = 0; i < 5; i++) terms.push(terms[i]! * m + c);
      next = terms[5]!;
      terms = terms.slice(0, 5);
      rule = `Each term = previous × ${m} ${c >= 0 ? "+" : "−"} ${Math.abs(c)}. Next = ${terms[4]} × ${m} ${c >= 0 ? "+" : "−"} ${Math.abs(c)} = ${next}.`;
    } else if (kind === "sq") {
      const s = r.int(2, 9), add = r.pick([1, -1, 2, 3, -2]);
      terms = [0, 1, 2, 3, 4].map((i) => (s + i) ** 2 + add);
      next = (s + 5) ** 2 + add;
      rule = `Terms are ${s}²${add >= 0 ? "+" : "−"}${Math.abs(add)}, ${s + 1}²${add >= 0 ? "+" : "−"}${Math.abs(add)}, … so the next is ${s + 5}² ${add >= 0 ? "+" : "−"} ${Math.abs(add)} = ${next}.`;
    } else if (kind === "cube") {
      const s = r.int(1, 5), add = r.pick([1, -1, 2]);
      terms = [0, 1, 2, 3, 4].map((i) => (s + i) ** 3 + add);
      next = (s + 5) ** 3 + add;
      rule = `Terms are n³ ${add >= 0 ? "+" : "−"} ${Math.abs(add)} for n = ${s}, ${s + 1}, …; next n = ${s + 5} → ${(s + 5) ** 3} ${add >= 0 ? "+" : "−"} ${Math.abs(add)} = ${next}.`;
    } else if (kind === "mulAdd2") {
      const a = r.int(2, 8);
      terms = [a];
      for (let i = 1; i <= 5; i++) terms.push(terms[i - 1]! * 2 + i);
      next = terms[5]!;
      terms = terms.slice(0, 5);
      rule = `Pattern ×2 + 1, ×2 + 2, ×2 + 3, ×2 + 4 … Next = ${terms[4]} × 2 + 5 = ${next}.`;
    } else if (kind === "alt") {
      const a = r.int(2, 9), d = r.int(3, 9), b = r.int(20, 60), e = r.int(2, 6);
      const seq: number[] = [];
      for (let i = 0; i < 4; i++) {
        seq.push(a + i * d);
        seq.push(b - i * e);
      }
      terms = seq.slice(0, 7);
      next = seq[7]!;
      rule = `Two interleaved series: odd positions ${a}, ${a + d}, ${a + 2 * d}, ${a + 3 * d} (+${d}); even positions ${b}, ${b - e}, ${b - 2 * e} (−${e}). The 8th term belongs to the even series: ${b - 2 * e} − ${e} = ${next}.`;
    } else if (kind === "incMul") {
      const a = r.int(1, 6);
      terms = [a];
      for (let i = 1; i <= 5; i++) terms.push(terms[i - 1]! * i + i);
      next = terms[5]!;
      terms = terms.slice(0, 5);
      rule = `Pattern: ×1 + 1, ×2 + 2, ×3 + 3, ×4 + 4, … Next = ${terms[4]} × 5 + 5 = ${next}.`;
    } else {
      const a = r.int(2, 30);
      terms = [a];
      for (let i = 1; i <= 5; i++) terms.push(terms[i - 1]! + i * i);
      next = terms[5]!;
      terms = terms.slice(0, 5);
      rule = `Differences are 1², 2², 3², 4² (1, 4, 9, 16). Next difference = 5² = 25 → ${terms[4]} + 25 = ${next}.`;
    }
    const last = terms[terms.length - 1]!;
    const prev = terms[terms.length - 2]!;
    return {
      topic: "Number Series",
      q: `Find the next term of the series: ${terms.join(", ")}, ?`,
      o: options(next, [next + 2, next - 3, last + (last - prev), next + 10], (v) => String(v), 1, true),
      x: rule,
    };
  },
};

const CODE_WORDS = [
  "LABOUR", "PENSION", "WAGES", "UNION", "STRIKE", "BONUS", "CLAIM", "FUND", "SALARY", "LEDGER",
  "AUDIT", "CREDIT", "DEBIT", "QUOTA", "TRUST", "SCHEME", "POLICY", "MARKET", "BUDGET", "INCOME",
  "SAVING", "PLANT", "MINES", "COURT", "BOARD", "OFFICE", "FACTOR", "SHARE", "BRANCH", "MEMBER",
  "NOTICE", "SAFETY", "HEALTH", "GRANT", "RELIEF", "CASUAL", "WORKER", "DEPOT", "CANTER", "HARBOR",
  "BRIDGE", "TABLET", "PENCIL", "GARDEN", "CASTLE", "PLANET", "ORANGE", "FOREST", "SILVER", "WINDOW",
];
const shift = (ch: string, k: number) => String.fromCharCode(((ch.charCodeAt(0) - 65 + k + 26 * 4) % 26) + 65);

const letterCoding: Generator = {
  id: "letter-coding",
  topic: "Coding–Decoding",
  make(r, lvl) {
    const [w1, w2] = r.shuffle(CODE_WORDS).slice(0, 2) as [string, string];
    const k = r.int(1, 4) * (r.chance(0.5) ? 1 : -1);
    let enc: (w: string) => string;
    let ruleText: string;
    const alt: ((w: string) => string)[] = [];
    if (lvl === 1) {
      enc = (w) => [...w].map((c) => shift(c, k)).join("");
      ruleText = `each letter is moved ${Math.abs(k)} place${Math.abs(k) > 1 ? "s" : ""} ${k > 0 ? "forward" : "backward"} in the alphabet`;
      alt.push((w) => [...w].map((c) => shift(c, -k)).join(""), (w) => [...w].map((c) => shift(c, k + 1)).join(""), (w) => [...w].reverse().map((c) => shift(c, k)).join(""));
    } else if (lvl === 2) {
      const m = Math.abs(k);
      enc = (w) => [...w].map((c, i) => shift(c, i % 2 === 0 ? m : -m)).join("");
      ruleText = `letters in odd positions move ${m} forward and letters in even positions move ${m} backward`;
      alt.push((w) => [...w].map((c, i) => shift(c, i % 2 === 0 ? -m : m)).join(""), (w) => [...w].map((c) => shift(c, m)).join(""), (w) => [...w].map((c, i) => shift(c, i % 2 === 0 ? m + 1 : -m)).join(""));
    } else {
      enc = (w) => [...w].reverse().map((c) => shift(c, k)).join("");
      ruleText = `the word is written in reverse order and then each letter is moved ${Math.abs(k)} place${Math.abs(k) > 1 ? "s" : ""} ${k > 0 ? "forward" : "backward"}`;
      alt.push((w) => [...w].map((c) => shift(c, k)).join(""), (w) => [...w].reverse().map((c) => shift(c, -k)).join(""), (w) => [...w].reverse().map((c, i) => shift(c, k + (i % 2))).join(""));
    }
    const c1 = enc(w1), c2 = enc(w2);
    return {
      topic: "Coding–Decoding",
      q: `In a certain code language, ${w1} is written as ${c1}. How is ${w2} written in that code?`,
      o: textOptions(c2, alt.map((f) => f(w2)), () => [...c2].map((c) => shift(c, r.int(1, 3))).join("")),
      x: `Compare ${w1} → ${c1}: ${[...w1].slice(0, 3).map((c, i) => `${c}→${c1[lvl === 3 ? c1.length - 1 - i : i]}`).join(", ")}…\nRule: ${ruleText}.\nApplying it to ${w2} gives ${c2}.`,
    };
  },
};

const DIRS = ["North", "East", "South", "West"];
const direction: Generator = {
  id: "direction",
  topic: "Direction Sense",
  make(r, lvl) {
    const triples: [number, number, number][] = [[3, 4, 5], [6, 8, 10], [5, 12, 13], [9, 12, 15], [8, 15, 17], [12, 16, 20], [7, 24, 25], [15, 20, 25]];
    const [p, qq, h] = r.pick(triples);
    const swap = r.chance(0.5);
    const X = (swap ? p : qq) * (r.chance(0.5) ? 1 : -1);
    const Y = (swap ? qq : p) * (r.chance(0.5) ? 1 : -1);
    // legs y1, x1, y2, x2 with sums Y and X
    let y1 = 0, x1 = 0;
    do y1 = r.int(-25, 25); while (y1 === 0 || y1 === Y);
    do x1 = r.int(-25, 25); while (x1 === 0 || x1 === X);
    const legs: [number, number][] = [[0, y1], [x1, 0], [0, Y - y1], [X - x1, 0]];
    const absDir = (dx: number, dy: number) => (dy > 0 ? 0 : dy < 0 ? 2 : dx > 0 ? 1 : 3);
    const name = r.pick(["Meena", "Arjun", "A field officer", "Farhan", "A surveyor", "Gita"]);
    let text = "";
    let heading = absDir(...legs[0]!);
    text += `${name} starts from point O and walks ${Math.abs(y1)} km towards ${DIRS[heading]}`;
    for (let i = 1; i < legs.length; i++) {
      const nd = absDir(...legs[i]!);
      const turn = (nd - heading + 4) % 4 === 1 ? "right" : "left";
      heading = nd;
      const dist = Math.abs(legs[i]![0] || legs[i]![1]);
      text += i === legs.length - 1 ? `, and finally turns ${turn} and walks ${dist} km` : `, then turns ${turn} and walks ${dist} km`;
    }
    const ns = Y > 0 ? "North" : "South";
    const ew = X > 0 ? "East" : "West";
    const correct = `${h} km, ${ns}-${ew}`;
    const opp = `${h} km, ${Y > 0 ? "South" : "North"}-${X > 0 ? "West" : "East"}`;
    const wrongDist = `${Math.abs(X) + Math.abs(Y)} km, ${ns}-${ew}`;
    const other = `${h} km, ${ns}-${X > 0 ? "West" : "East"}`;
    const ask = lvl === 1 ? "How far is the person from O and in which direction?" : "What is the shortest distance and direction of the final position from O?";
    return {
      topic: "Direction Sense",
      q: `${text}. ${ask}`,
      o: textOptions(correct, [opp, wrongDist, other], () => `${h + r.int(1, 4)} km, ${ns}-${ew}`),
      x: `Take O as origin, North/East positive.\nNorth–South: ${y1 > 0 ? "+" : ""}${y1} ${Y - y1 > 0 ? "+" : ""}${Y - y1} = ${Y} km → ${Math.abs(Y)} km ${ns}.\nEast–West: ${x1 > 0 ? "+" : ""}${x1} ${X - x1 > 0 ? "+" : ""}${X - x1} = ${X} km → ${Math.abs(X)} km ${ew}.\nDistance = √(${Math.abs(X)}² + ${Math.abs(Y)}²) = ${h} km, towards ${ns}-${ew}.`,
    };
  },
};

function fmtMinFrac(num11: number, h: number) {
  const whole = Math.floor(num11 / 11);
  const rem = num11 % 11;
  return rem === 0 ? `${whole} minutes past ${h}` : `${whole} ${rem}/11 minutes past ${h}`;
}

const clock: Generator = {
  id: "clock",
  topic: "Clocks",
  make(r, lvl) {
    if (lvl <= 2) {
      const h = r.int(1, 12), m = lvl === 1 ? r.pick([10, 15, 20, 25, 30, 40, 45, 50]) : r.int(1, 59);
      let ang = Math.abs(30 * (h % 12) - 5.5 * m);
      if (ang > 180) ang = 360 - ang;
      const wrong1 = Math.abs(30 * (h % 12) - 6 * m) % 360;
      return {
        topic: "Clocks",
        q: `What is the smaller angle between the hour hand and the minute hand of a clock at ${h}:${String(m).padStart(2, "0")}?`,
        o: options(ang, [wrong1 > 180 ? 360 - wrong1 : wrong1, 360 - ang, ang + 7.5], (v) => `${num(v)}°`, 2.5),
        x: `Angle = |30H − 5.5M| = |30×${h % 12} − 5.5×${m}| = |${30 * (h % 12)} − ${num(5.5 * m)}| = ${num(Math.abs(30 * (h % 12) - 5.5 * m))}°.\n${Math.abs(30 * (h % 12) - 5.5 * m) > 180 ? `Since this exceeds 180°, the smaller angle = 360 − ${num(Math.abs(30 * (h % 12) - 5.5 * m))} = ${num(ang)}°.` : `Smaller angle = ${num(ang)}°.`}\n(The minute hand gains 5.5° per minute over the hour hand.)`,
      };
    }
    const h = r.pick([1, 2, 3, 4, 5, 7, 8, 9, 10]);
    const kind = r.pick(["coincide", "opposite"]);
    const n11 = kind === "coincide" ? 60 * h : h < 6 ? 60 * h + 360 : 60 * h - 360;
    const correct = fmtMinFrac(n11, h);
    return {
      topic: "Clocks",
      q: `At what time between ${h} and ${h + 1} o'clock will the hands of a clock ${kind === "coincide" ? "coincide" : "point in opposite directions (be in a straight line but opposite)"}?`,
      o: textOptions(correct, [`${5 * h} minutes past ${h}`, fmtMinFrac(kind === "coincide" ? 60 * h + 180 : 60 * h, h), fmtMinFrac(n11 + 11, h)], () => fmtMinFrac(n11 + r.int(2, 30), h)),
      x: `At ${h}:00 the minute hand is ${5 * h} minute-spaces behind the hour hand.\n${kind === "coincide" ? `To coincide it must gain ${5 * h} spaces` : `To be opposite it must ${h < 6 ? `gain ${5 * h} + 30 = ${5 * h + 30}` : `gain ${5 * h} − 30 = ${5 * h - 30}`} spaces`}; it gains 55 spaces in 60 minutes.\nTime = ${kind === "coincide" ? 5 * h : h < 6 ? 5 * h + 30 : 5 * h - 30} × 60/55 = ${n11}/11 minutes = ${correct}.`,
    };
  },
};

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const isLeap = (y: number) => (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0;
const dow = (y: number, m: number, d: number) => new Date(Date.UTC(y, m, d)).getUTCDay();

const calendar: Generator = {
  id: "calendar",
  topic: "Calendar",
  make(r, lvl) {
    if (lvl === 1) {
      const y = r.int(2001, 2035);
      const m1 = r.int(2, 6), d1 = r.int(1, 28);
      const m2 = r.int(m1 + 1, 11), d2 = r.int(1, 28);
      const w1 = dow(y, m1, d1), w2 = dow(y, m2, d2);
      const diff = (Date.UTC(y, m2, d2) - Date.UTC(y, m1, d1)) / 86400000;
      return {
        topic: "Calendar",
        q: `If ${d1} ${MONTHS[m1]} of a certain year falls on a ${DAYS[w1]}, on which day of the week will ${d2} ${MONTHS[m2]} of the same year fall?`,
        o: textOptions(DAYS[w2]!, [DAYS[(w2 + 1) % 7]!, DAYS[(w2 + 6) % 7]!, DAYS[(w2 + 2) % 7]!], () => DAYS[r.int(0, 6)]!),
        x: `Days from ${d1} ${MONTHS[m1]} to ${d2} ${MONTHS[m2]} = ${diff} = ${Math.floor(diff / 7)} weeks + ${diff % 7} odd day${diff % 7 === 1 ? "" : "s"}.\n${DAYS[w1]} + ${diff % 7} = ${DAYS[w2]}. (February is not involved, so leap years do not matter.)`,
      };
    }
    if (lvl === 2) {
      const y1 = r.int(1995, 2020), gap = r.int(3, 8), y2 = y1 + gap;
      const m = r.int(0, 11), d = r.int(1, 28);
      const w1 = dow(y1, m, d), w2 = dow(y2, m, d);
      const diff = (Date.UTC(y2, m, d) - Date.UTC(y1, m, d)) / 86400000;
      return {
        topic: "Calendar",
        q: `${d} ${MONTHS[m]} ${y1} was a ${DAYS[w1]}. What day of the week was ${d} ${MONTHS[m]} ${y2}?`,
        o: textOptions(DAYS[w2]!, [DAYS[(w1 + gap) % 7]!, DAYS[(w2 + 1) % 7]!, DAYS[(w2 + 6) % 7]!], () => DAYS[r.int(0, 6)]!),
        x: `Each ordinary year shifts the day by 1, and a leap day (29 Feb) crossed in between adds 1 more.\nTotal days between the dates = ${diff} = ${Math.floor(diff / 7)} weeks + ${diff % 7} odd days.\n${DAYS[w1]} + ${diff % 7} = ${DAYS[w2]}.`,
      };
    }
    const y = r.int(1801, 2099), m = r.int(0, 11), d = r.int(1, 28);
    const w = dow(y, m, d);
    const C = y - 1;
    const rem = C % 400;
    const cent = Math.floor(rem / 100);
    const centOdd = [0, 5, 3, 1][cent]!;
    const rr = rem % 100;
    const leaps = Math.floor(rr / 4);
    const yrOdd = (leaps * 2 + (rr - leaps)) % 7;
    const mdays = [31, isLeap(y) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    let doy = d;
    for (let i = 0; i < m; i++) doy += mdays[i]!;
    const total = (centOdd + yrOdd + doy) % 7;
    if (total !== w) throw new Error("calendar odd-day mismatch");
    return {
      topic: "Calendar",
      q: `On which day of the week did ${d} ${MONTHS[m]} ${y} fall?`,
      o: textOptions(DAYS[w]!, [DAYS[(w + 1) % 7]!, DAYS[(w + 6) % 7]!, DAYS[(w + 3) % 7]!], () => DAYS[r.int(0, 6)]!),
      x: `Odd-day method (Sunday = 0).\nCompleted years = ${C}: ${C - rem} years → 0 odd days; ${cent * 100} years → ${centOdd}; remaining ${rr} years have ${leaps} leap + ${rr - leaps} ordinary → ${leaps}×2 + ${rr - leaps} = ${leaps * 2 + rr - leaps} → ${yrOdd} odd day(s).\nDays elapsed in ${y} up to ${d} ${MONTHS[m]} = ${doy} → ${doy % 7} odd day(s).\nTotal = ${centOdd} + ${yrOdd} + ${doy % 7} = ${centOdd + yrOdd + (doy % 7)} → ${total} → ${DAYS[w]}.`,
    };
  },
};

const ranking: Generator = {
  id: "ranking",
  topic: "Ranking & Order",
  make(r, lvl) {
    const name = r.pick(["Nisha", "Rahul", "Imran", "Lata", "Deepak", "Sonal", "Harish", "Pooja"]);
    const line = r.pick(["a row of candidates", "a queue at a counter", "a merit list", "a line of trainees"]);
    if (lvl === 1) {
      const p = r.int(5, 30), qv = r.int(5, 30);
      return {
        topic: "Ranking & Order",
        q: `In ${line}, ${name} is ${ord(p)} from the front and ${ord(qv)} from the back. How many persons are there in all?`,
        o: options(p + qv - 1, [p + qv, p + qv + 1, p + qv - 2], (v) => String(v)),
        x: `Total = (position from front) + (position from back) − 1 = ${p} + ${qv} − 1 = ${p + qv - 1}. ${name} is counted in both positions, hence −1.`,
      };
    }
    if (lvl === 2) {
      const n = r.int(35, 70), p = r.int(8, n - 8);
      return {
        topic: "Ranking & Order",
        q: `There are ${n} names in ${line}. ${name}'s name is ${ord(p)} from the top. What is its position from the bottom?`,
        o: options(n - p + 1, [n - p, n - p + 2, p + 1], (v) => ord(v)),
        x: `Position from bottom = Total − position from top + 1 = ${n} − ${p} + 1 = ${n - p + 1}.`,
      };
    }
    const a = r.int(7, 20), b = r.int(7, 20), newA = r.int(a + 5, a + 18);
    const total = newA + b - 1;
    const other = r.pick(["Vikram", "Asif", "Rekha", "Tanya"]);
    return {
      topic: "Ranking & Order",
      q: `In a row, ${name} is ${ord(a)} from the left and ${other} is ${ord(b)} from the right. When they interchange their positions, ${name} becomes ${ord(newA)} from the left. How many persons are there in the row?`,
      o: options(total, [a + b - 1, newA + b, newA + a - 1], (v) => String(v)),
      x: `After interchange, ${name} occupies ${other}'s old place, which is ${ord(b)} from the right and now ${ord(newA)} from the left.\nTotal = ${newA} + ${b} − 1 = ${total}.`,
    };
  },
};

function ord(n: number) {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return `${n}${s[(v - 20) % 10] || s[v] || s[0]}`;
}

const lcmHcf: Generator = {
  id: "lcm-hcf",
  topic: "LCM & HCF",
  make(r, lvl) {
    if (lvl === 1) {
      const iv = r.shuffle([6, 8, 9, 10, 12, 15, 16, 18, 20, 24, 25, 30, 36, 40, 45]).slice(0, 3);
      const L = iv.reduce((a, b) => lcm(a, b), 1);
      const mm = (s: number) => (s >= 60 ? `${Math.floor(s / 60)} min ${s % 60 ? `${s % 60} s` : ""}`.trim() : `${s} s`);
      const what = r.pick(["Three bells toll", "Three traffic lights change", "Three alarms beep", "Three sirens sound"]);
      return {
        topic: "LCM & HCF",
        q: `${what} at intervals of ${iv.join(", ")} seconds respectively. If they start together, after how long will they next coincide?`,
        o: textOptions(mm(L), [mm(L / 2), mm(L * 2), mm(iv[0]! * iv[1]!)], () => mm(L + 60 * r.int(1, 5))),
        x: `They coincide after LCM(${iv.join(", ")}) seconds.\nLCM = ${L} s = ${mm(L)}.`,
      };
    }
    if (lvl === 2) {
      const ds = r.shuffle([6, 8, 9, 12, 15, 18, 20, 24]).slice(0, 3);
      const L = ds.reduce((a, b) => lcm(a, b), 1);
      const rem = r.int(1, Math.min(...ds) - 1);
      return {
        topic: "LCM & HCF",
        q: `What is the least number which, when divided by ${ds.join(", ")}, leaves a remainder of ${rem} in each case?`,
        o: options(L + rem, [L, L - rem, 2 * L + rem], (v) => String(v), 1),
        x: `Required number = LCM(${ds.join(", ")}) + ${rem} = ${L} + ${rem} = ${L + rem}.`,
      };
    }
    const h = r.int(7, 41);
    const rem = r.int(2, h - 1);
    const ks = r.shuffle([11, 13, 17, 19, 23, 29, 31, 37]).slice(0, 3).sort((a, b) => a - b);
    const nums = ks.map((k) => h * k + rem);
    const d1 = nums[1]! - nums[0]!, d2 = nums[2]! - nums[1]!;
    const H = gcd(d1, d2);
    return {
      topic: "LCM & HCF",
      q: `Find the greatest number that will divide ${nums.join(", ")} leaving the same remainder in each case.`,
      o: options(H, [gcd(gcd(nums[0]!, nums[1]!), nums[2]!) || H + 2, H * 2, rem], (v) => String(v), 1),
      x: `If N leaves the same remainder, N divides the differences.\nDifferences: ${nums[1]} − ${nums[0]} = ${d1}, ${nums[2]} − ${nums[1]} = ${d2}.\nHCF(${d1}, ${d2}) = ${H}.`,
    };
  },
};

const unitDigit: Generator = {
  id: "unit-digit",
  topic: "Number System",
  make(r, lvl) {
    const ud = (b: number, e: number) => {
      const c = ((e - 1) % 4) + 1;
      let y = 1;
      for (let i = 0; i < c; i++) y = (y * (b % 10)) % 10;
      return y;
    };
    if (lvl === 1) {
      const b = r.pick([2, 3, 7, 8, 12, 13, 17, 18, 22, 23, 27, 28, 32, 33]), e = r.int(21, 199);
      const u = ud(b, e);
      return {
        topic: "Number System",
        q: `What is the unit digit of ${b}^${e}?`,
        o: options(u, [(u + 2) % 10, (u + 4) % 10, ud(b, e + 1)], (v) => String(v), 1, true),
        x: `Unit digit depends only on ${b % 10}. Powers of ${b % 10} repeat with cycle 4: ${[1, 2, 3, 4].map((k) => ud(b, k)).join(", ")}.\n${e} ÷ 4 leaves remainder ${e % 4}${e % 4 === 0 ? " (treated as 4)" : ""} → use position ${((e - 1) % 4) + 1} of the cycle → ${u}.`,
      };
    }
    const b1 = r.pick([2, 3, 7, 8, 4, 9]), e1 = r.int(15, 120);
    const b2 = r.pick([3, 7, 9, 2, 8].filter((v) => v !== b1)), e2 = r.int(15, 120);
    const u1 = ud(b1, e1), u2 = ud(b2, e2);
    const op = lvl === 2 ? "×" : "+";
    const u = op === "×" ? (u1 * u2) % 10 : (u1 + u2) % 10;
    return {
      topic: "Number System",
      q: `Find the unit digit of ${b1 + 10 * r.int(1, 9)}^${e1} ${op} ${b2 + 10 * r.int(1, 9)}^${e2}.`,
      o: options(u, [(u + 1) % 10, (u + 5) % 10, (u1 + u2 + 1) % 10, (u + 3) % 10], (v) => String(v), 1, true),
      x: `Only last digits matter.\nUnit digit of first term (base ending ${b1}, cycle ${[1, 2, 3, 4].map((k) => ud(b1, k)).join(",")}; ${e1} → position ${((e1 - 1) % 4) + 1}) = ${u1}.\nUnit digit of second term (base ending ${b2}, cycle ${[1, 2, 3, 4].map((k) => ud(b2, k)).join(",")}; ${e2} → position ${((e2 - 1) % 4) + 1}) = ${u2}.\n${u1} ${op} ${u2} → unit digit ${u}.`,
    };
  },
};

const remainder: Generator = {
  id: "remainder",
  topic: "Number System",
  make(r, lvl) {
    if (lvl === 1) {
      const big = r.pick([36, 48, 60, 72, 84, 90, 96]);
      const divs = [2, 3, 4, 5, 6, 8, 9, 10, 12, 15, 16, 18, 24].filter((d) => big % d === 0 && d < big);
      const small = r.pick(divs);
      const rem = r.int(small + 1, big - 1);
      return {
        topic: "Number System",
        q: `A number when divided by ${big} leaves a remainder of ${rem}. What will be the remainder when the same number is divided by ${small}?`,
        o: options(rem % small, [(rem + 1) % small, rem - small, small - (rem % small)], (v) => String(v), 1, true),
        x: `N = ${big}k + ${rem}. Since ${small} divides ${big}, the remainder is simply ${rem} mod ${small} = ${rem % small}.`,
      };
    }
    if (lvl === 2) {
      const d = r.pick([7, 9, 11, 13]);
      const a = r.int(100, 999), b = r.int(100, 999), c = r.int(100, 999);
      const res = (a * b * c) % d;
      return {
        topic: "Number System",
        q: `What is the remainder when ${a} × ${b} × ${c} is divided by ${d}?`,
        o: options(res, [(res + 2) % d, (a % d) * (b % d) % d, (res + d - 1) % d], (v) => String(v), 1, true),
        x: `Use remainders: ${a} mod ${d} = ${a % d}, ${b} mod ${d} = ${b % d}, ${c} mod ${d} = ${c % d}.\n${a % d} × ${b % d} × ${c % d} = ${(a % d) * (b % d) * (c % d)} → mod ${d} = ${res}.`,
      };
    }
    const base = r.pick([2, 3, 5]);
    const m = r.pick([7, 9, 13].filter((x) => x !== base));
    const e = r.int(50, 300);
    const cyc: number[] = [];
    let v = 1;
    for (let i = 1; i <= 12; i++) {
      v = (v * base) % m;
      cyc.push(v);
      if (v === 1) break;
    }
    const L = cyc.length;
    const res = cyc[(e - 1) % L]!;
    return {
      topic: "Number System",
      q: `Find the remainder when ${base}^${e} is divided by ${m}.`,
      o: options(res, [cyc[e % L]!, (res + 1) % m, m - res], (x) => String(x), 1, true),
      x: `Powers of ${base} mod ${m}: ${cyc.join(", ")} → cycle length ${L}.\n${e} = ${L} × ${Math.floor(e / L)} + ${e % L} → ${base}^${e} ≡ ${e % L === 0 ? `${base}^${L}` : `${base}^${e % L}`} ≡ ${res} (mod ${m}).`,
    };
  },
};

const partnership: Generator = {
  id: "partnership",
  topic: "Partnership",
  make(r, lvl) {
    const A = r.int(3, 12) * 5000, B = r.int(3, 12) * 5000;
    const mA = 12, mB = lvl === 1 ? 12 : r.int(4, 10);
    const C = lvl === 3 ? r.int(2, 10) * 5000 : 0;
    const mC = lvl === 3 ? r.int(3, 9) : 0;
    const wA = A * mA, wB = B * mB, wC = C * mC;
    const g = gcd(gcd(wA, wB), wC || wA);
    const parts = [wA / g, wB / g, wC / g];
    const sum = parts[0]! + parts[1]! + (lvl === 3 ? parts[2]! : 0);
    const k = r.int(2, 20) * 100;
    const profit = sum * k;
    const askB = parts[1]! * k;
    const q =
      lvl === 3
        ? `A starts a business with ${rs(A)}. B joins after ${12 - mB} months with ${rs(B)}, and C joins after ${12 - mC} months with ${rs(C)}. Out of a year-end profit of ${rs(profit)}, B's share is:`
        : lvl === 2
          ? `A invests ${rs(A)} for the whole year and B invests ${rs(B)} after ${12 - mB} months. If the annual profit is ${rs(profit)}, B's share is:`
          : `A and B start a business investing ${rs(A)} and ${rs(B)} for a year. Out of a profit of ${rs(profit)}, B gets:`;
    return {
      topic: "Partnership",
      q,
      o: options(askB, [(profit * B) / (A + B + C), parts[0]! * k, profit - askB], (v) => rs(Math.round(v)), k),
      x: `Profit is shared in the ratio of capital × time.\nA: ${inr(A)}×${mA}, B: ${inr(B)}×${mB}${lvl === 3 ? `, C: ${inr(C)}×${mC}` : ""} → ${lvl === 3 ? parts.join(" : ") : parts.slice(0, 2).join(" : ")}.\nB's share = ${parts[1]}/${sum} × ${inr(profit)} = ${rs(askB)}.`,
    };
  },
};

const ages: Generator = {
  id: "ages",
  topic: "Problems on Ages",
  make(r, lvl) {
    for (let t = 0; t < 300; t++) {
      const a = r.int(2, 9), b = r.int(2, 9);
      if (a === b || gcd(a, b) !== 1) continue;
      const k = r.int(2, 9), n = r.int(3, 15);
      const A = a * k, B = b * k;
      const g = gcd(A + n, B + n);
      const c = (A + n) / g, d = (B + n) / g;
      if (c === a && d === b) continue;
      const after = lvl === 3 && r.chance(0.5) ? -Math.min(n, Math.min(A, B) - 1) : n;
      if (after < 0) {
        const nn = -after;
        const g2 = gcd(A - nn, B - nn);
        if (A - nn <= 0 || B - nn <= 0) continue;
        return {
          topic: "Problems on Ages",
          q: `The present ages of a mother and her son are in the ratio ${Math.max(a, b)} : ${Math.min(a, b)}. ${nn} years ago, the ratio was ${(Math.max(A, B) - nn) / g2} : ${(Math.min(A, B) - nn) / g2}. What is the son's present age?`,
          o: options(Math.min(A, B), [Math.max(A, B), Math.min(A, B) + nn, Math.min(A, B) - nn], (v) => `${v} years`),
          x: `Let ages be ${Math.max(a, b)}k and ${Math.min(a, b)}k.\n(${Math.max(a, b)}k − ${nn}) / (${Math.min(a, b)}k − ${nn}) = ${(Math.max(A, B) - nn) / g2}/${(Math.min(A, B) - nn) / g2} → k = ${k}.\nSon = ${Math.min(a, b)} × ${k} = ${Math.min(A, B)} years.`,
        };
      }
      return {
        topic: "Problems on Ages",
        q: `The ratio of the present ages of P and Q is ${a} : ${b}. After ${n} years, the ratio will become ${c} : ${d}. What is P's present age?`,
        o: options(A, [B, A + n, A - k], (v) => `${v} years`),
        x: `Let ages be ${a}k and ${b}k. Then (${a}k + ${n}) / (${b}k + ${n}) = ${c}/${d}.\n${d}(${a}k + ${n}) = ${c}(${b}k + ${n}) → ${d * a - c * b}k = ${c * n - d * n} → k = ${k}.\nP = ${a} × ${k} = ${A} years.`,
      };
    }
    return ages.make(r, 1);
  },
};

const mensuration: Generator = {
  id: "mensuration",
  topic: "Mensuration",
  make(r, lvl) {
    if (lvl === 1) {
      const l = r.int(10, 60), b = r.int(8, l - 1), rate = r.pick([12, 15, 18, 20, 25, 30]);
      const per = 2 * (l + b);
      return {
        topic: "Mensuration",
        q: `A rectangular plot measures ${l} m by ${b} m. What is the cost of fencing it at ₹${rate} per metre?`,
        o: options(per * rate, [l * b * rate, (l + b) * rate, per * rate + 2 * rate * 10], (v) => rs(v), rate * 2),
        x: `Perimeter = 2(l + b) = 2(${l} + ${b}) = ${per} m.\nCost = ${per} × ${rate} = ${rs(per * rate)}.`,
      };
    }
    if (lvl === 2) {
      const rr = r.pick([7, 14, 21, 3.5, 10.5]), h = r.int(5, 30);
      const vol = (22 / 7) * rr * rr * h;
      return {
        topic: "Mensuration",
        q: `Find the volume of a cylindrical water tank of radius ${rr} m and height ${h} m. (Take π = 22/7)`,
        o: options(Math.round(vol * 100) / 100, [Math.round(2 * (22 / 7) * rr * h * 100) / 100, Math.round(((22 / 7) * rr * rr * h) / 3 * 100) / 100, Math.round(vol * 2 * 100) / 100], (v) => `${num(v)} m³`, 11),
        x: `V = πr²h = (22/7) × ${rr} × ${rr} × ${h} = ${num(vol)} m³.\n(Curved surface 2πrh would be ${num(2 * (22 / 7) * rr * h)} m² — a common mix-up.)`,
      };
    }
    const R = r.pick([6, 9, 12, 3]), rr = r.pick([1, 1.5, 2, 3].filter((x) => x < R)), h = r.pick([2, 3, 4, 6, 8]);
    const sphere = (4 / 3) * R ** 3;
    const cone = (1 / 3) * rr * rr * h;
    const n = sphere / cone;
    if (!Number.isInteger(n)) return mensuration.make(r, 2);
    return {
      topic: "Mensuration",
      q: `A solid metal sphere of radius ${R} cm is melted and recast into cones of base radius ${rr} cm and height ${h} cm. How many cones are obtained?`,
      o: options(n, [n / 2, n * 2, Math.round((R ** 2) / (rr * rr))], (v) => String(Math.round(v)), 4),
      x: `Number = volume of sphere / volume of one cone = (4/3)πR³ / ((1/3)πr²h)\n= 4R³ / (r²h) = 4 × ${R}³ / (${rr}² × ${h}) = ${4 * R ** 3} / ${rr * rr * h} = ${n}.`,
    };
  },
};

const probability: Generator = {
  id: "probability",
  topic: "Probability",
  make(r, lvl) {
    if (lvl === 1) {
      const s = r.int(3, 11);
      let c = 0;
      for (let i = 1; i <= 6; i++) for (let j = 1; j <= 6; j++) if (i + j === s) c++;
      return {
        topic: "Probability",
        q: `Two fair dice are thrown together. What is the probability that the sum of the numbers shown is ${s}?`,
        o: textOptions(frac(c, 36), [frac(c + 1, 36), frac(c, 12), frac(Math.max(1, c - 1), 36)], () => frac(r.int(1, 11), 36)),
        x: `Total outcomes = 36. Pairs with sum ${s}: ${[...Array(6)].flatMap((_, i) => (s - i - 1 >= 1 && s - i - 1 <= 6 ? [`(${i + 1},${s - i - 1})`] : [])).join(", ")} → ${c}.\nP = ${c}/36 = ${frac(c, 36)}.`,
      };
    }
    const red = r.int(3, 8), blue = r.int(2, 7), green = r.int(2, 6);
    const n = red + blue + green;
    if (lvl === 2) {
      const fav = comb(red, 2), tot = comb(n, 2);
      return {
        topic: "Probability",
        q: `A box contains ${red} red, ${blue} blue and ${green} green tokens. Two tokens are drawn at random without replacement. What is the probability that both are red?`,
        o: textOptions(frac(fav, tot), [frac(red * red, n * n), frac(red, n), frac(comb(red, 2) + comb(blue, 2), tot)], () => frac(r.int(1, 20), tot)),
        x: `Ways to choose 2 red = C(${red},2) = ${fav}; ways to choose any 2 = C(${n},2) = ${tot}.\nP = ${fav}/${tot} = ${frac(fav, tot)}.`,
      };
    }
    const none = comb(n - red, 2), tot = comb(n, 2);
    return {
      topic: "Probability",
      q: `A bag has ${red} white and ${n - red} black balls. Two balls are drawn at random together. What is the probability that at least one of them is white?`,
      o: textOptions(frac(tot - none, tot), [frac(none, tot), frac(comb(red, 2), tot), frac(red, n)], () => frac(r.int(1, tot - 1), tot)),
      x: `P(at least one white) = 1 − P(both black).\nP(both black) = C(${n - red},2)/C(${n},2) = ${none}/${tot}.\nRequired = 1 − ${frac(none, tot)} = ${frac(tot - none, tot)}.`,
    };
  },
};

const statistics: Generator = {
  id: "statistics",
  topic: "Basic Statistics",
  make(r, lvl) {
    const n = lvl === 2 ? r.pick([8, 10]) : r.pick([7, 9]);
    const data = [...Array(n)].map(() => r.int(10, 95));
    const sorted = [...data].sort((a, b) => a - b);
    const ctx = r.pick(["marks of students", "daily claims received", "absentee counts of a unit", "weekly overtime hours"]);
    if (lvl === 1) {
      const sum = data.reduce((a, b) => a + b, 0);
      const mean = sum / n;
      return {
        topic: "Basic Statistics",
        q: `The ${ctx} are: ${data.join(", ")}. Their arithmetic mean is:`,
        o: options(Math.round(mean * 100) / 100, [sorted[Math.floor(n / 2)]!, Math.round((sum / (n - 1)) * 100) / 100, Math.round(mean * 100) / 100 + 2], (v) => num(v), 1),
        x: `Sum = ${sum}; number of values = ${n}. Mean = ${sum}/${n} = ${num(mean)}.`,
      };
    }
    if (lvl === 2) {
      const med = (sorted[n / 2 - 1]! + sorted[n / 2]!) / 2;
      return {
        topic: "Basic Statistics",
        q: `Find the median of the ${ctx}: ${data.join(", ")}.`,
        o: options(med, [sorted[n / 2]!, sorted[n / 2 - 1]!, data[n / 2]!], (v) => num(v), 0.5),
        x: `Arrange in order: ${sorted.join(", ")}.\nn = ${n} (even) → median = average of the ${n / 2}th and ${n / 2 + 1}th values = (${sorted[n / 2 - 1]} + ${sorted[n / 2]})/2 = ${num(med)}.`,
      };
    }
    const mean = r.int(30, 70);
    const known = data.slice(0, n - 1);
    const missing = mean * n - known.reduce((a, b) => a + b, 0);
    if (missing <= 0 || missing > 200) return statistics.make(r, 1);
    return {
      topic: "Basic Statistics",
      q: `The mean of ${n} observations is ${mean}. If ${n - 1} of them are ${known.join(", ")}, the remaining observation is:`,
      o: options(missing, [mean, missing + n, mean * (n - 1) - known.reduce((a, b) => a + b, 0) + mean], (v) => String(v), 3),
      x: `Total = ${n} × ${mean} = ${mean * n}. Sum of known values = ${known.reduce((a, b) => a + b, 0)}.\nMissing = ${mean * n} − ${known.reduce((a, b) => a + b, 0)} = ${missing}.`,
    };
  },
};

const PERM_WORDS = [
  "PENSION", "LABOUR", "WELFARE", "ACCOUNT", "EMPLOYER", "BENEFIT", "TRIBUNAL", "GRATUITY", "INSURANCE", "LEDGER",
  "BALANCE", "DEBTOR", "JOURNAL", "PROVIDENT", "DISPUTE", "CONTRACT", "FACTORY", "WORKER", "STANDING", "MINIMUM",
  "ARREARS", "SUBSIDY", "TREASURY", "ESTATE", "PAYROLL", "ASSETS", "CAPITAL", "DEPOSIT", "BANKING", "TAXATION",
  "PREMIUM", "SECURITY", "EQUITY", "VOUCHER", "RESERVE", "SETTLE", "COMPANY", "OFFICER", "MANAGER", "PARTNER",
];
const VOWELS = new Set(["A", "E", "I", "O", "U"]);

const permutation: Generator = {
  id: "permutation",
  topic: "Permutation & Combination",
  make(r, lvl) {
    const w = r.pick(PERM_WORDS);
    const L = [...w];
    if (lvl === 1) {
      const ans = multisetPerms(L);
      return {
        topic: "Permutation & Combination",
        q: `In how many different ways can the letters of the word '${w}' be arranged?`,
        o: options(ans, [fact(L.length), ans / 2, ans * 2], (v) => inr(Math.round(v)), 10),
        x: `The word has ${L.length} letters; ${repeatsNote(L)}.\nArrangements = ${L.length}! / (${repeatsDen(L)}) = ${inr(fact(L.length))} / ${fact(L.length) / ans} = ${inr(ans)}.`,
      };
    }
    const vow = L.filter((c) => VOWELS.has(c));
    const con = L.filter((c) => !VOWELS.has(c));
    if (vow.length < 2) return permutation.make(r, 1);
    const blockArr = multisetPerms([...con, "#"]);
    const inside = multisetPerms(vow);
    const ans = blockArr * inside;
    if (lvl === 2) {
      return {
        topic: "Permutation & Combination",
        q: `In how many ways can the letters of the word '${w}' be arranged so that all the vowels always come together?`,
        o: options(ans, [blockArr, multisetPerms(L), ans * 2], (v) => inr(Math.round(v)), 12),
        x: `Vowels: ${vow.join(", ")}; consonants: ${con.join(", ")}.\nTreat the vowels as one block → ${con.length + 1} units → ${inr(blockArr)} arrangements (${repeatsNote(con)}).\nVowels inside the block: ${inr(inside)} ways (${repeatsNote(vow)}).\nTotal = ${inr(blockArr)} × ${inr(inside)} = ${inr(ans)}.`,
      };
    }
    const total = multisetPerms(L);
    const never = total - ans;
    return {
      topic: "Permutation & Combination",
      q: `How many arrangements of the letters of '${w}' are there in which the vowels are NOT all together?`,
      o: options(never, [ans, total, never - blockArr], (v) => inr(Math.round(v)), 12),
      x: `Total arrangements = ${inr(total)} (${repeatsNote(L)}).\nVowels together = ${inr(blockArr)} × ${inr(inside)} = ${inr(ans)}.\nNot all together = ${inr(total)} − ${inr(ans)} = ${inr(never)}.`,
    };
  },
};

const oddOne: Generator = {
  id: "odd-one",
  topic: "Classification",
  make(r) {
    const kinds = [
      { name: "perfect squares", test: (n: number) => Number.isInteger(Math.sqrt(n)), pool: () => r.int(4, 31) ** 2 },
      { name: "perfect cubes", test: (n: number) => Math.round(Math.cbrt(n)) ** 3 === n, pool: () => r.int(2, 12) ** 3 },
      { name: "prime numbers", test: isPrime, pool: () => { let p = r.int(20, 199); while (!isPrime(p)) p++; return p; } },
      { name: "multiples of 7", test: (n: number) => n % 7 === 0, pool: () => 7 * r.int(5, 40) },
      { name: "multiples of 11", test: (n: number) => n % 11 === 0, pool: () => 11 * r.int(5, 30) },
      { name: "multiples of 13", test: (n: number) => n % 13 === 0, pool: () => 13 * r.int(4, 25) },
    ];
    const k = r.pick(kinds);
    const set = new Set<number>();
    while (set.size < 3) set.add(k.pool());
    let odd = [...set][0]! + r.pick([1, 2, 3, -1, -2, 4]);
    let g = 0;
    while ((k.test(odd) || set.has(odd)) && g++ < 50) odd += 1;
    const shown = r.shuffle([odd, ...set]);
    return {
      topic: "Classification",
      q: `Find the odd one out among ${shown.slice(0, 3).join(", ")} and ${shown[3]}.`,
      o: [String(odd), ...[...set].map(String)],
      x: `${[...set].join(", ")} are all ${k.name}; ${odd} is not. Hence ${odd} is the odd one out.`,
    };
  },
};

function isPrime(n: number) {
  if (n < 2) return false;
  for (let i = 2; i * i <= n; i++) if (n % i === 0) return false;
  return true;
}

const dataInterp: Generator = {
  id: "data-interp",
  topic: "Data Interpretation",
  make(r, lvl) {
    const start = r.int(2017, 2021);
    const what = r.pick([
      ["New establishments registered", ""],
      ["Claims settled (in thousand)", ""],
      ["Production of a fertiliser unit (thousand tonnes)", ""],
      ["Members enrolled in a district (thousand)", ""],
    ]);
    const vals: number[] = [r.int(20, 60) * 5];
    for (let i = 1; i < 5; i++) vals.push(Math.max(40, vals[i - 1]! + r.int(-6, 12) * 5));
    const table = vals.map((v, i) => `${start + i}: ${v}`).join("  |  ");
    if (lvl === 1) {
      const sum = vals.reduce((a, b) => a + b, 0);
      return {
        topic: "Data Interpretation",
        q: `${what[0]} over five years — ${table}.\nWhat is the average per year over the five years?`,
        o: options(sum / 5, [sum / 4, vals[2]!, sum / 5 + 5], (v) => num(v), 2),
        x: `Sum = ${vals.join(" + ")} = ${sum}. Average = ${sum}/5 = ${num(sum / 5)}.`,
      };
    }
    if (lvl === 2) {
      const i = r.int(0, 2), j = r.int(i + 1, 4);
      const ch = ((vals[j]! - vals[i]!) / vals[i]!) * 100;
      return {
        topic: "Data Interpretation",
        q: `${what[0]} — ${table}.\nWhat is the percentage change from ${start + i} to ${start + j}?`,
        o: textOptions(pc(ch), [pc(((vals[j]! - vals[i]!) / vals[j]!) * 100), pc(ch + 5), pc(-ch)], () => pc(ch + r.int(1, 15))),
        x: `Change = ${vals[j]} − ${vals[i]} = ${vals[j]! - vals[i]!} on a base of ${vals[i]} (earlier year).\n% change = ${vals[j]! - vals[i]!}/${vals[i]} × 100 = ${num(ch)}% → ${pc(ch)}.`,
      };
    }
    let best = 1, bestG = -Infinity;
    const gs: string[] = [];
    for (let i = 1; i < 5; i++) {
      const g2 = ((vals[i]! - vals[i - 1]!) / vals[i - 1]!) * 100;
      gs.push(`${start + i}: ${num(g2)}%`);
      if (g2 > bestG) {
        bestG = g2;
        best = i;
      }
    }
    const ties = gs.filter((s) => s.endsWith(`${num(bestG)}%`)).length;
    if (ties > 1) return dataInterp.make(r, 2);
    return {
      topic: "Data Interpretation",
      q: `${what[0]} — ${table}.\nIn which year was the percentage growth over the previous year the highest?`,
      o: textOptions(String(start + best), [1, 2, 3, 4].filter((i) => i !== best).map((i) => String(start + i)), () => String(start)),
      x: `Year-on-year growth: ${gs.join("; ")}.\nHighest growth: ${start + best} (${num(bestG)}%). Note: the largest absolute rise need not be the largest percentage rise.`,
    };
  },
};

export const QUANT_GENERATORS: Generator[] = [
  percentChange,
  profitLoss,
  simpleInterest,
  compoundInterest,
  ratioShare,
  averages,
  timeWork,
  pipes,
  trains,
  avgSpeed,
  mixture,
  numberSeries,
  letterCoding,
  direction,
  clock,
  calendar,
  ranking,
  lcmHcf,
  unitDigit,
  remainder,
  partnership,
  ages,
  mensuration,
  probability,
  statistics,
  permutation,
  oddOne,
  dataInterp,
];

export type { Level };
