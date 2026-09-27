#!/usr/bin/env python3
"""Parse official SSC PDFs in sscgl/ into data/sscgl_official.json for the app bank."""

from __future__ import annotations

import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SSCGL = ROOT / "sscgl"
OUT = ROOT / "data" / "sscgl_official.json"

try:
    from pypdf import PdfReader
except ImportError:
    raise SystemExit("pip install pypdf")


def classify(stem: str) -> tuple[str, str]:
    t = stem.lower()
    if any(k in t for k in ("compound interest", "simple interest", "amount to", "rate of interest")):
        return "quant", "si-ci"
    if any(k in t for k in ("discount", "profit", "loss", "marked price", "selling price", "cp")):
        return "quant", "profit-loss"
    if any(k in t for k in ("pipe", "cistern", "work in", "can do a piece", "wages", "efficiency")):
        return "quant", "time-work"
    if any(k in t for k in ("boat", "stream", "train", "km/h", "speed")):
        return "quant", "speed"
    if any(k in t for k in ("average", "ratio", "partnership", "invest")):
        return "quant", "ratio"
    if any(k in t for k in ("triangle", "circle", "pyramid", "cylinder", "prism", "volume", "area of")):
        return "quant", "geometry"
    if any(k in t for k in ("sin", "cos", "tan", "θ", "elevation")):
        return "quant", "trigo"
    if any(k in t for k in ("table", "mean", "standard deviation", "mode", "class interval")):
        return "quant", "di"
    if any(k in t for k in ("probability", "divisible")):
        return "quant", "number-system"
    if any(k in t for k in ("coding", "series", "syllog", "blood", "direction")):
        return "reasoning", "reasoning"
    if any(k in t for k in ("article", "constitution", "gst", "rbi", "president")):
        return "ga", "ga"
    return "quant", "algebra"


def parse_text(text: str, source: str) -> list[dict]:
    # Split on Qn. headers
    parts = re.split(r"\bQ(\d+)\.\s*", text)
    items: list[dict] = []
    # parts: [preamble, num, body, num, body, ...]
    for i in range(1, len(parts) - 1, 2):
        num = parts[i]
        body = parts[i + 1]
        ans_m = re.search(r"Correct Answer:\s*([A-D])", body, flags=re.I)
        if not ans_m:
            continue
        correct = ans_m.group(1).upper()
        before = body[: ans_m.start()]
        # Options often like A) ... B) ... on same/next lines
        opt_m = re.search(
            r"A\)\s*(.*?)\s*B\)\s*(.*?)\s*C\)\s*(.*?)\s*D\)\s*(.*)",
            before,
            flags=re.S | re.I,
        )
        if not opt_m:
            continue
        stem = before[: opt_m.start()].strip()
        stem = re.sub(r"\s+", " ", stem).strip()
        if len(stem) < 20:
            continue
        opts = [re.sub(r"\s+", " ", opt_m.group(j)).strip() for j in range(1, 5)]
        # Skip if options are empty/broken math-only garbage too short
        if any(len(o) == 0 for o in opts):
            continue
        subject, topic = classify(stem)
        items.append(
            {
                "sourcePaper": source,
                "qNo": int(num),
                "subjectKey": subject,
                "topicId": topic,
                "stemEn": stem[:800],
                "optionA": opts[0][:300],
                "optionB": opts[1][:300],
                "optionC": opts[2][:300],
                "optionD": opts[3][:300],
                "correctOption": correct,
                "explanation": f"Official key: option {correct} (SSC CGL PYQ — {source}).",
            }
        )
    return items


def main() -> None:
    OUT.parent.mkdir(parents=True, exist_ok=True)
    all_items: list[dict] = []
    for pdf in sorted(SSCGL.glob("*.pdf")):
        if "(1)" in pdf.name:
            continue
        reader = PdfReader(str(pdf))
        text = "\n".join((p.extract_text() or "") for p in reader.pages)
        items = parse_text(text, pdf.stem[:80])
        print(f"{pdf.name}: extracted {len(items)} MCQs")
        all_items.extend(items)

    # de-dupe by stem prefix
    seen: set[str] = set()
    unique: list[dict] = []
    for q in all_items:
        key = q["stemEn"][:120].lower()
        if key in seen:
            continue
        seen.add(key)
        unique.append(q)

    OUT.write_text(json.dumps({"questions": unique, "count": len(unique)}, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"Wrote {len(unique)} questions → {OUT}")


if __name__ == "__main__":
    main()
