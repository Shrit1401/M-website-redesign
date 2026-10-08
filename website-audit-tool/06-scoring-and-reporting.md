# 06 — Scoring & Reporting

## Score model

Each site starts at **100**. Every finding subtracts points by severity:

| Severity | Penalty | Cap per check ID |
|---|---|---|
| High | −15 | −30 |
| Medium | −7 | −14 |
| Low | −3 | −6 |
| Info | 0 | — |

- The **per-check cap** stops one noisy check from sinking a site. A finding counts once per check, with its evidence listing every affected element.
- The minimum is 0.
- **Category sub-scores** (Performance, Stability, Accessibility, UX) use the same formula restricted to each category. They show *where* a site loses points.
- Medium-confidence findings can be weighted at 0.5× if configured (`heuristicWeight: 0.5`).

| Score | Grade |
|---|---|
| 90–100 | A |
| 75–89 | B |
| 60–74 | C |
| 40–59 | D |
| 0–39 | F |
| error | — (excluded from averages) |

### Why a deduction model?
It is transparent: anyone can recompute a score from the findings list. It is also stable, because a new informational metric never changes old scores. Weighted-average models hide why a score moved.

## Reports

### `report.md`

```markdown
# Animation Audit — 2026-10-09

Conditions: Chromium 1xx · mobile 412×915 · CPU 4× · tool v1.0.0
Sites: 24 audited · 1 error · average score 71 (C)

## Summary
| Site | Score | Grade | Perf | Stab | A11y | UX | High | Med | Low | Libraries |
|------|------:|:-----:|-----:|-----:|-----:|---:|-----:|----:|----:|-----------|
| a.com | 92 | A | 100 | 100 | 85 | 90 | 0 | 1 | 1 | — |
| b.com | 46 | D | 70 | 85 | 55 | 94 | 2 | 3 | 2 | GSAP, Lenis |

## Most common findings
| Check | Sites affected | Severity |
|-------|---------------:|----------|
| AA-A11Y-01 No reduced-motion handling | 15 / 24 | High |
| AA-PERF-03 transition: all | 13 / 24 | Medium |

## b.com — 46 (D)
### [HIGH] AA-A11Y-02 Motion continues under reduced motion
- 9 of 11 moving animations still run with reduce enabled
- Examples: `div.hero__bg` (scale, infinite), `section.features .card` (translateY, 800 ms)
- Fix: wrap motion in `@media (prefers-reduced-motion: no-preference)` → animation-audit/04-accessibility.md
...
```

### `summary.csv`
One row per site: `url, status, score, grade, perf, stab, a11y, ux, high, medium, low, cls, p95FrameMs, jankPct, libraries, reducedMotionSupported, error`. Open it in a spreadsheet for sorting and charts.

### `summary.json`
The same data as the CSV plus the findings per site, for dashboards and diffing between runs.

### `sites/<slug>.json`
Full raw collection plus findings. This is the source of truth; everything else is derived from it.

### Optional HTML dashboard
A single static file: a sortable summary table, a per-site drill-down, screenshots, and a distribution chart of scores. Must work offline (no external requests).

## Comparing runs

- Only compare runs whose `conditions` match (browser major version, device, throttle). The report should warn when they do not.
- Show the delta per site: `score (Δ vs last run)`, plus **new** and **resolved** High/Medium findings.
- Treat a score change of **±5 or less** as noise unless the findings list changed.

## Writing good findings

Each finding in a report must answer:
1. **What:** a plain-language title.
2. **Where:** selectors or URL, with at most 5 examples and a total count.
3. **Evidence:** numbers (durations, frame times, CLS) and properties.
4. **Why it matters:** the user impact or WCAG reference.
5. **Fix:** one concrete instruction plus a link to the guide section.
