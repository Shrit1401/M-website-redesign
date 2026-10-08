# 08 — Troubleshooting

| Symptom | Likely cause | Fix |
|---|---|---|
| Site returns 403 / captcha / blank screenshot | Bot protection (Cloudflare, Akamai) blocks headless browsers | Use a real Chrome user agent and headed mode (`headless: false` / new headless), slow down, run from a residential/office IP, or mark the site "blocked" and audit it manually. Never try to defeat captchas |
| Screenshot shows a cookie banner covering the page | Consent wall | Try to click common "Accept"/"Reject" buttons by text (Accept, Agree, Allow all, Reject all, OK) and known CMP selectors (OneTrust `#onetrust-accept-btn-handler`, Cookiebot, Didomi). If none match, record `consentWall: true` and continue. Note that banner animations get audited too |
| Navigation timeout | Slow site, or the `networkidle` wait never resolves because of analytics/websockets | Use `waitUntil: 'load'` (not `networkidle`) plus a fixed settle time; raise the timeout to 60–90 s for slow sites |
| `scrolledPx` is 0 | The page uses a custom scroller (scroll hijack), an inner scroll container, or a modal is blocking | This is itself a finding (AA-A11Y-05). Also try scrolling the largest scrollable element |
| No animations found on an obviously animated site | Animations run on `<canvas>`/WebGL (invisible to `getAnimations()`), or they start after interaction or later scroll | Report `canvases > 0` as info. Lengthen the scroll test, and add the hover sample |
| Library animations (GSAP) not in `getAnimations()` | GSAP writes inline styles every frame, so it creates no WAAPI objects | Detect it with a MutationObserver on `style` attributes during scroll, and record which properties change (e.g. `transform` vs `top`) |
| Jank numbers vary a lot between runs | Headless timing noise, CPU contention, too much concurrency | Lower the concurrency to 1–2, close other apps, take the median of 3 runs, and treat AA-PERF-04 as medium confidence |
| Every site gets AA-PERF-04 | rAF throttled (background tab or occluded window in headed mode) | Run headless, or keep the window in front. Check the frame-sampler smoke test (≥ 60 frames / 3 s) |
| `SecurityError` reading stylesheets | Cross-origin stylesheets are unreadable via CSSOM | Expected. Fall back to the response-body scan captured on the Node side |
| AA-A11Y-01 false positive | Reduced motion handled only in an external JS bundle that was > 2 MB or loaded lazily | Raise the body-scan limit, scan after scrolling, or confirm by hand: does Run B actually show less motion? AA-A11Y-02 is the behavioral source of truth |
| CLS much higher than PageSpeed field data | Our run includes scroll and late-loading content; lab ≠ field | Report lab and field side by side; trust field data for real users |
| SPA shows the loading skeleton only | Content renders after hydration / API calls | Wait for a selector (`main *`, `h1`) or a longer settle time per site via a CSV column |
| Different results on Mac vs Linux CI | Font rendering, GPU differences | Compare only within the same environment (condition fields must match) |
| Memory grows over a long run | Contexts not closed, large response bodies held | Close each context after each site, stream results to disk, and cap the body capture size |
| Redirect to a geo/locale site | Geo-IP redirects | Record `finalUrl`, and use explicit locale URLs in the list |

## Ethics & etiquette

- Only audit sites you own, have permission to test, or that are publicly accessible. Respect `robots.txt` for any crawling beyond the given URL list.
- Use concurrency of at most 1 per domain, with reasonable delays between page loads.
- Use an identifiable user agent with contact info when running at scale.
- Do not store personal data from pages beyond screenshots needed for evidence. Delete them when the audit is complete.
