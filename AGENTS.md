<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Project context for agents

Nebula Webtech LLC's website (Palatine, IL): a dark "deep-space" marketing site plus a password-protected content dashboard at `/admin` for projects and blog posts.

Read before changing anything:

- **Design language:** `docs/design/README.md` — ten rules, then one file per area (brand & voice, color tokens, typography, layout, components incl. header/footer, motion, imagery, admin UI, content model, architecture map).
- **Backend plan:** `docs/nextjs-prisma/README.md` — Prisma + Postgres, API routes for the forms, Stripe, and moving admin content to Postgres.
- Business facts live in `src/lib/site.ts`; never hard-code phone, email or address. Colors are tokens in `src/app/globals.css`; never hard-code hex.
- Public pages are in `src/app/(site)/`; the dashboard is in `src/app/admin/`. Every admin Server Action must call `requireAdmin()`.

