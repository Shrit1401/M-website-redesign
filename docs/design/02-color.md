# 02 · Color

Defined once in `src/app/globals.css` as CSS variables on `:root`, then exposed to Tailwind v4 through `@theme inline` — so every token works as `bg-*`, `text-*`, `border-*`, `from-*`, etc., including opacity modifiers (`bg-violet/15`).

The palette is built from the brand violet **#49226D** pushed into deep space.

## Tokens

### Backgrounds & surfaces (darkest → lightest)

| Token | Hex | Tailwind | Use |
|---|---|---|---|
| `--bg` | `#07040f` | `bg-bg` | Page background, `<body>`, theme-color |
| `--bg-2` | `#0d0819` | `bg-bg-2` | Footer, admin sidebar — one step up |
| `--surface` | `#120c22` | `bg-surface` | Panels, dropdowns, CTA box, admin panels (`bg-surface/70`) |
| `--surface-2` | `#181030` | `bg-surface-2` | Rare: nested surface on a surface |

### Text

| Token | Hex | Tailwind | Use |
|---|---|---|---|
| `--ink` | `#f5f1ff` | `text-ink` | Headings, primary text, active nav |
| `--ink-soft` | `#cdc4e3` | `text-ink-soft` | Body copy, nav links, descriptions |
| `--muted` | `#9488b0` | `text-muted` | Meta, labels, eyebrow-like small caps, placeholders' cousin |
| placeholder | `#6f6488` | — | `.field::placeholder` only |

Contrast: `ink` and `ink-soft` pass WCAG AA on `bg`/`surface`. `muted` passes AA for text ≥ 14px on `bg`. Don't put `muted` on `surface-2`.

### Lines

| Token | Value | Tailwind | Use |
|---|---|---|---|
| `--line` | `rgb(255 255 255 / 0.08)` | `border-line` or `border-white/[0.08]` | Default hairline |
| `--line-strong` | `rgb(255 255 255 / 0.16)` | `border-line-strong` | Inputs, outline buttons |

In practice components use `border-white/[0.06]` (section dividers), `/[0.08]` (cards, panels) and `/10` (chips, icon buttons). Stay in that 0.06–0.16 range.

### Brand & accent

| Token | Hex | Tailwind | Use |
|---|---|---|---|
| `--brand` | `#49226d` | `bg-brand` | The logo violet. Deep glows in `nebula-wash`/`hero-bg`. Rarely used flat. |
| `--violet` | `#a67bff` | `text-violet` | **The** accent: eyebrows, icons, active states, focus ring, links, selection |
| `--violet-600` | `#8b5cf6` | `from-violet-600` | Start of meter / progress gradients |
| `--pink` | `#f06ac8` | `to-pink` | Gradient end, hot core of glows |
| `--star` | `#8fd8ff` | `text-star` | Cool star sparkles in the galaxy & starfield. Accent only. |

### Status (UI state only — never decoration)

| Token | Hex | Tailwind | Meaning |
|---|---|---|---|
| `--signal` | `#6ee7b7` | `bg-signal` | Open now, Published, Launched |
| `--warn` | `#fbbf77` | `bg-warn` | In progress, Scheduled |
| `--danger` | `#ff7a9a` | `text-danger` | Errors, delete. Error text uses `#ff9db4`, error alert text `#ffc2d0` |

Project stages map to dots: **Launched** = signal, **In progress** = warn (pulsing), **Coming soon** = violet.

## Gradients

| Name | Definition | Where |
|---|---|---|
| Nebula text | `.nebula-text` — `linear-gradient(100deg, #c9b0ff, violet 35%, pink)` clipped to text | `<Accent>`, active mobile nav item |
| Beam | `bg-gradient-to-r from-violet-600 via-violet to-pink` | Meters, header scroll progress, hover underlines |
| Hover underline | `from-violet to-pink`, 1px, `scale-x-0 → 100` | Process steps, footer contact cells |
| Icon tile | `bg-gradient-to-br from-violet/25 to-pink/10` | Service icon squares |
| Nebula wash | `.nebula-wash` — three radial glows (pink top-right, violet right, brand top-left) | Page heroes, CTA, menus, login |
| Hero atmosphere | `.hero-bg` | Home hero behind WebGL |

## Do / don't

- ✅ `text-violet` for one accent element per component (icon, eyebrow, link).
- ✅ Opacity variants of tokens: `bg-violet/15`, `border-violet/40` on hover.
- ❌ New hues (green/blue/orange) for decoration. Status tokens are only for status.
- ❌ Pure white backgrounds. The only near-white fill is `.btn-primary` (`#f1eaff`).
- ❌ Hard-coded hex in components (except `#12091f` for dark text on light/violet fills).
- ❌ Grey `shadow-lg`. Use `shadow-[0_20px_50px_-20px_rgba(0,0,0,0.8)]` for lift and violet glows for emphasis.
