import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Icon } from "@/components/Icon";
import { JsonLd } from "@/components/JsonLd";
import { Reveal, Spotlight } from "@/components/Motion";
import { PageHero } from "@/components/PageHero";
import { FinalCta } from "@/components/Sections";
import { SITE } from "@/lib/content";
import { POSTS } from "@/lib/posts";
import { SERVICES, getService } from "@/lib/services";

export function generateStaticParams() {
  return SERVICES.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: PageProps<"/services/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) return {};
  return { title: service.title, description: service.summary };
}

export default async function ServicePage({ params }: PageProps<"/services/[slug]">) {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) notFound();

  const idx = SERVICES.findIndex((s) => s.slug === slug);
  const others = [1, 2, 3].map((n) => SERVICES[(idx + n) % SERVICES.length]);
  const related = POSTS.filter((p) => p.service === slug).slice(0, 2);
  const url = `${SITE.url}/services/${slug}`;

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "Service",
              name: service.title,
              description: service.summary,
              serviceType: service.title,
              url,
              provider: { "@id": `${SITE.url}/#org` },
              areaServed: "Worldwide",
            },
            {
              "@type": "BreadcrumbList",
              itemListElement: [
                { "@type": "ListItem", position: 1, name: "Home", item: SITE.url },
                { "@type": "ListItem", position: 2, name: "Services", item: `${SITE.url}/services` },
                { "@type": "ListItem", position: 3, name: service.title, item: url },
              ],
            },
          ],
        }}
      />

      <PageHero
        eyebrow={`Service · 0${idx + 1}`}
        crumbs={[{ label: "Services", href: "/services" }, { label: service.title }]}
        lines={[service.title]}
        intro={service.sub}
      >
        <div className="mt-10 flex flex-wrap gap-3">
          <Link href="/contact?engagement=hire" className="btn btn-primary btn-lg group">
            Request a custom quote
            <span className="grid size-7 place-items-center rounded-full bg-white/15 transition-transform duration-500 group-hover:rotate-45">
              <Icon name="arrowUpRight" className="size-4" />
            </span>
          </Link>
          <Link href="/services" className="btn btn-outline btn-lg">
            All services
          </Link>
        </div>
      </PageHero>

      <section className="mx-auto grid max-w-[1400px] gap-14 px-5 py-24 sm:px-10 lg:grid-cols-[0.75fr_1.25fr] lg:py-32">
        <aside className="lg:sticky lg:top-32 lg:self-start">
          <Reveal>
            <div className="card rounded-3xl p-8">
              <span className="grid size-14 place-items-center rounded-2xl bg-brand text-white">
                <Icon name={service.icon} className="size-6" />
              </span>
              <p className="mt-8 text-xs tracking-[0.2em] text-muted uppercase">What you get</p>
              <ul className="mt-5 space-y-3.5">
                {service.gets.map((g) => (
                  <li key={g} className="flex items-start gap-3 text-ink-soft">
                    <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-brand-soft text-brand">
                      <Icon name="check" className="size-3" />
                    </span>
                    {g}
                  </li>
                ))}
              </ul>
              <div className="mt-8 rounded-2xl bg-brand-soft p-5">
                <p className="font-serif text-2xl text-ink italic">Custom quote</p>
                <p className="mt-1 text-xs text-brand">Pricing will be revealed shortly</p>
              </div>
              <Link href="/contact?engagement=hire" className="btn btn-primary mt-6 w-full justify-between">
                Start this project <Icon name="arrowRight" className="size-4" />
              </Link>
            </div>
          </Reveal>
        </aside>

        <article>
          <Reveal>
            <h2 className="text-[clamp(2rem,4vw,3.4rem)] leading-[1.05] font-medium tracking-[-0.04em] text-ink">
              {service.headline}
            </h2>
          </Reveal>
          <div className="prose-macro mt-4">
            {service.body.map((p, i) => (
              <Reveal key={i} y={14}>
                <p className={i === 0 ? "!text-xl !leading-relaxed !text-ink" : undefined}>{p}</p>
              </Reveal>
            ))}
          </div>

          {related.length > 0 && (
            <div className="mt-16 border-t border-line pt-10">
              <p className="text-xs tracking-[0.2em] text-muted uppercase">Related reading</p>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                {related.map((p) => (
                  <Link
                    key={p.slug}
                    href={`/blog/${p.slug}`}
                    className="group card rounded-2xl p-5 transition-colors hover:border-brand/40"
                  >
                    <p className="text-xs text-brand">{p.category}</p>
                    <p className="mt-2 font-medium text-ink group-hover:text-brand">{p.title}</p>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </article>
      </section>

      <section className="mx-auto max-w-[1400px] px-5 pb-24 sm:px-10">
        <p className="text-xs tracking-[0.2em] text-muted uppercase">Explore more services</p>
        <div className="mt-6 grid gap-px overflow-hidden rounded-3xl border border-line bg-line md:grid-cols-3">
          {others.map((s) => (
            <Spotlight key={s.slug} className="spot group bg-white">
              <Link href={`/services/${s.slug}`} className="flex h-full flex-col p-8">
                <span className="grid size-12 place-items-center rounded-full border border-line text-brand transition-all duration-500 group-hover:border-brand group-hover:bg-brand group-hover:text-white">
                  <Icon name={s.icon} className="size-5" />
                </span>
                <h3 className="mt-8 text-xl font-medium tracking-tight text-ink">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{s.summary}</p>
              </Link>
            </Spotlight>
          ))}
        </div>
      </section>

      <FinalCta />
    </>
  );
}
