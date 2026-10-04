# Nebula Webtech — Design Language

The source of truth for how nebulawebtech.com looks, moves and is built. Written for designers, developers **and AI agents**: each file stands on its own, names the exact tokens, classes and files, and says what to do *and* what not to do.

> **If you are an agent:** read this page, then the file for the area you're touching. Before writing Next.js code, also read `AGENTS.md` (this repo runs Next.js 16 — APIs differ from older versions).

## The idea in one paragraph

Nebula Webtech's logo is an orbit — a planet with a ring around it. The site turns that into a **deep-space** world: near-black violet backgrounds, soft nebula glows in violet and pink, faint star fields, and thin orbit rings that slowly turn. On top of that atmosphere sits **calm, confident type** (Urbanist, tight tracking) with a single **serif-italic accent word** per headline (Instrument Serif in a violet→pink gradient). Motion is slow and eased, never bouncy. Everything is dark-mode only.

## Files

| # | File | What's in it |
|---|---|---|
| 01 | [Brand & voice](01-brand.md) | Name, logo usage, tagline, tone of voice, copy rules |
| 02 | [Color](02-color.md) | Every token in `globals.css`, when to use each, gradients, status colours |
| 03 | [Typography](03-typography.md) | Fonts, the type scale (with exact classes), the Accent pattern |
| 04 | [Layout & spacing](04-layout.md) | Container, grid patterns, section rhythm, radii, borders, elevation |
| 05 | [Components](05-components.md) | Header, footer, buttons, cards, heroes, section heads, content cards, forms |
| 06 | [Motion](06-motion.md) | Easing, durations, `Reveal`, `MaskLines`, `Magnetic`, reduced motion |
| 07 | [Imagery & atmosphere](07-imagery.md) | WebGL galaxy, star field, nebula wash, orbit rings, generated covers |
| 08 | [Admin dashboard](08-admin.md) | How `/admin` adapts the language for a working tool |
| 09 | [Content model](09-content-model.md) | Projects & blog posts: fields, rules, lifecycle, where they appear |
| 10 | [Architecture map](10-architecture.md) | Routes, folders, where each thing lives, how to add a page |

## Ten rules (the short version)

1. **Dark only.** Background is `bg` (`#07040f`). Never add a light theme or white sections.
2. **Use tokens, not hex.** `text-ink`, `text-ink-soft`, `text-muted`, `bg-surface`, `text-violet`… (see 02). The only raw hex allowed in components is `#12091f` (text on light buttons) and the error pinks already in `Forms.tsx`.
3. **One accent per headline.** Wrap one word or short phrase in `<Accent>` — serif italic, gradient. Never two.
4. **Hairlines, not boxes.** Borders are `border-white/[0.08]` (or `/10`). Separators are 1px. No heavy shadows except glows.
5. **Glow = violet.** Shadows that mean "this is alive" are violet/pink glows (`shadow-[0_0_20px_…rgb(166_123_255/…)]`), never grey drop shadows.
6. **Everything is rounded.** Pills (`rounded-full`) for buttons, chips and nav; `rounded-3xl` / `rounded-[2rem]` for panels; `.card` is `1.5rem`.
7. **Slow, eased motion.** `EASE = [0.16, 1, 0.3, 1]`, ~1s for reveals. Respect `prefers-reduced-motion`.
8. **Atmosphere stays behind.** Nebula wash, starfield and orbits are `aria-hidden`, `pointer-events-none`, `-z-10`. Copy must stay legible on top.
9. **Content lives in `src/lib/`** (static copy) or **`content/`** (admin-managed). Don't hard-code copy in components that is reused.
10. **Accessible by default.** Real headings in order, labelled controls, visible focus (`:focus-visible` violet outline), `sr-only` text for icon buttons.

## Quick reference

```tsx
// A standard section
<section className={`${CONTAINER} py-24 sm:py-32`}>
  <SectionHead
    eyebrow="Our services"
    lines={["Everything your site", <>needs to <Accent>shine.</Accent></>]}
    intro="One or two sentences."
    align="split"
  />
  <div className="mt-16 grid gap-4 lg:grid-cols-3">{/* .card items */}</div>
</section>
```

```tsx
// Primary CTA
<Link href="/contact-us" className="btn btn-primary btn-lg">
  Get started
  <span className="btn-arrow"><Icon name="arrowUpRight" className="size-4" /></span>
</Link>
```
