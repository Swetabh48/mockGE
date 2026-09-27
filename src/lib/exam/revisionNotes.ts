/**
 * Revision notes: formulas & exam tricks by topic and question pattern.
 * Each pattern has a real shortcut + worked numbers (not just restating the formula).
 * Used on /revise and to enrich short explanations/tricks on results.
 */

export type VideoRef = {
  title: string;
  url: string;
  channel?: string;
};

export type FormulaPattern = {
  pattern: string;
  formula: string;
  howToUse: string;
  /** The actual exam shortcut — what to do instead of long calculation. */
  examTip: string;
  /** Concrete numbers so the shortcut clicks. */
  workedExample: string;
  video?: VideoRef;
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
    topicId: "number-system",
    topicTitle: "Number System & HCF-LCM",
    patterns: [
      {
        pattern: "HCF / LCM of numbers",
        formula: "HCF × LCM = a × b (for two numbers)\nLCM via prime factors (highest powers)",
        howToUse: "Factorise quickly; for bells/traffic lights use LCM of intervals.",
        examTip:
          "Next together = LCM of intervals from a common start. Don’t add the intervals.",
        workedExample:
          "Bells every 12, 18, 24 min from 8:00.\nLCM(12,18,24)=72 → next at 9:12 am.\nTrap: adding 12+18+24.",
        video: {
          title: "HCF LCM tricks SSC",
          url: "https://www.youtube.com/results?search_query=HCF+LCM+tricks+SSC",
        },
      },
      {
        pattern: "Remainder / divisibility",
        formula: "a ≡ r (mod m)\nDivisibility rules: 3/9 (digit sum), 11 (alt sum), 4 (last 2 digits)",
        howToUse: "Reduce large powers with remainder cycles (Euler/pattern of last digits).",
        examTip: "Last-digit cycles: 2→4→8→6; 3→9→7→1; 7→9→3→1; 9→1.",
        workedExample:
          "Last digit of 7^23?\nCycle 7,9,3,1 length 4. 23 mod 4 = 3 → last digit 3.",
        video: {
          title: "Remainder theorem SSC",
          url: "https://www.youtube.com/results?search_query=remainder+theorem+tricks+SSC+CGL",
        },
      },
    ],
  },
  {
    subjectKey: "quant",
    topicId: "di",
    topicTitle: "Data Interpretation",
    patterns: [
      {
        pattern: "Table / % comparison",
        formula: "Value = total × %/100\nDifference = total × |p1−p2|/100",
        howToUse: "Read the total once; compute only what options need.",
        examTip: "Skip reconstructing the whole table if a single % difference answers it.",
        workedExample:
          "2400 people; A 35%, B 20%. A exceeds B by?\n2400×15/100 = 360. One step.",
        video: {
          title: "DI percentage tricks SSC",
          url: "https://www.youtube.com/results?search_query=DI+percentage+tricks+SSC",
        },
      },
      {
        pattern: "Mean / grouped data",
        formula: "Mean ≈ Σ(f × mid)/Σf\nmid = (lower+upper)/2",
        howToUse: "Write midpoints of each class, multiply by frequency, divide by total f.",
        examTip: "Mode class = highest frequency class; don’t confuse with mean class.",
        workedExample:
          "Classes 25–29 (f=10), 30–34 (f=12)… compute Σfm / Σf.\nWatch for option traps that use mid wrong end-points.",
        video: {
          title: "Statistics mean mode SSC",
          url: "https://www.youtube.com/results?search_query=mean+mode+median+tricks+SSC",
        },
      },
    ],
  },
  {
    subjectKey: "quant",
    topicId: "percentage",
    topicTitle: "Percentage",
    patterns: [
      {
        pattern: "x% of y (mental calc)",
        formula: "x% of y = (x/100)×y = y% of x",
        howToUse: "Swap the numbers when one makes an easy half/quarter.",
        examTip:
          "Never compute ‘ugly × ugly’. Swap: 48% of 25 → 25% of 48 = 12. Fraction table: 12.5%=1/8, 16⅔%=1/6, 37.5%=3/8, 62.5%=5/8.",
        workedExample:
          "Q: 12.5% of 640?\nLong: 12.5/100 × 640.\nTrick: 12.5% = 1/8 → 640÷8 = 80. Done in 2 seconds.",
        video: {
          title: "Percentage shortcuts for SSC",
          url: "https://www.youtube.com/results?search_query=SSC+CGL+percentage+tricks+Abhinay+Maths",
          channel: "Search: Abhinay Maths / Rakesh Yadav",
        },
      },
      {
        pattern: "Successive % change (+a then +b / −b)",
        formula: "Net% = a + b + (a×b)/100\n(Use − sign when second change is a decrease)",
        howToUse:
          "When the question only asks overall % change, NEVER find intermediate amounts. Plug a,b into one line.",
        examTip:
          "Signs: profit/increase = +, loss/discount/rebate = −. Product ab/100 keeps the signs of a and b.",
        workedExample:
          "Q: Price ↑20% then ↓10%. Net?\nWrong instinct: 20−10=10%.\nTrick: 20 + (−10) + (20)(−10)/100 = 10 − 2 = 8% increase.\n(+10% then −10% = −1%, not zero — classic trap.)",
        video: {
          title: "Successive percentage change",
          url: "https://www.youtube.com/results?search_query=successive+percentage+change+trick+SSC",
          channel: "Search: successive percentage SSC",
        },
      },
      {
        pattern: "Population / % change reverse",
        formula: "If after +r% value = V, original = V / (1+r/100)\nAfter −r%: original = V / (1−r/100)",
        howToUse: "Reverse the % — divide by the remaining factor, don’t subtract % of final.",
        examTip: "‘Increased to’ vs ‘increased by’ — read carefully.",
        workedExample:
          "After 25% increase salary = 25000. Original?\n25000/1.25 = 20000.\nTrap: 25000−25%=18750.",
        video: {
          title: "Percentage reverse tricks",
          url: "https://www.youtube.com/results?search_query=percentage+reverse+trick+SSC",
        },
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
        howToUse: "Base is always CP for profit/loss %. Discount base is MP (different).",
        examTip:
          "If only % is asked, take CP = 100 (or 1000). Skip actual rupee amounts until options force them.",
        workedExample:
          "Q: CP ₹800, SP ₹920. Profit%?\nTrick: profit = 120; 120/800×100 = 15%.\nOr CP=100 → SP=115 → profit 15%. Same.",
        video: {
          title: "Complete Profit & Loss — Abhinay Sharma",
          url: "https://www.youtube.com/watch?v=RXyGyr8E1cQ",
          channel: "Abhinay Maths",
        },
      },
      {
        pattern: "Gain then rebate on SP (overall % on CP)",
        formula:
          "Long: SP1 = CP(1+g/100); Final = SP1(1−r/100); Overall = (Final−CP)/CP×100\nSHORTCUT: Overall% = g + (−r) + g(−r)/100 = g − r − (g×r)/100",
        howToUse:
          "If the question asks overall profit/loss %, ignore CP completely. Use successive-% with +gain and −rebate.",
        examTip:
          "THIS is the exam trick: do NOT compute 650×1.21×0.87. One line: g−r−gr/100. Options that equal g−r are traps.",
        workedExample:
          "Q: CP ₹650, sold at 21% profit, then SP cut by 13% rebate. Overall % on CP?\nLong way (slow): SP1=650×1.21=786.5; Final=786.5×0.87≈684.26; (684.26−650)/650×100≈5.27%.\nEXAM TRICK (fast): Net = 21 − 13 − (21×13)/100 = 8 − 2.73 = 5.27% profit.\nSame answer — no big multiplications. Trap option: 21−13=8%.",
        video: {
          title: "Profit & Loss successive method — Abhinay Sharma",
          url: "https://www.youtube.com/watch?v=RXyGyr8E1cQ",
          channel: "Abhinay Maths",
        },
      },
      {
        pattern: "Successive discounts on MP",
        formula:
          "d_eq = d1 + d2 − (d1×d2)/100\nSP = MP × (1−d1/100) × (1−d2/100)",
        howToUse:
          "Never add discounts. Either use d_eq once, or multiply remaining factors (0.8×0.9…).",
        examTip:
          "20% + 10% successive ≠ 30%. Equivalent = 28%. Memorise: 10+20→28, 10+15→23.5, 20+25→40.",
        workedExample:
          "Q: MP ₹500, successive 20% then 10%. SP?\nTrick: eq discount = 20+10−2 = 28% → SP = 72% of 500 = ₹360.\nOr: 500 × 0.8 × 0.9 = 360. Adding to 30% would wrongly give 350.",
        video: {
          title: "Successive discounts SSC",
          url: "https://www.youtube.com/results?search_query=successive+discount+trick+SSC+CGL",
          channel: "Search: successive discount SSC",
        },
      },
      {
        pattern: "Mark-up then discount (net on CP)",
        formula: "Net% = m + (−d) + m(−d)/100 = m − d − md/100",
        howToUse: "Same successive formula: mark-up +, discount −. Again skip computing MP/SP if % asked.",
        examTip: "Marked 40% above CP, 20% discount → Net = 40−20−8 = 12% profit (not 20%).",
        workedExample:
          "Q: Marked 25% above CP, discount 10%. Profit%?\nTrick: 25 − 10 − 2.5 = 12.5% profit.\nNo need to invent CP=100 and chase MP=125, SP=112.5 unless you prefer it.",
        video: {
          title: "MP–Discount–Profit bridge",
          url: "https://www.youtube.com/watch?v=fXZBmB1iDiU",
          channel: "Abhinav Sir / SSC maths",
        },
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
        formula: "SI = PRT/100\nAmount = P + SI",
        howToUse: "Convert months → years (÷12) before plugging T.",
        examTip: "If options are amounts, compute SI once then add P. Don’t recompute from scratch for each option.",
        workedExample:
          "Q: P=5000, R=8%, T=3 yrs. SI?\nTrick: PRT/100 = 5000×8×3/100 = 1200. Amount=6200.",
        video: {
          title: "SI & CI difference tricks",
          url: "https://www.youtube.com/watch?v=IBj19sI2G-w",
          channel: "Competitive exams CI–SI",
        },
      },
      {
        pattern: "Compound Interest (esp. 2 years)",
        formula:
          "A = P(1+R/100)^T ; CI = A − P\n2-yr check: CI − SI = P(R/100)²\n2-yr CI% on P = 2R + R²/100",
        howToUse:
          "If T=2 and they ask CI (or CI−SI), prefer the square formula — skip expanding (1+R/100)²×P when you can.",
        examTip:
          "Trap option is almost always the SI value. Compute SI in 5s and eliminate it first, then get CI.",
        workedExample:
          "Q: P=10000, R=10%, T=2 yrs. CI?\nLong: A=10000×1.1×1.1=12100; CI=2100.\nTRICK: 2-yr CI% = 2×10 + 100/100 = 20+1 = 21% → CI = 2100.\nOr: SI=2000; CI−SI = P(R/100)² = 100 → CI=2100.\nNever pick 2000 (that’s SI).",
        video: {
          title: "CI − SI difference best trick",
          url: "https://www.youtube.com/watch?v=IBj19sI2G-w",
          channel: "Competitive exams",
        },
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
        formula: "Share ∝ Capital × Time\nMake common term equal (LCM) to chain A:B and B:C",
        howToUse: "Write each partner as product capital×months, then take ratio of those products.",
        examTip: "Don’t divide mid-way. Multiply first, cancel zeros, then simplify the ratio.",
        workedExample:
          "Q: A puts 4000 for 12 months, B puts 6000 for 8 months. Profit share?\nTrick: A:B = 4000×12 : 6000×8 = 48 : 48 = 1:1. Equal share.",
        video: {
          title: "Ratio & partnership SSC",
          url: "https://www.youtube.com/results?search_query=SSC+CGL+ratio+partnership+tricks",
        },
      },
      {
        pattern: "Average / replacement",
        formula: "Sum = Avg × n\nIf one value replaced, Δtotal = new − old; Δavg = Δtotal / n",
        howToUse: "Convert every average sentence into a sum change.",
        examTip: "‘Average rises by k’ ⇒ total rises by k×n. One multiply, done.",
        workedExample:
          "Q: Avg of 5 numbers is 40. One number 30 replaced by 45. New avg?\nTrick: total was 200; +15 → 215; new avg = 43.\nDon’t recompute all five.",
        video: {
          title: "Average tricks SSC",
          url: "https://www.youtube.com/results?search_query=SSC+average+tricks+Rakesh+Yadav",
        },
      },
      {
        pattern: "Mixture / allegation",
        formula: "Cheaper : Dearer = (dearer − mean) : (mean − cheaper)",
        howToUse: "Write prices on ends, mean in middle; cross-subtract for ratio.",
        examTip: "Allegation gives ratio of QUANTITIES, not prices.",
        workedExample:
          "Tea @20 and @40 mixed to mean 28.\nRatio = (40−28):(28−20) = 12:8 = 3:2.",
        video: {
          title: "Allegation mixture SSC",
          url: "https://www.youtube.com/results?search_query=allegation+mixture+trick+SSC+CGL",
        },
      },
    ],
  },
  {
    subjectKey: "quant",
    topicId: "time-work",
    topicTitle: "Time & Work",
    patterns: [
      {
        pattern: "Basic work (together / left)",
        formula: "Rate = 1/days\nTogether = sum of rates\nLCM method: total work = LCM of days",
        howToUse: "Take LCM as ‘total units’. Each person’s 1-day work = LCM/days.",
        examTip:
          "Avoid 1/a+1/b fractions in the exam. LCM turns it into integers. If A=10, B=15 → LCM 30; A=3/day, B=2/day, together=5 → 6 days.",
        workedExample:
          "Q: A 12 days, B 18 days. Together?\nTrick: LCM=36. A=3/day, B=2/day → 5/day → 36/5 = 7.2 days.\nFormula 1/12+1/18=5/36 → same, but LCM is cleaner under pressure.",
        video: {
          title: "Time & Work LCM method",
          url: "https://www.youtube.com/results?search_query=SSC+time+and+work+LCM+trick",
        },
      },
      {
        pattern: "Work & wages (share money)",
        formula: "Wage share ∝ efficiency ∝ 1/days\nIf A takes a days, B takes b → A:B wages = b:a",
        howToUse: "Invert days to get efficiency ratio, then split total wages in that ratio.",
        examTip: "Fewer days ⇒ more wages. Never share wages in the same ratio as days.",
        workedExample:
          "A 10 days, B 15 days, together earn ₹3000.\nA:B = 15:10 = 3:2 → A gets ₹1800, B ₹1200.\nTrap option uses 10:15.",
        video: {
          title: "Work and wages trick SSC",
          url: "https://www.youtube.com/results?search_query=work+and+wages+trick+SSC",
        },
      },
      {
        pattern: "Pipes & cisterns",
        formula: "Fillers +, outlet −\nNet rate = 1/a + 1/b − 1/c\nTime = 1/net (if net>0)",
        howToUse: "Same LCM idea: capacity = LCM of times; each pipe ±LCM/time per hour.",
        examTip: "If net ≤ 0, tank never fills — watch for ‘infinite / never’ type options.",
        workedExample:
          "Q: A fills in 6h, B in 8h, C empties in 12h. Together?\nTrick: LCM=24. A=+4, B=+3, C=−2 → net +5 units/h → 24/5 = 4.8 h.",
        video: {
          title: "Pipes and cisterns tricks",
          url: "https://www.youtube.com/results?search_query=pipes+cisterns+trick+SSC+CGL",
        },
      },
    ],
  },
  {
    subjectKey: "quant",
    topicId: "speed",
    topicTitle: "Time, Speed & Distance",
    patterns: [
      {
        pattern: "Basic STD + unit convert",
        formula: "D = S × T\nkm/h → m/s: ×5/18 ; m/s → km/h: ×18/5",
        howToUse: "Convert units BEFORE multiplying. Same-direction relative = |v1−v2|; opposite = v1+v2.",
        examTip: "Memorise: 36 km/h = 10 m/s; 54 km/h = 15 m/s; 72 km/h = 20 m/s.",
        workedExample:
          "Q: 72 km/h for 10 minutes. Distance?\nTrick: 10 min = 1/6 h → 72×1/6 = 12 km.\nOr 72×5/18=20 m/s × 600 s = 12000 m = 12 km.",
        video: {
          title: "Speed distance time SSC",
          url: "https://www.youtube.com/results?search_query=SSC+speed+distance+time+tricks",
        },
      },
      {
        pattern: "Boats & streams",
        formula:
          "Downstream u+v ; Upstream u−v\nStill water u = (down+up)/2\nStream v = (down−up)/2",
        howToUse: "Round trip time = D/(u−v) + D/(u+v). Don’t average the two speeds for average speed of trip.",
        examTip:
          "Average speed for equal distances up & down = 2xy/(x+y) (harmonic), NOT (x+y)/2.",
        workedExample:
          "Q: Boat 15, stream 3, distance 36 each way. Total time?\nTrick: down=18, up=12 → time = 36/18 + 36/12 = 2+3 = 5 h.\nWrong: average speed 15 → 72/15=4.8 h (trap).",
        video: {
          title: "Boats and streams tricks",
          url: "https://www.youtube.com/results?search_query=boats+streams+trick+SSC+CGL",
        },
      },
      {
        pattern: "Trains",
        formula:
          "Pole/man: time = L_train / speed\nPlatform: (L_train + L_platform) / speed\nTwo trains opposite: (L1+L2)/(v1+v2)",
        howToUse: "Always add lengths that are being crossed. Convert to same units (m and m/s preferred).",
        examTip: "Crossing a man = crossing a pole (man’s length ≈ 0).",
        workedExample:
          "Q: Train 180 m at 54 km/h crosses a pole. Time?\nTrick: 54×5/18=15 m/s; t=180/15=12 s.",
        video: {
          title: "Train problems shortcuts",
          url: "https://www.youtube.com/results?search_query=train+problems+trick+SSC",
        },
      },
    ],
  },
  {
    subjectKey: "quant",
    topicId: "algebra",
    topicTitle: "Algebra",
    patterns: [
      {
        pattern: "Identities (α+β, αβ given)",
        formula:
          "(a+b)² = a²+2ab+b²\n(a−b)² = a²−2ab+b²\na²−b²=(a−b)(a+b)\nα²+β² = (α+β)² − 2αβ",
        howToUse: "If sum & product given, never find α,β separately unless forced.",
        examTip: "α²+β² from sum/product is one line. α³+β³ = (α+β)[(α+β)² − 3αβ].",
        workedExample:
          "Q: α+β=5, αβ=6. α²+β²?\nTrick: 25 − 12 = 13. Don’t solve quadratic for 2 and 3 first.",
        video: {
          title: "Algebra identities SSC",
          url: "https://www.youtube.com/results?search_query=algebra+identities+tricks+SSC+CGL",
        },
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
        formula: "Half chord = √(r² − d²); chord = 2√(r² − d²)",
        howToUse: "Perpendicular from centre bisects chord → right triangle with r, d, half-chord.",
        examTip: "If r=13, d=5 → half = 12 (3-4-5 / 5-12-13 triangles — memorise).",
        workedExample:
          "Q: r=13, distance to chord=5. Chord length?\nTrick: √(169−25)=√144=12 → full chord=24. No calculator.",
        video: {
          title: "Circle chord tricks",
          url: "https://www.youtube.com/results?search_query=circle+chord+trick+SSC+geometry",
        },
      },
      {
        pattern: "Cylinder / cone volume",
        formula: "Cylinder V=πr²h ; Cone V=(1/3)πr²h\nUse π=22/7 when r multiple of 7",
        howToUse: "Cancel 22/7 with r early. Don’t multiply big numbers then divide.",
        examTip: "r=7 → πr² = 22/7×49 = 154. Remember 154 as a building block.",
        workedExample:
          "Q: r=7, h=10, π=22/7. Cylinder volume?\nTrick: 22/7×49×10 = 154×10 = 1540 cm³.",
        video: {
          title: "Mensuration formulas SSC",
          url: "https://www.youtube.com/results?search_query=mensuration+tricks+SSC+CGL",
        },
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
        formula: "tan θ = h/d  ⇒  h = d tan θ  or  d = h / tan θ",
        howToUse: "Sketch once. Only three angles matter in SSC: 30°, 45°, 60°.",
        examTip: "tan30=1/√3, tan45=1, tan60=√3. If θ=45°, height = distance — instant.",
        workedExample:
          "Q: Angle 30°, distance 30√3 m. Height?\nTrick: h = 30√3 × (1/√3) = 30 m. Cancel √3, no calculator.",
        video: {
          title: "Heights and distances SSC",
          url: "https://www.youtube.com/results?search_query=heights+distances+trick+SSC+CGL",
        },
      },
    ],
  },
  {
    subjectKey: "reasoning",
    topicId: "coding",
    topicTitle: "Coding–Decoding",
    patterns: [
      {
        pattern: "Letter +1 / −1 / reverse",
        formula: "Shift each letter by fixed k, or reverse word then shift",
        howToUse: "Check FIRST letter of the sample pair. Confirm on last letter. Then apply to target.",
        examTip: "Don’t code the whole target until the rule is verified on TWO sample pairs.",
        workedExample:
          "Sample: CAT → DBU (+1 each). Then DOG → EPH.\nIf sample were CAT → TAC (reverse only), DOG → GOD.",
        video: {
          title: "Coding decoding SSC",
          url: "https://www.youtube.com/results?search_query=coding+decoding+tricks+SSC",
        },
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
        formula: "Check: +prime, ×n+n, two interleaved series",
        howToUse: "Write differences. If differences grow smoothly → add pattern. If explode → multiply.",
        examTip: "Wrong-number Q: find which single term breaks an otherwise clean rule.",
        workedExample:
          "2, 6, 12, 20, 30, ? → gaps +4,+6,+8,+10 → next +12 → 42.\nPattern: n(n+1).",
        video: {
          title: "Number series tricks",
          url: "https://www.youtube.com/results?search_query=number+series+tricks+SSC+CGL",
        },
      },
    ],
  },
  {
    subjectKey: "reasoning",
    topicId: "syllogism",
    topicTitle: "Syllogism & Venn",
    patterns: [
      {
        pattern: "All / Some / No (definite vs possible)",
        formula: "Draw Venn. ‘Possibility’ ≠ ‘follows as definite’",
        howToUse: "Only mark ‘follows’ when true in EVERY valid diagram.",
        examTip: "SSC favourite trap: conclusion that CAN be true but need not be → does not follow.",
        workedExample:
          "All A are B. Some B are C.\n‘Some A are C’ — possible, not certain → does not follow.\n‘Some A are not C’ — also not certain.",
        video: {
          title: "Syllogism Venn method",
          url: "https://www.youtube.com/results?search_query=syllogism+venn+diagram+SSC+tricks",
        },
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
        formula: "Draw generations. Convert phrases to arrows (spouse / child / sibling)",
        howToUse: "Start from the END of the sentence and build the tree backward.",
        examTip: "‘Only son of my father’ usually = speaker (or brother if ‘brother of’). Read carefully.",
        workedExample:
          "‘A is brother of B’s father’ → A is paternal uncle of B.\nDon’t invent extra people.",
        video: {
          title: "Blood relation tricks",
          url: "https://www.youtube.com/results?search_query=blood+relation+tricks+SSC",
        },
      },
    ],
  },
  {
    subjectKey: "english",
    topicId: "grammar",
    topicTitle: "Grammar",
    patterns: [
      {
        pattern: "Subject–verb / comparison",
        formula: "Neither/either/each → singular\nprefer/senior/inferior/superior → to (not than)",
        howToUse: "Cross out ‘along with / as well as / together with’ phrases; verb follows the main subject.",
        examTip: "Error-spotting: check SVA and ‘to vs than’ first — highest hit rate.",
        workedExample:
          "‘The quality of the mangoes are good’ → are→is (quality = singular).\n‘He is senior than me’ → than→to.",
        video: {
          title: "SSC English grammar rules",
          url: "https://www.youtube.com/results?search_query=SSC+CGL+English+grammar+tricks",
        },
      },
    ],
  },
  {
    subjectKey: "english",
    topicId: "vocab",
    topicTitle: "Vocabulary",
    patterns: [
      {
        pattern: "Idioms & one-word",
        formula: "Learn meaning as a chunk — ignore literal word sense",
        howToUse: "Eliminate options that translate word-by-word.",
        examTip: "SSC recycles ~200 idioms. Revise a fixed list weekly; don’t chase rare ones.",
        workedExample:
          "‘Spill the beans’ ≠ drop vegetables → means reveal a secret.\n‘Hit the nail on the head’ → exactly right.",
        video: {
          title: "SSC idioms list",
          url: "https://www.youtube.com/results?search_query=SSC+CGL+idioms+phrases+list",
        },
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
        howToUse: "Recall the cluster first, then the exact article.",
        examTip: "7th Schedule = Union/State/Concurrent lists. 3rd = oaths. 9th = land reforms (often asked).",
        workedExample:
          "Q: Right to Equality articles? → 14–18 (inside FR 12–35 cluster).\nDon’t memorize every article in isolation.",
        video: {
          title: "Polity articles for SSC",
          url: "https://www.youtube.com/results?search_query=SSC+CGL+polity+articles+trick",
        },
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
        formula: "Repo: RBI → banks (lend)\nReverse repo: banks → RBI (park)\nNormally repo > reverse repo",
        howToUse: "Read the direction of money flow in the question.",
        examTip: "GST launched 1 July 2017 — static favourite. CRR/SLR are % of NDTL banks must hold.",
        workedExample:
          "Q: Rate at which RBI lends to banks overnight against securities? → Repo rate.\nIf banks park surplus with RBI → Reverse repo.",
        video: {
          title: "Banking awareness SSC",
          url: "https://www.youtube.com/results?search_query=SSC+banking+awareness+repo+reverse+repo",
        },
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

/** Best matching pattern for a question topic string (used in results). */
export function bestPatternForTopic(topic: string): FormulaPattern | undefined {
  const t = topic.toLowerCase();
  const scored: { score: number; pattern: FormulaPattern }[] = [];

  for (const note of REVISION_NOTES) {
    for (const p of note.patterns) {
      let score = 0;
      const hay = `${note.topicTitle} ${p.pattern}`.toLowerCase();
      if (/profit|loss|discount|rebate|markup|mark-up|mp\b/.test(t)) {
        if (note.topicId === "profit-loss") score += 5;
        if (/gain then rebate|rebate/.test(p.pattern) && /rebate|gain|profit/.test(t)) score += 8;
        if (/successive discount/.test(p.pattern) && /discount|successive/.test(t)) score += 8;
        if (/mark-up|marked/.test(p.pattern) && /mark|discount/.test(t)) score += 4;
      }
      if (/compound|ci\b|simple interest|si\b/.test(t) && note.topicId === "si-ci") score += 6;
      if (/compound/.test(t) && /compound/.test(p.pattern)) score += 4;
      if (/percent/.test(t) && note.topicId === "percentage") score += 5;
      if (/boat|stream/.test(t) && /boat/.test(p.pattern)) score += 8;
      if (/train/.test(t) && /train/.test(p.pattern)) score += 8;
      if (/pipe|cistern/.test(t) && /pipe/.test(p.pattern)) score += 8;
      if (/time and work|work/.test(t) && note.topicId === "time-work" && /basic work/.test(p.pattern))
        score += 6;
      if (/mensuration|cylinder|cone|volume/.test(t) && /cylinder|cone/.test(p.pattern)) score += 7;
      if (/trigo|height|elevation|tan/.test(t) && note.topicId === "trigo") score += 7;
      if (/coding/.test(t) && note.topicId === "coding") score += 7;
      if (/syllog/.test(t) && note.topicId === "syllogism") score += 7;
      if (/series/.test(t) && note.topicId === "series") score += 6;
      if (/blood|relation/.test(t) && note.topicId === "blood") score += 7;
      if (hay.includes(t.slice(0, 8))) score += 2;
      if (score > 0) scored.push({ score, pattern: p });
    }
  }

  scored.sort((a, b) => b.score - a.score);
  return scored[0]?.pattern;
}

/** Format a pattern into the multi-line exam-trick block shown on results. */
export function formatTrickFromPattern(p: FormulaPattern): string {
  const parts = [
    `SHORTCUT: ${p.examTip}`,
    "",
    "Worked example:",
    p.workedExample,
  ];
  if (p.video) {
    parts.push(
      "",
      `Watch (${p.video.channel || "YouTube"}): ${p.video.title}`,
      p.video.url,
    );
  }
  return parts.join("\n");
}
