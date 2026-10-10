#!/usr/bin/env python3
"""
OCR scanned IES/ESE Civil PDFs with Gemini vision, append to data/ies_civil_official.json.

Usage:
  set GEMINI_API_KEY=...
  python scripts/ocr_ies_ce_gemini.py --years 2019,2020,2021,2022 --max-pages 40
"""

from __future__ import annotations

import argparse
import base64
import json
import os
import re
import time
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PDF_ROOT = ROOT / "iesce" / "pdfs"
OUT = ROOT / "data" / "ies_civil_official.json"

try:
    import pymupdf  # type: ignore
except ImportError:
    raise SystemExit("pip install pymupdf")


def load_key() -> str:
    key = os.environ.get("GEMINI_API_KEY", "")
    if key:
        return key
    env = ROOT / ".env"
    if env.exists():
        for line in env.read_text(encoding="utf-8").splitlines():
            if line.startswith("GEMINI_API_KEY="):
                return line.split("=", 1)[1].strip().strip('"')
    raise SystemExit("GEMINI_API_KEY not set")


def classify(stem: str) -> tuple[str, str]:
    t = stem.lower()
    rules = [
        (r"cement|concrete|aggregate|slump|brick", "building_materials", "cement-concrete"),
        (r"young|modulus|bending|shear|torsion|euler", "solid_mechanics", "stress-strain"),
        (r"influence|moment distribution|truss", "structural_analysis", "indeterminate"),
        (r"rcc|reinforced|prestress|limit state", "design_concrete", "rcc-beams"),
        (r"weld|bolt|plate girder|is\s*800", "design_steel", "connections"),
        (r"cpm|pert|estimate", "construction_mgmt", "cpm-pert"),
        (r"bernoulli|reynolds|pipe|turbine|pump", "fluid_mechanics", "flow-pipes"),
        (r"hydrograph|rainfall|runoff", "hydrology", "hydrographs"),
        (r"irrigation|duty|canal|spillway", "irrigation", "canals"),
        (r"bod|cod|chlorine|sewer", "environmental", "wastewater"),
        (r"soil|void ratio|compaction|bearing", "geotech", "soil-properties"),
        (r"levelling|theodolite|contour", "surveying", "levelling"),
        (r"highway|pavement|cbr|traffic", "transportation", "highway-geom"),
    ]
    for pat, s, top in rules:
        if re.search(pat, t):
            return s, top
    return "structural_analysis", "statically-determinate"


def gemini_ocr_page(key: str, model: str, png_b64: str, year: int, paper: int) -> list[dict]:
    prompt = (
        f"This is a page from UPSC ESE/IES Civil Engineering objective paper {paper}, year {year}. "
        "Extract EVERY MCQ visible. Return JSON array only. Each object: "
        "qNo (int), stemEn, optionA, optionB, optionC, optionD, correctOption (A-D if printed else empty string). "
        "Preserve numbers/units. Skip instructions and headers."
    )
    body = {
        "contents": [
            {
                "parts": [
                    {"text": prompt},
                    {"inline_data": {"mime_type": "image/png", "data": png_b64}},
                ]
            }
        ],
        "generationConfig": {
            "temperature": 0.1,
            "maxOutputTokens": 8192,
            "responseMimeType": "application/json",
        },
    }
    url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={key}"
    req = urllib.request.Request(
        url,
        data=json.dumps(body).encode("utf-8"),
        headers={"Content-Type": "application/json"},
        method="POST",
    )
    with urllib.request.urlopen(req, timeout=180) as resp:
        data = json.loads(resp.read().decode("utf-8"))
    text = "".join(
        p.get("text", "")
        for c in data.get("candidates", [])
        for p in c.get("content", {}).get("parts", [])
    )
    text = text.replace("```json", "").replace("```", "").strip()
    m = re.search(r"\[[\s\S]*\]", text)
    if not m:
        return []
    try:
        arr = json.loads(m.group(0))
    except json.JSONDecodeError:
        return []
    return arr if isinstance(arr, list) else []


def process_pdf(path: Path, year: int, paper: int, key: str, model: str, max_pages: int) -> list[dict]:
    doc = pymupdf.open(path)
    items: list[dict] = []
    seen: set[int] = set()
    pages = min(len(doc), max_pages)
    for i in range(pages):
        page = doc[i]
        # rasterize at decent DPI for OCR
        pix = page.get_pixmap(matrix=pymupdf.Matrix(1.8, 1.8), alpha=False)
        png_b64 = base64.b64encode(pix.tobytes("png")).decode("ascii")
        print(f"  OCR {path.name} page {i+1}/{pages} …")
        raw: list[dict] = []
        for attempt in range(4):
            try:
                raw = gemini_ocr_page(key, model, png_b64, year, paper)
                break
            except Exception as e:
                wait = 3 * (attempt + 1)
                print(f"    fail attempt {attempt+1}: {e} (sleep {wait}s)")
                time.sleep(wait)
        if not raw:
            continue
        for q in raw:
            try:
                qno = int(q.get("qNo") or 0)
            except (TypeError, ValueError):
                continue
            stem = str(q.get("stemEn") or "").strip()
            if qno <= 0 or len(stem) < 20 or qno in seen:
                continue
            seen.add(qno)
            opts = [str(q.get(k) or "").strip() for k in ("optionA", "optionB", "optionC", "optionD")]
            if any(len(o) < 1 for o in opts):
                continue
            correct = str(q.get("correctOption") or "A").upper()[:1]
            if correct not in "ABCD":
                correct = "A"
            subj, topic = classify(stem)
            items.append(
                {
                    "sourcePaper": f"ESE_{year}_CE_P{paper}",
                    "year": year,
                    "iesPaper": f"ce_paper{paper}",
                    "qNo": qno,
                    "subjectKey": subj,
                    "topicId": topic,
                    "stemEn": stem[:1200],
                    "optionA": opts[0][:400],
                    "optionB": opts[1][:400],
                    "optionC": opts[2][:400],
                    "optionD": opts[3][:400],
                    "correctOption": correct,
                    "explanation": f"Parsed via Gemini OCR (ESE CE {year} Paper-{paper}).",
                }
            )
        time.sleep(0.8)
    return items


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--years", default="2019,2020,2021,2022", help="Comma years to OCR")
    ap.add_argument("--max-pages", type=int, default=35)
    ap.add_argument("--model", default=os.environ.get("GEMINI_MODEL", "gemini-3.8-flash"))
    args = ap.parse_args()
    key = load_key()
    years = [int(y.strip()) for y in args.years.split(",") if y.strip()]

    existing = {"questions": [], "papers": [], "count": 0}
    if OUT.exists():
        existing = json.loads(OUT.read_text(encoding="utf-8"))

    new_items: list[dict] = []

    for year in years:
        for paper in (1, 2):
            pdf = PDF_ROOT / str(year) / f"paper{paper}.pdf"
            if not pdf.exists():
                continue
            old_count = sum(
                1
                for q in existing.get("questions", [])
                if q.get("year") == year and q.get("iesPaper") == f"ce_paper{paper}"
            )
            if old_count > 40:
                print(f"Skip {year} paper{paper} (already {old_count} Q)")
                continue
            print(f"Year {year} paper{paper}")
            items = process_pdf(pdf, year, paper, key, args.model, args.max_pages)
            print(f"  -> {len(items)} questions")
            new_items.extend(items)

    # Keep all existing; OCR results overwrite same year|paper|qNo via de-dupe below
    all_q = list(existing.get("questions", [])) + new_items
    # de-dupe by year|paper|qNo
    uniq: dict[str, dict] = {}
    for q in all_q:
        k = f"{q.get('year')}|{q.get('iesPaper')}|{q.get('qNo')}"
        uniq[k] = q
    questions = list(uniq.values())
    papers_meta = []
    groups: dict[str, int] = {}
    for q in questions:
        gk = f"{q['year']}|{q['iesPaper']}"
        groups[gk] = groups.get(gk, 0) + 1
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
                "note": "Includes Gemini OCR for scanned UPSC PDFs where text extract failed.",
            },
            ensure_ascii=False,
            indent=2,
        ),
        encoding="utf-8",
    )
    print(f"Wrote {len(questions)} total questions -> {OUT}")


if __name__ == "__main__":
    main()
