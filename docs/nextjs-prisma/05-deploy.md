# 5. Deploy

## Database

Create a production Postgres database. Any of these work with Prisma:

- **Neon** (serverless, free tier, built into Vercel)
- **Supabase**
- **Railway / Render**
- **AWS RDS**

On serverless hosts (Vercel), use a **pooled** connection string so functions don't run out of connections. Neon and Supabase give you one (`-pooler` host / port 6543). Migrations need a **direct** connection, so add `directUrl`:

```prisma
datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")   // pooled — used at runtime
  directUrl = env("DIRECT_URL")     // direct — used by migrations
}
```

Add `DIRECT_URL` to `.env` and `.env.example` too. Locally, both values can be the same.

## Vercel

1. Import the repo in Vercel. It detects Next.js automatically.
2. Set the environment variables:

   | Name | Value |
   |---|---|
   | `DATABASE_URL` | pooled connection string |
   | `DIRECT_URL` | direct connection string |
   | `NEXT_PUBLIC_API_URL` | leave empty |
   | `SITE_URL` | `https://nebulawebtech.com` (only with Stripe) |
   | `STRIPE_SECRET_KEY` | live key (only with Stripe) |
   | `STRIPE_WEBHOOK_SECRET` | from the Stripe dashboard webhook (only with Stripe) |

3. Build command: `prisma generate && next build` (already in `package.json` from 01).
4. Run migrations as part of the deploy. Either:
   - change the build command to `prisma migrate deploy && prisma generate && next build`, or
   - run `npx prisma migrate deploy` from CI before deploying.
5. With Stripe: add a webhook endpoint in the Stripe dashboard → `https://nebulawebtech.com/api/stripe/webhook` with events `checkout.session.completed` and `checkout.session.expired`.

## Netlify

Same steps. The Next.js runtime handles routing and Route Handlers.

## Self-hosted (Docker)

Add `output: "standalone"` to `next.config.ts`, then:

```dockerfile
FROM node:22-alpine AS deps
WORKDIR /app
COPY package*.json ./
COPY prisma ./prisma
RUN npm ci

FROM node:22-alpine AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npx prisma generate && npm run build

FROM node:22-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/.next/standalone ./
COPY --from=build /app/.next/static ./.next/static
COPY --from=build /app/public ./public
COPY --from=build /app/prisma ./prisma
EXPOSE 3000
CMD ["sh", "-c", "npx prisma migrate deploy && node server.js"]
```

## Moving the domain from WordPress

- Every page keeps its WordPress URL. `next.config.ts` also redirects `/contact`, `/html-sitemap` and `/home`.
- Before switching DNS, export any WordPress form entries and the newsletter list you want to keep. Import subscribers with a one-off script:

  ```ts
  // scripts/import-subscribers.ts — run with: npx tsx scripts/import-subscribers.ts
  import { prisma } from "../src/lib/prisma";
  const emails: string[] = [/* paste exported addresses */];
  await prisma.subscriber.createMany({
    data: emails.map((e) => ({ email: e.trim().toLowerCase(), source: "wordpress-import" })),
    skipDuplicates: true,
  });
  ```

- Re-add Google Analytics / Site Kit (`GT-WBTV5MH9`, `GTM-T5LKGDTN` on the live site) with `@next/third-parties` if you still want them.
- Submit the new `/sitemap.xml` in Google Search Console.

## Pre-launch checklist

- [ ] `prisma migrate deploy` ran against production
- [ ] Contact, newsletter and payment forms each create a row in production
- [ ] Someone gets notified about new inquiries (03 → "Getting notified")
- [ ] Stripe in **live** mode with the production webhook secret (if using payments)
- [ ] `/make-a-payment?status=success` shows a confirmation (04 → "Small frontend follow-up")
- [ ] Rate limiting is acceptable for traffic (in-memory, or move to Redis/Postgres)
- [ ] Database backups on
- [ ] Analytics added back, sitemap submitted
