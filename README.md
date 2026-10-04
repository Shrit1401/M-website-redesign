# Nebula Webtech LLC — website

A frontend-only redesign of [nebulawebtech.com](https://nebulawebtech.com), built with Next.js. There is no backend yet: the forms POST to `/api/*` routes that don't exist yet.

The plan for adding Prisma + PostgreSQL is in [`docs/nextjs-prisma/`](docs/nextjs-prisma/README.md).

**Design language:** [`docs/design/`](docs/design/README.md) documents the colors, type, layout, components, motion, imagery, admin UI, content model and file map — start there before changing anything visual.

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build in .next/
npm start        # serve the production build
```

## Pages

All on the same URLs as the WordPress site.

| Route | Notes |
| --- | --- |
| `/` | WebGL galaxy hero (echoes the orbital logo), about + stats, services, process, why us, CTA |
| `/about` | Copy from the live About page |
| `/services`, `/services/[slug]` | Web design & development, web maintenance, digital marketing — each with a quote form |
| `/contact-us` | Address, phone, email, hours + contact form |
| `/make-a-payment` | Invoice payment form (Stripe-ready, see `docs/nextjs-prisma/04-payments.md`) |
| `/projects`, `/projects/[slug]` | Portfolio managed in `/admin`: launched, in progress and coming-soon projects |
| `/blog`, `/blog/[slug]` | Blog managed in `/admin`, with scheduled posts |
| `/privacy-policy`, `/terms-and-conditions` | Text from the live site |
| `/admin` | Content dashboard (password in `ADMIN_PASSWORD`, see `.env.example`) |

## Admin dashboard

```bash
cp .env.example .env.local   # set ADMIN_PASSWORD
npm run dev                  # http://localhost:3000/admin
```

Projects and posts are saved to `content/*.json` (committed). That needs a writable disk, so it works with `next dev` and `next start`, but not on Vercel; see [`docs/nextjs-prisma/06-admin-content.md`](docs/nextjs-prisma/06-admin-content.md) to move them to Postgres.

## Where things live

- Content: `src/lib/site.ts` (business info, about, stats, process), `src/lib/services.ts`, `src/lib/legal.ts`
- Managed content: `content/*.json`, schema in `src/lib/content/schema.ts`, store in `src/lib/content/store.ts`
- Admin: `src/app/admin/` (pages + Server Actions), `src/components/admin/`, auth in `src/lib/admin/` and `src/proxy.ts`
- **Backend contract:** `src/lib/contracts.ts` (payload types, enum values, validators shared with the future backend) and `src/lib/api.ts` (browser client)
- Forms: `src/components/Forms.tsx` (contact, newsletter, payment)
- 3D hero: `src/components/NebulaScene.tsx` (react-three-fiber, custom point shader)
- Brand: deep-space dark theme from the Nebula violet `#49226D`, Urbanist + Instrument Serif; official logo in `public/`

## Content to confirm with the client

- The live testimonials, process steps and blog were lorem ipsum. The blog and projects now start empty and are filled from `/admin`. Testimonials were left out (no invented quotes), and the process steps were rewritten.
- The live Maintenance and Marketing pages repeated the Web Design copy, so service-specific copy was written for both.
- Stats kept from the live site: 100% customer satisfaction, 250+ organic search traffic. "8778 Million visitor growth" was dropped.

Stack: Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4, motion, Lenis, three.js / react-three-fiber, marked.
