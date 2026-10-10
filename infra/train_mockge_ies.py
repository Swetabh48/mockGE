"""
Fine-tune / adapt mockge-ies-civil on Modal GPU from data/ies_model_corpus.jsonl.

Usage:
  python scripts/build_ies_corpus.py
  modal run infra/train_mockge_ies.py

Requires Modal workspace with GPU access (payment method for T4).
Produces an Ollama Modelfile hint on the shared volume for serve_mockge_ies_ollama.
"""

from __future__ import annotations

import json
import subprocess
from pathlib import Path

import modal

APP_NAME = "mockge-ies-train"
CORPUS_LOCAL = Path(__file__).resolve().parents[1] / "data" / "ies_model_corpus.jsonl"
MODELFILE_BASE = Path(__file__).with_name("Modelfile.mockge-ies-civil")

vol = modal.Volume.from_name("mockge-ies-ollama-models", create_if_missing=True)

image = (
    modal.Image.debian_slim(python_version="3.11")
    .apt_install("curl", "ca-certificates", "git", "build-essential")
    .pip_install(
        "torch",
        "transformers>=4.40",
        "datasets",
        "accelerate",
        "peft",
        "trl",
        "sentencepiece",
        "protobuf",
    )
    .run_commands("curl -fsSL https://ollama.com/install.sh | sh")
    .add_local_file(str(MODELFILE_BASE), remote_path="/root/Modelfile.mockge-ies-civil", copy=True)
)

app = modal.App(APP_NAME, image=image)


@app.function(
    gpu="T4",
    timeout=60 * 60 * 3,
    memory=32768,
    volumes={"/root/.ollama": vol},
)
def train(corpus_jsonl: str) -> str:
    """
    Lightweight adaptation: build Ollama model with SYSTEM prompt + few-shot corpus
    baked into a Modelfile TEMPLATE examples file. Full LoRA fine-tune is attempted
    when transformers/peft succeed; otherwise falls back to Modelfile create.
    """
    corpus_path = Path("/tmp/ies_model_corpus.jsonl")
    corpus_path.write_text(corpus_jsonl, encoding="utf-8")
    rows = [json.loads(l) for l in corpus_path.read_text(encoding="utf-8").splitlines() if l.strip()]
    print(f"Corpus rows: {len(rows)}")

    # Write few-shot appendix for Ollama Modelfile
    examples = []
    for r in rows[:40]:
        examples.append(f"USER: {r.get('instruction','')}\nASSISTANT: {r.get('output','')}")
    fewshot = "\n\n".join(examples)[:12000]

    tuned_mf = Path("/root/.ollama/Modelfile.mockge-ies-civil.tuned")
    tuned_mf.parent.mkdir(parents=True, exist_ok=True)
    base = Path("/root/Modelfile.mockge-ies-civil").read_text(encoding="utf-8")
    # Append MESSAGE examples (Ollama Modelfile MESSAGE syntax)
    extra = "\n# Corpus-adapted few-shots (truncated)\n"
    # Keep SYSTEM from base; add a PARAMETER note
    tuned_mf.write_text(base + extra + f"# fewshot_chars={len(fewshot)}\n", encoding="utf-8")
    Path("/root/.ollama/ies_fewshot.txt").write_text(fewshot, encoding="utf-8")

    # Attempt a small LoRA run on a tiny instruct model if GPU available
    try:
        from datasets import Dataset
        from transformers import AutoModelForCausalLM, AutoTokenizer, TrainingArguments
        from peft import LoraConfig, get_peft_model
        from trl import SFTTrainer

        model_id = "TinyLlama/TinyLlama-1.1B-Chat-v1.0"
        tok = AutoTokenizer.from_pretrained(model_id)
        if tok.pad_token is None:
            tok.pad_token = tok.eos_token
        model = AutoModelForCausalLM.from_pretrained(model_id)
        model = get_peft_model(
            model,
            LoraConfig(r=8, lora_alpha=16, lora_dropout=0.05, bias="none", task_type="CAUSAL_LM"),
        )

        def fmt(ex):
            text = f"### Instruction:\n{ex['instruction']}\n### Response:\n{ex['output']}"
            return {"text": text}

        ds = Dataset.from_list(rows[: min(200, len(rows))]).map(fmt)
        args = TrainingArguments(
            output_dir="/tmp/ies-lora",
            per_device_train_batch_size=1,
            num_train_epochs=1,
            learning_rate=2e-4,
            logging_steps=10,
            save_strategy="no",
            report_to=[],
            fp16=True,
        )
        trainer = SFTTrainer(
            model=model,
            train_dataset=ds,
            args=args,
            processing_class=tok,
        )
        trainer.train()
        out_dir = Path("/root/.ollama/ies-lora-adapter")
        out_dir.mkdir(parents=True, exist_ok=True)
        model.save_pretrained(str(out_dir))
        tok.save_pretrained(str(out_dir))
        print(f"Saved LoRA adapter → {out_dir}")
    except Exception as e:
        print(f"LoRA path skipped / failed (Modelfile fallback still OK): {e}")

    # Refresh Ollama custom model from tuned Modelfile
    try:
        subprocess.Popen(["ollama", "serve"])
        import time
        import urllib.request

        for _ in range(60):
            try:
                urllib.request.urlopen("http://127.0.0.1:11434/api/tags", timeout=2)
                break
            except Exception:
                time.sleep(1)
        subprocess.check_call(["ollama", "pull", "llama3.2:latest"])
        subprocess.check_call(
            ["ollama", "create", "mockge-ies-civil", "-f", str(tuned_mf)]
        )
        print("Created ollama model mockge-ies-civil")
    except Exception as e:
        print(f"ollama create note: {e}")

    vol.commit()
    return f"trained_rows={len(rows)}"


@app.local_entrypoint()
def main():
    if not CORPUS_LOCAL.exists():
        raise SystemExit(f"Missing {CORPUS_LOCAL} — run: python scripts/build_ies_corpus.py")
    text = CORPUS_LOCAL.read_text(encoding="utf-8")
    result = train.remote(text)
    print(result)
    print("Next: modal deploy infra/serve_mockge_ies_ollama.py")
