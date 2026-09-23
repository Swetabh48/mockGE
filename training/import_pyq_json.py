"""
Import user-provided SSC CGL PYQ JSON into the training corpus.

Place files under: training/data/pyq_import/*.json
Each file = one paper or a list of questions.

Accepted shapes (any of):
1) [ {stemEn|question, optionA|option_a, ..., correctOption|correct_option|answer, topic?, explanation?}, ... ]
2) { "questions": [ ... ] }
3) Alpaca already: { "instruction", "input", "output" }

Then:
  python training/build_corpus.py
  python training/train_lora.py --max-steps 40

NOTE: Do NOT drop Cracku/Testbook scraped PDFs here. Import only papers you
are allowed to use (your notes, open-licensed banks, official releases you may use).
"""

from __future__ import annotations

import json
import re
from pathlib import Path

IMPORT_DIR = Path(__file__).resolve().parent / "data" / "pyq_import"
OUT = Path(__file__).resolve().parent / "data" / "pyq_imported.jsonl"


def _norm_correct(raw: str, options: dict[str, str]) -> str:
    r = (raw or "A").strip().upper()
    mapping = {
        "OPTION_A": "A",
        "OPTION_B": "B",
        "OPTION_C": "C",
        "OPTION_D": "D",
        "1": "A",
        "2": "B",
        "3": "C",
        "4": "D",
        "A": "A",
        "B": "B",
        "C": "C",
        "D": "D",
    }
    if r in mapping:
        return mapping[r]
    for k, v in options.items():
        if v.strip().lower() == raw.strip().lower():
            return k
    return "A"


def _to_alpaca(q: dict) -> dict | None:
    if "instruction" in q and "output" in q:
        return {
            "instruction": str(q["instruction"]),
            "input": str(q.get("input") or ""),
            "output": str(q["output"]),
        }

    stem = q.get("stemEn") or q.get("question") or q.get("stem") or q.get("text")
    if not stem:
        return None

    opts = {
        "A": str(q.get("optionA") or q.get("option_a") or q.get("A") or ""),
        "B": str(q.get("optionB") or q.get("option_b") or q.get("B") or ""),
        "C": str(q.get("optionC") or q.get("option_c") or q.get("C") or ""),
        "D": str(q.get("optionD") or q.get("option_d") or q.get("D") or ""),
    }
    if isinstance(q.get("options"), list) and len(q["options"]) >= 4:
        opts = {
            "A": str(q["options"][0]),
            "B": str(q["options"][1]),
            "C": str(q["options"][2]),
            "D": str(q["options"][3]),
        }
    if not all(opts.values()):
        return None

    correct = _norm_correct(
        str(q.get("correctOption") or q.get("correct_option") or q.get("answer") or "A"),
        opts,
    )
    topic = str(q.get("topic") or q.get("subject") or "SSC CGL")
    expl = str(q.get("explanation") or q.get("solution") or "")
    payload = {
        "stemEn": str(stem),
        "optionA": opts["A"],
        "optionB": opts["B"],
        "optionC": opts["C"],
        "optionD": opts["D"],
        "correctOption": correct,
        "topic": topic,
        "explanation": expl,
    }
    return {
        "instruction": (
            "Create one HARD SSC CGL Tier-I MCQ matching previous-year difficulty on "
            f"{topic}. Return JSON only."
        ),
        "input": "",
        "output": json.dumps(payload, ensure_ascii=False),
    }


def load_pyq_imports() -> list[dict]:
    IMPORT_DIR.mkdir(parents=True, exist_ok=True)
    rows: list[dict] = []
    for path in sorted(IMPORT_DIR.glob("*.json")):
        try:
            data = json.loads(path.read_text(encoding="utf-8"))
        except Exception as e:
            print(f"Skip {path.name}: {e}")
            continue
        items = data if isinstance(data, list) else data.get("questions") or data.get("mcqs") or [data]
        n = 0
        for q in items:
            if not isinstance(q, dict):
                continue
            row = _to_alpaca(q)
            if row:
                rows.append(row)
                n += 1
        print(f"Imported {n} from {path.name}")
    return rows


def main() -> None:
    rows = load_pyq_imports()
    OUT.parent.mkdir(parents=True, exist_ok=True)
    with OUT.open("w", encoding="utf-8") as f:
        for r in rows:
            f.write(json.dumps(r, ensure_ascii=False) + "\n")
    print(f"Wrote {len(rows)} -> {OUT}")
    if not rows:
        sample = IMPORT_DIR / "SAMPLE_FORMAT.json"
        sample.write_text(
            json.dumps(
                [
                    {
                        "stemEn": "Example only — replace with your allowed PYQs.",
                        "optionA": "A",
                        "optionB": "B",
                        "optionC": "C",
                        "optionD": "D",
                        "correctOption": "B",
                        "topic": "Percentage",
                        "explanation": "demo",
                    }
                ],
                indent=2,
            ),
            encoding="utf-8",
        )
        print(f"No imports yet. Added template: {sample}")


if __name__ == "__main__":
    main()
