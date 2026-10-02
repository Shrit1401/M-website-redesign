import type { Metadata } from "next";
import { CountUp, Meter, Reveal } from "@/components/Motion";
import { Accent, CONTAINER, FinalCta, PageHero, Process, ServiceCards, Why } from "@/components/Sections";
import { ABOUT, STATS, STRENGTHS } from "@/lib/site";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Nebula Webtech LLC is a full-service digital agency in Palatine, IL specializing in website design, development, maintenance, digital marketing, web and mobile applications.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About us"
        crumbs={[{ label: "About" }]}
        lines={[
          "Crafting online success,",
          <>
            one brand at a <Accent>time.</Accent>
          </>,
        ]}
        intro="We create innovative digital solutions to elevate your brand's online presence."
      />

      <section className={`${CONTAINER} grid gap-16 pb-24 sm:pb-32 lg:grid-cols-[0.8fr_1.2fr] lg:gap-24`}>
        <aside className="lg:sticky lg:top-32 lg:self-start">
          <Reveal>
            <div className="card p-8">
              <dl className="grid grid-cols-2 gap-6">
                {STATS.map((s) => (
                  <div key={s.label} className="flex flex-col-reverse">
                    <dt className="mt-2 text-sm text-muted">{s.label}</dt>
                    <dd className="text-5xl font-semibold tracking-tight text-ink tabular-nums">
                      <CountUp to={s.value} suffix={s.suffix} />
                    </dd>
                  </div>
                ))}
              </dl>
              <div className="mt-8 space-y-6 border-t border-white/[0.08] pt-8">
                {STRENGTHS.map((s) => (
                  <Meter key={s.label} label={s.label} value={s.value} />
                ))}
              </div>
            </div>
          </Reveal>
        </aside>

        <article>
          {ABOUT.long.map((p, i) => (
            <Reveal key={i} y={16}>
              <p
                className={
                  i === 0
                    ? "text-[clamp(1.4rem,2.4vw,1.9rem)] leading-snug font-medium tracking-[-0.02em] text-ink"
                    : "mt-6 text-lg leading-relaxed text-ink-soft"
                }
              >
                {p}
              </p>
            </Reveal>
          ))}
          <Reveal>
            <blockquote className="mt-14 border-l-2 border-violet pl-6 font-serif text-[clamp(1.5rem,2.6vw,2.1rem)] leading-snug text-ink italic">
              “{ABOUT.statement}”
            </blockquote>
          </Reveal>
        </article>
      </section>

      <section className={`${CONTAINER} pb-8`}>
        <Reveal>
          <p className="eyebrow">What we do</p>
        </Reveal>
        <div className="mt-8">
          <ServiceCards />
        </div>
      </section>

      <Process />
      <Why />
      <FinalCta />
    </>
  );
}
