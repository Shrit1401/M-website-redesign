import Link from "next/link";
import { ENGAGEMENTS } from "@/lib/content";
import { Icon } from "./Icon";
import { Reveal, Spotlight } from "./Motion";
import { SectionHead } from "./SectionHead";

export function Engagements() {
  return (
    <section id="engagements" className="mx-auto max-w-[1400px] px-5 py-28 sm:px-10 lg:py-36">
      <SectionHead
        index="03"
        eyebrow="Ways to work with us"
        lines={[
          "Choose your",
          <span key="l" className="font-serif font-normal tracking-[-0.01em] text-brand italic">
            starting point.
          </span>,
        ]}
        sub="Every engagement is scoped to you and custom-quoted."
      />

      <div className="mt-16 grid gap-5 lg:grid-cols-3">
        {ENGAGEMENTS.map((e, i) => (
          <Reveal key={e.id} delay={i * 0.1} className="h-full">
            <Spotlight
              className={`spot relative flex h-full flex-col rounded-3xl p-8 transition-transform duration-500 hover:-translate-y-1.5 ${
                e.featured ? "border-2 border-brand bg-white shadow-[0_40px_80px_-40px_rgba(0,119,181,0.55)]" : "card"
              }`}
            >
              {e.featured && (
                <span className="absolute -top-3 left-7 rounded-full bg-brand px-3 py-1 text-xs font-medium text-white">
                  Most requested
                </span>
              )}
              <p className="text-xs text-muted tabular-nums">0{i + 1}</p>
              <h3 className="mt-3 text-2xl font-medium tracking-tight text-ink">{e.name}</h3>
              <p className="mt-2 min-h-12 text-sm leading-relaxed text-muted">{e.tagline}</p>

              <div className="mt-5 flex items-baseline gap-2">
                <span className="font-serif text-5xl tracking-tight text-ink italic">Custom quote</span>
              </div>
              <p className="mt-1 inline-flex items-center gap-1.5 text-xs text-brand">
                <span className="size-1.5 animate-pulse rounded-full bg-brand" />
                Pricing will be revealed shortly
              </p>

              <ul className="mt-6 mb-8 space-y-3 border-t border-line pt-6">
                {e.points.map((pt) => (
                  <li key={pt} className="flex items-start gap-3 text-sm text-ink-soft">
                    <Icon name="check" className="mt-0.5 size-4 shrink-0 text-brand" />
                    {pt}
                  </li>
                ))}
              </ul>

              <Link
                href={`/contact?engagement=${e.id}`}
                className={`btn mt-auto w-full justify-between ${e.featured ? "btn-primary" : "btn-outline"}`}
              >
                {e.cta} <Icon name="arrowRight" className="size-4" />
              </Link>
              {e.demo && (
                <Link
                  href={e.demo.href}
                  className="mt-3 inline-flex items-center justify-center gap-1.5 text-sm text-ink-soft transition-colors hover:text-brand"
                >
                  {e.demo.label} <Icon name="arrowUpRight" className="size-3.5" />
                </Link>
              )}
            </Spotlight>
          </Reveal>
        ))}
      </div>

      <Link
        href="/contact?engagement=unsure"
        className="card mt-5 flex w-full items-center justify-center gap-2 rounded-3xl px-6 py-6 text-base text-ink-soft transition-colors hover:border-brand/40 hover:text-brand"
      >
        Need a custom solution? Let’s scope it together. <Icon name="arrowUpRight" className="size-4" />
      </Link>
    </section>
  );
}
