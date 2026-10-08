# 07 — Validation: Making Sure Every Check Works

An audit tool that reports wrong findings is worse than no tool. Each check must be shown to **fire when it should (true positive)** and to **stay silent when it should not (true negative)** before its results can be trusted.

## 1. Fixture pages (unit-level ground truth)

Keep a folder of small, self-contained HTML pages. Each one is built to trigger, or to avoid triggering, exactly one check. Serve them from a local static server during tests, so they behave like real HTTP pages and stylesheets are readable.

| Fixture | Contains | Must trigger | Must NOT trigger |
|---|---|---|---|
| `good.html` | Transform/opacity entrance, reduced-motion media query, explicit transition props, 250 ms ease-out | nothing above Info | every check |
| `layout-anim.html` | `@keyframes` animating `width` and `left`; transition on `height` | AA-PERF-01 | AA-PERF-03 |
| `transition-all.html` | 12 elements with `transition: all .3s` | AA-PERF-03 | AA-PERF-01 (if no layout change occurs) |
| `no-reduced-motion.html` | Infinite transform animation, no media query | AA-A11Y-01, AA-A11Y-02, AA-A11Y-03 | — |
| `reduced-motion-js.html` | Animation disabled through `matchMedia` in an **external** JS file | none of A11Y-01/02 | AA-A11Y-01 (tests the resource-body scan) |
| `reduced-motion-cross-origin.html` | Media query only in a cross-origin stylesheet | none | AA-A11Y-01 (tests that unreadable sheets are handled) |
| `cls.html` | A banner injected above content after 1 s | AA-STAB-01 | — |
| `cls-transform.html` | The same banner animated in with transform over reserved space | none | AA-STAB-01 |
| `jank.html` | A scroll handler that blocks for 80 ms per event | AA-PERF-04 | — |
| `long-frames.html` | A 300 ms busy loop on load | AA-PERF-05 | — |
| `will-change.html` | 40 elements with `will-change: transform` | AA-PERF-06 | — |
| `scroll-hijack.html` | `html{overflow:hidden}` + custom wheel-driven transform scroller | AA-A11Y-05 | — |
| `marquee-pause.html` | Infinite marquee **with** a pause button | none of A11Y-03 | AA-A11Y-03 |
| `linear-long.html` | 5 elements moving with linear easing over 1.5 s | AA-UX-01, AA-UX-03 | — |
| `waapi.html` | `element.animate()` on `top` | AA-PERF-01 | — (proves JS animations are seen) |
| `gsap.html` | GSAP loaded from a local copy animating `x` | library = GSAP | AA-PERF-01 (GSAP `x` → transform) |
| `empty.html` | No animation at all | nothing | everything (no "no reduced motion" penalty without motion) |

### Test assertions
For each fixture, the test asserts the **set of check IDs** produced, not just the score:

```
expect(ids("layout-anim.html")).toContain("AA-PERF-01")
expect(ids("good.html").filter(nonInfo)).toEqual([])
expect(ids("empty.html")).toEqual([])
```

Also assert the **collected data**, not only the findings. For example, `layout-anim.html` must report `props` that include `width` and `left`. If collection breaks silently, the rules will look "clean".

**Rule:** a check is not enabled by default until both its positive and its negative fixture pass.

## 2. Collector smoke tests

Separate from the rules, verify that the browser layer works:
- [ ] `getAnimations()` returns entries on a fixture with a known animation (count must match).
- [ ] `animationstart`/`transitionstart` events are captured during load (the init script ran before page scripts).
- [ ] PerformanceObservers report entries: `layout-shift` on `cls.html`, `long-animation-frame` on `long-frames.html`.
- [ ] Reduced-motion emulation works: `matchMedia('(prefers-reduced-motion: reduce)').matches === true` in Run B.
- [ ] The scroll test actually scrolls: `scrolledPx > 0` on a tall page.
- [ ] The frame sampler returns more than 60 frames over 3 s on `good.html`. Fewer means rAF is throttled, for example by a background tab.

## 3. Real-site ground truth (integration level)

Fixtures prove the logic. Real sites prove the tool survives the messy web.

1. Pick a **reference set of 20–30 public sites** across stacks: static, WordPress, Next.js, Webflow, heavy GSAP, Lottie-heavy, minimal.
2. A human audits each one with DevTools and the manual checklist, and records the expected High/Medium findings in `reference/expected.json`.
3. Run the tool and compute per check:
   - **Precision** = true positives / all reported (target ≥ 0.9 for High-confidence checks, ≥ 0.75 for Medium)
   - **Recall** = true positives / all expected (target ≥ 0.8)
4. Review every false positive. Either fix the rule, adjust the threshold, or downgrade the confidence.
5. Re-run this set on every release. A drop in precision or recall blocks the release.

Real sites change, so re-verify the reference set by hand every quarter and update the expected findings.

## 4. Repeatability (noise) testing

Timing-based checks (AA-PERF-04 jank, AA-PERF-05 LoAF) are noisy in headless browsers.
- Run the same 10 sites **5 times** under the same conditions.
- For each metric, record the median and the spread (p90 − p10).
- The **finding** must be stable: the same severity in ≥ 4 of 5 runs. If not, raise the threshold, take the median of 3 runs, or mark the check `confidence: medium`.
- Document the measured noise (for example "p95 frame time ±8 ms") in the report footer.

## 5. Cross-checking against reference tools

| Our check | Cross-check with | Expectation |
|---|---|---|
| AA-STAB-01 CLS | Lighthouse CLS on the same run | Within ±0.02 (ours also includes the scroll phase, so ours ≥ Lighthouse's) |
| AA-PERF-01 / 02 | Lighthouse `non-composited-animations`, Firefox compositor ⚡ | Every element Lighthouse flags appears in ours |
| AA-PERF-04 | DevTools Performance → Frames, same throttle | Same jank verdict |
| Library detection | Wappalyzer | Same set for the main libraries |
| AA-A11Y-08 | axe browser extension | Identical violations |
| AA-A11Y-02 | Manual: macOS "Reduce motion" on, real Safari | Same verdict (catches Chromium-only behavior) |

## 6. Regression safety for the tool itself

- Run the fixture suite on every change to the collector or rules (fast, under 1 minute).
- Store a **golden output** for 3 stable fixtures and diff the full JSON (ignoring timestamps and timing values) to catch unintended collection changes.
- Pin the browser version in CI. When upgrading Chromium, re-run the reference set and compare before merging.
- Version the tool, and write `toolVersion` into every report so results can be traced.

## Validation checklist before each release

- [ ] All fixtures pass (positive + negative)
- [ ] Collector smoke tests pass
- [ ] Reference-set precision/recall at or above target
- [ ] Repeatability run shows stable severities
- [ ] Cross-checks spot-checked on 3 sites
- [ ] CHANGELOG lists any new, changed, or retired check IDs and threshold changes
