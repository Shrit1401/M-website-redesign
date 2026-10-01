import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Icon } from "@/components/Icon";
import { Reveal } from "@/components/Motion";
import { Accent, PageHero } from "@/components/PageHero";
import { SectionHead } from "@/components/SectionHead";
import { ABOUT, CAREERS, SITE } from "@/lib/content";

export const metadata: Metadata = {
  title: "Careers",
  description: "Build your career with Macro Software Solution LLC and shape the next generation of IT solutions.",
};

export default function CareersPage() {
  return (
    <>
      <PageHero
        eyebrow="Careers"
        crumbs={[{ label: "Careers" }]}
        lines={["Join the future", <Accent key="a">of tech innovation.</Accent>]}
        intro={CAREERS.intro}
      >
        <Link href="/contact?tab=inquiry&topic=Careers" className="btn btn-primary btn-lg group mt-10">
          Introduce yourself
          <span className="grid size-7 place-items-center rounded-full bg-white/15 transition-transform duration-500 group-hover:rotate-45">
            <Icon name="arrowUpRight" className="size-4" />
          </span>
        </Link>
      </PageHero>

      <section className="mx-auto max-w-[1400px] px-5 py-28 sm:px-10 lg:py-36">
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
          <SectionHead
            index="01"
            eyebrow="Life at Macro"
            lines={["A culture of", <Accent key="a">innovation and growth.</Accent>]}
          />
          <Reveal delay={0.1}>
            <figure className="border-l-2 border-brand pl-6">
              <blockquote className="font-serif text-2xl leading-snug text-ink italic sm:text-3xl">
                “{ABOUT.quote}”
              </blockquote>
            </figure>
          </Reveal>
        </div>

        <div className="mt-16 grid gap-6 lg:grid-cols-[1fr_1.2fr]">
          <Reveal>
            <div className="relative h-full min-h-80 overflow-hidden rounded-[2rem]">
              <Image
                src="/images/careers.jpg"
                alt="The Macro team collaborating in the office"
                fill
                sizes="(min-width: 1024px) 45vw, 100vw"
                className="object-cover"
              />
            </div>
          </Reveal>
          <div className="grid gap-4 sm:grid-cols-2">
            {CAREERS.perks.map((p, i) => (
              <Reveal key={p.title} delay={i * 0.08}>
                <div className="card h-full rounded-3xl p-7">
                  <span className="grid size-12 place-items-center rounded-2xl bg-brand-soft text-brand">
                    <Icon name={p.icon} className="size-5" />
                  </span>
                  <h3 className="mt-8 text-xl font-medium tracking-tight text-ink">{p.title}</h3>
                  <p className="mt-2 leading-relaxed text-muted">{p.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1400px] px-5 pb-28 sm:px-10">
        <Reveal>
          <div className="relative overflow-hidden rounded-[2rem] bg-ink px-8 py-16 text-white sm:px-14 sm:py-20">
            <div
              aria-hidden
              className="pointer-events-none absolute -right-20 -bottom-40 size-[30rem] rounded-full bg-brand/50 blur-[120px]"
            />
            <div className="relative grid gap-10 lg:grid-cols-[1.2fr_1fr] lg:items-center">
              <div>
                <p className="text-xs tracking-[0.2em] text-white/60 uppercase">Open roles</p>
                <h2 className="mt-5 text-[clamp(2rem,4vw,3.4rem)] leading-[1.05] font-medium tracking-[-0.04em]">
                  No listings right now —{" "}
                  <span className="font-serif font-normal text-[#8fd3f7] italic">we still want to hear from you.</span>
                </h2>
                <p className="mt-5 max-w-lg text-white/70">
                  Engineers, designers, DevOps and marketers: send a short introduction and your CV, and we’ll reach out
                  when a role fits.
                </p>
              </div>
              <div className="flex flex-col gap-3 lg:items-end">
                <Link
                  href="/contact?tab=inquiry&topic=Careers"
                  className="btn btn-lg bg-white text-ink hover:bg-brand-soft"
                >
                  Send an introduction <Icon name="arrowRight" className="size-4" />
                </Link>
                <a href={`mailto:${SITE.email}?subject=Careers`} className="text-sm text-white/70 hover:text-white">
                  or email {SITE.email}
                </a>
              </div>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}
