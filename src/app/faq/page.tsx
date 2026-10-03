import type { Metadata } from "next";
import Link from "next/link";
import { FaqList } from "@/components/Faq";
import { Icon } from "@/components/Icon";
import { JsonLd } from "@/components/JsonLd";
import { Reveal } from "@/components/Motion";
import { Accent, PageHero } from "@/components/PageHero";
import { FAQS, FAQ_CATEGORIES, SITE } from "@/lib/content";

export const metadata: Metadata = {
  title: "FAQ",
  description:
    "Answers about Macro Software Solution’s services, custom quotes, AI and answer engine optimization, security and support.",
};

const slug = (s: string) => s.toLowerCase().replace(/[^a-z]+/g, "-");

export default function FaqPage() {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: FAQS.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        }}
      />
      <PageHero
        eyebrow="FAQ"
        crumbs={[{ label: "FAQ" }]}
        lines={["Questions,", <Accent key="a">answered.</Accent>]}
        intro="Straight answers about our services, custom quotes, AI optimization, security and support."
      />

      <section className="mx-auto grid max-w-[1400px] gap-14 px-5 py-24 sm:px-10 lg:grid-cols-[0.6fr_1.4fr] lg:py-32">
        <aside className="lg:sticky lg:top-32 lg:self-start">
          <nav aria-label="FAQ categories" className="flex flex-wrap gap-2 lg:flex-col lg:items-start">
            {FAQ_CATEGORIES.map((c) => (
              <a
                key={c}
                href={`#${slug(c)}`}
                className="rounded-full border border-line bg-white px-4 py-2 text-sm text-ink-soft transition-colors hover:border-brand hover:text-brand"
              >
                {c}
              </a>
            ))}
          </nav>
          <div className="card mt-8 hidden rounded-3xl p-6 lg:block">
            <p className="font-medium text-ink">Still have a question?</p>
            <p className="mt-2 text-sm text-muted">We usually reply within one business day.</p>
            <Link href="/contact" className="btn btn-primary mt-5 w-full justify-between">
              Ask us <Icon name="arrowRight" className="size-4" />
            </Link>
            <a href={SITE.phoneHref} className="mt-4 block text-center text-sm text-muted hover:text-brand">
              {SITE.phone}
            </a>
          </div>
        </aside>

        <div className="space-y-20">
          {FAQ_CATEGORIES.map((c) => (
            <Reveal key={c}>
              <div id={slug(c)} className="scroll-mt-32">
                <h2 className="mb-6 text-[clamp(1.8rem,3vw,2.6rem)] font-medium tracking-[-0.03em] text-ink">{c}</h2>
                <FaqList items={FAQS.filter((f) => f.category === c)} idPrefix={slug(c)} />
              </div>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}
