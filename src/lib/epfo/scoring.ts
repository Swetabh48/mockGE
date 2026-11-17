import { EPFO_SECTIONS, SECTION_BY_KEY } from "./sections";
import type { EpfoPaper, SectionKey } from "./types";

/** null = not attempted, 0..3 = option, -1 = more than one bubble marked (OMR). */
export type Mark = number | null;
export const MULTI = -1;

export type SectionStat = {
  key: SectionKey;
  label: string;
  total: number;
  correct: number;
  wrong: number;
  unattempted: number;
  score: number;
  max: number;
  /** correct / attempted, 0–100 */
  accuracy: number;
  timeSec?: number;
};

export type TopicStat = {
  sec: SectionKey;
  topic: string;
  total: number;
  correct: number;
  wrong: number;
  unattempted: number;
};

export type Evaluation = {
  correct: number;
  wrong: number;
  unattempted: number;
  multi: number;
  score: number;
  maxScore: number;
  negLost: number;
  accuracy: number;
  attempted: number;
  sections: SectionStat[];
  topics: TopicStat[];
  strengths: string[];
  improvements: { title: string; detail: string }[];
};

const round2 = (n: number) => Math.round(n * 100) / 100;

export function evaluate(paper: EpfoPaper, marks: Mark[], timeSpent?: number[]): Evaluation {
  const secMap = new Map<SectionKey, SectionStat>();
  for (const s of EPFO_SECTIONS) {
    secMap.set(s.key, { key: s.key, label: s.label, total: 0, correct: 0, wrong: 0, unattempted: 0, score: 0, max: 0, accuracy: 0, timeSec: timeSpent ? 0 : undefined });
  }
  const topicMap = new Map<string, TopicStat>();
  let correct = 0, wrong = 0, unattempted = 0, multi = 0;

  paper.questions.forEach((q, i) => {
    const m = marks[i] ?? null;
    const s = secMap.get(q.sec)!;
    s.total += 1;
    s.max += paper.marksPerQ;
    if (timeSpent && s.timeSec !== undefined) s.timeSec += timeSpent[i] ?? 0;
    const tk = `${q.sec}::${q.topic}`;
    const t = topicMap.get(tk) ?? { sec: q.sec, topic: q.topic, total: 0, correct: 0, wrong: 0, unattempted: 0 };
    t.total += 1;
    if (m === null) {
      unattempted++;
      s.unattempted++;
      t.unattempted++;
    } else if (m === q.a) {
      correct++;
      s.correct++;
      t.correct++;
      s.score += paper.marksPerQ;
    } else {
      // wrong answer or multiple marking — both attract the penalty (UPSC rule)
      if (m === MULTI) multi++;
      wrong++;
      s.wrong++;
      t.wrong++;
      s.score -= paper.negPerQ;
    }
    topicMap.set(tk, t);
  });

  const sections = [...secMap.values()].map((s) => ({
    ...s,
    score: round2(s.score),
    accuracy: s.correct + s.wrong ? Math.round((s.correct / (s.correct + s.wrong)) * 100) : 0,
  }));
  const negLost = round2(wrong * paper.negPerQ);
  const score = round2(correct * paper.marksPerQ - negLost);
  const attempted = correct + wrong;
  const accuracy = attempted ? Math.round((correct / attempted) * 100) : 0;
  const topics = [...topicMap.values()];

  const strengths: string[] = [];
  const improvements: { title: string; detail: string }[] = [];

  for (const s of sections) {
    const att = s.correct + s.wrong;
    if (att >= Math.max(3, s.total * 0.6) && s.accuracy >= 75) {
      strengths.push(`${s.label}: ${s.correct}/${s.total} correct (${s.accuracy}% accuracy).`);
    }
  }

  // weakest sections by marks lost against the section maximum
  const weakSecs = sections
    .map((s) => ({ s, lostShare: (s.max - s.score) / s.max }))
    .filter(({ s }) => s.correct / s.total < 0.6)
    .sort((a, b) => b.lostShare - a.lostShare)
    .slice(0, 4);
  for (const { s } of weakSecs) {
    const meta = SECTION_BY_KEY[s.key];
    const why =
      s.unattempted > s.wrong
        ? `${s.unattempted} left unattempted — coverage gap rather than carelessness.`
        : s.wrong > 0
          ? `${s.wrong} wrong (−${round2(s.wrong * paper.negPerQ)} marks) — concepts are being half-remembered.`
          : "";
    improvements.push({
      title: `${s.label} — ${s.correct}/${s.total} correct, ${s.score} of ${s.max} marks`,
      detail: `${why} ${meta.tips.slice(0, 2).join(" ")}`.trim(),
    });
  }

  const weakTopics = topics
    .filter((t) => t.wrong + t.unattempted >= Math.max(1, Math.ceil(t.total * 0.5)) && t.total >= 2)
    .sort((a, b) => b.wrong + b.unattempted - (a.wrong + a.unattempted) || b.wrong - a.wrong)
    .slice(0, 8);
  if (weakTopics.length) {
    improvements.push({
      title: "Topics to revise first",
      detail: weakTopics
        .map((t) => `${t.topic} (${SECTION_BY_KEY[t.sec].short}): ${t.correct}/${t.total} correct`)
        .join("; "),
    });
  }

  if (attempted > 0 && wrong / attempted > 0.3) {
    improvements.push({
      title: `Negative marking cost you ${negLost} marks`,
      detail: `${wrong} of ${attempted} attempted answers were wrong. With a one-third penalty, a blind guess has negative expected value; guess only after eliminating at least two options.`,
    });
  }
  if (attempted < paper.questions.length * 0.7) {
    improvements.push({
      title: `Only ${attempted} of ${paper.questions.length} questions attempted`,
      detail: "Do a first pass for sure-shot questions (≈60 min), a second pass for two-option eliminations, and keep 10 minutes to transfer/verify answers on the OMR.",
    });
  }
  if (timeSpent) {
    const slow = sections
      .filter((s) => s.total > 0 && (s.timeSec ?? 0) / s.total > 90)
      .map((s) => `${SECTION_BY_KEY[s.key].short} (${Math.round((s.timeSec ?? 0) / s.total)} s/question)`);
    if (slow.length) {
      improvements.push({
        title: "Time sinks",
        detail: `You averaged over 90 seconds per question in: ${slow.join(", ")}. The paper allows 60 seconds per question on average — move on and return later.`,
      });
    }
  }
  if (multi > 0) {
    improvements.push({
      title: `${multi} question(s) had more than one bubble marked`,
      detail: "Multiple marking is treated as a wrong answer and attracts the penalty. Darken exactly one bubble per question.",
    });
  }
  if (!improvements.length) {
    improvements.push({
      title: "Well balanced attempt",
      detail: "No section fell below 60%. Keep taking full-length mocks under strict timing and review every wrong answer.",
    });
  }

  return {
    correct,
    wrong,
    unattempted,
    multi,
    score,
    maxScore: paper.questions.length * paper.marksPerQ,
    negLost,
    accuracy,
    attempted,
    sections,
    topics,
    strengths,
    improvements,
  };
}
