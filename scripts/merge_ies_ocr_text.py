#!/usr/bin/env python3
"""Merge iesce/ocr_text/*.txt into data/ies_civil_official.json (no re-OCR)."""

from __future__ import annotations

import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
RAW_DIR = ROOT / "iesce" / "ocr_text"
OUT = ROOT / "data" / "ies_civil_official.json"

sys.path.insert(0, str(ROOT / "scripts"))
from import_ies_ce_pdfs import parse_text  # noqa: E402
from ocr_ies_ce_rapid import improve_ocr_text  # noqa: E402


def main() -> None:
    if not OUT.exists():
        raise SystemExit(f"Missing {OUT} — run import_ies_ce_pdfs.py first")
    data = json.loads(OUT.read_text(encoding="utf-8"))

    # Keep text-extracted pre-2009 (+ any non-OCR rows we want)
    base = [
        q
        for q in data.get("questions", [])
        if int(q.get("year") or 0) < 2009
        or "_rapidocr" not in str(q.get("sourcePaper", ""))
        and int(q.get("year") or 0) < 2009
    ]
    # cleaner: only keep year < 2009 from base text import
    base = [q for q in data.get("questions", []) if int(q.get("year") or 0) < 2009]

    ocr_items: list[dict] = []
    for path in sorted(RAW_DIR.glob("*_paper*.txt")):
        m = re.match(r"(\d{4})_paper(\d)\.txt$", path.name)
        if not m:
            continue
        year, paper = int(m.group(1)), int(m.group(2))
        text = improve_ocr_text(path.read_text(encoding="utf-8", errors="ignore"))
        source = f"ESE_{year}_CE_P{paper}_rapidocr"
        items = parse_text(text, source, year, paper)
        for q in items:
            q["sourcePaper"] = source
            q["explanation"] = (
                f"Parsed via RapidOCR (ESE CE {year} Paper-{paper}). "
                "Verify official key when available."
            )
        print(f"{path.name}: {len(items)} Q")
        ocr_items.extend(items)

    uniq: dict[str, dict] = {}
    for q in base + ocr_items:
        k = f"{q.get('year')}|{q.get('iesPaper')}|{q.get('qNo')}"
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
                "note": "Text PDF parse (pre-2009) + RapidOCR merge from iesce/ocr_text/.",
            },
            ensure_ascii=False,
            indent=2,
        ),
        encoding="utf-8",
    )
    print(f"Wrote {len(questions)} total -> {OUT}")


if __name__ == "__main__":
    main()
