# 04 — Motion Accessibility

Motion can trigger nausea, dizziness, migraines, and seizures. It also distracts people with attention or cognitive disabilities. Accessible motion is a legal and ethical requirement, not a polish item.

## Relevant WCAG criteria

| Criterion | Level | Requirement |
|---|---|---|
| **2.2.2 Pause, Stop, Hide** | A | Moving, blinking, or scrolling content that starts automatically, lasts more than 5 s, and is shown alongside other content needs a way to pause, stop, or hide it |
| **2.3.1 Three Flashes or Below Threshold** | A | Nothing flashes more than 3 times per second |
| **2.3.3 Animation from Interactions** | AAA | Motion triggered by interaction can be disabled unless it is essential. Treat this as the target even if you only aim for AA |
| **2.1.1 Keyboard** | A | Animated components such as carousels and menus remain fully keyboard operable |
| **2.4.7 / 2.4.11 Focus Visible / Not Obscured** | AA | Animations never hide the focus ring or move focused elements off-screen |
| **4.1.3 Status Messages** | AA | Loading or success states shown only through animation also need text for screen readers |

## `prefers-reduced-motion`

Users enable this setting in their OS (macOS: Accessibility → Display → Reduce motion; iOS; Windows: "Animation effects" off; Android: "Remove animations").

**Reduced motion does not mean no motion.** It means removing **large movement, parallax, zoom, spin, and auto-playing loops**. Keep:
- Opacity fades and color changes, which are short and calm.
- Essential feedback such as focus states and loading indicators. Make loaders calmer rather than removing them.

### Recommended pattern: motion as an opt-in enhancement

```css
/* Base: no movement */
.reveal { opacity: 1; }

@media (prefers-reduced-motion: no-preference) {
  .reveal { animation: rise var(--dur-base) var(--ease-out) both; }
}
```

### Global safety net (add to every project)

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```
Use `0.01ms` instead of `0` so that `animationend` and `transitionend` events still fire and JS waiting on them does not hang.

A safety net is a backstop, not a design. Still design proper reduced-motion alternatives for important animations, such as a crossfade in place of a slide.

### In JavaScript

```js
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)');
function animate() {
  if (reduceMotion.matches) return showInstantly();
  // ...
}
reduceMotion.addEventListener('change', () => { /* update running animations */ });
```

Libraries:
- **GSAP:** `gsap.matchMedia().add("(prefers-reduced-motion: no-preference)", () => { ... })`
- **Motion (Framer Motion):** `<MotionConfig reducedMotion="user">` or `useReducedMotion()`
- **Lenis / smooth scroll:** do not initialise it when reduced motion is on.
- **Lottie:** show a static frame (`goToAndStop`) when reduced motion is on.
- **Video:** do not autoplay, and show the poster image.

## What must change under reduced motion

| Effect | Reduced-motion behavior |
|---|---|
| Parallax | Off. Elements are static |
| Scroll-jacking / smooth-scroll libraries | Off. Use native scroll |
| Slide/zoom page transitions | Replace with a crossfade or an instant change |
| Scroll-triggered reveals | Content visible immediately, or a fade only |
| Autoplay carousels | Do not autoplay |
| Background video / animated hero | Static poster |
| Infinite marquees / tickers | Static, or paused with a play control |
| Spinners | Allowed, but slower and simpler, or a static "Loading…" text |
| Hover lift / scale | Keep only color/opacity changes |
| Confetti, particles, bouncing | Off |

## Pause controls (WCAG 2.2.2)

Anything that **auto-moves for more than 5 seconds** needs a visible, keyboard-accessible pause control. Examples are carousels, marquees, animated backgrounds, and looping hero videos.

```html
<button type="button" aria-pressed="false" class="motion-toggle">Pause animation</button>
```
- Place it near the content, focusable and labelled.
- Pausing on hover/focus is helpful, but it does not replace a pause button.
- Optionally, offer a site-wide "reduce motion" toggle that stores the preference and adds a class to `<html>`.

## Flashing

- Nothing flashes more than **3 times per second**.
- Avoid large, high-contrast, saturated-red flashes entirely.
- Test with PEAT (Photosensitive Epilepsy Analysis Tool) or a similar tool if the site uses video or strobing effects.

## Focus & screen readers

- **Move focus** into modals and drawers when they open, and return it to the trigger when they close, *regardless* of animation.
- Do not delay focus until an animation finishes. Move focus right away.
- **Hidden-by-animation is not hidden:** an element at `opacity: 0` is still read by screen readers and still receives focus. Use `visibility: hidden` or `inert` once it is fully hidden, or toggle `hidden`.
- **Text-splitting effects** (per-letter animations) break screen reader reading. Keep the full text in `aria-label` on the container and put `aria-hidden="true"` on the split spans.
- Loading animations need text: `<div role="status">Loading…</div>`.
- Content revealed on scroll must still exist in the DOM and be reachable by keyboard and screen reader without scrolling.

## Vestibular triggers to minimise everywhere

- Large-scale zooms and full-screen scaling
- Parallax with layers moving at very different speeds
- Spinning or rotating large elements
- Horizontal scrolling triggered by vertical scroll
- Motion that covers most of the viewport
- Motion that does not stop
