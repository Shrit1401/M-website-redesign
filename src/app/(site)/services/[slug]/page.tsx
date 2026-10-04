import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ContactForm } from "@/components/Forms";
import { Icon } from "@/components/Icon";
import { JsonLd } from "@/components/JsonLd";
import { Reveal, Spotlight } from "@/components/Motion";
import { CONTAINER, FinalCta, PageHero, Why } from "@/components/Sections";
import { SERVICES, getService } from "@/lib/services";
import { SITE } from "@/lib/site";

export function generateStaticParams() {
  return SERVICES.map((s) => ({ slug: s.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: PageProps<"/services/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) return {};
  return {
    title: service.fullTitle,
    description: service.summary,
    alternates: { canonical: `/services/${slug}` },
  };
}

export default async function ServicePage({ params }: PageProps<"/services/[slug]">) {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) notFound();

  const idx = SERVICES.findIndex((s) => s.slug === slug);
  const others = SERVICES.filter((s) => s.slug !== slug);
  const url = `${SITE.url}/services/${slug}`;

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "Service",
              name: service.fullTitle,
              description: service.summary,
              url,
              provider: { "@id": `${SITE.url}/#org` },
              areaServed: "US",
            },
            {
              "@type": "BreadcrumbList",
              itemListElement: [
                { "@type": "ListItem", position: 1, name: "Home", item: SITE.url },
                { "@type": "ListItem", position: 2, name: "Services", item: `${SITE.url}/services` },
                { "@type": "ListItem", position: 3, name: service.fullTitle, item: url },
              ],
            },
          ],
        }}
      />

      <PageHero
        eyebrow={`Service · 0${idx + 1}`}
        crumbs={[{ label: "Services", href: "/services" }, { label: service.title }]}
        lines={[service.fullTitle]}
        intro={service.intro}
      >
        <div className="mt-10 flex flex-wrap gap-3">
          <a href="#quote" className="btn btn-primary btn-lg">
            Get a quote
            <span className="btn-arrow">
              <Icon name="arrowUpRight" className="size-4" />
            </span>
          </a>
          <a href={SITE.phoneHref} className="btn btn-outline btn-lg">
            <Icon name="call" className="size-4" /> {SITE.phone}
          </a>
        </div>
      </PageHero>

      <section className={`${CONTAINER} pb-24 sm:pb-32`}>
        <Reveal>
          <div className="grid gap-6 rounded-3xl border border-white/[0.08] bg-surface/60 p-8 sm:p-12 lg:grid-cols-[auto_1fr] lg:gap-12">
            <span className="grid size-16 place-items-center rounded-2xl bg-gradient-to-br from-violet/30 to-pink/10 text-violet shadow-[0_0_40px_-6px_rgb(166_123_255/0.7)]">
              <Icon name={service.icon} className="size-7" />
            </span>
            <div>
              <h2 className="text-xs font-semibold tracking-[0.2em] text-violet uppercase">Our approach</h2>
              <p className="mt-4 text-[clamp(1.3rem,2.2vw,1.75rem)] leading-snug font-medium tracking-[-0.02em] text-ink">
                {service.approach}
              </p>
            </div>
          </div>
        </Reveal>

        <div className="mt-20 space-y-20">
          {service.groups.map((group, gi) => (
            <div key={group.title} className="grid gap-8 lg:grid-cols-[0.6fr_1.4fr] lg:gap-16">
              <Reveal>
                <p className="font-serif text-5xl text-white/15 italic">0{gi + 1}</p>
                <h2 className="mt-2 text-3xl font-semibold tracking-[-0.03em] text-ink">{group.title}</h2>
              </Reveal>
              <div className="grid gap-px overflow-hidden rounded-3xl border border-white/[0.08] bg-white/[0.08] sm:grid-cols-2">
                {group.items.map((item, i) => (
                  <Spotlight key={item.title} className="spot bg-bg">
                    <Reveal delay={i * 0.05} y={14} className="h-full p-7">
                      <h3 className="flex items-center gap-2.5 font-semibold text-ink">
                        <span className="size-1.5 rounded-full bg-violet shadow-[0_0_10px_rgb(166_123_255)]" />
                        {item.title}
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-ink-soft">{item.body}</p>
                    </Reveal>
                  </Spotlight>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <Why />

      <section id="quote" className={`${CONTAINER} scroll-mt-28 pb-24 sm:pb-32`}>
        <div className="grid gap-10 rounded-[2rem] border border-white/10 bg-surface/60 p-6 sm:p-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <div>
            <p className="eyebrow">Get a quote</p>
            <h2 className="mt-5 text-[clamp(2rem,3.6vw,3rem)] leading-[1.05] font-semibold tracking-[-0.04em] text-ink">
              Tell us about your project.
            </h2>
            <p className="mt-5 leading-relaxed text-ink-soft">
              We&apos;ll get back to you within one business day with next steps and a tailored quote.
            </p>
            <p className="mt-8 text-sm text-muted">
              Prefer to talk?{" "}
              <a href={SITE.phoneHref} className="text-ink underline underline-offset-4 hover:text-violet">
                {SITE.phone}
              </a>
            </p>
          </div>
          <ContactForm defaultService={service.interest} />
        </div>
      </section>

      <section className={`${CONTAINER} pb-24`}>
        <p className="text-xs tracking-[0.2em] text-muted uppercase">Explore more services</p>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {others.map((s) => (
            <Link
              key={s.slug}
              href={`/services/${s.slug}`}
              className="group card flex items-center gap-5 p-6 transition-colors hover:border-violet/40"
            >
              <span className="grid size-12 shrink-0 place-items-center rounded-xl border border-white/10 text-violet">
                <Icon name={s.icon} className="size-5" />
              </span>
              <span className="flex-1">
                <span className="block font-semibold text-ink">{s.title}</span>
                <span className="mt-1 line-clamp-1 block text-sm text-muted">{s.summary}</span>
              </span>
              <Icon name="arrowUpRight" className="size-5 text-muted transition-transform group-hover:rotate-45 group-hover:text-ink" />
            </Link>
          ))}
        </div>
      </section>

      <FinalCta />
    </>
  );
}
