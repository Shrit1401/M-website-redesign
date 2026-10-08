# 04 — Existing Tools (and How They Fit)

Do not rebuild what already exists. The audit tool runs these tools or borrows their methods, and adds the animation-specific checks that none of them cover.

## Comparison

| Tool | Multi-site? | Animation-specific? | Strengths | Gaps | Role in our tool |
|---|---|---|---|---|---|
| **Lighthouse** (CLI / Node) | One URL per run (script it) | Partly: the `non-composited-animations` audit | Standard perf + a11y scores, CLS/LCP/TBT, widely trusted | Lab only; no reduced-motion test; no animation inventory | Run C: perf/a11y baseline, AA-PERF-07 |
| **Lighthouse CI** (`lhci`) | Yes, list of URLs + budgets | Same as Lighthouse | CI assertions, history server, trends | Same gaps | CI integration pattern; can host results |
| **Unlighthouse** | Yes: crawls a whole site | Same as Lighthouse | Crawls every page and shows a dashboard | One site at a time; same gaps | Good for "every page of one site" runs |
| **PageSpeed Insights API** | Yes (API, rate-limited) | Same as Lighthouse | Includes **CrUX field data** (real users) | Rate limits; no custom checks | Field CLS/INP to compare with lab results |
| **CrUX API / BigQuery** | Yes | No | Real-user Core Web Vitals per origin | Only sites with enough traffic | Field data column in the report |
| **axe-core** (+ `@axe-core/playwright`) | Script it | Partly: `marquee`, `blink`, `meta-refresh` | Industry-standard a11y engine, low false positives | No reduced-motion or animation timing checks | Run C: AA-A11Y-08, general a11y count |
| **Pa11y / pa11y-ci** | Yes, URL list | Same as axe/HTML_CodeSniffer | Simple multi-URL a11y CI | Same gaps | Alternative to raw axe |
| **WebPageTest** | Yes (API, bulk) | Visual: filmstrip/video | Real devices and locations; video of loading animations | Paid at scale; no animation inventory | Manual deep-dive; video evidence |
| **Chrome DevTools** (Performance, Animations, Rendering, Layers) | Manual | **Yes** | The ground truth for jank, layout/paint per frame, animation timing | Manual; one page at a time | Validating our measurements (see 07) |
| **Firefox Animation Inspector** | Manual | Yes | Shows which animations run on the compositor | Manual | Cross-checking the compositor classification |
| **Playwright / Puppeteer** | Yes (you script it) | Provides the APIs | `emulateMedia({reducedMotion})`, CDP, init scripts, tracing | Framework, not an auditor | **Our collector is built on it** |
| **Wappalyzer / BuiltWith** | Yes | No | Technology detection | No behavior data | Cross-check library detection |
| **PEAT / Harding test** | Manual, video | Flashing only | Photosensitive epilepsy analysis | Manual | Validating AA-A11Y-07 |
| **Sitespeed.io** | Yes | No | Open-source multi-URL perf monitoring with Grafana | No animation checks | Long-term monitoring alternative |

## What none of them do (why this tool exists)

1. **Reduced-motion compliance testing:** compare behavior with `prefers-reduced-motion` on and off.
2. **Animation inventory:** every animation and transition with its properties, duration, and easing.
3. **Layout-property animation detection** that covers transitions triggered by interaction and JS-library animations, not only CSS keyframes.
4. **Scroll jank measurement** with real wheel input.
5. **Scroll-hijack and smooth-scroll detection.**
6. **WCAG 2.2.2 pause-control heuristic** for auto-moving content.
7. **Cross-site comparison** of motion quality on one scale.

## Recommended stack

| Layer | Choice | Why |
|---|---|---|
| Browser automation | **Playwright** (Chromium) | Reduced-motion emulation, init scripts, CDP access, reliable waits |
| Perf baseline | **Lighthouse** Node API against the same Chromium (`--port`) | Avoids a second browser; standard metrics |
| A11y baseline | **@axe-core/playwright** | Runs inside the same page session |
| Field data | **PSI / CrUX API** (optional key) | Real-user CLS/INP next to the lab numbers |
| Runtime | Node 18+ | Same language as the in-page scripts |
| Output | JSON → Markdown/CSV/HTML renderers | Simple and diffable |

## Useful reference commands (for manual cross-checks)

```bash
# Lighthouse one URL, mobile, JSON
npx lighthouse https://example.com --only-categories=performance,accessibility --output=json --output-path=./lh.json

# Lighthouse CI over a list
npx @lhci/cli autorun --collect.url=https://a.com --collect.url=https://b.com

# Unlighthouse: crawl an entire site
npx unlighthouse --site https://example.com

# Pa11y CI over a list
npx pa11y-ci --sitemap https://example.com/sitemap.xml

# PageSpeed Insights API (field + lab)
curl "https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=https://example.com&strategy=mobile&key=$PSI_KEY"
```
