from __future__ import annotations

import uuid

from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session

from ..db import Paper, Question, get_db
from ..seed_papers import build_tier1, build_tier2, DEST_PASSAGES

router = APIRouter()


class GenerateBody(BaseModel):
    tier: str = "tier1"


@router.get("/generate")
def generate_status():
    return {"ready": True, "message": "Seed paper generator ready"}


@router.post("/generate")
def generate_paper(body: GenerateBody, db: Session = Depends(get_db)):
    tier = body.tier if body.tier in {"tier1", "tier2"} else "tier1"
    n = db.query(Paper).filter(Paper.tier == tier).count() + 1
    questions = build_tier1(n) if tier == "tier1" else build_tier2(n)

    paper_id = str(uuid.uuid4())
    title = (
        f"SSC CGL Tier-I Mock {n}"
        if tier == "tier1"
        else f"SSC CGL Tier-II Mock {n}"
    )
    paper = Paper(
        id=paper_id,
        title=title,
        tier=tier,
        source="seed",
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
        "source": "seed",
        "questionCount": len(questions),
    }
