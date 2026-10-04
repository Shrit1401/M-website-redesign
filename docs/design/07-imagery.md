# 07 · Imagery & atmosphere

The site has almost no photography. Its "imagery" is a set of space-inspired layers drawn in CSS and WebGL. They are always **decorative** (`aria-hidden`, `pointer-events-none`) and sit **behind** content at negative z inside an `isolate` parent.

## Layers

| Layer | How | Where | Opacity |
|---|---|---|---|
| **Galaxy** | `NebulaScene.tsx` — react-three-fiber point cloud with a custom shader: spiral arms, pink-white core (`#ffe6f8` → `#f06ac8` → `#6b3cf0`), blue stars `#8fd8ff`, differential rotation, pointer parallax. Seeded PRNG, so the shape is identical every visit. Loaded with `dynamic(..., { ssr: false })` and faded in over 2.4s. | Home hero only | 100% |
| **Hero atmosphere** | `.hero-bg` radial gradients | Behind the galaxy; fallback when WebGL is unavailable | — |
| **Nebula wash** | `.nebula-wash` — pink glow top-right, violet glow right, brand-violet glow top-left | Page heroes, CTA panel, header dropdown tile, mobile menu, login, cards in admin | 60–100% |
| **Starfield** | `.starfield` — eight 1–1.5px radial dots tiled at 420px (white, lavender `#c9b0ff`, blue) | Heroes, footer, CTA, covers, admin sidebar | 25–80% |
| **Orbit rings** | Bordered circles/ellipses (`border-white/[0.07]`, `border-violet/15`) with `.orbit-spin` and a glowing violet "moon" dot on the edge | PageHero (right), FinalCta, Services dropdown, login, empty states | — |
| **Planet horizon** | Huge `rounded-full` with only `border-t border-violet/40` + violet/pink upward glow | Footer | — |
| **Film grain** | SVG turbulence on `body::after`, 6% | Everywhere | 6% |

The orbit motif comes straight from the logo (planet + ring). When you need decoration, reach for an orbit ring before anything else.

### Orbit recipe

```tsx
<div aria-hidden className="pointer-events-none absolute … aspect-square w-[46rem]">
  <div className="orbit-spin absolute inset-0 rounded-full border border-white/[0.07]" />
  <div className="absolute inset-[18%] rounded-full border border-violet/15" />
  <div className="orbit-spin absolute inset-0 [animation-duration:24s]">
    <span className="absolute top-1/2 -left-1.5 size-3 rounded-full bg-violet shadow-[0_0_20px_4px_rgb(166_123_255/0.7)]" />
  </div>
</div>
```

The moon must sit on the **edge** of the spinning element — a centred dot doesn't visibly move.

## Generated covers

Projects and posts without a cover image get generated art from `<Cover seed={slug} />` (`src/components/Content.tsx`):

- A seeded PRNG (FNV hash of the slug → mulberry32) picks one of four brand glow pairs, a glow position, an orbit size and tilt.
- Layers: two radial glows → starfield → tilted elliptical orbit with a white glowing moon → a soft pink-white "star" at the glow centre.
- Stable: the same slug always produces the same artwork, on the server and in the admin preview.
- Changing a slug changes its art — expected.

## Photos & screenshots

When a project or post has a real image (`coverImage`):

- Use landscape images, at least 1600px wide; 4:3 works for project cards, 16:9–21:9 for detail pages (it's cropped with `object-cover`).
- Dark or neutral screenshots sit best on the page; bright white screenshots are fine inside the `p-2` card frame.
- Put files in `public/images/…` and reference `/images/…`, or use an `https://` URL.
- Images are plain `<img>` (not `next/image`) because admin URLs can point at any host. Always `loading="lazy"`.
- Never use stock photos of people "working on laptops", generic tech imagery or AI art that imitates a real client's brand.
