# 09 — Roadmap

## Phase 1 — MVP (v1)
- URL list input, concurrency pool, per-site isolation, retry + error capture
- Run A (normal) + Run B (reduced motion) collection in Chromium
- All **v1** checks in [03-checks-reference.md](03-checks-reference.md)
- Deduction scoring + grades
- `report.md`, `summary.json`, `summary.csv`, per-site JSON, screenshots
- Fixture suite + collector smoke tests ([07-validation.md](07-validation.md))
- `--fail-under` exit code for CI

**Exit criteria:** fixture suite green, and reference-set precision ≥ 0.9 for High-confidence checks.

## Phase 2 — Depth
- Lighthouse + axe integration (Run C) in the same browser session
- GSAP/inline-style animation detection via MutationObserver
- Hover sampling of interactive elements
- v2 checks: off-screen animations, heavy assets, page hidden until JS, hidden-but-focusable elements, hover media queries
- Mobile + desktop profiles in one run
- PSI/CrUX field data column
- Static HTML dashboard

## Phase 3 — Scale & history
- Sitemap crawling with template de-duplication (cluster URLs by DOM structure)
- Scheduled runs plus a run-to-run diff (new / resolved findings)
- Store results in SQLite/Postgres; trend charts per site
- Run comparison is blocked when the conditions differ
- PR comment integration for CI

## Phase 4 — Advanced checks
- **Flash detection** (AA-A11Y-07) from screen recordings using frame luminance diffs
- **Motion "energy" score:** total on-screen pixel movement per second, to quantify how busy a page is
- **Firefox/WebKit runs** for cross-browser behavior (where the APIs allow)
- **Authenticated pages** through stored login state
- **Interaction scripts** per URL (open menu, open modal, add to cart) to audit interaction animations
- **AI-assisted review:** feed the screen recording plus the inventory to a model to judge taste and choreography. Keep it advisory and never scored.

## Open questions
- Should the scroll-jank check use a CDP trace (more accurate, heavier) instead of a rAF sampler?
- Default device: mobile-first, or both always?
- How to weight Medium-confidence findings in the score: 0.5× or 1×?
- Where to host historical results for a team: a static site, or a small service?
