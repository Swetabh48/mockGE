"""Build SSC-CGL instruction-tuning JSONL from open sources + original generators.

Sources (all free / open):
- ssc-open-mcq-bank (CC BY 4.0) when present
- HuggingFace 169Pi/exambench filtered for SSC (Apache-2.0)
- Local algorithmic SSC-style generators (original)

Does NOT scrape commercial copyrighted mock portals.
"""

from __future__ import annotations

import json
import random
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent
DATA = ROOT / "data"
OUT = DATA / "ssc_cgl_train.jsonl"
OPEN_BANK = DATA / "ssc-open-mcq-bank"


def alpaca(instruction: str, output: str, inp: str = "") -> dict:
    return {"instruction": instruction, "input": inp, "output": output}


def mcq_output(stem: str, options: dict[str, str], correct: str, explanation: str, topic: str) -> str:
    return json.dumps(
        {
            "stemEn": stem,
            "optionA": options["A"],
            "optionB": options["B"],
            "optionC": options["C"],
            "optionD": options["D"],
            "correctOption": correct,
            "topic": topic,
            "explanation": explanation,
        },
        ensure_ascii=False,
    )


def generate_quant(n: int, rng: random.Random) -> list[dict]:
    rows: list[dict] = []
    for i in range(n):
        variant = i % 8
        if variant == 0:
            x = rng.randint(40, 200)
            y = rng.randint(5, 25)
            result = round(x * (1 + y / 100), 2)
            stem = f"A number increased by {y}% becomes {result}. Find the original number."
            ans, wrongs = str(x), [str(x + 5), str(x - 4), str(x + 10)]
            topic, expl = "Percentage", f"x*(1+{y}/100)={result} => x={x}"
        elif variant == 1:
            cp = rng.randint(200, 2000)
            p = rng.randint(5, 40)
            sp = round(cp * (1 + p / 100))
            stem = f"CP = Rs.{cp}, SP = Rs.{sp}. Profit %?"
            ans, wrongs = f"{p}%", [f"{p+2}%", f"{p-1}%", f"{p+5}%"]
            topic, expl = "Profit and Loss", f"((SP-CP)/CP)*100={p}%"
        elif variant == 2:
            p = rng.randint(1000, 8000)
            r = rng.randint(4, 12)
            t = rng.randint(2, 5)
            si = (p * r * t) // 100
            stem = f"SI on Rs.{p} at {r}% p.a. for {t} years is:"
            ans, wrongs = f"Rs. {si}", [f"Rs. {si+50}", f"Rs. {si-40}", f"Rs. {si+100}"]
            topic, expl = "Simple Interest", f"SI=(P*R*T)/100={si}"
        elif variant == 3:
            a, b = rng.randint(2, 7), rng.randint(3, 9)
            total = (a + b) * rng.randint(20, 80)
            part = (total * a) // (a + b)
            stem = f"Divide Rs.{total} in ratio {a}:{b}. First share?"
            ans, wrongs = f"Rs. {part}", [f"Rs. {part+10}", f"Rs. {total-part}", f"Rs. {part-5}"]
            topic, expl = "Ratio", f"First = {a}/({a}+{b})*{total}={part}"
        elif variant == 4:
            a, b = rng.randint(6, 15), rng.randint(8, 20)
            days = round((a * b) / (a + b), 2)
            stem = f"A finishes work in {a} days, B in {b}. Together?"
            ans, wrongs = str(days), [str(round(days + 1, 2)), str(a), str(b)]
            topic, expl = "Time and Work", f"1/A+1/B => {days} days"
        elif variant == 5:
            side = rng.randint(5, 20)
            area = side * side
            stem = f"Side of square = {side} cm. Area?"
            ans, wrongs = f"{area} cm2", [f"{4*side} cm2", f"{2*side} cm2", f"{area+side} cm2"]
            topic, expl = "Mensuration", f"side^2={area}"
        elif variant == 6:
            nums = [rng.randint(10, 50) for _ in range(5)]
            avg = sum(nums) / 5
            stem = f"Average of {', '.join(map(str, nums))}?"
            ans, wrongs = str(avg), [str(avg + 1), str(avg - 1), str(sum(nums))]
            topic, expl = "Average", f"sum/5={avg}"
        else:
            stem = "sin^2(theta) + cos^2(theta) equals:"
            ans, wrongs = "1", ["0", "2", "sin(theta)"]
            topic, expl = "Trigonometry", "Fundamental identity"

        opts = [ans] + wrongs
        rng.shuffle(opts)
        letters = ["A", "B", "C", "D"]
        mapping = {letters[i]: opts[i] for i in range(4)}
        correct = letters[opts.index(ans)]
        rows.append(
            alpaca(
                f"Create one SSC CGL Quantitative Aptitude MCQ on {topic}. Return JSON only.",
                mcq_output(stem, mapping, correct, expl, topic),
            )
        )
    return rows


def generate_reasoning(n: int, rng: random.Random) -> list[dict]:
    rows = []
    for i in range(n):
        start = rng.randint(2, 9)
        seq = [start * (2**k) for k in range(4)]
        nxt = start * (2**4)
        stem = f"Find next term: {', '.join(map(str, seq))}, ?"
        ans, wrongs = str(nxt), [str(nxt + start), str(start * 10), str(seq[-1] + start)]
        opts = [ans] + wrongs
        rng.shuffle(opts)
        letters = ["A", "B", "C", "D"]
        mapping = {letters[j]: opts[j] for j in range(4)}
        correct = letters[opts.index(ans)]
        rows.append(
            alpaca(
                "Create one SSC CGL Reasoning MCQ on Number Series. Return JSON only.",
                mcq_output(stem, mapping, correct, "Each term doubles.", "Number Series"),
            )
        )
    return rows


def generate_english(n: int, rng: random.Random) -> list[dict]:
    bank = [
        ("Synonym of ABANDON", "Forsake", ["Keep", "Support", "Retain"], "leave/forsake", "Synonyms"),
        ("Antonym of GENEROUS", "Stingy", ["Kind", "Liberal", "Charitable"], "opposite of generous", "Antonyms"),
        ("Idiom: hit the nail on the head", "Say exactly the right thing", ["Fail", "Work hard", "Hurt someone"], "be precisely correct", "Idioms"),
        ("She has lived here ___ 2019.", "since", ["for", "from", "at"], "since + point of time", "Grammar"),
        ("Correct spelling", "Accommodation", ["Acommodation", "Accomodation", "Acomodation"], "double c and m", "Spelling"),
    ]
    rows = []
    for i in range(n):
        stem, ans, wrongs, expl, topic = bank[i % len(bank)]
        opts = [ans] + wrongs
        rng.shuffle(opts)
        letters = ["A", "B", "C", "D"]
        mapping = {letters[j]: opts[j] for j in range(4)}
        correct = letters[opts.index(ans)]
        rows.append(
            alpaca(
                f"Create one SSC CGL English MCQ on {topic}. Return JSON only.",
                mcq_output(stem, mapping, correct, expl, topic),
            )
        )
    return rows


def generate_ga(n: int, rng: random.Random) -> list[dict]:
    bank = [
        ("First President of India?", "Dr. Rajendra Prasad", ["Nehru", "Radhakrishnan", "Ambedkar"], "1950-1962", "History"),
        ("Article for Right to Equality?", "Article 14", ["19", "21", "32"], "equality before law", "Polity"),
        ("RBI headquarters?", "Mumbai", ["Delhi", "Kolkata", "Chennai"], "Mumbai", "Economy"),
        ("Longest river in India?", "Ganga", ["Yamuna", "Godavari", "Narmada"], "Ganga longest within India", "Geography"),
        ("Chemical symbol of Sodium?", "Na", ["So", "Sd", "Sm"], "Natrium", "Science"),
    ]
    rows = []
    for i in range(n):
        stem, ans, wrongs, expl, topic = bank[i % len(bank)]
        # slight paraphrase for variety
        stem = stem if i < len(bank) else f"{stem} Choose the correct option."
        opts = [ans] + wrongs
        rng.shuffle(opts)
        letters = ["A", "B", "C", "D"]
        mapping = {letters[j]: opts[j] for j in range(4)}
        correct = letters[opts.index(ans)]
        rows.append(
            alpaca(
                f"Create one SSC CGL General Awareness MCQ on {topic}. Return JSON only.",
                mcq_output(stem, mapping, correct, expl, topic),
            )
        )
    return rows


def load_open_bank() -> list[dict]:
    rows: list[dict] = []
    if not OPEN_BANK.exists():
        return rows
    for path in OPEN_BANK.rglob("*.json"):
        if path.name in {"subjects.json", "chapters.json", "edu_boards.json", "chapters_schema.json", "mcq_question_schema.json"}:
            continue
        try:
            data = json.loads(path.read_text(encoding="utf-8"))
        except Exception:
            continue
        items = data if isinstance(data, list) else data.get("questions") or data.get("mcqs") or []
        if isinstance(data, dict) and not items:
            # single question file shapes
            if "question" in data or "stem" in data:
                items = [data]
        for q in items:
            if not isinstance(q, dict):
                continue
            stem = q.get("question") or q.get("stem") or q.get("stemEn") or q.get("text")
            if not stem:
                continue
            options = q.get("options") or {}
            if isinstance(options, list) and len(options) >= 4:
                mapping = {"A": str(options[0]), "B": str(options[1]), "C": str(options[2]), "D": str(options[3])}
            else:
                mapping = {
                    "A": str(
                        options.get("A")
                        or options.get("a")
                        or q.get("optionA")
                        or q.get("option_a")
                        or ""
                    ),
                    "B": str(
                        options.get("B")
                        or options.get("b")
                        or q.get("optionB")
                        or q.get("option_b")
                        or ""
                    ),
                    "C": str(
                        options.get("C")
                        or options.get("c")
                        or q.get("optionC")
                        or q.get("option_c")
                        or ""
                    ),
                    "D": str(
                        options.get("D")
                        or options.get("d")
                        or q.get("optionD")
                        or q.get("option_d")
                        or ""
                    ),
                }
            if not all(mapping.values()):
                continue
            correct_raw = str(
                q.get("answer") or q.get("correct") or q.get("correctOption") or q.get("correct_option") or "A"
            ).upper()
            correct_map = {
                "OPTION_A": "A",
                "OPTION_B": "B",
                "OPTION_C": "C",
                "OPTION_D": "D",
                "A": "A",
                "B": "B",
                "C": "C",
                "D": "D",
            }
            correct = correct_map.get(correct_raw, correct_raw)
            if correct not in "ABCD":
                for k, v in mapping.items():
                    if v.strip().lower() == correct_raw.strip().lower():
                        correct = k
                        break
                else:
                    correct = "A"
            topic = str(q.get("topic") or q.get("chapter") or path.parent.name)
            expl = str(q.get("explanation") or q.get("solution") or "")
            subject = str(q.get("subject") or path.parts[-3] if len(path.parts) >= 3 else "SSC")
            rows.append(
                alpaca(
                    f"Create one SSC exam MCQ on {topic} ({subject}). Return JSON only.",
                    mcq_output(str(stem), mapping, correct, expl, topic),
                )
            )
    return rows


def load_exambench_ssc(limit: int = 4000) -> list[dict]:
    """Pull Apache-2.0 ExamBench rows mentioning SSC / CGL.

    Disabled by default on Windows due to a pyarrow streaming overflow bug.
    Set MOCKGE_USE_EXAMBENCH=1 to enable.
    """
    import os

    if os.getenv("MOCKGE_USE_EXAMBENCH", "0") != "1":
        print("ExamBench skipped (set MOCKGE_USE_EXAMBENCH=1 to enable).")
        return []

    rows: list[dict] = []
    try:
        from datasets import load_dataset
    except ImportError:
        print("datasets not installed; skipping ExamBench")
        return rows

    print("Downloading ExamBench (Apache-2.0) and filtering SSC/CGL...")
    try:
        ds = load_dataset("169Pi/exambench", split="train", streaming=True)
    except Exception as e:
        print(f"ExamBench download failed: {e}")
        return rows

    pat = re.compile(r"\b(SSC|CGL|CHSL|Staff Selection)\b", re.I)
    try:
        for i, ex in enumerate(ds):
            prompt = str(ex.get("prompt") or "")
            response = str(ex.get("response") or "")
            cot = str(ex.get("complex_cot") or "")
            blob = f"{prompt}\n{response}\n{cot}"
            if not pat.search(blob):
                continue
            rows.append(
                alpaca(
                    "You are an SSC CGL question setter. Using the context, write one original MCQ as JSON "
                    "with keys stemEn, optionA, optionB, optionC, optionD, correctOption, topic, explanation.",
                    response[:4000] if response else cot[:4000],
                    prompt[:1500],
                )
            )
            if len(rows) >= limit:
                break
            if i > 80000:
                break
    except Exception as e:
        print(f"ExamBench stream error: {e}")
    print(f"ExamBench SSC-related rows: {len(rows)}")
    return rows


def main() -> None:
    rng = random.Random(42)
    DATA.mkdir(parents=True, exist_ok=True)

    rows: list[dict] = []
    rows += generate_quant(5000, rng)
    rows += generate_reasoning(3000, rng)
    rows += generate_english(2500, rng)
    rows += generate_ga(2500, rng)
    # Prefer hard phrasing in instructions for training
    rows = [
        {
            **r,
            "instruction": r["instruction"].replace(
                "Create one SSC CGL",
                "Create one HARD SSC CGL Tier-I level",
            ),
        }
        for r in rows
    ]
    print(f"Generated original rows: {len(rows)}")

    open_rows = load_open_bank()
    print(f"Open MCQ bank rows: {len(open_rows)}")
    rows += open_rows

    try:
        rows += load_exambench_ssc(3500)
    except Exception as e:
        print(f"ExamBench skipped due to error: {e}")

    # User-imported PYQs (allowed JSON only) — see training/import_pyq_json.py
    pyq_path = DATA / "pyq_imported.jsonl"
    if not pyq_path.exists():
        try:
            from import_pyq_json import main as import_main

            import_main()
        except Exception as e:
            print(f"PYQ import helper: {e}")
    if pyq_path.exists():
        n = 0
        with pyq_path.open(encoding="utf-8") as f:
            for line in f:
                line = line.strip()
                if not line:
                    continue
                rows.append(json.loads(line))
                n += 1
        print(f"User PYQ import rows: {n}")

    rng.shuffle(rows)
    with OUT.open("w", encoding="utf-8") as f:
        for r in rows:
            f.write(json.dumps(r, ensure_ascii=False) + "\n")
    print(f"Wrote {len(rows)} examples -> {OUT}")


if __name__ == "__main__":
    main()
