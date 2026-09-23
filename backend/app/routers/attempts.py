from __future__ import annotations

import json
import uuid
from datetime import datetime
from typing import Any

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session

from ..db import AnswerEvent, Attempt, Paper, Question, get_db
from ..exam import evaluate_attempt, get_blueprint

router = APIRouter()


class AttemptAction(BaseModel):
    paperId: str
    action: str
    attemptId: str | None = None
    currentSection: str | None = None
    answers: list[dict[str, Any]] | None = None
    dest: dict[str, Any] | None = None


@router.get("/attempts")
def list_attempts(db: Session = Depends(get_db)):
    rows = (
        db.query(Attempt, Paper.title)
        .join(Paper, Paper.id == Attempt.paperId)
        .order_by(Attempt.startedAt.desc())
        .limit(20)
        .all()
    )
    return {
        "attempts": [
            {
                "id": a.id,
                "paperId": a.paperId,
                "paperTitle": title,
                "tier": a.tier,
                "status": a.status,
                "score": a.score,
                "maxScore": a.maxScore,
                "startedAt": a.startedAt,
                "submittedAt": a.submittedAt,
                "destQualified": a.destQualified,
            }
            for a, title in rows
        ]
    }


@router.get("/attempts/{attempt_id}")
def get_attempt(attempt_id: str, db: Session = Depends(get_db)):
    attempt = db.query(Attempt).filter(Attempt.id == attempt_id).first()
    if not attempt:
        raise HTTPException(404, "Not found")
    paper = db.query(Paper).filter(Paper.id == attempt.paperId).first()
    questions = (
        db.query(Question)
        .filter(Question.paperId == paper.id)
        .order_by(Question.qIndex.asc())
        .all()
    )
    answers = {a.questionId: a for a in attempt.answers}
    analysis = json.loads(attempt.analysisJson) if attempt.analysisJson else None
    return {
        "attempt": {
            "id": attempt.id,
            "status": attempt.status,
            "tier": attempt.tier,
            "score": attempt.score,
            "maxScore": attempt.maxScore,
            "correctCount": attempt.correctCount,
            "wrongCount": attempt.wrongCount,
            "unattempted": attempt.unattempted,
            "startedAt": attempt.startedAt,
            "submittedAt": attempt.submittedAt,
            "destQualified": attempt.destQualified,
            "destAccuracy": attempt.destAccuracy,
            "destKeystrokes": attempt.destKeystrokes,
            "analysis": analysis,
            "paper": {"id": paper.id, "title": paper.title, "destPassage": paper.destPassage},
            "review": [
                {
                    "id": q.id,
                    "qIndex": q.qIndex,
                    "sectionKey": q.sectionKey,
                    "subject": q.subject,
                    "topic": q.topic,
                    "stemEn": q.stemEn,
                    "optionA": q.optionA,
                    "optionB": q.optionB,
                    "optionC": q.optionC,
                    "optionD": q.optionD,
                    "correctOption": q.correctOption,
                    "explanation": q.explanation,
                    "selected": answers.get(q.id).selected if answers.get(q.id) else None,
                    "timeSpentMs": answers.get(q.id).timeSpentMs if answers.get(q.id) else 0,
                    "changeCount": answers.get(q.id).changeCount if answers.get(q.id) else 0,
                }
                for q in questions
            ],
        }
    }


@router.post("/attempts")
def attempt_action(body: AttemptAction, db: Session = Depends(get_db)):
    if body.action == "start":
        paper = db.query(Paper).filter(Paper.id == body.paperId).first()
        if not paper:
            raise HTTPException(404, "Paper not found")
        questions = db.query(Question).filter(Question.paperId == paper.id).all()
        blueprint = get_blueprint(paper.tier, getattr(paper, "focusSection", None))
        first = blueprint["sections"][0]["key"]
        attempt_id = str(uuid.uuid4())
        attempt = Attempt(
            id=attempt_id,
            paperId=paper.id,
            tier=paper.tier,
            status="in_progress",
            currentSection=first,
        )
        db.add(attempt)
        for q in questions:
            db.add(
                AnswerEvent(
                    id=str(uuid.uuid4()),
                    attemptId=attempt_id,
                    questionId=q.id,
                    selected=None,
                    markedReview=False,
                    visited=False,
                    timeSpentMs=0,
                    changeCount=0,
                )
            )
        db.commit()
        return {"attemptId": attempt_id, "currentSection": first}

    if not body.attemptId:
        raise HTTPException(400, "attemptId required")
    attempt = db.query(Attempt).filter(Attempt.id == body.attemptId).first()
    if not attempt:
        raise HTTPException(404, "Attempt not found")

    if body.action == "save" and body.answers:
        for a in body.answers:
            ev = (
                db.query(AnswerEvent)
                .filter(
                    AnswerEvent.attemptId == attempt.id,
                    AnswerEvent.questionId == a["questionId"],
                )
                .first()
            )
            if not ev:
                continue
            if ev.firstViewAt is None and a.get("visited"):
                ev.firstViewAt = datetime.utcnow()
            ev.selected = a.get("selected")
            ev.markedReview = bool(a.get("markedReview"))
            ev.visited = bool(a.get("visited"))
            ev.timeSpentMs = int(a.get("timeSpentMs") or 0)
            ev.changeCount = int(a.get("changeCount") or 0)
            ev.lastChangeAt = datetime.utcnow()
        if body.currentSection:
            attempt.currentSection = body.currentSection
        db.commit()
        return {"ok": True}

    if body.action == "dest" and body.dest:
        attempt.destKeystrokes = int(body.dest.get("keystrokes") or 0)
        attempt.destAccuracy = float(body.dest.get("accuracy") or 0)
        attempt.destQualified = bool(body.dest.get("qualified"))
        attempt.status = "submitted"
        attempt.submittedAt = attempt.submittedAt or datetime.utcnow()
        db.commit()
        return {"ok": True}

    if body.action == "submit":
        if body.answers:
            for a in body.answers:
                ev = (
                    db.query(AnswerEvent)
                    .filter(
                        AnswerEvent.attemptId == attempt.id,
                        AnswerEvent.questionId == a["questionId"],
                    )
                    .first()
                )
                if not ev:
                    continue
                ev.selected = a.get("selected")
                ev.markedReview = bool(a.get("markedReview"))
                ev.visited = bool(a.get("visited"))
                ev.timeSpentMs = int(a.get("timeSpentMs") or 0)
                ev.changeCount = int(a.get("changeCount") or 0)

        paper = db.query(Paper).filter(Paper.id == attempt.paperId).first()
        questions = {q.id: q for q in db.query(Question).filter(Question.paperId == paper.id).all()}
        events = db.query(AnswerEvent).filter(AnswerEvent.attemptId == attempt.id).all()
        scored = []
        q_index = {}
        for ev in events:
            q = questions[ev.questionId]
            q_index[q.id] = q.qIndex
            scored.append(
                {
                    "questionId": q.id,
                    "sectionKey": q.sectionKey,
                    "subject": q.subject,
                    "topic": q.topic,
                    "correctOption": q.correctOption,
                    "selected": ev.selected,
                    "marks": q.marks,
                    "negativeMarks": q.negativeMarks,
                    "timeSpentMs": ev.timeSpentMs,
                    "changeCount": ev.changeCount,
                    "markedReview": ev.markedReview,
                }
            )
        blueprint = get_blueprint(paper.tier, getattr(paper, "focusSection", None))
        duration = sum(g["durationSeconds"] for g in blueprint["timerGroups"])
        evaluation = evaluate_attempt(scored, q_index, duration)
        attempt.score = evaluation["score"]
        attempt.maxScore = evaluation["maxScore"]
        attempt.correctCount = evaluation["correctCount"]
        attempt.wrongCount = evaluation["wrongCount"]
        attempt.unattempted = evaluation["unattempted"]
        attempt.analysisJson = json.dumps(evaluation)
        attempt.submittedAt = datetime.utcnow()
        needs_dest = paper.tier == "tier2" and attempt.destQualified is None
        attempt.status = "awaiting_dest" if needs_dest else "submitted"
        db.commit()
        return {
            "attemptId": attempt.id,
            "evaluation": evaluation,
            "status": attempt.status,
            "needsDest": needs_dest,
        }

    raise HTTPException(400, "Unknown action")
