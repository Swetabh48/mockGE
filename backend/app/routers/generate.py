from __future__ import annotations

import json
import uuid

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session

from ..db import Paper, Question, get_db
from ..ollama_client import chat_json, get_ollama_status
from ..seed_papers import build_tier1, build_tier2, DEST_PASSAGES

router = APIRouter()


class GenerateBody(BaseModel):
    tier: str = "tier1"
    mode: str | None = None


@router.get("/generate")
def generate_status():
    return get_ollama_status()


@router.post("/generate")
def generate_paper(body: GenerateBody, db: Session = Depends(get_db)):
    tier = body.tier if body.tier in {"tier1", "tier2"} else "tier1"
    status = get_ollama_status()
    n = db.query(Paper).filter(Paper.tier == tier).count() + 1
    questions = build_tier1(n) if tier == "tier1" else build_tier2(n)
    source = "seed"

    if status["connected"] and status["model"] and body.mode != "full_seed":
        try:
            prompt = (
                "Generate exactly 5 SSC CGL General Awareness MCQs as a JSON array. "
                "Each item: stemEn, optionA, optionB, optionC, optionD, correctOption, topic, explanation."
            )
            content = chat_json(status["model"], prompt)
            parsed = json.loads(content)
            arr = parsed if isinstance(parsed, list) else parsed.get("questions", [])
            replaced = 0
            for g in arr:
                for i, q in enumerate(questions):
                    if q["sectionKey"] == "ga" and not q["stemEn"].startswith("[GEN]"):
                        questions[i] = {
                            **q,
                            "stemEn": f"[GEN] {g.get('stemEn', q['stemEn'])}",
                            "optionA": g.get("optionA", q["optionA"]),
                            "optionB": g.get("optionB", q["optionB"]),
                            "optionC": g.get("optionC", q["optionC"]),
                            "optionD": g.get("optionD", q["optionD"]),
                            "correctOption": str(g.get("correctOption", "A")).upper()[:1],
                            "topic": g.get("topic") or q["topic"],
                            "explanation": g.get("explanation") or q["explanation"],
                            "source": "generated",
                        }
                        replaced += 1
                        break
            source = "generated"
        except Exception as e:
            raise HTTPException(500, f"Generation failed: {e}") from e
    else:
        replaced = 0

    paper_id = str(uuid.uuid4())
    title = (
        f"SSC CGL Tier-I {'Generated' if source == 'generated' else 'Mock'} {n}"
        if tier == "tier1"
        else f"SSC CGL Tier-II {'Generated' if source == 'generated' else 'Mock'} {n}"
    )
    paper = Paper(
        id=paper_id,
        title=title,
        tier=tier,
        source=source,
        difficulty="standard",
        destPassage=DEST_PASSAGES[n % len(DEST_PASSAGES)] if tier == "tier2" else None,
    )
    db.add(paper)
    for q in questions:
        db.add(
            Question(
                id=str(uuid.uuid4()),
                paperId=paper_id,
                **{k: q[k] for k in q if k != "id"},
            )
        )
    db.commit()
    return {
        "paperId": paper_id,
        "source": source,
        "replaced": replaced if source == "generated" else 0,
        "ollama": status,
        "questionCount": len(questions),
    }
