# Animation Audit

A practical guide to auditing and improving the animation on any website. It covers the principles, the numbers, the performance rules, accessibility, and a checklist you can run against a real site.

## How to use this folder

1. Read **01–03** once to learn what good motion is and how to measure it.
2. Use **04–06** while you build or fix things.
3. Run **07-audit-checklist.md** against the site and record the results with **08-report-template.md**.

| File | What it covers |
|---|---|
| [01-principles.md](01-principles.md) | Why animate at all, and the rules that separate good motion from decoration |
| [02-timing-and-easing.md](02-timing-and-easing.md) | Durations, easing curves, stagger, and choreography, with numbers |
| [03-performance.md](03-performance.md) | The rendering pipeline, compositor-only properties, jank, layout shift, and measuring it all |
| [04-accessibility.md](04-accessibility.md) | `prefers-reduced-motion`, WCAG rules, vestibular safety, focus and screen readers |
| [05-patterns.md](05-patterns.md) | Recipes for hover, entrances, scroll reveals, page transitions, loaders, modals, and lists |
| [06-tooling-and-libraries.md](06-tooling-and-libraries.md) | CSS vs WAAPI vs GSAP vs Motion vs Lottie, and when to use each |
| [07-audit-checklist.md](07-audit-checklist.md) | A step-by-step audit with pass/fail criteria |
| [08-report-template.md](08-report-template.md) | A template for writing up the findings |
| [09-anti-patterns.md](09-anti-patterns.md) | Common mistakes and how to fix them |

## The short version

- **Every animation needs a job:** feedback, orientation, attention, or continuity. If it has none, remove it.
- **Keep it fast:** most UI motion should take 150–300 ms. Anything over 500 ms needs a strong reason.
- **Ease out when things enter, ease in when they leave.** Avoid `linear` for anything that moves.
- **Animate only `transform` and `opacity`** unless you have measured that something else is fine.
- **Respect `prefers-reduced-motion`.** It is required, not a nice extra.
- **Never block input.** The user can always click, scroll, or skip.
- **Measure it.** Use a DevTools Performance recording on a throttled mobile CPU, not your fast laptop.
