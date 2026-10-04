# 10 · Architecture map

Next.js 16 App Router · React 19 · TypeScript · Tailwind CSS v4 · motion · Lenis · three.js / react-three-fiber · marked.

> Next.js 16 differs from older versions: `middleware.ts` is now **`proxy.ts`**, `params`/`searchParams`/`cookies()` are async, `revalidateTag` needs a second argument. Read `node_modules/next/dist/docs/` before writing framework code (see `AGENTS.md`).

## Routes

```
src/app/
├── layout.tsx                 document shell: <html>, fonts, metadata, skip link — nothing visual
├── globals.css                tokens, component classes, atmosphere, prose
├── not-found.tsx              unmatched URLs (brings its own Header/Footer)
├── sitemap.ts · robots.ts     includes published projects & posts; disallows /admin
├── (site)/                    PUBLIC SITE — layout adds Header, Footer, Lenis, Organization JSON-LD
│   ├── page.tsx               home: galaxy hero, about, services, statement, selected work, process, why, blog, CTA
│   ├── about/ · services/ · services/[slug]/ · contact-us/ · make-a-payment/
│   ├── projects/ · projects/[slug]/        ← managed content
│   ├── blog/ · blog/[slug]/                ← managed content
│   ├── privacy-policy/ · terms-and-conditions/
│   └── not-found.tsx          notFound() from a site page
└── admin/                     DASHBOARD — no marketing chrome
    ├── actions.ts             all Server Actions (each calls requireAdmin)
    ├── (auth)/login/
    └── (panel)/               layout = requireAdmin + AdminShell
        ├── page.tsx           overview
        ├── projects/ · projects/new/ · projects/[id]/
        └── posts/ · posts/new/ · posts/[id]/
src/proxy.ts                   optimistic /admin redirect (cookie check only)
```

URL compatibility: the public pages keep the old WordPress URLs; `next.config.ts` redirects a few legacy paths.

## Libraries & components

```
src/lib/
├── site.ts          SITE (business facts), NAV, ABOUT, STATS, PROCESS, WHY, CAPABILITIES
├── services.ts      SERVICES (+ interest value), getService, getServiceByInterest
├── legal.ts         privacy & terms text
├── contracts.ts     public form payloads + validators (shared with future backend)
├── api.ts           browser client for /api/* (contact, newsletter, payments)
├── markdown.ts      safe markdown → HTML
├── content/
│   ├── schema.ts    Project/Post types, enums, validators, slugify, readingMinutes
│   └── store.ts     server-only JSON file store (swap for Prisma later)
└── admin/
    ├── session.ts   token sign/verify (used by proxy + auth)
    └── auth.ts      server-only: requireAdmin, sessions, password check, throttle

src/components/
├── Header.tsx · Footer.tsx · Logo.tsx · OpenStatus.tsx · BackToTop.tsx
├── Hero.tsx · NebulaScene.tsx          home hero + WebGL galaxy
├── Sections.tsx    CONTAINER, PageHero, SectionHead, Accent, Marquee, ServiceCards, Process, Why, FinalCta
├── Content.tsx     Cover, StageBadge, ProjectCard, PostCard, PostMeta, EmptyOrbit, formatDate
├── Motion.tsx      EASE, Reveal, MaskLines, Magnetic, Spotlight, CountUp, Meter
├── Forms.tsx       ContactForm, NewsletterForm, PaymentForm
├── Icon.tsx · JsonLd.tsx · LegalPage.tsx · NotFoundContent.tsx · SmoothScroll.tsx
└── admin/          see 08-admin.md

content/            projects.json, posts.json (managed content, committed)
docs/design/        this design language
docs/nextjs-prisma/ backend plan (Prisma + Postgres + Stripe) incl. moving admin content to Postgres
```

## Rendering

- Public pages are **static** and read content at build time. Admin saves call `revalidatePath("/", "layout")`; pages regenerate on the next request. Blog, home and sitemap also `revalidate = 3600` for scheduled posts.
- `projects/[slug]` and `blog/[slug]` pre-render published slugs via `generateStaticParams`; new slugs render on demand.
- Admin pages are dynamic (they read cookies).
- `"use client"` only where needed: header, motion primitives, forms, hero/galaxy, admin editors/shell.

## Recipes

**Add a public page**: create `src/app/(site)/<route>/page.tsx` with `metadata` (title, description, `alternates.canonical`), start with `<PageHero>`, build sections inside `CONTAINER`, end with `<FinalCta />`, add to `sitemap.ts`, and to `NAV` or the footer `COLUMNS` if it needs a link.

**Add a nav item**: edit `NAV` in `src/lib/site.ts` (header + mobile menu) and `COLUMNS` in `Footer.tsx`.

**Change a colour**: edit the variable in `:root` in `globals.css`; never hard-code. Update `02-color.md`.

**Environment**: see `.env.example` — `NEXT_PUBLIC_API_URL`, `ADMIN_PASSWORD`, `ADMIN_SESSION_SECRET`, later `DATABASE_URL`.
