import Link from "next/link";
import { Arrow, Reveal, Words } from "./Motion";
import { Flyer, LeafButterfly } from "./Butterfly";
import HeroOrder from "./HeroOrder";
import {
  APP_DETAILS,
  EXPLORE,
  FEATURES,
  PILLARS,
  PILOT,
  PILOT_DETAIL,
  PROMO_POINTS,
  QUOTE_HREF,
  ROLES,
  SITE,
  WHY,
} from "@/lib/content";

/* ───────── Home hero ───────── */

export function Hero() {
  return (
    <section id="top" className="hero hero-home">
      <div className="hero-arcs" aria-hidden="true">
        <span className="arc arc-ring" />
        <span className="arc arc-fill" />
      </div>
      <Flyer />
      <HeroOrder />
      <div className="container hero-inner">
        <Reveal y={10}>
          <p className="label label-mint">Now onboarding pilot partners</p>
        </Reveal>
        <Words as="h1" onMount delay={0.1} className="display hero-title" text="From first tap | {to final plate.}" />
        <Reveal delay={0.45}>
          <p className="hero-lede">
            Farasha POS Solutions connects self-order, counter service and kitchen fulfilment — so every
            team sees the same order moving forward.
          </p>
        </Reveal>
        <Reveal delay={0.6} className="hero-ctas">
          <Link className="btn btn-green btn-lg" href={QUOTE_HREF}>Request a quote <Arrow /></Link>
          <Link className="btn btn-ghost btn-lg" href="/apps">See how it works</Link>
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

/* ───────── Inner page hero ───────── */

export function PageHero({ label, title, lede, anchors, children }) {
  return (
    <section className="hero page-hero">
      <div className="hero-arcs" aria-hidden="true">
        <span className="arc arc-ring" />
      </div>
      <div className="container hero-inner">
        <Reveal y={10}>
          <p className="label label-mint">{label}</p>
        </Reveal>
        <Words as="h1" onMount delay={0.1} className="display display-xl" text={title} />
        {lede && (
          <Reveal delay={0.35}>
            <p className="hero-lede">{lede}</p>
          </Reveal>
        )}
        {anchors && (
          <Reveal delay={0.45}>
            <nav className="page-anchors" aria-label="On this page">
              {anchors.map((a) => <a key={a.href} href={a.href}>{a.label}</a>)}
            </nav>
          </Reveal>
        )}
        {children}
      </div>
    </section>
  );
}

/* ───────── Shared heading block ───────── */

function Head({ label, title, intro }) {
  return (
    <div className="section-head">
      <div>
        <Reveal><p className="label">{label}</p></Reveal>
        <Words className="display" text={title} />
      </div>
      {intro && (
        <Reveal delay={0.1}>
          <p className="section-intro">{intro}</p>
        </Reveal>
      )}
    </div>
  );
}

/* ───────── Brand idea ───────── */

export function Idea() {
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

/* ───────── Explore (home → other pages) ───────── */

export function Explore() {
  return (
    <section className="section light">
      <div className="container">
        <Head label="Explore" title="See it | {end to end.}" intro="Each part of Farasha has its own page. Go as deep as you like." />
        <div className="explore">
          {EXPLORE.map((e, i) => (
            <Reveal key={e.href} delay={i * 0.08}>
              <Link href={e.href} className="explore-card">
                <p className="label">{e.kicker}</p>
                <h3>{e.title}</h3>
                <p>{e.body}</p>
                <span className="explore-go">Open <Arrow /></span>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ───────── Photography ───────── */

export function Service() {
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

/* ───────── Apps: one deep-dive per app ───────── */

function OnlineMock() {
  return (
    <div className="mock-card">
      <div className="screen-top">
        <img src="/brand/emblem-256.png" alt="" width="28" height="28" />
        <span className="label">order.farashapos.com</span>
      </div>
      <div className="mock-row"><span>Pickup · Main St</span><em>Change</em></div>
      <div className="mock-row"><span>1× Oat latte, large</span><em>5.75</em></div>
      <div className="mock-row"><span>1× Almond croissant</span><em>4.25</em></div>
      <div className="mock-row"><span>Ready in</span><em>12 min</em></div>
      <div className="mock-bar">Place order · 10.00</div>
    </div>
  );
}

function BackOfficeMock() {
  return (
    <div className="mock-card">
      <div className="screen-top">
        <img src="/brand/emblem-256.png" alt="" width="28" height="28" />
        <span className="label">Back Office · All shops</span>
      </div>
      <div className="mock-row"><span>Counter</span><em>$4,180</em></div>
      <div className="mock-row"><span>Kiosk</span><em>$2,940</em></div>
      <div className="mock-row"><span>Online</span><em>$1,615</em></div>
      <div className="mock-row"><span>Pumpkin latte · price</span><em>Updated in 3 shops</em></div>
      <div className="mock-bar">Export sales</div>
    </div>
  );
}

const MOCKS = { online: OnlineMock, "back-office": BackOfficeMock };

export function AppDetails() {
  return (
    <div className="light">
      {APP_DETAILS.map((a) => {
        const Mock = MOCKS[a.id];
        return (
          <section key={a.id} id={a.id} className="section section-tight app-detail">
            <div className="container app-detail-row">
              <div>
                <Reveal><p className="label">{a.kicker}</p></Reveal>
                <Reveal delay={0.05}><h2>{a.title}</h2></Reveal>
                <Reveal delay={0.1}><p className="app-detail-body">{a.body}</p></Reveal>
                <Reveal delay={0.15}>
                  <ul className="checklist">
                    {a.points.map((p) => <li key={p}>{p}</li>)}
                  </ul>
                </Reveal>
              </div>
              <Reveal delay={0.1} y={0} className={`app-media ${Mock ? "app-media-mock" : ""}`}>
                {Mock ? <Mock /> : <img src={a.img} alt="" loading="lazy" />}
              </Reveal>
            </div>
          </section>
        );
      })}
    </div>
  );
}

/* ───────── Features ───────── */

export function Features() {
  return (
    <section id="overview" className="section light">
      <div className="container">
        <Head
          label="Built for food service"
          title="Six tools, | {one system.}"
          intro="Built for coffee houses and multi-location food service. One menu across every shop, and the numbers behind it."
        />
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

export function Promotions() {
  return (
    <section id="promotions" className="section dark">
      <div className="container two-col">
        <div>
          <Reveal><p className="label label-mint">Promotions & loyalty</p></Reveal>
          <Words className="display" text="Run a promotion | {that ends itself.}" />
          <Reveal delay={0.1}>
            <p className="calm-text">
              Set the deal, set the dates, print the poster. When the end date passes, the discount stops applying
              and the QR code says the offer has ended. Nothing to switch off, nothing left on a window promising
              something that’s over.
            </p>
          </Reveal>
          <Reveal delay={0.15}>
            <ul className="checklist">
              {PROMO_POINTS.map((p) => <li key={p}>{p}</li>)}
            </ul>
          </Reveal>
        </div>
        <Reveal delay={0.15} y={0}>
          <div className="poster">
            <p className="label label-ink">Limited time</p>
            <p className="poster-title">Weekend Latte</p>
            <p className="poster-big">15% off</p>
            <small>any order, all weekend</small>
            <div className="poster-qr" aria-hidden="true" />
            <small>Scan to see the offer · Valid until Sunday</small>
          </div>
          <p className="poster-caption">Example poster. Each promotion in Back Office gets its own.</p>
        </Reveal>
      </div>
    </section>
  );
}

export function Team() {
  return (
    <section id="team" className="section light">
      <div className="container">
        <Head
          label="Your team"
          title="The right access | {for every role.}"
          intro="Shift managers can issue refunds; cashiers can’t. Every employee, front counter or kitchen, can clock in, and managers can correct a missed punch with a reason on record."
        />
        <div className="cards-4">
          {ROLES.map((r, i) => (
            <Reveal key={r.title} delay={i * 0.08} className="card">
              <span className="card-num">0{i + 1}</span>
              <h3>{r.title}</h3>
              <p>{r.body}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Why() {
  return (
    <section id="why" className="section light">
      <div className="container">
        <Head label="Why Farasha" title="Made for the way | {coffee houses grow.}" />
        <div className="cards-3">
          {WHY.map((w, i) => (
            <Reveal key={w.title} delay={i * 0.08} className="card">
              <h3>{w.title}</h3>
              <p>{w.body}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ───────── Pilot ───────── */

function PilotSteps({ steps }) {
  return (
    <ol className="pilot">
      {steps.map((p, i) => (
        <Reveal as="li" key={p.title} delay={i * 0.08} className="pilot-step">
          <span className="pilot-num">0{i + 1}</span>
          <p className="label">{p.weeks}</p>
          <h3>{p.title}</h3>
          <p>{p.body}</p>
        </Reveal>
      ))}
    </ol>
  );
}

/** Home page version: the short timeline plus a way into the full Pilot page. */
export function PilotTeaser() {
  return (
    <section className="section light">
      <div className="container">
        <Head
          label="Getting started"
          title="Start with one shop. | {Prove it. Then grow.}"
          intro="Our 90-day pilot puts Farasha in one or two of your locations, with your menu and your team, before you commit to anything bigger."
        />
        <PilotSteps steps={PILOT} />
        <Reveal className="hero-ctas section-cta">
          <Link className="btn btn-green btn-lg" href="/pilot">How the pilot works <Arrow /></Link>
        </Reveal>
      </div>
    </section>
  );
}

export function PilotTimeline() {
  return (
    <section id="timeline" className="section light">
      <div className="container">
        <Head label="Timeline" title="Twelve weeks, | {four steps.}" intro="Your menu, your team, your customers — with success goals we agree on at the start." />
        <PilotSteps steps={PILOT_DETAIL} />
      </div>
    </section>
  );
}

export function TwoLists({ id, left, right, dark }) {
  const col = (c, delay) => (
    <Reveal delay={delay}>
      <p className={`label ${dark ? "label-mint" : ""}`}>{c.label}</p>
      <h2>{c.title}</h2>
      <ul className="checklist">
        {c.items.map((x) => <li key={x}>{x}</li>)}
      </ul>
    </Reveal>
  );
  return (
    <section id={id} className={`section ${dark ? "dark" : "light"}`}>
      <div className="container two-col">
        {col(left, 0)}
        {col(right, 0.1)}
      </div>
    </section>
  );
}

/* ───────── FAQ ───────── */

export function Faq({ items, label = "Still curious?", title = "Ask us | {anything.}", id = "faq" }) {
  return (
    <section id={id} className="section light faq-section">
      <div className="container split split-top">
        <div>
          <Reveal><p className="label">{label}</p></Reveal>
          <Words className="display" text={title} />
          <Reveal delay={0.1}>
            <p className="section-intro">
              Anything else? <Link className="link" href="/contact">Contact us</Link> or email{" "}
              <a className="link" href={`mailto:${SITE.contactEmail}`}>{SITE.contactEmail}</a>
            </p>
          </Reveal>
        </div>
        <div className="faq-list">
          {items.map((f, i) => (
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

export function Cta({
  title = "Every order, | {moving together.}",
  text = "Start with a 90-day pilot. Set up in about two weeks, trained in one.",
}) {
  return (
    <section className="cta">
      <div className="hero-arcs cta-arcs" aria-hidden="true">
        <span className="arc arc-ring" />
      </div>
      <div className="container cta-inner">
        <Reveal className="cta-bfly" y={0}>
          <LeafButterfly flap slow />
        </Reveal>
        <Words className="display display-xl" text={title} />
        <Reveal delay={0.15}>
          <p className="cta-text">{text}</p>
        </Reveal>
        <Reveal delay={0.25} className="hero-ctas cta-ctas">
          <Link className="btn btn-green btn-lg" href={QUOTE_HREF}>Request a quote <Arrow /></Link>
          <Link className="btn btn-ghost btn-lg" href="/contact">Contact us</Link>
        </Reveal>
      </div>
    </section>
  );
}
