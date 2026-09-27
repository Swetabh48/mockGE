/**
 * Revision notes: formulas & exam tricks by topic and question pattern.
 * Used on /revise and to enrich short explanations/tricks on results.
 */

export type FormulaPattern = {
  pattern: string;
  formula: string;
  howToUse: string;
  examTip: string;
};

export type TopicRevision = {
  subjectKey: "quant" | "reasoning" | "english" | "ga";
  topicId: string;
  topicTitle: string;
  patterns: FormulaPattern[];
};

export const REVISION_NOTES: TopicRevision[] = [
  {
    subjectKey: "quant",
    topicId: "percentage",
    topicTitle: "Percentage",
    patterns: [
      {
        pattern: "x% of y",
        formula: "x% of y = (x/100)×y  (same as y% of x)",
        howToUse: "Swap numbers if one is easier. Example: 12% of 50 = 50% of 12 = 6.",
        examTip: "Memorise fractions: 12.5%=1/8, 16⅔%=1/6, 37.5%=3/8, 62.5%=5/8.",
      },
      {
        pattern: "Successive % change (+a% then +b%, or −)",
        formula: "Net ≈ a + b + (a×b)/100  (use − when second is decrease)",
        howToUse: "Do not add percentages blindly. Apply the product formula once.",
        examTip: "+10% then −10% is NOT zero — net = −1%.",
      },
    ],
  },
  {
    subjectKey: "quant",
    topicId: "profit-loss",
    topicTitle: "Profit, Loss & Discount",
    patterns: [
      {
        pattern: "Basic profit / loss %",
        formula: "Profit% = (SP − CP)/CP × 100\nLoss% = (CP − SP)/CP × 100",
        howToUse: "Always divide by CP (cost), never by SP, unless asked specifically.",
        examTip: "If options look like SP-based %, recompute with CP in denominator.",
      },
      {
        pattern: "Gain then rebate on SP (overall on CP)",
        formula: "Final SP = CP × (1 + g/100) × (1 − r/100)\nOverall% = (Final SP − CP)/CP × 100",
        howToUse:
          "Step 1: find SP after gain. Step 2: reduce that SP by rebate %. Step 3: compare final SP with original CP.",
        examTip: "Treat it as two successive % changes on money — same as successive % formula.",
      },
      {
        pattern: "Successive discounts on MP",
        formula: "Equivalent discount = d1 + d2 − (d1×d2)/100\nSP = MP × (1 − d1/100) × (1 − d2/100)",
        howToUse: "Never add d1+d2 directly. Multiply the remaining factors.",
        examTip: "10% + 20% successive ≠ 30%; equivalent = 28%.",
      },
    ],
  },
  {
    subjectKey: "quant",
    topicId: "si-ci",
    topicTitle: "Simple & Compound Interest",
    patterns: [
      {
        pattern: "Simple Interest",
        formula: "SI = (P × R × T) / 100\nAmount = P + SI",
        howToUse: "Plug P, R (%), T (years). Keep units consistent (years, not months unless converted).",
        examTip: "If T is in months, use T/12 years.",
      },
      {
        pattern: "Compound Interest (annual)",
        formula: "A = P(1 + R/100)^T\nCI = A − P",
        howToUse:
          "Step 1: compute factor (1+R/100). Step 2: raise to power T. Step 3: multiply by P. Step 4: subtract P for CI.",
        examTip: "For 2 years, CI − SI = P(R/100)². Use this to check quickly.",
      },
    ],
  },
  {
    subjectKey: "quant",
    topicId: "ratio",
    topicTitle: "Ratio, Proportion & Average",
    patterns: [
      {
        pattern: "Combine ratios / partnership",
        formula: "Share ∝ Capital × Time\nCombine A:B and B:C via LCM of B’s parts",
        howToUse: "Make the common term equal, then read A:C.",
        examTip: "Write capitals×months as one product before taking ratio.",
      },
      {
        pattern: "Average / replacement",
        formula: "Sum = Average × n\nNew avg shifts by (new − old)/n when one value is replaced",
        howToUse: "Convert word problems into total sum first.",
        examTip: "If ‘average increases by k’, total increases by k×n.",
      },
    ],
  },
  {
    subjectKey: "quant",
    topicId: "time-work",
    topicTitle: "Time & Work",
    patterns: [
      {
        pattern: "Basic work",
        formula: "Work = Rate × Time\nIf A finishes in a days, rate = 1/a per day",
        howToUse: "Take LCM of days as total work units to avoid fractions.",
        examTip: "Together rate = sum of individual rates (subtract if emptying).",
      },
      {
        pattern: "Pipes & cisterns",
        formula: "Fillers positive, outlet negative\nNet rate = 1/a + 1/b − 1/c",
        howToUse: "Time to fill = 1 / net rate (if net > 0).",
        examTip: "If net ≤ 0, tank never fills — check options carefully.",
      },
    ],
  },
  {
    subjectKey: "quant",
    topicId: "speed",
    topicTitle: "Time, Speed & Distance",
    patterns: [
      {
        pattern: "Basic STD",
        formula: "Distance = Speed × Time",
        howToUse: "Convert units (km/h ↔ m/s: ×5/18 or ×18/5).",
        examTip: "Same direction: relative = |v1−v2|; opposite: v1+v2.",
      },
      {
        pattern: "Boats & streams",
        formula: "Downstream = u+v, Upstream = u−v\nStill water u = (d+u_stream)/2 on round? use (down+up)/2 for still",
        howToUse: "Upstream time = dist/(u−v); downstream = dist/(u+v); add for round trip.",
        examTip: "Remember: upstream slower → larger time.",
      },
      {
        pattern: "Trains",
        formula: "Time to cross pole = length/speed\nTwo trains: (L1+L2)/relative speed",
        howToUse: "Convert length to km if speed in km/h (÷1000) or speed to m/s.",
        examTip: "Crossing a platform adds platform length to train length.",
      },
    ],
  },
  {
    subjectKey: "quant",
    topicId: "algebra",
    topicTitle: "Algebra",
    patterns: [
      {
        pattern: "Identities",
        formula: "(a+b)² = a²+2ab+b²\n(a−b)² = a²−2ab+b²\na²−b² = (a−b)(a+b)\nα²+β² = (α+β)² − 2αβ",
        howToUse: "If given α+β and αβ, use the last identity for α²+β².",
        examTip: "Expand only if identities don’t fit in one step.",
      },
    ],
  },
  {
    subjectKey: "quant",
    topicId: "geometry",
    topicTitle: "Geometry & Mensuration",
    patterns: [
      {
        pattern: "Circles / chords",
        formula: "Half chord = √(r² − d²); full chord = 2√(r² − d²)",
        howToUse: "d = distance from centre to chord. Draw radius to endpoint → right triangle.",
        examTip: "Perpendicular from centre to chord bisects the chord.",
      },
      {
        pattern: "Cylinder volume",
        formula: "V = πr²h  (often π=22/7 when r multiple of 7)",
        howToUse: "Substitute r and h; simplify πr² first.",
        examTip: "Surface: CSA = 2πrh; TSA = 2πr(r+h).",
      },
    ],
  },
  {
    subjectKey: "quant",
    topicId: "trigo",
    topicTitle: "Trigonometry",
    patterns: [
      {
        pattern: "Heights & distances",
        formula: "tan θ = opposite / adjacent\nsin θ = opp/hyp; cos θ = adj/hyp",
        howToUse: "For elevation θ from point at distance d to height h: tanθ = h/d.",
        examTip: "tan30°=1/√3, tan45°=1, tan60°=√3 — memorise these three.",
      },
    ],
  },
  {
    subjectKey: "reasoning",
    topicId: "coding",
    topicTitle: "Coding–Decoding",
    patterns: [
      {
        pattern: "Letter +1 / −1 shift",
        formula: "Each letter moves fixed steps in alphabet (A→B is +1)",
        howToUse: "Check first and last letters of the example word, then apply same rule.",
        examTip: "Verify on a second given pair before locking the option.",
      },
      {
        pattern: "Positional sum / reverse",
        formula: "A=1…Z=26; sometimes reverse A=26",
        howToUse: "Sum positions or reverse the word then code.",
        examTip: "If numbers look large (~50–100), positional sum is likely.",
      },
    ],
  },
  {
    subjectKey: "reasoning",
    topicId: "series",
    topicTitle: "Series",
    patterns: [
      {
        pattern: "Number series ×n ± k",
        formula: "Check successive ×1+1, ×2+2, ×3+3… or two interleaved series",
        howToUse: "Write differences; if growing fast, try multiply pattern.",
        examTip: "Wrong number questions: find which term breaks the clean pattern.",
      },
    ],
  },
  {
    subjectKey: "reasoning",
    topicId: "syllogism",
    topicTitle: "Syllogism & Venn",
    patterns: [
      {
        pattern: "All / Some / No",
        formula: "Draw Venn; ‘possibility’ ≠ ‘certainty’",
        howToUse: "All A are B + Some B are C does NOT force Some A are C as certainty.",
        examTip: "In SSC, mark ‘does not follow’ when only a possibility exists but statement claims definite.",
      },
    ],
  },
  {
    subjectKey: "reasoning",
    topicId: "blood",
    topicTitle: "Blood Relations",
    patterns: [
      {
        pattern: "Family chain",
        formula: "Draw generations; ‘only son of father’ usually means the person himself or brother",
        howToUse: "Start from the end of the sentence and build upward/downward.",
        examTip: "Convert ‘A is brother of B’s father’ → A is uncle of B.",
      },
    ],
  },
  {
    subjectKey: "english",
    topicId: "grammar",
    topicTitle: "Grammar",
    patterns: [
      {
        pattern: "Subject–verb agreement",
        formula: "Neither/either/each → singular verb\nCollective noun as unit → singular",
        howToUse: "Ignore phrases between subject and verb (…along with…).",
        examTip: "senior/prefer/inferior take ‘to’, not ‘than’.",
      },
    ],
  },
  {
    subjectKey: "english",
    topicId: "vocab",
    topicTitle: "Vocabulary",
    patterns: [
      {
        pattern: "Idioms",
        formula: "Learn meaning as a whole — ignore literal word sense",
        howToUse: "Eliminate options that are word-for-word translations.",
        examTip: "SSC repeats high-frequency idioms — revise a fixed list weekly.",
      },
    ],
  },
  {
    subjectKey: "ga",
    topicId: "polity",
    topicTitle: "Indian Polity",
    patterns: [
      {
        pattern: "Article clusters",
        formula: "FR 12–35; DPSP 36–51; President 52–78; Amendment 368",
        howToUse: "If question asks ‘which article’, recall the cluster first then exact number.",
        examTip: "Schedules: 7th = Union/State/Concurrent lists; 3rd = oaths.",
      },
    ],
  },
  {
    subjectKey: "ga",
    topicId: "economy",
    topicTitle: "Economy",
    patterns: [
      {
        pattern: "Banking rates",
        formula: "Repo: RBI lends to banks\nReverse repo: banks park with RBI (repo > reverse repo normally)",
        howToUse: "Read what is being asked — lending vs parking.",
        examTip: "GST from 1 July 2017 is a frequent static fact.",
      },
    ],
  },
];

export function revisionForTopicId(topicId: string): TopicRevision | undefined {
  return REVISION_NOTES.find((n) => n.topicId === topicId);
}

export function revisionsForSubject(subjectKey: string): TopicRevision[] {
  return REVISION_NOTES.filter((n) => n.subjectKey === subjectKey);
}
