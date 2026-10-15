// A vector butterfly whose four wings map to the four ordering channels.
// active: index 0 upper-left, 1 upper-right, 2 lower-left, 3 lower-right, -1 none, "all".

const UPPER = "M200 196 C 214 132, 262 66, 326 62 C 372 60, 384 104, 366 146 C 346 190, 292 214, 236 210 C 220 209, 207 204, 200 200 Z";
const LOWER = "M200 206 C 232 210, 280 222, 300 262 C 318 298, 300 336, 264 332 C 232 328, 212 290, 204 252 C 201 236, 200 220, 200 210 Z";
const UPPER_VEINS = "M202 198 C 240 160, 290 116, 340 90 M206 200 C 250 186, 300 170, 352 150 M210 203 C 250 204, 296 200, 330 186";
const LOWER_VEINS = "M203 212 C 230 238, 258 268, 276 318 M204 214 C 240 228, 272 246, 296 272";

function Wing({ d, veins, lit, flip, id, delay }) {
  return (
    <g
      className={`wing ${lit ? "is-lit" : ""} ${flip ? "wing-left" : "wing-right"}`}
      style={{ animationDelay: `${delay}s` }}
    >
      <g transform={flip ? "translate(400 0) scale(-1 1)" : undefined}>
        <path d={d} className="wing-fill" fill={`url(#${id})`} />
        <path d={d} className="wing-line" />
        <path d={veins} className="wing-vein" />
      </g>
    </g>
  );
}

export default function WingButterfly({ active = -1, className = "", flap = true, uid = "wb" }) {
  const lit = (i) => active === "all" || active === i;
  return (
    <svg viewBox="40 40 320 320" className={`wing-butterfly ${flap ? "is-flapping" : ""} ${className}`} aria-hidden="true">
      <defs>
        <radialGradient id={`${uid}-g`} cx="0.15" cy="0.6" r="1">
          <stop offset="0" stopColor="#049952" />
          <stop offset="0.65" stopColor="#2fbf74" />
          <stop offset="1" stopColor="#9ff0c4" />
        </radialGradient>
      </defs>
      <Wing d={UPPER} veins={UPPER_VEINS} flip lit={lit(0)} id={`${uid}-g`} delay={0} />
      <Wing d={UPPER} veins={UPPER_VEINS} lit={lit(1)} id={`${uid}-g`} delay={0} />
      <Wing d={LOWER} veins={LOWER_VEINS} flip lit={lit(2)} id={`${uid}-g`} delay={0.08} />
      <Wing d={LOWER} veins={LOWER_VEINS} lit={lit(3)} id={`${uid}-g`} delay={0.08} />
      <g className="wing-body">
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
