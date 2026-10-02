import type { Metadata } from "next";
import { ContactForm } from "@/components/Forms";
import { Icon, type IconName } from "@/components/Icon";
import { Reveal } from "@/components/Motion";
import { Accent, CONTAINER, PageHero } from "@/components/Sections";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact Us",
  description: `Get in touch with Nebula Webtech LLC in Palatine, IL. Call ${SITE.phone} or send us your project details.`,
  alternates: { canonical: "/contact-us" },
};

const DETAILS: { icon: IconName; label: string; value: React.ReactNode; href?: string }[] = [
  { icon: "call", label: "Call us", value: SITE.phone, href: SITE.phoneHref },
  { icon: "mail", label: "Email", value: SITE.email, href: `mailto:${SITE.email}` },
  {
    icon: "pin",
    label: "Visit",
    value: (
      <>
        {SITE.address.street}
        <br />
        {SITE.address.city}, {SITE.address.region} {SITE.address.postal}
      </>
    ),
    href: SITE.mapsUrl,
  },
  { icon: "clock", label: "Business hours", value: SITE.hours },
];

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact us"
        crumbs={[{ label: "Contact Us" }]}
        lines={[
          "Let's build something",
          <>
            out of this <Accent>world.</Accent>
          </>,
        ]}
        intro="Tell us about your business and what you'd like to achieve. We'll come back within one business day."
      />

      <section className={`${CONTAINER} grid gap-6 pb-24 sm:pb-32 lg:grid-cols-[0.75fr_1.25fr]`}>
        <Reveal>
          <ul className="grid gap-3">
            {DETAILS.map((d) => {
              const body = (
                <>
                  <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-violet/10 text-violet">
                    <Icon name={d.icon} className="size-5" />
                  </span>
                  <span>
                    <span className="block text-xs tracking-[0.18em] text-muted uppercase">{d.label}</span>
                    <span className="mt-1 block break-words text-ink">{d.value}</span>
                  </span>
                </>
              );
              return (
                <li key={d.label}>
                  {d.href ? (
                    <a
                      href={d.href}
                      {...(d.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                      className="card flex items-start gap-4 p-5 transition-colors hover:border-violet/40"
                    >
                      {body}
                    </a>
                  ) : (
                    <div className="card flex items-start gap-4 p-5">{body}</div>
                  )}
                </li>
              );
            })}
          </ul>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="card p-6 sm:p-10">
            <h2 className="text-2xl font-semibold tracking-tight text-ink">Send us a message</h2>
            <p className="mt-2 mb-8 text-sm text-ink-soft">Fields marked optional can be left blank.</p>
            <ContactForm />
          </div>
        </Reveal>
      </section>
    </>
  );
}
