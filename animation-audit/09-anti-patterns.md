# 09 — Animation Anti-Patterns (and Fixes)

| # | Anti-pattern | Why it's bad | Fix |
|---|---|---|---|
| 1 | **Animating `top/left/width/height/margin`** | Layout on every frame causes jank | `transform` / FLIP |
| 2 | **`transition: all`** | Animates unintended properties, including layout ones | List the exact properties |
| 3 | **Hiding the whole page until JS runs** (`body{opacity:0}`) | Blank page if JS is slow or fails; ruins LCP | Show content by default and enhance with a `.js` class |
| 4 | **Fading in the hero / LCP element** | Delays LCP and hurts SEO and perceived speed | Keep it visible; animate only a small transform or secondary elements |
| 5 | **Every element reveals on scroll** | Tiring, slows reading, content "missing" in screenshots and print | Reveal sections once; mostly static content |
| 6 | **Scroll-jacking / custom smooth scroll** | Breaks keyboard, find-in-page, and assistive tech; feels laggy | Native scroll; CSS `scroll-behavior` for anchors only |
| 7 | **No reduced-motion support** | Makes some users physically ill; fails accessibility audits | Motion as an opt-in (`no-preference`) plus a global safety net |
| 8 | **Autoplay carousels with no pause** | WCAG 2.2.2 failure; users miss content | No autoplay, or pause control + 5 s+ + pause on hover/focus |
| 9 | **Long durations (800 ms+) for routine UI** | Feels slow and sluggish | 150–300 ms |
| 10 | **Linear easing on movement** | Mechanical and cheap-looking | Ease-out to enter, ease-in to exit |
| 11 | **Bounce/elastic on everything** | Gimmicky and distracting | Use springs only for tactile moments |
| 12 | **Spinner flash for fast responses** | Flicker looks broken | Show a loader only after ~300 ms |
| 13 | **`will-change` on everything** | GPU memory blowup, slower | Apply just before animating, then remove |
| 14 | **Infinite ambient animations everywhere** | Battery and CPU drain, distraction, a11y failure | Static by default, pause off-screen, provide a pause control |
| 15 | **Scroll listeners doing layout reads** | Layout thrashing on every scroll event | IntersectionObserver or scroll-driven CSS; passive listeners + rAF |
| 16 | **`background-attachment: fixed` parallax** | Repaints on scroll; broken on iOS | Transform-based or scroll-timeline parallax |
| 17 | **Two animation libraries in one bundle** | Wasted KB and inconsistent motion | Pick one; prefer native CSS/WAAPI |
| 18 | **Split-text animations without a11y** | Screen readers read letters one by one | `aria-label` on the parent, `aria-hidden` on the spans |
| 19 | **Animations that block clicks** (`pointer-events:none` during a transition) | Users feel ignored | Keep input live; make animations interruptible |
| 20 | **Keyframe animations for hover** | They jump when the hover ends mid-way | Use transitions for state changes |
| 21 | **Hover effects on touch devices** | Sticky hover states after a tap | `@media (hover: hover) and (pointer: fine)` |
| 22 | **Opacity-0 elements still focusable** | Keyboard focus lands on invisible things | `inert` / `visibility:hidden` once hidden |
| 23 | **Heavy Lottie/WebGL running off-screen** | Constant CPU/GPU use | Pause through IntersectionObserver |
| 24 | **GIF for UI animations** | Huge files, no control | `<video muted playsinline>` or CSS/Lottie |
| 25 | **Intro splash on every page load** | Users wait every visit | Show once per session, skippable, or remove |
| 26 | **Layout shifts from late-loading animated content** | CLS penalty, mis-clicks | Reserve space; animate with transform |
| 27 | **Animation tied to frame count instead of time** | Runs at different speeds on 60/120 Hz screens | Use the rAF timestamp delta, or WAAPI/CSS durations |
| 28 | **Restarting an animation on every React render** | Flicker and wasted work | Stable keys; animate on state change only |
| 29 | **Debug artefacts in prod** (ScrollTrigger markers, `console.log` in rAF) | Visual bugs, slowdown | Strip them in the build |
| 30 | **No visual-test stabilisation** | Flaky screenshot tests | Disable animations in tests |
