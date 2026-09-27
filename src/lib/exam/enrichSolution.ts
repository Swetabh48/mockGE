import { trickForTopic } from "./taxonomy";
import { REVISION_NOTES } from "./revisionNotes";

/** Turn a one-liner into readable steps when possible. */
export function enrichExplanation(
  topic: string,
  explanation: string | null | undefined,
  stem?: string | null,
): string {
  const raw = (explanation || "").trim();
  const t = topic.toLowerCase();

  if (/compound interest/i.test(topic) || (/interest/.test(t) && /compound|ci\b/.test(t + raw))) {
    const m = raw.match(/A\s*=\s*[^=]*=\s*([\d.]+).*CI\s*=\s*[^=]*=\s*([\d.]+)/i) ||
      raw.match(/A\s*=.*?([\d.]+).*CI.*?([\d.]+)/i);
    if (m) {
      return [
        "Step 1: Use compound interest formula A = P(1 + R/100)^T (annual compounding).",
        `Step 2: Compute the amount A = ${m[1]}.`,
        `Step 3: Compound interest CI = A − P = ${m[2]}.`,
        "Step 4: Match the CI value with the options (ignore the SI distractor which uses PRT/100).",
      ].join("\n");
    }
  }

  if (/profit|loss|discount|rebate|multi-step/i.test(topic + " " + (stem || ""))) {
    const sp = raw.match(/Final SP\s*=\s*([\d.]+)/i);
    const overall = raw.match(/overall\s*=\s*([-\d.]+)\s*%/i);
    if (sp && overall) {
      return [
        "Step 1: Start from cost price (CP).",
        "Step 2: Apply the first % change to get the intermediate selling price (SP1 = CP × (1 ± g/100)).",
        "Step 3: Apply the rebate/second % on SP1 (not on CP): Final SP = SP1 × (1 − r/100).",
        `Step 4: Final SP comes to Rs. ${sp[1]}.`,
        `Step 5: Overall % on CP = (Final SP − CP)/CP × 100 = ${overall[1]}%.`,
        "Note: Positive overall ⇒ profit; negative ⇒ loss.",
      ].join("\n");
    }
    const eq = raw.match(/Equivalent discount\s*[≈=]\s*([\d.]+)%/i);
    const net = raw.match(/SP\s*=\s*([\d.]+)/i);
    if (eq && net) {
      return [
        "Step 1: Marked price (MP) is given.",
        "Step 2: Successive discounts multiply remaining factors: (1−d1/100)×(1−d2/100).",
        `Step 3: Equivalent single discount ≈ ${eq[1]}% (formula: d1+d2−d1d2/100).`,
        `Step 4: Selling price SP = ${net[1]}.`,
      ].join("\n");
    }
  }

  if (/boat|stream/i.test(topic)) {
    return [
      "Step 1: Downstream speed = boat + stream; upstream = boat − stream.",
      "Step 2: Time upstream = distance / upstream speed.",
      "Step 3: Time downstream = distance / downstream speed.",
      `Step 4: Add both times. ${raw ? `Result: ${raw}` : ""}`,
    ]
      .filter(Boolean)
      .join("\n");
  }

  if (/pipe|cistern|time and work|work/i.test(topic)) {
    return [
      "Step 1: Write each person’s/pipe’s rate as 1/(days or hours).",
      "Step 2: Add rates for workers filling together; subtract for outlet/leak.",
      "Step 3: Time = 1 / net rate (when net rate > 0).",
      raw ? `Step 4: ${raw}` : "",
    ]
      .filter(Boolean)
      .join("\n");
  }

  if (/mensuration|cylinder|cone|volume/i.test(topic)) {
    return [
      "Step 1: Identify the solid and the required formula (cylinder volume V = πr²h).",
      "Step 2: Substitute r and h (use π = 22/7 when r is a multiple of 7).",
      raw ? `Step 3: ${raw}` : "Step 3: Simplify carefully and match units (cm³).",
    ].join("\n");
  }

  if (/trigo|height|tan/i.test(topic)) {
    return [
      "Step 1: Sketch height h and ground distance d with angle of elevation θ.",
      "Step 2: Use tan θ = h/d (or d = h / tan θ).",
      "Step 3: Insert standard values: tan30°=1/√3, tan45°=1, tan60°=√3.",
      raw ? `Step 4: ${raw}` : "",
    ]
      .filter(Boolean)
      .join("\n");
  }

  // Generic enrichment: number the existing sentence as steps if it has semicolons
  if (raw.includes(";") || raw.includes("⇒") || raw.includes("→")) {
    const parts = raw.split(/\s*[;⇒→]\s*/).filter(Boolean);
    if (parts.length >= 2) {
      return parts.map((p, i) => `Step ${i + 1}: ${p.trim()}`).join("\n");
    }
  }

  if (raw.length < 40 && raw) {
    return [
      `Step 1: Read the question and identify the topic (${topic}).`,
      `Step 2: Apply the standard method for this pattern.`,
      `Step 3: ${raw}`,
      "Step 4: Cross-check with options; eliminate SI/approximate distractors.",
    ].join("\n");
  }

  return raw || `Work through the standard ${topic} method, then match the final value to the correct option.`;
}

export function enrichTrick(topic: string, trick?: string | null): string {
  const clear = CLEAR_TRICKS.find((c) => c.test(topic));
  if (clear) return clear.text;

  // Prefer revision examTip if topic matches
  for (const note of REVISION_NOTES) {
    if (
      topic.toLowerCase().includes(note.topicTitle.toLowerCase().slice(0, 8)) ||
      note.topicTitle.toLowerCase().includes(topic.toLowerCase().slice(0, 8))
    ) {
      const tip = note.patterns[0]?.examTip;
      const how = note.patterns[0]?.howToUse;
      if (tip && how) return `${how} ${tip}`;
    }
  }

  const t = (trick || trickForTopic(topic)).replace(/^Trick:\s*/i, "");
  // Expand dense formula-only tricks into a sentence
  if (t.length < 120 && /[=×÷%]/.test(t)) {
    return `In the exam, apply this quickly: ${t} Write one line of working, then pick the option — do not re-derive from scratch.`;
  }
  return t.startsWith("In the exam") || t.startsWith("Remember") || t.startsWith("Use")
    ? t
    : `Exam shortcut: ${t}`;
}

const CLEAR_TRICKS: { test: (topic: string) => boolean; text: string }[] = [
  {
    test: (topic) => /profit|loss|discount|rebate/i.test(topic),
    text: "Exam shortcut: Treat gain then rebate as two successive % changes on money. Final SP = CP×(1+g/100)×(1−r/100), then overall% = (Final−CP)/CP×100. Do not subtract the two percentages directly.",
  },
  {
    test: (topic) => /compound interest/i.test(topic),
    text: "Exam shortcut: Compute A = P(1+R/100)^T, then CI = A−P. Quickly reject the option that equals simple interest PRT/100. For 2 years you can also check CI−SI = P(R/100)².",
  },
  {
    test: (topic) => /successive discount/i.test(topic),
    text: "Exam shortcut: Never add discounts. Equivalent % = d1+d2−(d1×d2)/100, or multiply (1−d1/100)(1−d2/100) on MP.",
  },
  {
    test: (topic) => /boat|stream/i.test(topic),
    text: "Exam shortcut: Upstream = u−v (slower), downstream = u+v. Round-trip time = dist/(u−v) + dist/(u+v).",
  },
  {
    test: (topic) => /pipe|cistern/i.test(topic),
    text: "Exam shortcut: Filling pipes +, emptying −. Net rate = sum of ±1/time. Required time = 1/net.",
  },
  {
    test: (topic) => /time and work|work/i.test(topic),
    text: "Exam shortcut: Take LCM of days as total work. Each person’s one-day work = total/LCM days. Add for together.",
  },
  {
    test: (topic) => /percent/i.test(topic),
    text: "Exam shortcut: x% of y = y% of x. Successive changes use a+b+ab/100. Keep fraction shortcuts (12.5%=1/8) ready.",
  },
  {
    test: (topic) => /coding/i.test(topic),
    text: "Exam shortcut: Test +1/−1 letter shift on the first example word, then confirm on the second. Only then code the target word.",
  },
  {
    test: (topic) => /syllog/i.test(topic),
    text: "Exam shortcut: Draw a quick Venn. If a conclusion is only possible but not forced, it does not follow as ‘definite’.",
  },
];
