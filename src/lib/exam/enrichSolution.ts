import { trickForTopic } from "./taxonomy";
import {
  bestPatternForTopic,
} from "./revisionNotes";

export type SolutionContext = {
  topic: string;
  subtopic?: string | null;
  subject?: string | null;
  sectionKey?: string | null;
  stem: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctOption: string;
  explanation?: string | null;
  trick?: string | null;
};

function hay(ctx: SolutionContext): string {
  return `${ctx.topic} ${ctx.subtopic || ""} ${ctx.stem} ${correctText(ctx)}`.toLowerCase();
}

function opt(ctx: SolutionContext, letter: string): string {
  if (letter === "A") return ctx.optionA;
  if (letter === "B") return ctx.optionB;
  if (letter === "C") return ctx.optionC;
  return ctx.optionD;
}

function correctText(ctx: SolutionContext): string {
  return opt(ctx, ctx.correctOption || "A");
}

function otherOptions(ctx: SolutionContext): { letter: string; text: string }[] {
  return (["A", "B", "C", "D"] as const)
    .filter((l) => l !== ctx.correctOption)
    .map((letter) => ({ letter, text: opt(ctx, letter) }));
}

type FactNote = {
  test: RegExp;
  why: string;
  related: string[];
  remember: string;
};

/** SSC-style mini notes keyed off THIS question’s wording — not a generic topic dump. */
const FACT_NOTES: FactNote[] = [
  {
    test: /article\s*368|amendment procedure|amending the constitution/i,
    why: "Article 368 (Part XX) is the procedure to amend the Constitution. Parliament may amend by simple majority, special majority, or special majority + state ratification depending on the provision.",
    related: [
      "Art. 352 = National Emergency; 356 = President’s Rule; 360 = Financial Emergency — these are NOT the amendment article.",
      "Basic structure (Kesavananda Bharati, 1973) cannot be destroyed even by 368.",
      "Some federal provisions need ratification by half the states.",
    ],
    remember: "368 = ‘amend’; 352/356/360 = emergencies. SSC loves swapping these four.",
  },
  {
    test: /ninth schedule|9th schedule/i,
    why: "The Ninth Schedule was added by the First Constitutional Amendment, 1951, mainly to protect land-reform laws from being struck down as violating Fundamental Rights.",
    related: [
      "1st Amendment (1951): Arts. 15/19 tweaks, Ninth Schedule, reasonable restrictions.",
      "I.R. Coelho (2007): laws in Ninth Schedule after 24 April 1973 can still be tested on basic structure.",
      "Do not confuse with 9th Schedule vs 7th Schedule (Union/State/Concurrent lists).",
    ],
    remember: "Ninth Schedule → 1st Amendment (1951). 42nd is ‘Mini Constitution’, not this.",
  },
  {
    test: /third schedule|3rd schedule|oath/i,
    why: "Third Schedule lists forms of oaths and affirmations (MPs, ministers, judges, CAG, etc.).",
    related: [
      "2nd Schedule = emoluments of President, Governors, judges, CAG.",
      "4th Schedule = Rajya Sabha seat allocation to states/UTs.",
      "5th/6th = Scheduled Areas / tribal areas administration.",
    ],
    remember: "3rd = oaths. 4th = RS seats. 7th = three lists.",
  },
  {
    test: /article\s*280|finance commission/i,
    why: "Article 280 constitutes a Finance Commission every five years (or earlier) to recommend Centre–State tax sharing, grants-in-aid, and related fiscal devolution.",
    related: [
      "Finance Commission is a constitutional body (not NITI Aayog).",
      "Art. 148 = CAG; Art. 315 = UPSC/SPSC; Art. 324 = Election Commission.",
      "Chairman + 4 other members; recommendations are recommendatory, not binding like a court.",
    ],
    remember: "280 → Finance Commission. 324 → Election Commission. Don’t mix bodies.",
  },
  {
    test: /fundamental dut|42nd|article\s*51a|part\s*iva/i,
    why: "Fundamental Duties (Part IVA, Article 51A) were added by the 42nd Amendment, 1976, on the Swaran Singh Committee’s recommendation. Originally 10 duties; 11th (education of child 6–14) by 86th Amendment, 2002.",
    related: [
      "42nd Amendment (1976) also added Socialist, Secular, Integrity to the Preamble — often called Mini Constitution.",
      "44th Amendment (1978) restored many 42nd changes (e.g. property, emergency safeguards) — common distractor.",
      "Duties are non-justiciable (like DPSP), but courts use them in interpretation.",
    ],
    remember: "Duties = 42nd (1976) + Art. 51A. 44th is the ‘undo Mini Constitution’ amendment.",
  },
  {
    test: /article\s*21|life and personal liberty|protection of life/i,
    why: "Article 21: ‘No person shall be deprived of his life or personal liberty except according to procedure established by law.’ After Maneka Gandhi (1978) this means fair, just and reasonable procedure — not mere law.",
    related: [
      "Art. 14 = equality; 19 = 6 freedoms (citizens); 21 = life/liberty (all persons); 32 = constitutional remedies (heart & soul — Ambedkar).",
      "Art. 21A (86th Amendment) = Right to Education 6–14.",
      "Gopalan (1950) was a narrow reading; Maneka expanded 21.",
    ],
    remember: "21 = life + liberty. 19 = freedoms. 32 = remedy. SSC often swaps 19 and 21.",
  },
  {
    test: /lahore|purna swaraj|1929/i,
    why: "The 1929 Lahore session of Congress, with Jawaharlal Nehru as President, adopted Purna Swaraj (complete independence). 26 January 1930 was observed as Independence Day; later 26 January became Republic Day.",
    related: [
      "Non-Cooperation = 1920 (after Jallianwala / Khilafat).",
      "Quit India = 8 August 1942, Bombay (Wardha resolution).",
      "Lucknow Pact = 1916 (Congress–Muslim League).",
    ],
    remember: "Lahore 1929 Nehru → Purna Swaraj. Don’t tag 1920 or 1942 onto Lahore.",
  },
  {
    test: /rowlatt/i,
    why: "Rowlatt Act (Anarchical and Revolutionary Crimes Act) was passed in 1919. It allowed detention without trial. Gandhi launched the Rowlatt Satyagraha; Jallianwala Bagh (13 April 1919) followed in the same climate.",
    related: [
      "Montagu–Chelmsford / Government of India Act 1919 is a different 1919 event (dyarchy).",
      "Hunter Committee inquired into Jallianwala.",
    ],
    remember: "Rowlatt = 1919 = ‘no vakil, no appeal, no dalil’ (popular memory line).",
  },
  {
    test: /forward bloc/i,
    why: "Subhas Chandra Bose founded the Forward Bloc in 1939 after resigning as Congress President (Tripuri, 1939) following conflict with Gandhi’s group.",
    related: [
      "INA / Azad Hind later — still Bose, but a different organisation/year.",
      "C.R. Das: Swaraj Party (1923) with Motilal Nehru — common wrong option.",
    ],
    remember: "Forward Bloc 1939 = Bose. Swaraj Party 1923 = C.R. Das + Motilal.",
  },
  {
    test: /vernacular press/i,
    why: "Vernacular Press Act 1878 (Lord Lytton) gagged Indian-language newspapers. Repealed by Lord Ripon (1881).",
    related: [
      "Lytton also: Delhi Durbar 1877, Arms Act, Vernacular Press — unpopular Viceroy cluster.",
      "Ripon: local self-government, Ilbert Bill, repealed Vernacular Press.",
    ],
    remember: "Lytton gagged the press (1878); Ripon undid it. Ilbert = Ripon, not Lytton.",
  },
  {
    test: /ilbert/i,
    why: "Ilbert Bill (1883) under Lord Ripon sought to let Indian judges try European accused in mofussil courts. White opposition forced a compromise — a landmark of racial politics.",
    related: [
      "Ripon = liberal viceroy cluster (Ilbert, local bodies, press repeal).",
      "Lytton is the opposite cluster (Vernacular Press).",
    ],
    remember: "Ilbert → Ripon (1883). Vernacular Press → Lytton (1878).",
  },
  {
    test: /sorrow of bihar|kosi/i,
    why: "The Kosi is called the ‘Sorrow of Bihar’ because of frequent course changes and floods from the Himalayas into north Bihar.",
    related: [
      "Damodar = ‘Sorrow of Bengal’ (now tamed by DVC).",
      "Huang He = Sorrow of China (world GK distractor).",
      "Gandak, Ghaghara, Son are important Bihar rivers but not this epithet.",
    ],
    remember: "Kosi–Bihar; Damodar–Bengal. Epithet questions are one-line memory.",
  },
  {
    test: /black cotton|regur/i,
    why: "Regur / black cotton soil is clayey, moisture-retentive, formed on Deccan Trap lava — ideal for cotton in Maharashtra, MP, Gujarat, north Karnataka.",
    related: [
      "Alluvial = Indo-Gangetic / coastal plains (wheat, rice).",
      "Laterite = high rainfall wash (Western Ghats, Odisha, Meghalaya).",
      "Arid soil = Rajasthan.",
    ],
    remember: "Black soil = lava Deccan = cotton. Not the Gangetic plain.",
  },
  {
    test: /zoji\s*la|srinagar.*leh|kashmir.*ladakh/i,
    why: "Zoji La connects the Kashmir Valley (Srinagar side) with Ladakh (Leh). NH-1 corridor.",
    related: [
      "Nathu La = Sikkim–Tibet (China).",
      "Rohtang = Kullu–Lahaul (Himachal).",
      "Shipki La = Himachal–Tibet (Sutlej).",
    ],
    remember: "Zoji La = Kashmir–Ladakh. Nathu La = Sikkim. Don’t mix Himalayan passes.",
  },
  {
    test: /tropic of cancer/i,
    why: "Tropic of Cancer (23°30′ N) crosses 8 Indian states: Gujarat, Rajasthan, MP, Chhattisgarh, Jharkhand, West Bengal, Tripura, Mizoram. Odisha, Maharashtra, Bihar, UP are frequent traps.",
    related: [
      "It does NOT pass through Odisha, Bihar, UP, Maharashtra, AP, or Telangana.",
      "Passes through the capital of MP? No — Bhopal is south of it? Check map; question type is state list.",
    ],
    remember: "8 states; Odisha is the classic ‘does NOT pass’ answer.",
  },
  {
    test: /jaduguda|jadugoda/i,
    why: "Jaduguda (East Singhbhum, Jharkhand) is India’s well-known uranium mining centre (UCIL).",
    related: [
      "Khetri (Rajasthan) = copper; Kolar = gold (historic); Jharia/Raniganj = coal.",
      "Other U sites: Tummalapalle (AP), Domiasiat (Meghalaya) — less often asked than Jaduguda.",
    ],
    remember: "Jaduguda = uranium = Jharkhand.",
  },
  {
    test: /western disturbance/i,
    why: "Western Disturbances are extra-tropical storms from the Mediterranean / West Asia that bring winter–spring rain/snow to NW India (wheat belt, Western Himalaya).",
    related: [
      "Monsoon rains ≠ Western Disturbance.",
      "Bay of Bengal depressions = east-coast cyclones, different mechanism.",
    ],
    remember: "WD = Mediterranean winter rain for north India, not Bay of Bengal.",
  },
  {
    test: /monetary policy committee|\bmpc\b/i,
    why: "RBI’s MPC has 6 members: 3 from RBI (including Governor as Chair) + 3 external members appointed by the Government. Repo decisions by 3–3 vote; Governor has a casting vote.",
    related: [
      "Statutory since Finance Act 2016; inflation target 4% ±2% (CPI).",
      "Not 5 or 7 — SSC tests the even number 6.",
    ],
    remember: "MPC = 6 (3+3). Casting vote = Governor.",
  },
  {
    test: /repo rate/i,
    why: "Repo is the rate at which RBI lends short-term to commercial banks against securities (banks sell securities to RBI with a repurchase agreement).",
    related: [
      "Reverse repo: banks park surplus with RBI — RBI borrows, banks earn reverse-repo.",
      "Bank rate is longer-term; MSF is emergency window above repo.",
      "Direction of money: RBI → banks = repo.",
    ],
    remember: "Repo = RBI lends to banks. Reverse = banks lend to RBI. Money-flow test.",
  },
  {
    test: /\bgst\b|goods and services tax/i,
    why: "GST came into force on 1 July 2017 (101st Constitutional Amendment, 2016 enabled it). One indirect tax subsuming many Centre/State levies.",
    related: [
      "GST Council: Art. 279A; chaired by Union Finance Minister.",
      "1 April 2017 is a trap (financial-year start, not GST day).",
      "Petroleum, alcohol for human consumption largely outside GST (as asked often).",
    ],
    remember: "GST live date = 1 July 2017. Amendment year 2016 ≠ implementation date.",
  },
  {
    test: /economic survey/i,
    why: "The Economic Survey is prepared by the Department of Economic Affairs, Ministry of Finance (Chief Economic Adviser’s team) and tabled before the Union Budget.",
    related: [
      "Budget = Finance Minister; Survey = CEA / DEA — two different documents.",
      "NITI Aayog does strategy papers, not the Survey. RBI does the Monetary Policy Report.",
    ],
    remember: "Survey = DEA / Finance Ministry. Not NITI, not RBI.",
  },
  {
    test: /mgnrega|100 days/i,
    why: "MGNREGA (2005) is a demand-driven rural employment guarantee of up to 100 days of unskilled manual work per household in a financial year.",
    related: [
      "Legal right to work (not a mere scheme slogan) — that’s why SSC asks 100, not 150/200.",
      "Wages as per state; unemployment allowance if work not provided in time.",
    ],
    remember: "MGNREGA = 100 days / household / year.",
  },
  {
    test: /candela|luminous intensity/i,
    why: "Candela (cd) is the SI base unit of luminous intensity. Lumen is luminous flux; lux is lux = lumen/m² (illuminance). Watt is power — a classic mix-up.",
    related: [
      "Seven SI bases: m, kg, s, A, K, mol, cd.",
      "Lumen/lux are derived, not base units.",
    ],
    remember: "Intensity = candela. Flux = lumen. Illuminance = lux.",
  },
  {
    test: /biogas/i,
    why: "Biogas is mostly methane (CH₄, typically ~50–70%) plus CO₂ and traces of H₂S. It is not ethane/propane/butane (those are LPG/CNG family distractors).",
    related: [
      "CNG for vehicles is also mainly methane, but biogas is anaerobic digestion of waste.",
      "Gobas gas plants = cattle dung + anaerobic microbes.",
    ],
    remember: "Biogas ≈ methane. LPG ≈ propane+butane.",
  },
  {
    test: /\bph\b|neutral solution/i,
    why: "At 25°C, pure water is neutral with pH 7 (pH = −log[H⁺]; [H⁺]=10⁻⁷). Acids <7, bases >7. pH 0 or 14 are extremes, not ‘neutral’.",
    related: [
      "pH depends slightly on temperature; SSC still expects 7.",
      "pOH + pH = 14 at 25°C.",
    ],
    remember: "Neutral @25°C = 7. 0 and 14 are trap extremes.",
  },
  {
    test: /night blindness|nyctalopia|vitamin a/i,
    why: "Vitamin A (retinol) deficiency causes night blindness (nyctalopia) and xerophthalmia. β-carotene from carrots is a precursor.",
    related: [
      "C = scurvy; D = rickets/osteomalacia; K = clotting; B1 = beriberi; B3 = pellagra; B12 = pernicious anaemia.",
    ],
    remember: "A → night vision. C → scurvy. D → bones. Map vitamin → disease.",
  },
  {
    test: /third law|action and reaction/i,
    why: "Newton’s third law: every action has an equal and opposite reaction (same line, different bodies). Recoil of a gun, walking, rocket thrust are textbook examples.",
    related: [
      "1st law = inertia; 2nd = F=ma; 3rd = action–reaction.",
      "Forces are on two different bodies — they do not cancel on the same object.",
    ],
    remember: "1 inertia, 2 F=ma, 3 pairs. Don’t put gravitation as ‘3rd law’.",
  },
  {
    test: /washing soda|na2co3|na₂co₃/i,
    why: "Washing soda is sodium carbonate decahydrate, Na₂CO₃·10H₂O. Baking soda is NaHCO₃; caustic soda NaOH; bleaching powder CaOCl₂.",
    related: [
      "Washing soda = laundry / water softening. Baking soda = cooking / mild antacid.",
      "SSC always swaps these four household chemicals.",
    ],
    remember: "Washing = carbonate (Na₂CO₃·10H₂O). Baking = bicarbonate (NaHCO₃).",
  },
  {
    test: /nobel.*literature|tagore/i,
    why: "Rabindranath Tagore won the Nobel Prize in Literature in 1913 for Gitanjali (English). First Asian Nobel laureate in Literature; first Indian Nobel of any kind.",
    related: [
      "C.V. Raman = Physics 1930 (Raman effect) — not Literature.",
      "Amartya Sen = Economics 1998. Mother Teresa = Peace 1979.",
    ],
    remember: "Literature Nobel 1913 = Tagore. Raman is Physics.",
  },
  {
    test: /bharat ratna/i,
    why: "Bharat Ratna, India’s highest civilian award, was instituted in 1954. First recipients included C. Rajagopalachari, S. Radhakrishnan, and C.V. Raman.",
    related: [
      "Padma awards also 1954. Bharat Ratna has no yearly quota like Padma.",
      "1950 is Republic year trap; 1947 Independence trap.",
    ],
    remember: "Bharat Ratna instituted 1954 — not 1947/1950.",
  },
  {
    test: /discovery of india/i,
    why: "The Discovery of India was written by Jawaharlal Nehru (mostly in Ahmednagar Fort prison, 1942–46). It traces India’s civilisation and freedom struggle.",
    related: [
      "Gandhi: Hind Swaraj, My Experiments with Truth. Ambedkar: Annihilation of Caste, Thoughts on Pakistan.",
      "Radhakrishnan: philosophical works — frequent book-author trap.",
    ],
    remember: "Discovery of India = Nehru. Annihilation of Caste = Ambedkar.",
  },
  {
    test: /annihilation of caste/i,
    why: "Annihilation of Caste (1936) is B.R. Ambedkar’s radical critique of the caste system, originally a speech for Jat-Pat Todak Mandal that was not delivered as planned and then published.",
    related: [
      "Phule: Gulamgiri. Periyar: Self-Respect movement — related theme, wrong author.",
      "Gandhi debated Ambedkar on caste (Harijan / village vs annihilation).",
    ],
    remember: "Annihilation of Caste = Ambedkar, 1936.",
  },
];

function matchFact(ctx: SolutionContext): FactNote | undefined {
  const blob = `${ctx.stem} ${correctText(ctx)} ${ctx.topic} ${ctx.explanation || ""}`;
  return FACT_NOTES.find((f) => f.test.test(blob));
}

function isGaLike(ctx: SolutionContext): boolean {
  const s = `${ctx.sectionKey || ""} ${ctx.subject || ""} ${ctx.topic}`.toLowerCase();
  return /ga|awareness|polity|history|geography|econom|science|gk|current|award|book|static/.test(
    s,
  );
}

function isQuantLike(ctx: SolutionContext): boolean {
  const s = `${ctx.sectionKey || ""} ${ctx.subject || ""} ${ctx.topic}`.toLowerCase();
  return /quant|aptitude|math|arith|algebra|geo|mensur|trigo|di\b|percent|interest|profit|work|speed/.test(
    s,
  );
}

function isReasoningLike(ctx: SolutionContext): boolean {
  const s = `${ctx.sectionKey || ""} ${ctx.subject || ""} ${ctx.topic}`.toLowerCase();
  return /reason|puzzle|coding|series|syllog|blood|direction|seating|analogy|mirror/.test(s);
}

function youtubeFor(ctx: SolutionContext): { title: string; url: string } {
  const q = encodeURIComponent(`SSC CGL ${ctx.topic} ${correctText(ctx)}`.slice(0, 80));
  return {
    title: `SSC notes: ${ctx.topic}`,
    url: `https://www.youtube.com/results?search_query=${q}`,
  };
}

/** Quant: keep numeric steps when the stored line has working. */
function quantSteps(ctx: SolutionContext): string | null {
  const raw = (ctx.explanation || "").trim();
  const topic = ctx.topic;
  const stemText = ctx.stem;
  const t = topic.toLowerCase();

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
        `What is asked: compound interest (not SI) from this stem.`,
        `Step 1 — 2-year shortcut: CI% on P = 2R + R²/100 = 2×${r} + ${r}²/100 = ${ciPct}%.`,
        "Step 2: CI = P × (that %)/100. Or compute A = P(1+R/100)² then CI = A−P.",
        m
          ? `Step 3: Here CI = ${m[2]}. Correct option (${ctx.correctOption}) ${correctText(ctx)}.`
          : `Step 3: Match CI with (${ctx.correctOption}) ${correctText(ctx)}; reject the SI distractor PRT/100.`,
        "Why others look tempting: one option is usually SI; another forgets the R²/100 extra.",
      ].join("\n");
    }
  }

  if (/profit|loss|discount|rebate/i.test(topic + " " + stemText)) {
    const gain = stemText.match(/(\d+(?:\.\d+)?)\s*%\s*profit/i);
    const rebate =
      stemText.match(/reduced by\s*(\d+(?:\.\d+)?)\s*%/i) ||
      stemText.match(/(\d+(?:\.\d+)?)\s*%\s*(?:of that SP|rebate)/i);
    if (gain && rebate) {
      const g = Number(gain[1]);
      const r = Number(rebate[1]);
      const net = Math.round((g - r - (g * r) / 100) * 100) / 100;
      return [
        "What is asked: net % profit/loss after a gain and then a reduction — successive change, not g−r.",
        `Step 1: overall % = g − r − (g×r)/100.`,
        `Step 2: g=${g}, r=${r} → ${g} − ${r} − (${g}×${r})/100 = ${net}%.`,
        `Step 3: Correct is (${ctx.correctOption}) ${correctText(ctx)}. Sign: + profit, − loss.`,
        "Trap: answering g−r (drops the cross term). Don’t compute huge SP unless options force it.",
      ].join("\n");
    }
  }

  if (raw.length >= 80 && /\n|Step /.test(raw)) return raw;
  return null;
}

function buildGaNotes(ctx: SolutionContext): string {
  const fact = matchFact(ctx);
  const stored = (ctx.explanation || "").trim();
  const traps = otherOptions(ctx)
    .map((o) => `(${o.letter}) ${o.text}`)
    .join("\n");
  const related = fact?.related?.length
    ? fact.related.map((r) => `• ${r}`).join("\n")
    : defaultRelated(ctx);

  return [
    `Notes for this question · ${ctx.topic}${ctx.subtopic ? ` / ${ctx.subtopic}` : ""}`,
    "",
    "1. What SSC is testing",
    `The stem asks: ${ctx.stem}`,
    "This is a static-fact / concept recall item. You must know the exact pairing, not a nearby cousin fact.",
    "",
    "2. Correct answer — why it is right",
    `(${ctx.correctOption}) ${correctText(ctx)}`,
    fact?.why ||
      (stored
        ? expandOneLiner(stored, ctx)
        : `This option is the standard SSC pairing for this ${ctx.topic} fact.`),
    stored && fact ? `Bank line: ${stored}` : "",
    "",
    "3. Related notes (revise these with the same card)",
    related,
    "",
    "4. Why the other options are typical traps",
    traps || "Remaining options are nearby articles / years / look-alike names.",
    "SSC puts the ‘neighbour’ fact (next article, next year, similar viceroy, similar river) as a distractor.",
    "",
    "5. How to lock it for the exam",
    fact?.remember || memoryLine(ctx),
  ]
    .filter((line) => line !== "")
    .join("\n");
}

function defaultRelated(ctx: SolutionContext): string {
  const t = ctx.topic.toLowerCase();
  if (/polit/.test(t)) {
    return [
      "• Cluster FR 12–35, DPSP 36–51, President 52–62, Parliament 79–122, amendment 368.",
      "• Bodies: 280 Finance Commission, 324 Election Commission, 148 CAG, 315 UPSC.",
      "• Schedules: 3 oaths, 4 RS seats, 7 lists, 8 languages, 9 land-reform shield, 10 anti-defection.",
    ].join("\n");
  }
  if (/hist/.test(t)) {
    return [
      "• Timeline anchors: 1857, 1885 INC, 1905 Partition, 1919 Rowlatt/Jallianwala, 1920 NCM, 1930 Dandi, 1942 QIM, 1947.",
      "• Session-personality pairs: 1929 Lahore–Nehru–Purna Swaraj; 1907 Surat split; 1916 Lucknow Pact.",
      "• Viceroy pairs: Lytton–Vernacular Press; Ripon–Ilbert; Curzon–Partition of Bengal.",
    ].join("\n");
  }
  if (/geo/.test(t)) {
    return [
      "• Rivers + epithets (Kosi–Bihar, Damodar–Bengal) and Himalayan passes (Zoji/Nathu/Rohtang/Shipki).",
      "• Soils: alluvial plains, black/regur Deccan, laterite heavy rain, arid Rajasthan.",
      "• Tropic of Cancer = 8 states; Odisha is the usual exception.",
    ].join("\n");
  }
  if (/econ/.test(t)) {
    return [
      "• Repo vs reverse repo (money flow), CRR/SLR as % of NDTL, MPC = 6 members.",
      "• GST 1 July 2017; Survey = DEA/Finance; Budget = FM.",
      "• MGNREGA 100 days — statutory guarantee.",
    ].join("\n");
  }
  if (/scien|phys|chem|bio/.test(t)) {
    return [
      "• SI bases include candela; don’t confuse lumen/lux/watt.",
      "• Household chemistry: washing soda Na₂CO₃·10H₂O vs baking soda NaHCO₃ vs bleaching powder CaOCl₂.",
      "• Vitamins: A night blindness, C scurvy, D rickets, K clotting.",
    ].join("\n");
  }
  return `• Revise neighbouring ${ctx.topic} facts of the same type (year, person, article, place) so traps stop working.`;
}

function expandOneLiner(raw: string, ctx: SolutionContext): string {
  if (raw.length >= 160) return raw;
  return `${raw} In other words, map the keyword in the stem directly to (${ctx.correctOption}) ${correctText(ctx)}. Do not pick a related-but-wrong neighbour from the options.`;
}

function memoryLine(ctx: SolutionContext): string {
  return `Make a 5-word flashcard: “${ctx.topic} → ${correctText(ctx)}”. If an option is a famous neighbour (next article, next year, similar name), it is probably the trap.`;
}

function buildReasoningNotes(ctx: SolutionContext): string {
  const raw = (ctx.explanation || "").trim();
  return [
    `Solution · ${ctx.topic}`,
    "",
    "1. What to do on paper",
    "Copy the given statements/figure into a scratch diagram (arrows, generations, Venn, or seating circle). Do not solve in the head if there are ≥3 names.",
    "",
    "2. Working for THIS question",
    raw
      ? expandOneLiner(raw, ctx)
      : `Use the standard ${ctx.topic} method until only (${ctx.correctOption}) ${correctText(ctx)} survives.`,
    "",
    `3. Answer: (${ctx.correctOption}) ${correctText(ctx)}`,
    "",
    "4. Traps in the options",
    otherOptions(ctx)
      .map((o) => `(${o.letter}) ${o.text} — usually a ‘possible’ case treated as certain, or a left/right facing mix-up.`)
      .join("\n"),
    "",
    "5. Exam habit",
    "Mark possibility vs certainty. In syllogisms, ‘some’ never proves ‘all’. In blood relations, draw two generations before reading the question line.",
  ].join("\n");
}

function buildEnglishNotes(ctx: SolutionContext): string {
  const raw = (ctx.explanation || "").trim();
  return [
    `Notes · ${ctx.topic}`,
    "",
    "1. Rule this question is built on",
    raw || `The correct usage/meaning is (${ctx.correctOption}) ${correctText(ctx)}.`,
    "",
    "2. Why the answer fits the stem",
    `Stem: ${ctx.stem}`,
    `Pick (${ctx.correctOption}) ${correctText(ctx)} because it matches collocation / grammar / idiom sense — not the literal word-by-word gloss.`,
    "",
    "3. Why others fail",
    otherOptions(ctx)
      .map((o) => `(${o.letter}) ${o.text}`)
      .join("\n"),
    "Typical SSC traps: ‘than’ vs ‘to’ after senior/prefer; subject–verb after ‘along with’; idiom taken literally.",
    "",
    "4. Mini revision",
    "For error-spotting: SVA, preposition pairs (prefer to, senior to), article, tense. For idioms: learn the chunk meaning, dump the picture in your head.",
  ].join("\n");
}

function buildGenericNotes(ctx: SolutionContext): string {
  const raw = (ctx.explanation || "").trim();
  const quant = quantSteps(ctx);
  if (quant) return quant;
  if (raw.length >= 120 && raw.includes("\n")) return raw;

  return [
    `Solution · ${ctx.topic}${ctx.subtopic ? ` / ${ctx.subtopic}` : ""}`,
    "",
    "1. Read what is asked",
    ctx.stem,
    "",
    "2. Method",
    raw
      ? expandOneLiner(raw, ctx)
      : `Apply the standard ${ctx.topic} method. Substitute the given numbers/facts; cancel early; match options.`,
    "",
    `3. Correct option: (${ctx.correctOption}) ${correctText(ctx)}`,
    "",
    "4. Eliminate",
    otherOptions(ctx)
      .map((o) => `(${o.letter}) ${o.text}`)
      .join("\n"),
    "Drop options that come from a naive shortcut (adding % instead of successive %, SI instead of CI, wrong unit, neighbour fact).",
  ].join("\n");
}

export function enrichExplanationFromQuestion(ctx: SolutionContext): string {
  if (isGaLike(ctx)) return buildGaNotes(ctx);
  if (isReasoningLike(ctx) && !isQuantLike(ctx)) return buildReasoningNotes(ctx);
  if (/english|error|idiom|synonym|antonym|cloze|vocab|grammar/i.test(
    `${ctx.sectionKey} ${ctx.subject} ${ctx.topic}`,
  )) {
    return buildEnglishNotes(ctx);
  }
  return buildGenericNotes(ctx);
}

/** @deprecated use enrichExplanationFromQuestion — kept for any leftover callers. */
export function enrichExplanation(
  topic: string,
  explanation: string | null | undefined,
  stem?: string | null,
): string {
  return enrichExplanationFromQuestion({
    topic,
    stem: stem || "",
    optionA: "",
    optionB: "",
    optionC: "",
    optionD: "",
    correctOption: "A",
    explanation,
  });
}

function uniqueQuantTrick(ctx: SolutionContext): string {
  const pattern = bestPatternForTopic(`${ctx.topic} ${ctx.stem}`);
  const nums = ctx.stem.match(/\d+(?:\.\d+)?%?/g)?.slice(0, 4).join(", ");
  const head = [
    `For THIS question (${ctx.topic}): answer is (${ctx.correctOption}) ${correctText(ctx)}.`,
    nums ? `Use the given values ${nums} in the shortcut — do not restart from CP/SP unless needed.` : "",
  ]
    .filter(Boolean)
    .join("\n");

  if (pattern) {
    return [
      head,
      "",
      `SHORTCUT: ${pattern.examTip}`,
      "",
      "How to use it here:",
      pattern.howToUse,
      "",
      "Worked pattern (same type, not a copy of another mock):",
      pattern.workedExample,
      pattern.video ? `\nWatch: ${pattern.video.title}\n${pattern.video.url}` : "",
    ]
      .filter(Boolean)
      .join("\n");
  }

  const t = (ctx.trick || trickForTopic(ctx.topic)).replace(/^Trick:\s*/i, "");
  return `${head}\n\nSHORTCUT: ${t}\n\nCheck that (${ctx.correctOption}) matches after one-line substitution.`;
}

function uniqueGaTrick(ctx: SolutionContext): string {
  const fact = matchFact(ctx);
  const yt = youtubeFor(ctx);
  const stored = (ctx.trick || "").trim();
  const genericTopic =
    /article clusters|timeline anchors|passes, rivers|repo > reverse|si units/i.test(stored);

  const lines = [
    `Exam trick for THIS Q — not a generic ${ctx.topic} slogan.`,
    "",
    fact?.remember ||
      `Link the stem keyword to (${ctx.correctOption}) ${correctText(ctx)} in one flashcard.`,
    "",
    "Hall move (10 seconds):",
    "1. Underline the unique noun (article no. / year / person / place / formula).",
    `2. If you know the pair, mark (${ctx.correctOption}) and move.`,
    "3. If not, eliminate neighbour facts (next article, similar viceroy, similar river, SI unit cousin).",
    "",
    "Do NOT apply a one-size ‘Polity articles 12–35’ line to every GA question — that does not decide this MCQ.",
  ];

  if (stored && !genericTopic && stored.length > 40 && !stored.startsWith("SHORTCUT: Article")) {
    lines.push("", `Setter’s cue: ${stored.replace(/^Trick:\s*/i, "")}`);
  }

  lines.push("", `Revise this fact: ${yt.title}`, yt.url);
  return lines.join("\n");
}

function uniqueReasoningTrick(ctx: SolutionContext): string {
  const t = ctx.topic.toLowerCase();
  let move = "Draw; don’t stare. Transfer names to paper, then read the question line last.";
  if (/syllog/.test(t)) move = "Venn: some = overlap; all = circle inside; possibility ≠ certainty.";
  if (/blood/.test(t)) move = "Two generations on paper. ‘Only son of father’ is often the person himself.";
  if (/cod/.test(t)) move = "Check +1/−1 of positions OR reverse the word; confirm on the second example in the stem.";
  if (/series/.test(t)) move = "Try ×n±k, then two interleaved series, then n²±1. Don’t mix patterns mid-way.";
  if (/seat|puzzle/.test(t)) move = "Fix one person. Mark facing in/out. Left/right reverse when facing south.";
  if (/direction/.test(t)) move = "Sketch NSEW; net east–west and north–south separately; Pythagoras only if asked distance.";

  return [
    `Trick for this ${ctx.topic} item:`,
    move,
    "",
    `You should land on (${ctx.correctOption}) ${correctText(ctx)}.`,
    "If two options still fit, you treated a ‘possibility’ as a ‘must be true’ — go back to the diagram.",
  ].join("\n");
}

export function enrichTrickFromQuestion(ctx: SolutionContext): string {
  if (isGaLike(ctx)) return uniqueGaTrick(ctx);
  if (isQuantLike(ctx)) return uniqueQuantTrick(ctx);
  if (isReasoningLike(ctx)) return uniqueReasoningTrick(ctx);
  if (/english|error|idiom|synonym|cloze|vocab/i.test(`${ctx.subject} ${ctx.topic}`)) {
    return [
      `For this ${ctx.topic} question, the scoring choice is (${ctx.correctOption}) ${correctText(ctx)}.`,
      "",
      "Hall trick: kill literal meanings and wrong preposition pairs first (prefer/senior/inferior → to, not than).",
      "Then read the whole sentence — SSC cloze/error items are collocation tests, not vocabulary flexing.",
    ].join("\n");
  }
  const t = (ctx.trick || trickForTopic(ctx.topic)).replace(/^Trick:\s*/i, "");
  return `For this question, mark (${ctx.correctOption}) ${correctText(ctx)}.\n\nSHORTCUT: ${t}`;
}

export function enrichTrick(topic: string, trick?: string | null): string {
  return enrichTrickFromQuestion({
    topic,
    stem: "",
    optionA: "",
    optionB: "",
    optionC: "",
    optionD: "",
    correctOption: "A",
    trick,
  });
}
