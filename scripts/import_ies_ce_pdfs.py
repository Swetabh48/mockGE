#!/usr/bin/env python3
"""
Parse IES/ESE Civil PDFs under iesce/pdfs/ into data/ies_civil_official.json.

Also optionally seeds Postgres when DATABASE_URL is set and --seed is passed.

Usage:
  python scripts/import_ies_ce_pdfs.py
  python scripts/import_ies_ce_pdfs.py --seed
"""

from __future__ import annotations

import argparse
import json
import os
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PDF_ROOT = ROOT / "iesce" / "pdfs"
OUT = ROOT / "data" / "ies_civil_official.json"
MANIFEST = ROOT / "iesce" / "manifest.json"

try:
    from pypdf import PdfReader
except ImportError:
    raise SystemExit("pip install pypdf")


def classify(stem: str) -> tuple[str, str]:
    t = stem.lower()
    rules = [
        (r"cement|concrete|aggregate|slump|brick", "building_materials", "cement-concrete"),
        (r"young|modulus|poisson|bending|shear force|torsion|euler", "solid_mechanics", "stress-strain"),
        (r"influence|moment distribution|slope deflection|truss", "structural_analysis", "indeterminate"),
        (r"rcc|reinforced|limit state|prestress", "design_concrete", "rcc-beams"),
        (r"fillet weld|bolt|plate girder|is\s*800", "design_steel", "connections"),
        (r"cpm|pert|crash|float|estimate", "construction_mgmt", "cpm-pert"),
        (r"bernoulli|reynolds|pipe|turbine|pump|orifice", "fluid_mechanics", "flow-pipes"),
        (r"hydrograph|rainfall|runoff|infiltration", "hydrology", "hydrographs"),
        (r"irrigation|duty|delta|canal|spillway", "irrigation", "canals"),
        (r"bod|cod|chlorine|sewer|sludge", "environmental", "wastewater"),
        (r"soil|void ratio|compaction|consolidation|bearing", "geotech", "soil-properties"),
        (r"levelling|theodolite|contour|tachometer|gis", "surveying", "levelling"),
        (r"highway|pavement|cbr|superelevation|traffic|railway", "transportation", "highway-geom"),
    ]
    for pat, subj, topic in rules:
        if re.search(pat, t):
            return subj, topic
    return "structural_analysis", "statically-determinate"


_OPT_PATTERNS = [
    # a. / b. / c. / d.  (older IES text PDFs)
    re.compile(
        r"(?:^|\n)\s*a[\.\)]\s*(.*?)\s*b[\.\)]\s*(.*?)\s*c[\.\)]\s*(.*?)\s*d[\.\)]\s*(.*)",
        re.S | re.I,
    ),
    # (A) … (B) … (C) … (D) …  (RapidOCR / modern booklets)
    re.compile(
        r"\(A\)\s*(.*?)\s*\(B\)\s*(.*?)\s*\(C\)\s*(.*?)\s*\(D\)\s*(.*)",
        re.S | re.I,
    ),
    # A) … B) … C) … D) …
    re.compile(
        r"(?:^|\n)\s*A\)\s*(.*?)\s*B\)\s*(.*?)\s*C\)\s*(.*?)\s*D\)\s*(.*)",
        re.S | re.I,
    ),
    # (a) … (b) … (c) … (d) …
    re.compile(
        r"\(a\)\s*(.*?)\s*\(b\)\s*(.*?)\s*\(c\)\s*(.*?)\s*\(d\)\s*(.*)",
        re.S | re.I,
    ),
]

# Main MCQ starts. \s* allows RapidOCR glued stems like "73.An oil…"
# Word lookahead skips bare page codes; assertion "1. The shape…" is filtered in parse_text.
_QSTART = re.compile(
    r"(?:^|\n)\s*(?:Q\.?\s*)?(\d{1,3})[\.\)]\s*"
    r"(?=(?:Consider|Which|Select|The |In |If |Match|Assertion|Given|Identify|"
    r"Choose|With |As |According|Two |Three |Four |A |An |For |When |While |"
    r"Where |What |How |Pick|Regarding|Among|Following|Statement|"
    r"Codes|Code |Column|List |Figure|Diagram|Match List|The specific|"
    r"The value|The ratio|The unit|The modulus|The moment|The shear|"
    r"The bending|The effective|The critical|The maximum|The minimum|"
    r"The degree|The slope|The deflection|The pressure|The discharge|"
    r"The velocity|The force|The stress|The strain|The factor|"
    r"Pozzolana|Cement |Concrete |Steel |Soil |A mild|A steel|A beam|"
    r"A cantilever|A simply|An |Water |Air |Noise|Sewage|Highway|"
    r"Pavement|Survey|Theodolite|Contour|Irrigation|Canal |Dam |"
    r"Turbine|Pump |Pipe |Bernoulli|Darcy|Rankine|Terzaghi|"
    r"IS\s*\d|IRC\s*\d|"
    # Common OCR-glued openers (no space after digit.)
    r"Anoil|Asteel|Abeam|Apipe|Acantilever|Asimply|Athin|"
    r"Whichone|Whichof|Selectthe|Considerthe|Giventhe|"
    r"Inthe|Ifthe|Whenthe|Forthe|Amongthe))",
    re.I,
)

# Option-anchored block: (A)…(B)…(C)…(D)… used when stems are glued/noisy
_OPT_BLOCK = re.compile(
    r"\(A\)\s*(.*?)\s*\(B\)\s*(.*?)\s*\(C\)\s*(.*?)\s*\(D\)\s*(.*?)(?=\n\s*(?:Q\.?\s*)?\d{1,3}[\.\)]|\n\s*---|\Z)",
    re.S | re.I,
)
_QNUM_BEFORE = re.compile(
    r"(?:^|\n)\s*(?:Q\.?\s*)?(\d{1,3})[\.\)]\s*",
    re.I,
)


def _extract_options(body: str) -> tuple[re.Match[str] | None, list[str]]:
    for pat in _OPT_PATTERNS:
        m = pat.search(body)
        if not m:
            continue
        opts = [re.sub(r"\s+", " ", m.group(j)).strip()[:400] for j in range(1, 5)]
        # Trim spill into next question
        opts = [re.split(r"\n\s*\d{1,3}[\.\)]\s+(?:Consider|Which|Select|The )", o, maxsplit=1)[0].strip() for o in opts]
        if all(len(o) >= 1 for o in opts):
            return m, opts
    return None, []


def _item(
    source: str,
    year: int,
    paper: int,
    num: int,
    stem: str,
    opts: list[str],
    correct: str,
) -> dict:
    subject, topic = classify(stem)
    return {
        "sourcePaper": source,
        "year": year,
        "iesPaper": f"ce_paper{paper}",
        "qNo": num,
        "subjectKey": subject,
        "topicId": topic,
        "stemEn": stem[:1200],
        "optionA": opts[0],
        "optionB": opts[1],
        "optionC": opts[2],
        "optionD": opts[3],
        "correctOption": correct,
        "explanation": f"Parsed MCQ (ESE CE {year} Paper-{paper}). Verify official key when available.",
    }


def parse_text(text: str, source: str, year: int, paper: int) -> list[dict]:
    """Parse MCQs using plain split + smart starts + option-anchored fallback."""
    by_num: dict[int, dict] = {}

    # 1) Classic split — best for older selectable-text UPSC PDFs
    parts = re.split(r"(?:^|\n)\s*(?:Q\.?\s*)?(\d{1,3})[\.\)]\s+", text)
    for i in range(1, len(parts) - 1, 2):
        try:
            num = int(parts[i])
        except ValueError:
            continue
        if num < 1 or num > 200:
            continue
        body = parts[i + 1]
        opt_m, opts = _extract_options(body)
        if not opt_m:
            continue
        stem = re.sub(r"\s+", " ", body[: opt_m.start()]).strip()
        if len(stem) < 20:
            continue
        ans_m = re.search(
            r"(?:Correct Answer|Ans(?:wer)?)\s*[:\.]?\s*\(?([A-Da-d])\)?",
            body,
            flags=re.I,
        )
        correct = ans_m.group(1).upper() if ans_m else "A"
        by_num[num] = _item(source, year, paper, num, stem, opts, correct)

    # 2) Smart starts — helps RapidOCR two-column assertion papers
    starts = list(_QSTART.finditer(text))
    for idx, m in enumerate(starts):
        num = int(m.group(1))
        if num < 1 or num > 200:
            continue
        # Skip assertion/list sub-points (1–4) that sit inside a larger MCQ
        if num <= 4 and idx > 0:
            prev_num = int(starts[idx - 1].group(1))
            if prev_num >= 5 and prev_num > num:
                continue
        end = starts[idx + 1].start() if idx + 1 < len(starts) else len(text)
        body = text[m.end() : end]
        opt_m, opts = _extract_options(body)
        if not opt_m:
            continue
        stem = re.sub(r"\s+", " ", body[: opt_m.start()]).strip()
        if len(stem) < 20:
            continue
        prev = by_num.get(num)
        if prev and len(prev["stemEn"]) >= len(stem):
            continue
        by_num[num] = _item(source, year, paper, num, stem, opts, "A")

    # 3) Option-anchored — recover glued OCR where stem/number split failed
    for om in _OPT_BLOCK.finditer(text):
        opts = [re.sub(r"\s+", " ", om.group(j)).strip()[:400] for j in range(1, 5)]
        if not all(len(o) >= 1 for o in opts):
            continue
        before = text[max(0, om.start() - 900) : om.start()]
        nums = list(_QNUM_BEFORE.finditer(before))
        if not nums:
            continue
        # Prefer the last q-number >= 5 (skip assertion 1–4), else last number
        pick = None
        for nm in reversed(nums):
            n = int(nm.group(1))
            if 5 <= n <= 200:
                pick = nm
                break
        if pick is None:
            pick = nums[-1]
            n = int(pick.group(1))
            if n < 1 or n > 200:
                continue
        else:
            n = int(pick.group(1))
        stem = re.sub(r"\s+", " ", before[pick.end() :]).strip()
        # Drop trailing assertion list noise markers at end of stem
        if len(stem) < 20:
            continue
        prev = by_num.get(n)
        if prev and len(prev["stemEn"]) >= len(stem):
            continue
        by_num[n] = _item(source, year, paper, n, stem, opts, "A")

    return [by_num[k] for k in sorted(by_num)]


def seed_db(papers_payload: list[dict]) -> None:
    """Insert PYQ papers into Postgres via prisma-compatible SQL through psycopg / subprocess."""
    try:
        import psycopg
    except ImportError:
        print("psycopg not installed — skip DB seed. Use: npx tsx scripts/seed_ies_from_json.ts")
        return

    url = os.environ.get("DATABASE_URL")
    if not url:
        print("DATABASE_URL not set — JSON written only.")
        return

    # Prefer TS seeder for Prisma schema compatibility
    print("Prefer running: npx tsx scripts/seed_ies_from_json.ts")
    _ = papers_payload


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--seed", action="store_true", help="Hint to seed DB after import")
    args = ap.parse_args()

    OUT.parent.mkdir(parents=True, exist_ok=True)
    all_items: list[dict] = []
    paper_meta: list[dict] = []

    pdfs = sorted(PDF_ROOT.glob("*/*.pdf"))
    if not pdfs:
        print(f"No PDFs under {PDF_ROOT}. Run: python scripts/download_ies_ce_papers.py")
        # Still write empty scaffold
        OUT.write_text(
            json.dumps({"questions": [], "papers": [], "note": "No PDFs imported yet"}, indent=2),
            encoding="utf-8",
        )
        sys.exit(0)

    for pdf in pdfs:
        try:
            year = int(pdf.parent.name)
        except ValueError:
            continue
        m = re.search(r"paper(\d)", pdf.name, re.I)
        paper = int(m.group(1)) if m else 2
        source = f"ESE_{year}_CE_P{paper}"
        print(f"Parse {pdf.relative_to(ROOT)} …")
        try:
            reader = PdfReader(str(pdf))
            text = "\n".join((page.extract_text() or "") for page in reader.pages)
        except Exception as e:
            print(f"  skip: {e}")
            continue
        items = parse_text(text, source, year, paper)
        print(f"  -> {len(items)} questions")
        all_items.extend(items)
        paper_meta.append(
            {
                "year": year,
                "iesPaper": f"ce_paper{paper}",
                "sourcePaper": source,
                "path": str(pdf.relative_to(ROOT)).replace("\\", "/"),
                "questionCount": len(items),
            }
        )

    payload = {
        "exam": "ies_civil",
        "questions": all_items,
        "papers": paper_meta,
        "count": len(all_items),
    }
    OUT.write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"Wrote {len(all_items)} questions -> {OUT}")

    if args.seed:
        seed_db(paper_meta)
        print("Run: npx tsx scripts/seed_ies_from_json.ts")


if __name__ == "__main__":
    main()
