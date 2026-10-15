import { useEffect, useRef } from "react";

// Wing shapes, drawn for the right side and mirrored for the left.
const UPPER = "M200 196 C 214 132, 262 66, 326 62 C 372 60, 384 104, 366 146 C 346 190, 292 214, 236 210 C 220 209, 207 204, 200 200 Z";
const LOWER = "M200 206 C 232 210, 280 222, 300 262 C 318 298, 300 336, 264 332 C 232 328, 212 290, 204 252 C 201 236, 200 220, 200 210 Z";
const UPPER_VEINS = "M202 198 C 240 160, 290 116, 340 90 M206 200 C 250 186, 300 170, 352 150 M210 203 C 250 204, 296 200, 330 186";
const LOWER_VEINS = "M203 212 C 230 238, 258 268, 276 318 M204 214 C 240 228, 272 246, 296 272";
const UPPER_SPOTS = [[318, 92, 7], [342, 120, 4.5], [300, 160, 3.5]];
const LOWER_SPOTS = [[272, 306, 5], [288, 282, 3]];

// One colour per channel: counter, kiosk, kitchen, online.
export const WING_COLORS = ["var(--wing-1)", "var(--wing-2)", "var(--wing-3)", "var(--wing-4)"];

const WINGS = [
  { d: UPPER, veins: UPPER_VEINS, spots: UPPER_SPOTS, flip: true },
  { d: UPPER, veins: UPPER_VEINS, spots: UPPER_SPOTS, flip: false },
  { d: LOWER, veins: LOWER_VEINS, spots: LOWER_SPOTS, flip: true },
  { d: LOWER, veins: LOWER_VEINS, spots: LOWER_SPOTS, flip: false },
];

/**
 * The Farasha butterfly. Four wings map to the four ordering channels.
 * highlight: wing index to emphasise (others dim), or -1 for none.
 */
export function Butterfly({ highlight = -1, flap = false, outline = false, className = "", onWing }) {
  return (
    <svg viewBox="40 40 320 320" className={`bfly ${flap ? "is-flapping" : ""} ${outline ? "is-outline" : ""} ${className}`} aria-hidden="true">
      {WINGS.map((w, i) => (
        <g
          key={i}
          className={`bfly-wing ${w.flip ? "bfly-left" : "bfly-right"} ${i > 1 ? "bfly-hind" : ""} ${highlight >= 0 && highlight !== i ? "is-dim" : ""}`}
          onPointerEnter={onWing ? () => onWing(i) : undefined}
        >
          <g transform={w.flip ? "translate(400 0) scale(-1 1)" : undefined}>
            <path d={w.d} className="bfly-fill" style={{ fill: WING_COLORS[i] }} />
            <path d={w.veins} className="bfly-vein" />
            {w.spots.map(([x, y, r]) => <circle key={`${x}${y}`} cx={x} cy={y} r={r} className="bfly-spot" />)}
            <path d={w.d} className="bfly-edge" />
          </g>
        </g>
      ))}
      <g className="bfly-body">
        <ellipse cx="200" cy="214" rx="5.5" ry="52" />
        <circle cx="200" cy="158" r="7" />
        <path d="M197 152 C 190 128, 176 110, 160 104" />
        <path d="M203 152 C 210 128, 224 110, 240 104" />
        <circle cx="160" cy="104" r="2.6" />
        <circle cx="240" cy="104" r="2.6" />
      </g>
    </svg>
  );
}

/** A butterfly that wanders around its parent, drifts toward the cursor and leaves a dotted trail. */
export function Flyer() {
  const wrap = useRef(null);
  const bug = useRef(null);
  const trail = useRef(null);

  useEffect(() => {
    const host = wrap.current?.parentElement;
    if (!host) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let w = host.clientWidth;
    let h = host.clientHeight;
    const pos = { x: w * 0.78, y: h * 0.3 };
    let angle = 0;
    const pointer = { x: 0, y: 0, active: false, at: 0 };
    const pts = [];
    let frame = 0;
    let id;
    let t = Math.random() * 100;
    let visible = true;

    const place = () => {
      bug.current.style.transform = `translate(${pos.x}px, ${pos.y}px) translate(-50%, -50%) rotate(${angle}rad)`;
    };
    if (reduced) {
      place();
      return;
    }

    const onMove = (e) => {
      const r = host.getBoundingClientRect();
      pointer.x = e.clientX - r.left;
      pointer.y = e.clientY - r.top;
      pointer.active = pointer.y > 0 && pointer.y < r.height;
      pointer.at = performance.now();
    };
    const onResize = () => {
      w = host.clientWidth;
      h = host.clientHeight;
    };
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible) id = requestAnimationFrame(tick);
    });

    function tick(now) {
      if (!visible) return;
      t += 0.006;
      // Wandering path: two slow sine waves per axis.
      let tx = w * (0.5 + 0.38 * Math.sin(t * 1.3) + 0.08 * Math.sin(t * 3.7));
      let ty = h * (0.45 + 0.3 * Math.sin(t * 1.9 + 1.2) + 0.08 * Math.cos(t * 4.3));
      // Curious about the cursor for a few seconds after it moves.
      if (pointer.active && now - pointer.at < 2500) {
        tx = tx * 0.35 + (pointer.x + 70) * 0.65;
        ty = ty * 0.35 + (pointer.y - 50) * 0.65;
      }
      const vx = (tx - pos.x) * 0.018;
      const vy = (ty - pos.y) * 0.018;
      pos.x += vx;
      pos.y += vy;
      const heading = Math.atan2(vy, vx) + Math.PI / 2;
      let diff = heading - angle;
      diff = Math.atan2(Math.sin(diff), Math.cos(diff));
      angle += diff * 0.06;
      place();

      if (frame++ % 4 === 0) {
        pts.push([pos.x, pos.y]);
        if (pts.length > 70) pts.shift();
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
  }, []);

  return (
    <div ref={wrap} className="flyer" aria-hidden="true">
      <svg className="flyer-trail">
        <path ref={trail} />
      </svg>
      <div ref={bug} className="flyer-bug">
        <Butterfly flap />
      </div>
    </div>
  );
}
