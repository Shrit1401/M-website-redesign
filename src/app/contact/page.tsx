import type { Metadata } from "next";
import { ContactForms, type ContactTab } from "@/components/ContactForms";
import { Icon, type IconName } from "@/components/Icon";
import { Reveal } from "@/components/Motion";
import { Accent, PageHero } from "@/components/PageHero";
import { ENGAGEMENT_LABELS, INQUIRY_TOPICS, SITE, type EngagementId } from "@/lib/content";

export const metadata: Metadata = {
  title: "Contact us — Get a custom quote",
  description:
    "Tell us what you need built or changed and get a custom quote. Call +1 (224) 298-4659 or email hello@macrosoftwaresolution.com.",
};

const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);

export default async function ContactPage({ searchParams }: PageProps<"/contact">) {
  const sp = await searchParams;
  const engagementParam = one(sp.engagement);
  const engagement = engagementParam && engagementParam in ENGAGEMENT_LABELS ? (engagementParam as EngagementId) : null;
  const tab: ContactTab = one(sp.tab) === "inquiry" ? "inquiry" : "requirements";
  const topicParam = one(sp.topic);
  const topic = topicParam && INQUIRY_TOPICS.includes(topicParam) ? topicParam : undefined;

  const { address } = SITE;
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${address.street}, ${address.city}, ${address.region} ${address.postal}`,
  )}`;
  const cards: { icon: IconName; title: string; value: string; href?: string }[] = [
    { icon: "call", title: "Phone number", value: SITE.phone, href: SITE.phoneHref },
    { icon: "mail", title: "Email address", value: SITE.email, href: `mailto:${SITE.email}` },
    { icon: "clock", title: "Working hours", value: SITE.hours },
    {
      icon: "pin",
      title: "Our location",
      value: `${address.street}, ${address.city}, ${address.region} ${address.postal}`,
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
        id="start"
        className="mx-auto grid max-w-[1400px] gap-12 px-5 py-24 sm:px-10 lg:grid-cols-[0.8fr_1.2fr] lg:py-32"
      >
        <div className="lg:sticky lg:top-32 lg:self-start">
          <p className="flex items-center gap-3 text-xs tracking-[0.2em] text-muted uppercase">
            <span className="text-brand">(01)</span>
            <span className="h-px w-8 bg-ink/15" />
            Start a project
          </p>
          <h2 className="mt-6 text-[clamp(2.4rem,4.6vw,4rem)] leading-[1] font-medium tracking-[-0.04em] text-ink">
            Tell us what <Accent>you need.</Accent>
          </h2>
          <p className="mt-6 max-w-md text-lg text-muted">
            Share your requirements and we’ll come back with a scoped plan and a custom quote — no fixed packages, no
            guesswork.
          </p>
          <ul className="mt-8 space-y-4 text-sm text-ink-soft">
            {[
              "Reply within 1–2 business days",
              "Free discovery call to scope your project",
              "Transparent, custom quote for your exact needs",
            ].map((t) => (
              <li key={t} className="flex items-center gap-3">
                <span className="grid size-7 place-items-center rounded-full bg-brand-soft text-brand">
                  <Icon name="check" className="size-3.5" />
                </span>
                {t}
              </li>
            ))}
          </ul>
        </div>
        <Reveal delay={0.1}>
          {/* Keyed on the URL state so following another "/contact?…" link re-initialises the forms. */}
          <ContactForms
            key={`${tab}-${engagement}-${topic}`}
            initialTab={tab}
            initialEngagement={engagement}
            initialTopic={topic}
          />
        </Reveal>
      </section>
    </>
  );
}
