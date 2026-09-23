"""
Fine-tune Qwen2.5-0.5B-Instruct with LoRA for SSC-CGL MCQ generation.
Works on CPU (slow) or CUDA if available.
"""

from __future__ import annotations

import argparse
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent
DATA = ROOT / "data" / "ssc_cgl_train.jsonl"
OUT_DIR = ROOT / "outputs" / "mockge-ssc-lora"


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--base-model", default="Qwen/Qwen2.5-0.5B-Instruct")
    parser.add_argument("--max-steps", type=int, default=120)
    parser.add_argument("--batch-size", type=int, default=1)
    parser.add_argument("--grad-accum", type=int, default=8)
    parser.add_argument("--lr", type=float, default=2e-4)
    parser.add_argument("--max-seq-len", type=int, default=384)
    parser.add_argument("--data", type=Path, default=DATA)
    parser.add_argument("--out", type=Path, default=OUT_DIR)
    args = parser.parse_args()

    if not args.data.exists():
        raise SystemExit(f"Missing corpus {args.data}. Run build_corpus.py first.")

    import torch
    from datasets import Dataset
    from peft import LoraConfig, TaskType, get_peft_model
    from transformers import (
        AutoModelForCausalLM,
        AutoTokenizer,
        DataCollatorForLanguageModeling,
        Trainer,
        TrainingArguments,
    )

    rows = []
    with args.data.open(encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if not line:
                continue
            ex = json.loads(line)
            text = (
                f"### Instruction:\n{ex['instruction']}\n\n"
                f"### Input:\n{ex.get('input') or ''}\n\n"
                f"### Response:\n{ex['output']}"
            )
            rows.append({"text": text})
    rows = rows[:6000]
    print(f"Examples: {len(rows)}")

    device = "cuda" if torch.cuda.is_available() else "cpu"
    print(f"Device: {device}")

    tok = AutoTokenizer.from_pretrained(args.base_model, trust_remote_code=True)
    if tok.pad_token is None:
        tok.pad_token = tok.eos_token

    def tokenize(batch):
        return tok(
            batch["text"],
            truncation=True,
            max_length=args.max_seq_len,
            padding=False,
        )

    ds = Dataset.from_list(rows).map(tokenize, batched=True, remove_columns=["text"])

    model = AutoModelForCausalLM.from_pretrained(
        args.base_model,
        trust_remote_code=True,
        torch_dtype=torch.float32 if device == "cpu" else torch.float16,
        low_cpu_mem_usage=True,
    )
    if device == "cpu":
        model.to(device)

    peft_config = LoraConfig(
        task_type=TaskType.CAUSAL_LM,
        r=8,
        lora_alpha=16,
        lora_dropout=0.05,
        target_modules=["q_proj", "k_proj", "v_proj", "o_proj"],
    )
    model = get_peft_model(model, peft_config)
    model.print_trainable_parameters()
    model.train()

    args.out.mkdir(parents=True, exist_ok=True)
    train_args = TrainingArguments(
        output_dir=str(args.out),
        max_steps=args.max_steps,
        per_device_train_batch_size=args.batch_size,
        gradient_accumulation_steps=args.grad_accum,
        learning_rate=args.lr,
        logging_steps=5,
        save_steps=60,
        save_total_limit=2,
        fp16=False,
        bf16=False,
        report_to=[],
        remove_unused_columns=False,
        optim="adamw_torch",
        warmup_steps=5,
        dataloader_pin_memory=False,
    )

    collator = DataCollatorForLanguageModeling(tokenizer=tok, mlm=False)
    trainer = Trainer(
        model=model,
        args=train_args,
        train_dataset=ds,
        data_collator=collator,
    )
    trainer.train()
    trainer.save_model(str(args.out))
    tok.save_pretrained(str(args.out))

    meta = {
        "base_model": args.base_model,
        "adapter_path": str(args.out),
        "examples": len(rows),
        "max_steps": args.max_steps,
        "device": device,
        "purpose": "SSC-CGL MCQ generation LoRA for mockGE",
    }
    (args.out / "mockge_train_meta.json").write_text(json.dumps(meta, indent=2), encoding="utf-8")
    print(f"Saved adapter -> {args.out}")


if __name__ == "__main__":
    main()
