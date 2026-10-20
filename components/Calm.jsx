"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { EASE, Reveal, Words } from "./Motion";

const STATES = [
  { key: "online", tone: "ok", title: "Online", body: "All screens in sync.", pill: ["ok", "Sent"] },
  { key: "offline", tone: "warn", title: "You’re offline.", body: "Orders are saved here and will sync automatically.", pill: ["warn", "Saved"] },
  { key: "queued", tone: "warn", title: "3 orders queued", body: "Service continues. Nothing is lost.", pill: ["warn", "Queued"] },
  { key: "syncing", tone: "sync", title: "Back online", body: "Syncing 3 orders…", pill: ["sync", "Syncing"] },
  { key: "synced", tone: "ok", title: "Synced", body: "3 orders sent to the kitchen.", pill: ["ok", "Sent"] },
];

export default function Calm() {
  const [i, setI] = useState(1);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => setI((n) => (n + 1) % STATES.length), 2600);
    return () => clearInterval(id);
  }, []);
  const s = STATES[i];
  return (
    <section className="section calm">
      <div className="container split">
        <div>
          <Reveal><p className="label label-mint">Voice</p></Reveal>
          <Words className="display" text="Calm in | {the rush.}" />
          <Reveal delay={0.1}>
            <p className="calm-text">
              Say what changed, where the order is, and what happens next. Offline and error states should
              reduce panic, not create it — written for guests, cashiers, servers and cooks.
            </p>
          </Reveal>
          <Reveal delay={0.2} className="say-avoid">
            <div>
              <p className="label label-mint">Say</p>
              <p>You’re offline. Orders are saved here and will sync automatically.</p>
            </div>
            <div>
              <p className="label label-warn">Avoid</p>
              <p>Network exception detected. Transaction replication has failed.</p>
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.15} className="status-demo">
          <div className="status-screen">
            <div className="screen-top">
              <img src="/brand/emblem-256.png" alt="" width="28" height="28" />
              <span className="label">Counter · Main St</span>
            </div>
            <div className="status-states" aria-hidden="true">
              {STATES.map((x, n) => <span key={x.key} className={n === i ? "is-on" : ""} />)}
            </div>
            <AnimatePresence mode="wait">
              <motion.div
                key={s.key}
                className={`status-toast tone-${s.tone}`}
                role="status"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.45, ease: EASE }}
              >
                <i aria-hidden="true" />
                <div>
                  <strong>{s.title}</strong>
                  <span>{s.body}</span>
                </div>
              </motion.div>
            </AnimatePresence>
            <ul className="status-orders">
              {[1043, 1044, 1045].map((n) => (
                <li key={n}>
                  <span>#{n}</span>
                  <em className={`pill pill-${s.pill[0]}`}>{s.pill[1]}</em>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

