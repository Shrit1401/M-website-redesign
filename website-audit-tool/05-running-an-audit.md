# 05 — Running a Multi-Site Audit

The end-to-end workflow, from a list of sites to a prioritised report.

## Step 1 — Define the question

Write down what the audit is for, because the answer changes the setup:

| Goal | Setup |
|---|---|
| Compare competitors | Home + 1–2 key templates per site; mobile profile |
| Audit one large site | Sitemap crawl, one URL per template (dedupe by template) |
| Regression tracking | Same URL list and conditions, run on a schedule, diff against the last run |
| Pre-launch QA | Staging URLs, fail-under threshold in CI |

## Step 2 — Build the URL list

- One URL per line, or a CSV with `url,group,notes`.
- **Pick representative templates**, not 500 near-identical blog posts.
- Include the pages with the most motion: home, product/detail, pricing, any "experience" page.
- Remove duplicates, redirect chains, and login-only pages.

```
https://example.com/
https://example.com/pricing
https://another-site.com/
```

## Step 3 — Fix the conditions

Results are only comparable when the conditions match. Pick these and record them:

| Setting | Recommended default |
|---|---|
| Device | Mobile (412×915, DPR 2.625) **and** Desktop (1440×900) as separate runs |
| CPU throttle | 4× (mobile), 1× (desktop) |
| Network | Fast 4G for Lighthouse; unthrottled for the animation runs |
| Concurrency | 3 (more parallel tabs make the timing numbers noisier) |
| Settle time after load | 2 s |
| Scroll test | 3 viewports over 3 s |
| Machine | Same machine every time, other apps closed, plugged in (no battery saver) |

## Step 4 — Run

The run itself proceeds in this order:
1. Queue all URLs → per site: Run A (normal) → Run B (reduced motion) → Run C (Lighthouse/axe, optional).
2. Each site writes `sites/<slug>.json` as soon as it finishes, so a crash does not lose completed work.
3. Failed sites are retried once, then marked `error` with the reason.
4. After all sites finish: analyze → score → write `report.md`, `summary.json`, `summary.csv`.

Expected run time: about 15–25 s per site without Lighthouse, and 40–70 s with it. 50 sites at concurrency 3 take about 5–20 minutes.

## Step 5 — Sanity-check the run

Before you trust any numbers:
- [ ] Error rate < 10%. If it is higher, see [08-troubleshooting.md](08-troubleshooting.md) (bot blocks, cookie walls).
- [ ] Open 3–5 screenshots: did the real page load, or a captcha or cookie wall?
- [ ] Check that `scroll.scrolledPx > 0` for most sites. If it is 0 everywhere, the scroll test is broken.
- [ ] Spot-check one High finding per category by hand in DevTools.

## Step 6 — Triage findings

1. Sort by **severity, then the number of sites affected** (for a portfolio) or by severity, then effort (for one site).
2. Confirm every **Medium-confidence** High finding manually before you report it.
3. Group repeated findings: "12 of 40 sites animate `height` on accordions" is one recommendation.
4. Map each finding to a fix in the [animation guide](../animation-audit/README.md).

## Step 7 — Manual pass on the top items

Automation finds about 70% of the issues. For the worst 3–5 sites (or the top templates), do a 20-minute manual pass with [../animation-audit/07-audit-checklist.md](../animation-audit/07-audit-checklist.md). It covers taste, choreography, Safari, and real-device feel.

## Step 8 — Report and re-test

- Share `report.md` and the CSV.
- For fixes, re-run **only the affected URLs** with the same conditions and compare the scores.
- For regression tracking, keep each run's `summary.json` and diff the scores and the High findings over time.

## Running in CI

- Run against the preview deployment URL list on every PR.
- Fail the build if any page scores below the threshold (for example 75) or if any **new** High finding appears compared with `main`.
- Upload `report.md` as a build artifact and post the summary table as a PR comment.
- Use desktop + 1× CPU in CI for stability, and keep mobile-throttled runs for nightly jobs.
