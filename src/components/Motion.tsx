"use client";

import { useRef } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";

const EASE = [0.16, 1, 0.3, 1] as const;

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
        <span key={i} className="-mb-[0.08em] block overflow-hidden pb-[0.08em]">
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
