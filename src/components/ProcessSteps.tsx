"use client";

import { useRef } from "react";
import { motion, useScroll, useSpring } from "motion/react";
import { PROCESS } from "@/lib/content";
import { Reveal } from "./Motion";

export function ProcessSteps() {
  const ref = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 75%", "end 55%"] });
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });

  return (
    <ol ref={ref} className="relative pl-10 sm:pl-14">
      <span aria-hidden className="absolute top-0 bottom-0 left-[7px] w-px bg-line sm:left-[11px]" />
      <motion.span
        aria-hidden
        style={{ scaleY: progress }}
        className="absolute top-0 bottom-0 left-[7px] w-px origin-top bg-brand sm:left-[11px]"
      />
      {PROCESS.map((step, i) => (
        <li key={step.title} className="relative pb-16 last:pb-0">
          <span
            aria-hidden
            className="absolute top-3 -left-10 size-[15px] rounded-full border-4 border-bg bg-brand ring-1 ring-brand/30 sm:-left-14 sm:size-[23px] sm:border-[6px]"
          />
          <Reveal>
            <span className="block text-[clamp(3.5rem,7vw,6rem)] leading-none font-light tracking-[-0.05em] text-brand/20 tabular-nums">
              0{i + 1}
            </span>
            <h3 className="mt-4 text-2xl font-medium tracking-tight text-ink sm:text-3xl">{step.title}</h3>
            <p className="mt-3 max-w-md text-lg leading-relaxed text-muted">{step.body}</p>
          </Reveal>
        </li>
      ))}
    </ol>
  );
}
