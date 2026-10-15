import { useEffect, useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import Lenis from "lenis";
import { Arrow, EASE, Reveal, Words } from "./components/Motion.jsx";
import { Flyer, LeafButterfly } from "./components/Butterfly.jsx";
import Journey from "./components/Journey.jsx";
import { FAQ, FEATURES, NAV, PILLARS, PILOT, SITE } from "./content.js";

let lenis = null;
function scrollTo(target) {
  if (lenis) lenis.scrollTo(target, { offset: -72, duration: 1.2 });
  else document.querySelector(target)?.scrollIntoView({ behavior: "smooth" });
}
const quoteHref = `mailto:${SITE.quotesEmail}?subject=Farasha%20POS%20quote`;

export default function App() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    lenis = new Lenis({ lerp: 0.1 });
    let id;
    const raf = (t) => {
      lenis.raf(t);
      id = requestAnimationFrame(raf);
    };
    id = requestAnimationFrame(raf);
    return () => {
      cancelAnimationFrame(id);
      lenis.destroy();
      lenis = null;
    };
  }, []);

  return (
    <>
      <a href="#main" className="skip-link">Skip to content</a>
      <Header />
      <main id="main">
        <Hero />
        <Idea />
        <Journey />
        <Service />
        <Features />
        <Calm />
        <Pilot />
        <Faq />
        <Cta />
      </main>
      <Footer />
    </>
  );
}

/* ───────── Header ───────── */

/** Emblem + stacked FARASHA / POS SOLUTIONS, as the guidelines ask for in-product navigation. */
function Lockup() {
  return (
    <span className="lockup">
      <img src="/brand/emblem-256.png" alt="" width="40" height="40" />
      <span className="lockup-text">
        <span className="lockup-name">Farasha</span>
        <span className="lockup-sub">POS Solutions</span>
      </span>
    </span>
  );
}

function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, "change", (y) => setScrolled(y > 24));

  useEffect(() => {
    if (open) lenis?.stop();
    else lenis?.start();
  }, [open]);

  const go = (href) => (e) => {
    e.preventDefault();
    setOpen(false);
    scrollTo(href);
  };

  return (
    <header className={`header ${scrolled || open ? "is-solid" : ""}`}>
      <div className="container header-row">
        <a href="#top" onClick={go("#top")} aria-label="Farasha POS Solutions home"><Lockup /></a>
        <nav className="header-nav" aria-label="Primary">
          {NAV.map((n) => <a key={n.href} href={n.href} onClick={go(n.href)}>{n.label}</a>)}
        </nav>
        <div className="header-actions">
          <a className="header-link" href={SITE.liveOrdering} target="_blank" rel="noreferrer">Live ordering site ↗</a>
          <a className="btn btn-green btn-sm" href={quoteHref}>Request a quote</a>
          <button className="menu-btn" aria-expanded={open} aria-controls="mobile-menu" onClick={() => setOpen((o) => !o)}>
            <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
            <span className={`menu-icon ${open ? "is-open" : ""}`} aria-hidden="true"><i /><i /></span>
          </button>
        </div>
      </div>
      <AnimatePresence>
        {open && (
          <motion.nav
            id="mobile-menu"
            className="mobile-menu"
            aria-label="Mobile"
            initial={{ height: 0 }}
            animate={{ height: "auto" }}
            exit={{ height: 0 }}
            transition={{ duration: 0.5, ease: EASE }}
          >
            <div className="container">
              {NAV.map((n) => <a key={n.href} href={n.href} onClick={go(n.href)}>{n.label}</a>)}
              <a className="btn btn-green" href={quoteHref}>Request a quote</a>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}

/* ───────── Hero ───────── */

function Hero() {
  return (
    <section id="top" className="hero">
      <div className="hero-arcs" aria-hidden="true">
        <span className="arc arc-ring" />
        <span className="arc arc-fill" />
      </div>
      <Flyer />
      <div className="container hero-inner">
        <Reveal y={10}>
          <p className="label label-mint">Complete restaurant operating system</p>
        </Reveal>
        <Words as="h1" onMount delay={0.1} className="display hero-title" text="From first tap | {to final plate.}" />
        <Reveal delay={0.45}>
          <p className="hero-lede">
            Farasha POS Solutions connects self-order, counter service and kitchen fulfilment — so every
            team sees the same order moving forward.
          </p>
        </Reveal>
        <Reveal delay={0.6} className="hero-ctas">
          <a className="btn btn-green btn-lg" href={quoteHref}>Request a quote <Arrow /></a>
          <a className="btn btn-ghost btn-lg" href="#apps" onClick={(e) => { e.preventDefault(); scrollTo("#apps"); }}>
            See how it works
          </a>
        </Reveal>
      </div>
      <div className="container hero-foot">
        <span className="label">Self order</span>
        <span className="hero-foot-line" aria-hidden="true" />
        <span className="label">Counter</span>
        <span className="hero-foot-line" aria-hidden="true" />
        <span className="label">Kitchen</span>
      </div>
    </section>
  );
}

/* ───────── Brand idea ───────── */

function Idea() {
  return (
    <section className="section light">
      <div className="container idea">
        <Reveal><p className="label">Foundation</p></Reveal>
        <div className="idea-main">
          <Words className="display display-xl" text="One order. | {Every screen.}" />
          <Reveal delay={0.1}>
            <p className="idea-text">
              Farasha is the connected restaurant operating system: self-order, front counter and kitchen
              working from one menu, one order stream, and one source of truth.
            </p>
          </Reveal>
          <div className="pillars">
            {PILLARS.map((p, i) => (
              <Reveal key={p.title} delay={0.1 + i * 0.08} className="pillar">
                <p className="label label-ink">{p.title}</p>
                <p>{p.body}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ───────── Photography ───────── */

function Service() {
  return (
    <section className="service" aria-label="Service, in full flow">
      <div className="service-grid">
        <Reveal className="photo photo-tall" y={0}>
          <img src="/images/service-counter.jpg" alt="A server taking an order on a tablet at the counter" loading="lazy" />
          <h2 className="display service-title">Service,<br />in full flow.</h2>
          <span className="photo-tag">Front of house · Real service</span>
        </Reveal>
        <Reveal className="photo" y={0} delay={0.1}>
          <img src="/images/service-kiosk.jpg" alt="A guest ordering at a self-order kiosk" loading="lazy" />
          <span className="photo-tag">Guest · Self order</span>
        </Reveal>
        <Reveal className="photo" y={0} delay={0.2}>
          <img src="/images/service-kitchen.jpg" alt="Kitchen staff reading tickets on a kitchen display" loading="lazy" />
          <span className="photo-tag">Back of house · KDS</span>
        </Reveal>
      </div>
    </section>
  );
}

/* ───────── Features ───────── */

function Features() {
  return (
    <section id="features" className="section light">
      <div className="container">
        <div className="section-head">
          <div>
            <Reveal><p className="label">Beyond the counter</p></Reveal>
            <Words className="display" text="Everything that runs | {the restaurant.}" />
          </div>
          <Reveal delay={0.1}>
            <p className="section-intro">Built for coffee houses and multi-location food service. One menu across every shop, and the numbers behind it.</p>
          </Reveal>
        </div>
        <div className="features">
          {FEATURES.map((f, i) => (
            <Reveal key={f.title} delay={(i % 3) * 0.08} className="feature">
              <p className="label">{f.kicker}</p>
              <h3>{f.title}</h3>
              <p>{f.body}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ───────── Calm in the rush ───────── */

const STATES = [
  { key: "online", tone: "ok", title: "Online", body: "All screens in sync.", pill: ["ok", "Sent"] },
  { key: "offline", tone: "warn", title: "You’re offline.", body: "Orders are saved here and will sync automatically.", pill: ["warn", "Saved"] },
  { key: "queued", tone: "warn", title: "3 orders queued", body: "Service continues. Nothing is lost.", pill: ["warn", "Queued"] },
  { key: "syncing", tone: "sync", title: "Back online", body: "Syncing 3 orders…", pill: ["sync", "Syncing"] },
  { key: "synced", tone: "ok", title: "Synced", body: "3 orders sent to the kitchen.", pill: ["ok", "Sent"] },
];

function Calm() {
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

/* ───────── Pilot ───────── */

function Pilot() {
  return (
    <section id="pilot" className="section light">
      <div className="container">
        <div className="section-head">
          <div>
            <Reveal><p className="label">Pilot program</p></Reveal>
            <Words className="display" text="Ninety days. | {Your decision.}" />
          </div>
          <Reveal delay={0.1}>
            <p className="section-intro">Run Farasha in one or two locations. At week twelve you decide whether to continue, expand, or stop.</p>
          </Reveal>
        </div>
        <ol className="pilot">
          {PILOT.map((p, i) => (
            <Reveal as="li" key={p.title} delay={i * 0.08} className="pilot-step">
              <span className="pilot-num">0{i + 1}</span>
              <p className="label">{p.weeks}</p>
              <h3>{p.title}</h3>
              <p>{p.body}</p>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ───────── FAQ ───────── */

function Faq() {
  return (
    <section id="faq" className="section light faq-section">
      <div className="container split split-top">
        <div>
          <Reveal><p className="label">Questions</p></Reveal>
          <Words className="display" text="Asked | {and answered.}" />
          <Reveal delay={0.1}>
            <p className="section-intro">
              Anything else? <a className="link" href={`mailto:${SITE.contactEmail}`}>{SITE.contactEmail}</a>
            </p>
          </Reveal>
        </div>
        <div className="faq-list">
          {FAQ.map((f, i) => (
            <Reveal key={f.q} delay={i * 0.05}>
              <details className="faq-item" open={i === 0}>
                <summary>
                  {f.q}
                  <span className="faq-plus" aria-hidden="true" />
                </summary>
                <p>{f.a}</p>
              </details>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ───────── CTA ───────── */

function Cta() {
  return (
    <section className="cta">
      <div className="hero-arcs cta-arcs" aria-hidden="true">
        <span className="arc arc-ring" />
      </div>
      <div className="container cta-inner">
        <Reveal className="cta-bfly" y={0}>
          <LeafButterfly flap slow />
        </Reveal>
        <Words className="display display-xl" text="Every order, | {moving together.}" />
        <Reveal delay={0.15}>
          <p className="cta-text">Start with a 90-day pilot. Set up in about two weeks, trained in one.</p>
        </Reveal>
        <Reveal delay={0.25} className="hero-ctas cta-ctas">
          <a className="btn btn-green btn-lg" href={quoteHref}>Request a quote <Arrow /></a>
          <a className="btn btn-ghost btn-lg" href={`mailto:${SITE.contactEmail}`}>{SITE.contactEmail}</a>
        </Reveal>
      </div>
    </section>
  );
}

/* ───────── Footer ───────── */

function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-top">
        <img className="footer-wordmark" src="/brand/wordmark.png" alt="Farasha POS Solutions" width="600" height="225" loading="lazy" />
        <div className="footer-cols">
          <nav aria-label="Footer" className="footer-links">
            <p className="label label-mint">Product</p>
            {NAV.map((n) => (
              <a key={n.href} href={n.href} onClick={(e) => { e.preventDefault(); scrollTo(n.href); }}>{n.label}</a>
            ))}
          </nav>
          <div className="footer-links">
            <p className="label label-mint">Contact</p>
            <a href={`mailto:${SITE.contactEmail}`}>{SITE.contactEmail}</a>
            <a href={`mailto:${SITE.quotesEmail}`}>{SITE.quotesEmail}</a>
            <a href={SITE.liveOrdering} target="_blank" rel="noreferrer">order.farashapos.com ↗</a>
          </div>
        </div>
      </div>
      <div className="container footer-base">
        <span>© {new Date().getFullYear()} Farasha POS Solutions</span>
        <span>{SITE.positioning}</span>
        <span>A product of {SITE.parent}</span>
      </div>
    </footer>
  );
}
