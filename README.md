# mockGE

SSC-CGL mock platform by **Swetabh48**. Next.js UI + Prisma Postgres. Optional local FastAPI / Ollama / LoRA training.

## Important: training data policy

We train on:
- original algorithmic SSC-style questions
- open datasets under open licenses (e.g. ExamBench Apache-2.0, CC BY banks)

We do **not** scrape commercial paid mock PDFs / copyrighted question dumps.

## Setup

```bash
# Copy env and set DATABASE_URL (Postgres)
cp .env.example .env

npm install
npx prisma db push
npm run db:seed
npm run dev
```

Open http://localhost:3000

Optional local FastAPI hybrid (set `MOCKGE_API_URL=http://127.0.0.1:8000`):

```bash
pip install -r backend/requirements.txt
uvicorn backend.app.main:app --reload --port 8000
```

## Train your model

```bash
python training/build_corpus.py
python training/train_lora.py --max-steps 120
python training/export_to_ollama.py
cd training/outputs/ollama
ollama create mockge-ssc -f Modelfile
```

Cloud GPU (CivilMaster-style): see `training/CLOUD_TRAIN.md` (Colab T4 or Modal).

## Deploy

Vercel + `DATABASE_URL` (Prisma Postgres). Seed once after first deploy.
