from __future__ import annotations

SECTION_LABELS = {
    "reasoning": "Reasoning",
    "ga": "General Awareness",
    "quant": "Quantitative Aptitude",
    "english": "English",
    "maths": "Mathematical Abilities",
    "computer": "Computer Knowledge",
}

TIER1 = {
    "tier": "tier1",
    "totalQuestions": 100,
    "maxScore": 200,
    "sections": [
        {"key": "reasoning", "questionCount": 25, "marksPerQuestion": 2, "negativeMarks": 0.5},
        {"key": "ga", "questionCount": 25, "marksPerQuestion": 2, "negativeMarks": 0.5},
        {"key": "quant", "questionCount": 25, "marksPerQuestion": 2, "negativeMarks": 0.5},
        {"key": "english", "questionCount": 25, "marksPerQuestion": 2, "negativeMarks": 0.5},
    ],
    "timerGroups": [
        {
            "id": "sec_reasoning",
            "durationSeconds": 900,
            "sectionKeys": ["reasoning"],
        },
        {
            "id": "sec_ga",
            "durationSeconds": 900,
            "sectionKeys": ["ga"],
        },
        {
            "id": "sec_quant",
            "durationSeconds": 900,
            "sectionKeys": ["quant"],
        },
        {
            "id": "sec_english",
            "durationSeconds": 900,
            "sectionKeys": ["english"],
        },
    ],
}

TIER2 = {
    "tier": "tier2",
    "totalQuestions": 150,
    "maxScore": 450,
    "sections": [
        {"key": "maths", "questionCount": 30, "marksPerQuestion": 3, "negativeMarks": 1},
        {"key": "reasoning", "questionCount": 30, "marksPerQuestion": 3, "negativeMarks": 1},
        {"key": "english", "questionCount": 45, "marksPerQuestion": 3, "negativeMarks": 1},
        {"key": "ga", "questionCount": 25, "marksPerQuestion": 3, "negativeMarks": 1},
        {"key": "computer", "questionCount": 20, "marksPerQuestion": 3, "negativeMarks": 1},
    ],
    "timerGroups": [
        {"id": "section1", "durationSeconds": 3600, "sectionKeys": ["maths", "reasoning"]},
        {"id": "section2", "durationSeconds": 3600, "sectionKeys": ["english", "ga"]},
        {"id": "section3", "durationSeconds": 900, "sectionKeys": ["computer"]},
    ],
}


def get_blueprint(tier: str, focus_section: str | None = None) -> dict:
    if tier == "practice":
        return {
            "tier": "practice",
            "totalQuestions": 25,
            "maxScore": 50,
            "sections": [
                {
                    "key": focus_section or "reasoning",
                    "questionCount": 25,
                    "marksPerQuestion": 2,
                    "negativeMarks": 0.5,
                }
            ],
            "timerGroups": [
                {
                    "id": "practice",
                    "durationSeconds": 900,
                    "sectionKeys": [focus_section or "reasoning"],
                }
            ],
        }
    return TIER1 if tier == "tier1" else TIER2


def evaluate_attempt(answers: list[dict], q_index_by_id: dict, duration_seconds: int) -> dict:
    score = 0.0
    max_score = 0.0
    correct_count = wrong_count = unattempted = 0
    section_map: dict[str, dict] = {}
    topic_map: dict[str, dict] = {}
    time_on_wrong = time_on_correct = 0
    high_change = 0
    per_question = []

    for a in answers:
        max_score += a["marks"]
        sec = section_map.setdefault(
            a["sectionKey"],
            {"correct": 0, "wrong": 0, "unattempted": 0, "score": 0.0, "maxScore": 0.0, "time": 0, "n": 0},
        )
        sec["maxScore"] += a["marks"]
        sec["time"] += a["timeSpentMs"]
        sec["n"] += 1
        topic_key = f"{a['subject']}::{a['topic']}"
        top = topic_map.setdefault(
            topic_key, {"subject": a["subject"], "correct": 0, "wrong": 0, "unattempted": 0}
        )
        status = "unattempted"
        if not a["selected"]:
            unattempted += 1
            sec["unattempted"] += 1
            top["unattempted"] += 1
        elif a["selected"] == a["correctOption"]:
            score += a["marks"]
            sec["score"] += a["marks"]
            correct_count += 1
            sec["correct"] += 1
            top["correct"] += 1
            time_on_correct += a["timeSpentMs"]
            status = "correct"
        else:
            score -= a["negativeMarks"]
            sec["score"] -= a["negativeMarks"]
            wrong_count += 1
            sec["wrong"] += 1
            top["wrong"] += 1
            time_on_wrong += a["timeSpentMs"]
            status = "wrong"
        if a["changeCount"] >= 2:
            high_change += 1
        per_question.append(
            {
                "questionId": a["questionId"],
                "qIndex": q_index_by_id.get(a["questionId"], 0),
                "timeSpentMs": a["timeSpentMs"],
                "status": status,
            }
        )

    sections = []
    for key, s in section_map.items():
        attempted = s["correct"] + s["wrong"]
        sections.append(
            {
                "sectionKey": key,
                "label": SECTION_LABELS.get(key, key),
                "correct": s["correct"],
                "wrong": s["wrong"],
                "unattempted": s["unattempted"],
                "score": round(s["score"], 2),
                "maxScore": s["maxScore"],
                "accuracy": round((s["correct"] / attempted) * 100, 1) if attempted else 0,
                "avgTimeMs": round(s["time"] / s["n"]) if s["n"] else 0,
            }
        )

    topics = []
    for key, t in topic_map.items():
        topic = key.split("::", 1)[-1]
        attempted = t["correct"] + t["wrong"]
        if attempted == 0:
            continue
        topics.append(
            {
                "topic": topic,
                "subject": t["subject"],
                "correct": t["correct"],
                "wrong": t["wrong"],
                "unattempted": t["unattempted"],
                "attempted": attempted,
                "accuracy": round((t["correct"] / attempted) * 100, 1),
            }
        )
    topics.sort(key=lambda x: x["accuracy"])
    strengths = [
        f"{t['topic']} ({t['subject']})"
        for t in reversed([x for x in topics if x["attempted"] >= 2 and x["accuracy"] >= 70][-5:])
    ]
    weaknesses = [
        f"{t['topic']} ({t['subject']})"
        for t in topics
        if x_attempted_weak(t)
    ][:5]

    n = max(len(answers), 1)
    total_time = sum(a["timeSpentMs"] for a in answers)
    return {
        "score": round(score, 2),
        "maxScore": max_score,
        "correctCount": correct_count,
        "wrongCount": wrong_count,
        "unattempted": unattempted,
        "sections": sections,
        "topics": topics,
        "strengths": strengths,
        "weaknesses": weaknesses,
        "timeAnalysis": {
            "totalTimeMs": total_time,
            "suggestedPaceMs": round((duration_seconds * 1000) / n),
            "avgTimePerQuestionMs": round(total_time / n),
            "timeOnWrongMs": time_on_wrong,
            "timeOnCorrectMs": time_on_correct,
            "highChangeQuestions": high_change,
            "perQuestion": sorted(per_question, key=lambda x: x["qIndex"]),
        },
    }


def x_attempted_weak(t: dict) -> bool:
    return t["attempted"] >= 2 and t["accuracy"] < 50
