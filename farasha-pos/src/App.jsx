import { useEffect, useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import Lenis from "lenis";
import { Arrow, EASE, Reveal, Words } from "./components/Motion.jsx";
import { Butterfly, Flyer } from "./components/Butterfly.jsx";
import Demo from "./components/Demo.jsx";
import {
  BACK_OFFICE, FAQ, LOYALTY, NAV, PERMISSIONS, PILOT, PROMO_LIMITS, PROMOTIONS, ROLES, SITE, WHY, WINGS,
} from "./content.js";

let lenis = null;
function scrollTo(target) {
  if (lenis) lenis.scrollTo(target, { offset: -80, duration: 1.2 });
  else document.querySelector(target)?.scrollIntoView({ behavior: "smooth" });
}
const quoteHref = `mailto:${SITE.quotesEmail}?subject=Farasha%20quote`;

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
        <Specimen />
        <BackOffice />
        <Loyalty />
        <Why />
        <Roles />
        <Pilot />
        <Faq />
        <Cta />
      </main>
      <Footer />
    </>
  );
}

/* ───────── Header ───────── */

function Logo() {
  return (
    <span className="logo">
      <img src="/logo.png" alt="" width="36" height="36" />
      <span>Farasha</span>
    </span>
  );
}

function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, "change", (y) => setScrolled(y > 20));

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
    <header className={`header ${scrolled ? "is-scrolled" : ""}`}>
      <div className="container header-row">
        <a href="#top" onClick={go("#top")} aria-label="Farasha home"><Logo /></a>
        <nav className="header-nav" aria-label="Primary">
          {NAV.map((n) => <a key={n.href} href={n.href} onClick={go(n.href)}>{n.label}</a>)}
        </nav>
        <div className="header-actions">
          <a className="header-link" href={SITE.liveOrdering} target="_blank" rel="noreferrer">Live site ↗</a>
          <a className="btn btn-green btn-sm" href={quoteHref}>Request a quote</a>
          <button className="menu-btn" aria-expanded={open} aria-controls="mobile-menu" onClick={() => setOpen((o) => !o)}>
            {open ? "Close" : "Menu"}
          </button>
        </div>
      </div>
      <AnimatePresence>
        {open && (
          <motion.nav
            id="mobile-menu"
            className="mobile-menu"
            aria-label="Mobile"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
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
      <Flyer />
      <div className="container hero-inner">
        <Reveal className="hero-labels" y={10}>
          <span className="mono-label">Fig. 1 — <span lang="ar" dir="rtl" className="arabic">{SITE.arabic}</span> farāsha, n. butterfly</span>
          <span className="mono-label">Point of sale for coffee houses</span>
        </Reveal>
        <Words
          as="h1"
          onMount
          delay={0.1}
          className="hero-title"
          text="Every counter, kiosk and online order, {in one place.}"
        />
        <Reveal delay={0.5} className="hero-sub">
          <p>
            One menu for the register, the kiosk, the kitchen and your own ordering site —
            built for coffee houses with more than one shop.
          </p>
          <div className="hero-ctas">
            <a className="btn btn-green btn-lg" href={quoteHref}>Request a quote <Arrow /></a>
            <a className="btn btn-line btn-lg" href="#demo" onClick={(e) => { e.preventDefault(); scrollTo("#demo"); }}>Try the demo</a>
          </div>
        </Reveal>
      </div>
      <Reveal delay={0.7} className="container hero-demo" id="demo">
        <Demo />
        <p className="demo-caption mono-label">Interactive demo · sample café · tap items, switch channels, send to the kitchen</p>
      </Reveal>
    </section>
  );
}

/* ───────── Specimen plate: the four wings ───────── */

function Specimen() {
  const [hover, setHover] = useState(-1);
  const order = [0, 1, 2, 3];
  return (
    <section id="wings" className="section specimen">
      <div className="container">
        <div className="head-center">
          <Reveal className="mono-label">Plate II · Four ways to order</Reveal>
          <Words className="h2" text="Four wings, {one body.}" />
          <Reveal delay={0.1}>
            <p className="lede">Every channel runs on the same menu, the same prices and the same numbers — so your shops move together.</p>
          </Reveal>
        </div>

        <div className="plate" onPointerLeave={() => setHover(-1)}>
          <Reveal className="plate-figure" y={0}>
            <Butterfly highlight={hover} flap onWing={setHover} />
            <p className="mono-label plate-caption">Papilio farasha — four wings, one body</p>
          </Reveal>
          {order.map((i) => {
            const w = WINGS[i];
            return (
              <Reveal
                key={w.key}
                delay={i * 0.08}
                className={`plate-card plate-${i} ${hover === i ? "is-on" : ""}`}
                onPointerEnter={() => setHover(i)}
                onFocus={() => setHover(i)}
                tabIndex={0}
              >
                <span className="plate-key" style={{ background: `var(--wing-${i + 1})` }}>{w.wing}</span>
                <h3>{w.title}</h3>
                <p>{w.body}</p>
                <ul className="tags">{w.points.map((p) => <li key={p}>{p}</li>)}</ul>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ───────── Back office ───────── */

const REPORT = [
  { label: "Counter", value: 46, color: "var(--wing-1)" },
  { label: "Online", value: 31, color: "var(--wing-4)" },
  { label: "Kiosk", value: 23, color: "var(--wing-2)" },
];

function BackOffice() {
  return (
    <section id="back-office" className="section">
      <div className="container split">
        <div>
          <Reveal className="mono-label">Back office</Reveal>
          <Words className="h2" text="All your shops, {one view.}" />
          <Reveal delay={0.1}>
            <p className="lede">Change a price once and every counter, kiosk and online menu follows. See how each shop is really doing.</p>
          </Reveal>
          <div className="features">
            {BACK_OFFICE.map((b, i) => (
              <Reveal key={b.title} delay={i * 0.06} className="feature">
                <span className="feature-dot" style={{ background: `var(--wing-${i + 1})` }} />
                <h3>{b.title}</h3>
                <p>{b.body}</p>
              </Reveal>
            ))}
          </div>
        </div>

        <Reveal delay={0.15} className="report">
          <div className="report-head">
            <div>
              <p className="mono-label">Sales by channel</p>
              <p className="report-title">All locations</p>
            </div>
            <span className="report-tag">Sample data</span>
          </div>
          <div className="report-stack" aria-hidden="true">
            {REPORT.map((r, i) => (
              <motion.span
                key={r.label}
                style={{ background: r.color, width: `${r.value}%` }}
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.2, ease: EASE, delay: 0.2 + i * 0.15 }}
              />
            ))}
          </div>
          <ul className="report-legend">
            {REPORT.map((r) => (
              <li key={r.label}>
                <i style={{ background: r.color }} />
                <span>{r.label}</span>
                <strong>{r.value}%</strong>
              </li>
            ))}
          </ul>
          <div className="report-filters">
            <span className="is-on">Channel</span>
            <span>Payment type</span>
            <span>Order type</span>
            <span>Employee</span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ───────── Promotions & loyalty ───────── */

function QrMock() {
  // Decorative QR-style grid (not a real code).
  const cells = [];
  let s = 11;
  const rnd = () => (s = (s * 9301 + 49297) % 233280) / 233280;
  const finder = (x, y) => [[0, 0], [14, 0], [0, 14]].some(([fx, fy]) => x >= fx && x < fx + 7 && y >= fy && y < fy + 7);
  for (let y = 0; y < 21; y++)
    for (let x = 0; x < 21; x++) if (!finder(x, y) && rnd() > 0.52) cells.push(<rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" />);
  const F = ({ x, y }) => (
    <g transform={`translate(${x} ${y})`}>
      <rect x=".5" y=".5" width="6" height="6" rx="1.4" fill="none" stroke="currentColor" />
      <rect x="2" y="2" width="3" height="3" rx=".7" />
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
  const [tab, setTab] = useState("promotions");
  return (
    <section id="loyalty" className="section loyalty">
      <div className="container split split-rev">
        <Reveal className="poster-wrap">
          <AnimatePresence mode="wait">
            <motion.div
              key={tab}
              className="poster"
              initial={{ opacity: 0, rotate: -6, y: 20 }}
              animate={{ opacity: 1, rotate: -2, y: 0 }}
              exit={{ opacity: 0, rotate: 4, y: -10 }}
              transition={{ duration: 0.6, ease: EASE }}
            >
              <span className="poster-tag mono-label">Sample poster</span>
              <Butterfly className="poster-bfly" />
              {tab === "promotions" ? (
                <>
                  <p className="poster-title">Buy one, get one</p>
                  <p className="poster-sub">Pastries · weekdays after 3 pm</p>
                </>
              ) : (
                <>
                  <p className="poster-title">Double points</p>
                  <p className="poster-sub">Happy hour · join at the kiosk</p>
                </>
              )}
              <QrMock />
              <p className="poster-foot mono-label">Scan to order</p>
            </motion.div>
          </AnimatePresence>
        </Reveal>

        <div>
          <Reveal className="mono-label">Promotions & loyalty</Reveal>
          <Words className="h2" text="Give them {a reason} to come back." />
          <div className="tabs" role="tablist" aria-label="Promotions and loyalty">
            {[["promotions", "Promotions"], ["loyalty", "Loyalty"]].map(([k, l]) => (
              <button key={k} role="tab" aria-selected={tab === k} className={tab === k ? "is-on" : ""} onClick={() => setTab(k)}>{l}</button>
            ))}
          </div>
          <AnimatePresence mode="wait">
            <motion.div key={tab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.4 }}>
              {tab === "promotions" ? (
                <>
                  <ul className="checks">{PROMOTIONS.map((p) => <li key={p}>{p}</li>)}</ul>
                  <p className="small-head">Limit any offer by</p>
                  <ul className="tags">{PROMO_LIMITS.map((p) => <li key={p}>{p}</li>)}</ul>
                  <p className="note">Every promotion gets a QR code and a printable poster, and ends on its own on its end date.</p>
                </>
              ) : (
                <>
                  <ul className="checks">{LOYALTY.map((p) => <li key={p}>{p}</li>)}</ul>
                  <p className="note">Guests can join rewards right at the kiosk — no app to download.</p>
                </>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

/* ───────── Why ───────── */

function Why() {
  return (
    <section className="section why">
      <div className="container">
        <div className="head-center">
          <Reveal className="mono-label">Why Farasha</Reveal>
          <Words className="h2" text="Light on its feet. {Yours to keep.}" />
        </div>
        <div className="why-grid">
          {WHY.map((w, i) => (
            <Reveal key={w.title} delay={i * 0.08} className="why-card">
              <span className="why-num">{["i", "ii", "iii"][i]}.</span>
              <h3>{w.title}</h3>
              <p>{w.body}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ───────── Roles ───────── */

function Roles() {
  return (
    <section className="section roles">
      <div className="container">
        <div className="split split-top">
          <div>
            <Reveal className="mono-label">Staff roles</Reveal>
            <Words className="h2" text="The right keys {for every apron.}" />
          </div>
          <Reveal delay={0.1}>
            <p className="lede">Four roles, each building on the last. Nobody sees more than their shift needs.</p>
          </Reveal>
        </div>
        <Reveal className="matrix-wrap">
          <table className="matrix">
            <thead>
              <tr>
                <th scope="col"><span className="sr-only">Permission</span></th>
                {ROLES.map((r) => <th key={r} scope="col">{r}</th>)}
              </tr>
            </thead>
            <tbody>
              {PERMISSIONS.map((p) => (
                <tr key={p.label}>
                  <th scope="row">{p.label}</th>
                  {ROLES.map((r, i) => (
                    <td key={r}>
                      {i >= p.from ? (
                        <motion.span
                          className="tick"
                          initial={{ scale: 0 }}
                          whileInView={{ scale: 1 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.5, ease: EASE, delay: 0.1 + i * 0.08 + p.from * 0.05 }}
                        >
                          <span className="sr-only">Yes</span>
                        </motion.span>
                      ) : (
                        <span className="dash"><span className="sr-only">No</span></span>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </Reveal>
      </div>
    </section>
  );
}

/* ───────── Pilot: metamorphosis ───────── */

function StageIcon({ i }) {
  if (i === 3) return <Butterfly className="stage-bfly" />;
  return (
    <svg viewBox="0 0 64 64" className="stage-svg" aria-hidden="true">
      {i === 0 && (
        <>
          <ellipse cx="26" cy="36" rx="9" ry="12" />
          <ellipse cx="42" cy="38" rx="7" ry="9.5" />
        </>
      )}
      {i === 1 && [12, 22, 32, 42].map((x, k) => <circle key={x} cx={x} cy={38 - (k % 2) * 4} r={k === 3 ? 7 : 6} />)}
      {i === 2 && (
        <>
          <path d="M32 6v8" className="stage-thread" />
          <path d="M32 14c10 4 13 16 10 28-2 8-6 14-10 16-4-2-8-8-10-16-3-12 0-24 10-28Z" />
          <path d="M24 30h16M23 38h18M25 46h14" className="stage-line" />
        </>
      )}
    </svg>
  );
}

function Pilot() {
  return (
    <section id="pilot" className="section pilot">
      <div className="container">
        <div className="head-center">
          <Reveal className="mono-label">Pilot program · 90 days</Reveal>
          <Words className="h2" text="A small {metamorphosis.}" />
          <Reveal delay={0.1}>
            <p className="lede">Try Farasha in one or two locations. Twelve weeks later, you decide whether to continue, expand, or stop.</p>
          </Reveal>
        </div>

        <div className="weeks" aria-hidden="true">
          {Array.from({ length: 12 }).map((_, w) => {
            const phase = w < 2 ? 0 : w < 3 ? 1 : 2;
            return (
              <motion.span
                key={w}
                className={`week week-${phase} ${w === 11 ? "week-last" : ""}`}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, ease: EASE, delay: w * 0.05 }}
              >
                {w + 1}
              </motion.span>
            );
          })}
        </div>

        <ol className="stages">
          {PILOT.map((p, i) => (
            <Reveal as="li" key={p.title} delay={i * 0.08} className="stage">
              <div className="stage-icon"><StageIcon i={i} /></div>
              <p className="mono-label">{p.stage} · {p.weeks}</p>
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
    <section id="faq" className="section faq">
      <div className="container split">
        <div>
          <Reveal className="mono-label">Questions</Reveal>
          <Words className="h2" text="Good {to know.}" />
          <Reveal delay={0.1}>
            <p className="lede">
              Anything else? Write to{" "}
              <a className="link" href={`mailto:${SITE.contactEmail}`}>{SITE.contactEmail}</a>
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
    <section className="cta-section">
      <div className="container">
        <Reveal className="cta">
          <div className="cta-copy">
            <Words className="cta-title" text="Give your shops {their wings.}" />
            <p>Start with a 90-day pilot in one or two locations.</p>
            <div className="hero-ctas">
              <a className="btn btn-cream btn-lg" href={quoteHref}>Request a quote <Arrow /></a>
              <a className="btn btn-line-light btn-lg" href={`mailto:${SITE.contactEmail}`}>{SITE.contactEmail}</a>
            </div>
          </div>
          <div className="cta-art" aria-hidden="true">
            <Butterfly flap />
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ───────── Footer ───────── */

function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-row">
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
          <a href={SITE.liveOrdering} target="_blank" rel="noreferrer">order.farashapos.com ↗</a>
        </div>
      </div>
      <div className="container footer-base">
        <span>© {new Date().getFullYear()} Farasha POS Solutions</span>
        <span lang="ar" dir="rtl" className="arabic">{SITE.arabic}</span>
        <span>A product of {SITE.parent}</span>
      </div>
    </footer>
  );
}
