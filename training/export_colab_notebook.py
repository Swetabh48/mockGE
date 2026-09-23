"""Build mockGE Colab notebook + cloud training JSONL (CivilMaster-style free T4)."""

from __future__ import annotations

import json
import zipfile
from pathlib import Path

ROOT = Path(__file__).resolve().parent
JSONL = ROOT / "data" / "ssc_cgl_train.jsonl"
PYQ = ROOT / "data" / "pyq_imported.jsonl"
CLOUD_DIR = ROOT / "cloud_pack"
OUT_NB = ROOT / "MockGE_Colab_QLoRA.ipynb"
OUT_DATA = CLOUD_DIR / "ssc_cgl_cloud.jsonl"
DESKTOP_NB = Path.home() / "OneDrive" / "Desktop" / "MockGE_Colab_QLoRA.ipynb"
MAX_PAIRS = 3500


def load_alpaca(path: Path) -> list[dict]:
    rows: list[dict] = []
    if not path.exists():
        return rows
    with path.open(encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if not line:
                continue
            ex = json.loads(line)
            rows.append(
                {
                    "instruction": str(ex.get("instruction") or ""),
                    "input": str(ex.get("input") or ""),
                    "output": str(ex.get("output") or ""),
                }
            )
    return rows


def pick_pairs() -> list[dict]:
    # Prefer real PYQ imports, then fill from full corpus (dedupe by output stem).
    seen: set[str] = set()
    out: list[dict] = []

    def add(rows: list[dict]) -> None:
        for r in rows:
            key = (r["output"] or "")[:180]
            if not key or key in seen:
                continue
            seen.add(key)
            out.append(r)
            if len(out) >= MAX_PAIRS:
                return

    add(load_alpaca(PYQ))
    add(load_alpaca(JSONL))
    return out


def md(cells: list, source: str) -> None:
    cells.append(
        {
            "cell_type": "markdown",
            "metadata": {},
            "source": source.splitlines(keepends=True),
        }
    )


def code(cells: list, source: str) -> None:
    cells.append(
        {
            "cell_type": "code",
            "execution_count": None,
            "metadata": {},
            "outputs": [],
            "source": source.splitlines(keepends=True),
        }
    )


def main() -> None:
    CLOUD_DIR.mkdir(parents=True, exist_ok=True)
    pairs = pick_pairs()
    with OUT_DATA.open("w", encoding="utf-8") as f:
        for p in pairs:
            f.write(json.dumps(p, ensure_ascii=False) + "\n")

    # Embed as JSON for one-file Colab upload (same pattern as CivilMaster).
    data_literal = json.dumps({"pairs": pairs}, ensure_ascii=False)
    cells: list = []

    md(
        cells,
        """# mockGE — Free GPU QLoRA (Google Colab T4)

1. **Runtime → Change runtime type → T4 GPU**
2. **Runtime → Run all**
3. Download `mockge-ssc-lora.zip` when training finishes
4. Unzip into `training/outputs/mockge-ssc-lora/` on your PC

Uses open-source **Unsloth + Qwen2.5-3B-Instruct (4-bit QLoRA)** — same stack as CivilMaster.
""",
    )

    code(cells, """# 1) Confirm free GPU
!nvidia-smi
""")

    code(
        cells,
        """# 2) Install Unsloth (Colab)
!pip install -q unsloth
!pip install -q datasets trl transformers accelerate bitsandbytes
""",
    )

    code(
        cells,
        f"""# 3) Embedded mockGE SSC-CGL training set
import json
DATASET_JSON = json.loads(r'''{data_literal}''')
print('pairs:', len(DATASET_JSON['pairs']))
""",
    )

    code(
        cells,
        """# 4) Load Qwen2.5-3B 4-bit + LoRA (fits free T4)
from unsloth import FastLanguageModel
import torch

max_seq_length = 1024
model, tokenizer = FastLanguageModel.from_pretrained(
    model_name = 'unsloth/Qwen2.5-3B-Instruct-bnb-4bit',
    max_seq_length = max_seq_length,
    dtype = None,
    load_in_4bit = True,
)
model = FastLanguageModel.get_peft_model(
    model,
    r = 16,
    target_modules = ['q_proj','k_proj','v_proj','o_proj','gate_proj','up_proj','down_proj'],
    lora_alpha = 32,
    lora_dropout = 0,
    bias = 'none',
    use_gradient_checkpointing = 'unsloth',
    random_state = 3407,
)
print('Model ready on', torch.cuda.get_device_name(0) if torch.cuda.is_available() else 'CPU')
""",
    )

    code(
        cells,
        """# 5) Train QLoRA
from datasets import Dataset
from trl import SFTTrainer
from transformers import TrainingArguments

SYSTEM = (
    "You are mockGE's SSC-CGL question setter. "
    "Write HARD Tier-I/II MCQs. Reply with JSON only using keys: "
    "stemEn, optionA, optionB, optionC, optionD, correctOption, topic, explanation."
)

def to_text(ex):
    messages = [
        {'role':'system','content': SYSTEM},
        {'role':'user','content': f\"{ex.get('instruction','Create one HARD SSC CGL MCQ.')}\\n\\n{ex.get('input','')}\"},
        {'role':'assistant','content': ex.get('output','')},
    ]
    return tokenizer.apply_chat_template(messages, tokenize=False, add_generation_prompt=False)

ds = Dataset.from_list([{'text': to_text(p)} for p in DATASET_JSON['pairs']])

trainer = SFTTrainer(
    model = model,
    tokenizer = tokenizer,
    train_dataset = ds,
    dataset_text_field = 'text',
    max_seq_length = max_seq_length,
    packing = False,
    args = TrainingArguments(
        per_device_train_batch_size = 2,
        gradient_accumulation_steps = 4,
        warmup_steps = 10,
        num_train_epochs = 1,
        learning_rate = 2e-4,
        fp16 = not torch.cuda.is_bf16_supported(),
        bf16 = torch.cuda.is_bf16_supported(),
        logging_steps = 10,
        optim = 'adamw_8bit',
        weight_decay = 0.01,
        lr_scheduler_type = 'linear',
        seed = 3407,
        output_dir = 'mockge_lora_out',
        report_to = 'none',
        save_strategy = 'epoch',
    ),
)
trainer.train()
""",
    )

    code(
        cells,
        """# 6) Save adapter + smoke test
from pathlib import Path
out = Path('mockge-ssc-lora')
out.mkdir(exist_ok=True)
model.save_pretrained(str(out))
tokenizer.save_pretrained(str(out))
print('Saved', out.resolve())

FastLanguageModel.for_inference(model)
prompt = tokenizer.apply_chat_template([
    {'role':'system','content': SYSTEM},
    {'role':'user','content':'Create one HARD SSC CGL Tier-I MCQ on Percentage. Return JSON only.'},
], tokenize=False, add_generation_prompt=True)
inputs = tokenizer(prompt, return_tensors='pt').to(model.device)
ids = model.generate(**inputs, max_new_tokens=280, temperature=0.4, do_sample=True)
print(tokenizer.decode(ids[0], skip_special_tokens=True))
""",
    )

    code(
        cells,
        """# 7) Zip adapter for download
!zip -r mockge-ssc-lora.zip mockge-ssc-lora
from google.colab import files
files.download('mockge-ssc-lora.zip')
""",
    )

    nb = {
        "nbformat": 4,
        "nbformat_minor": 5,
        "metadata": {
            "kernelspec": {
                "display_name": "Python 3",
                "language": "python",
                "name": "python3",
            },
            "language_info": {"name": "python"},
            "accelerator": "GPU",
            "colab": {"provenance": [], "gpuType": "T4"},
        },
        "cells": cells,
    }
    OUT_NB.write_text(json.dumps(nb), encoding="utf-8")
    DESKTOP_NB.write_text(json.dumps(nb), encoding="utf-8")

    zip_path = CLOUD_DIR / "mockge_colab_pack.zip"
    with zipfile.ZipFile(zip_path, "w", compression=zipfile.ZIP_DEFLATED) as zf:
        zf.write(OUT_NB, arcname=OUT_NB.name)
        zf.write(OUT_DATA, arcname=OUT_DATA.name)

    print(f"Wrote {OUT_NB} pairs={len(pairs)}")
    print(f"Wrote {OUT_DATA}")
    print(f"Wrote {DESKTOP_NB}")
    print(f"Wrote {zip_path}")


if __name__ == "__main__":
    main()
