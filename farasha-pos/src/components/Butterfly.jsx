import { useEffect, useId, useRef } from "react";

// The leaf-wing butterfly from the Farasha emblem, traced as one right wing
// and mirrored for the left. Seam sits at x = 380.
const WING =
  "M397 268 C 440 196, 528 92, 612 30 C 636 116, 612 216, 548 262 C 528 280, 508 292, 494 304 C 526 330, 532 392, 497 438 C 448 412, 414 372, 412 326 C 410 300, 426 284, 444 268 C 474 232, 504 188, 520 156 C 478 178, 428 220, 397 268 Z";

/** Farasha leaf butterfly. `flap` animates the wings folding toward the seam. */
export function LeafButterfly({ flap = false, slow = false, className = "", tone = "brand" }) {
  const id = useId().replace(/:/g, "");
  return (
    <svg
      viewBox="150 10 460 450"
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

/** A leaf butterfly that wanders around its parent and drifts toward the cursor. */
export function Flyer({ start = [0.72, 0.36] }) {
  const wrap = useRef(null);
  const bug = useRef(null);
  const trail = useRef(null);

  useEffect(() => {
    const host = wrap.current?.parentElement;
    if (!host) return;
    let w = host.clientWidth;
    let h = host.clientHeight;
    const pos = w < 700 ? { x: w * 0.8, y: 128 } : { x: w * start[0], y: h * start[1] };
    let angle = 0;
    const place = () => {
      bug.current.style.transform = `translate(${pos.x}px, ${pos.y}px) translate(-50%, -50%) rotate(${angle}rad)`;
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
    const onResize = () => {
      w = host.clientWidth;
      h = host.clientHeight;
    };
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      cancelAnimationFrame(id);
      if (visible) id = requestAnimationFrame(tick);
    });

    function tick(now) {
      if (!visible) return;
      t += 0.005;
      // A slow figure-of-eight on the right of the hero; on phones, kept up top, clear of the copy.
      const narrow = w < 700;
      let tx = w * (narrow ? 0.76 + 0.12 * Math.sin(t * 1.3) : 0.7 + 0.2 * Math.sin(t * 1.3) + 0.05 * Math.sin(t * 3.1));
      let ty = narrow
        ? 128 + 14 * Math.sin(t * 2.6 + 0.8)
        : h * (0.42 + 0.22 * Math.sin(t * 2.6 + 0.8) + 0.05 * Math.cos(t * 4.1));
      if (!narrow && now - pointer.at < 2200) {
        tx = tx * 0.3 + (pointer.x + 60) * 0.7;
        ty = ty * 0.3 + (pointer.y - 40) * 0.7;
      }
      const vx = (tx - pos.x) * 0.016;
      const vy = (ty - pos.y) * 0.016;
      pos.x += vx;
      pos.y += vy;
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
    window.addEventListener("resize", onResize);
    io.observe(host);
    return () => {
      cancelAnimationFrame(id);
      io.disconnect();
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("resize", onResize);
    };
  }, [start]);

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
