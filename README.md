# mockGE

SSC CGL practice platform by **Swetabh48**.

Live: [https://mockge.vercel.app](https://mockge.vercel.app)

Next.js + Prisma (Postgres). CBT-style full mocks, topic practice with solutions & exam tricks, and a Formulas & Tricks revision section.

## What’s included

| Area | What you get |
| --- | --- |
| **Test** | Tier-I / Tier-II style mocks, PYQ-style papers, DEST practice |
| **Practice** | Untimed topic drills (stopwatch from 00:00), fresh sets on demand |
| **Revise** | Topic-wise formulas, worked examples, exam shortcuts, video links |
| **Results** | Score breakdown, strengths/weaknesses, step-by-step solutions |

## How practice questions are generated

New practice sets are produced by **`mockge-ssc`**, a custom SSC-CGL question model (not a fixed question list).

- **Production (any device / browser):** the Vercel app calls a cloud inference endpoint (Modal) hosting `mockge-ssc`. Visitors do not need a local model.
- **Local development:** the same API can use a local Ollama instance (`mockge-ssc`) when `OLLAMA_BASE_URL` points at `http://127.0.0.1:11434`.
- **Fallback:** if the model endpoint is unreachable, topic-locked algorithmic generators keep the site usable.

Official PDFs under `sscgl/` are imported into `data/sscgl_official.json` for corpus / optional PYQ browsing. **Generate never copies those PDFs into a practice set** — each click asks `mockge-ssc` to invent new stems and bans fingerprints of questions you already saw on that topic.

## Setup (local)

```bash
cp .env.example .env
# set DATABASE_URL (Postgres / Neon)

npm install
npx prisma db push
npm run db:seed
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Environment

| Variable | Purpose |
| --- | --- |
| `DATABASE_URL` | Postgres connection string |
| `OLLAMA_BASE_URL` | Model API base (local Ollama or Modal HTTPS URL) |
| `OLLAMA_MODEL` | Model name (default `mockge-ssc`) |
| `OLLAMA_API_KEY` | Optional bearer token for a protected endpoint |

### Optional: local model

```bash
ollama serve
# ensure mockge-ssc is available: ollama list
```

### Official papers → bank

```bash
# put PDF(s) in sscgl/
npm run import:sscgl
```

```bash
npm run corpus:build   # rebuild data/model_corpus.jsonl from imported PYQs
```

## Cloud model (production inference)

Inference for production is deployed with Modal:

```bash
modal deploy infra/serve_mockge_ollama.py
```

Then set on Vercel (Production + Preview):

- `OLLAMA_BASE_URL` = the printed `*.modal.run` URL  
- `OLLAMA_MODEL` = `mockge-ssc`

GPU (`T4`) needs a payment method on the Modal workspace; free monthly credits can cover usage after that. Until GPU is unlocked, the serve app can run on CPU.

## Deploy (app)

```bash
# Vercel project: Node 22+ / 24.x, env DATABASE_URL (+ OLLAMA_* as above)
npx vercel --prod
```

Seed the database once after the first deploy if the bank is empty.

## Stack

- **App:** Next.js 16, React 19, Tailwind, Prisma 7  
- **DB:** PostgreSQL (Neon / Prisma Postgres)  
- **Hosting:** Vercel (app) + Modal (model API)  
- **Local model (optional):** Ollama  

## License / data policy

Practice content is generated or derived from:

- original algorithmic / model-authored SSC-style items  
- official papers you place in `sscgl/` (imported locally)  

Do not scrape paid commercial mock dumps into the repo.
