"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { EASE } from "./Motion";
import { ORDER } from "@/lib/content";

// One order moving through every screen, on a loop.
const STAGES = [
  { where: "Counter", what: "Rung up · guest profile attached" },
  { where: "Kiosk", what: "Profile synced to every screen" },
  { where: "Kitchen", what: "Firing on the grill" },
  { where: "Ready", what: "Called for pickup" },
];

export default function HeroOrder() {
  const [i, setI] = useState(0);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => setI((n) => (n + 1) % STAGES.length), 2600);
    return () => clearInterval(id);
  }, []);
  const s = STAGES[i];

  return (
    <div className="hero-order" aria-hidden="true">
      <div className="hero-order-head">
        <span className="label">Order #{ORDER.no}</span>
        <span className="hero-order-live"><i /> Live</span>
      </div>
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.35, ease: EASE }}
        >
          <p className="hero-order-where">{s.where}</p>
          <p className="hero-order-what">{s.what}</p>
        </motion.div>
      </AnimatePresence>
      <div className="hero-order-steps">
        {STAGES.map((st, n) => (
          <span key={st.where} className={n <= i ? "is-on" : ""} />
        ))}
      </div>
    </div>
  );
}
