import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll, useTransform } from "motion/react";
import Lenis from "lenis";
import { Accent, ArrowUpRight, EASE, Magnetic, MaskLines, Reveal, ScrubText } from "./components/Motion.jsx";
import WingButterfly from "./components/WingButterfly.jsx";
import {
  BACK_OFFICE, FAQ, LOYALTY, NAV, PILOT, PROMO_LIMITS, PROMOTIONS, ROLES, SITE, WHY, WINGS,
} from "./content.js";

const ButterflyScene = lazy(() => import("./components/ButterflyScene.jsx"));

let lenis = null;
function scrollTo(target) {
  if (lenis) lenis.scrollTo(target, { offset: -24, duration: 1.4 });
  else document.querySelector(target)?.scrollIntoView({ behavior: "smooth" });
}

export default function App() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;
    lenis = new Lenis({ lerp: 0.09 });
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

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 1500);
    return () => clearTimeout(t);
  }, []);

  return (
    <>
      <a href="#main" className="skip-link">Skip to content</a>
      <AnimatePresence>{!loaded && <Intro key="intro" />}</AnimatePresence>
      <Header />
      <main id="main">
        <Hero ready={loaded} />
        <Manifesto />
        <Wings />
        <Band />
        <BackOffice />
        <Loyalty />
        <Why />
        <Roles />
        <Pilot />
        <Faq />
        <FinalCta />
      </main>
      <Footer />
      <div className="grain" aria-hidden="true" />
    </>
  );
}

/* ───────────────────────── Intro ───────────────────────── */

function Intro() {
  return (
    <motion.div
      className="intro"
      initial={{ clipPath: "inset(0 0 0% 0)" }}
      exit={{ clipPath: "inset(0 0 100% 0)" }}
      transition={{ duration: 1.1, ease: EASE }}
      aria-hidden="true"
    >
      <motion.div
        className="intro-mark"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, y: -30 }}
        transition={{ duration: 0.9, ease: EASE }}
      >
        <WingButterfly active="all" uid="intro" />
        <span className="intro-word" lang="ar" dir="rtl">{SITE.arabic}</span>
      </motion.div>
    </motion.div>
  );
}

/* ───────────────────────── Header ───────────────────────── */

function Logo({ className = "" }) {
  return (
    <span className={`logo ${className}`}>
      <img src="/logo.png" alt="" width="34" height="34" />
      <span className="logo-word">farasha</span>
    </span>
  );
}

function Header() {
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { scrollY, scrollYProgress } = useScroll();
  const last = useRef(0);

  useMotionValueEvent(scrollY, "change", (y) => {
    setHidden(y > last.current && y > 400 && !open);
    setScrolled(y > 40);
    last.current = y;
  });

  useEffect(() => {
    if (open) lenis?.stop();
    else lenis?.start();
    document.documentElement.style.overflow = open ? "hidden" : "";
  }, [open]);

  const go = (href) => (e) => {
    e.preventDefault();
    setOpen(false);
    scrollTo(href);
  };

  return (
    <>
      <motion.header
        className={`header ${scrolled ? "is-scrolled" : ""}`}
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: hidden ? -100 : 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: EASE, delay: hidden ? 0 : 0.1 }}
      >
        <a href="#top" onClick={go("#top")} aria-label="Farasha home" className="header-logo">
          <Logo />
        </a>
        <nav className="header-nav" aria-label="Primary">
          {NAV.map((n) => (
            <a key={n.href} href={n.href} onClick={go(n.href)}>{n.label}</a>
          ))}
        </nav>
        <div className="header-actions">
          <a className="btn btn-light btn-sm" href={`mailto:${SITE.quotesEmail}?subject=Farasha%20quote`}>
            Request a quote
          </a>
          <button
            className="menu-btn"
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((o) => !o)}
          >
            <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
            <span className={`menu-icon ${open ? "is-open" : ""}`} aria-hidden="true"><i /><i /></span>
          </button>
        </div>
        <motion.span className="header-progress" style={{ scaleX: scrollYProgress }} aria-hidden="true" />
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            className="mobile-menu"
            initial={{ clipPath: "circle(0% at 100% 0%)" }}
            animate={{ clipPath: "circle(150% at 100% 0%)" }}
            exit={{ clipPath: "circle(0% at 100% 0%)" }}
            transition={{ duration: 0.8, ease: EASE }}
          >
            <nav aria-label="Mobile">
              {[{ label: "Home", href: "#top" }, ...NAV].map((n, i) => (
                <motion.a
                  key={n.href}
                  href={n.href}
                  onClick={go(n.href)}
                  initial={{ y: 40, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.6, ease: EASE, delay: 0.2 + i * 0.045 }}
                >
                  <span className="mobile-num">0{i + 1}</span>
                  {n.label}
                </motion.a>
              ))}
            </nav>
            <div className="mobile-foot">
              <a href={`mailto:${SITE.contactEmail}`}>{SITE.contactEmail}</a>
              <span lang="ar" dir="rtl" className="arabic">{SITE.arabic}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

/* ───────────────────────── Hero ───────────────────────── */

function Hero({ ready }) {
  const ref = useRef(null);
  const progress = useRef(0);
  const [inView, setInView] = useState(true);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const copyY = useTransform(scrollYProgress, [0, 1], ["0%", "35%"]);
  const copyOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    progress.current = Math.min(1, v * 1.4);
    setInView(v < 0.999);
  });

  return (
    <section id="top" ref={ref} className="hero">
      <div className="hero-bg" aria-hidden="true" />
      <div className="hero-canvas" aria-hidden="true">
        <Suspense fallback={null}>
          <ButterflyScene
            progress={progress}
            active={inView}
            fallback={<WingButterfly active="all" uid="hero-fb" className="hero-fallback" />}
          />
        </Suspense>
      </div>

      <motion.div className="container hero-inner" style={{ y: copyY, opacity: copyOpacity }}>
        <motion.p
          className="eyebrow eyebrow-dark"
          initial={{ opacity: 0, y: 12 }}
          animate={ready ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, ease: EASE, delay: 0.2 }}
        >
          <span className="dot" /> Point of sale for coffee houses
        </motion.p>
        {ready && (
          <MaskLines
            as="h1"
            onMount
            delay={0.25}
            className="hero-title"
            lines={["Every counter, kiosk", "and online order,", <Accent key="a">in one place.</Accent>]}
          />
        )}
        {!ready && <h1 className="hero-title" style={{ visibility: "hidden" }}>Every counter, kiosk and online order, in one place.</h1>}
        <motion.div
          className="hero-foot"
          initial={{ opacity: 0, y: 20 }}
          animate={ready ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, ease: EASE, delay: 0.8 }}
        >
          <p className="hero-lede">
            Farasha — Arabic for <em>butterfly</em> — brings your register, kiosk, kitchen and online
            orders onto one menu, for coffee houses with more than one shop.
          </p>
          <div className="hero-ctas">
            <Magnetic>
              <a className="btn btn-primary btn-lg" href={`mailto:${SITE.quotesEmail}?subject=Farasha%20quote`}>
                Request a quote
                <span className="btn-arrow"><ArrowUpRight /></span>
              </a>
            </Magnetic>
            <a className="btn btn-ghost btn-lg" href={SITE.liveOrdering} target="_blank" rel="noreferrer">
              See a live ordering site
            </a>
          </div>
        </motion.div>
      </motion.div>

      <motion.div
        className="hero-meta container"
        initial={{ opacity: 0 }}
        animate={ready ? { opacity: 1 } : {}}
        transition={{ duration: 1.2, delay: 1.1 }}
      >
        <span className="arabic" lang="ar" dir="rtl">{SITE.arabic}</span>
        <span className="hero-pron">/fa·ˈraː·ʃa/ · n. butterfly</span>
        <button className="scroll-cue" onClick={() => scrollTo("#story")}>
          <span>Scroll</span>
          <i aria-hidden="true" />
        </button>
      </motion.div>
    </section>
  );
}

/* ───────────────────────── Manifesto ───────────────────────── */

function Manifesto() {
  return (
    <section id="story" className="section manifesto">
      <div className="container">
        <Reveal className="eyebrow"><span className="dot" /> Why a butterfly</Reveal>
        <ScrubText
          className="manifesto-text"
          text="A butterfly has four wings and one body. Your shop does too — the counter, the kiosk, the kitchen and the website, all moving *together* on a single menu, a single set of numbers, a single place to look."
        />
      </div>
    </section>
  );
}

/* ───────────────────────── Wings ───────────────────────── */

function Wings() {
  const [active, setActive] = useState(0);
  const refs = useRef([]);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(Number(e.target.dataset.index));
        });
      },
      { rootMargin: "-45% 0px -45% 0px" },
    );
    refs.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <section id="wings" className="section wings">
      <div className="container">
        <div className="section-head">
          <Reveal className="eyebrow"><span className="dot" /> Four ways to order</Reveal>
          <MaskLines className="h2" lines={["Four wings.", <>One <Accent>body.</Accent></>]} />
        </div>
        <div className="wings-grid">
          <div className="wings-sticky">
            <div className="wings-figure">
              <WingButterfly active={active} uid="wings" />
              <span className="wings-label" key={active}>
                {WINGS[active].wing} · {WINGS[active].title}
              </span>
            </div>
          </div>
          <ol className="wings-list">
            {WINGS.map((w, i) => (
              <li
                key={w.key}
                data-index={i}
                ref={(el) => (refs.current[i] = el)}
                className={`wing-panel ${active === i ? "is-active" : ""}`}
              >
                <WingButterfly active={i} flap={false} uid={`m-${w.key}`} className="wing-mini" />
                <span className="wing-num">0{i + 1}</span>
                <h3>{w.title}</h3>
                <p>{w.body}</p>
                <ul className="chips">
                  {w.points.map((p) => <li key={p}>{p}</li>)}
                </ul>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

/* ───────────────────────── Photo band ───────────────────────── */

function Band() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const scale = useTransform(scrollYProgress, [0, 1], [1.25, 1]);
  const y = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);
  const inset = useTransform(scrollYProgress, [0, 0.45], ["8%", "0%"]);
  const clip = useTransform(inset, (v) => `inset(0 ${v} round 28px)`);
  return (
    <section ref={ref} className="band" aria-label="Built for coffee houses">
      <motion.div className="band-frame" style={{ clipPath: clip }}>
        <motion.img src="/images/cafe.jpg" alt="A café counter with green pendant lamps and a lit CAFE sign" style={{ scale, y }} loading="lazy" />
        <div className="band-shade" />
        <div className="band-copy container">
          <MaskLines className="band-title" lines={["Built for coffee houses", <>with more than <Accent>one shop.</Accent></>]} />
        </div>
      </motion.div>
    </section>
  );
}

/* ───────────────────────── Back office ───────────────────────── */

const CHANNELS = [
  { label: "Counter", value: 46 },
  { label: "Online", value: 31 },
  { label: "Kiosk", value: 23 },
];

function BackOffice() {
  return (
    <section id="back-office" className="section">
      <div className="container split">
        <div>
          <Reveal className="eyebrow"><span className="dot" /> Back office</Reveal>
          <MaskLines className="h2" lines={["Every shop,", <>one <Accent>quiet</Accent> view.</>]} />
          <Reveal delay={0.1}>
            <p className="lede">Run the whole business from one place — menus, prices, people and the numbers behind them.</p>
          </Reveal>
          <ul className="hairline-list">
            {BACK_OFFICE.map((b, i) => (
              <Reveal as="li" key={b.title} delay={i * 0.06}>
                <h3>{b.title}</h3>
                <p>{b.body}</p>
                <span className="underline" aria-hidden="true" />
              </Reveal>
            ))}
          </ul>
        </div>

        <Reveal delay={0.15} className="dash">
          <div className="dash-top">
            <span className="dash-dots" aria-hidden="true"><i /><i /><i /></span>
            <span>Sales by channel</span>
            <span className="dash-tag">Sample data</span>
          </div>
          <div className="dash-total">
            <small>All locations · this week</small>
            <strong>3 shops</strong>
          </div>
          <div className="dash-bars">
            {CHANNELS.map((c, i) => (
              <div key={c.label} className="dash-row">
                <span>{c.label}</span>
                <div className="dash-track">
                  <motion.i
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: c.value / 50 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.6, ease: EASE, delay: 0.2 + i * 0.12 }}
                  />
                </div>
                <em>{c.value}%</em>
              </div>
            ))}
          </div>
          <div className="dash-foot">
            <span>By payment type</span>
            <span>By order type</span>
            <span>By employee</span>
          </div>
          <WingButterfly active="all" flap={false} uid="dash" className="dash-mark" />
        </Reveal>
      </div>
    </section>
  );
}

/* ───────────────────────── Promotions & loyalty ───────────────────────── */

function QrMock() {
  // Decorative QR-style grid (not a real code).
  const cells = [];
  let s = 7;
  const rnd = () => ((s = (s * 9301 + 49297) % 233280) / 233280);
  const finder = (x, y) =>
    [[0, 0], [14, 0], [0, 14]].some(([fx, fy]) => x >= fx && x < fx + 7 && y >= fy && y < fy + 7);
  for (let y = 0; y < 21; y++)
    for (let x = 0; x < 21; x++) {
      if (finder(x, y)) continue;
      if (rnd() > 0.52) cells.push(<rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" />);
    }
  const F = ({ x, y }) => (
    <g transform={`translate(${x} ${y})`}>
      <rect width="7" height="7" rx="1.6" fill="none" stroke="currentColor" strokeWidth="1" transform="translate(.5 .5) scale(.857)" />
      <rect x="2" y="2" width="3" height="3" rx=".8" />
    </g>
  );
  return (
    <svg viewBox="0 0 21 21" className="qr" aria-hidden="true">
      {cells}
      <F x={0} y={0} /><F x={14} y={0} /><F x={0} y={14} />
    </svg>
  );
}

function Loyalty() {
  return (
    <section id="loyalty" className="section loyalty">
      <div className="container">
        <div className="section-head section-head-split">
          <div>
            <Reveal className="eyebrow"><span className="dot" /> Promotions & loyalty</Reveal>
            <MaskLines className="h2" lines={["Reasons to", <>come <Accent>back.</Accent></>]} />
          </div>
          <Reveal delay={0.1}>
            <p className="lede">Offers that start and stop on their own, and rewards your regulars can join from the kiosk.</p>
          </Reveal>
        </div>

        <div className="loyalty-grid">
          <Reveal className="card card-promo">
            <span className="card-kicker">Promotions</span>
            <ul className="promo-types">
              {PROMOTIONS.map((p) => <li key={p}>{p}</li>)}
            </ul>
            <div className="promo-limits">
              <small>Limit by</small>
              <ul className="chips">
                {PROMO_LIMITS.map((p) => <li key={p}>{p}</li>)}
              </ul>
            </div>
            <p className="card-note">Ends automatically on its end date.</p>
          </Reveal>

          <Reveal delay={0.1} className="card card-poster">
            <div className="poster">
              <span className="poster-tag">Sample poster</span>
              <p className="poster-title">Double points</p>
              <p className="poster-time">Weekdays · 3–5 pm</p>
              <QrMock />
              <p className="poster-foot">Scan to join rewards</p>
            </div>
            <p className="card-note card-note-center">Every promotion gets its own QR code and printable poster.</p>
          </Reveal>

          <Reveal delay={0.2} className="card card-loyalty">
            <span className="card-kicker">Loyalty</span>
            <ul className="loyalty-list">
              {LOYALTY.map((l, i) => (
                <li key={l}><span>0{i + 1}</span>{l}</li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ───────────────────────── Why ───────────────────────── */

function Why() {
  return (
    <section className="section why">
      <div className="container">
        <div className="section-head">
          <Reveal className="eyebrow eyebrow-dark"><span className="dot" /> Why Farasha</Reveal>
          <MaskLines className="h2" lines={["Light on its feet.", <>Yours to <Accent>keep.</Accent></>]} />
        </div>
        <ol className="why-list">
          {WHY.map((w, i) => (
            <Reveal as="li" key={w.title} delay={i * 0.08}>
              <span className="why-num">0{i + 1}</span>
              <h3>{w.title}</h3>
              <p>{w.body}</p>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ───────────────────────── Roles ───────────────────────── */

function Roles() {
  return (
    <section className="section roles">
      <div className="container">
        <div className="section-head section-head-split">
          <div>
            <Reveal className="eyebrow"><span className="dot" /> Staff roles</Reveal>
            <MaskLines className="h2" lines={["The right access,", <>for <Accent>every</Accent> apron.</>]} />
          </div>
          <Reveal delay={0.1}>
            <p className="lede">Four roles, each one building on the last. Nobody sees more than their shift needs.</p>
          </Reveal>
        </div>
        <ol className="roles-steps">
          {ROLES.map((r, i) => (
            <motion.li
              key={r.title}
              style={{ "--step": i }}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10% 0px" }}
              transition={{ duration: 1, ease: EASE, delay: i * 0.1 }}
            >
              <span className="role-num">0{i + 1}</span>
              <h3>{r.title}</h3>
              <p>{r.body}</p>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ───────────────────────── Pilot ───────────────────────── */

function Pilot() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 80%", "end 60%"] });
  const scaleX = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const flyX = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section id="pilot" className="section pilot">
      <div className="container">
        <div className="section-head section-head-split">
          <div>
            <Reveal className="eyebrow"><span className="dot" /> Pilot program</Reveal>
            <MaskLines className="h2" lines={["Ninety days", <>to <Accent>decide.</Accent></>]} />
          </div>
          <Reveal delay={0.1}>
            <p className="lede">Try Farasha in one or two locations for 90 days. At the end, you choose whether to continue, expand, or stop.</p>
          </Reveal>
        </div>

        <div ref={ref} className="timeline">
          <div className="timeline-track" aria-hidden="true">
            <motion.span className="timeline-fill" style={{ scaleX }} />
            <motion.span className="timeline-fly" style={{ left: flyX }}>
              <WingButterfly active="all" uid="fly" />
            </motion.span>
            {Array.from({ length: 13 }).map((_, w) => (
              <span key={w} className="timeline-tick" style={{ left: `${(w / 12) * 100}%` }} />
            ))}
          </div>
          <ol className="timeline-steps">
            {PILOT.map((p, i) => (
              <Reveal as="li" key={p.title} delay={i * 0.08}>
                <span className="timeline-weeks">{p.weeks}</span>
                <h3>{p.title}</h3>
                <p>{p.body}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

/* ───────────────────────── FAQ ───────────────────────── */

function Faq() {
  const [open, setOpen] = useState(0);
  return (
    <section id="faq" className="section faq">
      <div className="container split split-faq">
        <div>
          <Reveal className="eyebrow"><span className="dot" /> Questions</Reveal>
          <MaskLines className="h2" lines={["Asked, and", <><Accent>answered.</Accent></>]} />
          <Reveal delay={0.1}>
            <p className="lede">
              Something else? Write to{" "}
              <a className="link" href={`mailto:${SITE.contactEmail}`}>{SITE.contactEmail}</a>
            </p>
          </Reveal>
        </div>
        <div className="faq-list">
          {FAQ.map((f, i) => {
            const isOpen = open === i;
            return (
              <Reveal key={f.q} delay={i * 0.06} className={`faq-item ${isOpen ? "is-open" : ""}`}>
                <h3>
                  <button
                    aria-expanded={isOpen}
                    aria-controls={`faq-${i}`}
                    id={`faq-btn-${i}`}
                    onClick={() => setOpen(isOpen ? -1 : i)}
                  >
                    {f.q}
                    <span className="faq-icon" aria-hidden="true" />
                  </button>
                </h3>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={`faq-${i}`}
                      role="region"
                      aria-labelledby={`faq-btn-${i}`}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.6, ease: EASE }}
                      className="faq-answer"
                    >
                      <p>{f.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ───────────────────────── Final CTA ───────────────────────── */

function FinalCta() {
  return (
    <section className="cta">
      <div className="cta-bg" aria-hidden="true" />
      <motion.div
        className="cta-butterfly"
        aria-hidden="true"
        animate={{ x: [0, 40, -30, 0], y: [0, -24, 12, 0], rotate: [-6, 4, -2, -6] }}
        transition={{ duration: 14, ease: "easeInOut", repeat: Infinity }}
      >
        <WingButterfly active="all" uid="cta" />
      </motion.div>
      <div className="container cta-inner">
        <Reveal className="eyebrow eyebrow-dark"><span className="dot" /> Let’s talk</Reveal>
        <MaskLines className="cta-title" lines={["Give your shops", <>their <Accent>wings.</Accent></>]} />
        <Reveal delay={0.15} className="cta-actions">
          <Magnetic>
            <a className="btn btn-primary btn-lg" href={`mailto:${SITE.quotesEmail}?subject=Farasha%20quote`}>
              Request a quote
              <span className="btn-arrow"><ArrowUpRight /></span>
            </a>
          </Magnetic>
          <a className="btn btn-ghost btn-lg" href={`mailto:${SITE.contactEmail}`}>
            {SITE.contactEmail}
          </a>
        </Reveal>
      </div>
    </section>
  );
}

/* ───────────────────────── Footer ───────────────────────── */

function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div>
          <Logo />
          <p className="footer-tag">{SITE.tagline}</p>
        </div>
        <nav aria-label="Footer" className="footer-links">
          {NAV.map((n) => (
            <a key={n.href} href={n.href} onClick={(e) => { e.preventDefault(); scrollTo(n.href); }}>{n.label}</a>
          ))}
        </nav>
        <div className="footer-links">
          <a href={`mailto:${SITE.contactEmail}`}>{SITE.contactEmail}</a>
          <a href={`mailto:${SITE.quotesEmail}`}>{SITE.quotesEmail}</a>
          <a href={SITE.liveOrdering} target="_blank" rel="noreferrer">Live ordering site ↗</a>
        </div>
      </div>
      <div className="container footer-word" aria-hidden="true">
        <span>farasha</span>
        <span className="arabic" lang="ar" dir="rtl">{SITE.arabic}</span>
      </div>
      <div className="container footer-base">
        <span>© {new Date().getFullYear()} Farasha POS Solutions</span>
        <span>A product of {SITE.parent}</span>
      </div>
    </footer>
  );
}
