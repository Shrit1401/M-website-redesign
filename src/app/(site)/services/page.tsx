import type { Metadata } from "next";
import Link from "next/link";
import { Icon } from "@/components/Icon";
import { Reveal } from "@/components/Motion";
import { Accent, CONTAINER, FinalCta, PageHero, Process, ServiceCards } from "@/components/Sections";
import { SERVICES } from "@/lib/services";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Web design & development, web maintenance and digital marketing (SEO, SEM, SMO, SMM) from Nebula Webtech LLC in Palatine, IL.",
  alternates: { canonical: "/services" },
};

export default function ServicesPage() {
  return (
    <>
      <PageHero
        eyebrow="Our services"
        crumbs={[{ label: "Services" }]}
        lines={[
          "Build it. Keep it healthy.",
          <>
            Bring people <Accent>to it.</Accent>
          </>,
        ]}
        intro="Website design & development, maintenance, and digital marketing — SEO, SEM, SMO and SMM — under one roof."
      />

      <section className={`${CONTAINER} pb-16`}>
        <ServiceCards headingLevel="h2" />
      </section>

      {/* Everything included, at a glance */}
      <section className={`${CONTAINER} py-16 sm:py-24`}>
        <div className="grid gap-4 lg:grid-cols-3">
          {SERVICES.map((s, i) => (
            <Reveal key={s.slug} delay={i * 0.08}>
              <div className="h-full rounded-3xl border border-white/[0.08] p-8">
                <p className="flex items-center gap-2 text-sm font-semibold text-ink">
                  <Icon name={s.icon} className="size-4 text-violet" /> {s.title}
                </p>
                {s.groups.map((g) => (
                  <div key={g.title} className="mt-7">
                    <p className="text-xs tracking-[0.18em] text-muted uppercase">{g.title}</p>
                    <ul className="mt-3 space-y-2">
                      {g.items.map((item) => (
                        <li key={item.title} className="flex items-center gap-2.5 text-sm text-ink-soft">
                          <Icon name="check" className="size-3.5 shrink-0 text-violet" /> {item.title}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
                <Link
                  href={`/services/${s.slug}`}
                  className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-violet hover:text-ink"
                >
                  Learn more <Icon name="arrowRight" className="size-4" />
                </Link>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <Process />
      <FinalCta />
    </>
  );
}
