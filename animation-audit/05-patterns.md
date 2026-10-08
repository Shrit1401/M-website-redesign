# 05 — Animation Patterns & Recipes

Each recipe uses compositor-friendly properties and respects reduced motion. Tokens (`--dur-*`, `--ease-*`) come from [01-principles.md](01-principles.md).

## Buttons & links

```css
.btn {
  transition:
    background-color var(--dur-fast) var(--ease-out),
    transform var(--dur-instant) var(--ease-out);
}
.btn:hover { background-color: var(--btn-hover); }
.btn:active { transform: scale(0.97); }
.btn:focus-visible { outline: 2px solid var(--focus); outline-offset: 2px; } /* never animate the focus ring away */
```

- Animated underline: scale a pseudo-element from `scaleX(0)` to `scaleX(1)` with `transform-origin: left`.
- Do not change `font-weight` on hover. It reflows the text.

## Entrance on page load

```css
@media (prefers-reduced-motion: no-preference) {
  .hero-title { animation: rise 500ms var(--ease-out) both; }
  .hero-sub   { animation: rise 500ms var(--ease-out) 80ms both; }
  .hero-cta   { animation: rise 500ms var(--ease-out) 160ms both; }
}
@keyframes rise { from { opacity: 0; transform: translateY(16px); } }
```

- Keep the LCP element visible at first paint: animate its `transform`, not its `opacity`, or skip it.
- The whole sequence should finish within **about 800 ms**.

## Scroll reveal

**Preferred: CSS scroll-driven animations** (no JS, runs off the main thread).

```css
@media (prefers-reduced-motion: no-preference) {
  @supports (animation-timeline: view()) {
    .reveal {
      animation: rise linear both;
      animation-timeline: view();
      animation-range: entry 0% entry 40%;
    }
  }
}
```

**Fallback: IntersectionObserver**

```js
const io = new IntersectionObserver((entries) => {
  for (const e of entries) if (e.isIntersecting) {
    e.target.classList.add('is-visible');
    io.unobserve(e.target);           // animate once, don't replay every scroll
  }
}, { rootMargin: '0px 0px -10% 0px' });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));
```

```css
.js .reveal { opacity: 0; transform: translateY(16px); transition: opacity .5s var(--ease-out), transform .5s var(--ease-out); }
.js .reveal.is-visible { opacity: 1; transform: none; }
```

- Only hide content when JS is running: add the `.js` class to `<html>` from an inline script. Without JS, content stays visible.
- Do not reveal **every** paragraph. Reveal sections, not each line.
- Animate once. Content that animates out and back in on every scroll is tiring.

## Page / route transitions

**View Transitions API** (works for both SPAs and multi-page apps):

```css
/* MPA: opt in on both pages */
@view-transition { navigation: auto; }

::view-transition-old(root) { animation: fade-out 150ms var(--ease-in) both; }
::view-transition-new(root) { animation: fade-in 250ms var(--ease-out) both; }

/* Shared element morph */
.product-image { view-transition-name: product-hero; }

@media (prefers-reduced-motion: reduce) {
  ::view-transition-group(*), ::view-transition-old(*), ::view-transition-new(*) { animation: none !important; }
}
```

```js
// SPA
if (!document.startViewTransition) updateDOM();
else document.startViewTransition(() => updateDOM());
```

- Keep the total under about 400 ms.
- Each `view-transition-name` must be unique on the page.

## Modal / dialog

```css
dialog {
  opacity: 0; transform: scale(.96);
  transition: opacity var(--dur-base) var(--ease-out), transform var(--dur-base) var(--ease-out),
              overlay var(--dur-base) allow-discrete, display var(--dur-base) allow-discrete;
}
dialog[open] { opacity: 1; transform: none; }
@starting-style { dialog[open] { opacity: 0; transform: scale(.96); } }
dialog::backdrop { background: rgb(0 0 0 / 0); transition: background var(--dur-base); }
dialog[open]::backdrop { background: rgb(0 0 0 / .5); }
@starting-style { dialog[open]::backdrop { background: rgb(0 0 0 / 0); } }
```

- `@starting-style` plus `allow-discrete` gives CSS-only enter and exit animations for `display: none` elements.
- Move focus into the dialog right away. Do not wait for the animation to finish.

## Accordion / expand-collapse

```css
.panel { display: grid; grid-template-rows: 0fr; transition: grid-template-rows var(--dur-base) var(--ease-in-out); }
.panel > .inner { overflow: hidden; }
.panel[data-open] { grid-template-rows: 1fr; }
```
Or, in supporting browsers: `:root { interpolate-size: allow-keywords; }` and transition `height: 0 → auto`.
Using `<details>` with `::details-content` is the native option.

## Lists: add, remove, reorder

- **Add:** fade + scale from 0.98, or a short height expand.
- **Remove:** fade out first, then collapse the height, so the remaining items slide up instead of jumping.
- **Reorder:** use FLIP (Motion `layout`, GSAP Flip, or `view-transition-name` per item).

## Loading states

| Wait time | Show |
|---|---|
| < 300 ms | Nothing (avoid a spinner flash) |
| 300 ms – 2 s | Spinner or button loading state |
| > 2 s, known layout | Skeleton screen |
| > 5 s or measurable | Progress bar with a percentage |

- Skeleton shimmer: animate `transform` on a gradient pseudo-element, not `background-position`.
- Always pair a loader with `role="status"` text.
- When content arrives, crossfade it in instead of letting it pop.

## Carousels / marquees

- Prefer **no autoplay**. If it autoplays: provide a pause button, pause on hover/focus, never autoplay under reduced motion, and wait at least 5 s per slide.
- Marquees: animate `transform: translateX`, duplicate the content for a seamless loop, `aria-hidden` the duplicate, and add a pause control.

## Toasts / notifications

- Slide 8–16 px from the edge they live on, plus a fade, in about 200 ms.
- Exit faster than they enter.
- Pause the auto-dismiss timer on hover/focus. Announce toasts with `role="status"` or `aria-live`.

## Hover on cards / images

- Lift: `translateY(-2px to -4px)` plus a shadow-opacity crossfade (see [03](03-performance.md)).
- Image zoom: `scale(1.03–1.06)` inside `overflow: hidden`, over 300–500 ms with ease-out.
- On touch devices, hover does not exist. Wrap hover-only effects in `@media (hover: hover) and (pointer: fine)`.

## Parallax (use sparingly)

- Use CSS scroll-driven animations (`animation-timeline: scroll()`) or `transform` only, never `background-attachment: fixed` (bad performance on mobile).
- Use small speed differences (0.9–1.1×).
- Turn it off under reduced motion.

## Number counters / charts

- Count-up animations should take 600–1200 ms with ease-out, and the final number must be in the DOM for screen readers (`aria-label` with the final value).
- Charts: draw lines with `stroke-dashoffset` and grow bars with `scaleY` from the baseline, once.
