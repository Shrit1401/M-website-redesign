import Link from "next/link";
import { Hero } from "@/components/Hero";
import { Icon } from "@/components/Icon";
import { CountUp, Meter, Reveal } from "@/components/Motion";
import { Accent, CONTAINER, FinalCta, Marquee, Process, SectionHead, ServiceCards, Why } from "@/components/Sections";
import { ABOUT, STATS, STRENGTHS } from "@/lib/site";

export default function Home() {
  return (
    <>
      <Hero />
      <Marquee />

      {/* About */}
      <section className={`${CONTAINER} grid gap-16 py-24 sm:py-32 lg:grid-cols-[1.25fr_0.75fr] lg:gap-24`}>
        <div>
          <Reveal>
            <p className="eyebrow">About Nebula</p>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-6 text-[clamp(1.7rem,3.2vw,2.75rem)] leading-[1.18] font-medium tracking-[-0.025em] text-ink">
              We create innovative digital solutions that <Accent>elevate</Accent> your brand&apos;s online presence.
            </p>
          </Reveal>
          <div className="mt-10 grid gap-6 text-ink-soft sm:grid-cols-2">
            {ABOUT.intro.map((p, i) => (
              <Reveal key={i} delay={0.15 + i * 0.08}>
                <p className="leading-relaxed">{p}</p>
              </Reveal>
            ))}
          </div>
          <Reveal delay={0.25}>
            <Link href="/about" className="btn btn-outline mt-10">
              More about us <Icon name="arrowRight" className="size-4" />
            </Link>
          </Reveal>
        </div>

        <Reveal delay={0.15} className="lg:pt-14">
          <div className="card p-8">
            <dl className="grid grid-cols-2 gap-6 border-b border-white/[0.08] pb-8">
              {STATS.map((s) => (
                <div key={s.label} className="flex flex-col-reverse">
                  <dt className="mt-2 text-sm text-muted">{s.label}</dt>
                  <dd className="text-5xl font-semibold tracking-tight text-ink tabular-nums">
                    <CountUp to={s.value} suffix={s.suffix} />
                  </dd>
                </div>
              ))}
            </dl>
            <div className="mt-8 space-y-6">
              {STRENGTHS.map((s) => (
                <Meter key={s.label} label={s.label} value={s.value} />
              ))}
            </div>
          </div>
        </Reveal>
      </section>

      {/* Services */}
      <section className="relative isolate py-24 sm:py-32">
        <div aria-hidden className="absolute inset-x-0 top-0 -z-10 h-full bg-[radial-gradient(50%_40%_at_50%_0%,rgb(110_60_220/0.14),transparent_70%)]" />
        <div className={CONTAINER}>
          <SectionHead
            align="split"
            eyebrow="Our services"
            lines={[
              "Everything your site",
              <>
                needs to <Accent>shine.</Accent>
              </>,
            ]}
            intro="Design and build it, keep it healthy, and bring people to it — three services that work best together."
          />
          <div className="mt-16">
            <ServiceCards />
          </div>
        </div>
      </section>

      {/* Statement */}
      <section className={`${CONTAINER} py-16 sm:py-24`}>
        <Reveal>
          <blockquote className="mx-auto max-w-5xl text-center font-serif text-[clamp(1.9rem,4.2vw,3.6rem)] leading-[1.12] text-ink italic">
            “{ABOUT.statement}”
          </blockquote>
        </Reveal>
        <Reveal delay={0.15}>
          <div className="mt-10 flex justify-center">
            <Link href="/contact-us" className="btn btn-primary btn-lg">
              Get a quote
              <span className="btn-arrow">
                <Icon name="arrowUpRight" className="size-4" />
              </span>
            </Link>
          </div>
        </Reveal>
      </section>

      <Process />
      <Why />
      <FinalCta />
    </>
  );
}
