import Link from "next/link";
import { Arrow, Reveal, Words } from "@/components/Motion";
import { Cta, Faq, PageHero } from "@/components/Sections";
import { PRICING_FACTORS, PRICING_FAQ, PRICING_PLANS, QUOTE_HREF } from "@/lib/content";

export const metadata = {
  title: "Pricing",
  description: "Farasha is priced per location and sized to your devices. Start with a 90-day pilot, then grow to one shop or many.",
};

export default function PricingPage() {
  return (
    <>
      <PageHero
        label="Pricing"
        title="Priced per location. | {Sized to your shop.}"
        lede="Every plan includes the register, kiosk, kitchen display and Back Office. You pay for the locations and devices you actually run — and you can start with a pilot."
        anchors={[
          { href: "#plans", label: "Plans" },
          { href: "#factors", label: "What sets the price" },
          { href: "#pricing-faq", label: "Pricing FAQ" },
        ]}
      />

      <section id="plans" className="section light">
        <div className="container">
          <div className="plans">
            {PRICING_PLANS.map((p, i) => (
              <Reveal key={p.title} delay={i * 0.08} className={`plan ${p.featured ? "plan-featured" : ""}`}>
                <p className="label">{p.kicker}</p>
                <h2>{p.title}</h2>
                <p className="plan-price">{p.price}</p>
                <p className="plan-note">{p.note}</p>
                <ul className="checklist">
                  {p.points.map((x) => <li key={x}>{x}</li>)}
                </ul>
                <Link className={`btn ${p.featured ? "btn-green" : "btn-outline"}`} href={p.cta.href}>
                  {p.cta.label} <Arrow />
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section id="factors" className="section dark">
        <div className="container">
          <div className="section-head">
            <div>
              <Reveal><p className="label label-mint">What sets the price</p></Reveal>
              <Words className="display" text="Four things, | {nothing hidden.}" />
            </div>
            <Reveal delay={0.1}>
              <p className="section-intro">
                Tell us about your shops and we’ll send clear numbers. <Link className="link" href={QUOTE_HREF}>Request a quote</Link>.
              </p>
            </Reveal>
          </div>
          <div className="factors">
            {PRICING_FACTORS.map((f, i) => (
              <Reveal key={f.title} delay={i * 0.06} className="factor">
                <span className="factor-num">0{i + 1}</span>
                <h3>{f.title}</h3>
                <p>{f.body}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <Faq id="pricing-faq" items={PRICING_FAQ} label="Pricing FAQ" title="Money | {questions.}" />
      <Cta title="Get your | {numbers.}" text="Share your locations and devices, and we’ll reply with a clear quote within one business day." />
    </>
  );
}
