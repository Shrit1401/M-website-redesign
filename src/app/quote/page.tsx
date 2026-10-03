import type { Metadata } from "next";
import Link from "next/link";
import { QuoteForm } from "@/components/ContactForms";
import { Icon } from "@/components/Icon";
import { Reveal } from "@/components/Motion";
import { Accent, PageHero } from "@/components/PageHero";
import { CUSTOM_QUOTE_NOTE, ENGAGEMENT_LABELS, SITE, type EngagementId } from "@/lib/content";
import { SERVICES } from "@/lib/services";

export const metadata: Metadata = {
  title: "Get a quote",
  description:
    "Request a custom quote for SaaS products, mobile applications, PWAs, websites, custom software or IT support. Every quote is based on your needs.",
};

const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);

const QUOTE_FACTORS = [
  { icon: "layers", title: "Scope & features", body: "What needs to be built or changed, and how complex it is." },
  { icon: "nodes", title: "Integrations", body: "The systems, data and third-party tools it has to connect to." },
  { icon: "calendar", title: "Timeline", body: "How quickly you need to launch and how we staff the work." },
  { icon: "headset", title: "Ongoing support", body: "Hosting, maintenance and support after launch, if you need it." },
] as const;

export default async function QuotePage({ searchParams }: PageProps<"/quote">) {
  const sp = await searchParams;
  const engagementParam = one(sp.engagement);
  const engagement = engagementParam && engagementParam in ENGAGEMENT_LABELS ? (engagementParam as EngagementId) : null;

  return (
    <>
      <PageHero
        eyebrow="Get a quote"
        crumbs={[{ label: "Get a quote" }]}
        lines={["A custom quote,", <Accent key="a">built around you.</Accent>]}
        intro={`${CUSTOM_QUOTE_NOTE} Tell us about your project and we’ll send a scoped plan and price.`}
      />

      <section className="mx-auto grid max-w-[1400px] grid-cols-1 gap-12 px-5 py-20 sm:px-10 lg:grid-cols-[0.8fr_1.2fr] lg:py-28">
        <div className="lg:sticky lg:top-32 lg:self-start">
          <p className="flex items-center gap-3 text-xs tracking-[0.2em] text-muted uppercase">
            <span className="text-brand">(01)</span>
            <span className="h-px w-8 bg-ink/15" />
            How pricing works
          </p>
          <h2 className="mt-6 text-[clamp(2.2rem,4.2vw,3.6rem)] leading-[1] font-medium tracking-[-0.04em] text-ink">
            No fixed packages. <Accent>Just your needs.</Accent>
          </h2>
          <p className="mt-6 max-w-md text-lg text-muted">
            Every business is different, so every quote is too. Your price depends on:
          </p>
          <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
            {QUOTE_FACTORS.map((f) => (
              <li key={f.title} className="card rounded-2xl p-5">
                <span className="grid size-9 place-items-center rounded-xl bg-brand-soft text-brand">
                  <Icon name={f.icon} className="size-4" />
                </span>
                <p className="mt-4 font-medium text-ink">{f.title}</p>
                <p className="mt-1 text-sm leading-relaxed text-muted">{f.body}</p>
              </li>
            ))}
          </ul>
          <p className="mt-8 text-sm text-muted">
            Just have a question?{" "}
            <Link href="/contact" className="text-brand underline-offset-4 hover:underline">
              Contact us
            </Link>{" "}
            or email{" "}
            <a href={`mailto:${SITE.email}`} className="text-brand underline-offset-4 hover:underline">
              {SITE.email}
            </a>
            .
          </p>
        </div>

        <Reveal delay={0.1}>
          <div className="card rounded-3xl p-6 shadow-[0_40px_80px_-50px_rgba(0,119,181,0.45)] sm:p-10">
            <div className="mb-8">
              <h2 className="text-2xl font-semibold tracking-tight text-ink">Request your custom quote</h2>
              <p className="mt-2 text-sm text-muted">We reply within 1–2 business days with next steps and pricing.</p>
            </div>
            {/* Keyed on the URL state so following another "/quote?…" link re-initialises the form. */}
            <QuoteForm key={engagement ?? "none"} initialEngagement={engagement} />
          </div>
        </Reveal>
      </section>

      <section className="mx-auto max-w-[1400px] px-5 pb-24 sm:px-10">
        <p className="text-xs tracking-[0.2em] text-muted uppercase">We quote for</p>
        <ul className="mt-5 flex flex-wrap gap-2">
          {SERVICES.map((s) => (
            <li key={s.slug}>
              <Link
                href={`/services/${s.slug}`}
                className="inline-flex items-center gap-2 rounded-full border border-line bg-white px-4 py-2 text-sm text-ink-soft transition-colors hover:border-brand hover:text-brand"
              >
                <Icon name={s.icon} className="size-4 text-brand" />
                {s.title}
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
