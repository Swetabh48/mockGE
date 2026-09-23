"""
mockGE QLoRA training on Modal cloud GPU (T4) — same path as CivilMaster.

Run:
  modal run training/modal_train.py
"""

from __future__ import annotations

import json
from pathlib import Path

import modal

APP_NAME = "mockge-ssc-qlora"
ROOT = Path(__file__).resolve().parents[1]
CLOUD_JSONL = ROOT / "training" / "cloud_pack" / "ssc_cgl_cloud.jsonl"
FALLBACK_JSONL = ROOT / "training" / "data" / "ssc_cgl_train.jsonl"
PYQ_JSONL = ROOT / "training" / "data" / "pyq_imported.jsonl"
LOCAL_OUT = ROOT / "training" / "outputs" / "mockge-ssc-lora"
MAX_PAIRS = 3500

SYSTEM = (
    "You are mockGE's SSC-CGL question setter. "
    "Write HARD Tier-I/II MCQs. Reply with JSON only using keys: "
    "stemEn, optionA, optionB, optionC, optionD, correctOption, topic, explanation."
)

image = (
    modal.Image.debian_slim(python_version="3.11")
    .pip_install(
        "torch==2.5.1",
        "transformers==4.46.3",
        "datasets==3.1.0",
        "trl==0.12.1",
        "peft==0.13.2",
        "accelerate==1.1.1",
        "bitsandbytes==0.44.1",
        "sentencepiece==0.2.0",
        "protobuf==5.28.3",
        "huggingface_hub==0.26.5",
    )
)

app = modal.App(APP_NAME, image=image)
vol = modal.Volume.from_name("mockge-ssc-lora-vol", create_if_missing=True)


def _load_pairs() -> list[dict]:
    seen: set[str] = set()
    out: list[dict] = []

    def add(path: Path) -> None:
        if not path.exists():
            return
        with path.open(encoding="utf-8") as f:
            for line in f:
                line = line.strip()
                if not line:
                    continue
                ex = json.loads(line)
                key = str(ex.get("output") or "")[:180]
                if not key or key in seen:
                    continue
                seen.add(key)
                out.append(
                    {
                        "instruction": str(ex.get("instruction") or ""),
                        "input": str(ex.get("input") or ""),
                        "output": str(ex.get("output") or ""),
                    }
                )
                if len(out) >= MAX_PAIRS:
                    return

    add(CLOUD_JSONL)
    if len(out) < MAX_PAIRS:
        add(PYQ_JSONL)
    if len(out) < MAX_PAIRS:
        add(FALLBACK_JSONL)
    return out


def _to_messages(pairs: list[dict]) -> list[dict]:
    rows = []
    for p in pairs:
        user = p["instruction"] or "Create one HARD SSC CGL MCQ."
        if p["input"]:
            user = f"{user}\n\n{p['input']}"
        rows.append(
            {
                "messages": [
                    {"role": "system", "content": SYSTEM},
                    {"role": "user", "content": user},
                    {"role": "assistant", "content": p["output"]},
                ]
            }
        )
    return rows


@app.function(
    gpu="T4",
    timeout=60 * 90,
    memory=32768,
    volumes={"/vol": vol},
)
def train_qlora(dataset_text: str) -> dict:
    import json as _json
    import os
    from pathlib import Path as P

    import torch
    from datasets import Dataset
    from peft import LoraConfig, get_peft_model, prepare_model_for_kbit_training
    from transformers import (
        AutoModelForCausalLM,
        AutoTokenizer,
        BitsAndBytesConfig,
        TrainingArguments,
    )
    from trl import SFTTrainer

    assert torch.cuda.is_available(), "CUDA GPU required"
    print("GPU:", torch.cuda.get_device_name(0))

    rows = [_json.loads(line) for line in dataset_text.splitlines() if line.strip()]
    print("pairs:", len(rows))

    model_id = "Qwen/Qwen2.5-3B-Instruct"
    bnb = BitsAndBytesConfig(
        load_in_4bit=True,
        bnb_4bit_quant_type="nf4",
        bnb_4bit_compute_dtype=torch.float16,
        bnb_4bit_use_double_quant=True,
    )
    tokenizer = AutoTokenizer.from_pretrained(model_id, trust_remote_code=True)
    if tokenizer.pad_token is None:
        tokenizer.pad_token = tokenizer.eos_token

    model = AutoModelForCausalLM.from_pretrained(
        model_id,
        quantization_config=bnb,
        device_map="auto",
        trust_remote_code=True,
    )
    model = prepare_model_for_kbit_training(model)
    model = get_peft_model(
        model,
        LoraConfig(
            r=16,
            lora_alpha=32,
            lora_dropout=0.05,
            bias="none",
            task_type="CAUSAL_LM",
            target_modules=[
                "q_proj",
                "k_proj",
                "v_proj",
                "o_proj",
                "gate_proj",
                "up_proj",
                "down_proj",
            ],
        ),
    )

    def formatting(example: dict) -> str:
        return tokenizer.apply_chat_template(
            example["messages"], tokenize=False, add_generation_prompt=False
        )

    ds = Dataset.from_list(rows)
    out_dir = "/vol/mockge-ssc-lora"
    os.makedirs(out_dir, exist_ok=True)

    trainer = SFTTrainer(
        model=model,
        tokenizer=tokenizer,
        train_dataset=ds,
        formatting_func=formatting,
        max_seq_length=1024,
        args=TrainingArguments(
            output_dir="/tmp/mockge_out",
            num_train_epochs=1,
            per_device_train_batch_size=2,
            gradient_accumulation_steps=4,
            learning_rate=2e-4,
            logging_steps=10,
            save_strategy="epoch",
            fp16=True,
            optim="paged_adamw_8bit",
            report_to=[],
            warmup_steps=10,
        ),
    )
    train_result = trainer.train()
    trainer.model.save_pretrained(out_dir)
    tokenizer.save_pretrained(out_dir)
    meta = {
        "base_model": model_id,
        "examples": len(rows),
        "max_steps": int(train_result.global_step),
        "device": "modal-t4",
        "purpose": "SSC-CGL MCQ generation LoRA for mockGE",
        "train_loss": float(train_result.training_loss),
    }
    P(out_dir, "mockge_train_meta.json").write_text(
        _json.dumps(meta, indent=2), encoding="utf-8"
    )
    vol.commit()

    model.eval()
    prompt = tokenizer.apply_chat_template(
        [
            {"role": "system", "content": SYSTEM},
            {
                "role": "user",
                "content": "Create one HARD SSC CGL Tier-I MCQ on Percentage. Return JSON only.",
            },
        ],
        tokenize=False,
        add_generation_prompt=True,
    )
    inputs = tokenizer(prompt, return_tensors="pt").to(model.device)
    with torch.no_grad():
        ids = model.generate(**inputs, max_new_tokens=280, do_sample=False)
    sample = tokenizer.decode(ids[0], skip_special_tokens=True)

    return {
        "loss": float(train_result.training_loss),
        "steps": int(train_result.global_step),
        "adapter_dir": out_dir,
        "sample": sample[-600:],
        "gpu": torch.cuda.get_device_name(0),
        "n_pairs": len(rows),
    }


@app.function(volumes={"/vol": vol}, timeout=600)
def fetch_adapter() -> dict[str, bytes]:
    root = Path("/vol/mockge-ssc-lora")
    files: dict[str, bytes] = {}
    if not root.exists():
        return files
    for p in root.rglob("*"):
        if p.is_file():
            rel = str(p.relative_to(root)).replace("\\", "/")
            files[rel] = p.read_bytes()
    return files


@app.local_entrypoint()
def main() -> None:
    pairs = _load_pairs()
    if not pairs:
        raise SystemExit("No training pairs. Run build_corpus + export_colab_notebook first.")
    rows = _to_messages(pairs)
    text = "\n".join(json.dumps(r, ensure_ascii=False) for r in rows)
    print(f"Submitting mockGE QLoRA on Modal T4 with {len(rows)} pairs...")
    result = train_qlora.remote(text)
    print("TRAIN RESULT:", {k: v for k, v in result.items() if k != "sample"})
    print("SAMPLE OUTPUT:\n", result.get("sample", ""))

    print("Downloading adapter from Modal volume...")
    files = fetch_adapter.remote()
    if not files:
        raise SystemExit("No adapter files found on volume")
    LOCAL_OUT.mkdir(parents=True, exist_ok=True)
    for rel, data in files.items():
        dest = LOCAL_OUT / rel
        dest.parent.mkdir(parents=True, exist_ok=True)
        dest.write_bytes(data)
        print(" wrote", dest, len(data), "bytes")
    print("DONE. Adapter at", LOCAL_OUT)
