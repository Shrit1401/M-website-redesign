"use client";

import { useEffect, useRef, useState } from "react";
import { animate, motion, useInView, useMotionValue, useSpring } from "motion/react";

export const EASE = [0.16, 1, 0.3, 1] as const;

/** Fade/slide a block in once it scrolls into view. */
export function Reveal({
  children,
  delay = 0,
  y = 28,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{ duration: 1, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  );
}

/** Headline where each line slides up from behind a mask. Pass one node per line. */
export function MaskLines({
  lines,
  className,
  as = "h2",
  delay = 0,
  onMount = false,
}: {
  lines: React.ReactNode[];
  className?: string;
  as?: "h1" | "h2" | "h3";
  delay?: number;
  onMount?: boolean;
}) {
  // The trigger lives on the heading: the inner lines start fully clipped by their masks,
  // so an IntersectionObserver on them would never fire.
  const Tag = motion[as];
  return (
    <Tag
      className={className}
      initial="hidden"
      {...(onMount ? { animate: "show" } : { whileInView: "show", viewport: { once: true, margin: "-8% 0px" } })}
      transition={{ staggerChildren: 0.09, delayChildren: delay }}
    >
      {lines.map((line, i) => (
        <span key={i} className="-mb-[0.1em] block overflow-hidden pb-[0.1em]">
          <motion.span
            className="block will-change-transform"
            variants={{ hidden: { y: "110%" }, show: { y: "0%", transition: { duration: 1.1, ease: EASE } } }}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}

/** Wrapper that pulls its child toward the cursor. */
export function Magnetic({ children, strength = 0.35 }: { children: React.ReactNode; strength?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 16, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 220, damping: 16, mass: 0.4 });

  return (
    <motion.span
      ref={ref}
      style={{ x: sx, y: sy }}
      className="inline-block"
      onPointerMove={(e) => {
        if (e.pointerType !== "mouse" || !ref.current) return;
        const r = ref.current.getBoundingClientRect();
        x.set((e.clientX - (r.left + r.width / 2)) * strength);
        y.set((e.clientY - (r.top + r.height / 2)) * strength);
      }}
      onPointerLeave={() => {
        x.set(0);
        y.set(0);
      }}
    >
      {children}
    </motion.span>
  );
}

/** Tracks the cursor inside the element as --mx/--my for CSS spotlight effects. */
export function Spotlight({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={className}
      onPointerMove={(e) => {
        const el = e.currentTarget;
        const r = el.getBoundingClientRect();
        el.style.setProperty("--mx", `${e.clientX - r.left}px`);
        el.style.setProperty("--my", `${e.clientY - r.top}px`);
      }}
    >
      {children}
    </div>
  );
}

/** Number that counts up the first time it scrolls into view. */
export function CountUp({ to, suffix = "" }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, to, { duration: 2, ease: EASE, onUpdate: (v) => setValue(Math.round(v)) });
    return () => controls.stop();
  }, [inView, to]);

  return (
    <span ref={ref}>
      {/* Screen readers and crawlers get the final number, not the animation. */}
      <span aria-hidden>
        {value.toLocaleString()}
        {suffix}
      </span>
      <span className="sr-only">
        {to.toLocaleString()}
        {suffix}
      </span>
    </span>
  );
}

/** Horizontal meter that fills to `value`% when it scrolls into view. */
export function Meter({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="flex items-baseline justify-between text-sm">
        <span className="font-medium text-ink">{label}</span>
        <span className="text-muted tabular-nums">
          <CountUp to={value} suffix="%" />
        </span>
      </div>
      <div
        className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-white/[0.06]"
        role="meter"
        aria-label={label}
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <motion.div
          className="h-full origin-left rounded-full bg-gradient-to-r from-violet-600 via-violet to-pink shadow-[0_0_14px_rgb(166_123_255/0.8)]"
          style={{ width: `${value}%` }}
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true, margin: "-10% 0px" }}
          transition={{ duration: 1.6, ease: EASE }}
        />
      </div>
    </div>
  );
}
