# 2. Database (Prisma + Postgres)

The schema below is mapped from the payload types in `src/lib/contracts.ts`.

| Frontend payload (`contracts.ts`) | Endpoint | Postgres table |
|---|---|---|
| `ContactInput` | `POST /api/contact` | `Inquiry` |
| `NewsletterInput` | `POST /api/newsletter` | `Subscriber` |
| `PaymentInput` | `POST /api/payments` | `PaymentRequest` |
| `SERVICE_INTERESTS[].value` | — | enum `ServiceInterest` |
| `BUDGETS[].value` | — | enum `Budget` |

The `website` honeypot field is **not** stored. The backend discards submissions that fill it.

## `prisma/schema.prisma`

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ─── Enums ───────────────────────────────────────────────
// ServiceInterest and Budget MUST match SERVICE_INTERESTS / BUDGETS in src/lib/contracts.ts.

enum ServiceInterest {
  WEB_DESIGN_DEVELOPMENT
  WEB_MAINTENANCE
  DIGITAL_MARKETING
  OTHER
}

enum Budget {
  UNDER_2K
  FROM_2K_TO_5K
  FROM_5K_TO_10K
  OVER_10K
  NOT_SURE
}

// Internal pipeline status — set by the team, never by the website.
enum InquiryStatus {
  NEW
  CONTACTED
  QUOTED
  WON
  LOST
  SPAM
}

enum PaymentStatus {
  PENDING    // saved, no checkout yet (or Stripe not configured)
  CHECKOUT   // Stripe Checkout session created, customer redirected
  PAID       // confirmed by the Stripe webhook
  FAILED
  CANCELED
}

// ─── Contact / quote requests ────────────────────────────

model Inquiry {
  id        String          @id @default(cuid())
  name      String
  email     String
  phone     String?
  company   String?
  service   ServiceInterest
  budget    Budget?
  message   String          @db.Text
  source    String?         // page path the form was sent from, e.g. /services/...
  status    InquiryStatus   @default(NEW)
  ip        String?
  userAgent String?
  createdAt DateTime        @default(now())
  updatedAt DateTime        @updatedAt

  @@index([status, createdAt])
  @@index([email])
}

// ─── Newsletter ──────────────────────────────────────────

model Subscriber {
  id             String    @id @default(cuid())
  email          String    @unique // stored lower-cased
  source         String?
  unsubscribedAt DateTime?
  createdAt      DateTime  @default(now())
  updatedAt      DateTime  @updatedAt
}

// ─── Invoice payments ────────────────────────────────────

model PaymentRequest {
  id              String        @id @default(cuid())
  invoiceNumber   String
  name            String
  email           String
  amountCents     Int           // integer cents — never floats for money
  currency        String        @default("usd")
  note            String?       @db.Text
  status          PaymentStatus @default(PENDING)
  stripeSessionId String?       @unique
  paidAt          DateTime?
  createdAt       DateTime      @default(now())
  updatedAt       DateTime      @updatedAt

  @@index([invoiceNumber])
  @@index([status, createdAt])
}
```

### Why these choices

- **`cuid()` ids** are returned to the browser as `{ ok: true, id }`. They don't reveal how many rows exist, unlike auto-increment integers.
- **`message` and `note` are `@db.Text`.** The validators allow 5,000 and 1,000 characters.
- **`Subscriber.email` is unique.** Subscribing twice is an upsert, not an error (see 03).
- **`InquiryStatus`** turns the table into a lightweight lead pipeline that you can browse in Prisma Studio.
- **`PaymentRequest` is not an invoice system.** It records what the customer *said* they're paying. If you later store real invoices, add an `Invoice` model and look the amount up by `invoiceNumber` instead of trusting the browser (see [04-payments.md](04-payments.md)).

## Create the tables

```bash
npx prisma migrate dev --name init
```

This creates `prisma/migrations/<timestamp>_init/migration.sql`, applies it to your local database and generates the client. Commit the `migrations/` folder.

Browse the data any time:

```bash
npm run db:studio
```

## `src/lib/prisma.ts`

One client per process. In development, Next.js hot-reloads modules, so the client is cached on `globalThis` to avoid opening a new connection pool on every reload.

```ts
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
```

Only import this from server code (`src/app/api/**`, server components, server actions). Never import it from a file that has `"use client"`.

## Changing the schema later

1. Edit `prisma/schema.prisma`.
2. If you add a form option, update `src/lib/contracts.ts` too, so that both enum lists match.
3. `npx prisma migrate dev --name <what-changed>`
4. Commit the new migration folder.
