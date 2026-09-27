# mockGE

SSC-CGL mock platform by **Swetabh48**. Next.js + Prisma Postgres. Authentic CBT-style mocks, topic practice, solutions, and formula revision.

## Setup

```bash
cp .env.example .env
# set DATABASE_URL (Postgres)

npm install
npx prisma db push
npm run db:seed
npm run dev
```

Open http://localhost:3000

## Official papers

Place SSC official PDFs under `sscgl/`. Run:

```bash
npm run import:sscgl
```

This refreshes `data/sscgl_official.json` used for PYQ-style variety.

## Deploy

Vercel + `DATABASE_URL`. Seed once after first deploy.
