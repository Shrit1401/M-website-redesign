import Link from "next/link";
import { ContactForm } from "@/components/Forms";
import { PageHero } from "@/components/Sections";
import { OWNER, SITE } from "@/lib/content";

export const metadata = {
  title: "Contact",
  description: `Contact Farasha POS Solutions, owned by ${OWNER.name}. Call ${OWNER.phone} or send us a message — we reply within one business day.`,
};

const DETAILS = [
  { label: "Call", value: OWNER.phone, href: OWNER.phoneHref },
  { label: "Farasha support & sales", value: SITE.contactEmail, href: `mailto:${SITE.contactEmail}` },
  { label: "Quotes", value: SITE.quotesEmail, href: `mailto:${SITE.quotesEmail}` },
  { label: "Nebula Webtech", value: OWNER.email, href: `mailto:${OWNER.email}` },
  {
    label: "Visit",
    value: `${OWNER.address.street}, ${OWNER.address.city}, ${OWNER.address.region} ${OWNER.address.postal}`,
    href: OWNER.mapsUrl,
  },
  { label: "Business hours", value: OWNER.hours },
];

export default function ContactPage() {
  return (
    <>
      <PageHero
        label="Contact"
        title="Let’s talk about | {your shops.}"
        lede={`Farasha POS Solutions is owned and operated by ${OWNER.name}. Send us a message and someone from the Nebula Webtech team will contact you within one business day.`}
      />
      <section className="section section-tight light">
        <div className="container form-wrap">
          <aside className="form-aside">
            <p className="label">Owned by {OWNER.name}</p>
            <h2>Real people, one business day.</h2>
            <p>
              Farasha is built and supported by {OWNER.name} in {OWNER.address.city}, {OWNER.address.region}. Questions
              about the product, the pilot or an existing shop all reach the same team.
            </p>
            <ul className="contact-cards">
              {DETAILS.map((d) => {
                const body = (
                  <>
                    <span className="label">{d.label}</span>
                    <strong>{d.value}</strong>
                  </>
                );
                return (
                  <li key={d.label}>
                    {d.href ? (
                      <a
                        className="contact-card"
                        href={d.href}
                        {...(d.href.startsWith("http") ? { target: "_blank", rel: "noreferrer" } : {})}
                      >
                        {body}
                      </a>
                    ) : (
                      <div className="contact-card">{body}</div>
                    )}
                  </li>
                );
              })}
            </ul>
            <p>
              Planning a rollout? <Link className="link" href="/request-quote">Request a quote</Link> with your
              locations and devices instead.
            </p>
          </aside>
          <ContactForm />
        </div>
      </section>
    </>
  );
}
