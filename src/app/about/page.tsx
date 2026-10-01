import type { Metadata } from "next";
import Image from "next/image";
import { Icon } from "@/components/Icon";
import { Reveal } from "@/components/Motion";
import { Accent, PageHero } from "@/components/PageHero";
import { SectionHead } from "@/components/SectionHead";
import { Engagements } from "@/components/Engagements";
import { FinalCta } from "@/components/Sections";
import { ABOUT } from "@/lib/content";

export const metadata: Metadata = {
  title: "About us",
  description:
    "Macro Software Solution LLC is a technology services company helping businesses build, scale and manage digital solutions — SaaS, cloud, custom software, mobile and IT.",
};

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About us"
        crumbs={[{ label: "About" }]}
        lines={["We’re building solutions", <Accent key="a">businesses trust.</Accent>]}
        intro={ABOUT.intro}
      />

      {/* Story */}
      <section className="mx-auto grid max-w-[1400px] gap-12 px-5 py-28 sm:px-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:py-36">
        <Reveal>
          <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem]">
            <Image
              src="/images/about-us.jpg"
              alt="A developer working on a programming dashboard"
              fill
              sizes="(min-width: 1024px) 55vw, 100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-brand/30 via-transparent to-transparent mix-blend-multiply" />
          </div>
        </Reveal>
        <div>
          <SectionHead
            index="01"
            eyebrow="Who we are"
            lines={["Simplifying technology", <Accent key="a">for growth.</Accent>]}
          />
          <Reveal delay={0.1}>
            {ABOUT.story.map((p) => (
              <p key={p} className="mt-6 text-lg leading-relaxed text-muted">
                {p}
              </p>
            ))}
          </Reveal>
        </div>
      </section>

      {/* Mission */}
      <section className="mx-auto max-w-[1400px] px-5 sm:px-10">
        <Reveal>
          <div className="relative overflow-hidden rounded-[2rem] bg-[linear-gradient(120deg,#0077b5_0%,#005687_60%,#0a3350_100%)] px-8 py-20 text-white sm:px-16 sm:py-28">
            <div
              aria-hidden
              className="pointer-events-none absolute -top-40 -right-20 size-[34rem] rounded-full bg-[#35a8e6]/40 blur-[120px]"
            />
            <p className="relative text-xs tracking-[0.2em] text-white/70 uppercase">Our mission</p>
            <p className="relative mt-8 max-w-5xl text-[clamp(1.8rem,3.6vw,3.2rem)] leading-[1.15] font-medium tracking-[-0.03em]">
              {ABOUT.mission}
            </p>
          </div>
        </Reveal>
      </section>

      {/* Why choose us */}
      <section className="mx-auto max-w-[1400px] px-5 py-28 sm:px-10 lg:py-36">
        <SectionHead
          index="02"
          eyebrow="Why choose us"
          lines={["Innovation, security", <Accent key="a">and reliability.</Accent>]}
        />
        <div className="mt-16 grid gap-px overflow-hidden rounded-3xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
          {ABOUT.values.map((v, i) => (
            <Reveal key={v.title} delay={i * 0.08} className="h-full bg-white">
              <div className="flex h-full flex-col p-8">
                <span className="text-[3.5rem] leading-none font-light tracking-[-0.05em] text-brand/25 tabular-nums">
                  0{i + 1}
                </span>
                <h3 className="mt-10 text-2xl font-medium tracking-tight text-ink">{v.title}</h3>
                <p className="mt-3 leading-relaxed text-muted">{v.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Impact */}
      <section className="mx-auto max-w-[1400px] px-5 sm:px-10">
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <SectionHead index="03" eyebrow="Impact" lines={["Built for", <Accent key="a">real-world use.</Accent>]} />
            <Reveal delay={0.1}>
              <figure className="mt-10 border-l-2 border-brand pl-6">
                <blockquote className="font-serif text-2xl leading-snug text-ink italic sm:text-3xl">
                  “{ABOUT.quote}”
                </blockquote>
              </figure>
            </Reveal>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {ABOUT.impact.map((m, i) => (
              <Reveal key={m.title} delay={i * 0.08}>
                <div className="card h-full rounded-3xl p-7">
                  <span className="grid size-11 place-items-center rounded-full bg-brand-soft text-brand">
                    <Icon name={(["nodes", "shield", "globe", "layers"] as const)[i]} className="size-5" />
                  </span>
                  <h3 className="mt-6 text-lg font-medium text-ink">{m.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{m.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <Engagements />
      <FinalCta />
    </>
  );
}
