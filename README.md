# Macro Software Solution — website

Next.js 16 + Tailwind v4 + Three.js (react-three-fiber). Light-mode take on `Macro_Dark_Design.pdf` using the macrosoftwaresolution.com brand (blue `#0077B5`, Lexend).

```bash
npm install
npm run dev
```

- Content (services, engagements, FAQ): `src/lib/content.ts`
- 3D hero: `src/components/HeroScene.tsx`
- Forms → `POST /api/inquiry` (`src/app/api/inquiry/route.ts`). Set `INQUIRY_WEBHOOK_URL` (see `.env.example`) to forward submissions to Zapier/Make/Slack/CRM; otherwise they are logged to the server console.
- AI / answer-engine optimization: FAQPage + ProfessionalService JSON-LD (`src/app/page.tsx`), `robots.ts` allowing AI crawlers, `public/llms.txt`.
