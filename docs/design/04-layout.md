# 04 · Layout & spacing

## Container

```ts
// src/components/Sections.tsx
export const CONTAINER = "mx-auto w-full max-w-[1400px] px-5 sm:px-10";
```

Every section's content sits in `CONTAINER`. Header and footer use the same 1400px width so edges line up. Narrower reading columns add `max-w-3xl` / `max-w-4xl` on top. Admin uses `max-w-[1400px] px-5 sm:px-8`.

## Breakpoints

Tailwind defaults. What changes where:

| | < 640 (`sm`) | ≥ 768 (`md`) | ≥ 1024 (`lg`) | ≥ 1280 (`xl`) |
|---|---|---|---|---|
| Header | Logo + menu button | + "Start a project" from `sm` | Full nav, utility strip | — |
| Card grids | 1 col | 2 col | 3 col | — |
| Split heads | stacked | stacked | `lg:grid-cols-[1.2fr_0.8fr]` | — |
| Admin | top bar + drawer | — | 260px sidebar | editor side column 360px |

## Vertical rhythm

| Thing | Spacing |
|---|---|
| Standard section | `py-24 sm:py-32` |
| Section following a hero/section with its own bottom padding | `pb-24 sm:pb-32` |
| Page hero (`PageHero`) | `pt-36 pb-20 sm:pt-44 sm:pb-28` (clears the fixed header) |
| Eyebrow → headline | `mt-5`/`mt-6` |
| Headline → intro | `mt-6`–`mt-8` |
| Section head → grid | `mt-14`–`mt-16` |
| Grid gaps | `gap-4` for card grids, `gap-px` for hairline grids |

## Grid patterns

1. **Card grid** — `grid gap-4 md:grid-cols-2 lg:grid-cols-3` of `.card`s.
2. **Hairline grid** — cells joined by 1px lines: parent `grid gap-px overflow-hidden rounded-3xl border border-white/[0.08] bg-white/[0.08]`, children `bg-bg` (or `bg-bg-2`). Used by Process, service sub-items, footer contact deck, project meta.
3. **Asymmetric split** — `lg:grid-cols-[1.25fr_0.75fr]`, `[0.8fr_1.2fr]`, `[0.7fr_1.3fr]` with `lg:gap-16`–`24`. Sidebars use `lg:sticky lg:top-32 lg:self-start`.
4. **Header grid** — `grid-cols-[1fr_auto_1fr]` so the nav is truly centred.

## Radii

| Radius | Where |
|---|---|
| `rounded-full` | Buttons, chips, tags, nav capsule, icon buttons, status pills |
| `rounded-xl` / `rounded-2xl` | Icon tiles, dropdown items, admin panels, inputs (`.field` = 0.9rem) |
| `rounded-3xl` | Hairline grids, dropdown panel, info panels |
| `.card` = `1.5rem` | Cards |
| `rounded-[2rem]` | Big feature panels: Final CTA, quote form, footer contact deck, empty states |
| Inner media | `rounded-[1.1rem]`–`[1.25rem]` inside a `p-2` card (nested radius = outer − padding) |

## Borders & elevation

- Default border: `border border-white/[0.08]`; hover: `hover:border-violet/40`.
- Glass (header when scrolled, dropdowns, mobile menu): `bg-bg/75 backdrop-blur-xl border-white/[0.08]` + `shadow-[0_20px_50px_-30px_rgba(0,0,0,0.9)]`.
- Lift shadow for floating panels: `shadow-[0_30px_60px_-20px_rgba(0,0,0,0.9)]`.
- Emphasis glow: `shadow-[0_0_30px_-6px_rgb(166_123_255/0.6)]`.
- Film grain (`body::after`) sits over everything at 6% to stop gradient banding. Don't remove it.

## Z-index

| z | Layer |
|---|---|
| `-z-20`, `-z-10` | Atmosphere inside an `isolate` section |
| `z-30` | Admin sticky save bar |
| `z-40` | Admin sidebar; mobile menu overlay (inside header) |
| `z-50` | Header; header main bar above its own overlay; admin drawer |
| `z-[60]` | Skip link |
| `100` | Film grain (pointer-events none) |

Always add `isolate` to a section that places atmosphere at negative z.
