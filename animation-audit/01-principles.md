# 01 — Principles of Good Web Animation

## 1. Motion must have a purpose

Every animation on a site should do at least one of these jobs:

| Purpose | Example | Question to ask |
|---|---|---|
| **Feedback** | A button presses down, a toggle slides, a form field shakes on error | Does the user know their action registered? |
| **Orientation / spatial model** | A drawer slides in from the edge it lives on; a card expands into a detail view | Does the user understand where things came from and went? |
| **Attention** | A new notification gently pulses once | Is this the *one* thing that needs attention right now? |
| **Continuity** | A shared element morphs between pages; a list item collapses instead of vanishing | Does the change feel like one connected interface? |
| **Status / waiting** | Skeleton shimmer, progress bar, spinner | Does the user know the system is working? |
| **Brand expression** | A signature hero reveal, used once | Is it short, skippable, and only in one place? |

If an animation does none of these jobs, it is decoration. Decoration costs performance, battery, accessibility, and the user's patience.

## 2. Motion is UI, not a show

- Users come to do something. Motion should help them do it faster, not make them wait.
- The best motion is often **noticed only when it is missing**.
- One strong animated moment per page is better than twenty small ones.

## 3. Follow the physical world, loosely

Disney's 12 principles of animation still apply. The ones that matter most for UI:

- **Easing (slow in / slow out):** real objects speed up and slow down. Constant speed (`linear`) looks mechanical. See [02](02-timing-and-easing.md).
- **Follow-through and overlap:** child elements can settle slightly after their parent. A short stagger gives this effect.
- **Anticipation:** a tiny wind-up before a big motion, such as a button scaling to 0.97 on press.
- **Arcs:** large movements look more natural on a slight curve than on a perfectly straight line.
- **Staging:** move one thing at a time when you can, so the eye knows where to look.
- **Exaggeration:** use very little in UI. Bounces and overshoots tire users quickly.

## 4. Consistency through a motion system

Treat motion like color and type. Define it once as tokens and reuse those tokens everywhere.

```css
:root {
  /* durations */
  --dur-instant: 100ms;  /* hover, press */
  --dur-fast:    150ms;  /* small UI: toggles, tooltips */
  --dur-base:    250ms;  /* most transitions */
  --dur-slow:    400ms;  /* large surfaces: drawers, modals */
  --dur-page:    600ms;  /* page / hero transitions, rare */

  /* easing */
  --ease-out:    cubic-bezier(0.22, 1, 0.36, 1);   /* entering */
  --ease-in:     cubic-bezier(0.55, 0, 1, 0.45);   /* exiting */
  --ease-in-out: cubic-bezier(0.65, 0, 0.35, 1);   /* moving on-screen A→B */
  --ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1); /* slight overshoot, use rarely */

  /* distance */
  --move-sm: 4px;
  --move-md: 12px;
  --move-lg: 24px;
}
```

Rules:
- No hard-coded `transition: 0.37s` scattered through the codebase.
- The same kind of element should always animate the same way. Every modal opens the same way.
- Document the system in the design system, for example "Modals: fade + scale 0.96→1, `--dur-slow`, `--ease-out`".

## 5. Hierarchy of motion

Not everything should move with the same intensity:

1. **Primary:** the element the user acted on, or the main content change.
2. **Secondary:** related elements that follow, with a smaller distance and a slight delay.
3. **Ambient:** background motion. Keep it rare, subtle, pausable, and off under reduced motion.

## 6. The user is always in control

- Animations never block clicks or scrolling. Input works during a transition.
- Long or looping motion can be paused. WCAG 2.2.2 requires this for motion longer than 5 seconds.
- Do not hijack scroll speed or direction. See [09-anti-patterns.md](09-anti-patterns.md).
- Intro and splash animations can be skipped, and they should not replay on every visit.

## 7. Performance is part of the design

An animation that drops frames looks broken, however good the design file looked. A 60 fps animation gives each frame **16.7 ms** of work, and a 120 Hz screen gives it **8.3 ms**. Design with that budget in mind. See [03-performance.md](03-performance.md).

## 8. Accessibility is part of the design

Some users feel nausea, dizziness, or migraines from motion, especially parallax, zooming, and large movements. Each design should include a reduced-motion version. See [04-accessibility.md](04-accessibility.md).
