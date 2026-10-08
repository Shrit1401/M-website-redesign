# 03 — Checks Reference

Every check has an ID, the data it uses, a pass/fail rule, a severity, and a fix. **Confidence** shows how reliable the automated check is: **High** means it is measured directly, and **Medium** means it is a heuristic that a human should confirm.

Thresholds are defaults. All of them can be overridden in config.

## Performance

| ID | Check | How it's measured | Rule | Severity | Conf. | v |
|---|---|---|---|---|---|---|
| **AA-PERF-01** | Layout properties animated | Animated props from `getAnimations()` keyframes and transitionstart events, compared against the layout list (`width, height, top, left, right, bottom, margin*, padding*, inset, font-size, line-height, border-width, gap, max-height, grid-template-*`) | Any animation or transition on a layout prop | High (≥ 3 elements or ≥ 1 infinite), else Medium | High | v1 |
| **AA-PERF-02** | Paint-heavy properties animated | Same, against the paint list (`box-shadow, background*, color, border-radius, outline, clip-path`) | ≥ 5 elements or any infinite | Low | High | v1 |
| **AA-PERF-03** | `transition: all` | Computed `transition-property` contains `all` with duration > 0 | ≥ 1 element | Medium (≥ 10 elements), else Low | High | v1 |
| **AA-PERF-04** | Scroll jank | rAF frame deltas during a scripted wheel scroll | p95 frame > 50 ms **or** > 15% frames > 33 ms → High; p95 > 33 ms or > 5% → Medium | High / Medium | Medium (headless timing is noisy; see 07) | v1 |
| **AA-PERF-05** | Long animation frames during load | `long-animation-frame` entries | Any ≥ 200 ms → Medium; ≥ 3 entries ≥ 100 ms → Medium | Medium | High | v1 |
| **AA-PERF-06** | `will-change` overuse | Computed `will-change != auto` count | > 30 → Medium; > 15 → Low | Low / Medium | High | v1 |
| **AA-PERF-07** | Non-composited animations (Lighthouse) | Lighthouse `non-composited-animations` audit | Audit fails | Medium | High | v1 (if Lighthouse on) |
| **AA-PERF-08** | Multiple animation libraries | Library detection | ≥ 2 general-purpose libs (GSAP, Motion, anime, Velocity, jQuery animate) | Low | Medium | v1 |
| **AA-PERF-09** | Off-screen animations keep running | Infinite animations whose target is outside the viewport after scrolling past | ≥ 3 | Low | Medium | v2 |
| **AA-PERF-10** | Heavy animation assets | Response sizes: Lottie JSON > 300 KB, GIF > 500 KB, background video > 5 MB | Any | Low | High | v2 |

## Stability / Core Web Vitals

| ID | Check | How | Rule | Severity | Conf. | v |
|---|---|---|---|---|---|---|
| **AA-STAB-01** | Layout shift | Sum of `layout-shift` values without recent input (load + scroll) | > 0.25 High, > 0.1 Medium | High / Medium | High (lab value) | v1 |
| **AA-STAB-02** | LCP element hidden by entrance animation | The LCP element (or an ancestor) has an opacity animation starting at 0 | Yes | High | Medium | v1 |
| **AA-STAB-03** | Page hidden until JS | `body`/`main` computed `opacity: 0` or `visibility: hidden` at DOMContentLoaded | Yes | High | High | v2 |

## Accessibility

| ID | Check | How | Rule | Severity | Conf. | v |
|---|---|---|---|---|---|---|
| **AA-A11Y-01** | No reduced-motion handling | No `prefers-reduced-motion` in any readable stylesheet, inline script, or captured CSS/JS response body | Site has ≥ 1 non-trivial animation (duration ≥ 200 ms and moves via transform, or infinite) | High | High | v1 |
| **AA-A11Y-02** | Motion continues under reduced motion | Run B: count running animations that move (transform/translate/scale/rotate or layout) with duration ≥ 200 ms or infinite | ≥ 50% of Run A's moving animations still run → High; any infinite moving animation → Medium | High / Medium | High | v1 |
| **AA-A11Y-03** | Auto-moving content without pause (WCAG 2.2.2) | Infinite or > 5 s animations on visible, non-tiny elements (> 5% of viewport area); look for a nearby button labelled pause/stop | Found and no control | High | Medium | v1 |
| **AA-A11Y-04** | Smooth-scroll lib active under reduced motion | Lenis/Locomotive detected in Run B, or `html` has the `lenis`/`has-scroll-smooth` class | Yes | Medium | High | v1 |
| **AA-A11Y-05** | Scroll hijacking | After the wheel scroll, `scrollY` did not change but the content moved (transform on the container), or `overflow: hidden` on `html` with a custom scroller | Yes | Medium | Medium | v1 |
| **AA-A11Y-06** | Autoplay video under reduced motion | `<video autoplay>` playing in Run B | Yes | Medium | High | v1 |
| **AA-A11Y-07** | Flashing content | Frame-diff luminance analysis of a 5 s screen recording: > 3 flashes per second over a large area | Yes | High | Medium | v3 |
| **AA-A11Y-08** | axe motion rules | axe `marquee`, `blink`, `meta-refresh` | Any violation | High | High | v1 (if axe on) |
| **AA-A11Y-09** | Hidden-but-focusable animated elements | Focusable elements with `opacity: 0` and no `inert`/`visibility:hidden` | ≥ 1 | Medium | Medium | v2 |

## UX / Craft

| ID | Check | How | Rule | Severity | Conf. | v |
|---|---|---|---|---|---|---|
| **AA-UX-01** | Overlong UI durations | Non-infinite animations and transitions | Duration > 1,000 ms on ≥ 3 elements → Low; transitions > 600 ms → Low | Low | High | v1 |
| **AA-UX-02** | Too-short durations | 0 < duration < 80 ms on movement | ≥ 3 | Info | High | v1 |
| **AA-UX-03** | Linear easing on movement | `easing == linear` with transform/position props, non-infinite | ≥ 3 | Low | High | v1 |
| **AA-UX-04** | Inconsistent motion system | Distinct transition durations > 8, or distinct easings > 6 | Yes | Low | Medium | v1 |
| **AA-UX-05** | Excessive load choreography | Total time from first to last load animation end > 2,000 ms | Yes | Low | High | v1 |
| **AA-UX-06** | Excessive scroll reveals | > 20 distinct elements animate in on scroll | Yes | Low | Medium | v1 |
| **AA-UX-07** | Hover effects without hover media query | Hover transitions with no `(hover: hover)` media rule anywhere | Info only | Info | Medium | v2 |

## Inventory (informational, always reported)

- Libraries detected and their approximate size
- Animation counts: CSS animations, CSS transitions, WAAPI/JS
- Unique durations and easings (the "motion palette")
- Canvases / WebGL, autoplay videos, Lottie players
- Top 20 animated elements with properties and durations

## Severity definitions

| Severity | Meaning |
|---|---|
| **High** | Measurable harm: jank, layout shift, an accessibility failure, or users made ill or blocked |
| **Medium** | Noticeable UX or performance cost, or a likely accessibility issue |
| **Low** | Polish or best practice |
| **Info** | Context only; does not affect the score |

## Writing a new check (rules)

1. Give it the next free ID in its category, and never reuse a retired ID.
2. Say exactly which collected fields it reads. If it needs new data, add it to the collector *first* and to the data model in [02](02-architecture.md).
3. Define the rule with explicit thresholds in config.
4. Add a **true-positive and a true-negative fixture** (see [07-validation.md](07-validation.md)) before you enable it.
5. Start new heuristic checks at `confidence: medium`, and raise them to `high` only after a false-positive review on at least 20 real sites.
6. Link the fix text to the relevant section of the [animation guide](../animation-audit/README.md).
