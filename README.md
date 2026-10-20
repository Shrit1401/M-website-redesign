# Farasha POS Solutions — website

Marketing site for [Farasha POS Solutions](https://farashapos.com), built to the
Farasha POS Solutions Brand Guidelines (2026).

**Brand idea — One order. Every screen.** Self-order, front counter and kitchen working from one
menu, one order stream and one source of truth. Positioning line: *From first tap to final plate.*

## Pages

| Route | What's on it |
| --- | --- |
| `/` | Hero (butterfly flies inside the hero circle), brand idea, photography, links into every page, pilot teaser, CTA |
| `/apps` | Scroll-driven kiosk → counter → kitchen walkthrough, then a deep-dive per app (register, kiosk, KDS, online, Back Office), offline states |
| `/features` | Feature grid, promotions & loyalty, staff roles, why Farasha |
| `/pilot` | 90-day pilot: timeline, success goals, what we need, pricing FAQ (copy from farashapos.com/pilot) |
| `/faq` | Product & setup, pilot & pricing |
| `/request-quote` | Quote form: locations, devices per location (live totals), products, hardware, current system, timeline |
| `/contact` | Owned by Nebula Webtech LLC: phone, emails, address, hours + contact form |

Forms validate in the browser and again in `app/api/quote` / `app/api/contact` (shared rules in `lib/forms.js`).
Delivery uses Resend when `RESEND_API_KEY` is set (see `.env.example`); without it, `next dev` prints
submissions to the terminal and production returns an error, so nobody is told "sent" when nothing was.

- Copy lives in `lib/content.js`; tokens in `app/globals.css`. Respects `prefers-reduced-motion`.
- Palette: Deep Forest `#03251B`, Farasha Green `#049952`, Wing Mint `#57E197`, Mist `#AEF7DB`.

## Run

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build in .next/
npm start
```

Stack: Next.js 16 (App Router), React 19, motion, lenis.
