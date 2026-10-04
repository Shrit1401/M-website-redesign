import type { Metadata } from "next";
import { PaymentForm } from "@/components/Forms";
import { Icon } from "@/components/Icon";
import { Reveal } from "@/components/Motion";
import { Accent, CONTAINER, PageHero } from "@/components/Sections";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Make a Payment",
  description: "Pay a Nebula Webtech LLC invoice online.",
  alternates: { canonical: "/make-a-payment" },
};

const STEPS = [
  "Enter the invoice number and amount from your invoice.",
  "Continue to our secure payment page to pay by card.",
  "You'll receive an emailed receipt once the payment completes.",
];

export default function PaymentPage() {
  return (
    <>
      <PageHero
        eyebrow="Make a payment"
        crumbs={[{ label: "Make a Payment" }]}
        lines={[
          <>
            Pay your invoice <Accent>online.</Accent>
          </>,
        ]}
        intro="A quick, secure way to settle a Nebula Webtech invoice."
      />

      <section className={`${CONTAINER} grid gap-6 pb-24 sm:pb-32 lg:grid-cols-[1.25fr_0.75fr]`}>
        <Reveal>
          <div className="card p-6 sm:p-10">
            <h2 className="flex items-center gap-3 text-2xl font-semibold tracking-tight text-ink">
              <Icon name="card" className="size-6 text-violet" /> Invoice details
            </h2>
            <div className="mt-8">
              <PaymentForm />
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <aside className="space-y-4">
            <div className="card p-7">
              <p className="text-xs tracking-[0.18em] text-muted uppercase">How it works</p>
              <ol className="mt-5 space-y-4">
                {STEPS.map((s, i) => (
                  <li key={s} className="flex gap-4 text-sm leading-relaxed text-ink-soft">
                    <span className="grid size-7 shrink-0 place-items-center rounded-full border border-violet/40 text-xs font-semibold text-violet">
                      {i + 1}
                    </span>
                    {s}
                  </li>
                ))}
              </ol>
            </div>
            <div className="card flex items-start gap-4 p-7">
              <Icon name="lock" className="mt-0.5 size-5 shrink-0 text-violet" />
              <p className="text-sm leading-relaxed text-ink-soft">
                Card details are entered on our payment processor&apos;s secure page — they never touch this website.
              </p>
            </div>
            <div className="card p-7">
              <p className="text-sm text-ink-soft">Questions about an invoice?</p>
              <a href={SITE.phoneHref} className="mt-2 block text-lg font-semibold text-ink hover:text-violet">
                {SITE.phone}
              </a>
              <a href={`mailto:${SITE.email}`} className="mt-1 block text-sm text-muted hover:text-ink">
                {SITE.email}
              </a>
            </div>
          </aside>
        </Reveal>
      </section>
    </>
  );
}
