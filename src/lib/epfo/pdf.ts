/**
 * Client-side PDF builders (jsPDF, loaded on demand).
 *  - question paper (booklet style)  - printable OMR sheet  - result / solutions report
 */
import type { jsPDF as JsPDF } from "jspdf";
import { drawOmr, type Painter } from "./omrLayout";
import { MULTI, type Evaluation, type Mark } from "./scoring";
import { SECTION_BY_KEY } from "./sections";
import { OPTION_LETTERS, type EpfoPaper, type EpfoQuestion } from "./types";

async function newDoc(): Promise<JsPDF> {
  const { jsPDF } = await import("jspdf");
  return new jsPDF({ unit: "mm", format: "a4", compress: true });
}

/** Standard PDF fonts only cover Latin-1; map the few symbols we use. */
export function pdfText(s: string): string {
  return s
    .replace(/₹\s?/g, "Rs. ")
    .replace(/[−–—]/g, "-")
    .replace(/[‘’]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/…/g, "...")
    .replace(/•/g, "-")
    .replace(/→/g, "->")
    .replace(/←/g, "<-")
    .replace(/≈/g, "~")
    .replace(/≤/g, "<=")
    .replace(/≥/g, ">=")
    .replace(/≠/g, "!=")
    .replace(/√/g, "sqrt")
    .replace(/π/g, "pi")
    .replace(/ⁿ/g, "^n")
    .replace(/⅔/g, "2/3")
    .replace(/⅓/g, "1/3")
    .replace(/∝/g, " proportional to ")
    .replace(/≡/g, "=")
    .replace(/[₀-₉]/g, (c) => String(c.charCodeAt(0) - 0x2080))
    .replace(/[⁰¹²³⁴-⁹]+/g, (m) => `^${[...m].map((c) => "⁰¹²³⁴⁵⁶⁷⁸⁹".indexOf(c)).join("")}`)
    .replace(/[^\x09\x0a\x0d\x20-\x7e\xa0-\xff]/g, "?");
}

const M = 15; // margin
const PW = 210;
const PH = 297;
const CW = PW - 2 * M;

class Flow {
  y = M;
  constructor(
    public doc: JsPDF,
    private footer: string,
  ) {}
  ensure(h: number) {
    if (this.y + h > PH - M - 6) {
      this.doc.addPage();
      this.y = M;
    }
  }
  text(s: string, opts: { size?: number; bold?: boolean; indent?: number; gray?: number; gap?: number; width?: number } = {}) {
    const size = opts.size ?? 10;
    const lh = size * 0.42;
    this.doc.setFont("helvetica", opts.bold ? "bold" : "normal");
    this.doc.setFontSize(size);
    this.doc.setTextColor(Math.round((opts.gray ?? 0) * 255));
    const indent = opts.indent ?? 0;
    const lines = this.doc.splitTextToSize(pdfText(s), (opts.width ?? CW) - indent) as string[];
    for (const ln of lines) {
      this.ensure(lh);
      this.doc.text(ln, M + indent, this.y + lh * 0.8);
      this.y += lh;
    }
    this.y += opts.gap ?? 0;
  }
  measure(s: string, size: number, width: number): number {
    this.doc.setFontSize(size);
    const lines = this.doc.splitTextToSize(pdfText(s), width) as string[];
    return lines.length * size * 0.42;
  }
  rule(gray = 0.8) {
    this.doc.setDrawColor(Math.round(gray * 255));
    this.doc.setLineWidth(0.2);
    this.doc.line(M, this.y, PW - M, this.y);
    this.y += 2;
  }
  finish() {
    const n = this.doc.getNumberOfPages();
    for (let i = 1; i <= n; i++) {
      this.doc.setPage(i);
      this.doc.setFont("helvetica", "normal");
      this.doc.setFontSize(7.5);
      this.doc.setTextColor(120);
      this.doc.text(pdfText(this.footer), M, PH - 8);
      this.doc.text(`Page ${i} of ${n}`, PW - M, PH - 8, { align: "right" });
    }
  }
}

function questionBlockHeight(f: Flow, q: EpfoQuestion, size: number): number {
  let h = f.measure(`${q.n}. ${q.q}`, size, CW - 6) + 1.5;
  const short = q.o.every((o) => o.length <= 34);
  if (short) h += 2 * size * 0.42 + 2;
  else for (const o of q.o) h += f.measure(o, size, CW - 14);
  return h + 3;
}

function writeOptions(f: Flow, q: EpfoQuestion, size: number, annotate?: (i: number) => string) {
  const short = !annotate && q.o.every((o) => o.length <= 34);
  const lh = size * 0.42;
  f.doc.setFont("helvetica", "normal");
  f.doc.setFontSize(size);
  f.doc.setTextColor(0);
  if (short) {
    for (let row = 0; row < 2; row++) {
      f.ensure(lh + 1);
      for (let col = 0; col < 2; col++) {
        const i = row * 2 + col;
        f.doc.text(pdfText(`(${OPTION_LETTERS[i]}) ${q.o[i]}`), M + 6 + col * (CW / 2), f.y + lh * 0.8);
      }
      f.y += lh + 1;
    }
    return;
  }
  q.o.forEach((o, i) => {
    f.text(`(${OPTION_LETTERS[i]}) ${o}${annotate ? annotate(i) : ""}`, { size, indent: 6 });
  });
}

function download(doc: JsPDF, filename: string) {
  doc.save(filename);
}

export async function downloadQuestionPaper(paper: EpfoPaper) {
  download(await buildQuestionPaper(paper), `${paper.id}-question-paper.pdf`);
}

export async function buildQuestionPaper(paper: EpfoPaper): Promise<JsPDF> {
  const doc = await newDoc();
  const f = new Flow(doc, `mockGE · ${paper.title} · Question booklet (Series A)`);
  // cover
  f.text("mockGE", { size: 11, bold: true, gray: 0.35 });
  f.y += 2;
  f.text("EPFO — ASSISTANT PROVIDENT FUND COMMISSIONER", { size: 15, bold: true });
  f.text("Recruitment Test · Mock Question Booklet", { size: 12, gap: 2 });
  f.text(`${paper.title}   |   Paper code ${paper.id.toUpperCase()}   |   Test booklet series: A`, { size: 10, gray: 0.25, gap: 3 });
  f.rule(0.6);
  f.ensure(8);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(0);
  doc.text("Time allowed: Two hours", M, f.y + 4);
  doc.text(`Maximum marks: ${paper.questions.length * paper.marksPerQ}`, PW - M, f.y + 4, { align: "right" });
  f.y += 9;
  f.text("INSTRUCTIONS TO CANDIDATES", { size: 10.5, bold: true, gap: 1.5 });
  const inst = [
    `This booklet has ${paper.questions.length} questions. Each question offers four answers marked (a), (b), (c) and (d).`,
    "Choose the single best answer and darken its bubble on the separate OMR answer sheet with a black or blue ball-point pen.",
    `Every question carries ${paper.marksPerQ} marks. A wrong answer costs one-third of the marks of that question (${(paper.negPerQ).toFixed(2)} marks). Marking more than one answer is treated as wrong. An unanswered question earns nothing and loses nothing.`,
    "There are no sectional time limits. Rough work may be done in the margins of this booklet.",
    "Write the paper code and your details on the OMR sheet before you begin. Do not fold the OMR sheet and keep its four corner squares clean.",
    "After the test, upload a clear photo of the OMR sheet on mockGE to get your score, section-wise analysis and solutions — or open the solutions directly.",
    "This is an original practice paper created by mockGE. It is not an official UPSC paper.",
  ];
  inst.forEach((s, i) => f.text(`${i + 1}.  ${s}`, { size: 9.5, indent: 2, gap: 1.2 }));
  f.y += 4;
  f.text("DO NOT OPEN THIS BOOKLET UNTIL YOU ARE ASKED TO DO SO", { size: 10, bold: true, gray: 0.2 });
  doc.addPage();
  f.y = M;

  let lastPassage = "";
  for (const q of paper.questions) {
    if (q.p && q.p !== lastPassage) {
      const ph = f.measure(q.p, 9.5, CW - 4) + 10;
      f.ensure(Math.min(ph, 120));
      f.text("Directions: Read the passage below and answer the questions that follow it.", { size: 9.5, bold: true, gap: 1 });
      f.text(q.p, { size: 9.5, indent: 2, gap: 3 });
      lastPassage = q.p;
    }
    f.ensure(questionBlockHeight(f, q, 10));
    f.text(`${q.n}.  ${q.q}`, { size: 10, gap: 1 });
    writeOptions(f, q, 10);
    f.y += 3;
  }
  f.text("— END OF BOOKLET —", { size: 9, bold: true, gray: 0.4 });
  f.finish();
  return doc;
}

function jsPainter(doc: JsPDF): Painter {
  const g = (v = 0) => Math.round(v * 255);
  return {
    rect(x, y, w, h, fill, gray = 0, lw = 0.3) {
      if (fill) {
        doc.setFillColor(g(gray), g(gray), g(gray));
        doc.rect(x, y, w, h, "F");
      } else {
        doc.setDrawColor(g(gray));
        doc.setLineWidth(lw);
        doc.rect(x, y, w, h, "S");
      }
    },
    circle(x, y, r, fill, gray = 0, lw = 0.3) {
      if (fill) {
        doc.setFillColor(g(gray), g(gray), g(gray));
        doc.circle(x, y, r, "F");
      } else {
        doc.setDrawColor(g(gray));
        doc.setLineWidth(lw);
        doc.circle(x, y, r, "S");
      }
    },
    line(x1, y1, x2, y2, gray = 0, lw = 0.3) {
      doc.setDrawColor(g(gray));
      doc.setLineWidth(lw);
      doc.line(x1, y1, x2, y2);
    },
    text(s, x, y, size, opts = {}) {
      doc.setFont("helvetica", opts.bold ? "bold" : "normal");
      doc.setFontSize(size);
      doc.setTextColor(g(opts.gray ?? 0));
      doc.text(pdfText(s), x, y, { align: opts.align ?? "left" });
    },
  };
}

export async function buildOmrSheet(paper: EpfoPaper): Promise<JsPDF> {
  const doc = await newDoc();
  drawOmr(jsPainter(doc), paper, paper.questions.length);
  return doc;
}

export async function downloadOmrSheet(paper: EpfoPaper) {
  download(await buildOmrSheet(paper), `${paper.id}-omr-sheet.pdf`);
}

export async function downloadReport(paper: EpfoPaper, marks: Mark[] | null, ev: Evaluation | null, meta?: { mode: string; date: string }) {
  download(await buildReport(paper, marks, ev, meta), `${paper.id}-${ev ? "result" : "solutions"}.pdf`);
}

export async function buildReport(paper: EpfoPaper, marks: Mark[] | null, ev: Evaluation | null, meta?: { mode: string; date: string }): Promise<JsPDF> {
  const doc = await newDoc();
  const f = new Flow(doc, `mockGE · ${paper.title} · ${ev ? "Result & solutions" : "Solutions"}`);
  f.text("mockGE · EPFO APFC Mock", { size: 10, bold: true, gray: 0.35 });
  f.text(`${paper.title} — ${ev ? "Result report" : "Answer key & solutions"}`, { size: 15, bold: true, gap: 1 });
  if (meta) f.text(`${meta.mode === "online" ? "Taken online" : "Taken offline (OMR)"} · ${meta.date}`, { size: 9, gray: 0.35, gap: 2 });
  f.rule(0.6);

  if (ev) {
    f.text(`Score: ${ev.score} / ${ev.maxScore}`, { size: 14, bold: true });
    f.text(`Correct ${ev.correct}  ·  Wrong ${ev.wrong}${ev.multi ? ` (incl. ${ev.multi} multiple-marked)` : ""}  ·  Unattempted ${ev.unattempted}  ·  Accuracy ${ev.accuracy}%  ·  Marks lost to negative marking ${ev.negLost}`, { size: 9.5, gap: 3 });
    // section table
    const cols = [0, 78, 98, 116, 136, 156];
    const head = ["Section", "Qs", "Correct", "Wrong", "Skipped", "Score"];
    f.ensure(8);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(0);
    head.forEach((h, i) => doc.text(h, M + cols[i]!, f.y + 3.5));
    f.y += 5;
    f.rule(0.75);
    doc.setFont("helvetica", "normal");
    for (const s of ev.sections) {
      f.ensure(5);
      const row = [s.label, String(s.total), String(s.correct), String(s.wrong), String(s.unattempted), `${s.score} / ${s.max}`];
      row.forEach((v, i) => doc.text(pdfText(v), M + cols[i]!, f.y + 3.5));
      f.y += 5;
    }
    f.y += 3;
    f.text("Where to improve", { size: 11, bold: true, gap: 1 });
    for (const imp of ev.improvements) {
      f.text(`- ${imp.title}`, { size: 9.5, bold: true });
      f.text(imp.detail, { size: 9, indent: 3, gap: 1.5, gray: 0.15 });
    }
    if (ev.strengths.length) {
      f.text("Strengths", { size: 11, bold: true, gap: 1 });
      for (const s of ev.strengths) f.text(`- ${s}`, { size: 9, indent: 1 });
    }
    f.y += 3;
    f.rule(0.6);
  }

  f.text("Questions, answers and solutions", { size: 12, bold: true, gap: 2 });
  let lastPassage = "";
  for (const [i, q] of paper.questions.entries()) {
    if (q.p && q.p !== lastPassage) {
      f.ensure(20);
      f.text("Passage:", { size: 9, bold: true });
      f.text(q.p, { size: 9, indent: 2, gap: 2 });
      lastPassage = q.p;
    }
    const m = marks ? marks[i] ?? null : undefined;
    const status = m === undefined ? "" : m === null ? "Not attempted" : m === q.a ? `Correct (+${paper.marksPerQ})` : m === MULTI ? `Multiple marked (-${paper.negPerQ.toFixed(2)})` : `Wrong (-${paper.negPerQ.toFixed(2)})`;
    f.ensure(Math.min(60, questionBlockHeight(f, q, 9.5) + 10));
    f.text(`${q.n}. [${SECTION_BY_KEY[q.sec].short} · ${q.topic}]${status ? `   — ${status}` : ""}`, { size: 8.5, bold: true, gray: m === undefined ? 0.35 : m === q.a ? 0.1 : 0.3 });
    f.text(q.q, { size: 9.5, gap: 0.8 });
    writeOptions(f, q, 9.5, (oi) => (oi === q.a ? "   [correct answer]" : m === oi ? "   [your answer]" : ""));
    const your = m === undefined ? "" : m === null ? "—" : m === MULTI ? "more than one" : `(${OPTION_LETTERS[m]})`;
    f.text(`Answer: (${OPTION_LETTERS[q.a]})${m !== undefined ? `     Your response: ${your}` : ""}`, { size: 9, bold: true, gap: 0.5 });
    f.text(`Solution: ${q.x}`, { size: 9, gray: 0.15, indent: 2, gap: 3 });
  }
  f.finish();
  return doc;
}
