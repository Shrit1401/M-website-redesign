import type { Metadata } from "next";
import Link from "next/link";
import { CareerAuth } from "@/components/CareerAuth";
import { Icon } from "@/components/Icon";
import { Reveal } from "@/components/Motion";
import { Accent, PageHero } from "@/components/PageHero";
import { SectionHead } from "@/components/SectionHead";

export const metadata: Metadata = {
  title: "My Career Twin",
  description:
    "My Career Twin — a custom SaaS product by Macro Software Solution LLC that mirrors your skills, goals and next career move.",
};

const FEATURES = [
  { icon: "sparkles", title: "AI career profile", body: "A living twin of your skills, experience and ambitions." },
  { icon: "chart", title: "Growth roadmap", body: "Clear next steps toward the role you actually want." },
  { icon: "layers", title: "Resume & portfolio", body: "Polished, tailored versions generated from one profile." },
  { icon: "shield", title: "Private by default", body: "Your data stays yours, shared only when you choose." },
] as const;

const JOB_HELP_HREF = "/contact?topic=Job%20search%20marketing";

const JOB_MARKETING = [
  "Resume & LinkedIn rewritten to get noticed",
  "Your profile pitched to recruiters and hiring teams",
  "Targeted applications for roles that fit you",
  "Personal brand content that keeps you visible",
] as const;

export default function CareerPage() {
  return (
    <>
      <PageHero
        eyebrow="Custom SaaS Product"
        crumbs={[{ label: "My Career Twin" }]}
        lines={["My Career", <Accent key="a">Twin.</Accent>]}
        intro="Your digital career double: it learns your skills, maps your goals and helps you land the next move. Built and launched by Macro."
      />

      <section className="mx-auto max-w-[1400px] px-5 pt-28 pb-36 sm:px-10 lg:pt-36">
        <div className="grid gap-14 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
          <div>
            <SectionHead
              index="01"
              eyebrow="What it does"
              lines={["One profile,", <Accent key="a">every next step.</Accent>]}
            />
            <div className="mt-12 grid gap-4 sm:grid-cols-2">
              {FEATURES.map((f, i) => (
                <Reveal key={f.title} delay={i * 0.08}>
                  <div className="card h-full rounded-3xl p-7">
                    <span className="grid size-12 place-items-center rounded-2xl bg-brand-soft text-brand">
                      <Icon name={f.icon} className="size-5" />
                    </span>
                    <h3 className="mt-8 text-xl font-medium tracking-tight text-ink">{f.title}</h3>
                    <p className="mt-2 leading-relaxed text-muted">{f.body}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>

          <Reveal delay={0.1} className="lg:sticky lg:top-28">
            <CareerAuth />
          </Reveal>
        </div>

        <Reveal>
          <div className="relative mt-20 overflow-hidden rounded-[2rem] bg-ink px-8 py-14 text-white sm:px-14 sm:py-16">
            <div
              aria-hidden
              className="pointer-events-none absolute -right-20 -bottom-40 size-[30rem] rounded-full bg-brand/50 blur-[120px]"
            />
            <div className="relative grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:items-center">
              <div>
                <p className="text-xs tracking-[0.2em] text-white/60 uppercase">Looking for a job?</p>
                <h2 className="mt-5 text-[clamp(2rem,4vw,3.4rem)] leading-[1.05] font-medium tracking-[-0.04em]">
                  Need help finding work?{" "}
                  <span className="font-serif font-normal text-[#8fd3f7] italic">We’ll market you.</span>
                </h2>
                <p className="mt-5 max-w-lg text-white/70">
                  Our marketing team puts you in front of the right employers, so the job search isn’t on you alone.
                </p>
                <Link href={JOB_HELP_HREF} className="btn btn-lg mt-8 bg-white text-ink hover:bg-brand-soft">
                  Get job search help <Icon name="arrowRight" className="size-4" />
                </Link>
              </div>
              <ul className="space-y-4">
                {JOB_MARKETING.map((pt) => (
                  <li key={pt} className="flex items-start gap-3 text-white/85">
                    <Icon name="check" className="mt-0.5 size-5 shrink-0 text-[#8fd3f7]" />
                    {pt}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Reveal>

        <Link
          href="/quote?engagement=career"
          className="card mt-16 flex w-full items-center justify-center gap-2 rounded-3xl px-6 py-6 text-base text-ink-soft transition-colors hover:border-brand/40 hover:text-brand"
        >
          Want a SaaS product like this for your business? Let’s build it. <Icon name="arrowUpRight" className="size-4" />
        </Link>
      </section>

      {/* Always-visible job search marketing offer while on this page */}
      <div className="fixed inset-x-0 bottom-0 z-40 px-3 pb-3 sm:px-6">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-3 rounded-full border border-line bg-white py-2 pr-2 pl-5 shadow-[0_10px_40px_-15px_rgba(10,22,34,0.35)]">
          <p className="text-sm text-ink-soft">
            <span className="font-medium text-ink">Looking for a job?</span>
            <span className="hidden sm:inline"> We can market you to employers.</span>
          </p>
          <Link href={JOB_HELP_HREF} className="btn btn-primary shrink-0 py-2 text-sm">
            Get help <Icon name="arrowUpRight" className="size-3.5" />
          </Link>
        </div>
      </div>
    </>
  );
}
