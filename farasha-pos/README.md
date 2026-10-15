# Farasha POS — marketing site

A minimal, motion-led landing page for [Farasha POS](https://farashapos.com) — *farāsha* (فراشة) is Arabic for butterfly.

**Concept — four wings, one body.** The four ways guests order (counter, kiosk, kitchen display, online) are the four wings; Farasha is the body that keeps them moving together.

- WebGL particle butterfly in the hero (Temple Fay's butterfly curve, shader wing-flap, pointer parallax, dissolves into dust on scroll) — `src/components/ButterflyScene.jsx`
- Vector four-wing butterfly that lights up wing-by-wing as you scroll the channels — `src/components/WingButterfly.jsx`
- Motion primitives borrowed from the Nebula design language (`EASE`, `Reveal`, `MaskLines`, `Magnetic`, scroll-scrubbed text) — `src/components/Motion.jsx`
- All copy lives in `src/content.js`; colour tokens in `src/styles.css`
- Lenis smooth scroll; `prefers-reduced-motion` respected; WebGL falls back to the SVG butterfly

## Run

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # outputs dist/
```

Stack: Vite, React 19, motion, lenis, three + @react-three/fiber.
