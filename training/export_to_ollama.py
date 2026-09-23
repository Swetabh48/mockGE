"""
Merge LoRA into base weights (optional) and create an Ollama Modelfile
that steers generation for SSC-CGL, using the trained adapter when available
via a local HuggingFace-style serve note, plus a ready Ollama model from system prompt.

Because Ollama does not load PEFT adapters directly, we:
1) Save a SYSTEM-prompt Modelfile `mockge-ssc` on top of llama3.2 / qwen
2) Document how to serve the LoRA with a tiny FastAPI generate endpoint (transformers)

For full GGUF conversion you need llama.cpp on a machine with more RAM/GPU.
"""

from __future__ import annotations

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent
OUT = ROOT / "outputs" / "mockge-ssc-lora"
OLLAMA_DIR = ROOT / "outputs" / "ollama"
SAMPLES = ROOT / "data" / "ssc_cgl_train.jsonl"


def few_shot_block(n: int = 4) -> str:
    if not SAMPLES.exists():
        return ""
    shots = []
    with SAMPLES.open(encoding="utf-8") as f:
        for i, line in enumerate(f):
            if i >= n:
                break
            ex = json.loads(line)
            shots.append(
                f"Instruction: {ex['instruction']}\nResponse: {ex['output'][:800]}"
            )
    return "\n\n".join(shots)


def main() -> None:
    OLLAMA_DIR.mkdir(parents=True, exist_ok=True)
    system = f"""You are mockGE's SSC-CGL question setter for the Combined Graduate Level Examination (India).
Write original multiple-choice questions matching official Tier-I / Tier-II syllabus and difficulty.
Always reply with JSON only using keys: stemEn, optionA, optionB, optionC, optionD, correctOption (A|B|C|D), topic, explanation.
One correct option only. No copyrighted verbatim PYQ text. No markdown fences.

Examples:
{few_shot_block(3)}
"""
    # Prefer user's installed llama
    modelfile = f"""FROM llama3.2
SYSTEM \"\"\"{system}\"\"\"
PARAMETER temperature 0.7
PARAMETER top_p 0.9
"""
    path = OLLAMA_DIR / "Modelfile"
    path.write_text(modelfile, encoding="utf-8")
    print(f"Wrote {path}")
    print("Create Ollama model with:")
    print(f"  cd {OLLAMA_DIR}")
    print("  ollama create mockge-ssc -f Modelfile")

    meta_path = OUT / "mockge_train_meta.json"
    if meta_path.exists():
        print("LoRA adapter present:", meta_path.read_text(encoding="utf-8"))
    else:
        print("LoRA adapter not trained yet — run train_lora.py")


if __name__ == "__main__":
    main()
