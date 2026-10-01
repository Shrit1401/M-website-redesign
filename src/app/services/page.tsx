import type { Metadata } from "next";
import Link from "next/link";
import { Engagements } from "@/components/Engagements";
import { Icon } from "@/components/Icon";
import { Reveal, Spotlight } from "@/components/Motion";
import { Accent, PageHero } from "@/components/PageHero";
import { FinalCta, Process } from "@/components/Sections";
import { SERVICES } from "@/lib/services";

export const metadata: Metadata = {
  title: "Services",
  description:
    "SaaS product development, cloud integration, custom software, IT infrastructure, web and mobile development, website maintenance, digital marketing and AI optimization.",
};

export default function ServicesPage() {
  return (
    <>
      <PageHero
        eyebrow="Services"
        crumbs={[{ label: "Services" }]}
        lines={["Innovative solutions", <Accent key="a">for every need.</Accent>]}
        intro="At Macro Software Solution LLC, we offer a comprehensive range of services designed to drive efficiency, security, and growth in your business. Explore our specialized solutions below."
      />

      <section className="mx-auto max-w-[1400px] px-5 py-24 sm:px-10 lg:py-32">
        <ol className="border-t border-line">
          {SERVICES.map((s, i) => (
            <li key={s.slug}>
              <Reveal y={16}>
                <Spotlight className="spot group border-b border-line">
                  <Link
                    href={`/services/${s.slug}`}
                    className="grid gap-6 py-10 sm:px-4 lg:grid-cols-[5rem_1.1fr_1fr_auto] lg:items-center lg:gap-10"
                  >
                    <span className="text-sm text-muted tabular-nums">0{i + 1}</span>
                    <div className="flex items-start gap-5">
                      <span className="grid size-14 shrink-0 place-items-center rounded-2xl border border-line bg-white text-brand transition-all duration-500 group-hover:border-brand group-hover:bg-brand group-hover:text-white">
                        <Icon name={s.icon} className="size-6" />
                      </span>
                      <div>
                        <h2 className="text-2xl font-medium tracking-tight text-ink transition-colors group-hover:text-brand sm:text-3xl">
                          {s.title}
                        </h2>
                        <p className="mt-2 max-w-md leading-relaxed text-muted">{s.summary}</p>
                      </div>
                    </div>
                    <ul className="flex flex-wrap gap-2">
                      {s.gets.map((g) => (
                        <li
                          key={g}
                          className="rounded-full border border-line bg-white px-3 py-1.5 text-xs text-ink-soft"
                        >
                          {g}
                        </li>
                      ))}
                    </ul>
                    <span className="grid size-12 place-items-center rounded-full border border-line text-ink transition-all duration-500 group-hover:rotate-45 group-hover:border-brand group-hover:bg-brand group-hover:text-white">
                      <Icon name="arrowUpRight" className="size-5" />
                    </span>
                  </Link>
                </Spotlight>
              </Reveal>
            </li>
          ))}
        </ol>
      </section>

      <Process />
      <Engagements />
      <FinalCta />
    </>
  );
}
