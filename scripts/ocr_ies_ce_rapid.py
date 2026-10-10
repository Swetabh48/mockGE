#!/usr/bin/env python3
"""
OCR scanned IES/ESE Civil PDFs with RapidOCR (ONNX).

Handles two-column UPSC pages by OCRing left then right halves separately.
Merges into data/ies_civil_official.json.

Usage:
  python scripts/ocr_ies_ce_rapid.py --years 2017 --max-pages 5 --papers 2
  python scripts/ocr_ies_ce_rapid.py   # all years >= 2009 with PDFs
"""

from __future__ import annotations

import argparse
import io
import json
import re
import sys
import time
from pathlib import Path

import numpy as np
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
PDF_ROOT = ROOT / "iesce" / "pdfs"
OUT = ROOT / "data" / "ies_civil_official.json"
RAW_DIR = ROOT / "iesce" / "ocr_text"

try:
    import pymupdf
except ImportError:
    raise SystemExit("pip install pymupdf")

try:
    from rapidocr_onnxruntime import RapidOCR
except ImportError:
    raise SystemExit("pip install rapidocr-onnxruntime")

sys.path.insert(0, str(ROOT / "scripts"))
from import_ies_ce_pdfs import parse_text  # noqa: E402


def ocr_array(engine: RapidOCR, arr: np.ndarray) -> str:
    result, _ = engine(arr)
    if not result:
        return ""
    # Sort by vertical position then x (reading order within a column strip)
    rows = []
    for row in result:
        box, text, conf = row[0], row[1], row[2] if len(row) > 2 else 1.0
        xs = [p[0] for p in box]
        ys = [p[1] for p in box]
        cx, cy = sum(xs) / 4, sum(ys) / 4
        rows.append((cy, cx, str(text)))
    rows.sort(key=lambda t: (round(t[0] / 12), t[1]))
    return "\n".join(t[2] for t in rows if t[2].strip())


def ocr_page_two_column(engine: RapidOCR, png_bytes: bytes) -> str:
    """OCR left column then right column (UPSC booklet layout)."""
    img = Image.open(io.BytesIO(png_bytes)).convert("RGB")
    w, h = img.size
    # Slight overlap at the gutter
    mid = w // 2
    gutter = max(8, w // 80)
    left = np.array(img.crop((0, 0, mid + gutter, h)))
    right = np.array(img.crop((mid - gutter, 0, w, h)))
    left_txt = ocr_array(engine, left)
    right_txt = ocr_array(engine, right)
    # Cover pages / instructions are usually single-column — if right is tiny, use full page
    if len(right_txt) < 80 and len(left_txt) > 200:
        return ocr_array(engine, np.array(img))
    if len(left_txt) < 40:
        return right_txt
    return left_txt + "\n\n" + right_txt


def improve_ocr_text(text: str) -> str:
    t = text
    t = re.sub(r"(\w)-\n(\w)", r"\1\2", t)
    # Bare question number on its own line → "12. "
    t = re.sub(r"(?m)^(\d{1,3})\s*\n(?=[A-Z])", r"\1. ", t)
    # RapidOCR often glues number to stem: "73.An oil" → "73. An oil"
    t = re.sub(r"(?m)^(\d{1,3})\.([A-Za-z])", r"\1. \2", t)
    t = re.sub(r"(?<=\n)(\d{1,3})\.([A-Za-z])", r"\1. \2", t)
    # Option markers on their own lines
    t = re.sub(
        r"(?m)^\s*[\(\[]?\s*([A-Da-d])\s*[\)\]\.\:]\s*",
        lambda m: f"\n({m.group(1).upper()}) ",
        t,
    )
    # Inline options
    t = re.sub(r"\s*\(([a-dA-D])\)\s*", lambda m: f"\n({m.group(1).upper()}) ", t)
    t = re.sub(r"(?m)^\s*(\d{1,3})\s*[\.\)\|\:]\s+", r"\n\1. ", t)
    t = re.sub(r"[ \t]+", " ", t)
    return t


def process_pdf(
    engine: RapidOCR,
    path: Path,
    year: int,
    paper: int,
    max_pages: int,
    dpi_scale: float,
) -> tuple[str, list[dict]]:
    doc = pymupdf.open(path)
    pages = min(len(doc), max_pages)
    chunks: list[str] = []
    for i in range(pages):
        page = doc[i]
        pix = page.get_pixmap(matrix=pymupdf.Matrix(dpi_scale, dpi_scale), alpha=False)
        png = pix.tobytes("png")
        print(f"  RapidOCR {path.name} p{i+1}/{pages} …", flush=True)
        t0 = time.time()
        try:
            text = ocr_page_two_column(engine, png)
        except Exception as e:
            print(f"    fail: {e}")
            continue
        print(f"    {len(text)} chars in {time.time()-t0:.1f}s")
        if text.strip():
            chunks.append(f"\n--- page {i+1} ---\n{text}")
    full = improve_ocr_text("\n".join(chunks))
    source = f"ESE_{year}_CE_P{paper}"
    items = parse_text(full, source, year, paper)
    for q in items:
        q["explanation"] = (
            f"Parsed via RapidOCR (ESE CE {year} Paper-{paper}). "
            f"Option key: {q['correctOption']} (verify against official key if available)."
        )
        q["sourcePaper"] = source + "_rapidocr"
    return full, items


def default_years() -> list[int]:
    years = set()
    for p in PDF_ROOT.glob("*/*.pdf"):
        try:
            y = int(p.parent.name)
        except ValueError:
            continue
        if y >= 2009:
            years.add(y)
    return sorted(years)


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--years", default="", help="Comma years (default: all >=2009)")
    ap.add_argument("--max-pages", type=int, default=40)
    ap.add_argument("--scale", type=float, default=1.7, help="Render scale (~DPI/72)")
    ap.add_argument("--papers", default="1,2")
    ap.add_argument(
        "--force",
        action="store_true",
        help="Re-OCR even if paper already has >40 questions",
    )
    args = ap.parse_args()

    years = (
        [int(y.strip()) for y in args.years.split(",") if y.strip()]
        if args.years.strip()
        else default_years()
    )
    papers = [int(p.strip()) for p in args.papers.split(",") if p.strip()]

    print("Loading RapidOCR engine…")
    engine = RapidOCR()

    if not OUT.exists():
        raise SystemExit(f"Missing {OUT} — run python scripts/import_ies_ce_pdfs.py first")
    existing = json.loads(OUT.read_text(encoding="utf-8"))
    # Never drop text-extracted pre-2009 rows
    base_qs = [
        q
        for q in existing.get("questions", [])
        if int(q.get("year") or 0) < 2009
        or (
            int(q.get("year") or 0) >= 2009
            and "_rapidocr" not in str(q.get("sourcePaper", ""))
            and int(q.get("year") or 0) not in years
        )
    ]

    RAW_DIR.mkdir(parents=True, exist_ok=True)
    new_items: list[dict] = []
    # Keep non-targeted post-2008 questions that we are not re-processing
    keep_other = [
        q
        for q in existing.get("questions", [])
        if int(q.get("year") or 0) >= 2009 and int(q.get("year") or 0) not in years
    ]

    for year in years:
        for paper in papers:
            pdf = PDF_ROOT / str(year) / f"paper{paper}.pdf"
            if not pdf.exists():
                continue
            have = [
                q
                for q in existing.get("questions", [])
                if q.get("year") == year and q.get("iesPaper") == f"ce_paper{paper}"
            ]
            if len(have) > 40 and not args.force and any(
                "_rapidocr" in str(q.get("sourcePaper", "")) for q in have
            ):
                print(f"Skip {year} paper{paper} (already {len(have)} RapidOCR Q)")
                new_items.extend(have)
                continue

            print(f"\n=== {year} paper{paper} ===")
            full, items = process_pdf(engine, pdf, year, paper, args.max_pages, args.scale)
            raw_path = RAW_DIR / f"{year}_paper{paper}.txt"
            raw_path.write_text(full, encoding="utf-8")
            print(f"  parsed {len(items)} MCQs; raw -> {raw_path.relative_to(ROOT)}")
            new_items.extend(items)
            # Incremental save so a crash doesn't lose finished papers
            try:
                snap = json.loads(OUT.read_text(encoding="utf-8")) if OUT.exists() else {"questions": []}
                pre = [q for q in snap.get("questions", []) if int(q.get("year") or 0) < 2009]
                # drop this year/paper then add
                others = [
                    q
                    for q in snap.get("questions", [])
                    if not (
                        int(q.get("year") or 0) == year
                        and q.get("iesPaper") == f"ce_paper{paper}"
                    )
                    and int(q.get("year") or 0) >= 2009
                ]
                merged = pre + others + items
                u: dict[str, dict] = {}
                for q in merged:
                    u[f"{q.get('year')}|{q.get('iesPaper')}|{q.get('qNo')}"] = q
                qs = list(u.values())
                OUT.write_text(
                    json.dumps(
                        {
                            "exam": "ies_civil",
                            "questions": qs,
                            "count": len(qs),
                            "note": "Incremental RapidOCR save in progress.",
                        },
                        ensure_ascii=False,
                        indent=2,
                    ),
                    encoding="utf-8",
                )
                print(f"  checkpoint: {len(qs)} total in JSON")
            except Exception as e:
                print(f"  checkpoint warn: {e}")

    # Base = all text-extracted (<2009) + keep_other years + new OCR for requested years
    text_pre = [q for q in existing.get("questions", []) if int(q.get("year") or 0) < 2009]
    all_q = text_pre + keep_other + new_items

    uniq: dict[str, dict] = {}
    for q in all_q:
        k = f"{q.get('year')}|{q.get('iesPaper')}|{q.get('qNo')}"
        # Prefer rapidocr over sparse stubs
        if k in uniq and "_rapidocr" not in str(q.get("sourcePaper", "")):
            continue
        uniq[k] = q
    questions = sorted(
        uniq.values(),
        key=lambda q: (q.get("year", 0), q.get("iesPaper", ""), q.get("qNo", 0)),
    )

    groups: dict[str, int] = {}
    for q in questions:
        gk = f"{q['year']}|{q['iesPaper']}"
        groups[gk] = groups.get(gk, 0) + 1
    papers_meta = []
    for gk, n in sorted(groups.items()):
        y, ip = gk.split("|")
        papers_meta.append({"year": int(y), "iesPaper": ip, "questionCount": n})

    OUT.write_text(
        json.dumps(
            {
                "exam": "ies_civil",
                "questions": questions,
                "papers": papers_meta,
                "count": len(questions),
                "note": "Text PDF parse (pre-2009) + RapidOCR two-column for scanned UPSC CE papers.",
            },
            ensure_ascii=False,
            indent=2,
        ),
        encoding="utf-8",
    )
    print(f"\nWrote {len(questions)} total questions -> {OUT}")
    print("Next: npx tsx scripts/seed_ies_from_json.ts && python scripts/build_ies_corpus.py")


if __name__ == "__main__":
    main()
