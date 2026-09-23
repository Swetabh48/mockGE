from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import func
from sqlalchemy.orm import Session

from ..db import Paper, Question, get_db

router = APIRouter()


@router.get("/papers")
def list_papers(tier: str | None = None, db: Session = Depends(get_db)):
    q = db.query(Paper)
    if tier:
        q = q.filter(Paper.tier == tier)
    papers = q.order_by(Paper.createdAt.asc()).all()
    out = []
    for p in papers:
        qcount = db.query(func.count(Question.id)).filter(Question.paperId == p.id).scalar() or 0
        acount = len(p.attempts) if p.attempts is not None else 0
        out.append(
            {
                "id": p.id,
                "title": p.title,
                "tier": p.tier,
                "source": p.source,
                "difficulty": p.difficulty,
                "mode": getattr(p, "mode", None) or "full_mock",
                "focusSection": getattr(p, "focusSection", None),
                "questionCount": qcount,
                "attemptCount": acount,
                "hasDest": bool(p.destPassage),
                "createdAt": p.createdAt,
            }
        )
    return {"papers": out}


@router.get("/papers/{paper_id}")
def get_paper(paper_id: str, db: Session = Depends(get_db)):
    paper = db.query(Paper).filter(Paper.id == paper_id).first()
    if not paper:
        raise HTTPException(404, "Paper not found")
    questions = (
        db.query(Question)
        .filter(Question.paperId == paper.id)
        .order_by(Question.qIndex.asc())
        .all()
    )
    return {
        "paper": {
            "id": paper.id,
            "title": paper.title,
            "tier": paper.tier,
            "difficulty": paper.difficulty,
            "destPassage": paper.destPassage,
            "questions": [
                {
                    "id": q.id,
                    "qIndex": q.qIndex,
                    "sectionKey": q.sectionKey,
                    "subject": q.subject,
                    "topic": q.topic,
                    "stemEn": q.stemEn,
                    "stemHi": q.stemHi,
                    "optionA": q.optionA,
                    "optionB": q.optionB,
                    "optionC": q.optionC,
                    "optionD": q.optionD,
                    "marks": q.marks,
                    "negativeMarks": q.negativeMarks,
                }
                for q in questions
            ],
        }
    }
