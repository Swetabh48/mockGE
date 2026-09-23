# Train mockGE on free Google Colab T4

Same path as CivilMaster: Modal needs a payment card on this account, so we use
**Google Colab free T4** with open-source **Unsloth + Qwen2.5-3B QLoRA**.

## One-click steps

1. Open [Google Colab](https://colab.research.google.com/)
2. **File → Upload notebook**
3. Select either:
   - Desktop: `MockGE_Colab_QLoRA.ipynb`
   - Or: `training/MockGE_Colab_QLoRA.ipynb`
4. **Runtime → Change runtime type → T4 GPU → Save**
5. **Runtime → Run all**
6. When finished, download `mockge-ssc-lora.zip`
7. Unzip into:
   `training/outputs/mockge-ssc-lora/`

Rebuild the notebook anytime after corpus changes:

```bash
python training/build_corpus.py
python training/export_colab_notebook.py
```

## What gets trained

- Base: `unsloth/Qwen2.5-3B-Instruct-bnb-4bit` (open weights)
- Method: QLoRA (r=16)
- Data: up to **3500** SSC pairs (community PYQs first, then hard bank)
- Purpose: generate HARD SSC-CGL Tier-I/II MCQs as JSON

## After download — wiring

1. Confirm:
   - `training/outputs/mockge-ssc-lora/adapter_config.json`
   - `training/outputs/mockge-ssc-lora/adapter_model.safetensors` (or `.bin`)
2. Refresh Ollama system model (hybrid bank still works without LoRA):

```bash
python training/export_to_ollama.py
cd training/outputs/ollama
ollama create mockge-ssc -f Modelfile
```

3. FastAPI generate path can load the PEFT adapter when CUDA + bitsandbytes are available.

## Preferred when Modal works: cloud T4 (CivilMaster path)

```bash
python training/build_corpus.py
python training/export_colab_notebook.py   # builds cloud_pack JSONL
modal run training/modal_train.py
```

This trains **Qwen2.5-3B QLoRA** on Modal T4 and downloads the adapter into
`training/outputs/mockge-ssc-lora/`.

If Modal billing blocks the job, use the Colab steps above instead.
