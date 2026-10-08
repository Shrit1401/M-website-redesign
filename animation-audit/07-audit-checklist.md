# 07 — Animation Audit Checklist

Work through each section. Mark each item **Pass / Fail / N/A** and record evidence (a screenshot, trace, or selector) for every Fail. Severity guide: **High** = broken, inaccessible, or measurably janky. **Medium** = noticeably hurts UX or performance. **Low** = polish.

## 0. Setup

- [ ] Test on a **real mid-range Android phone** or Chrome with **6× CPU throttling + Fast 4G**.
- [ ] Test on **Safari (iOS or macOS)** as well as Chrome. Safari has its own animation bugs.
- [ ] Test with **reduced motion ON** (OS setting or DevTools → Rendering → Emulate).
- [ ] Use a cold cache / incognito window for load animations.
- [ ] List every page template to test: home, listing, detail, form, modal, nav menu.

## 1. Inventory (what moves?)

- [ ] Open DevTools → **Animations** panel, reload, and interact. Write down every animation that runs.
- [ ] In the console, run `document.getAnimations()` after load and again after scrolling.
- [ ] Note the libraries in use (GSAP, Motion, Lottie, Lenis, AOS, three.js…), their bundle cost, and whether there is more than one.
- [ ] For each animation, record: **trigger, element, properties, duration, easing, purpose**.

| # | Trigger | Element | Properties | Duration | Easing | Purpose | Keep? |
|---|---|---|---|---|---|---|---|
| 1 | load | hero h1 | opacity, transform | 600 ms | ease-out | brand | ✅ |
| 2 | hover | .card | box-shadow, top | 300 ms | linear | feedback | ⚠️ fix |

## 2. Purpose & UX

- [ ] Every animation has a clear purpose (feedback, orientation, attention, continuity, status). **Medium** if not.
- [ ] No more than one "show-off" moment per page. **Low**
- [ ] Animations do not delay the user's task. They can click, scroll, and type during any animation. **High** if input is blocked.
- [ ] Intro / splash animations are skippable and do not replay on every visit. **Medium**
- [ ] The same component animates the same way everywhere. **Low**
- [ ] Motion direction matches the spatial model (a drawer from the left closes to the left). **Low**

## 3. Timing & easing

- [ ] Routine UI transitions take 150–300 ms. Anything > 500 ms has a justification. **Medium**
- [ ] Hover/press feedback starts within one frame, with no delay. **Medium**
- [ ] Exits are faster than entrances. **Low**
- [ ] No `linear` easing on movement. Entrances ease-out, exits ease-in. **Low**
- [ ] Stagger is 20–60 ms per item with a capped total (≤ 400 ms). **Low**
- [ ] Animations are interruptible (hovering out mid-way reverses smoothly, with no jump). **Low**
- [ ] Durations and easings come from shared tokens, not one-off values. **Low**

## 4. Performance

- [ ] **Only `transform` / `opacity`** (and small `filter`) are animated. Check the Performance panel for Layout/Paint on every frame. **High** for layout properties on large or many elements.
- [ ] No `transition: all`. **Medium**
- [ ] Paint flashing shows no large repaints during animations. **Medium**
- [ ] Dropped frames during key animations < 5% at 6× CPU. **High** if > 15%.
- [ ] No long animation frames (> 50 ms) during interactions. **Medium**
- [ ] `will-change` is used sparingly (< ~10 elements) and not globally. **Low/Medium**
- [ ] Composited layer count is reasonable (< 30 typical). **Low**
- [ ] Scroll handlers are passive or IntersectionObserver-based. Scroll-driven CSS is used where supported. **Medium**
- [ ] Off-screen and looping animations pause when not visible (Lottie, WebGL, video, marquees). **Medium**
- [ ] Lighthouse shows no "Avoid non-composited animations" warnings. **Medium**
- [ ] No GIFs where a video would do. **Low**

## 5. Loading & Core Web Vitals

- [ ] The LCP element is not hidden behind an opacity entrance animation. **High**
- [ ] The page is not blank until JS runs (no `body{opacity:0}` waiting on JS). **High**
- [ ] CLS ≤ 0.1. Animations use transforms, not layout shifts. **High** if > 0.25.
- [ ] INP ≤ 200 ms on animated interactions. **Medium**
- [ ] Animation libraries are lazy-loaded or code-split where they are not needed for first paint. **Low**

## 6. Accessibility

- [ ] **`prefers-reduced-motion` is respected.** With it ON: no parallax, no slides/zooms, no autoplay, no smooth-scroll hijack. **High**
- [ ] With reduced motion ON, all content is still visible and reachable (no content stuck at `opacity:0`). **High**
- [ ] Anything that moves automatically for > 5 s has a pause control (WCAG 2.2.2). **High**
- [ ] Nothing flashes more than 3 times per second (WCAG 2.3.1). **High**
- [ ] Focus moves correctly into and out of animated modals and menus. The focus ring is never hidden by animation. **High**
- [ ] Hidden animated elements are `inert`, `visibility:hidden`, or removed, so they are not focusable. **Medium**
- [ ] Split-text effects keep readable text for screen readers. **Medium**
- [ ] Loaders have `role="status"` text. **Medium**
- [ ] Carousels: no autoplay (or pause + 5 s+), keyboard operable, slide changes announced politely. **Medium**

## 7. Scroll behavior

- [ ] Native scroll is not hijacked (speed, direction, snapping) without strong reason. **Medium**
- [ ] If smooth scroll is used: keyboard scrolling, anchor links, find-in-page, and focus scrolling all still work. **High** if broken.
- [ ] Scroll reveals animate once and are subtle. Content does not depend on scroll position to exist. **Low**
- [ ] No horizontal scroll triggered by vertical scroll on mobile. **Medium**

## 8. Cross-device

- [ ] Hover-only effects are wrapped in `@media (hover: hover)`. Touch users do not get stuck hover states. **Low**
- [ ] Mobile durations and distances are tuned (shorter, smaller). **Low**
- [ ] Works in Safari (check `backdrop-filter`, view transitions, and scroll-timeline fallbacks). **Medium**
- [ ] With `Save-Data` / low battery: heavy video and WebGL are reduced. **Low**

## 9. Code quality

- [ ] Motion tokens are defined in one place. **Low**
- [ ] Animation code is cleaned up on unmount (GSAP context revert, observers disconnected, rAF cancelled). **Medium** if it leaks.
- [ ] No debug artefacts (ScrollTrigger `markers`, console logs in rAF loops). **Low**
- [ ] Only one general-purpose animation library is in the bundle. **Low**
- [ ] Visual tests disable animations. A reduced-motion e2e run exists. **Low**

## Scoring

Start at **100**, then subtract **15 per High**, **7 per Medium**, and **3 per Low** (minimum 0).

| Score | Grade | Meaning |
|---|---|---|
| 90–100 | A | Motion is an asset |
| 75–89 | B | Good. Fix the mediums |
| 60–74 | C | Noticeable problems |
| 40–59 | D | Motion is hurting UX or accessibility |
| < 40 | F | Rework needed |

Record the results with [08-report-template.md](08-report-template.md).
