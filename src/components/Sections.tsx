import Image from "next/image";
import Link from "next/link";
import { CAPABILITIES, PROCESS, SITE, WHY } from "@/lib/site";
import { SERVICES } from "@/lib/services";
import mark from "../../public/nebula-mark-white.png";
import { NewsletterForm } from "./Forms";
import { Icon } from "./Icon";
import { Magnetic, MaskLines, Reveal, Spotlight } from "./Motion";

export const CONTAINER = "mx-auto w-full max-w-[1400px] px-5 sm:px-10";

/* -------------------------------------------------------- page header */

export function PageHero({
  eyebrow,
  lines,
  intro,
  crumbs,
  children,
}: {
  eyebrow: string;
  lines: React.ReactNode[];
  intro?: string;
  crumbs?: { label: string; href?: string }[];
  children?: React.ReactNode;
}) {
  return (
    <section className="relative isolate overflow-hidden pt-36 pb-20 sm:pt-44 sm:pb-28">
      <div aria-hidden className="nebula-wash absolute inset-0 -z-20" />
      <div aria-hidden className="starfield absolute inset-0 -z-10 opacity-60" />
      {/* Orbit rings from the mark, slowly turning behind the title. */}
      <div aria-hidden className="pointer-events-none absolute top-1/2 right-[-12rem] -z-10 hidden aspect-square w-[46rem] -translate-y-1/2 md:block">
        <div className="orbit-spin absolute inset-0 rounded-full border border-white/[0.07]" />
        <div className="absolute inset-[18%] rounded-full border border-violet/15" />
        <div className="absolute inset-[38%] rounded-full bg-[radial-gradient(circle,rgb(240_106_200/0.25),transparent_65%)]" />
        <div className="orbit-spin absolute inset-0 [animation-duration:24s]">
          <span className="absolute top-1/2 -left-1.5 size-3 rounded-full bg-violet shadow-[0_0_20px_4px_rgb(166_123_255/0.7)]" />
        </div>
      </div>

      <div className={CONTAINER}>
        {crumbs && (
          <nav aria-label="Breadcrumb" className="mb-8 flex flex-wrap items-center gap-2 text-sm text-muted">
            <Link href="/" className="hover:text-ink">
              Home
            </Link>
            {crumbs.map((c) => (
              <span key={c.label} className="flex items-center gap-2">
                <span aria-hidden>/</span>
                {c.href ? (
                  <Link href={c.href} className="hover:text-ink">
                    {c.label}
                  </Link>
                ) : (
                  <span className="text-ink-soft" aria-current="page">
                    {c.label}
                  </span>
                )}
              </span>
            ))}
          </nav>
        )}
        <p className="eyebrow">{eyebrow}</p>
        <MaskLines
          as="h1"
          onMount
          delay={0.1}
          lines={lines}
          className="mt-6 max-w-5xl text-[clamp(2.6rem,6vw,5.4rem)] leading-[0.98] font-semibold tracking-[-0.04em] text-ink"
        />
        {intro && (
          <Reveal delay={0.3}>
            <p className="mt-8 max-w-2xl text-lg leading-relaxed text-ink-soft">{intro}</p>
          </Reveal>
        )}
        {children}
      </div>
    </section>
  );
}

export function SectionHead({
  eyebrow,
  lines,
  intro,
  align = "left",
}: {
  eyebrow: string;
  lines: React.ReactNode[];
  intro?: string;
  align?: "left" | "split";
}) {
  return (
    <div className={align === "split" ? "grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-end" : ""}>
      <div>
        <Reveal>
          <p className="eyebrow">{eyebrow}</p>
        </Reveal>
        <MaskLines
          lines={lines}
          className="mt-5 text-[clamp(2.2rem,4.6vw,4rem)] leading-[1] font-semibold tracking-[-0.04em] text-ink"
        />
      </div>
      {intro && (
        <Reveal delay={0.15}>
          <p className={`text-lg leading-relaxed text-ink-soft ${align === "split" ? "" : "mt-6 max-w-2xl"}`}>{intro}</p>
        </Reveal>
      )}
    </div>
  );
}

/** Serif italic accent used inside headlines. */
export function Accent({ children }: { children: React.ReactNode }) {
  return <span className="nebula-text pr-[0.06em] font-serif font-normal tracking-[-0.01em] italic">{children}</span>;
}

/* ------------------------------------------------------------ marquee */

export function Marquee() {
  const items = [...CAPABILITIES, ...CAPABILITIES];
  return (
    <div className="relative overflow-hidden border-y border-white/[0.06] py-6 [mask-image:linear-gradient(90deg,transparent,#000_12%,#000_88%,transparent)]">
      <ul className="marquee flex w-max items-center gap-10" aria-label="What we do">
        {items.map((c, i) => (
          <li
            key={i}
            aria-hidden={i >= CAPABILITIES.length}
            className="flex items-center gap-10 text-xl font-medium whitespace-nowrap text-ink-soft sm:text-2xl"
          >
            {c}
            <span className="size-1.5 rounded-full bg-violet shadow-[0_0_10px_rgb(166_123_255)]" />
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ----------------------------------------------------------- services */

export function ServiceCards({ headingLevel = "h3" }: { headingLevel?: "h2" | "h3" }) {
  const H = headingLevel;
  return (
    <div className="grid gap-4 lg:grid-cols-3">
      {SERVICES.map((s, i) => (
        <Reveal key={s.slug} delay={i * 0.08} className="h-full">
          <Spotlight className="spot card group h-full overflow-hidden transition-colors duration-500 hover:border-violet/40">
            <Link href={`/services/${s.slug}`} className="flex h-full flex-col p-8 sm:p-10">
              <div className="flex items-start justify-between">
                <span className="grid size-14 place-items-center rounded-2xl border border-white/10 bg-gradient-to-br from-violet/25 to-pink/10 text-violet shadow-[0_0_30px_-6px_rgb(166_123_255/0.6)] transition-transform duration-500 group-hover:-rotate-6">
                  <Icon name={s.icon} className="size-6" />
                </span>
                <span className="font-serif text-4xl text-white/15 italic">0{i + 1}</span>
              </div>
              <H className="mt-12 text-2xl font-semibold tracking-tight text-ink">{s.title}</H>
              <p className="mt-3 flex-1 leading-relaxed text-ink-soft">{s.summary}</p>
              <ul className="mt-8 flex flex-wrap gap-2">
                {s.groups.flatMap((g) => g.items.slice(0, 1)).map((item) => (
                  <li key={item.title} className="rounded-full border border-white/10 px-3 py-1 text-xs text-muted">
                    {item.title}
                  </li>
                ))}
              </ul>
              <span className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-ink">
                Read more
                <span className="grid size-8 place-items-center rounded-full border border-white/15 transition-all duration-500 group-hover:rotate-45 group-hover:border-violet group-hover:bg-violet group-hover:text-[#12091f]">
                  <Icon name="arrowUpRight" className="size-4" />
                </span>
              </span>
            </Link>
          </Spotlight>
        </Reveal>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------ process */

export function Process() {
  return (
    <section className={`${CONTAINER} py-24 sm:py-32`}>
      <SectionHead
        align="split"
        eyebrow="How we work"
        lines={[
          "We are a customer-",
          <>
            focused <Accent>organization.</Accent>
          </>,
        ]}
        intro="Five clear steps from first call to a site that keeps growing — with you involved at every stage."
      />
      <ol className="mt-16 grid gap-px overflow-hidden rounded-3xl border border-white/[0.08] bg-white/[0.08] md:grid-cols-2 lg:grid-cols-5">
        {PROCESS.map((step, i) => (
          <li key={step.title} className="group relative bg-bg p-8 transition-colors duration-500 hover:bg-surface">
            <Reveal delay={i * 0.06}>
              <p className="text-xs font-semibold tracking-[0.2em] text-violet uppercase">Step 0{i + 1}</p>
              <h3 className="mt-10 text-xl font-semibold tracking-tight text-ink">{step.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-ink-soft">{step.body}</p>
            </Reveal>
            <span
              aria-hidden
              className="absolute inset-x-8 bottom-0 h-px origin-left scale-x-0 bg-gradient-to-r from-violet to-pink transition-transform duration-700 group-hover:scale-x-100"
            />
          </li>
        ))}
      </ol>
    </section>
  );
}

/* --------------------------------------------------------------- why */

export function Why() {
  return (
    <section className={`${CONTAINER} py-24 sm:py-32`}>
      <SectionHead
        eyebrow="Why choose us"
        lines={[
          <>
            Why businesses choose <Accent>Nebula.</Accent>
          </>,
        ]}
      />
      <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {WHY.map((w, i) => (
          <Reveal key={w.title} delay={i * 0.07} className="h-full">
            <Spotlight className="spot card h-full p-7">
              <span className="grid size-11 place-items-center rounded-xl bg-white/[0.05] text-violet">
                <Icon name={w.icon} className="size-5" />
              </span>
              <h3 className="mt-8 text-lg font-semibold text-ink">{w.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">{w.body}</p>
            </Spotlight>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ----------------------------------------------------------- final CTA */

export function FinalCta() {
  return (
    <section className={`${CONTAINER} pb-24 sm:pb-32`}>
      <Reveal>
        <div className="relative isolate overflow-hidden rounded-[2rem] border border-white/10 bg-surface px-6 py-20 text-center sm:px-16 sm:py-28">
          <div aria-hidden className="nebula-wash absolute inset-0 -z-10" />
          <div aria-hidden className="starfield absolute inset-0 -z-10 opacity-70" />
          <div aria-hidden className="pointer-events-none absolute top-1/2 left-1/2 -z-10 aspect-[2/1] w-[60rem] max-w-[200%] -translate-x-1/2 -translate-y-1/2 rounded-[50%] border border-white/[0.06]" />
          <div aria-hidden className="pointer-events-none absolute top-1/2 left-1/2 -z-10 aspect-[2/1] w-[36rem] max-w-[150%] -translate-x-1/2 -translate-y-1/2 rounded-[50%] border border-violet/20" />

          <p className="eyebrow justify-center">Let&apos;s talk</p>
          <MaskLines
            className="mx-auto mt-6 max-w-4xl text-[clamp(2.3rem,5.4vw,4.8rem)] leading-[1] font-semibold tracking-[-0.04em] text-ink"
            lines={[
              "Ready to boost your",
              <>
                online <Accent>presence?</Accent>
              </>,
            ]}
          />
          <p className="mx-auto mt-6 max-w-xl text-lg text-ink-soft">
            Elevate your online presence today. Contact us now for tailored web solutions that drive results.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <Magnetic>
              <Link href="/contact-us" className="btn btn-primary btn-lg">
                Get in touch
                <span className="btn-arrow">
                  <Icon name="arrowUpRight" className="size-4" />
                </span>
              </Link>
            </Magnetic>
            <a href={SITE.phoneHref} className="btn btn-outline btn-lg">
              <Icon name="call" className="size-4" /> {SITE.phone}
            </a>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

/* -------------------------------------------------------------- footer */

const FOOTER_LINKS = [
  {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Services", href: "/services" },
      { label: "Contact us", href: "/contact-us" },
      { label: "Make a payment", href: "/make-a-payment" },
    ],
  },
  {
    title: "Services",
    links: SERVICES.map((s) => ({ label: s.title, href: `/services/${s.slug}` })),
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy policy", href: "/privacy-policy" },
      { label: "Terms & conditions", href: "/terms-and-conditions" },
      { label: "Sitemap", href: "/sitemap.xml" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="relative isolate overflow-hidden border-t border-white/[0.06] bg-bg-2">
      <div aria-hidden className="starfield absolute inset-0 -z-10 opacity-40" />
      <div className={`${CONTAINER} grid gap-14 pt-20 pb-12 lg:grid-cols-[1.1fr_1.9fr]`}>
        <div>
          <Image src={mark} alt="" className="h-14 w-auto opacity-90" />
          <p className="mt-6 font-serif text-3xl leading-tight text-ink italic">{SITE.tagline}</p>
          <div className="mt-8 max-w-sm">
            <p className="mb-3 text-sm text-ink-soft">Tips and updates, now and then. No spam.</p>
            <NewsletterForm />
          </div>
          <ul className="mt-8 flex gap-2">
            {SITE.socials.map((s) => (
              <li key={s.label}>
                <a
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="grid size-11 place-items-center rounded-full border border-white/10 text-ink-soft transition-colors hover:border-violet hover:bg-violet hover:text-[#12091f]"
                >
                  <Icon name={s.label.toLowerCase() as "facebook" | "instagram" | "linkedin"} className="size-4" />
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {FOOTER_LINKS.map((col) => (
            <div key={col.title}>
              <p className="text-xs font-semibold tracking-[0.2em] text-muted uppercase">{col.title}</p>
              <ul className="mt-5 space-y-3">
                {col.links.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="text-sm text-ink-soft transition-colors hover:text-ink">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <div>
            <p className="text-xs font-semibold tracking-[0.2em] text-muted uppercase">Get in touch</p>
            <address className="mt-5 space-y-3 text-sm text-ink-soft not-italic">
              <a href={SITE.mapsUrl} target="_blank" rel="noopener noreferrer" className="block hover:text-ink">
                {SITE.address.street}
                <br />
                {SITE.address.city}, {SITE.address.region} {SITE.address.postal}
              </a>
              <a href={SITE.phoneHref} className="block hover:text-ink">
                {SITE.phone}
              </a>
              <a href={`mailto:${SITE.email}`} className="block break-all hover:text-ink">
                {SITE.email}
              </a>
            </address>
          </div>
        </div>
      </div>

      <div className={`${CONTAINER} overflow-hidden`}>
        <p aria-hidden className="text-outline -mb-[0.2em] text-center text-[15.5vw] leading-none font-bold tracking-[-0.05em] whitespace-nowrap select-none lg:text-[13.5rem]">
          Nebula
        </p>
      </div>
      <div className="border-t border-white/[0.06]">
        <div className={`${CONTAINER} flex flex-col gap-2 py-6 text-xs text-muted sm:flex-row sm:justify-between`}>
          <p>© {new Date().getFullYear()} Nebula Webtech LLC. All rights reserved.</p>
          <p>{SITE.hours}</p>
        </div>
      </div>
    </footer>
  );
}
