"""
SymPy math verifier on Modal (correct answer keys for invent).

Deploy:
  modal deploy infra/serve_math_verify.py

Then on Vercel set:
  MATH_VERIFY_URL=https://<your>--mockge-math-verify-verify-mcq.modal.run
  (use the verify_mcq URL printed after deploy; path is the function root)
"""

from __future__ import annotations

import os
from pathlib import Path
from typing import Any

import modal

APP_NAME = "mockge-math-verify"
CORE = Path(__file__).with_name("math_verify_core.py")

image = (
    modal.Image.debian_slim(python_version="3.11")
    .pip_install("sympy", "fastapi[standard]")
    .add_local_file(str(CORE), remote_path="/root/math_verify_core.py", copy=True)
)

app = modal.App(APP_NAME, image=image)


def _load_verify():
    import sys

    sys.path.insert(0, "/root")
    from math_verify_core import verify_mcq

    return verify_mcq


def _check_key(headers: dict[str, str] | None) -> None:
    expected = os.environ.get("MOCKGE_MATH_KEY", "")
    if not expected:
        return
    headers = {k.lower(): v for k, v in (headers or {}).items()}
    token = headers.get("x-mockge-math-key", "")
    auth = headers.get("authorization", "")
    if auth.lower().startswith("bearer "):
        token = auth.split(" ", 1)[1].strip()
    if token != expected:
        raise PermissionError("unauthorized")


@app.function(cpu=1, memory=1024, timeout=60, scaledown_window=120)
@modal.fastapi_endpoint(method="GET")
def health() -> dict[str, Any]:
    return {"ok": True, "engine": "sympy"}


@app.function(cpu=1, memory=1024, timeout=60, scaledown_window=120)
@modal.fastapi_endpoint(method="POST")
def verify_mcq(item: dict[str, Any]) -> dict[str, Any]:
    """POST JSON MCQ body → SymPy verify/repair result."""
    verify = _load_verify()
    return verify(item or {})


@app.function(cpu=1, memory=1024, timeout=60, scaledown_window=120)
@modal.fastapi_endpoint(method="POST")
def verify_batch(item: dict[str, Any]) -> dict[str, Any]:
    verify = _load_verify()
    questions = (item or {}).get("questions") or []
    return {"results": [verify(q) for q in questions]}
