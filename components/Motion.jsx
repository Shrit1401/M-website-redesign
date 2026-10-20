"use client";

import { motion } from "motion/react";

export const EASE = [0.22, 1, 0.36, 1];

/** Soft fade, lift and un-blur once on scroll. */
export function Reveal({ children, delay = 0, y = 24, className, as = "div", ...rest }) {
  const Tag = motion[as];
  return (
    <Tag
      className={className}
      initial={{ opacity: 0, y, filter: "blur(6px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-8% 0px" }}
      transition={{ duration: 0.9, ease: EASE, delay }}
      {...rest}
    >
      {children}
    </Tag>
  );
}

/** Headline whose words drift up one by one. */
export function Words({ text, className, as = "h2", delay = 0, onMount = false }) {
  const Tag = motion[as];
  const parts = text.split(/(\{[^}]+\})/).filter(Boolean);
  let i = 0;
  return (
    <Tag
      className={className}
      initial="hidden"
      {...(onMount ? { animate: "show" } : { whileInView: "show", viewport: { once: true, margin: "-8% 0px" } })}
      transition={{ staggerChildren: 0.05, delayChildren: delay }}
    >
      {parts.map((part, p) => {
        const mark = part.startsWith("{");
        const words = part.replace(/[{}]/g, "").trim().split(/\s+/).filter(Boolean);
        return (
          <span key={p} className={mark ? "hl" : undefined}>
            {words.map((w) => w === "|" ? <br key={i++} /> : (
              <motion.span
                key={i++}
                className="word"
                variants={{
                  hidden: { opacity: 0, y: "0.35em", filter: "blur(8px)" },
                  show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.9, ease: EASE } },
                }}
              >
                {w}
              </motion.span>
            ))}
          </span>
        );
      })}
    </Tag>
  );
}

export function Arrow({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
