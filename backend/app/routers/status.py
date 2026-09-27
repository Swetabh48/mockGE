from fastapi import APIRouter, Depends
from sqlalchemy import func
from sqlalchemy.orm import Session

from ..db import Attempt, Paper, get_db

router = APIRouter()


@router.get("/status")
def status(db: Session = Depends(get_db)):
    paper_count = db.query(func.count(Paper.id)).scalar() or 0
    attempt_count = (
        db.query(func.count(Attempt.id)).filter(Attempt.status == "submitted").scalar() or 0
    )
    return {
        "questionBankReady": paper_count > 0,
        "paperCount": paper_count,
        "attemptCount": attempt_count,
        "bank": {
            "ready": paper_count > 0,
            "message": f"Question bank · {paper_count} papers",
        },
        "backend": "fastapi",
    }
