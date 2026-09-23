from __future__ import annotations

import os
from typing import Any

import httpx

OLLAMA_URL = os.getenv("OLLAMA_URL", "http://127.0.0.1:11434")
PREFERRED = ["mockge-ssc", "qwen2.5", "qwen2.5:7b", "llama3.2", "llama3.1", "llama3"]


def get_ollama_status() -> dict[str, Any]:
    try:
        r = httpx.get(f"{OLLAMA_URL}/api/tags", timeout=2.5)
        r.raise_for_status()
        models = [m["name"] for m in r.json().get("models", [])]
        model = None
        for pref in PREFERRED:
            for m in models:
                if m == pref or m.startswith(f"{pref}:"):
                    model = m
                    break
            if model:
                break
        if not model and models:
            model = models[0]
        return {
            "connected": True,
            "model": model,
            "models": models,
            "message": f"Connected ({model})" if model else "Connected (no model)",
        }
    except Exception:
        return {
            "connected": False,
            "model": None,
            "models": [],
            "message": "Ollama not reachable",
        }


def chat_json(model: str, prompt: str) -> str:
    r = httpx.post(
        f"{OLLAMA_URL}/api/chat",
        json={
            "model": model,
            "stream": False,
            "format": "json",
            "messages": [
                {"role": "system", "content": "Output JSON only."},
                {"role": "user", "content": prompt},
            ],
        },
        timeout=180.0,
    )
    r.raise_for_status()
    return r.json().get("message", {}).get("content", "{}")
