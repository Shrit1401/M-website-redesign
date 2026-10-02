# Nebula Webtech LLC — website

A frontend-only redesign of [nebulawebtech.com](https://nebulawebtech.com), built with Next.js. There is no backend yet: the forms POST to `/api/*` routes that don't exist yet.

The plan for adding Prisma + PostgreSQL is in [`docs/nextjs-prisma/`](docs/nextjs-prisma/README.md).

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
| `/privacy-policy`, `/terms-and-conditions` | Text from the live site |

## Where things live

- Content: `src/lib/site.ts` (business info, about, stats, process), `src/lib/services.ts`, `src/lib/legal.ts`
- **Backend contract:** `src/lib/contracts.ts` (payload types, enum values, validators shared with the future backend) and `src/lib/api.ts` (browser client)
- Forms: `src/components/Forms.tsx` (contact, newsletter, payment)
- 3D hero: `src/components/NebulaScene.tsx` (react-three-fiber, custom point shader)
- Brand: deep-space dark theme from the Nebula violet `#49226D`, Urbanist + Instrument Serif; official logo in `public/`

## Content to confirm with the client

- The live testimonials, process steps and blog were lorem ipsum. Testimonials were left out (no invented quotes), and the process steps were rewritten.
- The live Maintenance and Marketing pages repeated the Web Design copy, so service-specific copy was written for both.
- Stats kept from the live site: 100% customer satisfaction, 250+ organic search traffic. "8778 Million visitor growth" was dropped.

Stack: Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4, motion, Lenis, three.js / react-three-fiber.
