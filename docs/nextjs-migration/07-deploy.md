# 7. Deploy

## Database

Create a production Postgres database. Any of these work with Prisma:

- **Neon** (serverless, free tier, built into Vercel)
- **Supabase**
- **Railway / Render**
- **AWS RDS**

On serverless hosts (Vercel), use a **pooled** connection string so functions don't run out of connections. Neon and Supabase give you one (`-pooler` host / port 6543). Set it up like this:

```prisma
datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")   // pooled — used at runtime
  directUrl = env("DIRECT_URL")     // direct — used by migrations
}
```

## Vercel

1. Remove `vercel.json`. The SPA rewrite it contains would break Next.js routing.
2. Import the repo in Vercel. It detects Next.js automatically.
3. Set the environment variables:

   | Name | Value |
   |---|---|
   | `DATABASE_URL` | pooled connection string |
   | `DIRECT_URL` | direct connection string |
   | `AUTH_SECRET` | output of `npx auth secret` |
   | `NEXT_PUBLIC_DEMO_MODE` | `true` for the demo, otherwise unset |

4. Build command: `prisma generate && next build` (already in `package.json` from 01).
5. Run migrations as part of the deploy. Either:
   - change the build command to `prisma migrate deploy && prisma generate && next build`, or
   - run `npx prisma migrate deploy` from CI before deploying.
6. Seed once (optional, demo only):

   ```bash
   DATABASE_URL="<direct url>" npm run db:seed
   ```

## Netlify

Same steps. Remove `public/_redirects` (the SPA fallback) and let the Next.js runtime handle routing.

## Self-hosted (Docker)

Add `output: 'standalone'` to `next.config.ts`, then:

```dockerfile
FROM node:22-alpine AS deps
WORKDIR /app
COPY package*.json prisma ./
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

## Pre-launch checklist

- [ ] Demo login buttons hidden (`NEXT_PUBLIC_DEMO_MODE` unset)
- [ ] Demo accounts deleted, or their passwords changed
- [ ] Every server action checks the role (`actor('ROLE')`)
- [ ] No query returns `passwordHash`
- [ ] Real payments (Stripe Checkout + webhook that creates the `Order` and `Enrollment`) instead of the mock `checkout()`
- [ ] Email provider for invites and password reset (Resend, Postmark, ...)
- [ ] Unsplash placeholder images in `public/img/` replaced
- [ ] Database backups on
