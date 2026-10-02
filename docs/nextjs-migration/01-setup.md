# 1. Project setup

This repo is already a Next.js app (see [README](README.md)). These steps add the database and auth on top.

## Install dependencies

```bash
# Database
npm install @prisma/client
npm install -D prisma tsx

# Auth
npm install next-auth@beta bcryptjs zod
npm install -D @types/bcryptjs
```

## Local Postgres

Pick one.

**Docker** (add `docker-compose.yml` at the project root):

```yaml
services:
  db:
    image: postgres:17
    restart: unless-stopped
    environment:
      POSTGRES_USER: revive
      POSTGRES_PASSWORD: revive
      POSTGRES_DB: revive
    ports:
      - "5432:5432"
    volumes:
      - pgdata:/var/lib/postgresql/data
volumes:
  pgdata:
```

```bash
docker compose up -d
```

**Hosted:** create a free database on Neon, Supabase or Vercel Postgres and copy the connection string.

## Environment variables

`.env` (do not commit; add it to `.gitignore`):

```bash
DATABASE_URL="postgresql://revive:revive@localhost:5432/revive?schema=public"

# Auth.js — generate with: npx auth secret
AUTH_SECRET="replace-me"
```

Commit a `.env.example` with the same keys and empty values. `.gitignore` already ignores `.env*` except `.env.example`.

## Initialise Prisma

```bash
npx prisma init --datasource-provider postgresql
```

Then replace `prisma/schema.prisma` with the schema in [02-database.md](02-database.md).

## package.json scripts

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "prisma generate && next build",
    "start": "next start",
    "lint": "oxlint",
    "db:migrate": "prisma migrate dev",
    "db:push": "prisma db push",
    "db:seed": "prisma db seed",
    "db:reset": "prisma migrate reset",
    "db:studio": "prisma studio"
  },
  "prisma": {
    "seed": "tsx prisma/seed.ts"
  }
}
```

## Target folder layout

New files are marked with `+`.

```
revire/
├─ prisma/                     +
│  ├─ schema.prisma            +
│  ├─ seed.ts                  +
│  └─ migrations/              +
├─ public/
├─ src/
│  ├─ app/                     ← routes (already there)
│  │  └─ api/auth/[...nextauth]/route.ts   +
│  ├─ actions/                 + server actions (05-data-layer.md)
│  │  ├─ auth.ts
│  │  ├─ cart.ts
│  │  ├─ learning.ts
│  │  ├─ tutor.ts
│  │  └─ admin.ts
│  ├─ components/
│  ├─ data/
│  │  ├─ news.ts               ← stays static
│  │  ├─ seed.ts, types.ts     ← used only by prisma/seed.ts after the switch
│  │  └─ queries.ts            + read-only Prisma queries
│  ├─ layouts/
│  ├─ lib/
│  │  ├─ prisma.ts             +
│  │  ├─ auth.ts               + Auth.js config
│  │  ├─ guards.ts             + requireUser / requireRole
│  │  └─ router.tsx            ← React Router shim (delete once views use next/link directly)
│  ├─ store/store.tsx          ← delete when every view is on queries/actions
│  ├─ views/
│  └─ middleware.ts            +
├─ .env                        +
├─ .env.example                +
└─ docker-compose.yml          +
```
