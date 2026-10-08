# 01 — Overview

## Problem

Auditing a site's animation by hand takes 1–3 hours per page template: DevTools traces, reduced-motion toggling, scrolling, inspecting CSS. Doing that for **many sites** is slow and inconsistent. Examples of many-site audits are competitor research, an agency portfolio, a client's 40 microsites, or tracking regressions over time. Different auditors also reach different conclusions.

## Goals

1. **Breadth:** audit 10–1,000 URLs in one run with bounded concurrency.
2. **Real behaviour:** measure in a real browser, not from static HTML. Animations only exist at runtime.
3. **Consistent results:** the same URL, under the same conditions, gives the same findings (within the stated noise margins).
4. **Actionable output:** every finding has an ID, severity, evidence (selector, numbers, screenshot), and a recommended fix that links to the [animation guide](../animation-audit/README.md).
5. **Comparable:** a single score and a cross-site table show which sites are best and worst, and why.
6. **Trustworthy:** every check is validated against known-good and known-bad fixtures before it is used (see [07-validation.md](07-validation.md)).

## Non-goals

- Replacing a human design review. The tool can tell that an animation is 1,200 ms long, but not whether it is *tasteful*.
- Full WCAG conformance testing. Only the motion-related criteria plus an axe pass are in scope.
- Auditing behind logins (possible later; see the roadmap).
- Load or stress testing.

## Users

| User | Needs |
|---|---|
| Front-end developer | Exact selectors and properties to fix; before/after comparison |
| Designer | Inventory of motion: durations, easings, consistency |
| Accessibility lead | Reduced-motion compliance, pause controls, flashing |
| Agency / PM | Cross-site score table; prioritised fix list |
| CI pipeline | Machine-readable JSON plus a pass/fail threshold |

## Inputs

- A URL list (text file, CSV, or sitemap URL). A CSV can carry extra columns such as `group` or `owner`.
- Options: device profile (desktop / mobile), CPU throttle, whether to run Lighthouse/axe, concurrency, timeouts, output directory, fail-under score.

## Outputs

- `report.md`: human-readable summary plus the per-site findings.
- `summary.json` / `summary.csv`: one row per site, for spreadsheets and dashboards.
- `sites/<slug>.json`: full raw data and findings per site.
- `sites/<slug>.png`: an above-the-fold screenshot (optional).
- Exit code `1` if any site scores below `--fail-under` (for CI).

## Definition of done (v1)

- [ ] Audits a list of 50 public URLs end-to-end without crashing; per-site failures are captured, not fatal.
- [ ] All checks in [03-checks-reference.md](03-checks-reference.md) marked **v1** are implemented.
- [ ] Every v1 check passes its fixture tests (true positive and true negative).
- [ ] Re-running the same 10 sites gives the same High/Medium findings in ≥ 90% of cases.
- [ ] Reports are produced in Markdown, JSON, and CSV.
