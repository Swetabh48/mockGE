/**
 * SSC CGL Tier-I syllabus map (official pattern topics).
 * Practice drills: Subject → Topic → Subtopics.
 */

export type PracticeSubjectKey = "quant" | "reasoning" | "english" | "ga";

export type PracticeTopic = {
  id: string;
  title: string;
  subtopics: { id: string; title: string }[];
};

export type PracticeSubject = {
  key: PracticeSubjectKey;
  title: string;
  sectionKey: string;
  topics: PracticeTopic[];
};

export const PRACTICE_SYLLABUS: PracticeSubject[] = [
  {
    key: "quant",
    title: "Quantitative Aptitude",
    sectionKey: "quant",
    topics: [
      {
        id: "number-system",
        title: "Number System & HCF-LCM",
        subtopics: [
          { id: "divisibility", title: "Divisibility" },
          { id: "hcf-lcm", title: "HCF & LCM" },
          { id: "remainders", title: "Remainders" },
        ],
      },
      {
        id: "percentage",
        title: "Percentage",
        subtopics: [
          { id: "basics", title: "Basics & successive" },
          { id: "population", title: "Population / change" },
        ],
      },
      {
        id: "profit-loss",
        title: "Profit, Loss & Discount",
        subtopics: [
          { id: "markup", title: "CP–SP–MP" },
          { id: "discount", title: "Successive discount" },
        ],
      },
      {
        id: "si-ci",
        title: "Simple & Compound Interest",
        subtopics: [
          { id: "si", title: "Simple Interest" },
          { id: "ci", title: "Compound Interest" },
        ],
      },
      {
        id: "ratio",
        title: "Ratio, Proportion & Average",
        subtopics: [
          { id: "ratio", title: "Ratio & partnership" },
          { id: "average", title: "Averages" },
        ],
      },
      {
        id: "time-work",
        title: "Time & Work",
        subtopics: [
          { id: "pipes", title: "Pipes & cisterns" },
          { id: "work", title: "Work & wages" },
        ],
      },
      {
        id: "speed",
        title: "Time, Speed & Distance",
        subtopics: [
          { id: "trains", title: "Trains" },
          { id: "boats", title: "Boats & streams" },
        ],
      },
      {
        id: "algebra",
        title: "Algebra",
        subtopics: [
          { id: "identities", title: "Identities" },
          { id: "equations", title: "Linear / quadratic" },
        ],
      },
      {
        id: "geometry",
        title: "Geometry & Mensuration",
        subtopics: [
          { id: "triangles", title: "Triangles" },
          { id: "circles", title: "Circles" },
          { id: "mensuration", title: "3D mensuration" },
        ],
      },
      {
        id: "trigo",
        title: "Trigonometry",
        subtopics: [
          { id: "ratios", title: "Ratios & identities" },
          { id: "heights", title: "Heights & distances" },
        ],
      },
      {
        id: "di",
        title: "Data Interpretation",
        subtopics: [
          { id: "tables", title: "Tables & graphs" },
          { id: "pie", title: "Pie / bar charts" },
        ],
      },
    ],
  },
  {
    key: "reasoning",
    title: "General Intelligence & Reasoning",
    sectionKey: "reasoning",
    topics: [
      {
        id: "analogy",
        title: "Analogy & Classification",
        subtopics: [
          { id: "semantic", title: "Semantic analogy" },
          { id: "number", title: "Number / letter" },
        ],
      },
      {
        id: "series",
        title: "Series",
        subtopics: [
          { id: "number-series", title: "Number series" },
          { id: "letter-series", title: "Letter series" },
        ],
      },
      {
        id: "coding",
        title: "Coding–Decoding",
        subtopics: [
          { id: "letter-code", title: "Letter coding" },
          { id: "number-code", title: "Number coding" },
        ],
      },
      {
        id: "blood",
        title: "Blood Relations",
        subtopics: [{ id: "family", title: "Family tree" }],
      },
      {
        id: "direction",
        title: "Direction & Distance",
        subtopics: [{ id: "path", title: "Path tracing" }],
      },
      {
        id: "syllogism",
        title: "Syllogism & Venn",
        subtopics: [
          { id: "statements", title: "Statements & conclusions" },
          { id: "venn", title: "Venn diagrams" },
        ],
      },
      {
        id: "puzzle",
        title: "Puzzles & Seating",
        subtopics: [
          { id: "linear", title: "Linear seating" },
          { id: "floor", title: "Floor / scheduling" },
        ],
      },
      {
        id: "nonverbal",
        title: "Non-verbal",
        subtopics: [
          { id: "mirror", title: "Mirror / water" },
          { id: "paper", title: "Paper folding" },
        ],
      },
    ],
  },
  {
    key: "english",
    title: "English Comprehension",
    sectionKey: "english",
    topics: [
      {
        id: "grammar",
        title: "Grammar",
        subtopics: [
          { id: "error", title: "Error spotting" },
          { id: "sentence", title: "Sentence improvement" },
        ],
      },
      {
        id: "vocab",
        title: "Vocabulary",
        subtopics: [
          { id: "synonym", title: "Synonyms / antonyms" },
          { id: "idiom", title: "Idioms & phrases" },
        ],
      },
      {
        id: "fillers",
        title: "Fillers & Cloze",
        subtopics: [
          { id: "blank", title: "Fill in the blanks" },
          { id: "cloze", title: "Cloze test" },
        ],
      },
      {
        id: "comprehension",
        title: "Reading Comprehension",
        subtopics: [{ id: "passage", title: "Passage-based" }],
      },
      {
        id: "arrangement",
        title: "Para jumbles",
        subtopics: [{ id: "pj", title: "Sentence arrangement" }],
      },
    ],
  },
  {
    key: "ga",
    title: "General Awareness",
    sectionKey: "ga",
    topics: [
      {
        id: "polity",
        title: "Indian Polity",
        subtopics: [
          { id: "constitution", title: "Constitution" },
          { id: "governance", title: "Parliament & judiciary" },
        ],
      },
      {
        id: "history",
        title: "History",
        subtopics: [
          { id: "modern", title: "Modern India" },
          { id: "medieval", title: "Medieval / ancient" },
        ],
      },
      {
        id: "geography",
        title: "Geography",
        subtopics: [
          { id: "india", title: "Indian geography" },
          { id: "world", title: "Physical / world" },
        ],
      },
      {
        id: "economy",
        title: "Economy",
        subtopics: [
          { id: "basics", title: "Basic concepts" },
          { id: "banking", title: "Banking & budget" },
        ],
      },
      {
        id: "science",
        title: "General Science",
        subtopics: [
          { id: "physics", title: "Physics" },
          { id: "chem", title: "Chemistry" },
          { id: "bio", title: "Biology" },
        ],
      },
      {
        id: "current",
        title: "Static GK & Current",
        subtopics: [
          { id: "awards", title: "Awards & books" },
          { id: "misc", title: "Misc. static" },
        ],
      },
    ],
  },
];

/** Exam-hall shortcuts keyed by topic title fragments (case-insensitive match). */
export const TOPIC_TRICKS: Record<string, string> = {
  Percentage: "Trick: x% of y = y% of x. Successive ±a%,±b% ≈ a+b±ab/100. Remember 12.5%=1/8, 16⅔%=1/6.",
  "Profit Loss": "Trick: Profit% = (SP−CP)/CP×100; use MP→discount→SP chain once.",
  Discount: "Trick: Single equivalent of successive d1,d2 = d1+d2−d1d2/100.",
  "Simple Interest": "Trick: SI = PRT/100; for same T compare P×R.",
  "Compound Interest": "Trick: CI 2yrs excess over SI = P(R/100)²; use (1+R/100)^n factors.",
  Ratio: "Trick: Combine ratios via LCM of middle term; partnership ∝ capital×time.",
  Average: "Trick: Sum = avg×n; replacement: new avg shifts by (new−old)/n.",
  "Time Work": "Trick: Work = rate×time; LCM of days = total work units.",
  "Time Speed": "Trick: D = S×T; relative speed same/opposite direction.",
  Train: "Trick: Crossing pole = length/speed; two trains add lengths / relative speed.",
  Boat: "Trick: Downstream u+v, upstream u−v; still water = (d+u)/2.",
  Algebra: "Trick: Spot (a±b)² / a²−b² identities before expanding.",
  Geometry: "Trick: Angle chase with parallel lines; 180° in triangle; cyclic quad opposite sum 180°.",
  Mensuration: "Trick: Memorise 4/3πr³, πr²h, 2πr(r+h); cancel π early.",
  Trigonometry: "Trick: sin(90−θ)=cosθ; for heights use tanθ = opp/adj.",
  "Number Series": "Trick: Check ×n±k pattern or two interleaved series.",
  Coding: "Trick: Map +1/−1 positional or reverse word; verify with second example.",
  "Blood Relation": "Trick: Draw generations; ‘only son of father’ = self/brother.",
  Direction: "Trick: Sketch NSEW; net displacement with Pythagoras if needed.",
  Syllogism: "Trick: Venn possibility vs certainty; ‘some + all’ careful with possibility.",
  Seating: "Trick: Fix one person, place left/right relative; mark facing in/out.",
  Analogy: "Trick: Relation type (synonym, part-whole, function) before options.",
  "Error Spotting": "Trick: Check SVA, preposition fixed pairs (prefer to, senior to).",
  Idioms: "Trick: Learn high-frequency SSC idioms; eliminate literal meanings.",
  Synonym: "Trick: Use root/affix; eliminate opposite polarity first.",
  Cloze: "Trick: Read full sentence; articles/prepositions from collocation.",
  Polity: "Trick: Article clusters — 12–35 FR, 36–51 DPSP, 52–78 Executive.",
  History: "Trick: Timeline anchors (1857, 1885, 1919, 1942, 1947).",
  Geography: "Trick: Passes, rivers, soils map mnemonics (e.g. black soil Deccan).",
  Economy: "Trick: Repo > reverse repo; fiscal vs revenue deficit definitions.",
  Science: "Trick: SI units + everyday chemistry (acids/bases/vitamins) recur in SSC.",
};

export function trickForTopic(topic: string): string {
  const t = topic.toLowerCase();
  for (const [key, trick] of Object.entries(TOPIC_TRICKS)) {
    if (t.includes(key.toLowerCase()) || key.toLowerCase().includes(t.split(/[\s&/-]/)[0] ?? t)) {
      return trick;
    }
  }
  // fuzzy common SSC banks
  if (/percent/.test(t)) return TOPIC_TRICKS.Percentage!;
  if (/profit|loss|discount|cp|sp/.test(t)) return TOPIC_TRICKS["Profit Loss"]!;
  if (/interest|si\b|ci\b/.test(t)) return TOPIC_TRICKS["Compound Interest"]!;
  if (/ratio|proportion|partner/.test(t)) return TOPIC_TRICKS.Ratio!;
  if (/average|mean/.test(t)) return TOPIC_TRICKS.Average!;
  if (/work|pipe|cistern/.test(t)) return TOPIC_TRICKS["Time Work"]!;
  if (/speed|distance|train|boat/.test(t)) return TOPIC_TRICKS["Time Speed"]!;
  if (/algebra|equation|surd/.test(t)) return TOPIC_TRICKS.Algebra!;
  if (/triangle|circle|geometry|mensur/.test(t)) return TOPIC_TRICKS.Geometry!;
  if (/trigo|sin|cos|tan|height/.test(t)) return TOPIC_TRICKS.Trigonometry!;
  if (/series|analogy|coding|blood|direction|syllog|seating|puzzle|mirror/.test(t)) {
    if (/series/.test(t)) return TOPIC_TRICKS["Number Series"]!;
    if (/cod/.test(t)) return TOPIC_TRICKS.Coding!;
    if (/blood/.test(t)) return TOPIC_TRICKS["Blood Relation"]!;
    if (/direction/.test(t)) return TOPIC_TRICKS.Direction!;
    if (/syllog|venn/.test(t)) return TOPIC_TRICKS.Syllogism!;
    if (/seat|puzzle|floor/.test(t)) return TOPIC_TRICKS.Seating!;
    return TOPIC_TRICKS.Analogy!;
  }
  if (/error|grammar|sentence|article/.test(t)) return TOPIC_TRICKS["Error Spotting"]!;
  if (/idiom|phrase/.test(t)) return TOPIC_TRICKS.Idioms!;
  if (/synonym|antonym|vocab/.test(t)) return TOPIC_TRICKS.Synonym!;
  if (/cloze|filler|blank/.test(t)) return TOPIC_TRICKS.Cloze!;
  if (/polity|article|constitution|parliament/.test(t)) return TOPIC_TRICKS.Polity!;
  if (/history|mughal|congress|gandhi/.test(t)) return TOPIC_TRICKS.History!;
  if (/geography|river|soil|pass|climate/.test(t)) return TOPIC_TRICKS.Geography!;
  if (/econom|gdp|repo|budget|gst/.test(t)) return TOPIC_TRICKS.Economy!;
  if (/physics|chem|bio|vitamin|science/.test(t)) return TOPIC_TRICKS.Science!;
  return "Trick: Eliminate extremes, plug options if calculation-heavy, mark & move if >90s.";
}

export function findSubject(key: string): PracticeSubject | undefined {
  return PRACTICE_SYLLABUS.find((s) => s.key === key);
}

export function findTopic(subjectKey: string, topicId: string): PracticeTopic | undefined {
  return findSubject(subjectKey)?.topics.find((t) => t.id === topicId);
}
