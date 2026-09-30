import { AI_SERVICE, NAV, PILLARS, SERVICES, SITE } from "@/lib/content";
import { Icon } from "./Icon";
import { Logo } from "./Logo";
import { Magnetic, MaskLines, Reveal, Spotlight } from "./Motion";
import { SectionHead } from "./SectionHead";
import { ProcessSteps } from "./ProcessSteps";

const Serif = ({ children }: { children: React.ReactNode }) => (
  <span className="font-serif font-normal tracking-[-0.01em] text-brand italic">{children}</span>
);

export function Pillars() {
  return (
    <div className="mx-auto max-w-[1400px] px-5 sm:px-10">
      <Reveal>
        <ul className="grid grid-cols-2 border-y border-line md:grid-cols-4">
          {PILLARS.map((p, i) => (
            <li
              key={p.label}
              className={`flex items-center gap-3 py-6 text-sm text-ink-soft md:justify-center ${
                i > 0 ? "md:border-l md:border-line" : ""
              } ${i % 2 === 1 ? "border-l border-line md:border-l" : ""}`}
            >
              <Icon name={p.icon} className="ml-4 size-5 text-brand md:ml-0" />
              {p.label}
            </li>
          ))}
        </ul>
      </Reveal>
    </div>
  );
}

export function Services() {
  return (
    <section id="services" className="mx-auto max-w-[1400px] px-5 py-28 sm:px-10 lg:py-40">
      <SectionHead
        index="01"
        eyebrow="Services"
        lines={["One partner.", <Serif key="l">Every layer.</Serif>]}
        sub="From the product your customers use to the systems behind it."
      />

      <div className="mt-16 grid gap-px overflow-hidden rounded-3xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
        {SERVICES.map((s, i) => (
          <Spotlight key={s.title} className="spot group bg-white">
            <a href="#start" className="flex h-full min-h-64 flex-col p-7 lg:p-8">
              <div className="flex items-start justify-between">
                <span className="grid size-12 place-items-center rounded-full border border-line text-brand transition-all duration-500 group-hover:border-brand group-hover:bg-brand group-hover:text-white">
                  <Icon name={s.icon} className="size-5" />
                </span>
                <span className="text-xs text-muted tabular-nums">0{i + 1}</span>
              </div>
              <h3 className="mt-auto pt-10 text-xl font-medium tracking-tight text-ink">{s.title}</h3>
              <div className="mt-2 flex items-end justify-between gap-4">
                <p className="text-sm leading-relaxed text-muted">{s.body}</p>
                <span className="shrink-0 -translate-x-2 text-brand opacity-0 transition-all duration-500 group-hover:translate-x-0 group-hover:opacity-100">
                  <Icon name="arrowUpRight" className="size-5" />
                </span>
              </div>
            </a>
          </Spotlight>
        ))}
      </div>

      {/* AI optimization / AEO — the page's one bold colour moment */}
      <Reveal className="mt-6">
        <div className="relative overflow-hidden rounded-3xl bg-[linear-gradient(120deg,#0077b5_0%,#005687_60%,#0a3350_100%)] p-8 text-white sm:p-12">
          <div
            aria-hidden
            className="pointer-events-none absolute -top-40 -right-20 size-[34rem] rounded-full bg-[#35a8e6]/40 blur-[120px]"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-[0.12]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.6) 1px, transparent 1px)",
              backgroundSize: "48px 48px",
              maskImage: "linear-gradient(90deg, transparent, #000 70%)",
            }}
          />
          <div className="relative grid gap-10 lg:grid-cols-[1.25fr_1fr] lg:items-end">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3 py-1 text-xs backdrop-blur">
                <Icon name="sparkles" className="size-3.5" /> New service
              </span>
              <h3 className="mt-6 text-[clamp(2rem,4vw,3.4rem)] leading-[1.02] font-medium tracking-[-0.035em]">
                AI optimization &<br />
                <span className="font-serif font-normal italic">answer engine</span> optimization
              </h3>
              <p className="mt-5 max-w-xl leading-relaxed text-white/75">{AI_SERVICE.body}</p>
            </div>
            <ul className="grid gap-2.5 sm:grid-cols-2">
              {AI_SERVICE.points.map((pt) => (
                <li
                  key={pt}
                  className="flex items-start gap-2.5 rounded-2xl border border-white/15 bg-white/[0.08] p-4 text-sm backdrop-blur-md"
                >
                  <Icon name="check" className="mt-0.5 size-4 shrink-0 text-[#8fd3f7]" />
                  {pt}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

export function Marquee() {
  const words = ["SaaS", "Cloud", "Custom software", "IT infrastructure", "Web", "Mobile", "Marketing", "AI & AEO"];
  const row = (hidden?: boolean) => (
    <div className="flex shrink-0 items-center" aria-hidden={hidden}>
      {words.map((w, i) => (
        <span key={w} className="flex items-center">
          <span
            className={`px-8 text-[clamp(3rem,8vw,7rem)] leading-none font-medium tracking-[-0.04em] whitespace-nowrap ${
              i % 2 ? "text-outline" : "text-ink"
            }`}
          >
            {w}
          </span>
          <span className="size-3 rounded-full bg-brand" />
        </span>
      ))}
    </div>
  );
  return (
    <div className="overflow-hidden border-y border-line bg-white py-10" role="presentation">
      <div className="marquee flex w-max">
        {row()}
        {row(true)}
      </div>
    </div>
  );
}

export function Process() {
  return (
    <section id="process" className="mx-auto max-w-[1400px] px-5 py-28 sm:px-10 lg:py-40">
      <div className="grid gap-16 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="lg:sticky lg:top-32 lg:self-start">
          <SectionHead
            index="02"
            eyebrow="Our process"
            lines={["A clear path", "from idea", <Serif key="l">to impact.</Serif>]}
          />
        </div>
        <ProcessSteps />
      </div>
    </section>
  );
}

export function Testimonial() {
  return (
    <section className="mx-auto max-w-[1400px] px-5 py-28 sm:px-10 lg:py-36">
      <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <SectionHead
          index="04"
          eyebrow="Client perspectives"
          lines={["Trust, built", <Serif key="l">through collaboration.</Serif>]}
        />
        <Reveal delay={0.15}>
          <figure className="relative rounded-3xl border border-line bg-white p-10 sm:p-14">
            <Icon name="quote" className="absolute -top-6 left-10 size-12 text-brand" />
            <blockquote className="font-serif text-[clamp(2rem,3.6vw,3.2rem)] leading-[1.08] tracking-[-0.01em] text-ink italic">
              “Your next customer story belongs here.”
            </blockquote>
            <figcaption className="mt-8 flex items-center gap-4 text-sm text-muted">
              <span className="size-11 rounded-full bg-gradient-to-br from-brand-soft to-brand/30" />
              Testimonial layout · Approved client quote pending
            </figcaption>
          </figure>
        </Reveal>
      </div>
    </section>
  );
}

export function FinalCta() {
  return (
    <section className="mx-auto max-w-[1400px] px-5 pb-10 sm:px-10">
      <Reveal>
        <div className="relative overflow-hidden rounded-[2rem] bg-ink px-6 py-24 text-center text-white sm:py-32">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(40% 70% at 0% 100%, rgba(53,168,230,0.55), transparent 70%), radial-gradient(40% 70% at 100% 0%, rgba(0,119,181,0.65), transparent 70%), linear-gradient(115deg, transparent 50%, rgba(143,211,247,0.18) 62%, transparent 72%)",
            }}
          />
          <div className="relative">
            <MaskLines
              className="mx-auto text-[clamp(2.8rem,8vw,7.5rem)] leading-[0.95] font-medium tracking-[-0.045em]"
              lines={[
                "Let’s build what",
                <span key="l" className="font-serif font-normal text-[#8fd3f7] italic">
                  comes next.
                </span>,
              ]}
            />
            <div className="mt-12">
              <Magnetic>
                <a href="#start" className="btn btn-lg group bg-white text-ink hover:bg-brand-soft">
                  Start a conversation
                  <span className="grid size-7 place-items-center rounded-full bg-brand text-white transition-transform duration-500 group-hover:rotate-45">
                    <Icon name="arrowUpRight" className="size-4" />
                  </span>
                </a>
              </Magnetic>
            </div>
            <p className="mt-6 text-sm">
              <a
                href={`mailto:${SITE.email}`}
                className="text-white/70 underline-offset-4 hover:text-white hover:underline"
              >
                {SITE.email}
              </a>
            </p>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="overflow-hidden">
      <div className="mx-auto flex max-w-[1400px] flex-col gap-8 px-5 py-12 sm:px-10 md:flex-row md:items-center md:justify-between">
        <Logo sub="Software Solution LLC" />
        <nav className="flex flex-wrap gap-x-8 gap-y-3 text-sm text-ink-soft" aria-label="Footer">
          {NAV.map((item) => (
            <a key={item.href} href={item.href} className="hover:text-brand">
              {item.label}
            </a>
          ))}
        </nav>
        <div className="text-sm text-muted md:text-right">
          <p>© {new Date().getFullYear()} Macro Software Solution LLC</p>
          <p className="mt-1">SaaS + IT solutions</p>
        </div>
      </div>
      <p
        aria-hidden
        className="-mt-[4vw] -mb-[0.22em] text-center text-[27vw] leading-none font-semibold tracking-[-0.07em] select-none"
        style={{
          background: "linear-gradient(180deg, rgba(0,119,181,0.16), rgba(0,119,181,0.02) 80%)",
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          color: "transparent",
        }}
      >
        macro
      </p>
    </footer>
  );
}
