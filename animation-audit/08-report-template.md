# 08 — Animation Audit Report Template

Copy this file for each site or page you audit.

---

# Animation Audit — `<Site name>`

| Field | Value |
|---|---|
| URL(s) | |
| Date | |
| Auditor | |
| Devices / browsers | e.g. Pixel 6 Chrome, iPhone 13 Safari, MacBook Chrome 6× throttle |
| Reduced motion tested | Yes / No |
| Animation libraries found | e.g. GSAP 3.12 + ScrollTrigger, Lottie |
| **Score / Grade** | __ / 100 — _ |

## Summary

Three to five sentences: overall impression, biggest risks, and the most valuable fixes.

## Key metrics

| Metric | Value | Target | Status |
|---|---|---|---|
| Dropped frames (key animation, 6× CPU) | | < 5% | |
| Long animation frames during interaction | | 0 | |
| CLS | | ≤ 0.1 | |
| LCP | | ≤ 2.5 s | |
| INP | | ≤ 200 ms | |
| Non-composited animations (Lighthouse) | | 0 | |
| Respects reduced motion | | Yes | |
| Auto-moving content > 5 s without pause | | 0 | |

## Animation inventory

| # | Trigger | Element | Properties | Duration | Easing | Purpose | Verdict |
|---|---|---|---|---|---|---|---|
| 1 | | | | | | | Keep / Fix / Remove |

## Findings

### [HIGH] Short title
- **Where:** page / selector
- **What:** what is wrong, with evidence (trace screenshot, video, numbers)
- **Why it matters:** user impact, or the WCAG criterion
- **Fix:** a concrete change, ideally with a code snippet
- **Effort:** S / M / L

### [MEDIUM] …

### [LOW] …

## Quick wins (≤ 1 hour each)

1.
2.
3.

## Recommended motion tokens

```css
:root {
  --dur-fast: 150ms; --dur-base: 250ms; --dur-slow: 400ms;
  --ease-out: cubic-bezier(0.22, 1, 0.36, 1);
  --ease-in: cubic-bezier(0.55, 0, 1, 0.45);
}
```

## Re-test plan

- [ ] Re-run the checklist after fixes
- [ ] Compare the before/after Performance traces
- [ ] Confirm reduced motion on real iOS + Android
