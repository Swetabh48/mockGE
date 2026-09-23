"""Training control endpoints — start corpus build / LoRA train as background jobs."""

from __future__ import annotations

import subprocess
import sys
from pathlib import Path

from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter()
ROOT = Path(__file__).resolve().parents[3]
TRAIN = ROOT / "training"
LOG = TRAIN / "outputs" / "train_job.log"


class TrainBody(BaseModel):
    action: str  # corpus | train | ollama_export | status
    max_steps: int = 200


@router.get("/train/status")
def train_status():
    meta = TRAIN / "outputs" / "mockge-ssc-lora" / "mockge_train_meta.json"
    corpus = TRAIN / "data" / "ssc_cgl_train.jsonl"
    return {
        "corpusExists": corpus.exists(),
        "corpusLines": sum(1 for _ in corpus.open(encoding="utf-8")) if corpus.exists() else 0,
        "loraReady": meta.exists(),
        "meta": meta.read_text(encoding="utf-8") if meta.exists() else None,
        "logTail": LOG.read_text(encoding="utf-8")[-4000:] if LOG.exists() else "",
    }


@router.post("/train")
def train(body: TrainBody):
    TRAIN.joinpath("outputs").mkdir(parents=True, exist_ok=True)
    if body.action == "status":
        return train_status()

    if body.action == "corpus":
        cmd = [sys.executable, str(TRAIN / "build_corpus.py")]
    elif body.action == "train":
        cmd = [
            sys.executable,
            str(TRAIN / "train_lora.py"),
            "--max-steps",
            str(body.max_steps),
        ]
    elif body.action == "ollama_export":
        cmd = [sys.executable, str(TRAIN / "export_to_ollama.py")]
    else:
        return {"error": "Unknown action"}

    with LOG.open("a", encoding="utf-8") as log:
        log.write(f"\n--- starting {' '.join(cmd)} ---\n")
        proc = subprocess.Popen(
            cmd,
            cwd=str(TRAIN),
            stdout=log,
            stderr=subprocess.STDOUT,
        )
    return {"started": True, "pid": proc.pid, "action": body.action, "log": str(LOG)}
