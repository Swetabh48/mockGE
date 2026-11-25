# mockGE

SSC CGL + **UPSC ESE / IES Civil** + **UPSC EPFO APFC** practice platform by **Swetabh48**.

Live: [https://mockge.vercel.app](https://mockge.vercel.app)

Next.js + Prisma (Postgres). CBT-style full mocks, PYQ retakes, topic practice with textbook-style solutions, and revision notes.

## What’s included

| Exam | Area | What you get |
| --- | --- | --- |
| **SSC CGL** | Test | Tier-I / Tier-II mocks, PYQ-style, DEST |
| **SSC CGL** | Practice / Revise | Untimed drills, formulas & tricks |
| **IES Civil** | PYQ | CE Paper-I + Paper-II, **3 hours each** (full day = 6h) |
| **IES Civil** | New Mocks | Gemini framing + `mockge-ies-civil` domain model |
| **IES Civil** | Solutions | Textbook RAG + detailed explanations on the result page |
| **EPFO APFC** | 40 mocks | 10 easy · 10 medium · 20 hard (10 on the 2025 pattern); 120 Q · 2 h · 300 marks · −⅓ |
| **EPFO APFC** | Online / Offline | CBT on any device (iPad-friendly) or print paper + OMR, then upload a photo for scoring |

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
| `OLLAMA_BASE_URL` | SSC model API base (local Ollama or Modal HTTPS URL) |
| `OLLAMA_MODEL` | SSC model name (default `mockge-ssc`) |
| `OLLAMA_API_KEY` | Optional bearer token for a protected endpoint |
| `GEMINI_API_KEY` | Google Gemini for IES question framing + textbook solutions |
| `GEMINI_MODEL` | Gemini model id (default `gemini-3.8-flash`) |
| `OLLAMA_IES_BASE_URL` | IES model API base (Modal or local) |
| `OLLAMA_IES_MODEL` | IES model name (default `mockge-ies-civil`) |

### IES Civil PYQs + training

```bash
npm run ies:download          # fetch CE Paper-I/II PDFs → iesce/pdfs/
npm run ies:import            # parse → data/ies_civil_official.json
npm run ies:seed              # load official PYQs into Postgres
npm run ies:corpus            # build data/ies_model_corpus.jsonl
npm run ies:textbooks         # chunk data/ies_textbooks/ for RAG solutions

# Cloud GPU train + serve (Modal; GPU needs billing linked)
modal run infra/train_mockge_ies.py
modal deploy infra/serve_mockge_ies_ollama.py
```

Dashboard switch: **SSC CGL | IES Civil**. IES PYQ tab lists years with Start (3h) / Full day (6h).

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

## EPFO APFC mocks

Dashboard switch: **SSC CGL | IES Civil | EPFO APFC** (or open `/?exam=epfo`). Each paper lives at `/epfo/<id>`
(`epfo-e01…e10`, `epfo-m01…m10`, `epfo-h01…h10`, and the 2025-pattern `epfo-h11…h20`) and needs no database —
papers are static JSON in `public/epfo/`.

- **Online:** 120-question CBT with a single 2-hour timer, palette, mark-for-review, autosave (survives reload/sleep).
- **Offline:** view or download the question booklet (PDF), download the printable OMR sheet (PDF), press *Start test*;
  when time is up either upload a photo of the filled OMR (read in the browser, then confirmed by the candidate) or just review solutions.
- **Results:** score with one-third negative marking, section/topic analysis, "where to improve", full solutions, PDF download.
- Attempts are stored in the browser (`localStorage`); nothing is sent to a server.
- The mail button opens a prefilled email to request new papers.

Content is original. Bank items live in `src/lib/epfo/bank/*.ts` (hand-written), numeric aptitude, accounting,
social-security and economy questions are computed by `src/lib/epfo/gen/*` (exact keys + worked solutions).

**2025-pattern series (papers 31–40, `epfo-h11…h20`).** Modelled on the 30 November 2025 paper (one combined APFC/EO-AO
paper, 120 Q, 2 h). Items come from a separate bank, `src/lib/epfo/bank25/*.ts`, written as statement, "how many of
the above", assertion–reason, match-the-list and case/numerical questions rather than fact one-liners; English has two
reading passages per paper. The section mix varies per paper around the 2025 averages (`y25` in `sections.ts`,
labour + social security kept at 22–26), using `gen/quant25.ts` and `gen/social25.ts` for computed reasoning, aptitude,
EDLI and compensation questions. The classic 30 papers are built from their own seed and are unchanged; stems are
unique across all 40 papers.

```bash
npm run epfo:build   # rebuild public/epfo/papers/*.json (fails if any section is short or a stem repeats)
```

The build is deterministic, uses every bank item at most once across the 30 papers, balances answer letters
(30 a/b/c/d per paper) and reports near-duplicate stems.

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
