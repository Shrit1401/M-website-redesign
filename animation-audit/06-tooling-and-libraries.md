# 06 — Tooling & Libraries

## Pick the lightest tool that does the job

| Need | Best choice | Why |
|---|---|---|
| Hover, focus, state changes | **CSS transitions** | Free, interruptible, no JS |
| Simple keyframe loops / entrances | **CSS animations** | No JS, can run on the compositor |
| Enter/exit of `display:none` elements | **CSS `@starting-style` + `transition-behavior: allow-discrete`** | Native, no JS |
| Scroll-linked effects | **CSS scroll-driven animations** (`animation-timeline`) | Off the main thread, no JS. Polyfill or fall back to IntersectionObserver |
| Page / route transitions, shared elements | **View Transitions API** | Native FLIP for whole pages |
| JS-controlled tweens, sequencing, pause/reverse | **Web Animations API** (`el.animate()`) | Native, has promises, can be composited |
| React component motion, layout animation, gestures, springs | **Motion** (formerly Framer Motion) | Declarative, `layout` FLIP, `AnimatePresence` for exits |
| Complex timelines, scroll storytelling, SVG morphing | **GSAP** (+ ScrollTrigger, Flip, SplitText) | Most powerful and battle-tested. Now free, including plugins |
| Designer-made vector animations | **Lottie / dotLottie** | Exported from After Effects. Watch file size |
| Interactive state-machine illustrations | **Rive** | Smaller and faster than Lottie for interactive use |
| 3D / WebGL | **three.js**, **React Three Fiber**, **OGL** | Heavy. Needs a fallback, pause off-screen |
| Smooth scrolling | **Lenis** (only if you must) | Lightest option. Disable it under reduced motion and on touch |

### Library cost (approximate, min+gzip)

| Library | Size |
|---|---|
| CSS / WAAPI / View Transitions | 0 KB |
| Motion (`motion` mini `animate`) | ~3 KB |
| Motion for React (full) | ~30+ KB (use `LazyMotion` + `m` to cut it to ~5 KB) |
| GSAP core | ~25 KB (+ ScrollTrigger ~12 KB) |
| Lenis | ~4 KB |
| lottie-web | ~60 KB+ (light player ~40 KB) |
| three.js | ~150 KB+ |

Rule: **do not ship more than one general animation library.** Two libraries (for example GSAP and Framer Motion) in one bundle is an audit finding.

## Library-specific best practices

### GSAP
- Use `gsap.context()` (or `useGSAP()` in React) and revert on unmount to avoid leaks.
- Use `gsap.matchMedia()` for reduced-motion and breakpoint variants.
- Animate `x`, `y`, `scale`, `rotation`, `autoAlpha`. These map to transform and opacity.
- ScrollTrigger: avoid `scrub` on dozens of elements, do not pin on mobile unless it has been tested, and call `ScrollTrigger.refresh()` after layout changes.
- Do not leave `markers: true` in production.

### Motion (Framer Motion)
- `<MotionConfig reducedMotion="user">` at the root.
- Use `LazyMotion` + `domAnimation` + the `m.` components to reduce bundle size.
- `layout` animations are powerful but measure on every render. Avoid them on large lists.
- Prefer `transform` values (`x`, `y`, `scale`) over `width`/`height`/`top`.
- Use `AnimatePresence` for exit animations, and give each child a stable `key`.

### Lottie
- Use the `.lottie` (dotLottie) format, which is compressed.
- Lazy-load the player and the JSON, and do not autoplay off-screen.
- Do not use Lottie for simple icons that CSS or SVG could handle.
- Check the frame rate and layer count of the exported file. Ask the designer to simplify it if needed.

### Smooth-scroll libraries (Lenis, Locomotive)
- They change native scroll behavior, which hurts accessibility (keyboard, find-in-page, anchor links, and assistive tech), and they add risk.
- If the site must use one: disable it on touch devices and under reduced motion, make sure anchor links and focus still scroll correctly, and keep `scroll-behavior` consistent.

## Developer tooling for animation work

| Tool | Use |
|---|---|
| Chrome DevTools → **Animations** panel | Capture, slow down to 10%, scrub, and edit timing of CSS/WAAPI animations |
| Chrome DevTools → **Performance** | Frame-by-frame cost, layout/paint per frame, long animation frames |
| Chrome DevTools → **Rendering** | Paint flashing, layout shift regions, FPS meter, emulate reduced motion |
| Chrome DevTools → **Layers** | GPU layers and memory |
| Firefox DevTools → **Animation inspector** | Similar to Chrome's. Shows which animations run on the compositor (⚡ icon) |
| Safari Web Inspector → **Timelines / Layers** | Test on real iOS. Safari has the most edge cases |
| **easings.net / cubic-bezier.com** | Design and compare easing curves |
| **Linear() easing generator** | Springs and bounces in pure CSS |
| **Lighthouse** | CLS, LCP, TBT, and the "Avoid non-composited animations" audit |
| **WebPageTest** | Filmstrip and video of real-device loading, to see when animations start |
| **Storybook + Chromatic** | Visual regression tests. Use `prefers-reduced-motion` or pause animations for stable snapshots |
| **Playwright** | `page.emulateMedia({ reducedMotion: 'reduce' })` for automated reduced-motion tests |

## Testing animations automatically

- **Visual tests:** disable animations so screenshots are stable (`animations: 'disabled'` in Playwright's `toHaveScreenshot`).
- **Reduced-motion tests:** run your e2e suite once with `reducedMotion: 'reduce'` and assert that key content is visible without scrolling or waiting.
- **Performance budgets:** fail CI on Lighthouse CLS > 0.1 or on the "non-composited animations" audit.
- **Unit tests:** for JS-driven animation, assert end states, not intermediate frames.
