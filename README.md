# Farasha POS Solutions — website

Marketing site for [Farasha POS Solutions](https://farashapos.com), built to the
Farasha POS Solutions Brand Guidelines (2026).

**Brand idea — One order. Every screen.** Self-order, front counter and kitchen working from one
menu, one order stream and one source of truth. Positioning line: *From first tap to final plate.*

- **Leaf butterfly** — the two leaf-wings from the Arabic emblem, traced as SVG and animated
  (`src/components/Butterfly.jsx`). It flies through the hero and carries an order between apps.
- **Three apps. One service.** — scroll-driven walkthrough where order #1042 moves from the
  self-order kiosk to the counter POS to the kitchen display (`src/components/Journey.jsx`).
- **Calm in the rush** — live offline → queued → syncing → synced status demo, written in the brand voice.
- Official assets only: emblem, wordmark and favicons from the logo kit in `public/brand` and `public/`;
  photography from the guidelines in `public/images`.
- Palette: Deep Forest `#03251B`, Farasha Green `#049952`, Wing Mint `#57E197`, Mist `#AEF7DB`.
  Type: Segoe UI (falls back to the platform sans), light display, semibold tracked labels.
- Copy lives in `src/content.js`; tokens in `src/styles.css`. Respects `prefers-reduced-motion`.

## Run

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # outputs dist/
```

Stack: Vite, React 19, motion, lenis.
