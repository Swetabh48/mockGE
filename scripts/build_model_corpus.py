#!/usr/bin/env python3
"""Build corpus from free local sources (official PDFs + exemplars)."""

from __future__ import annotations

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "data" / "model_corpus.jsonl"
OFFICIAL = ROOT / "data" / "sscgl_official.json"


def main() -> None:
    rows: list[dict] = []
    if OFFICIAL.exists():
        data = json.loads(OFFICIAL.read_text(encoding="utf-8"))
        for q in data.get("questions", []):
            rows.append(
                {
                    "instruction": f"Write one hard SSC CGL MCQ on topic {q.get('topicId')}.",
                    "input": "",
                    "output": json.dumps(
                        {
                            "stemEn": q.get("stemEn"),
                            "optionA": q.get("optionA"),
                            "optionB": q.get("optionB"),
                            "optionC": q.get("optionC"),
                            "optionD": q.get("optionD"),
                            "correctOption": q.get("correctOption"),
                            "explanation": q.get("explanation"),
                            "topic": q.get("topicId"),
                        },
                        ensure_ascii=False,
                    ),
                }
            )

    exemplars = [
        {
            "topic": "Time & Work",
            "stemEn": "A can do a work in 18 days and B in 27 days. They work together for 6 days and then A alone finishes. Total days?",
            "optionA": "14 days",
            "optionB": "15 days",
            "optionC": "16 days",
            "optionD": "12 days",
            "correctOption": "A",
            "explanation": "LCM=54. A=3/day B=2/day. 6 days → 30; left 24; A needs 8; total 14.",
            "trick": "LCM work units; subtract joint; finish with A.",
        },
        {
            "topic": "Simple & Compound Interest",
            "stemEn": "CI on Rs 12000 at 10% for 2 years (annual) is?",
            "optionA": "Rs 2520",
            "optionB": "Rs 2400",
            "optionC": "Rs 2640",
            "optionD": "Rs 2200",
            "correctOption": "A",
            "explanation": "2-yr CI% = 21 → 12000×0.21=2520. SI trap=2400.",
            "trick": "2R+R²/100 for 2 years.",
        },
    ]
    for e in exemplars:
        rows.append(
            {
                "instruction": f"Write one hard SSC CGL MCQ on topic {e['topic']}.",
                "input": "",
                "output": json.dumps(e, ensure_ascii=False),
            }
        )

    OUT.parent.mkdir(parents=True, exist_ok=True)
    with OUT.open("w", encoding="utf-8") as f:
        for r in rows:
            f.write(json.dumps(r, ensure_ascii=False) + "\n")
    print(f"Wrote {len(rows)} rows → {OUT}")


if __name__ == "__main__":
    main()
