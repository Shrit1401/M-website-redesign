# Macro Software Solution — website

Next.js 16 + Tailwind v4 + Three.js (react-three-fiber). Light-mode redesign of macrosoftwaresolution.com using the official logo and brand (blue `#0077B5`, Lexend + Instrument Serif).

```bash
npm install
npm run dev
```

## Pages

| Route | Notes |
| --- | --- |
| `/` | 3D refractive-glass hero, services, process, engagements (custom quote), FAQ preview |
| `/about` | Copy from the live About page |
| `/services`, `/services/[slug]` | 8 live services (copy from the live site) + AI optimization / AEO |
| `/blog`, `/blog/[slug]` | 8 articles for the live post titles (live posts were lorem ipsum) |
| `/careers` | Culture + introduce-yourself CTA |
| `/faq` | Grouped FAQ with FAQPage schema |
| `/contact` | Contact details, requirement form + general inquiry. `?engagement=career\|hire\|modify\|unsure`, `?tab=inquiry`, `?topic=Careers` preselect the forms |

## Where things live

- Content: `src/lib/content.ts` (site info, nav, about, careers, FAQ), `src/lib/services.ts`, `src/lib/posts.ts`
- 3D hero: `src/components/HeroScene.tsx`
- Forms → `POST /api/inquiry`. Set `INQUIRY_WEBHOOK_URL` (see `.env.example`) to forward submissions to Zapier/Make/Slack/CRM; otherwise they're logged on the server.
- Old WordPress URLs (`/about-us`, `/contact-us`, `/saas-product-development`, blog post slugs, …) permanently redirect to the new routes (`next.config.ts`).
- AI / answer-engine optimization: Organization, Service, BlogPosting, Breadcrumb and FAQPage JSON-LD, `robots.ts` allowing AI crawlers, `sitemap.ts`, `public/llms.txt`.
