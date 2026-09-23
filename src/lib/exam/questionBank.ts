/**
 * Hard SSC-CGL Tier-I / Tier-II style seed question bank.
 * Generators + curated banks (≥40 items/subject) rotated by paperNo / setNo.
 */

export type SeedQuestion = {
  qIndex: number;
  sectionKey: string;
  subject: string;
  topic: string;
  difficulty: string;
  stemEn: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctOption: string;
  explanation: string;
  marks: number;
  negativeMarks: number;
  source: string;
};

type RawQ = {
  topic: string;
  stem: string;
  answer: string;
  wrongs: [string, string, string];
  explanation: string;
  difficulty?: string;
};

function shuffleOptions(
  correct: string,
  wrongs: [string, string, string],
  salt: number,
): { options: [string, string, string, string]; correctOption: string } {
  const opts = [correct, ...wrongs];
  for (let i = opts.length - 1; i > 0; i--) {
    const j = (Math.abs(salt) + i * 7) % (i + 1);
    [opts[i], opts[j]] = [opts[j]!, opts[i]!];
  }
  // Ensure unique options; if collision, tweak distractors
  const seen = new Set<string>();
  for (let i = 0; i < opts.length; i++) {
    let v = opts[i]!;
    let k = 0;
    while (seen.has(v)) {
      k++;
      v = `${opts[i]}·${k}`;
    }
    opts[i] = v;
    seen.add(v);
  }
  // Restore correct string if it was tweaked (should not happen if wrongs differ)
  const correctIdx = opts.findIndex((o) => o === correct || o.startsWith(correct + "·"));
  if (correctIdx >= 0 && opts[correctIdx] !== correct) opts[correctIdx] = correct;
  const letters = ["A", "B", "C", "D"] as const;
  const idx = opts.indexOf(correct);
  return {
    options: opts as [string, string, string, string],
    correctOption: letters[idx >= 0 ? idx : 0]!,
  };
}

function makeQ(
  base: Omit<SeedQuestion, "optionA" | "optionB" | "optionC" | "optionD" | "correctOption"> & {
    answer: string;
    wrongs: [string, string, string];
  },
): SeedQuestion {
  const { answer, wrongs, ...rest } = base;
  const uniqWrongs = wrongs.map((w, i) => (w === answer ? `${w}*` : w)) as [string, string, string];
  // ensure three distinct distractors
  for (let i = 0; i < 3; i++) {
    if (uniqWrongs.filter((x) => x === uniqWrongs[i]).length > 1) {
      uniqWrongs[i] = `${uniqWrongs[i]}_${i + 1}`;
    }
  }
  const { options, correctOption } = shuffleOptions(
    answer,
    uniqWrongs,
    rest.qIndex * 31 + rest.stemEn.length + (rest.source === "pyq_style" ? 97 : 0),
  );
  return {
    ...rest,
    optionA: options[0],
    optionB: options[1],
    optionC: options[2],
    optionD: options[3],
    correctOption,
  };
}

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

function pickBank(bank: RawQ[], count: number, startIndex: number, offset: number): RawQ[] {
  const out: RawQ[] = [];
  for (let i = 0; i < count; i++) {
    out.push(bank[(offset + i) % bank.length]!);
  }
  return out;
}

function wrapBank(
  items: RawQ[],
  startIndex: number,
  sectionKey: string,
  subject: string,
  marks: number,
  negative: number,
  source: string,
  paperTag: string,
): SeedQuestion[] {
  return items.map((item, i) =>
    makeQ({
      qIndex: startIndex + i,
      sectionKey,
      subject,
      topic: item.topic,
      difficulty: item.difficulty ?? "hard",
      stemEn: paperTag && i % 7 === 3 ? `${item.stem} [${paperTag}]` : item.stem,
      answer: item.answer,
      wrongs: item.wrongs,
      explanation: item.explanation,
      marks,
      negativeMarks: negative,
      source,
    }),
  );
}

/* ========================= QUANT (hard generators) ========================= */

function generateHardQuant(
  count: number,
  startIndex: number,
  marks: number,
  negative: number,
  sectionKey: string,
  subject: string,
  paperNo: number,
  source: string,
): SeedQuestion[] {
  const out: SeedQuestion[] = [];
  for (let i = 0; i < count; i++) {
    const n = startIndex + i;
    const seed = n + paperNo * 17;
    const v = (seed + i) % 14;
    let topic = "Arithmetic";
    let stem = "";
    let answer = "";
    let wrongs: [string, string, string] = ["", "", ""];
    let explanation = "";
    let difficulty = "hard";

    if (v === 0) {
      topic = "Compound Interest";
      const P = 8000 + (seed % 7) * 500;
      const r = 8 + (seed % 5); // 8–12%
      const t = 2 + (seed % 2); // 2 or 3
      const amt = round2(P * Math.pow(1 + r / 100, t));
      const ci = round2(amt - P);
      stem = `Find the compound interest on Rs. ${P} at ${r}% p.a. for ${t} years (compounded annually).`;
      answer = `Rs. ${ci}`;
      wrongs = [`Rs. ${round2(ci + 80)}`, `Rs. ${round2((P * r * t) / 100)}`, `Rs. ${round2(ci - 50)}`];
      explanation = `A = P(1+r/100)^t = ${amt}; CI = A−P = ${ci}.`;
    } else if (v === 1) {
      topic = "Successive Discounts";
      const mrp = 2000 + (seed % 6) * 250;
      const d1 = 10 + (seed % 6);
      const d2 = 8 + (seed % 5);
      const net = round2(mrp * (1 - d1 / 100) * (1 - d2 / 100));
      const eq = round2(100 * (1 - (1 - d1 / 100) * (1 - d2 / 100)));
      stem = `On an article of marked price Rs. ${mrp}, successive discounts of ${d1}% and ${d2}% are given. Selling price is:`;
      answer = `Rs. ${net}`;
      wrongs = [
        `Rs. ${round2(mrp * (1 - (d1 + d2) / 100))}`,
        `Rs. ${round2(mrp * (1 - d1 / 100))}`,
        `Rs. ${round2(net + 40)}`,
      ];
      explanation = `Equivalent discount ≈ ${eq}%; SP = ${net}.`;
    } else if (v === 2) {
      topic = "Boats and Streams";
      const b = 12 + (seed % 5); // boat in still
      const s = 2 + (seed % 3); // stream
      const dist = 36 + (seed % 4) * 12;
      const tUp = round2(dist / (b - s));
      const tDown = round2(dist / (b + s));
      const total = round2(tUp + tDown);
      stem = `A boat’s speed in still water is ${b} km/h and stream is ${s} km/h. Time to go ${dist} km upstream and return downstream?`;
      answer = `${total} h`;
      wrongs = [`${round2(2 * dist / b)} h`, `${tUp} h`, `${round2(total + 1)} h`];
      explanation = `t = ${dist}/(${b}-${s}) + ${dist}/(${b}+${s}) = ${total} h.`;
    } else if (v === 3) {
      topic = "Pipes and Cisterns";
      const a = 12 + (seed % 6);
      const b = 15 + (seed % 5);
      const c = 20 + (seed % 4);
      // A+B fill, C empties; together
      const rate = 1 / a + 1 / b - 1 / c;
      const days = round2(1 / rate);
      stem = `Pipes A and B can fill a tank in ${a} and ${b} hours; C empties it in ${c} hours. If all three are opened, time to fill?`;
      answer = `${days} h`;
      wrongs = [`${round2(days + 1)} h`, `${a} h`, `${round2(1 / (1 / a + 1 / b))} h`];
      explanation = `Net rate = 1/${a}+1/${b}−1/${c}; time = ${days} h.`;
    } else if (v === 4) {
      topic = "Time and Work";
      const a = 10 + (seed % 5);
      const b = 15 + (seed % 6);
      // A is 50% more efficient than stated alternate: A+B for 4 days then A alone
      const together = 4 + (seed % 3);
      const workDone = together * (1 / a + 1 / b);
      const rem = 1 - workDone;
      const more = rem > 0 ? round2(rem * a) : 0;
      const totalDays = round2(together + more);
      stem = `A finishes a work in ${a} days, B in ${b} days. They work together for ${together} days; then A alone finishes. Total days taken?`;
      answer = `${totalDays} days`;
      wrongs = [
        `${round2((a * b) / (a + b))} days`,
        `${together + a} days`,
        `${round2(totalDays + 1)} days`,
      ];
      explanation = `Work in ${together} days = ${round2(workDone)}; A needs ${more} more days; total ${totalDays}.`;
    } else if (v === 5) {
      topic = "Allegation";
      const c1 = 20 + (seed % 10);
      const c2 = 40 + (seed % 10);
      const mean = 28 + (seed % 8);
      // (c2-mean):(mean-c1)
      const r1 = c2 - mean;
      const r2 = mean - c1;
      const g = gcd(r1, r2);
      const ratio = `${r1 / g}:${r2 / g}`;
      stem = `In what ratio must tea at Rs. ${c1}/kg be mixed with tea at Rs. ${c2}/kg so that the mixture is worth Rs. ${mean}/kg?`;
      answer = ratio;
      wrongs = [`${r2 / g}:${r1 / g}`, `${c1}:${c2}`, `1:1`];
      explanation = `Allegation: cheaper:dearer = (c2−mean):(mean−c1) = ${ratio}.`;
    } else if (v === 6) {
      topic = "Partnership";
      const aInv = 12000 + (seed % 5) * 1000;
      const bInv = 9000 + (seed % 4) * 1000;
      const aM = 8;
      const bM = 10 + (seed % 3);
      const profit = 11700 + (seed % 6) * 300;
      const aShare = (aInv * aM) / (aInv * aM + bInv * bM);
      const aAmt = Math.round(profit * aShare);
      stem = `A invests Rs. ${aInv} for ${aM} months and B invests Rs. ${bInv} for ${bM} months. If profit is Rs. ${profit}, A’s share is:`;
      answer = `Rs. ${aAmt}`;
      wrongs = [
        `Rs. ${Math.round(profit * (1 - aShare))}`,
        `Rs. ${Math.round(profit / 2)}`,
        `Rs. ${aAmt + 300}`,
      ];
      explanation = `Ratio of capitals×time; A gets Rs. ${aAmt}.`;
    } else if (v === 7) {
      topic = "Quadratic / Algebra";
      const p = 5 + (seed % 6);
      const q = 6 + (seed % 5);
      // roots of x² − (p+q)x + pq = 0 are p,q; ask (α²+β²)
      const sum = p + q;
      const prod = p * q;
      const val = sum * sum - 2 * prod;
      stem = `If α and β are roots of x² − ${sum}x + ${prod} = 0, then α² + β² equals:`;
      answer = String(val);
      wrongs = [String(sum * sum), String(prod), String(val + 2)];
      explanation = `α²+β² = (α+β)² − 2αβ = ${sum}² − 2(${prod}) = ${val}.`;
    } else if (v === 8) {
      topic = "Geometry (Circles)";
      const r = 7 + (seed % 5);
      // chord at distance d from centre; length 2√(r²−d²)
      const d = 3 + (seed % 3);
      const half = Math.sqrt(r * r - d * d);
      const len = round2(2 * half);
      stem = `A chord is at a distance of ${d} cm from the centre of a circle of radius ${r} cm. Length of the chord is:`;
      answer = `${len} cm`;
      wrongs = [`${2 * r} cm`, `${round2(len / 2)} cm`, `${r + d} cm`];
      explanation = `Half chord = √(r²−d²); length = 2√(${r}²−${d}²) = ${len} cm.`;
    } else if (v === 9) {
      topic = "Trigonometry (Heights)";
      // tan θ = h/d; θ=30 or 45
      const use30 = seed % 2 === 0;
      const h = 50 + (seed % 5) * 10;
      if (use30) {
        // tan30=1/√3 ⇒ d = h√3
        const d = round2(h * Math.sqrt(3));
        stem = `The angle of elevation of the top of a tower from a point on the ground is 30°. If the tower’s height is ${h} m, the distance of the point from the foot is:`;
        answer = `${d} m`;
        wrongs = [`${h} m`, `${round2(h / Math.sqrt(3))} m`, `${2 * h} m`];
        explanation = `tan30° = 1/√3 = h/d ⇒ d = h√3 = ${d} m.`;
      } else {
        stem = `From a point, angle of elevation of a ${h} m tower is 45°. Distance from foot of tower is:`;
        answer = `${h} m`;
        wrongs = [`${2 * h} m`, `${round2(h / Math.sqrt(3))} m`, `${round2(h * Math.sqrt(3))} m`];
        explanation = `tan45° = 1 = h/d ⇒ d = h = ${h} m.`;
      }
    } else if (v === 10) {
      topic = "DI / Percentage";
      const base = 2400 + (seed % 8) * 100;
      const pA = 25 + (seed % 10);
      const pB = 15 + (seed % 8);
      const a = Math.round((base * pA) / 100);
      const b = Math.round((base * pB) / 100);
      const diff = Math.abs(a - b);
      stem = `In a survey of ${base} people, ${pA}% preferred A and ${pB}% preferred B. By how many did preference for A exceed B?`;
      answer = String(diff);
      wrongs = [String(a), String(b), String(diff + 20)];
      explanation = `A=${a}, B=${b}; difference = ${diff}.`;
    } else if (v === 11) {
      topic = "Number System (LCM/HCF)";
      const x = 12 + (seed % 5) * 2;
      const y = 18 + (seed % 4) * 3;
      const z = 24 + (seed % 3) * 4;
      const L = lcm(lcm(x, y), z);
      const bells = L; // simultaneous
      stem = `Three bells toll at intervals of ${x}, ${y} and ${z} minutes. If they toll together at 8:00 am, when will they next toll together?`;
      const h = Math.floor(bells / 60);
      const m = bells % 60;
      const time = `8:${String(m).padStart(2, "0")} am`.replace(
        /^8:/,
        h === 0 ? "8:" : `${8 + h}:`,
      );
      // cleaner: minutes from 8:00
      const absM = 8 * 60 + bells;
      const hh = Math.floor(absM / 60) % 12 || 12;
      const mm = absM % 60;
      const nice = `${hh}:${String(mm).padStart(2, "0")} am`;
      answer = nice;
      wrongs = [
        `8:${String((m + 10) % 60).padStart(2, "0")} am`,
        `${hh}:${String((mm + 15) % 60).padStart(2, "0")} am`,
        `9:00 am`,
      ];
      explanation = `LCM(${x},${y},${z}) = ${L} min after 8:00 ⇒ ${nice}.`;
      void time;
    } else if (v === 12) {
      topic = "Profit and Loss (Multi-step)";
      const cp = 400 + (seed % 6) * 50;
      const gain1 = 20 + (seed % 5);
      const loss2 = 10 + (seed % 4);
      // sold at gain then bought back conceptually: overall %
      // SP1 = cp(1+g/100); if sold at loss2 on SP as new: overall from original
      const sp = round2(cp * (1 + gain1 / 100) * (1 - loss2 / 100));
      const overall = round2(((sp - cp) / cp) * 100);
      stem = `An article of CP Rs. ${cp} is sold at ${gain1}% profit. If the selling price is later reduced by ${loss2}% of that SP (rebate), effective overall profit/loss % on CP is:`;
      answer = `${overall}%`;
      wrongs = [`${gain1 - loss2}%`, `${gain1}%`, `${-loss2}%`];
      explanation = `Final SP = ${sp}; overall = ${overall}% on CP.`;
    } else {
      topic = "Mensuration (Cylinder/Cone)";
      const r = 7;
      const h = 10 + (seed % 6);
      // volume of cylinder πr²h; use 22/7
      const vol = round2((22 / 7) * r * r * h);
      stem = `Volume of a cylinder with radius 7 cm and height ${h} cm is (take π = 22/7):`;
      answer = `${vol} cm³`;
      wrongs = [`${round2(2 * 22 * r * h)} cm³`, `${r * r * h} cm³`, `${vol + 154} cm³`];
      explanation = `V = πr²h = (22/7)×49×${h} = ${vol} cm³.`;
    }

    out.push(
      makeQ({
        qIndex: n,
        sectionKey,
        subject,
        topic,
        difficulty,
        stemEn: stem,
        answer,
        wrongs,
        explanation,
        marks,
        negativeMarks: negative,
        source,
      }),
    );
  }
  return out;
}

/* ========================= REASONING BANK (40+) ========================= */

const REASONING_BANK: RawQ[] = [
  {
    topic: "Coding-Decoding",
    stem: "In a certain code, PLANET is written as QMBOFU and EARTH is written as FBSUI. How is MOON written?",
    answer: "NPPO",
    wrongs: ["NPON", "NNOP", "OPPN"],
    explanation: "Each letter +1: M→N, O→P, O→P, N→O.",
  },
  {
    topic: "Coding-Decoding",
    stem: "If in a code, ‘234’ means ‘you are good’, ‘136’ means ‘we are bad’, ‘458’ means ‘good and bad’, then which digit means ‘good’?",
    answer: "4",
    wrongs: ["2", "3", "8"],
    explanation: "Common code between ‘you are good’ and ‘good and bad’ for ‘good’ is 4.",
  },
  {
    topic: "Coding-Decoding",
    stem: "If each letter’s position is taken (A=1…Z=26) and RING → 18+9+14+7=48 coded as 48+11=59, TIME → 20+9+13+5=47→56, how is NOTE coded?",
    answer: "54",
    wrongs: ["58", "49", "62"],
    explanation: "NOTE = 14+15+20+5 = 54; here the code equals the positional sum.",
  },
  {
    topic: "Input-Output",
    stem: "Input: 54 17 92 33 61. Step I sorts odds ascending then evens ascending left to right. Step I is:",
    answer: "17 33 54 61 92",
    wrongs: ["17 33 61 54 92", "54 17 33 61 92", "17 54 33 61 92"],
    explanation: "Odds 17,33 then evens 54,61,92.",
  },
  {
    topic: "Input-Output",
    stem: "A machine rearranges: Input ‘sky blue dark night cold’. Step1: words in alphabetical order. Output of Step1?",
    answer: "blue cold dark night sky",
    wrongs: ["sky night dark cold blue", "blue dark cold night sky", "cold blue dark night sky"],
    explanation: "Alphabetical: blue, cold, dark, night, sky.",
  },
  {
    topic: "Circular Seating",
    stem: "Six friends A,B,C,D,E,F sit around a circle facing centre. A is between D and B; F is between E and C; E is to immediate left of D. Who is opposite A?",
    answer: "C",
    wrongs: ["E", "F", "B"],
    explanation: "Arrangement yields C opposite A.",
  },
  {
    topic: "Linear Seating",
    stem: "Five persons P,Q,R,S,T sit in a row facing north. Q sits second to the right of P. S sits at an extreme end. R sits between Q and T. Who sits in the middle?",
    answer: "Q",
    wrongs: ["R", "P", "T"],
    explanation: "Valid order S-P-Q-R-T (or mirror); middle is Q.",
  },
  {
    topic: "Blood Relation",
    stem: "A is B’s brother. C is A’s mother. D is C’s father. E is B’s son. How is D related to E?",
    answer: "Great-grandfather",
    wrongs: ["Grandfather", "Father", "Uncle"],
    explanation: "D→C→A/B→E; D is great-grandfather of E.",
  },
  {
    topic: "Blood Relation",
    stem: "Pointing to a photograph, Rohan said, “She is the daughter of my grandfather’s only son.” How is the girl related to Rohan?",
    answer: "Sister",
    wrongs: ["Cousin", "Mother", "Aunt"],
    explanation: "Grandfather’s only son is Rohan’s father; his daughter is sister.",
  },
  {
    topic: "Syllogism",
    stem: "Statements: All books are pens. Some pens are erasers. Conclusions: I. Some books are erasers. II. Some erasers are pens. Which follow?",
    answer: "Only II",
    wrongs: ["Only I", "Both I and II", "Neither"],
    explanation: "I is not definite; II follows from ‘some pens are erasers’.",
  },
  {
    topic: "Syllogism (Possibility)",
    stem: "Statements: Some cats are dogs. All dogs are rats. Conclusions: I. All cats being rats is a possibility. II. Some rats are cats.",
    answer: "Both I and II follow",
    wrongs: ["Only I", "Only II", "Neither"],
    explanation: "Some cats→dogs→rats so some rats are cats; all cats as rats is possible.",
  },
  {
    topic: "Floor Puzzle",
    stem: "Eight floors (1 bottom–8 top). P lives on floor 4. Only two floors between P and Q. R lives immediately above Q. S lives on an odd-numbered floor above R. Who lives on floor 7?",
    answer: "S",
    wrongs: ["Q", "R", "P"],
    explanation: "Q on 1 or 7; R above Q rules out Q=7. With Q=1,R=2, S can be on odd floors 3/5/7 — so S can be on 7.",
  },
  {
    topic: "Scheduling",
    stem: "Seven meetings Mon–Sun. Finance on Wednesday. HR two days before Finance. Marketing immediately after HR. On which day is Marketing?",
    answer: "Tuesday",
    wrongs: ["Monday", "Thursday", "Friday"],
    explanation: "HR Monday; Marketing Tuesday; Finance Wednesday.",
  },
  {
    topic: "Direction Sense",
    stem: "A man walks 10 m south, turns left, walks 20 m, turns left, walks 10 m, then turns right and walks 5 m. How far and in which direction is he from start?",
    answer: "25 m East",
    wrongs: ["25 m West", "15 m East", "20 m North"],
    explanation: "Net: 20+5 = 25 m East.",
  },
  {
    topic: "Direction Sense",
    stem: "From a point, Ravi walks 12 km north, turns right 5 km, turns right 12 km, then left 3 km. Distance from start?",
    answer: "8 km",
    wrongs: ["5 km", "3 km", "15 km"],
    explanation: "Net displacement 5+3=8 km east.",
  },
  {
    topic: "Odd One Out",
    stem: "Find the odd one: 121, 144, 169, 196, 225, 256, 288",
    answer: "288",
    wrongs: ["256", "225", "196"],
    explanation: "Others are perfect squares; 288 is not.",
  },
  {
    topic: "Odd One Out",
    stem: "Odd one out: ACE, BDF, CEG, DGH, EGI",
    answer: "DGH",
    wrongs: ["ACE", "BDF", "EGI"],
    explanation: "Pattern skip-1 letters; DGH breaks (should be DFI).",
  },
  {
    topic: "Statement-Assumption",
    stem: "Statement: “Buy pure and natural honey of company X.” Assumptions: I. Artificial honey is available. II. No other company supplies pure honey. Which is implicit?",
    answer: "Only I",
    wrongs: ["Only II", "Both", "Neither"],
    explanation: "Ad contrasts purity ⇒ artificial exists; II is not necessary.",
  },
  {
    topic: "Statement-Assumption",
    stem: "Statement: “You should avail yourself of this opportunity.” Assumptions: I. Opportunity exists. II. One should not let opportunities go. Which?",
    answer: "Both I and II",
    wrongs: ["Only I", "Only II", "Neither"],
    explanation: "Advice presupposes opportunity and value of taking it.",
  },
  {
    topic: "Number Series",
    stem: "Find the wrong term: 3, 5, 12, 39, 154, 772, 4634",
    answer: "772",
    wrongs: ["154", "39", "4634"],
    explanation: "Pattern ×1+2, ×2+2, ×3+3, ×4+4, ×5+5…; 154×5+5=775 not 772.",
  },
  {
    topic: "Number Series",
    stem: "Next term: 7, 8, 18, 57, 228, ?",
    answer: "1165",
    wrongs: ["1160", "1125", "1200"],
    explanation: "×1+1, ×2+2, ×3+3, ×4+4, ×5+5 ⇒ 228×5+5=1165.",
  },
  {
    topic: "Letter Series",
    stem: "Next: AZ, CX, FU, ?",
    answer: "JQ",
    wrongs: ["IR", "KP", "IT"],
    explanation: "1st letters +2,+3,+4; 2nd −2,−3,−4 ⇒ J and Q.",
  },
  {
    topic: "Analogy",
    stem: "EDITOR : ROTIDE :: DOCTOR : ?",
    answer: "ROTCOD",
    wrongs: ["DOCROT", "TODROC", "CODTOR"],
    explanation: "Word reversed: EDITOR → ROTIDE; DOCTOR → ROTCOD.",
  },
  {
    topic: "Analogy",
    stem: "9 : 80 :: 100 : ?",
    answer: "9999",
    wrongs: ["901", "1000", "990"],
    explanation: "n²−1: 9²−1=80; 100²−1=9999.",
  },
  {
    topic: "Ranking",
    stem: "In a class of 45, A is 12th from top and B is 17th from bottom. How many are between A and B?",
    answer: "16",
    wrongs: ["15", "17", "18"],
    explanation: "B from top = 45−17+1=29; between = 29−12−1=16.",
  },
  {
    topic: "Calendar",
    stem: "If 15 August 2024 was Thursday, what day was 15 August 2025?",
    answer: "Friday",
    wrongs: ["Thursday", "Saturday", "Wednesday"],
    explanation: "2025 is not leap before Aug; +1 day ⇒ Friday.",
  },
  {
    topic: "Clock",
    stem: "At what time between 3 and 4 o’clock are the hands of a clock together?",
    answer: "16 4/11 min past 3",
    wrongs: ["15 min past 3", "16 min past 3", "17 1/11 min past 3"],
    explanation: "Together at M = (30H)/5.5 = 90/5.5 = 180/11 = 16 4/11.",
  },
  {
    topic: "Venn / Logical",
    stem: "Which diagram best represents: Doctors, Males, Females?",
    answer: "Two disjoint circles (Males, Females) overlapping a third (Doctors)",
    wrongs: ["Three concentric circles", "One circle only", "Three identical overlapping equally"],
    explanation: "Males/Females disjoint; Doctors intersect both.",
  },
  {
    topic: "Mirror Image",
    stem: "The left-right reverse (mirror order) of the word PREVAIL is:",
    answer: "LIAVERP",
    wrongs: ["PREVAIL", "LIAVREP", "PRELIAV"],
    explanation: "Vertical mirror reverses left-right letter order → LIAVERP.",
  },
  {
    topic: "Symbol Operation",
    stem: "If ‘P’ means ‘+’, ‘Q’ means ‘×’, ‘R’ means ‘÷’, ‘S’ means ‘−’, then 18 Q 3 P 6 S 4 R 2 = ?",
    answer: "58",
    wrongs: ["52", "60", "48"],
    explanation: "18×3 + 6 − 4÷2 = 54 + 6 − 2 = 58.",
  },
  {
    topic: "Inequality",
    stem: "P ≥ Q = R > S ≤ T. Which is true?",
    answer: "P > S",
    wrongs: ["Q < S", "T < R", "P = T"],
    explanation: "P≥Q=R>S ⇒ P>S definitely.",
  },
  {
    topic: "Data Sufficiency",
    stem: "What is the code for ‘sky’? (I) ‘sky is blue’ → ‘ka la pa’. (II) ‘blue sky clear’ → ‘pa na ka’. Codes for sky?",
    answer: "Either ka or pa (data insufficient to unique)",
    wrongs: ["ka only", "pa only", "na"],
    explanation: "Common words sky/blue → ka/pa; cannot uniquely fix sky.",
  },
  {
    topic: "Puzzle",
    stem: "A, B, C, D, E have different heights. A taller than B but shorter than C. D shorter than B. E taller than C. Who is tallest?",
    answer: "E",
    wrongs: ["C", "A", "B"],
    explanation: "E > C > A > B > D.",
  },
  {
    topic: "Course of Action",
    stem: "Statement: Many students failed in maths. Courses: I. Ban maths. II. Review teaching methods. Which?",
    answer: "Only II",
    wrongs: ["Only I", "Both", "Neither"],
    explanation: "Banning is absurd; reviewing teaching is logical.",
  },
  {
    topic: "Cause-Effect",
    stem: "I. Heavy rains flooded the city. II. Many flights were cancelled. Relation?",
    answer: "I is cause, II is effect",
    wrongs: ["II cause of I", "Independent", "Both effects of independent causes only"],
    explanation: "Floods lead to cancellations.",
  },
  {
    topic: "Sitting (Facing)",
    stem: "A,B,C,D sit facing north; E,F,G,H sit facing them south. A opposite E; C opposite G; B left of A. Who faces B?",
    answer: "F",
    wrongs: ["H", "E", "G"],
    explanation: "North row B-A-?-?; south F-E-?-G pattern with opposites ⇒ F faces B.",
  },
  {
    topic: "Alphabet",
    stem: "How many meaningful English words can be formed with 2nd, 4th, 6th, 8th letters of ‘COMPUTER’ using each once?",
    answer: "One (PORT)",
    wrongs: ["None", "Two", "Three"],
    explanation: "Letters O,P,T,R → PORT (one meaningful common word).",
  },
  {
    topic: "Coding Matrix",
    stem: "If A=26, B=25 … Z=1, then what is coding of ‘CAB’ as product of codes?",
    answer: "24×25×26",
    wrongs: ["1×2×3", "3×1×2", "26×25×24 as sum"],
    explanation: "C=24,A=26,B=25; product asked as 24×25×26.",
  },
  {
    topic: "Series Mixed",
    stem: "2, 3, 8, 27, 112, ?",
    answer: "565",
    wrongs: ["560", "455", "480"],
    explanation: "×1+1, ×2+2, ×3+3, ×4+4, ×5+5 ⇒ 112×5+5=565.",
  },
  {
    topic: "Syllogism",
    stem: "All keys are locks. All locks are screws. Some screws are nails. Conclusions: I. All keys are screws. II. Some nails are locks.",
    answer: "Only I",
    wrongs: ["Only II", "Both", "Neither"],
    explanation: "Keys⊂locks⊂screws ⇒ I true; II not definite.",
  },
  {
    topic: "Blood Relation",
    stem: "P is brother of Q. R is sister of Q. S is brother of T. T is daughter of Q. Who is uncle of T?",
    answer: "P",
    wrongs: ["R", "S", "Q"],
    explanation: "P is maternal/paternal uncle of T (brother of T’s parent Q).",
  },
  {
    topic: "Direction",
    stem: "A is 40 m south-west of B. C is 40 m south-east of B. Then C is in which direction of A?",
    answer: "East",
    wrongs: ["West", "North", "South"],
    explanation: "A SW, C SE of B ⇒ C is east of A.",
  },
  {
    topic: "Puzzle Lite",
    stem: "Five books stacked. History below Maths. English above Maths. Science between English and Maths. Geography at bottom. Which is on top?",
    answer: "English",
    wrongs: ["Maths", "Science", "History"],
    explanation: "Top→English, Science, Maths, History, Geography.",
  },
];

/* ========================= GA BANK (50+) ========================= */

const GA_BANK: RawQ[] = [
  {
    topic: "Polity",
    stem: "Which Article of the Constitution deals with the amendment procedure?",
    answer: "Article 368",
    wrongs: ["Article 352", "Article 356", "Article 360"],
    explanation: "Article 368 provides for constitutional amendment.",
  },
  {
    topic: "Polity",
    stem: "The Ninth Schedule was added by which Constitutional Amendment?",
    answer: "1st Amendment",
    wrongs: ["42nd Amendment", "44th Amendment", "7th Amendment"],
    explanation: "First Amendment (1951) added Ninth Schedule.",
  },
  {
    topic: "Polity",
    stem: "Which Schedule of the Constitution lists the forms of oaths and affirmations?",
    answer: "Third Schedule",
    wrongs: ["Second Schedule", "Fourth Schedule", "Fifth Schedule"],
    explanation: "Third Schedule contains oaths/affirmations.",
  },
  {
    topic: "Polity",
    stem: "Article 280 of the Constitution is related to:",
    answer: "Finance Commission",
    wrongs: ["Election Commission", "UPSC", "CAG"],
    explanation: "Article 280 constitutes the Finance Commission.",
  },
  {
    topic: "Polity",
    stem: "Fundamental Duties were added by which Amendment?",
    answer: "42nd Amendment",
    wrongs: ["44th Amendment", "52nd Amendment", "61st Amendment"],
    explanation: "42nd Amendment (1976) added Part IVA / Article 51A.",
  },
  {
    topic: "Polity",
    stem: "Which Article guarantees protection of life and personal liberty?",
    answer: "Article 21",
    wrongs: ["Article 19", "Article 14", "Article 32"],
    explanation: "Article 21: protection of life and personal liberty.",
  },
  {
    topic: "History",
    stem: "The Indian National Congress session of 1929 (Lahore) is famous for:",
    answer: "Purna Swaraj resolution",
    wrongs: ["Non-Cooperation launch", "Quit India", "Lucknow Pact"],
    explanation: "Lahore 1929 under Nehru adopted Purna Swaraj.",
  },
  {
    topic: "History",
    stem: "The Rowlatt Act was passed in which year?",
    answer: "1919",
    wrongs: ["1917", "1920", "1915"],
    explanation: "Rowlatt Act, 1919.",
  },
  {
    topic: "History",
    stem: "Who founded the Forward Bloc in 1939?",
    answer: "Subhas Chandra Bose",
    wrongs: ["Jawaharlal Nehru", "Sardar Patel", "C.R. Das"],
    explanation: "Bose founded Forward Bloc after resigning Congress presidency.",
  },
  {
    topic: "History",
    stem: "The Vernacular Press Act was enacted during the tenure of:",
    answer: "Lord Lytton",
    wrongs: ["Lord Curzon", "Lord Ripon", "Lord Dalhousie"],
    explanation: "Vernacular Press Act, 1878 under Lytton.",
  },
  {
    topic: "History",
    stem: "Ilbert Bill controversy is associated with:",
    answer: "Lord Ripon",
    wrongs: ["Lord Lytton", "Lord Mayo", "Lord Canning"],
    explanation: "Ilbert Bill (1883) under Ripon.",
  },
  {
    topic: "Geography",
    stem: "Which river is known as the ‘Sorrow of Bihar’?",
    answer: "Kosi",
    wrongs: ["Gandak", "Son", "Ghaghara"],
    explanation: "Kosi’s floods earned it that name.",
  },
  {
    topic: "Geography",
    stem: "Black cotton soil (regur) is predominantly found in:",
    answer: "Deccan Plateau",
    wrongs: ["Indo-Gangetic plain", "Thar Desert", "Eastern Ghats only"],
    explanation: "Regur soils of lava Deccan region.",
  },
  {
    topic: "Geography",
    stem: "Which pass connects Srinagar with Leh?",
    answer: "Zoji La",
    wrongs: ["Nathu La", "Rohtang", "Shipki La"],
    explanation: "Zoji La links Kashmir valley with Ladakh.",
  },
  {
    topic: "Geography",
    stem: "The Tropic of Cancer does NOT pass through:",
    answer: "Odisha",
    wrongs: ["Jharkhand", "West Bengal", "Tripura"],
    explanation: "It passes through 8 states; Odisha is not one.",
  },
  {
    topic: "Geography",
    stem: "Which mineral is primarily mined at Jaduguda?",
    answer: "Uranium",
    wrongs: ["Copper", "Mica", "Coal"],
    explanation: "Jaduguda (Jharkhand) is a uranium mine.",
  },
  {
    topic: "Geography",
    stem: "Western Disturbances affecting north India originate over:",
    answer: "Mediterranean Sea",
    wrongs: ["Bay of Bengal", "Arabian Sea", "Caspian only"],
    explanation: "Mid-latitude western disturbances from Mediterranean/West Asia.",
  },
  {
    topic: "Economy",
    stem: "The Monetary Policy Committee (MPC) of RBI has how many members?",
    answer: "6",
    wrongs: ["5", "7", "4"],
    explanation: "MPC has 6 members (3 RBI + 3 external).",
  },
  {
    topic: "Economy",
    stem: "Repo rate is the rate at which:",
    answer: "RBI lends to commercial banks against securities",
    wrongs: ["Banks lend to RBI", "RBI borrows from IMF", "Banks lend to public"],
    explanation: "Repo: RBI’s short-term lending rate to banks.",
  },
  {
    topic: "Economy",
    stem: "GST was implemented in India from:",
    answer: "1 July 2017",
    wrongs: ["1 April 2017", "1 July 2016", "1 January 2018"],
    explanation: "GST came into force on 1 July 2017.",
  },
  {
    topic: "Economy",
    stem: "Which body prepares the Economic Survey of India?",
    answer: "Department of Economic Affairs, Ministry of Finance",
    wrongs: ["NITI Aayog alone", "RBI", "CSO only"],
    explanation: "Economic Survey is presented by Finance Ministry (DEA).",
  },
  {
    topic: "Economy",
    stem: "MGNREGA guarantees how many days of wage employment in a financial year?",
    answer: "100 days",
    wrongs: ["150 days", "200 days", "50 days"],
    explanation: "MGNREGA provides up to 100 days.",
  },
  {
    topic: "Science",
    stem: "The SI unit of luminous intensity is:",
    answer: "Candela",
    wrongs: ["Lumen", "Lux", "Watt"],
    explanation: "Candela (cd) is SI base unit of luminous intensity.",
  },
  {
    topic: "Science",
    stem: "Which gas is the major component of biogas?",
    answer: "Methane",
    wrongs: ["Ethane", "Propane", "Butane"],
    explanation: "Biogas is mainly methane (CH₄).",
  },
  {
    topic: "Science",
    stem: "pH of a neutral solution at 25°C is:",
    answer: "7",
    wrongs: ["0", "14", "1"],
    explanation: "Neutral water pH = 7 at 25°C.",
  },
  {
    topic: "Science",
    stem: "Which vitamin deficiency causes night blindness?",
    answer: "Vitamin A",
    wrongs: ["Vitamin C", "Vitamin D", "Vitamin K"],
    explanation: "Vitamin A deficiency → nyctalopia.",
  },
  {
    topic: "Science",
    stem: "Newton’s third law relates to:",
    answer: "Action and reaction",
    wrongs: ["Inertia", "Acceleration proportional to force", "Gravitation only"],
    explanation: "Third law: equal and opposite action-reaction.",
  },
  {
    topic: "Science",
    stem: "The chemical formula of washing soda is:",
    answer: "Na₂CO₃·10H₂O",
    wrongs: ["NaHCO₃", "NaOH", "CaOCl₂"],
    explanation: "Washing soda is sodium carbonate decahydrate.",
  },
  {
    topic: "Awards",
    stem: "The first Indian to receive the Nobel Prize in Literature was:",
    answer: "Rabindranath Tagore",
    wrongs: ["C.V. Raman", "Amartya Sen", "Mother Teresa"],
    explanation: "Tagore, Nobel Literature 1913.",
  },
  {
    topic: "Awards",
    stem: "Bharat Ratna was instituted in which year?",
    answer: "1954",
    wrongs: ["1950", "1947", "1960"],
    explanation: "Bharat Ratna instituted in 1954.",
  },
  {
    topic: "Books",
    stem: "‘Discovery of India’ was written by:",
    answer: "Jawaharlal Nehru",
    wrongs: ["Mahatma Gandhi", "S. Radhakrishnan", "B.R. Ambedkar"],
    explanation: "Nehru wrote The Discovery of India.",
  },
  {
    topic: "Books",
    stem: "‘Annihilation of Caste’ is authored by:",
    answer: "B.R. Ambedkar",
    wrongs: ["Periyar", "Jyotirao Phule", "Gandhi"],
    explanation: "Ambedkar’s Annihilation of Caste.",
  },
  {
    topic: "National Parks",
    stem: "Kaziranga National Park is famous for:",
    answer: "One-horned rhinoceros",
    wrongs: ["Asiatic lion", "Snow leopard", "Hangul"],
    explanation: "Kaziranga (Assam) — one-horned rhino.",
  },
  {
    topic: "National Parks",
    stem: "Jim Corbett National Park is in:",
    answer: "Uttarakhand",
    wrongs: ["Himachal Pradesh", "Rajasthan", "Madhya Pradesh"],
    explanation: "Corbett NP is in Uttarakhand.",
  },
  {
    topic: "National Parks",
    stem: "Gir National Park is the only natural habitat of:",
    answer: "Asiatic lion",
    wrongs: ["Bengal tiger", "Indian leopard only", "Cheetah"],
    explanation: "Asiatic lions in Gir, Gujarat.",
  },
  {
    topic: "Polity",
    stem: "The maximum gap between two sessions of Parliament cannot exceed:",
    answer: "Six months",
    wrongs: ["Three months", "Four months", "One year"],
    explanation: "Article 85 — gap ≤ six months.",
  },
  {
    topic: "Polity",
    stem: "Who administers the oath of office to the President of India?",
    answer: "Chief Justice of India",
    wrongs: ["Vice-President", "Speaker", "Prime Minister"],
    explanation: "CJI (or senior-most SC judge) administers oath.",
  },
  {
    topic: "History",
    stem: "The Doctrine of Lapse is associated with:",
    answer: "Lord Dalhousie",
    wrongs: ["Lord Wellesley", "Lord Curzon", "Lord Cornwallis"],
    explanation: "Dalhousie’s Doctrine of Lapse.",
  },
  {
    topic: "History",
    stem: "Partition of Bengal was annulled in:",
    answer: "1911",
    wrongs: ["1905", "1919", "1909"],
    explanation: "Annulled in 1911; capital shifted to Delhi.",
  },
  {
    topic: "Geography",
    stem: "Which is the highest peak in peninsular India?",
    answer: "Anamudi",
    wrongs: ["Doddabetta", "Mahendragiri", "Guru Shikhar"],
    explanation: "Anamudi (Western Ghats, Kerala) is highest in peninsula.",
  },
  {
    topic: "Geography",
    stem: "Chilika Lake is located in:",
    answer: "Odisha",
    wrongs: ["West Bengal", "Andhra Pradesh", "Tamil Nadu"],
    explanation: "Chilika is in Odisha.",
  },
  {
    topic: "Economy",
    stem: "Which of the following is a capital receipts item in the Union Budget?",
    answer: "Recovery of loans",
    wrongs: ["Interest payments", "Subsidies", "Salaries"],
    explanation: "Loan recoveries are capital receipts; others are revenue expenditure.",
  },
  {
    topic: "Science",
    stem: "Which blood group is called the universal donor?",
    answer: "O negative",
    wrongs: ["AB positive", "A positive", "B negative"],
    explanation: "O− red cells lack A/B/Rh antigens for general donation context.",
  },
  {
    topic: "Science",
    stem: "The powerhouse of the cell is:",
    answer: "Mitochondria",
    wrongs: ["Ribosome", "Nucleus", "Golgi apparatus"],
    explanation: "Mitochondria produce ATP.",
  },
  {
    topic: "Current / Institutions",
    stem: "Headquarters of the International Court of Justice is at:",
    answer: "The Hague",
    wrongs: ["Geneva", "New York", "Vienna"],
    explanation: "ICJ sits at The Hague, Netherlands.",
  },
  {
    topic: "Culture",
    stem: "Sattriya is a classical dance of:",
    answer: "Assam",
    wrongs: ["Odisha", "Manipur", "West Bengal"],
    explanation: "Sattriya — Assam.",
  },
  {
    topic: "Polity",
    stem: "Concurrent List is in which Schedule?",
    answer: "Seventh Schedule",
    wrongs: ["Sixth Schedule", "Eighth Schedule", "Ninth Schedule"],
    explanation: "Seventh Schedule: Union, State, Concurrent lists.",
  },
  {
    topic: "Economy",
    stem: "FRBM Act is primarily related to:",
    answer: "Fiscal discipline / deficit targets",
    wrongs: ["Foreign trade only", "Banking licenses", "SEBI takeovers"],
    explanation: "Fiscal Responsibility and Budget Management Act.",
  },
  {
    topic: "History",
    stem: "Chauri Chaura incident led Gandhi to withdraw:",
    answer: "Non-Cooperation Movement",
    wrongs: ["Civil Disobedience", "Quit India", "Khilafat only"],
    explanation: "After Chauri Chaura (1922), NCM withdrawn.",
  },
  {
    topic: "Geography",
    stem: "Duncan Passage lies between:",
    answer: "South Andaman and Little Andaman",
    wrongs: ["India and Sri Lanka", "Lakshadweep islands", "Nicobar and Sumatra"],
    explanation: "Duncan Passage separates South & Little Andaman.",
  },
];

/* ========================= ENGLISH BANK (45+) ========================= */

const ENG_BANK: RawQ[] = [
  {
    topic: "Error Spotting",
    stem: "Find the error: The committee / have decided / to postpone / the meeting.",
    answer: "have decided",
    wrongs: ["The committee", "to postpone", "No error"],
    explanation: "Collective noun as unit → has decided.",
  },
  {
    topic: "Error Spotting",
    stem: "Find the error: Neither of the two boys / have submitted / their assignments / on time.",
    answer: "have submitted",
    wrongs: ["Neither of the two boys", "their assignments", "on time"],
    explanation: "Neither → singular verb ‘has’.",
  },
  {
    topic: "Error Spotting",
    stem: "Find the error: She is / senior than / all her colleagues / in the office.",
    answer: "senior than",
    wrongs: ["She is", "all her colleagues", "No error"],
    explanation: "Use ‘senior to’, not ‘than’.",
  },
  {
    topic: "Error Spotting",
    stem: "Find the error: He congratulated me / for my success / in the examination / No error.",
    answer: "for my success",
    wrongs: ["He congratulated me", "in the examination", "No error"],
    explanation: "Congratulate on (not for) success.",
  },
  {
    topic: "Error Spotting",
    stem: "Find the error: The news / are true / beyond doubt / No error.",
    answer: "are true",
    wrongs: ["The news", "beyond doubt", "No error"],
    explanation: "News is singular → is true.",
  },
  {
    topic: "Sentence Improvement",
    stem: "Improve: He is enough tall to touch the ceiling.",
    answer: "tall enough",
    wrongs: ["enough taller", "taller enough", "No improvement"],
    explanation: "Adjective + enough.",
  },
  {
    topic: "Sentence Improvement",
    stem: "Improve: Scarcely had he left than the phone rang.",
    answer: "when the phone rang",
    wrongs: ["then the phone rang", "as the phone rang", "No improvement"],
    explanation: "Scarcely/hardly … when (not than).",
  },
  {
    topic: "Sentence Improvement",
    stem: "Improve: The teacher asked the student that why he was late.",
    answer: "why he was late",
    wrongs: ["that why was he late", "why was he late", "No improvement"],
    explanation: "No ‘that’ before wh-clause; assertive order.",
  },
  {
    topic: "Idioms",
    stem: "‘To throw in the towel’ means:",
    answer: "To admit defeat",
    wrongs: ["To start a fight", "To clean up", "To celebrate"],
    explanation: "Boxing idiom for surrender/defeat.",
  },
  {
    topic: "Idioms",
    stem: "‘Burn the midnight oil’ means:",
    answer: "Work late into the night",
    wrongs: ["Waste fuel", "Sleep early", "Party at night"],
    explanation: "Study/work late at night.",
  },
  {
    topic: "Idioms",
    stem: "‘A storm in a teacup’ means:",
    answer: "A big fuss over a trivial matter",
    wrongs: ["A natural disaster", "A tea party", "Sudden success"],
    explanation: "Exaggerated fuss about little.",
  },
  {
    topic: "One Word",
    stem: "A person who hates mankind:",
    answer: "Misanthrope",
    wrongs: ["Philanthropist", "Misogynist", "Optimist"],
    explanation: "Misanthrope = hater of mankind.",
  },
  {
    topic: "One Word",
    stem: "Government by the wealthy:",
    answer: "Plutocracy",
    wrongs: ["Autocracy", "Theocracy", "Bureaucracy"],
    explanation: "Plutocracy = rule by the rich.",
  },
  {
    topic: "One Word",
    stem: "One who is present everywhere:",
    answer: "Omnipresent",
    wrongs: ["Omniscient", "Omnipotent", "Invisible"],
    explanation: "Omnipresent = ubiquitous.",
  },
  {
    topic: "Cloze",
    stem: "The manager insisted that the report _____ submitted by Monday.",
    answer: "be",
    wrongs: ["is", "was", "were"],
    explanation: "Subjunctive after insist: be submitted.",
  },
  {
    topic: "Cloze",
    stem: "Hardly _____ the train arrived when it started raining.",
    answer: "had",
    wrongs: ["has", "did", "was"],
    explanation: "Hardly had + V3 … when.",
  },
  {
    topic: "Cloze",
    stem: "She is accustomed _____ working long hours.",
    answer: "to",
    wrongs: ["with", "for", "by"],
    explanation: "Accustomed to + -ing.",
  },
  {
    topic: "Voice",
    stem: "Passive of: “Who wrote this novel?”",
    answer: "By whom was this novel written?",
    wrongs: [
      "Who was this novel written?",
      "By who was this novel written?",
      "This novel written by whom?",
    ],
    explanation: "Interrogative passive: By whom + was + V3.",
  },
  {
    topic: "Voice",
    stem: "Active of: “The work will have been finished by them.”",
    answer: "They will have finished the work.",
    wrongs: [
      "They will finish the work.",
      "They have finished the work.",
      "They finished the work.",
    ],
    explanation: "Future perfect passive → future perfect active.",
  },
  {
    topic: "Narration",
    stem: "He said, “I have been waiting since morning.” (Indirect)",
    answer: "He said that he had been waiting since morning.",
    wrongs: [
      "He said that he has been waiting since morning.",
      "He said that I had been waiting since morning.",
      "He told that he was waiting since morning.",
    ],
    explanation: "Present perfect continuous → past perfect continuous.",
  },
  {
    topic: "Narration",
    stem: "She said to me, “Do you know the way?” (Indirect)",
    answer: "She asked me if I knew the way.",
    wrongs: [
      "She asked me do I know the way.",
      "She told me if I knew the way.",
      "She asked me that I knew the way.",
    ],
    explanation: "Yes/no question → if/whether + past.",
  },
  {
    topic: "Para Jumble",
    stem: "Arrange: (P) but also builds character (Q) Education not only (R) informs the mind (S) of a person. Correct order:",
    answer: "QRPS",
    wrongs: ["QPRS", "PQRS", "RQPS"],
    explanation: "Q–R–P–S: Education not only informs… but also builds… of a person.",
  },
  {
    topic: "Para Jumble",
    stem: "(A) The storm caused havoc (B) and uprooted trees (C) across the coastal town (D) last night. Best order:",
    answer: "ADCB",
    wrongs: ["ABCD", "ACBD", "DACB"],
    explanation: "The storm caused havoc last night across… and uprooted trees.",
  },
  {
    topic: "Synonyms",
    stem: "Synonym of EPHEMERAL:",
    answer: "Transient",
    wrongs: ["Eternal", "Immense", "Rigid"],
    explanation: "Ephemeral = short-lived / transient.",
  },
  {
    topic: "Synonyms",
    stem: "Synonym of OBFUSCATE:",
    answer: "Confuse",
    wrongs: ["Clarify", "Illuminate", "Simplify"],
    explanation: "Obfuscate = make unclear / confuse.",
  },
  {
    topic: "Synonyms",
    stem: "Synonym of PROLIFIC:",
    answer: "Productive",
    wrongs: ["Barren", "Scarce", "Lazy"],
    explanation: "Prolific = abundantly productive.",
  },
  {
    topic: "Antonyms",
    stem: "Antonym of BENEVOLENT:",
    answer: "Malevolent",
    wrongs: ["Kind", "Generous", "Amiable"],
    explanation: "Benevolent ↔ malevolent.",
  },
  {
    topic: "Antonyms",
    stem: "Antonym of EXONERATE:",
    answer: "Incriminate",
    wrongs: ["Absolve", "Acquit", "Pardon"],
    explanation: "Exonerate = clear of blame; opposite incriminate.",
  },
  {
    topic: "Antonyms",
    stem: "Antonym of PAUCITY:",
    answer: "Abundance",
    wrongs: ["Scarcity", "Dearth", "Lack"],
    explanation: "Paucity = scarcity; antonym abundance.",
  },
  {
    topic: "Spelling",
    stem: "Correct spelling:",
    answer: "Miscellaneous",
    wrongs: ["Miscelaneous", "Miscellanous", "Misellaneous"],
    explanation: "Miscellaneous — double l, neo.",
  },
  {
    topic: "Spelling",
    stem: "Correct spelling:",
    answer: "Embarrassment",
    wrongs: ["Embarrasment", "Embarassment", "Embaresment"],
    explanation: "Embarrassment — double r, double s.",
  },
  {
    topic: "Fillers",
    stem: "He is _____ honest man than his brother.",
    answer: "a more",
    wrongs: ["more an", "an more", "the more"],
    explanation: "Comparative with article: a more honest man.",
  },
  {
    topic: "Fillers",
    stem: "No sooner did the bell ring _____ the students rushed out.",
    answer: "than",
    wrongs: ["when", "then", "as"],
    explanation: "No sooner … than.",
  },
  {
    topic: "Phrase Replacement",
    stem: "Select best replacement: He is good in English.",
    answer: "good at English",
    wrongs: ["good on English", "good with English only", "No improvement"],
    explanation: "Good at a subject.",
  },
  {
    topic: "Idioms",
    stem: "‘Take with a grain of salt’ means:",
    answer: "View with scepticism",
    wrongs: ["Eat salted food", "Accept blindly", "Ignore completely"],
    explanation: "Don’t accept as fully true.",
  },
  {
    topic: "One Word",
    stem: "A speech made without preparation:",
    answer: "Extempore",
    wrongs: ["Debate", "Rhetoric", "Soliloquy"],
    explanation: "Extempore / impromptu speech.",
  },
  {
    topic: "Error Spotting",
    stem: "Error: One of my friend / has gone / to Canada / No error.",
    answer: "One of my friend",
    wrongs: ["has gone", "to Canada", "No error"],
    explanation: "One of + plural: friends.",
  },
  {
    topic: "Voice",
    stem: "Passive: “People say that he is a spy.”",
    answer: "He is said to be a spy.",
    wrongs: [
      "He is said that he is a spy.",
      "It is said him to be a spy.",
      "He says to be a spy.",
    ],
    explanation: "Complex passive: He is said to be…",
  },
  {
    topic: "Cloze",
    stem: "The project was completed _____ schedule.",
    answer: "ahead of",
    wrongs: ["ahead on", "before of", "prior than"],
    explanation: "Ahead of schedule.",
  },
  {
    topic: "Synonyms",
    stem: "Synonym of CENSURE:",
    answer: "Criticize",
    wrongs: ["Praise", "Approve", "Commend"],
    explanation: "Censure = strong criticism.",
  },
  {
    topic: "Antonyms",
    stem: "Antonym of SPURIOUS:",
    answer: "Genuine",
    wrongs: ["Fake", "Counterfeit", "False"],
    explanation: "Spurious = not genuine.",
  },
  {
    topic: "Para Jumble",
    stem: "S1: Pollution is a serious problem. P: Industries dump waste. Q: Vehicles emit smoke. R: Strict laws are needed. S: Citizens must cooperate. S6: Only then can cities breathe. Best order of P QRS:",
    answer: "PQRS",
    wrongs: ["QPSR", "PRQS", "SPQR"],
    explanation: "Causes (P,Q) then remedies (R,S).",
  },
  {
    topic: "Narration",
    stem: "Ram said, “Alas! I am undone.” (Indirect)",
    answer: "Ram exclaimed with sorrow that he was undone.",
    wrongs: [
      "Ram said that alas he is undone.",
      "Ram told that he was undone.",
      "Ram exclaimed that I was undone.",
    ],
    explanation: "Exclamatory sorrow → exclaimed with sorrow + past.",
  },
  {
    topic: "Sentence Improvement",
    stem: "Improve: Unless you do not work hard, you will fail.",
    answer: "Unless you work hard",
    wrongs: ["If you do not work hard not", "Unless you will work hard", "No improvement"],
    explanation: "Unless already negative — drop ‘do not’.",
  },
  {
    topic: "Error Spotting",
    stem: "Error: The teacher / as well as the students / were present / No error.",
    answer: "were present",
    wrongs: ["The teacher", "as well as the students", "No error"],
    explanation: "Verb agrees with first subject → was present.",
  },
];

/* ========================= COMPUTER BANK (25+) ========================= */

const COMPUTER_BANK: RawQ[] = [
  {
    topic: "Basics",
    stem: "Which of the following is NOT an example of system software?",
    answer: "MS Excel",
    wrongs: ["Operating system", "Device driver", "Compiler"],
    explanation: "MS Excel is application software.",
  },
  {
    topic: "Memory",
    stem: "Cache memory is:",
    answer: "Faster than RAM and closer to CPU",
    wrongs: ["Slower than secondary storage", "Same as ROM", "Only used in printers"],
    explanation: "Cache sits between CPU and RAM for speed.",
  },
  {
    topic: "Number System",
    stem: "Binary of decimal 25 is:",
    answer: "11001",
    wrongs: ["10101", "11101", "10011"],
    explanation: "16+8+1 = 25 ⇒ 11001.",
  },
  {
    topic: "Networking",
    stem: "Which layer of OSI model is responsible for routing?",
    answer: "Network layer",
    wrongs: ["Data link", "Transport", "Session"],
    explanation: "Network layer (Layer 3) handles routing.",
  },
  {
    topic: "Networking",
    stem: "IPv4 address is of how many bits?",
    answer: "32",
    wrongs: ["64", "128", "16"],
    explanation: "IPv4 = 32-bit; IPv6 = 128-bit.",
  },
  {
    topic: "OS",
    stem: "Thrashing in an OS refers to:",
    answer: "Excessive paging reducing CPU efficiency",
    wrongs: ["Disk formatting", "Virus attack", "Cache hit"],
    explanation: "Thrashing = too much page swapping.",
  },
  {
    topic: "DBMS",
    stem: "In DBMS, a primary key:",
    answer: "Uniquely identifies each record and cannot be NULL",
    wrongs: ["Can have duplicates", "Is always foreign", "Stores images only"],
    explanation: "Primary key unique + NOT NULL.",
  },
  {
    topic: "MS Office",
    stem: "In Excel, which function returns the largest value?",
    answer: "MAX",
    wrongs: ["LARGEST", "TOP", "HIGH"],
    explanation: "MAX(range) returns maximum.",
  },
  {
    topic: "MS Office",
    stem: "Shortcut to insert a new slide in PowerPoint is:",
    answer: "Ctrl + M",
    wrongs: ["Ctrl + N", "Ctrl + S", "Ctrl + D"],
    explanation: "Ctrl+M inserts new slide.",
  },
  {
    topic: "Security",
    stem: "A phishing attack typically aims to:",
    answer: "Steal sensitive information via deceptive messages",
    wrongs: ["Speed up CPU", "Defragment disk", "Compile code"],
    explanation: "Phishing deceives users to reveal data.",
  },
  {
    topic: "Internet",
    stem: "DNS translates:",
    answer: "Domain names to IP addresses",
    wrongs: ["IP to MAC only", "Files to folders", "HTML to XML"],
    explanation: "Domain Name System resolves names→IP.",
  },
  {
    topic: "Hardware",
    stem: "Which is an optical storage device?",
    answer: "DVD",
    wrongs: ["RAM", "SSD (NAND flash)", "Pendrive (USB flash)"],
    explanation: "DVD uses optical laser reading.",
  },
  {
    topic: "Programming",
    stem: "HTML is primarily a:",
    answer: "Markup language",
    wrongs: ["Programming language like C", "Database", "Operating system"],
    explanation: "HTML = HyperText Markup Language.",
  },
  {
    topic: "Shortcuts",
    stem: "Ctrl + Shift + Esc opens:",
    answer: "Task Manager (Windows)",
    wrongs: ["File Explorer", "Control Panel", "Notepad"],
    explanation: "Direct Task Manager shortcut.",
  },
  {
    topic: "Memory",
    stem: "1 nibble equals:",
    answer: "4 bits",
    wrongs: ["8 bits", "2 bits", "16 bits"],
    explanation: "Nibble = 4 bits; byte = 8 bits.",
  },
  {
    topic: "Networking",
    stem: "HTTPS uses which default port?",
    answer: "443",
    wrongs: ["80", "21", "25"],
    explanation: "HTTPS → 443; HTTP → 80.",
  },
  {
    topic: "OS",
    stem: "Virtual memory is:",
    answer: "A memory management technique using disk as extension of RAM",
    wrongs: ["Only ROM chip", "Cache inside CPU only", "USB memory stick exclusively"],
    explanation: "Virtual memory pages to secondary storage.",
  },
  {
    topic: "Basics",
    stem: "The brain of the computer is:",
    answer: "CPU",
    wrongs: ["Monitor", "Keyboard", "Printer"],
    explanation: "CPU processes instructions.",
  },
  {
    topic: "MS Office",
    stem: "Mail Merge is a feature of:",
    answer: "MS Word",
    wrongs: ["MS Paint", "Notepad only", "Command Prompt"],
    explanation: "Mail Merge in Word for bulk letters.",
  },
  {
    topic: "Security",
    stem: "Firewall is used to:",
    answer: "Control network traffic based on security rules",
    wrongs: ["Cool the CPU", "Increase RAM", "Edit videos"],
    explanation: "Firewall filters inbound/outbound traffic.",
  },
  {
    topic: "Internet",
    stem: "FTP stands for:",
    answer: "File Transfer Protocol",
    wrongs: ["Fast Transfer Process", "File Transmit Program", "Folder Transfer Protocol"],
    explanation: "FTP = File Transfer Protocol.",
  },
  {
    topic: "Number System",
    stem: "Hexadecimal number FF in decimal is:",
    answer: "255",
    wrongs: ["256", "240", "127"],
    explanation: "F=15; 15×16+15=255.",
  },
  {
    topic: "DBMS",
    stem: "SQL command to remove a table is:",
    answer: "DROP TABLE",
    wrongs: ["DELETE TABLE", "REMOVE TABLE", "ERASE TABLE"],
    explanation: "DDL: DROP TABLE name.",
  },
  {
    topic: "Hardware",
    stem: "Which printer is typically non-impact?",
    answer: "Laser printer",
    wrongs: ["Dot matrix", "Daisy wheel", "Line printer (impact type)"],
    explanation: "Laser is non-impact; dot-matrix is impact.",
  },
  {
    topic: "Networking",
    stem: "LAN covers:",
    answer: "A small geographic area like office/campus",
    wrongs: ["Entire continents only", "Only wireless satellites", "Interplanetary links"],
    explanation: "Local Area Network — limited area.",
  },
];

/* ========================= builders ========================= */

function sourceFor(paperNo: number): string {
  return paperNo === 2 ? "pyq_style" : "seed";
}

export function generateQuantQuestions(
  count: number,
  startIndex: number,
  marks: number,
  negative: number,
  sectionKey: string,
  subject: string,
  paperNo = 1,
  source = "seed",
): SeedQuestion[] {
  return generateHardQuant(count, startIndex, marks, negative, sectionKey, subject, paperNo, source);
}

export function generateReasoningQuestions(
  count: number,
  startIndex: number,
  marks: number,
  negative: number,
  paperNo = 1,
  source = "seed",
): SeedQuestion[] {
  const offset = (paperNo - 1) * 11;
  const items = pickBank(REASONING_BANK, count, startIndex, offset);
  const tagged = items.map((it) => ({ ...it, difficulty: "hard" }));
  return wrapBank(tagged, startIndex, "reasoning", "Reasoning", marks, negative, source, `P${paperNo}`);
}

export function generateGAQuestions(
  count: number,
  startIndex: number,
  marks: number,
  negative: number,
  paperNo = 1,
  source = "seed",
): SeedQuestion[] {
  const offset = (paperNo - 1) * 13 + 3;
  const items = pickBank(GA_BANK, count, startIndex, offset).map((it) => ({
    ...it,
    difficulty: "hard",
  }));
  return wrapBank(items, startIndex, "ga", "General Awareness", marks, negative, source, `GA${paperNo}`);
}

export function generateEnglishQuestions(
  count: number,
  startIndex: number,
  marks: number,
  negative: number,
  paperNo = 1,
  source = "seed",
): SeedQuestion[] {
  const offset = (paperNo - 1) * 9 + 1;
  const items = pickBank(ENG_BANK, count, startIndex, offset).map((it) => ({
    ...it,
    difficulty: "hard",
  }));
  return wrapBank(items, startIndex, "english", "English", marks, negative, source, `E${paperNo}`);
}

export function generateComputerQuestions(
  count: number,
  startIndex: number,
  marks: number,
  negative: number,
  paperNo = 1,
  source = "seed",
): SeedQuestion[] {
  const offset = (paperNo - 1) * 5;
  const items = pickBank(COMPUTER_BANK, count, startIndex, offset).map((it) => ({
    ...it,
    difficulty: "hard",
  }));
  return wrapBank(items, startIndex, "computer", "Computer", marks, negative, source, `C${paperNo}`);
}

export function buildTier1Paper(paperNo: number): SeedQuestion[] {
  const source = sourceFor(paperNo);
  const q: SeedQuestion[] = [];
  q.push(...generateReasoningQuestions(25, 1, 2, 0.5, paperNo, source));
  q.push(...generateGAQuestions(25, 26, 2, 0.5, paperNo, source));
  q.push(...generateQuantQuestions(25, 51, 2, 0.5, "quant", "Quantitative Aptitude", paperNo, source));
  q.push(...generateEnglishQuestions(25, 76, 2, 0.5, paperNo, source));
  return q.map((item) => ({
    ...item,
    difficulty: "hard",
    source,
  }));
}

export function buildTier2Paper(paperNo: number): SeedQuestion[] {
  const source = sourceFor(paperNo);
  const q: SeedQuestion[] = [];
  q.push(...generateQuantQuestions(30, 1, 3, 1, "maths", "Mathematical Abilities", paperNo, source));
  q.push(...generateReasoningQuestions(30, 31, 3, 1, paperNo + 1, source));
  q.push(...generateEnglishQuestions(45, 61, 3, 1, paperNo + 2, source));
  q.push(...generateGAQuestions(25, 106, 3, 1, paperNo + 3, source));
  q.push(...generateComputerQuestions(20, 131, 3, 1, paperNo, source));
  return q.map((item) => ({
    ...item,
    difficulty: "hard",
    source,
  }));
}

export function buildSectionPractice(
  sectionKey: "reasoning" | "ga" | "quant" | "english",
  setNo: number,
): SeedQuestion[] {
  const source = setNo === 2 ? "pyq_style" : "seed";
  const marks = 2;
  const neg = 0.5;
  switch (sectionKey) {
    case "reasoning":
      return generateReasoningQuestions(25, 1, marks, neg, setNo + 10, source);
    case "ga":
      return generateGAQuestions(25, 1, marks, neg, setNo + 10, source);
    case "quant":
      return generateQuantQuestions(25, 1, marks, neg, "quant", "Quantitative Aptitude", setNo + 10, source);
    case "english":
      return generateEnglishQuestions(25, 1, marks, neg, setNo + 10, source);
    default:
      return generateReasoningQuestions(25, 1, marks, neg, setNo, source);
  }
}

export const DEST_PASSAGES = [
  `The Staff Selection Commission conducts the Combined Graduate Level Examination for recruitment to various Group B and Group C posts in ministries and departments of the Government of India. Candidates must carefully read every instruction before beginning the examination. Time management is essential because each section of the paper is designed to test accuracy as well as speed. Regular practice of previous year questions improves familiarity with the pattern. Quantitative aptitude requires clear concepts of arithmetic, algebra, geometry and trigonometry. Reasoning tests analytical ability through analogies, series, coding and puzzles. General awareness covers history, geography, polity, economy and current events. English comprehension evaluates vocabulary, grammar and reading skills. Candidates should avoid guesswork where negative marking applies. Maintaining calm during the test helps in better decision making. Consistent revision of weak topics yields measurable improvement over successive mock tests. Typing practice for the data entry speed test should be undertaken daily so that the required number of key depressions can be completed with high accuracy within the allotted fifteen minutes. Accuracy matters as much as speed because errors reduce the effective score of the skill test. Candidates are advised to sit upright, keep the fingers on the home row and type the passage exactly as displayed on the screen without adding or omitting words. After finishing the written sections of Paper One, there is a short break for re registration before Session Two begins. During the break, remain in the examination centre and follow the instructions of the invigilator. The DEST passage is designed to measure data entry ability required for several posts under the Commission. Practice with similar passages on a standard keyboard builds confidence and reduces anxiety on the day of the examination.`,
  `India is a union of states with a parliamentary system of government. The Constitution came into force on the twenty sixth of January nineteen fifty. Fundamental rights guarantee civil liberties while directive principles guide the state in policy making. The Parliament consists of the President and the two Houses. The Supreme Court is the apex judicial body. Public administration depends on an efficient civil service selected through competitive examinations. Economic planning aims at inclusive growth, employment generation and poverty reduction. Science and technology play a vital role in agriculture, industry and communication. Environmental protection is a shared responsibility of citizens and institutions. Education expands opportunity and strengthens democratic values. Discipline, integrity and hard work remain the foundation of public service. Aspirants preparing for competitive examinations must cultivate reading habits, numerical ability and clear expression in English and Hindi. Mock examinations under timed conditions train the mind for the actual examination hall. Candidates should analyse every mock result carefully, note the topics where mistakes occur and revise those topics before the next practice session. Sleep, nutrition and a fixed study timetable support sustained preparation over several months. On the day of the examination, reach the venue early with the required documents and follow all centre rules. Avoid discussion of answers after the paper and wait for the official process of result declaration. Continuous and honest effort is the most reliable path to success in the Combined Graduate Level Examination conducted by the Staff Selection Commission. Keep practising until accuracy and speed both meet the standard expected in the actual skill test.`,
];
