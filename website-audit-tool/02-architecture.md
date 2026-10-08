# 02 — Architecture

## Pipeline

```
 URL list ──► 1. Queue ──► 2. Collect (browser) ──► 3. Analyze ──► 4. Score ──► 5. Report
                │              │                       │              │            │
          dedupe, normalise   run A: normal          rules →        weights     md / json /
          concurrency pool    run B: reduced motion  findings       per site    csv / html
          retries             run C: Lighthouse/axe                  + grades
```

Each stage is a separate module with a plain-data interface (JSON in, JSON out). That makes every stage testable on its own and lets you re-run **Analyze → Report** on saved data without opening the browser again.

## 1. Queue

- Input: a text file, CSV, or sitemap. Normalise URLs (add `https://`, strip tracking params, dedupe).
- Concurrency pool, default **3** parallel sites. Each site runs in its **own browser context**, with no shared cookies or cache.
- Per-site timeout (default 60 s). On failure, retry once, then record `status: "error"` and continue.
- Politeness: a maximum of 1 concurrent request per domain, and an honest user agent such as `AnimationAudit/1.0 (+contact)`.

## 2. Collect

All collection happens in **headless Chromium** (Playwright or Puppeteer). Chromium is the browser with the needed APIs: `getAnimations()`, Long Animation Frames, Layout Instability, and CDP.

### Run A — normal motion
1. **Before navigation**, inject an init script that:
   - Starts `PerformanceObserver`s for `layout-shift`, `long-animation-frame`, `longtask`, `largest-contentful-paint`.
   - Listens (capture phase) for `animationstart` and `transitionstart` events to log every animation that fires during load.
2. Navigate (`waitUntil: load`, then wait about 2 s for settle) and dismiss common cookie banners (see troubleshooting).
3. **Snapshot animations:** call `document.getAnimations()` and record type (CSSAnimation / CSSTransition / WAAPI), name, duration, iterations, easing, animated properties (from `getKeyframes()`), and target selector.
4. **Scan styles:** walk `document.styleSheets` for `@keyframes`, `@media (prefers-reduced-motion)`, and `transition` declarations. Walk computed styles of up to N elements for `transition-property`/`duration` and `will-change`.
5. **Capture resource bodies** (CSS and JS responses up to about 2 MB) on the Node side to search for `prefers-reduced-motion` in cross-origin stylesheets and scripts that the page cannot read.
6. **Detect libraries:** check globals and DOM fingerprints (GSAP, ScrollTrigger, Motion, Lenis, Locomotive, AOS, Lottie, three.js, Swiper, Barba…).
7. **Scroll test:** start a rAF frame sampler, scroll with real wheel events down about 3 viewports over about 3 s, then stop. Record the frame deltas, whether `scrollY` actually changed (to detect scroll hijacking), and the animations triggered by scrolling.
8. **Hover sample (optional):** hover the first N links, buttons, and cards, and record the transitions that fire.
9. Screenshot.

### Run B — reduced motion
New context with `reducedMotion: 'reduce'`. Repeat the navigation, settle, scroll, and animation snapshot. Compare against Run A.

### Run C — standard audits (optional, slower)
- **Lighthouse** (performance + accessibility categories, mobile preset): CLS, LCP, TBT, `non-composited-animations`, `unsized-images`.
- **axe-core**, injected into the page: motion-adjacent rules and general a11y (`marquee`, `blink`, `meta-refresh`, focus order and more).

### Collection conditions (must be recorded in output)
Browser version, viewport, device scale factor, CPU throttle factor, network profile, run timestamp, tool version. Results are only comparable when these conditions match.

## 3. Analyze

A **rule engine**: each check is a pure function `(siteData) → Finding[]`.

```
Finding {
  id:        "AA-PERF-01"
  title:     "Layout properties are animated"
  severity:  "high" | "medium" | "low" | "info"
  category:  "performance" | "accessibility" | "ux" | "stability"
  evidence:  { selectors: [...], properties: [...], values: {...} }
  fix:       "Animate transform instead of top/left. See animation-audit/03-performance.md"
  confidence:"high" | "medium"   // heuristic checks are "medium"
}
```

Rules live in one file per category, so adding a check never touches the collector unless it needs new data.

## 4. Score

The score comes from the findings alone (see [06-scoring-and-reporting.md](06-scoring-and-reporting.md)). Scoring weights are config, not code.

## 5. Report

Renderers turn `{ sites: [...] }` into Markdown, JSON, CSV, and (optionally) a single static HTML dashboard.

## Data model (per site JSON)

```
{
  url, finalUrl, status: "ok" | "error", error?,
  conditions: { browser, viewport, cpuThrottle, network, toolVersion, timestamp },
  libraries: [], canvases, autoplayVideos,
  animations: { afterLoad: [...], afterScroll: [...], events: [...] },
  styles: { keyframes, transitions, transitionAll, willChange, reducedMotionRules, resourceMentionsReducedMotion },
  scroll: { frames, avgFps, p95FrameMs, jankPct, scrolledPx },
  vitals: { cls, lcp, loafs: [...], longtasks: [...] },
  reducedMotion: { animationsRunning, infiniteRunning, scrollHijacked },
  lighthouse?: {...}, axe?: {...},
  findings: [...], score, grade
}
```

## Design decisions

| Decision | Reason |
|---|---|
| Real browser, not static parsing | Animations from JS libraries only exist at runtime |
| Two runs (normal + reduced) | The only reliable way to test reduced-motion behavior |
| Chromium only for v1 | The required performance APIs exist only there; note Safari as a manual check |
| Raw data saved separately from findings | Rules can be re-run and tuned without re-crawling |
| Severity and weights in config | Teams disagree on priorities; avoid code changes |
| Bounded concurrency + per-domain limit | Stable timing measurements, and polite to servers |
