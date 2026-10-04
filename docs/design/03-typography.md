# 03 · Typography

## Fonts

Loaded with `next/font/google` in `src/app/layout.tsx`:

| Role | Font | CSS var | Tailwind | Notes |
|---|---|---|---|---|
| Everything | **Urbanist** (variable) | `--font-urbanist` | `font-sans` (default) | Geometric, closest Google font to the wordmark |
| Accent | **Instrument Serif** 400, normal + italic | `--font-serif` | `font-serif` | Only italic, only for accents, big numerals and quotes |

No other fonts. Code in the admin editor uses the system `font-mono`.

## Scale

Headings use fluid `clamp()` sizes, **tight tracking** and **tight leading**. Copy these classes exactly.

| Role | Classes | Used in |
|---|---|---|
| Hero h1 (home) | `text-[clamp(2.8rem,6.4vw,6rem)] leading-[0.95] font-semibold tracking-[-0.04em]` | `Hero.tsx` |
| Page h1 | `text-[clamp(2.6rem,6vw,5.4rem)] leading-[0.98] font-semibold tracking-[-0.04em]` | `PageHero` |
| Article h1 | `text-[clamp(2.2rem,5vw,4.2rem)] leading-[1.02] font-semibold tracking-[-0.04em]` | `blog/[slug]` |
| Section h2 | `text-[clamp(2.2rem,4.6vw,4rem)] leading-[1] font-semibold tracking-[-0.04em]` | `SectionHead` |
| CTA h2 | `text-[clamp(2.3rem,5.4vw,4.8rem)] leading-[1] …` | `FinalCta` |
| Group h2 | `text-[clamp(1.8rem,3.4vw,2.8rem)] leading-[1.05] tracking-[-0.035em]` | Projects stage groups |
| Lead paragraph | `text-[clamp(1.7rem,3.2vw,2.75rem)] leading-[1.18] font-medium tracking-[-0.025em]` | Home "About" statement |
| Card h3 | `text-2xl font-semibold tracking-tight` (`text-xl` small cards) | Service/project cards |
| Intro | `text-lg leading-relaxed text-ink-soft` | Under headlines, max `max-w-2xl` |
| Body | `leading-relaxed text-ink-soft` (16px) | Paragraphs |
| Small | `text-sm leading-relaxed text-ink-soft` | Card bodies, footer |
| Meta | `text-xs tracking-[0.16em] text-muted uppercase` | Dates, read time, service on cards |
| Label | `text-xs font-semibold tracking-[0.2em] text-muted uppercase` | Footer column titles, panel titles |
| Eyebrow | `.eyebrow` (0.75rem, 600, 0.24em, uppercase, violet, with a 1.5rem gradient line before) | Above every section headline |

Rules:
- Headlines are `font-semibold` (600). Never bold 700 except the decorative footer wordmark / 404.
- Negative tracking grows with size: `-0.02em` (≈24px) → `-0.04em` (≥48px).
- Body text never exceeds ~70ch: `max-w-2xl` or `max-w-3xl`.
- Numbers in stats/tables: `tabular-nums`.

## The Accent pattern

```tsx
import { Accent } from "@/components/Sections";
lines={["Ready to boost your", <>online <Accent>presence?</Accent></>]}
```

`<Accent>` = `nebula-text font-serif font-normal italic tracking-[-0.01em] pr-[0.06em]`. The right padding stops the italic's last glyph being clipped by `background-clip: text`.

- One per headline, at the end, 1–2 words, usually including the final punctuation.
- Don't use in body copy, buttons or nav.

## Serif elsewhere

- **Big index numerals**: `font-serif text-4xl text-white/15 italic` — "01", "02" on service cards and project groups.
- **Quotes**: `font-serif italic text-[clamp(1.9rem,4.2vw,3.6rem)] leading-[1.12]` (home statement), `blockquote` in `.prose-nebula`.
- **Footer tagline** and **mobile menu numbers**.

## Long-form (`.prose-nebula`)

Defined in `globals.css` for legal pages and admin-written markdown (projects, posts): h2 1.5rem/600, h3 1.2rem, h4 small-caps violet, paragraphs 1.0625rem/1.8 `ink-soft`, `ul` with glowing violet dots, `ol` with serif-italic `01` counters, violet underlined links, serif-italic blockquote with a violet left rule, code chips, rounded images, gradient `hr`, simple tables. Wrap in `max-w-3xl`.
