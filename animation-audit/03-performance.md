# 03 — Animation Performance

## The frame budget

| Display | Frame budget | Realistic budget for your JS + style + layout |
|---|---|---|
| 60 Hz | 16.7 ms | ~10 ms (the browser needs the rest) |
| 90 Hz | 11.1 ms | ~6 ms |
| 120 Hz | 8.3 ms | ~4 ms |

If a frame misses the budget, it is dropped and the animation **janks**. Test on mid-range phones, not only on a fast laptop.

## The rendering pipeline

```
JavaScript → Style → Layout → Paint → Composite
```

How much of the pipeline an animated property triggers decides how expensive it is:

| Tier | Properties | Cost |
|---|---|---|
| **Composite only** (cheap, can run off the main thread) | `transform` (`translate`, `scale`, `rotate`), `opacity`, `filter`*, `backdrop-filter`* | ✅ Use these |
| **Paint** (repaints pixels every frame) | `color`, `background-color`, `box-shadow`, `border-radius`, `outline`, `background-position`, `clip-path`** | ⚠️ OK for small elements or short durations |
| **Layout** (reflows the page every frame) | `width`, `height`, `top`, `left`, `right`, `bottom`, `margin`, `padding`, `border-width`, `font-size`, `line-height`, `gap`, `grid-template-*`, `inset`, `max-height` | ❌ Avoid animating |

\* `filter` and `backdrop-filter` can be composited, but blur is expensive on large areas, especially on mobile GPUs.
\** Some browsers now composite `clip-path` animations, but you should not rely on it.

### Common fixes

| Instead of animating… | Animate… |
|---|---|
| `left` / `top` | `transform: translate()` |
| `width` / `height` | `transform: scale()`, then counter-scale children, or use the FLIP technique |
| `box-shadow` growing on hover | `opacity` of a pseudo-element that already has the larger shadow |
| `max-height: 0 → 1000px` accordion | `grid-template-rows: 0fr → 1fr` (layout, but a single reflow and correct height), `interpolate-size: allow-keywords` + `height: auto`, or a measured FLIP |
| `background-position` gradient shimmer | `transform: translateX()` on a gradient pseudo-element |
| `margin` for a slide | `translate` |

### The shadow trick

```css
.card { position: relative; transition: transform var(--dur-fast) var(--ease-out); }
.card::after {
  content: ""; position: absolute; inset: 0; border-radius: inherit;
  box-shadow: 0 12px 32px rgb(0 0 0 / .18);
  opacity: 0; transition: opacity var(--dur-fast) var(--ease-out);
  pointer-events: none;
}
.card:hover { transform: translateY(-2px); }
.card:hover::after { opacity: 1; }
```

### FLIP (First, Last, Invert, Play)

To animate a layout change cheaply:
1. **First:** measure the element's rect.
2. Apply the layout change.
3. **Last:** measure the new rect.
4. **Invert:** apply a `transform` that puts the element back at the first position.
5. **Play:** animate the `transform` to `none`.

Motion's `layout` prop, GSAP Flip, and the View Transitions API all implement this for you.

## `will-change`

- `will-change: transform` promotes an element to its own GPU layer before the animation starts, which avoids a first-frame hitch.
- **Use it sparingly.** Each layer costs GPU memory, and dozens of layers make things slower, especially on mobile.
- Add it just before the animation (on hover of the parent, or from JS) and remove it afterwards. Do not leave `* { will-change: transform }` in your CSS.
- Elements that animate permanently, like a looping marquee, can keep it.

## `transition: all` is a bug waiting to happen

`transition: all` animates every property that changes, including layout properties you never meant to animate, and it does so whenever a class toggles. **Always list the exact properties**:

```css
/* ❌ */ .btn { transition: all .3s; }
/* ✅ */ .btn { transition: background-color var(--dur-fast), transform var(--dur-fast) var(--ease-out); }
```

## JavaScript animation rules

- Use `requestAnimationFrame`, never `setInterval`/`setTimeout`, for visual updates.
- **Do not read layout after writing styles in the same frame.** Reading `offsetHeight`, `getBoundingClientRect()`, or `scrollTop` after a style write forces a synchronous layout ("layout thrashing"). Batch all reads, then all writes.
- Use **`IntersectionObserver`** for scroll reveals, not `scroll` event listeners.
- If you must listen to `scroll`, make the listener `{ passive: true }` and do the work in rAF.
- Prefer **CSS scroll-driven animations** (`animation-timeline: view()` / `scroll()`). They run off the main thread.
- Prefer the **Web Animations API** (`element.animate()`) over hand-rolled rAF loops for simple tweens. It can run on the compositor.
- Pause animations that are off-screen or in hidden tabs. IntersectionObserver plus `animation-play-state: paused` handles off-screen animations, and rAF already stops in hidden tabs.

## Layout shift (CLS)

Animations must not cause **Cumulative Layout Shift**:
- Elements that "slide in" by changing their layout position, or content injected above existing content, shift the page.
- Animations that use `transform` do **not** count toward CLS.
- Reserve space for images, embeds, and lazy content (`width`/`height` attributes, `aspect-ratio`).
- Targets: **CLS ≤ 0.1** is good, and **> 0.25** is poor.

## Entrance animations vs. Core Web Vitals

- **LCP:** a hero image or headline that starts at `opacity: 0` and fades in delays Largest Contentful Paint. Keep the LCP element visible from the first paint, or animate only `transform` on it.
- **INP:** heavy JS animation work on click delays the next paint. Keep interaction handlers light and start the animation in the next frame.
- **Never hide all content until JS loads** with `body { opacity: 0 }` and a script that reveals it. If the JS fails or is slow, the page stays blank.

## Heavy media

- **Lottie:** prefer the `dotlottie` format and the canvas renderer for complex files, and keep files small. Pause it when off-screen.
- **Video backgrounds:** compress them heavily, use `muted playsinline`, provide a poster image, and do not autoplay them under reduced motion or `Save-Data`.
- **WebGL / three.js:** cap the device pixel ratio (`Math.min(devicePixelRatio, 2)`), stop the render loop when off-screen, and provide a static fallback.
- **GIFs:** replace them with `<video>`, which is 5–20× smaller.

## How to measure

### Chrome DevTools
1. **Performance panel:** set CPU to **4× or 6× slowdown**, record while triggering the animation, and look for:
   - Red bars or **dropped frames** in the Frames track.
   - Purple **Layout** and green **Paint** blocks repeating on every frame (you are animating non-composited properties).
   - Long tasks (> 50 ms) and long animation frames.
2. **Rendering drawer** (⋮ → More tools → Rendering):
   - *Paint flashing* shows green over areas repainting each frame. Composited animations should not flash.
   - *Layout shift regions* shows blue over shifting content.
   - *Frame rendering stats* shows a live FPS meter.
   - *Emulate CSS prefers-reduced-motion* lets you test reduced-motion mode.
3. **Layers panel:** count layers and check memory use. Too many layers means `will-change` is overused.
4. **Animations panel** (More tools → Animations): inspect, slow down, and replay every CSS/WAAPI animation and its timing.

### In code
```js
// Long animation frames (Chromium)
new PerformanceObserver(list => {
  for (const e of list.getEntries()) console.log('LoAF', e.duration, e.scripts);
}).observe({ type: 'long-animation-frame', buffered: true });

// Every animation currently on the page
document.getAnimations().forEach(a =>
  console.log(a.constructor.name, a.animationName ?? a.transitionProperty,
    a.effect.getComputedTiming().duration, a.effect.getKeyframes()));
```

### Targets

| Metric | Good | Needs work | Poor |
|---|---|---|---|
| Frames dropped during animation (6× CPU) | < 5% | 5–15% | > 15% |
| Long animation frames (> 50 ms) during an interaction | 0 | 1–2 | 3+ |
| CLS | ≤ 0.1 | ≤ 0.25 | > 0.25 |
| INP | ≤ 200 ms | ≤ 500 ms | > 500 ms |
| Composited layers on a page | < 30 | 30–80 | > 80 |
