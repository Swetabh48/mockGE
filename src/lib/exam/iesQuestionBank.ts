/**
 * Seed / demo MCQs for IES Civil when official PDFs are not yet imported.
 * Real PYQs come from data/ies_civil_official.json via import scripts.
 */

import { classifyIesStem, iesSubjectsForPaper, type IesSubjectKey } from "./iesTaxonomy";

export type IesMcq = {
  qIndex: number;
  sectionKey: string;
  subject: string;
  topic: string;
  subtopic?: string;
  difficulty: string;
  stemEn: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctOption: string;
  explanation: string;
  trick?: string;
  solutionDetail?: string;
  marks: number;
  negativeMarks: number;
  source: string;
};

const NEG = 2 / 3;

const DEMO_BANK: Omit<IesMcq, "qIndex" | "marks" | "negativeMarks" | "source" | "sectionKey">[] = [
  {
    subject: "solid_mechanics",
    topic: "stress-strain",
    difficulty: "medium",
    stemEn:
      "A mild steel bar of 20 mm diameter is subjected to an axial pull of 40 kN. Taking E = 200 GPa, the elongation of a 2 m gauge length is closest to:",
    optionA: "0.127 mm",
    optionB: "0.255 mm",
    optionC: "0.637 mm",
    optionD: "1.274 mm",
    correctOption: "D",
    explanation:
      "A = π×10² = 314.16 mm²; σ = 40000/314.16 ≈ 127.3 N/mm²; δ = σL/E = 127.3×2000/2×10⁵ ≈ 1.273 mm.",
    trick: "δ = PL/(AE). Keep N and mm consistent.",
    solutionDetail:
      "Cross-section A = πd²/4 = π(20)²/4 = 314.16 mm².\nAxial stress σ = P/A = 40×10³ / 314.16 = 127.32 N/mm².\nElongation δ = σL/E = (127.32 × 2000) / 2×10⁵ = 1.273 mm ≈ 1.274 mm.\nHence option D.\nCommon trap: forgetting to convert L to mm or using diameter instead of radius in area.",
  },
  {
    subject: "fluid_mechanics",
    topic: "flow-pipes",
    difficulty: "medium",
    stemEn:
      "For laminar flow through a circular pipe, the ratio of maximum velocity to average velocity is:",
    optionA: "1.0",
    optionB: "1.5",
    optionC: "2.0",
    optionD: "2.5",
    correctOption: "C",
    explanation: "Hagen–Poiseuille: u_max = 2 u_avg for laminar pipe flow.",
    trick: "Laminar circular pipe → V_max / V_avg = 2.",
    solutionDetail:
      "For steady laminar flow in a circular pipe, the velocity profile is parabolic: u(r) = u_max (1 − (r/R)²).\nAverage velocity V = (1/A)∫u dA = u_max / 2.\nTherefore u_max / V = 2.\nTurbulent flow ratios are lower (~1.2). Do not confuse with open-channel 1.5 factor myths.",
  },
  {
    subject: "geotech",
    topic: "soil-properties",
    difficulty: "medium",
    stemEn:
      "A saturated soil has water content 40% and specific gravity of solids 2.7. The void ratio is:",
    optionA: "0.40",
    optionB: "0.72",
    optionC: "1.08",
    optionD: "1.48",
    correctOption: "C",
    explanation: "For S=1, e = wG = 0.40 × 2.7 = 1.08.",
    trick: "Saturated: e = wG_s.",
    solutionDetail:
      "Degree of saturation S = w G_s / e.\nFor fully saturated soil S = 1 ⇒ e = w G_s = 0.40 × 2.7 = 1.08.\nOption C.\nTrap: using dry density formulas or forgetting S=1.",
  },
  {
    subject: "environmental",
    topic: "wastewater",
    difficulty: "medium",
    stemEn:
      "If the 5-day BOD of a wastewater at 20°C is 150 mg/L and the reaction rate constant k (base e) is 0.23 day⁻¹, the ultimate BOD is closest to:",
    optionA: "180 mg/L",
    optionB: "220 mg/L",
    optionC: "250 mg/L",
    optionD: "300 mg/L",
    correctOption: "B",
    explanation:
      "L₀ = BOD₅ / (1 − e^{−kt}) = 150 / (1 − e^{−1.15}) ≈ 150 / 0.683 ≈ 220 mg/L.",
    trick: "L₀ = BOD₅ / (1 − e^{−k t}).",
    solutionDetail:
      "BOD₅ = L₀ (1 − e^{−k t}).\nk = 0.23 d⁻¹, t = 5 d → kt = 1.15; e^{−1.15} ≈ 0.3166.\n1 − e^{−kt} ≈ 0.6834.\nL₀ = 150 / 0.6834 ≈ 219.5 mg/L ≈ 220 mg/L (B).",
  },
  {
    subject: "design_concrete",
    topic: "rcc-beams",
    difficulty: "hard",
    stemEn:
      "As per IS 456:2000, the maximum compressive strain in concrete in flexural compression at the outermost compression fibre in limit state of collapse is taken as:",
    optionA: "0.002",
    optionB: "0.0035",
    optionC: "0.003",
    optionD: "0.0045",
    correctOption: "B",
    explanation: "IS 456 Cl. 38.1(b): maximum strain in concrete = 0.0035 in bending.",
    trick: "Flexure ε_cu = 0.0035; axial alone often 0.002.",
    solutionDetail:
      "IS 456:2000 assumes a parabolic–rectangular stress block with maximum compressive strain in concrete = 0.0035 at the extreme fibre in flexure.\nFor members under pure axial compression the limiting strain is 0.002.\nHence for beams in flexure the answer is 0.0035 (B).",
  },
  {
    subject: "transportation",
    topic: "highway-geom",
    difficulty: "medium",
    stemEn:
      "The stopping sight distance (SSD) on a highway is primarily a function of:",
    optionA: "design speed and coefficient of friction only",
    optionB: "design speed, reaction time and coefficient of friction",
    optionC: "radius of horizontal curve only",
    optionD: "width of pavement only",
    correctOption: "B",
    explanation: "SSD = v t + v²/(2 g f) — depends on speed, perception-reaction time, and friction.",
    trick: "SSD = lag distance + braking distance.",
    solutionDetail:
      "SSD = distance travelled during perception–reaction time + braking distance.\nSSD = v t + v² / (2 g f) (level road).\nHence it depends on design speed v, reaction time t, and longitudinal friction f (and grade if present).\nRadius affects ISD/OSD more directly than SSD on straight grade.",
  },
  {
    subject: "surveying",
    topic: "levelling",
    difficulty: "easy",
    stemEn:
      "In levelling, if the backsight reading is 1.255 m and foresight is 2.455 m, the change in elevation from BM to the foresight station is:",
    optionA: "rise of 1.200 m",
    optionB: "fall of 1.200 m",
    optionC: "rise of 3.710 m",
    optionD: "fall of 3.710 m",
    correctOption: "B",
    explanation: "Fall = FS − BS = 2.455 − 1.255 = 1.200 m.",
    trick: "If FS > BS → fall.",
    solutionDetail:
      "Height of instrument HI = RL_BM + BS.\nRL_FS = HI − FS.\nDifference = BS − FS = 1.255 − 2.455 = −1.200 m → fall of 1.200 m.\nRule: larger foresight means lower ground.",
  },
  {
    subject: "structural_analysis",
    topic: "indeterminate",
    difficulty: "hard",
    stemEn:
      "The degree of static indeterminacy of a rigid jointed plane frame having 9 members, 3 reaction components and 8 joints is:",
    optionA: "6",
    optionB: "8",
    optionC: "9",
    optionD: "12",
    correctOption: "A",
    explanation: "D_s = (3m + r) − 3j = (27 + 3) − 24 = 6.",
    trick: "Plane rigid frame: D_s = (3m + r) − 3j.",
    solutionDetail:
      "For a rigid-jointed plane frame, static indeterminacy D_s = (3m + r) − 3j.\nWith m = 9, r = 3, j = 8: D_s = 27 + 3 − 24 = 6.\nHence option A.",
  },
  {
    subject: "hydrology",
    topic: "hydrographs",
    difficulty: "medium",
    stemEn:
      "The unit hydrograph of a basin is a hydrograph of direct runoff resulting from:",
    optionA: "1 cm of rainfall excess occurring uniformly over the basin at a uniform rate for a specified duration",
    optionB: "1 cm of rainfall occurring for an infinite duration",
    optionC: "any amount of rainfall excess in one hour",
    optionD: "1 mm of rainfall excess of any duration",
    correctOption: "A",
    explanation: "Definition of D-hour unit hydrograph: 1 cm excess rainfall over duration D, uniform in space and time.",
    trick: "UH → 1 cm excess, uniform, specified duration.",
    solutionDetail:
      "A D-hr unit hydrograph is the direct runoff hydrograph produced by 1 cm of excess rainfall distributed uniformly over the catchment at a uniform rate during D hours.\nLinearity and time-invariance assumptions allow convolution for other storms.",
  },
  {
    subject: "building_materials",
    topic: "cement-concrete",
    difficulty: "easy",
    stemEn:
      "The initial setting time of ordinary Portland cement as per IS specifications should not be less than:",
    optionA: "15 minutes",
    optionB: "30 minutes",
    optionC: "45 minutes",
    optionD: "60 minutes",
    correctOption: "B",
    explanation: "IS 4031 / IS 269: initial setting time of OPC ≥ 30 minutes; final ≤ 600 minutes.",
    trick: "OPC: initial ≥ 30 min; final ≤ 10 h.",
    solutionDetail:
      "As per IS specifications for Ordinary Portland Cement, initial setting time shall not be less than 30 minutes and final setting time shall not be more than 600 minutes (10 hours).\nHence B.",
  },
];

function padDemo(
  paper: "ce_paper1" | "ce_paper2",
  count: number,
  source: string,
): IesMcq[] {
  const subjects = iesSubjectsForPaper(paper);
  const pool = DEMO_BANK.filter((q) =>
    subjects.some((s) => s.key === (q.subject as IesSubjectKey)),
  );
  const use = pool.length ? pool : DEMO_BANK;
  const out: IesMcq[] = [];
  for (let i = 0; i < count; i++) {
    const base = use[i % use.length]!;
    const cls = classifyIesStem(base.stemEn);
    out.push({
      ...base,
      subject: base.subject || cls.subject,
      topic: base.topic || cls.topic,
      qIndex: i + 1,
      sectionKey: "ies_ce",
      marks: 2,
      negativeMarks: NEG,
      source,
      stemEn:
        i < use.length
          ? base.stemEn
          : `[Variant ${Math.floor(i / use.length) + 1}] ${base.stemEn}`,
    });
  }
  return out;
}

export function buildIesDemoPaper(
  paper: "ce_paper1" | "ce_paper2",
  setNo: number,
  questionCount = 150,
): IesMcq[] {
  return padDemo(paper, questionCount, `seed_demo_${setNo}`);
}

export function buildIesPracticeSet(
  subjectKey: IesSubjectKey,
  setNo: number,
  questionCount = 10,
): IesMcq[] {
  const pool = DEMO_BANK.filter((q) => q.subject === subjectKey);
  const use = pool.length ? pool : DEMO_BANK;
  return Array.from({ length: questionCount }, (_, i) => {
    const base = use[i % use.length]!;
    return {
      ...base,
      qIndex: i + 1,
      sectionKey: "ies_ce",
      subject: subjectKey,
      marks: 2,
      negativeMarks: NEG,
      source: `ies_practice_${setNo}`,
      stemEn:
        i < use.length
          ? base.stemEn
          : `[Drill ${setNo}.${i + 1}] ${base.stemEn}`,
    };
  });
}
