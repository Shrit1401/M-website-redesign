"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValueEvent, useScroll, useTransform } from "motion/react";
import { LeafButterfly } from "./Butterfly";
import { APPS, ORDER } from "@/lib/content";

const money = (n) => n.toFixed(2);
const total = ORDER.items.reduce((s, i) => s + i.qty * i.price, 0);

function useTimer(running) {
  const [secs, setSecs] = useState(134);
  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => setSecs((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, [running]);
  return `${String(Math.floor(secs / 60)).padStart(2, "0")}:${String(secs % 60).padStart(2, "0")}`;
}

// Step 1: the order is rung up at the counter and the guest's profile is attached.
function Counter({ step }) {
  return (
    <div className="screen screen-light">
      <div className="screen-top">
        <img src="/brand/emblem-256.png" alt="" width="28" height="28" />
        <span className="label">Table 12 · #{ORDER.no}</span>
      </div>
      <div className="guest-chip">
        <span className="guest-avatar">{ORDER.guest.name[0]}</span>
        <span>{ORDER.guest.name}</span>
        <em>{ORDER.guest.points} pts</em>
      </div>
      <ul className="counter-lines">
        {ORDER.items.map((i, n) => (
          <li key={i.name} className="is-in" style={{ transitionDelay: `${n * 0.08}s` }}>
            <span>{i.qty}× {i.name}</span>
            <em>{money(i.qty * i.price)}</em>
          </li>
        ))}
      </ul>
      <div className="counter-total">
        <span>Total</span>
        <strong>{money(total)}</strong>
      </div>
      <div className="counter-status is-on">
        <i /> {step >= 1 ? "Paid · synced to every screen" : "Paid · card · tip added"}
      </div>
    </div>
  );
}

// Step 2: the same guest profile and order show up on the kiosk — it reflects everywhere.
function Kiosk({ step }) {
  const synced = step >= 1;
  return (
    <div className="screen screen-light">
      <div className="screen-top">
        <img src="/brand/emblem-256.png" alt="" width="28" height="28" />
        <span className="label">Self order</span>
      </div>
      <div className={`guest-banner ${synced ? "is-synced" : ""}`}>
        {synced ? (
          <>
            <span>Welcome back, {ORDER.guest.first}</span>
            <em>{ORDER.guest.points} pts · synced ✓</em>
          </>
        ) : (
          <span>Tap to sign in</span>
        )}
      </div>
      <div className="kiosk-grid">
        {ORDER.kiosk.map((k) => (
          <div key={k.name} className={`kiosk-tile ${k.img ? "" : "kiosk-tile-mist"}`}>
            {k.img && <img src={k.img} alt="" style={{ objectPosition: k.pos }} loading="lazy" />}
            <span>{k.name}</span>
          </div>
        ))}
      </div>
      <div className={`kiosk-cta ${synced ? "is-sent" : ""}`}>
        {synced ? `Order #${ORDER.no} · sent to kitchen ✓` : "Start an order"}
      </div>
    </div>
  );
}

function Kitchen({ step }) {
  const time = useTimer(step >= 2);
  return (
    <div className="screen screen-dark">
      <div className="screen-top">
        <img src="/brand/emblem-256.png" alt="" width="28" height="28" />
        <span className="label">Kitchen · Grill</span>
      </div>
      <div className={`kds-ticket ${step >= 2 ? "is-in" : ""}`}>
        <div className="kds-head">
          <strong>#{ORDER.no}</strong>
          <em>{step >= 2 ? time : "—"}</em>
        </div>
        {ORDER.kitchen.map(([q, n, s]) => (
          <div key={n} className="kds-line">
            <span>{q}× {n}</span>
            <em>{s}</em>
          </div>
        ))}
      </div>
      {step < 2 && <p className="kds-empty">No open tickets</p>}
    </div>
  );
}

const SCREENS = [Counter, Kiosk, Kitchen];

export default function Journey() {
  const ref = useRef(null);
  const [step, setStep] = useState(0);
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ["start start", "end end"] });

  useMotionValueEvent(p, "change", (v) => setStep(v < 0.34 ? 0 : v < 0.67 ? 1 : 2));

  // The butterfly carries the order from screen to screen in two arcs.
  const x = useTransform(p, [0, 0.2, 0.42, 0.53, 0.75, 1], ["16.66%", "16.66%", "50%", "50%", "83.33%", "83.33%"]);
  const y = useTransform(p, [0.2, 0.31, 0.42, 0.53, 0.64, 0.75], [0, -70, 0, 0, -70, 0]);
  const rotate = useTransform(p, [0.2, 0.3, 0.42, 0.53, 0.63, 0.75], [0, 12, 0, 0, 12, 0]);
  const fill = useTransform(p, [0, 1], ["0%", "100%"]);

  return (
    <section ref={ref} id="apps" className="journey" aria-label="Three apps, one service">
      <div className="journey-sticky">
        <div className="container journey-head">
          <div>
            <p className="label label-mint">Product ecosystem</p>
            <h2 className="display">Three apps.{" "}<br />One service.</h2>
          </div>
          <p className="journey-intro">
            The counter takes the order, the guest’s profile syncs to every screen, and the kitchen gets the ticket.
          </p>
        </div>

        <div className="container journey-stage" style={{ "--step": step }}>
          <motion.div className="journey-bfly" style={{ left: x, y, rotate }} aria-hidden="true">
            <LeafButterfly flap />
            <span className="journey-tag">#{ORDER.no}</span>
          </motion.div>
          <div className="journey-track">
            {APPS.map((a, i) => {
              const Screen = SCREENS[i];
              return (
                <div key={a.title} className={`journey-col ${step === i ? "is-active" : ""} ${step > i ? "is-done" : ""}`}>
                  <Screen step={step} />
                  <div className="journey-copy">
                    <span className="journey-num">0{i + 1}</span>
                    <p className="label">{a.kicker}</p>
                    <h3>{a.title}</h3>
                    <p>{a.body}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="container">
          <div className="journey-bar">
            <motion.span className="journey-bar-fill" style={{ width: fill }} aria-hidden="true" />
            <span>Offline-first local cache</span>
            <span>Cloud API + real-time sync</span>
            <span>Central menu + reporting</span>
          </div>
        </div>
      </div>
    </section>
  );
}
