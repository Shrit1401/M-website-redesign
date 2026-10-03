import type { Metadata } from "next";
import Link from "next/link";
import { InquiryForm } from "@/components/ContactForms";
import { Icon, type IconName } from "@/components/Icon";
import { Reveal } from "@/components/Motion";
import { Accent, PageHero } from "@/components/PageHero";
import { CUSTOM_QUOTE_NOTE, INQUIRY_TOPICS, SITE } from "@/lib/content";

export const metadata: Metadata = {
  title: "Contact us",
  description:
    "Questions about a project, support or partnerships? Visit us in Palatine, IL, call +1 (224) 298-4659 or email hello@macrosoftwaresolution.com.",
};

const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);

export default async function ContactPage({ searchParams }: PageProps<"/contact">) {
  const sp = await searchParams;
  const topicParam = one(sp.topic);
  const topic = topicParam && INQUIRY_TOPICS.includes(topicParam) ? topicParam : undefined;

  const { address } = SITE;
  const fullAddress = `${address.street}, ${address.city}, ${address.region} ${address.postal}`;
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullAddress)}`;
  const embedUrl = `https://www.google.com/maps?q=${encodeURIComponent(fullAddress)}&output=embed`;
  const cards: { icon: IconName; title: string; value: string; href?: string }[] = [
    { icon: "call", title: "Phone number", value: SITE.phone, href: SITE.phoneHref },
    { icon: "mail", title: "Email address", value: SITE.email, href: `mailto:${SITE.email}` },
    { icon: "clock", title: "Working hours", value: SITE.hours },
    {
      icon: "pin",
      title: "Our location",
      value: fullAddress,
      href: mapsUrl,
    },
  ];

  return (
    <>
      <PageHero
        eyebrow="Contact us"
        crumbs={[{ label: "Contact" }]}
        lines={["Let’s talk about", <Accent key="a">what you need.</Accent>]}
        intro="Whether you need help getting started with your CRM, some custom development, or even optimization, we’re here to help you succeed."
      />

      <section className="mx-auto max-w-[1400px] px-5 pt-16 sm:px-10">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-[1fr_1.3fr_1fr_1.15fr]">
          {cards.map((c, i) => {
            const body = (
              <>
                <span className="grid size-12 place-items-center rounded-full bg-brand text-white">
                  <Icon name={c.icon} className="size-5" />
                </span>
                <p className="mt-6 text-xs tracking-[0.2em] text-muted uppercase">{c.title}</p>
                <p className="mt-2 font-medium [overflow-wrap:anywhere] text-ink">{c.value}</p>
              </>
            );
            return (
              <Reveal key={c.title} delay={i * 0.06} className="h-full">
                {c.href ? (
                  <a
                    href={c.href}
                    {...(c.icon === "pin" ? { target: "_blank", rel: "noreferrer" } : {})}
                    className="card block h-full rounded-3xl p-7 transition-colors hover:border-brand/40"
                  >
                    {body}
                  </a>
                ) : (
                  <div className="card h-full rounded-3xl p-7">{body}</div>
                )}
              </Reveal>
            );
          })}
        </div>
      </section>

      <section
        id="message"
        className="mx-auto grid max-w-[1400px] grid-cols-1 gap-12 px-5 py-24 sm:px-10 lg:grid-cols-[0.8fr_1.2fr] lg:py-32"
      >
        <div className="lg:sticky lg:top-32 lg:self-start">
          <p className="flex items-center gap-3 text-xs tracking-[0.2em] text-muted uppercase">
            <span className="text-brand">(01)</span>
            <span className="h-px w-8 bg-ink/15" />
            Send a message
          </p>
          <h2 className="mt-6 text-[clamp(2.4rem,4.6vw,4rem)] leading-[1] font-medium tracking-[-0.04em] text-ink">
            How can we <Accent>help?</Accent>
          </h2>
          <p className="mt-6 max-w-md text-lg text-muted">
            Questions, support for an existing project, partnerships or careers — send us a note and we’ll reply within
            one business day.
          </p>
          <div className="mt-8 rounded-3xl bg-brand-soft p-6">
            <p className="font-medium text-ink">Planning a new project?</p>
            <p className="mt-1 text-sm text-muted">{CUSTOM_QUOTE_NOTE}</p>
            <Link href="/quote" className="btn btn-primary mt-5">
              Get a quote <Icon name="arrowRight" className="size-4" />
            </Link>
          </div>
        </div>
        <Reveal delay={0.1}>
          <div className="card rounded-3xl p-6 shadow-[0_40px_80px_-50px_rgba(0,119,181,0.45)] sm:p-10">
            {/* Keyed on the topic so following another "/contact?topic=…" link re-initialises the form. */}
            <InquiryForm key={topic ?? "none"} initialTopic={topic} />
          </div>
        </Reveal>
      </section>

      <section id="map" className="mx-auto max-w-[1400px] px-5 pb-24 sm:px-10 lg:pb-32">
        <Reveal>
          <div className="relative overflow-hidden rounded-[2rem] border border-line bg-white">
            <iframe
              title={`Map showing ${SITE.name} at ${fullAddress}`}
              src={embedUrl}
              className="block h-[420px] w-full sm:h-[480px]"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
            <div className="card absolute right-4 bottom-16 left-4 rounded-2xl p-5 sm:right-20 sm:bottom-8 sm:left-auto">
              <p className="text-xs tracking-[0.2em] text-muted uppercase">Visit us</p>
              <p className="mt-2 font-medium text-ink">{SITE.name}</p>
              <p className="text-sm text-muted">{fullAddress}</p>
              <a
                href={mapsUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-3 inline-flex items-center gap-1.5 text-sm text-brand hover:underline"
              >
                Get directions <Icon name="arrowUpRight" className="size-3.5" />
              </a>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}
