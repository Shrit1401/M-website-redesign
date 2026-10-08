# 02 — Timing, Easing & Choreography

## Duration guidelines

| Interaction | Duration | Notes |
|---|---|---|
| Hover color / opacity change | 100–150 ms | Must feel instant |
| Button press (scale) | 80–120 ms | Press quickly; release can take up to 200 ms |
| Tooltip / dropdown appear | 120–200 ms | Disappear faster than appear |
| Toggle / checkbox / switch | 150–200 ms | |
| Accordion expand | 200–300 ms | Scale the duration with the height, capped at about 400 ms |
| Modal / dialog open | 200–300 ms | Close in about 150–200 ms |
| Drawer / side sheet | 250–350 ms | |
| Page / route transition | 300–500 ms | Never block navigation |
| Hero / brand reveal (once) | 600–1200 ms | Skippable; never on every route |
| Skeleton shimmer loop | 1200–2000 ms per cycle | Off under reduced motion |

**Rules of thumb**
- **Exits are faster than entrances**, at about 60–80% of the entrance duration. Users have already decided to leave.
- **Larger distance needs a longer duration**, though the duration should grow more slowly than the distance. Mobile screens need shorter durations than desktop because the distances are shorter.
- **Under 100 ms** looks like a glitch or goes unnoticed. **Over 500 ms** for routine UI feels slow.
- When users repeat an action often, such as tabs or menus, make it faster and simpler.

## Easing

| Easing | Use for | CSS |
|---|---|---|
| **Ease-out** (decelerate) | Things entering or appearing | `cubic-bezier(0.22, 1, 0.36, 1)` |
| **Ease-in** (accelerate) | Things leaving or disappearing | `cubic-bezier(0.55, 0, 1, 0.45)` |
| **Ease-in-out** | Things moving from one on-screen spot to another | `cubic-bezier(0.65, 0, 0.35, 1)` |
| **Linear** | Opacity-only fades, progress bars, spinners, color cycling | `linear` |
| **Spring / overshoot** | Playful, tactile moments only, sparingly | `cubic-bezier(0.34, 1.56, 0.64, 1)` or `linear()` springs |

- The CSS keyword `ease` is a reasonable default, but it is not ideal for entrances. Prefer a stronger ease-out.
- Do not use `linear` on movement. It looks robotic.
- Modern CSS supports `linear()` for real spring and bounce curves without JavaScript:

```css
--ease-spring: linear(0, 0.009, 0.035 2.1%, 0.141, 0.281 6.7%, 0.723 12.9%, 0.938 16.7%,
  1.017, 1.077, 1.121, 1.149 24.3%, 1.159, 1.163, 1.161, 1.154 29.9%, 1.129 32.8%,
  1.051 39.6%, 1.017 43.1%, 0.991, 0.977 51%, 0.974 53.8%, 0.975 57.1%, 0.997 69.8%,
  1.003 76.9%, 1);
```

Tools for generating curves: easings.net, cubic-bezier.com, and the "linear() easing generator" by Jake Archibald.

## Distance

- Entrance slide distance should be **small: 8–24 px**. Elements should drift into place, not fly across the screen.
- Scale entrances should start at **0.95–0.98**, not 0. Scaling from 0 looks cheap and also causes vestibular issues.
- Rotation should almost never be part of routine UI motion.

## Stagger & choreography

Staggering lists and grids helps the eye follow the order.

- **Per-item delay: 20–60 ms.**
- **Cap the total stagger** at about 300–400 ms. In a 50-item list, items 10 and later should appear together or appear without animation.
- Stagger in **reading order**: top-left to bottom-right.
- Animate the **container first, then its content**. The modal backdrop appears, then the panel, then the panel content.
- Do not animate everything at once. Do not chain animations so far that the user waits for the last one.

```css
.list > * {
  animation: rise var(--dur-base) var(--ease-out) both;
  animation-delay: calc(min(var(--i), 8) * 40ms); /* set --i inline per item; caps at 8 */
}
@keyframes rise { from { opacity: 0; transform: translateY(12px); } }
```

## Interruptibility

A user who reverses an action halfway through, such as hovering out before a hover animation ends, should see a smooth reversal, not a jump.

- **CSS transitions** reverse smoothly by default. Prefer them for state changes like hover, open/closed, and active.
- **CSS keyframe animations** do not reverse. Restarting one mid-flight causes a jump.
- **JS libraries** (Motion, GSAP) can interrupt and retarget. Use that ability for draggable and gesture-driven UI.

## Delays

- Do not add a delay before feedback. Hover and press responses start on the next frame.
- Small delays are acceptable for **hover-intent** (about 100–200 ms before a mega-menu opens) to prevent accidental triggers.
- Do not add an artificial delay to make a site "feel premium". It reads as slow.
