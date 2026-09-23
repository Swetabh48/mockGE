"""Convert indian_govt_exam Google Sheet CSV → pyq_import JSON (SSC-family only)."""

from __future__ import annotations

import json
from pathlib import Path

import pandas as pd

ROOT = Path(__file__).resolve().parent
CSV = ROOT / "data" / "pyq_import" / "govt_exam_sheet.csv"
OUT = ROOT / "data" / "pyq_import" / "ssc_community_pyq.json"

CAT_MAP = {
    "gk": "General Awareness",
    "science": "General Science",
    "history": "History",
    "politics": "Polity",
    "entertainment": "General Awareness",
    "tech": "Science & Tech",
    "current_affairs": "Current Affairs",
    "sports": "Sports",
    "health": "General Science",
}

LETTERS = {1: "A", 2: "B", 3: "C", 4: "D"}


def is_ssc(exam: object) -> bool:
    e = str(exam).upper()
    return any(
        x in e
        for x in (
            "CGL",
            "CHSL",
            "SSC",
            "COMBINED GRADUATE",
            "COMBINED HIGHER",
            "MTS",
            "CPO",
        )
    )


def main() -> None:
    df = pd.read_csv(CSV)
    df.columns = [c.strip() for c in df.columns]
    ssc = df[df["EXAM"].map(is_ssc)].copy()

    out: list[dict] = []
    for _, r in ssc.iterrows():
        try:
            ans_i = int(r["ANSWER"])
        except (TypeError, ValueError):
            ans_i = 1
        correct = LETTERS.get(ans_i, "A")
        exam = str(r["EXAM"]).strip()
        year = str(r["YEAR"]).strip() if pd.notna(r.get("YEAR")) else ""
        if year == "nan":
            year = ""
        topic = CAT_MAP.get(str(r["CATEGORY"]).strip().lower(), str(r["CATEGORY"]))
        tag = f"{exam} {year}".strip()
        stem = f"[{tag}] {str(r['QUESTION']).strip()}"
        out.append(
            {
                "stemEn": stem,
                "optionA": str(r["OPTION 1"]).strip(),
                "optionB": str(r["OPTION 2"]).strip(),
                "optionC": str(r["OPTION 3"]).strip(),
                "optionD": str(r["OPTION 4"]).strip(),
                "correctOption": correct,
                "topic": topic,
                "explanation": (
                    f"Community-curated SSC-family PYQ ({tag}). "
                    "Source: Urten/indian_govt_exam open dataset / public Google Sheet."
                ),
                "source": "indian_govt_exam",
                "exam": exam,
                "year": year,
            }
        )

    OUT.write_text(json.dumps(out, ensure_ascii=False, indent=2), encoding="utf-8")
    cgl_n = sum(
        1
        for x in out
        if "GRADUATE" in x["exam"].upper() or "CGL" in x["exam"].upper()
    )
    print(f"wrote {OUT} total={len(out)} cgl={cgl_n}")


if __name__ == "__main__":
    main()
