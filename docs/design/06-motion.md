# 06 · Motion

Libraries: **motion** (`motion/react`) for component animation, **Lenis** for smooth scrolling (public site only), CSS keyframes for ambient loops, **react-three-fiber** for the hero galaxy.

## Principles

- **Slow and confident.** Things glide in and settle; nothing bounces or wobbles.
- **One curve.** `EASE = [0.16, 1, 0.3, 1]` (expo-out) from `src/components/Motion.tsx`. CSS equivalent `cubic-bezier(0.16, 1, 0.3, 1)`.
- **Animate once.** Scroll reveals run the first time an element enters view (`viewport: { once: true }`).
- **Ambient = very slow.** Orbits take 24–40s per turn, the marquee 45s.
- **Respect reduced motion.** Lenis is disabled; `.marquee`, `.scroll-cue`, `.orbit-spin` stop. Don't add new infinite animations without adding them to the `prefers-reduced-motion` block in `globals.css`.

## Durations

| Use | Duration |
|---|---|
| Hover colour/border | 0.2–0.3s (`transition-colors`) |
| Arrow chip rotate, icon tilt, card image scale | 0.5s (`duration-500`) |
| Underline draw-in | 0.7s (`duration-700`) |
| Reveal (fade + 28px rise) | 1s |
| Headline line mask | 1.1s, stagger 0.09s |
| Meter fill / count-up | 1.6s / 2s |
| Header entrance | 1s, delay 0.1s |
| Mobile menu items | 0.6s, stagger 45ms |

## Primitives (`src/components/Motion.tsx`)

| Component | What it does | Notes |
|---|---|---|
| `<Reveal delay y className>` | Fades and lifts a block in on scroll | Stagger siblings with `delay={i * 0.08}` (cards) or `0.06` (lists) |
| `<MaskLines lines as onMount delay>` | Each headline line slides up from behind a clip mask | One array item per visual line. Use `onMount` for above-the-fold h1s |
| `<Magnetic strength>` | Pulls the child toward the mouse | Primary CTAs only; mouse only, ignores touch |
| `<Spotlight>` | Sets `--mx/--my` for the `.spot` cursor glow | Wrap `.card`s |
| `<CountUp to suffix>` | Number counts up once; screen readers get the final value | Stats |
| `<Meter label value>` | Gradient bar fills to value% | `role="meter"` |

## Signature interactions

- **Arrow chips** rotate 45° (↗ becomes →) and fill violet on hover.
- **Header nav pill** slides between items (shared `layoutId`, spring).
- **Scroll progress beam** under the header.
- **Gradient underline** draws in from the left under hairline-grid cells.
- **Cursor spotlight** on cards.
- **Galaxy parallax**: the hero WebGL scene follows the pointer slightly; inner stars orbit faster (differential rotation).

## Smooth scrolling

`src/components/SmoothScroll.tsx` wraps the public site. Helpers:

- `scrollToTarget("#id")` — Lenis-aware anchor scroll (offset −96px for the header).
- `scrollToTop()` — used by the footer button.
- `setScrollLocked(bool)` — stops/starts Lenis and toggles `overflow: hidden` (mobile menu).
- Overlays that need their own scrolling get `data-lenis-prevent`.

The admin dashboard does **not** use Lenis or reveal animations — it's a tool; things should appear instantly.
