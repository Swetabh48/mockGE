import { trickForTopic } from "./taxonomy";
import {
  bestPatternForTopic,
  formatTrickFromPattern,
  REVISION_NOTES,
} from "./revisionNotes";

/** Turn a one-liner into readable steps when possible. */
export function enrichExplanation(
  topic: string,
  explanation: string | null | undefined,
  stem?: string | null,
): string {
  const raw = (explanation || "").trim();
  const t = topic.toLowerCase();
  const stemText = stem || "";

  if (/compound interest/i.test(topic) || (/interest/.test(t) && /compound|ci\b/.test(t + raw))) {
    const m =
      raw.match(/A\s*=\s*[^=]*=\s*([\d.]+).*CI\s*=\s*[^=]*=\s*([\d.]+)/i) ||
      raw.match(/A\s*=.*?([\d.]+).*CI.*?([\d.]+)/i);
    const pct = stemText.match(/(\d+)\s*%/);
    const years = stemText.match(/(\d+)\s*years?/i);
    if (years?.[1] === "2" && pct) {
      const r = Number(pct[1]);
      const ciPct = 2 * r + (r * r) / 100;
      return [
        `Step 1 (exam trick for 2 years): CI% on P = 2R + R²/100 = 2×${r} + ${r}²/100 = ${ciPct}%.`,
        "Step 2: CI = P × (that %)/100. Or: SI = PRT/100, then CI = SI + P(R/100)².",
        m ? `Step 3: Here CI = ${m[2]} (reject the SI distractor).` : "Step 3: Match CI with options; reject the SI value.",
      ].join("\n");
    }
    if (m) {
      return [
        "Step 1: Amount A = P(1 + R/100)^T.",
        `Step 2: A = ${m[1]}.`,
        `Step 3: CI = A − P = ${m[2]}.`,
        "Step 4: Cross-check by eliminating the option equal to simple interest PRT/100.",
      ].join("\n");
    }
  }

  if (/profit|loss|discount|rebate|multi-step/i.test(topic + " " + stemText)) {
    const gain = stemText.match(/(\d+(?:\.\d+)?)\s*%\s*profit/i);
    const rebate =
      stemText.match(/reduced by\s*(\d+(?:\.\d+)?)\s*%/i) ||
      stemText.match(/rebate.*?(\d+(?:\.\d+)?)\s*%/i) ||
      stemText.match(/(\d+(?:\.\d+)?)\s*%\s*(?:of that SP|rebate)/i);
    const overall = raw.match(/overall\s*=\s*([-\d.]+)\s*%/i);

    if (gain && rebate) {
      const g = Number(gain[1]);
      const r = Number(rebate[1]);
      const net = Math.round((g - r - (g * r) / 100) * 100) / 100;
      return [
        `Step 1 (exam trick — skip big SP math): overall % = g − r − (g×r)/100.`,
        `Step 2: Here g=${g}, r=${r} → ${g} − ${r} − (${g}×${r})/100 = ${net}%.`,
        "Step 3: Positive ⇒ profit; negative ⇒ loss. Do NOT answer g−r (trap).",
        overall
          ? `Step 4: Matches overall ≈ ${overall[1]}% on CP.`
          : "Step 4: Pick the option equal to this net %.",
      ].join("\n");
    }

    const sp = raw.match(/Final SP\s*=\s*([\d.]+)/i);
    if (sp && overall) {
      return [
        "Step 1 (preferred): use successive % = g − r − gr/100 instead of computing Final SP.",
        `Step 2 (slow check): Final SP ≈ Rs. ${sp[1]}; overall ≈ ${overall[1]}% on CP.`,
        "Step 3: Trap = subtracting the two percentages directly.",
      ].join("\n");
    }

    const eq = raw.match(/Equivalent discount\s*[≈=]\s*([\d.]+)%/i);
    const net = raw.match(/SP\s*=\s*([\d.]+)/i);
    if (eq && net) {
      return [
        "Step 1 (trick): equivalent discount = d1 + d2 − (d1×d2)/100 — never add d1+d2.",
        `Step 2: Equivalent single discount ≈ ${eq[1]}%.`,
        `Step 3: SP = MP × (100 − eq)/100 = ${net[1]}.`,
      ].join("\n");
    }
  }

  if (/boat|stream/i.test(topic)) {
    return [
      "Step 1: Downstream = boat + stream; upstream = boat − stream.",
      "Step 2: Time each way = distance / that speed; add for round trip.",
      "Step 3: Do NOT use arithmetic mean of speeds for equal-distance round trip (use harmonic: 2xy/(x+y)).",
      raw ? `Step 4: ${raw}` : "",
    ]
      .filter(Boolean)
      .join("\n");
  }

  if (/pipe|cistern|time and work|work/i.test(topic)) {
    return [
      "Step 1 (trick): take LCM of times as total work/capacity — avoid 1/a+1/b fractions.",
      "Step 2: Each person’s/pipe’s 1-day (or 1-hour) work = LCM / their days.",
      "Step 3: Add fillers; subtract outlet. Time = total / net rate.",
      raw ? `Step 4: ${raw}` : "",
    ]
      .filter(Boolean)
      .join("\n");
  }

  if (/mensuration|cylinder|cone|volume/i.test(topic)) {
    return [
      "Step 1: Pick formula (cylinder V = πr²h). If r is multiple of 7, use π = 22/7.",
      "Step 2: Cancel early (22/7 × 49 = 154) before multiplying height.",
      raw ? `Step 3: ${raw}` : "Step 3: Match units (cm³).",
    ].join("\n");
  }

  if (/trigo|height|tan/i.test(topic)) {
    return [
      "Step 1: Sketch height h, distance d, angle θ.",
      "Step 2: tan θ = h/d. Use tan30=1/√3, tan45=1, tan60=√3.",
      "Step 3: Cancel radicals before multiplying.",
      raw ? `Step 4: ${raw}` : "",
    ]
      .filter(Boolean)
      .join("\n");
  }

  if (raw.includes(";") || raw.includes("⇒") || raw.includes("→")) {
    const parts = raw.split(/\s*[;⇒→]\s*/).filter(Boolean);
    if (parts.length >= 2) {
      return parts.map((p, i) => `Step ${i + 1}: ${p.trim()}`).join("\n");
    }
  }

  if (raw.length < 40 && raw) {
    const pattern = bestPatternForTopic(topic);
    return [
      `Step 1: Identify the pattern (${pattern?.pattern || topic}).`,
      pattern
        ? `Step 2: Shortcut — ${pattern.examTip}`
        : "Step 2: Apply the standard method for this pattern.",
      `Step 3: ${raw}`,
      "Step 4: Eliminate distractors that come from naive shortcuts (e.g. adding % or using SI instead of CI).",
    ].join("\n");
  }

  return (
    raw ||
    `Work through the standard ${topic} method, then match the final value to the correct option.`
  );
}

export function enrichTrick(topic: string, trick?: string | null): string {
  const pattern = bestPatternForTopic(topic);
  if (pattern) return formatTrickFromPattern(pattern);

  for (const note of REVISION_NOTES) {
    if (
      topic.toLowerCase().includes(note.topicTitle.toLowerCase().slice(0, 8)) ||
      note.topicTitle.toLowerCase().includes(topic.toLowerCase().slice(0, 8))
    ) {
      return formatTrickFromPattern(note.patterns[0]);
    }
  }

  const t = (trick || trickForTopic(topic)).replace(/^Trick:\s*/i, "");
  if (t.length < 120 && /[=×÷%]/.test(t)) {
    return [
      `SHORTCUT: ${t}`,
      "",
      "Worked idea: plug the given percentages/rates into this one line instead of expanding every intermediate amount.",
      "Open Formulas & Tricks on the dashboard for full examples + YouTube links by pattern.",
    ].join("\n");
  }
  return t.startsWith("SHORTCUT") || t.startsWith("Exam")
    ? t
    : `SHORTCUT: ${t}\n\nSee Formulas & Tricks → matching topic for a worked example and video.`;
}
