from __future__ import annotations

from pathlib import Path

from sqlalchemy import (
    Boolean,
    Column,
    DateTime,
    Float,
    ForeignKey,
    Integer,
    String,
    Text,
    create_engine,
    func,
)
from sqlalchemy.orm import Session, declarative_base, relationship, sessionmaker

ROOT = Path(__file__).resolve().parents[2]
DB_PATH = ROOT / "prisma" / "dev.db"
# Always use SQLAlchemy sqlite URL (ignore Prisma-style DATABASE_URL=file:...)
DATABASE_URL = f"sqlite:///{DB_PATH.as_posix()}"

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)
Base = declarative_base()


class Paper(Base):
    __tablename__ = "Paper"
    id = Column(String, primary_key=True)
    title = Column(String, nullable=False)
    tier = Column(String, nullable=False)
    source = Column(String, default="seed")
    difficulty = Column(String, default="hard")
    mode = Column(String, default="full_mock")
    focusSection = Column(String, nullable=True)
    createdAt = Column(DateTime, server_default=func.now())
    destPassage = Column(Text, nullable=True)
    questions = relationship("Question", back_populates="paper", cascade="all, delete-orphan")
    attempts = relationship("Attempt", back_populates="paper", cascade="all, delete-orphan")


class Question(Base):
    __tablename__ = "Question"
    id = Column(String, primary_key=True)
    paperId = Column(String, ForeignKey("Paper.id", ondelete="CASCADE"), nullable=False)
    qIndex = Column(Integer, nullable=False)
    sectionKey = Column(String, nullable=False)
    subject = Column(String, nullable=False)
    topic = Column(String, nullable=False)
    difficulty = Column(String, default="medium")
    stemEn = Column(Text, nullable=False)
    stemHi = Column(Text, nullable=True)
    optionA = Column(Text, nullable=False)
    optionB = Column(Text, nullable=False)
    optionC = Column(Text, nullable=False)
    optionD = Column(Text, nullable=False)
    correctOption = Column(String, nullable=False)
    explanation = Column(Text, nullable=True)
    marks = Column(Float, default=2)
    negativeMarks = Column(Float, default=0.5)
    source = Column(String, default="seed")
    paper = relationship("Paper", back_populates="questions")


class Attempt(Base):
    __tablename__ = "Attempt"
    id = Column(String, primary_key=True)
    paperId = Column(String, ForeignKey("Paper.id", ondelete="CASCADE"), nullable=False)
    tier = Column(String, nullable=False)
    status = Column(String, default="in_progress")
    startedAt = Column(DateTime, server_default=func.now())
    submittedAt = Column(DateTime, nullable=True)
    currentSection = Column(String, nullable=True)
    score = Column(Float, nullable=True)
    maxScore = Column(Float, nullable=True)
    correctCount = Column(Integer, nullable=True)
    wrongCount = Column(Integer, nullable=True)
    unattempted = Column(Integer, nullable=True)
    analysisJson = Column(Text, nullable=True)
    destQualified = Column(Boolean, nullable=True)
    destAccuracy = Column(Float, nullable=True)
    destKeystrokes = Column(Integer, nullable=True)
    paper = relationship("Paper", back_populates="attempts")
    answers = relationship("AnswerEvent", back_populates="attempt", cascade="all, delete-orphan")


class AnswerEvent(Base):
    __tablename__ = "AnswerEvent"
    id = Column(String, primary_key=True)
    attemptId = Column(String, ForeignKey("Attempt.id", ondelete="CASCADE"), nullable=False)
    questionId = Column(String, nullable=False)
    selected = Column(String, nullable=True)
    markedReview = Column(Boolean, default=False)
    visited = Column(Boolean, default=False)
    timeSpentMs = Column(Integer, default=0)
    changeCount = Column(Integer, default=0)
    firstViewAt = Column(DateTime, nullable=True)
    lastChangeAt = Column(DateTime, nullable=True)
    attempt = relationship("Attempt", back_populates="answers")


def init_db() -> None:
    DB_PATH.parent.mkdir(parents=True, exist_ok=True)
    Base.metadata.create_all(bind=engine)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
