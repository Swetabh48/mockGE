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

function reasoningBatch(topicId: string, topicTitle: string, setNo: number, count: number): SeedQuestion[] {
  const out: Raw[] = [];
  for (let i = 0; i < count; i++) {
    const s = setNo * 41 + i * 17 + 3;
    const a = 2 + (s % 9);
    const b = a + 1 + (s % 5);
    const c = b + 2 + (s % 3);
    if (topicId === "series" || /series/i.test(topicTitle)) {
      const n4 = c + (c - b);
      out.push({
        topic: topicTitle,
        subtopic: "Number series",
        stem: `Find the next number: ${a}, ${b}, ${c}, ${c + (c - b)}, ?`,
        answer: String(n4 + (c - b)),
        wrongs: [String(n4 + 1), String(n4 - 1), String(n4 + a)],
        explanation: `Common difference ${c - b}. Next after ${n4} is ${n4 + (c - b)}.`,
      });
    } else if (topicId === "coding" || /cod/i.test(topicTitle)) {
      const ch = String.fromCharCode(65 + (s % 20));
      const next = String.fromCharCode(ch.charCodeAt(0) + 1);
      out.push({
        topic: topicTitle,
        subtopic: "Letter coding",
        stem: `If in a certain code ${ch} is written as ${next}, how is the next letter after ${ch} coded the same way?`,
        answer: String.fromCharCode(next.charCodeAt(0) + 1),
        wrongs: [ch, next, String.fromCharCode(ch.charCodeAt(0) + 2)],
        explanation: `Pattern is +1 on the letter. ${ch}→${next}, so next→${String.fromCharCode(next.charCodeAt(0) + 1)}.`,
      });
    } else if (topicId === "blood" || /blood/i.test(topicTitle)) {
      out.push({
        topic: topicTitle,
        subtopic: "Family tree",
        stem: `A is the brother of B. B is the sister of C. C is the father of D. How is A related to D?`,
        answer: "Uncle",
        wrongs: ["Father", "Brother", "Cousin"],
        explanation: "A is brother of C (via B), so A is uncle of D.",
      });
    } else if (topicId === "direction" || /direction/i.test(topicTitle)) {
      const km = 3 + (s % 8);
      out.push({
        topic: topicTitle,
        subtopic: "Path tracing",
        stem: `A man walks ${km} km east, then ${km} km north, then ${km} km west. How far is he from the start?`,
        answer: `${km} km north`,
        wrongs: [`${km} km east`, `${2 * km} km north`, "At start"],
        explanation: `East and west cancel; net ${km} km north.`,
      });
    } else if (topicId === "syllogism" || /syllog/i.test(topicTitle)) {
      out.push({
        topic: topicTitle,
        subtopic: "Statements",
        stem: `Statements: All pens are books. Some books are tables. Conclusions: I. Some pens are tables. II. Some books are pens. Which follows?`,
        answer: "Only II",
        wrongs: ["Only I", "Both", "Neither"],
        explanation: "All pens are books ⇒ some books are pens (II). I is not definite.",
      });
    } else if (topicId === "puzzle" || /seat|puzzle/i.test(topicTitle)) {
      out.push({
        topic: topicTitle,
        subtopic: "Linear seating",
        stem: `Five friends A, B, C, D, E sit in a row facing north. A is second to the left of C. E is at one end. B is immediate right of A. Who sits in the middle?`,
        answer: "B",
        wrongs: ["A", "C", "D"],
        explanation: "Typical valid order E-A-B-C-D (or mirror); middle is B.",
      });
    } else {
      out.push({
        topic: topicTitle,
        subtopic: "Analogy",
        stem: `Book : Reading :: Fork : ?`,
        answer: "Eating",
        wrongs: ["Drawing", "Writing", "Cooking"],
        explanation: "Book is used for reading; fork is used for eating.",
      });
    }
  }
  // Vary stems slightly by setNo so fingerprints differ
  return pack(
    out.map((r, i) => ({
      ...r,
      stem: `${r.stem} (Set ${setNo}-${i + 1})`.replace(
        /\(Set \d+-\d+\)$/,
        `(variant ${setNo * 10 + i})`,
      ),
    })),
    "reasoning",
    "General Intelligence & Reasoning",
    setNo,
  );
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
