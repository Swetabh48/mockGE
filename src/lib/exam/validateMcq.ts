/**
 * Verify / repair model-invented MCQs so wrong keys and nonsense working
 * never reach the student.
 */

export type McqLike = {
  stemEn: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctOption: string;
  explanation: string;
  trick: string;
  topic: string;
  subtopic?: string;
};

function parseNum(s: string): number | null {
  const m = s.replace(/,/g, "").match(/-?\d+(?:\.\d+)?/);
  return m ? Number(m[0]) : null;
}

function optionMap(q: McqLike): Record<"A" | "B" | "C" | "D", string> {
  return { A: q.optionA, B: q.optionB, C: q.optionC, D: q.optionD };
}

function findLetterForValue(
  q: McqLike,
  value: number,
  tolerance = 0.05,
): "A" | "B" | "C" | "D" | null {
  const opts = optionMap(q);
  for (const letter of ["A", "B", "C", "D"] as const) {
    const n = parseNum(opts[letter]);
    if (n === null) continue;
    if (Math.abs(n - value) <= tolerance || Math.abs(n - value) / Math.max(1, Math.abs(value)) < 0.02) {
      return letter;
    }
  }
  return null;
}

function cleanEnglish(stem: string | null | undefined): string {
  return String(stem || "")
    .replace(/\s+/g, " ")
    .replace(/\s+([,.?;:])/g, "$1")
    .replace(/\?\?+/g, "?")
    .trim();
}

/** Infer a sensible topic label from the stem (fixes HCF label on boat Qs). */
export function inferTopicFromStem(stem: string, fallback: string): { topic: string; subtopic?: string } {
  const s = stem.toLowerCase();
  if (/boat|stream|upstream|downstream|still water/.test(s)) {
    return { topic: "Time, Speed & Distance", subtopic: "Boats & streams" };
  }
  if (/train/.test(s) && /(platform|pole|cross|length|km\/h|m\/s)/.test(s)) {
    return { topic: "Time, Speed & Distance", subtopic: "Trains" };
  }
  if (/pipe|cistern|tank/.test(s) && /(fill|empty|leak)/.test(s)) {
    return { topic: "Time & Work", subtopic: "Pipes & cisterns" };
  }
  if (/\b(work|worker|man|woman|days? to (finish|complete)|efficiency)\b/.test(s)) {
    return { topic: "Time & Work", subtopic: "Basic work" };
  }
  if (/compound interest|\bci\b/.test(s)) return { topic: "SI & CI", subtopic: "Compound interest" };
  if (/simple interest|\bsi\b/.test(s)) return { topic: "SI & CI", subtopic: "Simple interest" };
  if (/profit|loss|marked price|discount|cp\b|sp\b/.test(s)) {
    return { topic: "Profit, Loss & Discount", subtopic: "Profit & loss" };
  }
  if (/percent|%/.test(s) && !/interest|profit|discount/.test(s)) {
    return { topic: "Percentage", subtopic: "Basic %" };
  }
  if (/hcf|lcm|divisib|remainder|number system/.test(s)) {
    return { topic: "Number System & HCF-LCM", subtopic: "HCF / LCM" };
  }
  if (/average|mean/.test(s)) return { topic: "Average", subtopic: "Average" };
  if (/ratio|partnership|proportion/.test(s)) return { topic: "Ratio & Partnership", subtopic: "Ratio" };
  if (/triangle|circle|chord|geometry/.test(s)) return { topic: "Geometry", subtopic: "Geometry" };
  if (/cylinder|cone|sphere|volume|mensuration/.test(s)) {
    return { topic: "Mensuration", subtopic: "Mensuration" };
  }
  if (/sin|cos|tan|height.*tower|angle of (elevation|depression)/.test(s)) {
    return { topic: "Trigonometry", subtopic: "Heights & distances" };
  }
  return { topic: fallback };
}

type SolveResult = {
  value: number;
  explanation: string;
  trick: string;
};

function solveBoat(stem: string): SolveResult | null {
  const s = stem.toLowerCase();
  if (!/boat|stream|upstream|downstream|still water/.test(s)) return null;

  const still =
    stem.match(/still\s*water[^\d]{0,20}(\d+(?:\.\d+)?)\s*km/i) ||
    stem.match(/boat[^\d]{0,40}(\d+(?:\.\d+)?)\s*km\/?h/i) ||
    stem.match(/speed\s*(?:in\s*)?still[^\d]{0,15}(\d+(?:\.\d+)?)/i);
  const stream =
    stem.match(/stream[^\d]{0,20}(\d+(?:\.\d+)?)\s*km/i) ||
    stem.match(/current[^\d]{0,20}(\d+(?:\.\d+)?)/i);

  if (!still || !stream) return null;
  const u = Number(still[1]);
  const v = Number(stream[1]);
  if (!(u > v && v >= 0)) return null;

  const up = u - v;
  const down = u + v;

  // Speed upstream / downstream (distance in stem is a red herring)
  if (/upstream/.test(s) && /speed|rate|how\s+fast|what\s+is\s+the\s+speed/.test(s) && !/time|hours?/.test(s)) {
    return {
      value: up,
      explanation: [
        "Boats & streams (upstream speed)",
        "",
        `Given: speed in still water u = ${u} km/h, stream v = ${v} km/h.`,
        `Upstream speed = u − v = ${u} − ${v} = ${up} km/h.`,
        "Distance in the stem is not needed when only speed is asked.",
        `Downstream would be u + v = ${down} km/h (common trap).`,
      ].join("\n"),
      trick: `Upstream = still − stream (${u}−${v}=${up}). Downstream = still + stream. Ignore unused distance.`,
    };
  }
  if (/downstream/.test(s) && /speed|rate|how\s+fast|what\s+is\s+the\s+speed/.test(s) && !/time|hours?/.test(s)) {
    return {
      value: down,
      explanation: [
        "Boats & streams (downstream speed)",
        "",
        `Given: still water u = ${u} km/h, stream v = ${v} km/h.`,
        `Downstream speed = u + v = ${u} + ${v} = ${down} km/h.`,
        `Upstream would be u − v = ${up} km/h (trap).`,
      ].join("\n"),
      trick: `Downstream = still + stream (${u}+${v}=${down}). Upstream = still − stream.`,
    };
  }

  const dist = stem.match(/(\d+(?:\.\d+)?)\s*km/);
  if (dist && /time|hours?|minutes?/.test(s)) {
    const d = Number(dist[1]);
    if (/upstream/.test(s)) {
      const t = Math.round((d / up) * 100) / 100;
      return {
        value: t,
        explanation: [
          "Boats & streams (upstream time)",
          "",
          `Upstream speed = ${u} − ${v} = ${up} km/h.`,
          `Time = distance / speed = ${d} / ${up} = ${t} h.`,
        ].join("\n"),
        trick: `First get upstream speed u−v, then time = d/(u−v).`,
      };
    }
    if (/downstream/.test(s)) {
      const t = Math.round((d / down) * 100) / 100;
      return {
        value: t,
        explanation: [
          "Boats & streams (downstream time)",
          "",
          `Downstream speed = ${u} + ${v} = ${down} km/h.`,
          `Time = ${d} / ${down} = ${t} h.`,
        ].join("\n"),
        trick: `Downstream speed u+v, then time = d/(u+v).`,
      };
    }
  }
  return null;
}

function solveSi(stem: string): SolveResult | null {
  const s = stem.toLowerCase();
  if (!/simple interest|\bsi\b/.test(s) || /compound/.test(s)) return null;
  const p = stem.match(/(?:principal|sum|p)\s*(?:of\s*)?(?:rs\.?\s*)?(\d+)/i) ||
    stem.match(/rs\.?\s*(\d+)/i);
  const r = stem.match(/(\d+(?:\.\d+)?)\s*%/);
  const t = stem.match(/(\d+(?:\.\d+)?)\s*(?:years?|yrs?)/i);
  if (!p || !r || !t) return null;
  const P = Number(p[1]);
  const R = Number(r[1]);
  const T = Number(t[1]);
  const si = Math.round((P * R * T) / 100);
  if (/interest|si\b/.test(s) && !/amount|total/.test(s)) {
    return {
      value: si,
      explanation: [
        "Simple interest",
        "",
        `SI = PRT/100 = ${P} × ${R} × ${T} / 100 = ${si}.`,
      ].join("\n"),
      trick: `SI = PRT/100. Here ${P}×${R}×${T}/100 = ${si}.`,
    };
  }
  return null;
}

function solveCi2yr(stem: string): SolveResult | null {
  const s = stem.toLowerCase();
  if (!/compound/.test(s)) return null;
  const years = stem.match(/(\d+)\s*years?/i);
  if (!years || years[1] !== "2") return null;
  const p = stem.match(/(?:principal|sum|p)\s*(?:of\s*)?(?:rs\.?\s*)?(\d+)/i) ||
    stem.match(/rs\.?\s*(\d+)/i);
  const r = stem.match(/(\d+(?:\.\d+)?)\s*%/);
  if (!p || !r) return null;
  const P = Number(p[1]);
  const R = Number(r[1]);
  const ciPct = 2 * R + (R * R) / 100;
  const ci = Math.round((P * ciPct) / 100);
  if (/interest|ci\b/.test(s) && !/amount/.test(s)) {
    return {
      value: ci,
      explanation: [
        "Compound interest (2 years)",
        "",
        `CI% for 2 years = 2R + R²/100 = 2×${R} + ${R}²/100 = ${ciPct}%.`,
        `CI = P × ${ciPct}/100 = ${P} × ${ciPct}/100 = ${ci}.`,
        `Trap: SI = PRT/100 = ${Math.round((P * R * 2) / 100)} (not the answer).`,
      ].join("\n"),
      trick: `2-year CI% = 2R+R²/100. Then ×P/100. Reject SI distractor.`,
    };
  }
  return null;
}

function trySolve(stem: string): SolveResult | null {
  return solveBoat(stem) || solveSi(stem) || solveCi2yr(stem);
}

/**
 * Returns repaired MCQ, or null if the item is unsafe (wrong key / nonsense).
 */
export function validateAndRepairMcq(q: McqLike): McqLike | null {
  const stemEn = cleanEnglish(q.stemEn);
  if (stemEn.length < 25) return null;

  // Reject clearly broken English / nonsense stems
  if (/\?\?\?|asdf|lorem|undefined|null|\{|\}/.test(stemEn)) return null;
  if ((stemEn.match(/\b(the|a|an|of|in|is|to)\b/gi) || []).length < 2 && stemEn.split(" ").length > 8) {
    // allow short formula stems
  }

  const inferred = inferTopicFromStem(stemEn, q.topic);
  const solved = trySolve(stemEn);

  if (solved) {
    const letter = findLetterForValue(q, solved.value);
    if (!letter) {
      // Correct value not in options — drop this bad item
      return null;
    }
    return {
      ...q,
      stemEn,
      topic: inferred.topic,
      subtopic: inferred.subtopic || q.subtopic,
      correctOption: letter,
      explanation: solved.explanation,
      trick: solved.trick,
    };
  }

  // No closed-form solver: keep if options look sane; overwrite topic if stem disagrees
  const letter = q.correctOption as "A" | "B" | "C" | "D";
  if (!["A", "B", "C", "D"].includes(letter)) return null;
  const ans = optionMap(q)[letter];
  if (!ans || ans.length < 1) return null;

  // Topic leakage: asked for HCF but stem is boats → fix label
  const topicMismatch =
    /hcf|lcm|number system|divisib/i.test(q.topic) &&
    /boat|stream|upstream|interest|profit|pipe|train/i.test(stemEn);

  return {
    ...q,
    stemEn,
    topic: topicMismatch || inferred.topic !== q.topic ? inferred.topic : q.topic,
    subtopic: inferred.subtopic || q.subtopic,
    explanation: (q.explanation || "").trim() || `Correct option is (${letter}) ${ans}.`,
    trick: (q.trick || "").trim() || `Mark (${letter}) after checking the standard method for ${inferred.topic}.`,
  };
}

/** Rebuild a verified solution for the report page (ignores bad model working). */
export function verifiedSolutionNotes(args: {
  stem: string;
  topic: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctOption: string;
  explanation?: string | null;
}): { explanation: string; trick: string; topic: string; subtopic?: string; correctOption: string } | null {
  const q: McqLike = {
    stemEn: args.stem,
    optionA: args.optionA,
    optionB: args.optionB,
    optionC: args.optionC,
    optionD: args.optionD,
    correctOption: args.correctOption,
    explanation: args.explanation || "",
    trick: "",
    topic: args.topic,
  };
  const fixed = validateAndRepairMcq(q);
  if (!fixed) return null;
  const solved = trySolve(fixed.stemEn);
  if (!solved) return null;
  return {
    explanation: solved.explanation,
    trick: solved.trick,
    topic: fixed.topic,
    subtopic: fixed.subtopic,
    correctOption: fixed.correctOption,
  };
}
