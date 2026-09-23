import type { SectionKey } from "./blueprints";

export interface ScoredAnswer {
  questionId: string;
  sectionKey: SectionKey;
  subject: string;
  topic: string;
  correctOption: string;
  selected: string | null;
  marks: number;
  negativeMarks: number;
  timeSpentMs: number;
  changeCount: number;
  markedReview: boolean;
}

export interface SectionScore {
  sectionKey: string;
  label: string;
  correct: number;
  wrong: number;
  unattempted: number;
  score: number;
  maxScore: number;
  accuracy: number;
  avgTimeMs: number;
}

export interface TopicStat {
  topic: string;
  subject: string;
  correct: number;
  wrong: number;
  unattempted: number;
  attempted: number;
  accuracy: number;
}

export interface EvaluationResult {
  score: number;
  maxScore: number;
  correctCount: number;
  wrongCount: number;
  unattempted: number;
  sections: SectionScore[];
  topics: TopicStat[];
  strengths: string[];
  weaknesses: string[];
  timeAnalysis: {
    totalTimeMs: number;
    suggestedPaceMs: number;
    avgTimePerQuestionMs: number;
    timeOnWrongMs: number;
    timeOnCorrectMs: number;
    highChangeQuestions: number;
    perQuestion: { questionId: string; qIndex: number; timeSpentMs: number; status: string }[];
  };
}

const SECTION_LABELS: Record<string, string> = {
  reasoning: "Reasoning",
  ga: "General Awareness",
  quant: "Quantitative Aptitude",
  english: "English",
  maths: "Mathematical Abilities",
  computer: "Computer Knowledge",
};

export function evaluateAttempt(
  answers: ScoredAnswer[],
  qIndexById: Record<string, number>,
  durationSeconds: number,
): EvaluationResult {
  let score = 0;
  let maxScore = 0;
  let correctCount = 0;
  let wrongCount = 0;
  let unattempted = 0;

  const sectionMap = new Map<
    string,
    {
      correct: number;
      wrong: number;
      unattempted: number;
      score: number;
      maxScore: number;
      time: number;
      n: number;
    }
  >();

  const topicMap = new Map<
    string,
    { subject: string; correct: number; wrong: number; unattempted: number }
  >();

  let timeOnWrongMs = 0;
  let timeOnCorrectMs = 0;
  let highChangeQuestions = 0;
  const perQuestion: EvaluationResult["timeAnalysis"]["perQuestion"] = [];

  for (const a of answers) {
    maxScore += a.marks;
    const sec =
      sectionMap.get(a.sectionKey) ??
      {
        correct: 0,
        wrong: 0,
        unattempted: 0,
        score: 0,
        maxScore: 0,
        time: 0,
        n: 0,
      };
    sec.maxScore += a.marks;
    sec.time += a.timeSpentMs;
    sec.n += 1;

    const topicKey = `${a.subject}::${a.topic}`;
    const top =
      topicMap.get(topicKey) ?? {
        subject: a.subject,
        correct: 0,
        wrong: 0,
        unattempted: 0,
      };

    let status = "unattempted";
    if (!a.selected) {
      unattempted += 1;
      sec.unattempted += 1;
      top.unattempted += 1;
    } else if (a.selected === a.correctOption) {
      score += a.marks;
      sec.score += a.marks;
      correctCount += 1;
      sec.correct += 1;
      top.correct += 1;
      timeOnCorrectMs += a.timeSpentMs;
      status = "correct";
    } else {
      score -= a.negativeMarks;
      sec.score -= a.negativeMarks;
      wrongCount += 1;
      sec.wrong += 1;
      top.wrong += 1;
      timeOnWrongMs += a.timeSpentMs;
      status = "wrong";
    }

    if (a.changeCount >= 2) highChangeQuestions += 1;

    sectionMap.set(a.sectionKey, sec);
    topicMap.set(topicKey, top);
    perQuestion.push({
      questionId: a.questionId,
      qIndex: qIndexById[a.questionId] ?? 0,
      timeSpentMs: a.timeSpentMs,
      status,
    });
  }

  const sections: SectionScore[] = [...sectionMap.entries()].map(([key, s]) => {
    const attempted = s.correct + s.wrong;
    return {
      sectionKey: key,
      label: SECTION_LABELS[key] ?? key,
      correct: s.correct,
      wrong: s.wrong,
      unattempted: s.unattempted,
      score: Math.round(s.score * 100) / 100,
      maxScore: s.maxScore,
      accuracy: attempted === 0 ? 0 : Math.round((s.correct / attempted) * 1000) / 10,
      avgTimeMs: s.n === 0 ? 0 : Math.round(s.time / s.n),
    };
  });

  const topics: TopicStat[] = [...topicMap.entries()]
    .map(([key, t]) => {
      const topic = key.split("::")[1] ?? key;
      const attempted = t.correct + t.wrong;
      return {
        topic,
        subject: t.subject,
        correct: t.correct,
        wrong: t.wrong,
        unattempted: t.unattempted,
        attempted,
        accuracy: attempted === 0 ? 0 : Math.round((t.correct / attempted) * 1000) / 10,
      };
    })
    .filter((t) => t.attempted > 0)
    .sort((a, b) => a.accuracy - b.accuracy);

  const strengths = topics
    .filter((t) => t.attempted >= 2 && t.accuracy >= 70)
    .slice(-5)
    .reverse()
    .map((t) => `${t.topic} (${t.subject})`);

  const weaknesses = topics
    .filter((t) => t.attempted >= 2 && t.accuracy < 50)
    .slice(0, 5)
    .map((t) => `${t.topic} (${t.subject})`);

  const totalTimeMs = answers.reduce((s, a) => s + a.timeSpentMs, 0);
  const n = answers.length || 1;

  return {
    score: Math.round(score * 100) / 100,
    maxScore,
    correctCount,
    wrongCount,
    unattempted,
    sections,
    topics,
    strengths,
    weaknesses,
    timeAnalysis: {
      totalTimeMs,
      suggestedPaceMs: Math.round((durationSeconds * 1000) / n),
      avgTimePerQuestionMs: Math.round(totalTimeMs / n),
      timeOnWrongMs,
      timeOnCorrectMs,
      highChangeQuestions,
      perQuestion: perQuestion.sort((a, b) => a.qIndex - b.qIndex),
    },
  };
}
