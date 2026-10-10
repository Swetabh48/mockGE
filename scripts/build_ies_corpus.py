#!/usr/bin/env python3
"""Build IES Civil instruction corpus → data/ies_model_corpus.jsonl"""

from __future__ import annotations

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "data" / "ies_model_corpus.jsonl"
OFFICIAL = ROOT / "data" / "ies_civil_official.json"

EXEMPLARS = [
    {
        "topic": "Soil properties",
        "subject": "geotech",
        "stemEn": "For a saturated soil, void ratio e equals:",
        "optionA": "w / G",
        "optionB": "w G",
        "optionC": "G / w",
        "optionD": "w + G",
        "correctOption": "B",
        "explanation": "S=1 ⇒ e = w G_s.",
    },
    {
        "topic": "Laminar pipe flow",
        "subject": "fluid_mechanics",
        "stemEn": "In laminar flow through a circular pipe, V_max / V_avg is:",
        "optionA": "1.0",
        "optionB": "1.5",
        "optionC": "2.0",
        "optionD": "2.5",
        "correctOption": "C",
        "explanation": "Parabolic profile ⇒ u_max = 2 V_avg.",
    },
    {
        "topic": "OPC setting",
        "subject": "building_materials",
        "stemEn": "Minimum initial setting time of OPC (IS) is:",
        "optionA": "15 min",
        "optionB": "30 min",
        "optionC": "45 min",
        "optionD": "60 min",
        "correctOption": "B",
        "explanation": "IS: initial ≥ 30 min; final ≤ 600 min.",
    },
]


def main() -> None:
    rows: list[dict] = []
    if OFFICIAL.exists():
        data = json.loads(OFFICIAL.read_text(encoding="utf-8"))
        for q in data.get("questions", []):
            rows.append(
                {
                    "instruction": (
                        f"Write one hard UPSC ESE/IES Civil MCQ on topic {q.get('topicId')} "
                        f"(subject {q.get('subjectKey')})."
                    ),
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
                            "subject": q.get("subjectKey"),
                        },
                        ensure_ascii=False,
                    ),
                }
            )

    for e in EXEMPLARS:
        rows.append(
            {
                "instruction": f"Write one hard UPSC ESE/IES Civil MCQ on topic {e['topic']}.",
                "input": "",
                "output": json.dumps(e, ensure_ascii=False),
            }
        )

    OUT.parent.mkdir(parents=True, exist_ok=True)
    with OUT.open("w", encoding="utf-8") as f:
        for r in rows:
            f.write(json.dumps(r, ensure_ascii=False) + "\n")
    print(f"Wrote {len(rows)} rows -> {OUT}")


if __name__ == "__main__":
    main()
