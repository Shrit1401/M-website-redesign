"use client";

import { useEffect, useId, useRef } from "react";

// The leaf-wing butterfly from the Farasha emblem, traced from public/brand/emblem-512.png.
// Each side is one shape: a tall upper leaf with a crescent slit that leaves a thin blade
// pointing at the seam, pinched at the waist into a lower lobe. Traced as the right wing and
// mirrored for the left; the seam sits at x = 380.
const WING =
  "M 394 281 C 381 199, 473 87, 614 35 C 627 145, 581 262, 499 335 C 519 365, 523 422, 506 451 C 454 427, 416 384, 415 332 C 414 311, 425 289, 438 276 C 468 246, 495 200, 514 161 C 462 178, 419 219, 402 258 C 398 268, 396 276, 394 281 Z";

/** Farasha leaf butterfly. `flap` animates the wings folding toward the seam. */
export function LeafButterfly({ flap = false, slow = false, className = "", tone = "brand" }) {
  const id = useId().replace(/:/g, "");
  return (
    <svg
      viewBox="130 20 500 450"
      className={`leaf ${flap ? "is-flapping" : ""} ${slow ? "is-slow" : ""} leaf-${tone} ${className}`}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={`${id}l`} x1="0" y1="0" x2="0.35" y2="1">
          <stop offset="0" stopColor="var(--leaf-l1)" />
          <stop offset="1" stopColor="var(--leaf-l2)" />
        </linearGradient>
        <linearGradient id={`${id}r`} x1="1" y1="0" x2="0.65" y2="1">
          <stop offset="0" stopColor="var(--leaf-r1)" />
          <stop offset="1" stopColor="var(--leaf-r2)" />
        </linearGradient>
      </defs>
      <g className="leaf-wing leaf-left">
        <path d={WING} fill={`url(#${id}l)`} transform="translate(760 0) scale(-1 1)" />
      </g>
      <g className="leaf-wing leaf-right">
        <path d={WING} fill={`url(#${id}r)`} />
      </g>
    </svg>
  );
}

/**
 * A leaf butterfly that wanders inside the hero circle (`.arc-fill`) and drifts toward the
 * cursor, without ever leaving the circle.
 */
export function Flyer() {
  const wrap = useRef(null);
  const bug = useRef(null);
  const trail = useRef(null);

  useEffect(() => {
    const host = wrap.current?.parentElement;
    if (!host) return;
    // Circle geometry, relative to the host, read from the CSS so the two never drift apart.
    const circle = { x: 0, y: 0, r: 0 };
    let size = 0;
    const measure = () => {
      size = bug.current?.offsetWidth ?? size;
      const h = host.getBoundingClientRect();
      const c = host.querySelector(".arc-fill")?.getBoundingClientRect();
      if (c) {
        circle.x = c.left - h.left + c.width / 2;
        circle.y = c.top - h.top + c.height / 2;
        circle.r = c.width / 2;
      } else {
        circle.x = h.width * 0.72;
        circle.y = h.height * 0.45;
        circle.r = Math.min(h.width, h.height) * 0.25;
      }
    };
    measure();
    // Keep the whole butterfly (not just its centre) inside the circle.
    const keepIn = (x, y) => {
      const max = circle.r - size * 0.45;
      const dx = x - circle.x;
      const dy = y - circle.y;
      const d = Math.hypot(dx, dy);
      if (d <= max || d === 0) return [x, y];
      return [circle.x + (dx / d) * max, circle.y + (dy / d) * max];
    };

    const pos = { x: circle.x, y: circle.y };
    let angle = 0;
    const place = () => {
      if (!bug.current) return;
      bug.current.style.transform = `translate(${pos.x}px, ${pos.y}px) translate(-50%, -50%) rotate(${angle}rad)`;
      bug.current.style.opacity = 1;
    };
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      place();
      return;
    }

    const pointer = { x: 0, y: 0, at: -1e9 };
    const pts = [];
    let frame = 0;
    let t = 0;
    let id;
    let visible = true;

    const onMove = (e) => {
      const r = host.getBoundingClientRect();
      if (e.clientY < r.top || e.clientY > r.bottom) return;
      pointer.x = e.clientX - r.left;
      pointer.y = e.clientY - r.top;
      pointer.at = performance.now();
    };
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      cancelAnimationFrame(id);
      if (visible) id = requestAnimationFrame(tick);
    });

    function tick(now) {
      // The element can be gone for a frame while navigating away.
      if (!visible || !bug.current) return;
      t += 0.005;
      // A slow figure-of-eight around the centre of the circle.
      const a = circle.r * 0.5;
      let tx = circle.x + a * (Math.sin(t * 1.3) + 0.25 * Math.sin(t * 3.1));
      let ty = circle.y + a * 0.7 * (Math.sin(t * 2.6 + 0.8) + 0.25 * Math.cos(t * 4.1));
      if (window.innerWidth >= 700 && now - pointer.at < 2200) {
        tx = tx * 0.3 + (pointer.x + 60) * 0.7;
        ty = ty * 0.3 + (pointer.y - 40) * 0.7;
      }
      [tx, ty] = keepIn(tx, ty);
      const vx = (tx - pos.x) * 0.016;
      const vy = (ty - pos.y) * 0.016;
      [pos.x, pos.y] = keepIn(pos.x + vx, pos.y + vy);
      // Lean into the direction of travel, but never fly upside-down.
      const lean = Math.max(-0.6, Math.min(0.6, vx * 0.08));
      angle += (lean - angle) * 0.08;
      place();
      if (frame++ % 4 === 0) {
        pts.push([pos.x, pos.y + 30]);
        if (pts.length > 60) pts.shift();
        trail.current.setAttribute("d", pts.length > 1 ? "M" + pts.map((p) => p.map(Math.round).join(" ")).join(" L") : "");
      }
      id = requestAnimationFrame(tick);
    }

    window.addEventListener("pointermove", onMove);
    window.addEventListener("resize", measure);
    io.observe(host);
    return () => {
      cancelAnimationFrame(id);
      io.disconnect();
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("resize", measure);
    };
  }, []);

  return (
    <div ref={wrap} className="flyer" aria-hidden="true">
      <svg className="flyer-trail">
        <path ref={trail} />
      </svg>
      <div ref={bug} className="flyer-bug">
        <LeafButterfly flap />
      </div>
    </div>
  );
}
