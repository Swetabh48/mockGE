/**
 * Parametric generators to fill the SSC bank for Reasoning / English / GA
 * (and extra Quant variants). Driven by setNo so each round invents new numbers/names.
 */

import type { SeedQuestion } from "./questionBank";
import { trickForTopic } from "./taxonomy";
import { buildTopicLockedPractice } from "./topicGenerators";
import { buildSectionPractice } from "./questionBank";

function shuffleOpts(
  answer: string,
  wrongs: [string, string, string],
  seed: number,
): { optionA: string; optionB: string; optionC: string; optionD: string; correctOption: string } {
  const opts = [answer, ...wrongs];
  for (let i = opts.length - 1; i > 0; i--) {
    const j = (seed * 17 + i * 13) % (i + 1);
    [opts[i], opts[j]] = [opts[j]!, opts[i]!];
  }
  const letters = ["A", "B", "C", "D"] as const;
  return {
    optionA: opts[0]!,
    optionB: opts[1]!,
    optionC: opts[2]!,
    optionD: opts[3]!,
    correctOption: letters[opts.indexOf(answer)]!,
  };
}

type Raw = {
  topic: string;
  subtopic?: string;
  stem: string;
  answer: string;
  wrongs: [string, string, string];
  explanation: string;
};

function pack(
  items: Raw[],
  sectionKey: string,
  subject: string,
  setNo: number,
): SeedQuestion[] {
  return items.map((item, i) => {
    const opts = shuffleOpts(item.answer, item.wrongs, setNo + i * 19);
    return {
      qIndex: i + 1,
      sectionKey,
      subject,
      topic: item.topic,
      subtopic: item.subtopic,
      difficulty: "medium",
      stemEn: item.stem,
      ...opts,
      explanation: item.explanation,
      trick: trickForTopic(item.topic),
      marks: 2,
      negativeMarks: 0.5,
      source: "generator",
    };
  });
}

const ANALOGY_PAIRS: Array<{
  stem: string;
  answer: string;
  wrongs: [string, string, string];
  explanation: string;
}> = [
  { stem: "Book : Reading :: Fork : ?", answer: "Eating", wrongs: ["Drawing", "Writing", "Cooking"], explanation: "Object–use: book for reading, fork for eating." },
  { stem: "Doctor : Hospital :: Teacher : ?", answer: "School", wrongs: ["Clinic", "Office", "Library"], explanation: "Profession–workplace pair." },
  { stem: "Pen : Write :: Knife : ?", answer: "Cut", wrongs: ["Sharp", "Blade", "Food"], explanation: "Tool–function analogy." },
  { stem: "Eyes : See :: Ears : ?", answer: "Hear", wrongs: ["Sound", "Listen", "Noise"], explanation: "Organ–sense analogy." },
  { stem: "Bird : Nest :: Bee : ?", answer: "Hive", wrongs: ["Honey", "Flower", "Wax"], explanation: "Animal–dwelling." },
  { stem: "Hot : Cold :: Day : ?", answer: "Night", wrongs: ["Dark", "Evening", "Sun"], explanation: "Antonym pair." },
  { stem: "Cap : Head :: Glove : ?", answer: "Hand", wrongs: ["Finger", "Arm", "Cloth"], explanation: "Covering–body part." },
  { stem: "Author : Book :: Composer : ?", answer: "Song", wrongs: ["Music", "Piano", "Orchestra"], explanation: "Creator–creation." },
  { stem: "Fish : Water :: Bird : ?", answer: "Air", wrongs: ["Sky", "Nest", "Wing"], explanation: "Creature–medium." },
  { stem: "Circle : Circumference :: Square : ?", answer: "Perimeter", wrongs: ["Area", "Diagonal", "Side"], explanation: "Shape–boundary measure." },
  { stem: "Lion : Cub :: Dog : ?", answer: "Puppy", wrongs: ["Kitten", "Calf", "Foal"], explanation: "Adult–young." },
  { stem: "Painting : Artist :: Symphony : ?", answer: "Composer", wrongs: ["Conductor", "Violin", "Audience"], explanation: "Work–creator." },
  { stem: "Scissors : Cut :: Needle : ?", answer: "Sew", wrongs: ["Cloth", "Thread", "Sharp"], explanation: "Tool–action." },
  { stem: "India : Rupee :: Japan : ?", answer: "Yen", wrongs: ["Yuan", "Won", "Dollar"], explanation: "Country–currency." },
  { stem: "Knee : Leg :: Elbow : ?", answer: "Arm", wrongs: ["Hand", "Joint", "Bone"], explanation: "Joint–limb." },
  { stem: "Odd one out: Apple, Mango, Carrot, Guava — which does not belong?", answer: "Carrot", wrongs: ["Apple", "Mango", "Guava"], explanation: "Carrot is a vegetable; others are fruits (classification)." },
  { stem: "Odd one out: Rose, Lily, Lotus, Mango — which does not belong?", answer: "Mango", wrongs: ["Rose", "Lily", "Lotus"], explanation: "Mango is a fruit; others are flowers." },
  { stem: "Odd one out: Mercury, Venus, Mars, Moon — which does not belong?", answer: "Moon", wrongs: ["Mercury", "Venus", "Mars"], explanation: "Moon is a satellite; others are planets." },
  { stem: "3 : 9 :: 4 : ?", answer: "16", wrongs: ["12", "8", "20"], explanation: "n : n² pattern." },
  { stem: "5 : 25 :: 7 : ?", answer: "49", wrongs: ["35", "42", "56"], explanation: "n : n² pattern." },
];

const BLOOD_ITEMS: Raw[] = [
  { topic: "", stem: "A is the brother of B. B is the sister of C. C is the father of D. How is A related to D?", answer: "Uncle", wrongs: ["Father", "Brother", "Cousin"], explanation: "A is brother of C, so uncle of D." },
  { topic: "", stem: "P is the mother of Q. Q is the sister of R. R is the father of S. How is P related to S?", answer: "Grandmother", wrongs: ["Mother", "Aunt", "Sister"], explanation: "P is mother of R, hence grandmother of S." },
  { topic: "", stem: "X is Y's wife. Y is Z's father. Z is W's brother. How is X related to W?", answer: "Mother", wrongs: ["Sister", "Aunt", "Grandmother"], explanation: "X is mother of Z and W." },
  { topic: "", stem: "Pointing to a man, a woman said: 'His mother is the only daughter of my mother.' How is the woman related to the man?", answer: "Mother", wrongs: ["Sister", "Aunt", "Grandmother"], explanation: "Only daughter of her mother is herself; she is his mother." },
  { topic: "", stem: "A + B means A is father of B. A − B means A is sister of B. If P + Q − R, how is P related to R?", answer: "Father", wrongs: ["Uncle", "Brother", "Grandfather"], explanation: "P father of Q; Q sister of R ⇒ P father of R." },
];

const SYLLOGISM_ITEMS: Raw[] = [
  { topic: "", stem: "Statements: All pens are books. Some books are tables. Conclusions: I. Some pens are tables. II. Some books are pens. Which follows?", answer: "Only II", wrongs: ["Only I", "Both", "Neither"], explanation: "All pens are books ⇒ some books are pens. I is not definite." },
  { topic: "", stem: "Statements: All cats are dogs. All dogs are animals. Conclusions: I. All cats are animals. II. Some animals are cats. Which follows?", answer: "Both", wrongs: ["Only I", "Only II", "Neither"], explanation: "Chain: cats ⊂ dogs ⊂ animals; both follow." },
  { topic: "", stem: "Statements: Some A are B. No B is C. Conclusions: I. Some A are not C. II. No A is C. Which follows?", answer: "Only I", wrongs: ["Only II", "Both", "Neither"], explanation: "Some A that are B cannot be C; II is not definite." },
  { topic: "", stem: "Statements: No flower is leaf. All leaves are green. Conclusions: I. No flower is green. II. Some green are not flowers. Which follows?", answer: "Only II", wrongs: ["Only I", "Both", "Neither"], explanation: "Leaves (green) are not flowers ⇒ some green are not flowers. I not definite." },
  { topic: "", stem: "Statements: All students are learners. Some learners are teachers. Conclusions: I. Some students are teachers. II. All learners are students. Which follows?", answer: "Neither", wrongs: ["Only I", "Only II", "Both"], explanation: "Neither conclusion is forced." },
];

function reasoningBatch(topicId: string, topicTitle: string, setNo: number, count: number): SeedQuestion[] {
  const out: Raw[] = [];
  for (let i = 0; i < count; i++) {
    const s = setNo * 41 + i * 17 + 3;
    const a = 2 + (s % 9);
    const b = a + 1 + (s % 5);
    const c = b + 2 + (s % 3);
    if (topicId === "series" || /series/i.test(topicTitle)) {
      const patterns: Raw[] = [
        {
          topic: topicTitle,
          subtopic: "Number series",
          stem: `Find the next number: ${a}, ${b}, ${c}, ${c + (c - b)}, ?`,
          answer: String(c + 2 * (c - b)),
          wrongs: [String(c + (c - b) + 1), String(c + (c - b) - 1), String(c + a)],
          explanation: `AP with difference ${c - b}.`,
        },
        {
          topic: topicTitle,
          subtopic: "Number series",
          stem: `Find the missing term: ${a}, ${a * 2}, ${a * 4}, ${a * 8}, ?`,
          answer: String(a * 16),
          wrongs: [String(a * 10), String(a * 12), String(a * 14)],
          explanation: "Each term ×2.",
        },
        {
          topic: topicTitle,
          subtopic: "Letter series",
          stem: `Next letters: ${String.fromCharCode(65 + (s % 10))}${String.fromCharCode(66 + (s % 10))}, ${String.fromCharCode(67 + (s % 10))}${String.fromCharCode(68 + (s % 10))}, ${String.fromCharCode(69 + (s % 10))}${String.fromCharCode(70 + (s % 10))}, ?`,
          answer: `${String.fromCharCode(71 + (s % 10))}${String.fromCharCode(72 + (s % 10))}`,
          wrongs: [
            `${String.fromCharCode(70 + (s % 10))}${String.fromCharCode(71 + (s % 10))}`,
            `${String.fromCharCode(72 + (s % 10))}${String.fromCharCode(73 + (s % 10))}`,
            `${String.fromCharCode(69 + (s % 10))}${String.fromCharCode(71 + (s % 10))}`,
          ],
          explanation: "Consecutive letter pairs advancing by 2.",
        },
      ];
      out.push(patterns[i % patterns.length]!);
    } else if (topicId === "coding" || /cod/i.test(topicTitle)) {
      const ch = String.fromCharCode(65 + (s % 20));
      const shift = 1 + (s % 3);
      const next = String.fromCharCode(ch.charCodeAt(0) + shift);
      const word = ["CAT", "DOG", "BAT", "SUN", "MAP"][s % 5]!;
      const coded = word
        .split("")
        .map((c) => String.fromCharCode(((c.charCodeAt(0) - 65 + shift) % 26) + 65))
        .join("");
      if (i % 2 === 0) {
        out.push({
          topic: topicTitle,
          subtopic: "Letter coding",
          stem: `If ${ch} is coded as ${next} (+${shift}), how is the next letter after ${ch} coded the same way?`,
          answer: String.fromCharCode(next.charCodeAt(0) + 1),
          wrongs: [ch, next, String.fromCharCode(ch.charCodeAt(0) + 2)],
          explanation: `Same +${shift} rule on the following letter.`,
        });
      } else {
        out.push({
          topic: topicTitle,
          subtopic: "Word coding",
          stem: `If each letter is shifted +${shift}, ${word} becomes?`,
          answer: coded,
          wrongs: [
            word.split("").reverse().join(""),
            word,
            String.fromCharCode(((word.charCodeAt(0) - 65 + shift + 1) % 26) + 65) + word.slice(1),
          ],
          explanation: `Caesar +${shift} on each letter.`,
        });
      }
    } else if (topicId === "blood" || /blood/i.test(topicTitle)) {
      const item = BLOOD_ITEMS[i % BLOOD_ITEMS.length]!;
      out.push({ ...item, topic: topicTitle, subtopic: "Family tree", stem: `${item.stem} [#${setNo}-${i + 1}]` });
    } else if (topicId === "direction" || /direction/i.test(topicTitle)) {
      const km = 3 + (s % 8);
      const variants: Raw[] = [
        {
          topic: topicTitle,
          subtopic: "Path tracing",
          stem: `A man walks ${km} km east, then ${km} km north, then ${km} km west. How far is he from the start?`,
          answer: `${km} km north`,
          wrongs: [`${km} km east`, `${2 * km} km north`, "At start"],
          explanation: `East/west cancel; net ${km} km north.`,
        },
        {
          topic: topicTitle,
          subtopic: "Path tracing",
          stem: `Ravi walks ${km} km south, then ${km + 2} km east, then ${km} km north. How far from start?`,
          answer: `${km + 2} km east`,
          wrongs: [`${km} km south`, `${2 * km} km east`, "At start"],
          explanation: "South/north cancel; net east remains.",
        },
        {
          topic: topicTitle,
          subtopic: "Facing",
          stem: `A person facing east turns left, then right, then right again. Which direction is he facing now?`,
          answer: "South",
          wrongs: ["West", "North", "East"],
          explanation: "East → left=North → right=East → right=South.",
        },
      ];
      out.push(variants[i % variants.length]!);
    } else if (topicId === "syllogism" || /syllog/i.test(topicTitle)) {
      const item = SYLLOGISM_ITEMS[i % SYLLOGISM_ITEMS.length]!;
      out.push({ ...item, topic: topicTitle, subtopic: "Statements", stem: `${item.stem} [#${setNo}-${i + 1}]` });
    } else if (topicId === "puzzle" || /seat|puzzle/i.test(topicTitle)) {
      const variants: Raw[] = [
        {
          topic: topicTitle,
          subtopic: "Linear seating",
          stem: `Five friends A, B, C, D, E sit in a row facing north. A is second to the left of C. E is at one end. B is immediate right of A. Who sits in the middle? [#${setNo}-${i + 1}]`,
          answer: "B",
          wrongs: ["A", "C", "D"],
          explanation: "Order E-A-B-C-D; middle is B.",
        },
        {
          topic: topicTitle,
          subtopic: "Floor",
          stem: `A, B, C, D live on floors 1–4 (1 lowest). C lives on floor 3. D does not live on floor 1. B lives immediately above A. Who lives on floor 2? [#${setNo}-${i + 1}]`,
          answer: "B",
          wrongs: ["A", "C", "D"],
          explanation: "C=3; D=4; A=1 and B=2.",
        },
        {
          topic: topicTitle,
          subtopic: "Scheduling",
          stem: `Five exams Mon–Fri: Maths, Eng, Sci, Hist, Geo. Maths is on Wednesday. Eng is immediately before Sci. Hist is on Friday. Geo is not on Monday. Which is on Tuesday? [#${setNo}-${i + 1}]`,
          answer: "Sci",
          wrongs: ["Eng", "Geo", "Hist"],
          explanation: "Mon Eng, Tue Sci, Wed Maths, Thu Geo, Fri Hist.",
        },
      ];
      out.push(variants[i % variants.length]!);
    } else if (topicId === "nonverbal" || /non.?verbal|mirror/i.test(topicTitle)) {
      const mirror = ["b", "d", "p", "q"][s % 4]!;
      const map: Record<string, string> = { b: "d", d: "b", p: "q", q: "p" };
      const ans = map[mirror]!;
      const wrongPool = ["b", "d", "p", "q", "o", "n"].filter((x) => x !== ans && x !== mirror);
      out.push({
        topic: topicTitle,
        subtopic: "Mirror",
        stem: `In a plane mirror, the letter '${mirror}' (lowercase) appears most like which option? [#${setNo}-${i + 1}]`,
        answer: ans,
        wrongs: [wrongPool[0]!, wrongPool[1]!, wrongPool[2]!],
        explanation: "Vertical-axis mirror swaps left/right bowls of these letters.",
      });
    } else {
      // analogy / classification (default for analogy topicId)
      const pair = ANALOGY_PAIRS[(s + i) % ANALOGY_PAIRS.length]!;
      out.push({
        topic: topicTitle,
        subtopic: /classif/i.test(pair.stem) ? "Classification" : "Analogy",
        stem: `${pair.stem} [#${setNo}-${i + 1}]`,
        answer: pair.answer,
        wrongs: pair.wrongs,
        explanation: pair.explanation,
      });
    }
  }
  return pack(out, "reasoning", "General Intelligence & Reasoning", setNo);
}

function englishBatch(topicId: string, topicTitle: string, setNo: number, count: number): SeedQuestion[] {
  const out: Raw[] = [];
  const verbs = ["goes", "go", "went", "going"] as const;
  for (let i = 0; i < count; i++) {
    const s = setNo + i;
    if (topicId === "grammar" || /error|grammar/i.test(topicTitle)) {
      out.push({
        topic: topicTitle,
        subtopic: "Error spotting",
        stem: `The quality of the mangoes are not good. Which part has the error? (v${setNo}-${i})`,
        answer: "are → is (subject 'quality')",
        wrongs: ["quality → qualities", "mangoes → mango", "No error"],
        explanation: "Subject is 'quality' (singular) so verb must be 'is', not 'are'.",
      });
    } else if (topicId === "vocab" || /synonym|idiom|vocab/i.test(topicTitle)) {
      const pairs: [string, string, [string, string, string]][] = [
        ["Benevolent", "Kind", ["Hostile", "Cruel", "Stingy"]],
        ["Ephemeral", "Short-lived", ["Eternal", "Solid", "Loud"]],
        ["Candid", "Frank", ["Secretive", "Dull", "Angry"]],
      ];
      const p = pairs[s % pairs.length]!;
      out.push({
        topic: topicTitle,
        subtopic: "Synonym",
        stem: `Choose the synonym of '${p[0]}' (item ${setNo}-${i}).`,
        answer: p[1],
        wrongs: p[2],
        explanation: `${p[0]} means ${p[1]}.`,
      });
    } else if (topicId === "fillers" || /cloze|filler/i.test(topicTitle)) {
      out.push({
        topic: topicTitle,
        subtopic: "Fill blanks",
        stem: `He is senior ___ me in service. (variant ${setNo}-${i})`,
        answer: "to",
        wrongs: ["than", "from", "of"],
        explanation: "senior/junior/prefer take 'to', not 'than'.",
      });
    } else if (topicId === "arrangement" || /jumble/i.test(topicTitle)) {
      out.push({
        topic: topicTitle,
        subtopic: "Para jumble",
        stem: `Arrange: (P) for the exam (Q) she prepared (R) diligently (S) last month. Best order? (v${setNo})`,
        answer: "QRSP",
        wrongs: ["PQRS", "SQPR", "RQPS"],
        explanation: "She prepared diligently for the exam last month → Q-R-S-P.",
      });
    } else {
      out.push({
        topic: topicTitle,
        subtopic: "Comprehension",
        stem: `Tone of the sentence 'Despite repeated failures, he persisted with quiet resolve' is: (v${setNo}-${i})`,
        answer: "Determined",
        wrongs: ["Sarcastic", "Humorous", "Indifferent"],
        explanation: "Persistence after failure shows determination.",
      });
    }
    void verbs;
  }
  return pack(out, "english", "English Comprehension", setNo);
}

function gaBatch(topicId: string, topicTitle: string, setNo: number, count: number): SeedQuestion[] {
  const bank: Record<string, Raw[]> = {
    polity: [
      {
        topic: topicTitle,
        stem: "Which Article deals with the amendment procedure of the Constitution?",
        answer: "Article 368",
        wrongs: ["Article 352", "Article 356", "Article 360"],
        explanation: "Article 368 provides for constitutional amendment.",
      },
      {
        topic: topicTitle,
        stem: "Fundamental Duties were added by which Amendment?",
        answer: "42nd Amendment",
        wrongs: ["44th Amendment", "1st Amendment", "73rd Amendment"],
        explanation: "42nd Amendment (1976) added Part IVA / Article 51A.",
      },
      {
        topic: topicTitle,
        stem: "Article 21 protects:",
        answer: "Life and personal liberty",
        wrongs: ["Freedom of speech", "Right to property", "Cultural rights"],
        explanation: "Article 21: life and personal liberty.",
      },
    ],
    history: [
      {
        topic: topicTitle,
        stem: "The Rowlatt Act was passed in:",
        answer: "1919",
        wrongs: ["1917", "1920", "1915"],
        explanation: "Rowlatt Act, 1919.",
      },
      {
        topic: topicTitle,
        stem: "Lahore Congress session (1929) is famous for:",
        answer: "Purna Swaraj",
        wrongs: ["Quit India", "Non-Cooperation", "Lucknow Pact"],
        explanation: "1929 Lahore under Nehru adopted Purna Swaraj.",
      },
      {
        topic: topicTitle,
        stem: "Forward Bloc was founded by:",
        answer: "Subhas Chandra Bose",
        wrongs: ["Nehru", "Patel", "C.R. Das"],
        explanation: "Bose founded Forward Bloc in 1939.",
      },
    ],
    geography: [
      {
        topic: topicTitle,
        stem: "Which river is called the 'Sorrow of Bihar'?",
        answer: "Kosi",
        wrongs: ["Gandak", "Son", "Ghaghara"],
        explanation: "Kosi floods earned it that name.",
      },
      {
        topic: topicTitle,
        stem: "Black cotton soil is mainly found in:",
        answer: "Deccan Plateau",
        wrongs: ["Indo-Gangetic plain", "Thar", "Eastern Ghats only"],
        explanation: "Regur soil of Deccan Trap lava.",
      },
      {
        topic: topicTitle,
        stem: "Zoji La connects:",
        answer: "Srinagar with Leh",
        wrongs: ["Sikkim with Tibet", "Kullu with Lahaul", "Shimla with Tibet"],
        explanation: "Zoji La links Kashmir valley with Ladakh.",
      },
    ],
    economy: [
      {
        topic: topicTitle,
        stem: "Repo rate is the rate at which:",
        answer: "RBI lends to banks against securities",
        wrongs: ["Banks lend to RBI", "RBI borrows from IMF", "Banks lend to public"],
        explanation: "Repo: RBI → banks.",
      },
      {
        topic: topicTitle,
        stem: "GST came into force in India on:",
        answer: "1 July 2017",
        wrongs: ["1 April 2017", "1 July 2016", "1 January 2018"],
        explanation: "GST live date 1 July 2017.",
      },
      {
        topic: topicTitle,
        stem: "MPC of RBI has how many members?",
        answer: "6",
        wrongs: ["5", "7", "4"],
        explanation: "MPC = 6 (3 RBI + 3 external).",
      },
    ],
    science: [
      {
        topic: topicTitle,
        stem: "SI unit of luminous intensity is:",
        answer: "Candela",
        wrongs: ["Lumen", "Lux", "Watt"],
        explanation: "Candela (cd) is SI base unit.",
      },
      {
        topic: topicTitle,
        stem: "Vitamin A deficiency causes:",
        answer: "Night blindness",
        wrongs: ["Scurvy", "Rickets", "Beriberi"],
        explanation: "Vitamin A → nyctalopia.",
      },
      {
        topic: topicTitle,
        stem: "Major component of biogas is:",
        answer: "Methane",
        wrongs: ["Ethane", "Propane", "Butane"],
        explanation: "Biogas ≈ methane (CH4).",
      },
    ],
    current: [
      {
        topic: topicTitle,
        stem: "Bharat Ratna was instituted in:",
        answer: "1954",
        wrongs: ["1950", "1947", "1960"],
        explanation: "Bharat Ratna instituted 1954.",
      },
      {
        topic: topicTitle,
        stem: "'Discovery of India' was written by:",
        answer: "Jawaharlal Nehru",
        wrongs: ["Gandhi", "Ambedkar", "Radhakrishnan"],
        explanation: "Nehru wrote The Discovery of India.",
      },
      {
        topic: topicTitle,
        stem: "First Indian Nobel laureate in Literature:",
        answer: "Rabindranath Tagore",
        wrongs: ["C.V. Raman", "Amartya Sen", "Mother Teresa"],
        explanation: "Tagore, Literature 1913.",
      },
    ],
  };

  const key =
    topicId in bank
      ? topicId
      : /polit/.test(topicTitle)
        ? "polity"
        : /hist/.test(topicTitle)
          ? "history"
          : /geo/.test(topicTitle)
            ? "geography"
            : /econ/.test(topicTitle)
              ? "economy"
              : /scien|phys|chem|bio/.test(topicTitle)
                ? "science"
                : "current";

  const base = bank[key] ?? bank.current!;
  const out: Raw[] = [];
  for (let i = 0; i < count; i++) {
    const b = base[i % base.length]!;
    out.push({
      ...b,
      stem: `${b.stem} [bank ${setNo}.${i + 1}]`,
    });
  }
  return pack(out, "ga", "General Awareness", setNo);
}

/** Generate a batch for any syllabus topic. */
export function generateBankBatch(args: {
  sectionKey: "quant" | "reasoning" | "english" | "ga";
  topicId: string;
  topicTitle: string;
  subtopicTitle?: string;
  setNo: number;
  count: number;
}): SeedQuestion[] {
  if (args.sectionKey === "quant") {
    const sectionBank = buildSectionPractice("quant", args.setNo);
    return buildTopicLockedPractice({
      sectionKey: "quant",
      topicId: args.topicId,
      topicTitle: args.topicTitle,
      subtopicTitle: args.subtopicTitle,
      setNo: args.setNo,
      count: args.count,
      sectionBank,
    });
  }
  if (args.sectionKey === "reasoning") {
    return reasoningBatch(args.topicId, args.topicTitle, args.setNo, args.count);
  }
  if (args.sectionKey === "english") {
    return englishBatch(args.topicId, args.topicTitle, args.setNo, args.count);
  }
  return gaBatch(args.topicId, args.topicTitle, args.setNo, args.count);
}
