import Image from "next/image";
import Link from "next/link";
import { SITE } from "@/lib/site";
import { SERVICES } from "@/lib/services";
import mark from "../../public/nebula-mark-white.png";
import { BackToTop } from "./BackToTop";
import { NewsletterForm } from "./Forms";
import { Icon, type IconName } from "./Icon";
import { OfficeTime, OpenStatus } from "./OpenStatus";
import { CONTAINER } from "./Sections";

/**
 * Site footer — four bands (see docs/design/05-components.md#footer):
 *  1. Contact deck: three large cells (email, phone, visit) joined by hairlines.
 *  2. Brand + newsletter, link columns and live office hours.
 *  3. Horizon: a planet-edge arc rising over the gradient "Nebula" wordmark.
 *  4. Legal bar with back-to-top.
 */

const COLUMNS = [
  {
    title: "Explore",
    links: [
      { label: "Home", href: "/" },
      { label: "About", href: "/about" },
      { label: "Projects", href: "/projects" },
      { label: "Blog", href: "/blog" },
      { label: "Contact us", href: "/contact-us" },
    ],
  },
  {
    title: "Services",
    links: [
      ...SERVICES.map((s) => ({ label: s.title, href: `/services/${s.slug}` })),
      { label: "All services", href: "/services" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "Make a payment", href: "/make-a-payment" },
      { label: "Privacy policy", href: "/privacy-policy" },
      { label: "Terms & conditions", href: "/terms-and-conditions" },
      { label: "Sitemap", href: "/sitemap.xml" },
    ],
  },
];

const CONTACT: { icon: IconName; label: string; value: React.ReactNode; href: string; external?: boolean }[] = [
  { icon: "mail", label: "Write to us", value: SITE.email, href: `mailto:${SITE.email}` },
  { icon: "call", label: "Call us", value: SITE.phone, href: SITE.phoneHref },
  {
    icon: "pin",
    label: "Visit us",
    value: `${SITE.address.street}, ${SITE.address.city}`,
    href: SITE.mapsUrl,
    external: true,
  },
];

export function Footer() {
  return (
    <footer className="relative isolate overflow-hidden border-t border-white/[0.06] bg-bg-2">
      <div aria-hidden className="starfield absolute inset-0 -z-10 opacity-40" />

      {/* 1 — contact deck */}
      <div className={`${CONTAINER} pt-16 sm:pt-20`}>
        <ul className="grid gap-px overflow-hidden rounded-[2rem] border border-white/[0.08] bg-white/[0.08] md:grid-cols-3">
          {CONTACT.map((c) => (
            <li key={c.label} className="bg-bg-2">
              <a
                href={c.href}
                {...(c.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                className="group relative flex h-full flex-col gap-10 p-7 transition-colors duration-500 hover:bg-surface sm:p-9"
              >
                <span className="flex items-center justify-between">
                  <span className="flex items-center gap-2.5 text-xs font-semibold tracking-[0.2em] text-muted uppercase">
                    <Icon name={c.icon} className="size-4 text-violet" /> {c.label}
                  </span>
                  <span className="grid size-9 place-items-center rounded-full border border-white/10 text-ink-soft transition-all duration-500 group-hover:rotate-45 group-hover:border-violet group-hover:bg-violet group-hover:text-[#12091f]">
                    <Icon name="arrowUpRight" className="size-4" />
                  </span>
                </span>
                <span className="text-[clamp(1.25rem,2vw,1.6rem)] leading-tight font-semibold tracking-[-0.02em] break-words text-ink">
                  {c.value}
                </span>
                <span
                  aria-hidden
                  className="absolute inset-x-7 bottom-0 h-px origin-left scale-x-0 bg-gradient-to-r from-violet to-pink transition-transform duration-700 group-hover:scale-x-100 sm:inset-x-9"
                />
              </a>
            </li>
          ))}
        </ul>
      </div>

      {/* 2 — brand, links, hours */}
      <div className={`${CONTAINER} grid gap-14 py-16 sm:py-20 lg:grid-cols-[1.1fr_1.9fr] lg:gap-20`}>
        <div>
          <div className="flex items-center gap-4">
            <Image src={mark} alt="" className="h-12 w-auto opacity-90" />
            <span className="h-10 w-px bg-white/10" aria-hidden />
            <p className="font-serif text-2xl leading-tight text-ink italic">{SITE.tagline}</p>
          </div>
          <div className="mt-10 max-w-sm">
            <p className="text-sm font-semibold text-ink">Notes from the studio</p>
            <p className="mt-1 mb-4 text-sm text-ink-soft">New projects, articles and web tips — now and then. No spam.</p>
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
          {COLUMNS.map((col) => (
            <nav key={col.title} aria-label={col.title}>
              <p className="text-xs font-semibold tracking-[0.2em] text-muted uppercase">{col.title}</p>
              <ul className="mt-5 space-y-3">
                {col.links.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="group inline-flex items-center gap-1.5 text-sm text-ink-soft transition-colors hover:text-ink">
                      <span className="h-px w-0 bg-violet transition-all duration-300 group-hover:w-3" aria-hidden />
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
          <div>
            <p className="text-xs font-semibold tracking-[0.2em] text-muted uppercase">Office hours</p>
            <div className="mt-5 space-y-3 text-sm text-ink-soft">
              <OpenStatus className="text-ink" />
              <p>{SITE.hours}</p>
              <p className="text-muted">
                <OfficeTime />
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 3 — horizon */}
      <div aria-hidden className="pointer-events-none relative h-[clamp(8rem,20vw,17rem)] select-none">
        <p className="absolute inset-x-0 bottom-[-0.18em] text-center text-[clamp(5rem,19vw,17rem)] leading-none font-bold tracking-[-0.06em] whitespace-nowrap">
          <span className="bg-gradient-to-b from-white/[0.16] via-violet/[0.08] to-transparent bg-clip-text text-transparent">Nebula</span>
        </p>
        <div className="absolute top-[58%] left-1/2 aspect-square w-[240%] -translate-x-1/2 rounded-full border-t border-violet/40 bg-[radial-gradient(closest-side,var(--bg)_92%,transparent)] shadow-[0_-30px_120px_-20px_rgb(166_123_255/0.55),0_-6px_30px_-6px_rgb(240_106_200/0.5)] sm:w-[160%]" />
      </div>

      {/* 4 — legal bar */}
      <div className="relative border-t border-white/[0.06] bg-bg">
        <div className={`${CONTAINER} flex flex-col gap-4 py-6 text-xs text-muted sm:flex-row sm:items-center sm:justify-between`}>
          <p>
            © {new Date().getFullYear()} {SITE.name}. All rights reserved.
          </p>
          <p className="hidden md:block">Designed &amp; built in Palatine, Illinois.</p>
          <BackToTop />
        </div>
      </div>
    </footer>
  );
}
