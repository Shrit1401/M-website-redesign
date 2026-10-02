# Nebula Webtech: Next.js + Prisma + Postgres

| Step | Status |
|---|---|
| WordPress → **Next.js App Router** frontend | ✅ Done in this repo |
| **Prisma + PostgreSQL** backend | 📄 Guides below (not built yet) |
| **Stripe** invoice payments (optional) | 📄 Guide below (not built yet) |

## What was done (frontend)

- Every live page was rebuilt in `src/app/`, **on the same URLs** as the WordPress site (`/about`, `/services/...`, `/contact-us`, `/make-a-payment`, `/privacy-policy`, `/terms-and-conditions`), so existing links and rankings keep working.
- Content lives in `src/lib/site.ts`, `src/lib/services.ts` and `src/lib/legal.ts`.
- The site has three forms. Each one validates in the browser and then POSTs JSON through `src/lib/api.ts`:

  | Form | Where | Endpoint |
  |---|---|---|
  | Contact / quote | `/contact-us`, bottom of each service page | `POST /api/contact` |
  | Newsletter | Footer on every page | `POST /api/newsletter` |
  | Invoice payment | `/make-a-payment` | `POST /api/payments` |

- **`src/lib/contracts.ts` is the contract.** It holds the request/response types, the enum values (`SERVICE_INTERESTS`, `BUDGETS`) and the validators (`validateContact`, `validateNewsletter`, `validatePayment`). It has no browser or server imports, so the backend imports the **same file**. The rules are written once, and the Prisma enums in [02-database.md](02-database.md) use the same values.
- Until the backend exists, submitting a form shows `No backend at /api/... yet` in development and a friendly "please call us" message in production.

```bash
npm install
npm run dev     # http://localhost:3000
npm run build
```

## Next: Prisma + Postgres — read in this order

| # | Guide | What you get |
|---|-------|--------------|
| 1 | [01-setup.md](01-setup.md) | Dependencies, local Postgres, env vars, folder layout |
| 2 | [02-database.md](02-database.md) | `schema.prisma` (Inquiry, Subscriber, PaymentRequest), Prisma client, migrations |
| 3 | [03-api-routes.md](03-api-routes.md) | The three Route Handlers the forms already call, plus the API contract |
| 4 | [04-payments.md](04-payments.md) | Optional: Stripe Checkout + webhook for `/make-a-payment` |
| 5 | [05-deploy.md](05-deploy.md) | Deploying to Vercel (or Docker) with a hosted Postgres |

## Big picture

```
 NOW                                     TARGET
 ──────────────────────────────          ──────────────────────────────────────────
 Next.js (static pages)                  Next.js
  └─ forms → src/lib/api.ts               ├─ static pages (unchanged)
      └─ POST /api/*  → 404               └─ forms → src/lib/api.ts
                                               └─ POST /api/*  (Route Handlers)
                                                    ├─ validate with src/lib/contracts.ts
                                                    ├─ Prisma → PostgreSQL
                                                    └─ (optional) Stripe Checkout
```

**No frontend changes are needed** to connect the backend. Once the three routes exist and return the shapes in [03-api-routes.md](03-api-routes.md), the forms work.

## Ground rules for the backend

- **Same validators on both sides.** Route Handlers call the `validate*` functions from `src/lib/contracts.ts`. Never trust the browser's validation alone.
- **Money is integer cents** (`amountCents: Int`). Never use floats.
- **Honeypot:** every payload has a hidden `website` field. If it's filled in, a bot sent it. Return a normal success response and don't save anything.
- **Enum values are shared.** `ServiceInterest` and `Budget` in Prisma must match `SERVICE_INTERESTS` and `BUDGETS` in `contracts.ts` exactly. If you add an option, change both.
- **Pages stay static.** Only `/api/*` touches the database, so the marketing pages keep being prerendered.
