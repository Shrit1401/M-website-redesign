# Website Audit Tool

The design and operating guide for a tool that audits **many websites at once** for animation quality, performance, accessibility, and UX. It then turns the results into findings you can act on and compare across sites.

This folder describes what the tool checks, how it is put together, which existing tools it uses, how to run it, and how to **verify that every check does what it claims**.

> Companion guide: [`../animation-audit/`](../animation-audit/README.md) holds the standards these checks enforce.

## Contents

| File | What it covers |
|---|---|
| [01-overview.md](01-overview.md) | Goals, scope, users, and what "done" looks like |
| [02-architecture.md](02-architecture.md) | Pipeline: crawl → collect → analyze → score → report |
| [03-checks-reference.md](03-checks-reference.md) | Every check: ID, how it is measured, thresholds, severity |
| [04-existing-tools.md](04-existing-tools.md) | Lighthouse, Unlighthouse, PSI/CrUX, axe, Pa11y, WebPageTest, Playwright: what each is good for |
| [05-running-an-audit.md](05-running-an-audit.md) | Step-by-step workflow for auditing a list of sites |
| [06-scoring-and-reporting.md](06-scoring-and-reporting.md) | Scoring model, report formats, cross-site comparison |
| [07-validation.md](07-validation.md) | How to prove each check works: fixtures, ground truth, false-positive review |
| [08-troubleshooting.md](08-troubleshooting.md) | Bot blocks, cookie walls, flaky numbers, timeouts, SPAs |
| [09-roadmap.md](09-roadmap.md) | Phased build plan and future checks |

## One-paragraph summary

You give the tool a list of URLs. For each one it opens a real headless Chromium browser, twice: once normally and once with `prefers-reduced-motion: reduce`. It records every animation and transition, the frame timing while scrolling, layout shifts, long animation frames, the animation libraries in use, and whether reduced motion is respected. It also runs Lighthouse and axe for the standard performance and accessibility signals. Each check produces findings with a severity and evidence. The findings roll up into a 0–100 score per site, and the tool writes a per-site report plus a comparison table across all sites.
