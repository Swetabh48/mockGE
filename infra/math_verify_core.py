"""
SymPy / exact-arithmetic solvers for SSC-style MCQs.
Used by CLI + Modal HTTP. Never trust the LLM for the final numeric key.
"""

from __future__ import annotations

import math
import re
from dataclasses import dataclass
from typing import Any

from math import gcd as math_gcd
from math import lcm as math_lcm

from sympy import Integer, N, Rational, simplify


@dataclass
class SolveOut:
    value: float
    explanation: str
    trick: str
    topic: str
    subtopic: str


def _num(s: str) -> float | None:
    m = re.search(r"-?\d+(?:\.\d+)?", s.replace(",", ""))
    return float(m.group(0)) if m else None


def _rat(x: float) -> Rational:
    return Rational(str(x)).limit_denominator(10_000)


def _close(a: float, b: float, tol: float = 0.051) -> bool:
    if abs(a - b) <= tol:
        return True
    denom = max(1.0, abs(b))
    return abs(a - b) / denom < 0.02


def _find_letter(options: dict[str, str], value: float) -> str | None:
    for letter in ("A", "B", "C", "D"):
        n = _num(options.get(letter, ""))
        if n is not None and _close(n, value):
            return letter
    return None


def solve_boat(stem: str) -> SolveOut | None:
    low = stem.lower()
    if not re.search(r"boat|stream|upstream|downstream|still\s*water", low):
        return None

    still = re.search(
        r"still\s*water[^\d]{0,24}(\d+(?:\.\d+)?)\s*km",
        stem,
        re.I,
    ) or re.search(r"boat[^\d]{0,48}(\d+(?:\.\d+)?)\s*km/?h", stem, re.I)
    stream = re.search(r"stream[^\d]{0,24}(\d+(?:\.\d+)?)\s*km", stem, re.I) or re.search(
        r"current[^\d]{0,24}(\d+(?:\.\d+)?)", stem, re.I
    )
    if not still or not stream:
        return None

    u = _rat(float(still.group(1)))
    v = _rat(float(stream.group(1)))
    if u <= v or v < 0:
        return None

    up = simplify(u - v)
    down = simplify(u + v)
    up_f = float(N(up))
    down_f = float(N(down))

    asks_speed = bool(re.search(r"speed|rate|how\s+fast|what\s+is\s+the\s+speed", low))
    asks_time = bool(re.search(r"time|hours?|minutes?", low))

    if "upstream" in low and asks_speed and not asks_time:
        return SolveOut(
            value=up_f,
            explanation=(
                "Boats & streams (SymPy-checked)\n\n"
                f"Still water u = {u} km/h, stream v = {v} km/h.\n"
                f"Upstream speed = u - v = {u} - {v} = {up} km/h.\n"
                "Distance is not needed when only speed is asked.\n"
                f"Trap: downstream u + v = {down} km/h."
            ),
            trick=f"Upstream = still - stream = {up} km/h (SymPy).",
            topic="Time, Speed & Distance",
            subtopic="Boats & streams",
        )
    if "downstream" in low and asks_speed and not asks_time:
        return SolveOut(
            value=down_f,
            explanation=(
                "Boats & streams (SymPy-checked)\n\n"
                f"Downstream speed = u + v = {u} + {v} = {down} km/h.\n"
                f"Trap: upstream = {up} km/h."
            ),
            trick=f"Downstream = still + stream = {down} km/h (SymPy).",
            topic="Time, Speed & Distance",
            subtopic="Boats & streams",
        )

    dist_m = re.search(r"(\d+(?:\.\d+)?)\s*km", stem, re.I)
    if dist_m and asks_time:
        d = _rat(float(dist_m.group(1)))
        if "upstream" in low:
            t = simplify(d / up)
            return SolveOut(
                value=float(N(t)),
                explanation=(
                    "Boats & streams — upstream time (SymPy)\n\n"
                    f"Upstream speed = {up} km/h.\n"
                    f"Time = distance / speed = {d} / {up} = {t} h."
                ),
                trick=f"t = d/(u−v) = {t} h.",
                topic="Time, Speed & Distance",
                subtopic="Boats & streams",
            )
        if "downstream" in low:
            t = simplify(d / down)
            return SolveOut(
                value=float(N(t)),
                explanation=(
                    "Boats & streams — downstream time (SymPy)\n\n"
                    f"Downstream speed = {down} km/h.\n"
                    f"Time = {d} / {down} = {t} h."
                ),
                trick=f"t = d/(u+v) = {t} h.",
                topic="Time, Speed & Distance",
                subtopic="Boats & streams",
            )
    return None


def solve_si(stem: str) -> SolveOut | None:
    low = stem.lower()
    if "compound" in low:
        return None
    if not re.search(r"simple interest|\bsi\b", low):
        return None
    p = re.search(r"(?:principal|sum|p)\s*(?:of\s*)?(?:rs\.?\s*)?(\d+)", stem, re.I) or re.search(
        r"rs\.?\s*(\d+)", stem, re.I
    )
    r = re.search(r"(\d+(?:\.\d+)?)\s*%", stem)
    t = re.search(r"(\d+(?:\.\d+)?)\s*(?:years?|yrs?)", stem, re.I)
    if not p or not r or not t:
        return None
    P, R, T = _rat(float(p.group(1))), _rat(float(r.group(1))), _rat(float(t.group(1)))
    si = simplify(P * R * T / 100)
    if re.search(r"interest|\bsi\b", low) and not re.search(r"amount|total", low):
        return SolveOut(
            value=float(N(si)),
            explanation=(
                "Simple interest (SymPy)\n\n"
                f"SI = PRT/100 = {P}×{R}×{T}/100 = {si}."
            ),
            trick=f"SI = PRT/100 = {si}.",
            topic="SI & CI",
            subtopic="Simple interest",
        )
    return None


def solve_ci_2yr(stem: str) -> SolveOut | None:
    low = stem.lower()
    if "compound" not in low:
        return None
    years = re.search(r"(\d+)\s*years?", stem, re.I)
    if not years or years.group(1) != "2":
        return None
    p = re.search(r"(?:principal|sum|p)\s*(?:of\s*)?(?:rs\.?\s*)?(\d+)", stem, re.I) or re.search(
        r"rs\.?\s*(\d+)", stem, re.I
    )
    r = re.search(r"(\d+(?:\.\d+)?)\s*%", stem)
    if not p or not r:
        return None
    P, R = _rat(float(p.group(1))), _rat(float(r.group(1)))
    # CI% = 2R + R^2/100
    ci_pct = simplify(2 * R + (R * R) / 100)
    ci = simplify(P * ci_pct / 100)
    si = simplify(P * R * 2 / 100)
    if re.search(r"interest|\bci\b", low) and "amount" not in low:
        return SolveOut(
            value=float(N(ci)),
            explanation=(
                "Compound interest — 2 years (SymPy)\n\n"
                f"CI% = 2R + R²/100 = 2×{R} + {R}²/100 = {ci_pct}%.\n"
                f"CI = P × CI%/100 = {P} × {ci_pct}/100 = {ci}.\n"
                f"Trap SI = {si}."
            ),
            trick=f"2-yr CI% = 2R+R²/100 → CI = {ci}.",
            topic="SI & CI",
            subtopic="Compound interest",
        )
    return None


def solve_successive_pct(stem: str) -> SolveOut | None:
    low = stem.lower()
    gain = re.search(r"(\d+(?:\.\d+)?)\s*%\s*(?:profit|gain)", stem, re.I)
    cut = re.search(
        r"(?:reduced|rebate|discount(?:ed)?)\s*(?:by\s*)?(\d+(?:\.\d+)?)\s*%",
        stem,
        re.I,
    ) or re.search(r"(\d+(?:\.\d+)?)\s*%\s*(?:rebate|discount|loss)", stem, re.I)
    if not gain or not cut:
        return None
    if not re.search(r"overall|net|effective|result", low) and not re.search(
        r"profit.*(?:then|and).*reduc|gain.*then", low
    ):
        # still allow gain-then-rebate wording
        if not re.search(r"then|after|followed", low):
            return None
    g, r = _rat(float(gain.group(1))), _rat(float(cut.group(1)))
    net = simplify(g - r - (g * r) / 100)
    return SolveOut(
        value=float(N(net)),
        explanation=(
            "Successive % change (SymPy)\n\n"
                f"Net % = g - r - (g*r)/100 = {g} - {r} - ({g}*{r})/100 = {net}%.\n"
            "Do not answer g-r (drops the cross term)."
        ),
        trick=f"g-r-gr/100 = {net}%.",
        topic="Profit, Loss & Discount",
        subtopic="Successive change",
    )


def solve_hcf_lcm(stem: str) -> SolveOut | None:
    low = stem.lower()
    nums = [Integer(int(x)) for x in re.findall(r"\b(\d+)\b", stem)]
    if len(nums) < 2:
        return None
    if re.search(r"\bhcf\b|\bgcd\b|greatest common", low):
        ints = [int(n) for n in nums]
        h = ints[0]
        for n in ints[1:]:
            h = math_gcd(h, n)
        return SolveOut(
            value=h,
            explanation=f"HCF (exact)\n\nHCF{tuple(ints)} = {h}.",
            trick=f"HCF = {h}.",
            topic="Number System & HCF-LCM",
            subtopic="HCF / LCM",
        )
    if re.search(r"\blcm\b|least common multiple", low):
        ints = [int(n) for n in nums]
        L = ints[0]
        for n in ints[1:]:
            L = math_lcm(L, n)
        return SolveOut(
            value=L,
            explanation=f"LCM (exact)\n\nLCM{tuple(ints)} = {L}.",
            trick=f"LCM = {L}.",
            topic="Number System & HCF-LCM",
            subtopic="HCF / LCM",
        )
    return None


def solve_work_two(stem: str) -> SolveOut | None:
    low = stem.lower()
    if not re.search(r"\bwork\b|\bdays?\b", low):
        return None
    if re.search(r"boat|stream|interest|percent|hcf|lcm", low):
        return None
    # A alone x days, B alone y days, together?
    m = re.search(
        r"A[^\d]{0,40}(\d+)\s*days?.{0,80}B[^\d]{0,40}(\d+)\s*days?",
        stem,
        re.I | re.S,
    )
    if not m or not re.search(r"together", low):
        return None
    a, b = _rat(float(m.group(1))), _rat(float(m.group(2)))
    t = simplify(1 / (1 / a + 1 / b))
    return SolveOut(
        value=float(N(t)),
        explanation=(
            "Time & work (SymPy)\n\n"
            f"Rates 1/{a} + 1/{b}. Together = 1 / (1/{a}+1/{b}) = {t} days."
        ),
        trick=f"Together = xy/(x+y) = {t} days.",
        topic="Time & Work",
        subtopic="Basic work",
    )


SOLVERS = (
    solve_boat,
    solve_si,
    solve_ci_2yr,
    solve_successive_pct,
    solve_hcf_lcm,
    solve_work_two,
)


def verify_mcq(payload: dict[str, Any]) -> dict[str, Any]:
    """
    Input: stemEn, optionA..D, correctOption, topic, explanation, trick, subtopic
    Output: ok, repaired?, correctOption, value, explanation, trick, topic, subtopic, engine
    """
    stem = str(payload.get("stemEn") or payload.get("stem") or "").strip()
    options = {
        "A": str(payload.get("optionA") or ""),
        "B": str(payload.get("optionB") or ""),
        "C": str(payload.get("optionC") or ""),
        "D": str(payload.get("optionD") or ""),
    }
    claimed = str(payload.get("correctOption") or "A").strip().upper()[:1]

    for solver in SOLVERS:
        out = solver(stem)
        if not out:
            continue
        letter = _find_letter(options, out.value)
        if not letter:
            return {
                "ok": False,
                "reason": "solved_value_not_in_options",
                "value": out.value,
                "engine": "sympy",
                "topic": out.topic,
                "subtopic": out.subtopic,
                "explanation": out.explanation,
                "trick": out.trick,
            }
        return {
            "ok": True,
            "repaired": letter != claimed,
            "correctOption": letter,
            "value": out.value,
            "explanation": out.explanation,
            "trick": out.trick,
            "topic": out.topic,
            "subtopic": out.subtopic,
            "engine": "sympy",
        }

    return {"ok": False, "reason": "no_solver", "engine": "sympy"}
