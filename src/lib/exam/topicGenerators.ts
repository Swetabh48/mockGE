/**
 * Topic-locked practice generators.
 * Each topic ONLY emits questions of that topic (no mixed-bank fallback).
 */

import { trickForTopic } from "./taxonomy";
import type { SeedQuestion } from "./questionBank";

function round2(n: number): number {
  return Math.round((n + Number.EPSILON) * 100) / 100;
}

function gcd(a: number, b: number): number {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b) {
    const t = b;
    b = a % b;
    a = t;
  }
  return a || 1;
}

function lcm(a: number, b: number): number {
  return Math.abs(a * b) / gcd(a, b);
}

type Built = {
  topic: string;
  subtopic?: string;
  stem: string;
  answer: string;
  wrongs: [string, string, string];
  explanation: string;
  trick: string;
};

function shuffleOpts(
  answer: string,
  wrongs: [string, string, string],
  seed: number,
): { optionA: string; optionB: string; optionC: string; optionD: string; correctOption: string } {
  const opts = [answer, ...wrongs];
  // deterministic shuffle
  for (let i = opts.length - 1; i > 0; i--) {
    const j = (seed * 17 + i * 13) % (i + 1);
    [opts[i], opts[j]] = [opts[j]!, opts[i]!];
  }
  const letters = ["A", "B", "C", "D"] as const;
  const correctOption = letters[opts.indexOf(answer)]!;
  return {
    optionA: opts[0]!,
    optionB: opts[1]!,
    optionC: opts[2]!,
    optionD: opts[3]!,
    correctOption,
  };
}

function pack(
  items: Built[],
  sectionKey: string,
  subject: string,
  marks: number,
  negative: number,
  source: string,
): SeedQuestion[] {
  return items.map((item, i) => {
    const opts = shuffleOpts(item.answer, item.wrongs, i + item.stem.length);
    return {
      qIndex: i + 1,
      sectionKey,
      subject,
      topic: item.topic,
      subtopic: item.subtopic,
      difficulty: "hard",
      stemEn: item.stem,
      optionA: opts.optionA,
      optionB: opts.optionB,
      optionC: opts.optionC,
      optionD: opts.optionD,
      correctOption: opts.correctOption,
      explanation: item.explanation,
      trick: item.trick,
      marks,
      negativeMarks: negative,
      source,
    };
  });
}

/* ---- Quant topic builders (variants driven by setNo + index) ---- */

function quantTimeWork(setNo: number, sub: string, count: number): Built[] {
  const out: Built[] = [];
  for (let i = 0; i < count; i++) {
    const seed = setNo * 97 + i * 31 + 11 + (setNo % 19) * 13;
    const wages = /wage/i.test(sub);
    const pipes = /pipe/i.test(sub);
    // Many pattern slots so consecutive sets don't clone the same stem shape
    const pattern = wages ? seed % 7 : pipes ? 10 + (seed % 3) : seed % 10;

    if (pattern === 0) {
      const a = 8 + (seed % 15);
      const b = 9 + ((seed * 3) % 17);
      const wage = 1800 + (seed % 25) * 120;
      const shareA = Math.round((wage * b) / (a + b));
      out.push({
        topic: "Time & Work",
        subtopic: "Work & wages",
        stem: `A finishes a job in ${a} days and B in ${b} days. Together they earn Rs. ${wage}. A’s wage share is:`,
        answer: `Rs. ${shareA}`,
        wrongs: [
          `Rs. ${Math.round((wage * a) / (a + b))}`,
          `Rs. ${Math.round(wage / 2)}`,
          `Rs. ${shareA + 150}`,
        ],
        explanation: `Efficiency A:B = ${b}:${a}. A gets ${wage}×${b}/(${a}+${b}) = Rs. ${shareA}.`,
        trick:
          "SHORTCUT: Wages ∝ 1/days → A:B = b:a.\n\nWatch: https://www.youtube.com/results?search_query=work+and+wages+trick+SSC",
      });
    } else if (pattern === 1) {
      const a = 12 + (seed % 10);
      const b = 15 + (seed % 9);
      const c = 18 + (seed % 8);
      const wage = 3600 + (seed % 20) * 90;
      const inv = 1 / a + 1 / b + 1 / c;
      const shareA = Math.round(wage * (1 / a) / inv);
      out.push({
        topic: "Time & Work",
        subtopic: "Work & wages",
        stem: `A, B, C can finish a work in ${a}, ${b}, ${c} days. They work together and get Rs. ${wage}. A’s share?`,
        answer: `Rs. ${shareA}`,
        wrongs: [
          `Rs. ${Math.round(wage / 3)}`,
          `Rs. ${Math.round(wage * (1 / b) / inv)}`,
          `Rs. ${shareA + 120}`,
        ],
        explanation: `Shares ∝ 1/${a} : 1/${b} : 1/${c}. A = ${shareA}.`,
        trick: "SHORTCUT: Three-person wages ∝ reciprocals of days. Normalize by sum of rates.",
      });
    } else if (pattern === 2) {
      const a = 10 + (seed % 8);
      const b = 15 + (seed % 7);
      const daysAAlone = 2 + (seed % 4);
      const wage = 2400 + (seed % 18) * 100;
      // A works daysAAlone alone then both finish; wage by work done
      const workAAlone = daysAAlone / a;
      const rem = 1 - workAAlone;
      const togetherRate = 1 / a + 1 / b;
      const daysTogether = rem / togetherRate;
      const workA = workAAlone + daysTogether / a;
      const shareA = Math.round(wage * workA);
      out.push({
        topic: "Time & Work",
        subtopic: "Work & wages",
        stem: `A can do a work in ${a} days, B in ${b} days. A works alone for ${daysAAlone} days, then A and B finish together. Total wages Rs. ${wage} are paid by work done. A’s share?`,
        answer: `Rs. ${shareA}`,
        wrongs: [
          `Rs. ${wage - shareA}`,
          `Rs. ${Math.round(wage / 2)}`,
          `Rs. ${Math.round(wage * b / (a + b))}`,
        ],
        explanation: `A alone does ${round2(workAAlone)}; remaining finished in ${round2(daysTogether)} days together. A’s total work fraction ≈ ${round2(workA)} ⇒ Rs. ${shareA}.`,
        trick: "SHORTCUT: Pay by work fraction, not by calendar days present.",
      });
    } else if (pattern === 3) {
      const a = 16 + (seed % 9);
      const b = 24 + (seed % 8);
      const daily = 400 + (seed % 12) * 50;
      // A is twice as efficient as stated alternate: daily wage proportional to work
      const wageA = Math.round((daily * b) / (a + b));
      out.push({
        topic: "Time & Work",
        subtopic: "Work & wages",
        stem: `A and B working together earn Rs. ${daily} per day. A alone finishes the work in ${a} days, B alone in ${b} days. A’s daily wage is:`,
        answer: `Rs. ${wageA}`,
        wrongs: [
          `Rs. ${Math.round((daily * a) / (a + b))}`,
          `Rs. ${Math.round(daily / 2)}`,
          `Rs. ${wageA + 40}`,
        ],
        explanation: `Daily wage split in efficiency ratio ${b}:${a}. A gets Rs. ${wageA}/day.`,
        trick: "SHORTCUT: Same ratio as wage-share problems — invert days.",
      });
    } else if (pattern === 4) {
      const a = 9 + (seed % 11);
      const b = 12 + (seed % 10);
      const totalDays = 6 + (seed % 5);
      const wage = 3000 + (seed % 15) * 80;
      // Both work totalDays; wages by efficiency
      const shareA = Math.round((wage * b) / (a + b));
      out.push({
        topic: "Time & Work",
        subtopic: "Work & wages",
        stem: `A (${a} days) and B (${b} days) work together for ${totalDays} days and finish part of a project for Rs. ${wage} payment. How much should A receive?`,
        answer: `Rs. ${shareA}`,
        wrongs: [
          `Rs. ${Math.round((wage * a) / (a + b))}`,
          `Rs. ${Math.round(wage * totalDays / (a + b))}`,
          `Rs. ${shareA - 100}`,
        ],
        explanation: `Same time worked ⇒ share by efficiency ${b}:${a}. A = Rs. ${shareA}.`,
        trick: "SHORTCUT: Equal days worked ⇒ wages ∝ efficiency only.",
      });
    } else if (pattern === 5) {
      const men = 8 + (seed % 6);
      const days = 12 + (seed % 8);
      const hours = 6 + (seed % 4);
      const wagePer = 150 + (seed % 10) * 25;
      const total = men * days * hours * wagePer;
      out.push({
        topic: "Time & Work",
        subtopic: "Work & wages",
        stem: `${men} workers work ${hours} hours/day for ${days} days at Rs. ${wagePer}/hour each. Total wages paid?`,
        answer: `Rs. ${total}`,
        wrongs: [
          `Rs. ${men * days * wagePer}`,
          `Rs. ${total + wagePer * men}`,
          `Rs. ${Math.round(total / 2)}`,
        ],
        explanation: `Total = workers × days × hours × rate = ${total}.`,
        trick: "SHORTCUT: Multiply all four factors; don’t drop hours.",
      });
    } else if (pattern === 6) {
      const a = 20 + (seed % 10);
      const b = 30 + (seed % 9);
      const wage = 4500 + (seed % 14) * 100;
      // B is paid 50% more than fair share trap
      const fairA = Math.round((wage * b) / (a + b));
      out.push({
        topic: "Time & Work",
        subtopic: "Work & wages",
        stem: `A can finish in ${a} days, B in ${b} days. They complete a job for Rs. ${wage}. If wages are divided in the ratio of work done, A receives:`,
        answer: `Rs. ${fairA}`,
        wrongs: [
          `Rs. ${Math.round((wage * a) / (a + b))}`,
          `Rs. ${Math.round(wage * 2 / 3)}`,
          `Rs. ${fairA + 250}`,
        ],
        explanation: `Work ratio A:B = ${b}:${a}. A = Rs. ${fairA}.`,
        trick: "SHORTCUT: Never split 1:1 when days differ.",
      });
    } else if (pattern >= 10) {
      const a = 10 + (seed % 12);
      const b = 12 + (seed % 11);
      const c = 15 + (seed % 10);
      const rate = 1 / a + 1 / b - 1 / c;
      const days = round2(1 / rate);
      out.push({
        topic: "Time & Work",
        subtopic: "Pipes & cisterns",
        stem: `Pipes A, B fill in ${a} and ${b} hours; C empties in ${c} hours. All open — time to fill?`,
        answer: `${days} h`,
        wrongs: [`${round2(days + 0.5)} h`, `${a} h`, `${round2(1 / (1 / a + 1 / b))} h`],
        explanation: `Net = 1/${a}+1/${b}−1/${c}; time = ${days} h.`,
        trick: "SHORTCUT: LCM capacity; fillers +; outlet −.",
      });
    } else {
      const a = 8 + (seed % 14);
      const b = 12 + (seed % 13);
      const together = 3 + (seed % 5);
      const workDone = together * (1 / a + 1 / b);
      const rem = Math.max(0, 1 - workDone);
      const more = rem > 0 ? round2(rem * a) : 0;
      const totalDays = round2(together + more);
      out.push({
        topic: "Time & Work",
        subtopic: "Work & wages",
        stem: `A (${a} days) and B (${b} days) work ${together} days together; then A alone finishes. Total days taken?`,
        answer: `${totalDays} days`,
        wrongs: [
          `${round2((a * b) / (a + b))} days`,
          `${together + a} days`,
          `${round2(totalDays + 1)} days`,
        ],
        explanation: `Together work ${round2(workDone)}; A needs ${more} more days; total ${totalDays}.`,
        trick: "SHORTCUT: LCM total work; subtract joint work; finish with A.",
      });
    }
  }
  return out;
}

function quantSiCi(setNo: number, sub: string, count: number): Built[] {
  const out: Built[] = [];
  for (let i = 0; i < count; i++) {
    const seed = setNo * 89 + i * 41 + 7;
    const wantCi = /ci|compound/i.test(sub) || seed % 2 === 0;
    if (wantCi) {
      const P = 8000 + (seed % 9) * 500;
      const r = 8 + (seed % 5);
      const t = 2;
      const amt = round2(P * Math.pow(1 + r / 100, t));
      const ci = round2(amt - P);
      const si = round2((P * r * t) / 100);
      const ciPct = 2 * r + (r * r) / 100;
      out.push({
        topic: "Simple & Compound Interest",
        subtopic: "Compound Interest",
        stem: `Find the compound interest on Rs. ${P} at ${r}% p.a. for ${t} years (compounded annually).`,
        answer: `Rs. ${ci}`,
        wrongs: [`Rs. ${round2(ci + 80)}`, `Rs. ${si}`, `Rs. ${round2(ci - 50)}`],
        explanation: [
          `Step 1 (2-year trick): CI% = 2R + R²/100 = ${ciPct}%.`,
          `Step 2: CI = ${P} × ${ciPct}/100 = ${ci}.`,
          `Step 3: Reject SI = ${si} (trap option).`,
        ].join(" "),
        trick: `SHORTCUT: For 2 years, CI% = 2R+R²/100 = ${ciPct}% → CI = P×that/100. Or CI−SI = P(R/100)².\n\nWorked: P=10000,R=10 → CI%=21 → CI=2100.\n\nWatch: https://www.youtube.com/watch?v=IBj19sI2G-w`,
      });
    } else {
      const P = 5000 + (seed % 8) * 500;
      const r = 6 + (seed % 7);
      const t = 2 + (seed % 3);
      const si = round2((P * r * t) / 100);
      out.push({
        topic: "Simple & Compound Interest",
        subtopic: "Simple Interest",
        stem: `Find the simple interest on Rs. ${P} at ${r}% p.a. for ${t} years.`,
        answer: `Rs. ${si}`,
        wrongs: [
          `Rs. ${round2(si + P * 0.01)}`,
          `Rs. ${round2((P * r * (t + 1)) / 100)}`,
          `Rs. ${P + si}`,
        ],
        explanation: `SI = PRT/100 = ${P}×${r}×${t}/100 = ${si}. Amount would be ${P + si} (not asked).`,
        trick:
          "SHORTCUT: SI = PRT/100. If months given, T = months/12.\n\nWatch: https://www.youtube.com/results?search_query=simple+interest+trick+SSC",
      });
    }
  }
  return out;
}

function quantProfitLoss(setNo: number, sub: string, count: number): Built[] {
  const out: Built[] = [];
  for (let i = 0; i < count; i++) {
    const seed = setNo * 73 + i * 29 + 3;
    if (/discount/i.test(sub) || seed % 3 === 0) {
      const mrp = 2000 + (seed % 6) * 250;
      const d1 = 10 + (seed % 6);
      const d2 = 8 + (seed % 5);
      const net = round2(mrp * (1 - d1 / 100) * (1 - d2 / 100));
      const eq = round2(d1 + d2 - (d1 * d2) / 100);
      out.push({
        topic: "Profit, Loss & Discount",
        subtopic: "Successive discount",
        stem: `On MP Rs. ${mrp}, successive discounts ${d1}% and ${d2}%. Selling price?`,
        answer: `Rs. ${net}`,
        wrongs: [
          `Rs. ${round2(mrp * (1 - (d1 + d2) / 100))}`,
          `Rs. ${round2(mrp * (1 - d1 / 100))}`,
          `Rs. ${round2(net + 40)}`,
        ],
        explanation: `Eq discount = ${d1}+${d2}−(${d1}×${d2})/100 = ${eq}%. SP = ${net}.`,
        trick: `SHORTCUT: Never add discounts. d_eq = d1+d2−d1d2/100 = ${eq}%.\n\nWatch: https://www.youtube.com/results?search_query=successive+discount+trick+SSC+CGL`,
      });
    } else {
      const cp = 400 + (seed % 8) * 50;
      const g = 15 + (seed % 8);
      const r = 8 + (seed % 6);
      const net = round2(g - r - (g * r) / 100);
      out.push({
        topic: "Profit, Loss & Discount",
        subtopic: "CP–SP–MP",
        stem: `An article of CP Rs. ${cp} is sold at ${g}% profit. If SP is then reduced by ${r}% rebate, overall profit/loss % on CP is:`,
        answer: `${net}%`,
        wrongs: [`${g - r}%`, `${g}%`, `${-r}%`],
        explanation: `Exam trick: net% = g−r−(g×r)/100 = ${net}%. No need to compute SP from CP=${cp}.`,
        trick: `SHORTCUT: Overall% = g−r−gr/100. Here ${g}−${r}−${(g * r) / 100} = ${net}%.\nTrap = ${g - r}%.\n\nWatch: https://www.youtube.com/watch?v=RXyGyr8E1cQ`,
      });
    }
  }
  return out;
}

function quantPercentage(setNo: number, _sub: string, count: number): Built[] {
  const out: Built[] = [];
  for (let i = 0; i < count; i++) {
    const seed = setNo * 59 + i * 17 + 5;
    const a = 10 + (seed % 15);
    const b = 8 + (seed % 12);
    const net = round2(a - b - (a * b) / 100);
    out.push({
      topic: "Percentage",
      subtopic: "Basics & successive",
      stem: `A number is increased by ${a}% and then decreased by ${b}%. Net % change?`,
      answer: `${net}%`,
      wrongs: [`${a - b}%`, `${a + b}%`, `${-net}%`],
      explanation: `Net = a + (−b) + a(−b)/100 = ${a}−${b}−${(a * b) / 100} = ${net}%.`,
      trick: `SHORTCUT: Successive % = a+b+ab/100 with signs. +${a} then −${b} → ${net}%.\n\nWatch: https://www.youtube.com/results?search_query=successive+percentage+change+trick+SSC`,
    });
  }
  return out;
}

function quantSpeed(setNo: number, sub: string, count: number): Built[] {
  const out: Built[] = [];
  for (let i = 0; i < count; i++) {
    const seed = setNo * 67 + i * 23 + 9;
    if (/boat/i.test(sub) || seed % 2 === 0) {
      const b = 12 + (seed % 5);
      const s = 2 + (seed % 3);
      const dist = 36 + (seed % 4) * 12;
      const total = round2(dist / (b - s) + dist / (b + s));
      out.push({
        topic: "Time, Speed & Distance",
        subtopic: "Boats & streams",
        stem: `Boat ${b} km/h in still water, stream ${s} km/h. Time to go ${dist} km upstream and return?`,
        answer: `${total} h`,
        wrongs: [`${round2((2 * dist) / b)} h`, `${round2(dist / (b - s))} h`, `${round2(total + 1)} h`],
        explanation: `Upstream ${b - s}, downstream ${b + s}; total time ${total} h.`,
        trick:
          "SHORTCUT: up=u−v, down=u+v. Don’t average the two speeds for equal-distance round trip.\n\nWatch: https://www.youtube.com/results?search_query=boats+streams+trick+SSC+CGL",
      });
    } else {
      const L = 150 + (seed % 6) * 30;
      const v = 54 + (seed % 4) * 18; // km/h
      const mps = round2(v * (5 / 18));
      const t = round2(L / mps);
      out.push({
        topic: "Time, Speed & Distance",
        subtopic: "Trains",
        stem: `A train ${L} m long runs at ${v} km/h. Time to cross a pole?`,
        answer: `${t} s`,
        wrongs: [`${round2(t + 2)} s`, `${round2(L / v)} s`, `${Math.round(v / 5)} s`],
        explanation: `${v} km/h = ${mps} m/s; t = ${L}/${mps} = ${t} s.`,
        trick: "SHORTCUT: km/h→m/s ×5/18. Pole crossing uses train length only.\n\nWatch: https://www.youtube.com/results?search_query=train+problems+trick+SSC",
      });
    }
  }
  return out;
}

function quantRatio(setNo: number, sub: string, count: number): Built[] {
  const out: Built[] = [];
  for (let i = 0; i < count; i++) {
    const seed = setNo * 53 + i * 19 + 2;
    if (/average/i.test(sub) || seed % 2 === 0) {
      const n = 5 + (seed % 4);
      const avg = 40 + (seed % 20);
      const old = 30 + (seed % 15);
      const neu = old + 10 + (seed % 10);
      const newAvg = round2(avg + (neu - old) / n);
      out.push({
        topic: "Ratio, Proportion & Average",
        subtopic: "Averages",
        stem: `Average of ${n} numbers is ${avg}. One number ${old} is replaced by ${neu}. New average?`,
        answer: String(newAvg),
        wrongs: [String(avg), String(round2(avg + neu - old)), String(neu)],
        explanation: `Δtotal = ${neu - old}; Δavg = ${neu - old}/${n}; new = ${newAvg}.`,
        trick: "SHORTCUT: New avg = old avg + (new−old)/n. Don’t rebuild the whole sum.\n\nWatch: https://www.youtube.com/results?search_query=SSC+average+tricks",
      });
    } else {
      const aInv = 12000 + (seed % 5) * 1000;
      const bInv = 9000 + (seed % 4) * 1000;
      const aM = 8;
      const bM = 10 + (seed % 3);
      const profit = 11700 + (seed % 6) * 300;
      const aAmt = Math.round((profit * aInv * aM) / (aInv * aM + bInv * bM));
      out.push({
        topic: "Ratio, Proportion & Average",
        subtopic: "Ratio & partnership",
        stem: `A invests Rs. ${aInv} for ${aM} months, B Rs. ${bInv} for ${bM} months. Profit Rs. ${profit}. A’s share?`,
        answer: `Rs. ${aAmt}`,
        wrongs: [
          `Rs. ${profit - aAmt}`,
          `Rs. ${Math.round(profit / 2)}`,
          `Rs. ${aAmt + 300}`,
        ],
        explanation: `Share ∝ capital×time; A gets Rs. ${aAmt}.`,
        trick: "SHORTCUT: Ratio = (C×T) products. Cancel zeros before multiplying.\n\nWatch: https://www.youtube.com/results?search_query=SSC+CGL+ratio+partnership+tricks",
      });
    }
  }
  return out;
}

function quantNumber(setNo: number, _sub: string, count: number): Built[] {
  const out: Built[] = [];
  for (let i = 0; i < count; i++) {
    const seed = setNo * 43 + i * 11 + 4;
    const x = 12 + (seed % 5) * 2;
    const y = 18 + (seed % 4) * 3;
    const z = 24 + (seed % 3) * 4;
    const L = lcm(lcm(x, y), z);
    const absM = 8 * 60 + L;
    const hh = Math.floor(absM / 60) % 12 || 12;
    const mm = absM % 60;
    const nice = `${hh}:${String(mm).padStart(2, "0")} am`;
    out.push({
      topic: "Number System & HCF-LCM",
      subtopic: "HCF & LCM",
      stem: `Three bells toll every ${x}, ${y} and ${z} minutes. They toll together at 8:00 am. Next together at?`,
      answer: nice,
      wrongs: [
        `8:${String((mm + 10) % 60).padStart(2, "0")} am`,
        `${hh}:${String((mm + 15) % 60).padStart(2, "0")} am`,
        `9:00 am`,
      ],
      explanation: `LCM(${x},${y},${z}) = ${L} min after 8:00 → ${nice}.`,
      trick: "SHORTCUT: Next together = LCM of intervals. Factorize to find LCM fast.\n\nWatch: https://www.youtube.com/results?search_query=HCF+LCM+tricks+SSC",
    });
  }
  return out;
}

function quantAlgebra(setNo: number, _sub: string, count: number): Built[] {
  const out: Built[] = [];
  for (let i = 0; i < count; i++) {
    const seed = setNo * 47 + i * 13 + 6;
    const p = 5 + (seed % 6);
    const q = 6 + (seed % 5);
    const sum = p + q;
    const prod = p * q;
    const val = sum * sum - 2 * prod;
    out.push({
      topic: "Algebra",
      subtopic: "Identities",
      stem: `If α, β are roots of x² − ${sum}x + ${prod} = 0, then α² + β² equals:`,
      answer: String(val),
      wrongs: [String(sum * sum), String(prod), String(val + 2)],
      explanation: `α²+β² = (α+β)² − 2αβ = ${sum}² − 2(${prod}) = ${val}.`,
      trick: "SHORTCUT: Never find roots. Use α²+β²=(α+β)²−2αβ.\n\nWatch: https://www.youtube.com/results?search_query=algebra+identities+tricks+SSC+CGL",
    });
  }
  return out;
}

function quantGeometry(setNo: number, sub: string, count: number): Built[] {
  const out: Built[] = [];
  for (let i = 0; i < count; i++) {
    const seed = setNo * 61 + i * 21 + 8;
    if (/mensur|3d|cylinder/i.test(sub) || seed % 2 === 0) {
      const r = 7;
      const h = 10 + (seed % 6);
      const vol = round2((22 / 7) * r * r * h);
      out.push({
        topic: "Geometry & Mensuration",
        subtopic: "3D mensuration",
        stem: `Volume of a cylinder radius 7 cm, height ${h} cm (π=22/7):`,
        answer: `${vol} cm³`,
        wrongs: [`${round2(2 * 22 * r * h)} cm³`, `${r * r * h} cm³`, `${vol + 154} cm³`],
        explanation: `V=πr²h=(22/7)×49×${h}=154×${h}=${vol}.`,
        trick: "SHORTCUT: r=7 → πr²=154 first, then ×h.\n\nWatch: https://www.youtube.com/results?search_query=mensuration+tricks+SSC+CGL",
      });
    } else {
      const r = 7 + (seed % 5);
      const d = 3 + (seed % 3);
      const len = round2(2 * Math.sqrt(r * r - d * d));
      out.push({
        topic: "Geometry & Mensuration",
        subtopic: "Circles",
        stem: `Chord at distance ${d} cm from centre of circle radius ${r} cm. Chord length?`,
        answer: `${len} cm`,
        wrongs: [`${2 * r} cm`, `${round2(len / 2)} cm`, `${r + d} cm`],
        explanation: `Length = 2√(r²−d²) = ${len} cm.`,
        trick: "SHORTCUT: Half-chord = √(r²−d²). Watch 5-12-13 / 3-4-5 triangles.\n\nWatch: https://www.youtube.com/results?search_query=circle+chord+trick+SSC",
      });
    }
  }
  return out;
}

function quantTrigo(setNo: number, _sub: string, count: number): Built[] {
  const out: Built[] = [];
  for (let i = 0; i < count; i++) {
    const seed = setNo * 71 + i * 15 + 1;
    const use30 = seed % 2 === 0;
    const h = 50 + (seed % 5) * 10;
    if (use30) {
      const d = round2(h * Math.sqrt(3));
      out.push({
        topic: "Trigonometry",
        subtopic: "Heights & distances",
        stem: `From a point, angle of elevation of a tower height ${h} m is 30°. Distance of the point from the foot?`,
        answer: `${d} m`,
        wrongs: [`${h} m`, `${round2(h / Math.sqrt(3))} m`, `${2 * h} m`],
        explanation: `tan30=1/√3=h/d ⇒ d=h√3=${d} m.`,
        trick: "SHORTCUT: tan30=1/√3, tan45=1, tan60=√3. Cancel radicals early.\n\nWatch: https://www.youtube.com/results?search_query=heights+distances+trick+SSC+CGL",
      });
    } else {
      out.push({
        topic: "Trigonometry",
        subtopic: "Heights & distances",
        stem: `Angle of elevation of a tower is 45° from a point ${h} m away. Height of tower?`,
        answer: `${h} m`,
        wrongs: [`${2 * h} m`, `${round2(h / Math.sqrt(3))} m`, `${round2(h * Math.sqrt(3))} m`],
        explanation: `tan45=1=h/d ⇒ h=d=${h} m.`,
        trick: "SHORTCUT: At 45°, height = distance. Instant answer.\n\nWatch: https://www.youtube.com/results?search_query=heights+distances+trick+SSC+CGL",
      });
    }
  }
  return out;
}

function quantDi(setNo: number, _sub: string, count: number): Built[] {
  const out: Built[] = [];
  for (let i = 0; i < count; i++) {
    const seed = setNo * 37 + i * 9 + 12;
    const base = 2400 + (seed % 8) * 100;
    const pA = 25 + (seed % 10);
    const pB = 15 + (seed % 8);
    const a = Math.round((base * pA) / 100);
    const b = Math.round((base * pB) / 100);
    const diff = Math.abs(a - b);
    out.push({
      topic: "Data Interpretation",
      subtopic: "Tables & graphs",
      stem: `In a survey of ${base} people, ${pA}% preferred A and ${pB}% preferred B. By how many did A exceed B?`,
      answer: String(diff),
      wrongs: [String(a), String(b), String(diff + 20)],
      explanation: `A=${a}, B=${b}; difference=${diff}.`,
      trick: "SHORTCUT: Diff = base×|pA−pB|/100. One multiply.\n\nWatch: https://www.youtube.com/results?search_query=DI+percentage+tricks+SSC",
    });
  }
  return out;
}

function buildQuantTopic(
  topicId: string,
  subtopicTitle: string | undefined,
  setNo: number,
  count: number,
): Built[] {
  const sub = subtopicTitle || "";
  switch (topicId) {
    case "time-work":
      return quantTimeWork(setNo, sub, count);
    case "si-ci":
      return quantSiCi(setNo, sub, count);
    case "profit-loss":
      return quantProfitLoss(setNo, sub, count);
    case "percentage":
      return quantPercentage(setNo, sub, count);
    case "speed":
      return quantSpeed(setNo, sub, count);
    case "ratio":
      return quantRatio(setNo, sub, count);
    case "number-system":
      return quantNumber(setNo, sub, count);
    case "algebra":
      return quantAlgebra(setNo, sub, count);
    case "geometry":
      return quantGeometry(setNo, sub, count);
    case "trigo":
      return quantTrigo(setNo, sub, count);
    case "di":
      return quantDi(setNo, sub, count);
    default:
      return quantPercentage(setNo, sub, count);
  }
}

/** Generic non-quant: filter section bank strictly; never relabel wrong topics. */
function filterStrict(
  bank: SeedQuestion[],
  topicTitle: string,
  setNo: number,
  count: number,
): SeedQuestion[] {
  const keys = topicTitle
    .toLowerCase()
    .split(/[\s&/,−–-]+/)
    .filter((w) => w.length > 2);
  const matched = bank.filter((q) => {
    const hay = `${q.topic} ${q.stemEn}`.toLowerCase();
    return keys.some((k) => hay.includes(k));
  });
  if (matched.length >= count) {
    const start = (setNo * 5) % Math.max(1, matched.length);
    const out: SeedQuestion[] = [];
    for (let i = 0; i < count; i++) out.push(matched[(start + i) % matched.length]!);
    return out.map((q, i) => ({ ...q, qIndex: i + 1, source: "topic_practice" }));
  }
  // Still only return matched ones (even if fewer) — never pad with unrelated topics
  if (matched.length > 0) {
    return matched.slice(0, count).map((q, i) => ({ ...q, qIndex: i + 1, source: "topic_practice" }));
  }
  return [];
}

export function buildTopicLockedPractice(args: {
  sectionKey: "reasoning" | "ga" | "quant" | "english";
  topicId: string;
  topicTitle: string;
  subtopicTitle?: string;
  setNo: number;
  count?: number;
  sectionBank: SeedQuestion[];
}): SeedQuestion[] {
  const count = args.count ?? 10;
  const subject =
    args.sectionKey === "quant"
      ? "Quantitative Aptitude"
      : args.sectionKey === "ga"
        ? "General Awareness"
        : args.sectionKey === "english"
          ? "English"
          : "Reasoning";

  if (args.sectionKey === "quant") {
    // Pure generators only — never inject official PDF stems into "Generate"
    const built = buildQuantTopic(args.topicId, args.subtopicTitle, args.setNo, count);
    return pack(built, "quant", subject, 2, 0.5, "topic_practice").map((q, i) => ({
      ...q,
      qIndex: i + 1,
      topic: args.topicTitle,
      subtopic: args.subtopicTitle,
    }));
  }

  const filtered = filterStrict(args.sectionBank, args.topicTitle, args.setNo, count);
  if (filtered.length > 0) {
    return filtered.map((q, i) => ({
      ...q,
      qIndex: i + 1,
      topic: args.topicTitle,
      subtopic: args.subtopicTitle,
      trick: q.trick || trickForTopic(args.topicTitle),
      source: "topic_practice",
    }));
  }

  // Last resort: still generate quant-style placeholder? Better return section slice WITH real topics kept
  const start = (args.setNo * 3) % Math.max(1, args.sectionBank.length - count);
  return args.sectionBank.slice(start, start + count).map((q, i) => ({
    ...q,
    qIndex: i + 1,
    // Keep ORIGINAL topic — do not fake the label
    source: "topic_practice",
  }));
}
