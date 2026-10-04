"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useScroll, useSpring } from "motion/react";
import { NAV, SITE } from "@/lib/site";
import { SERVICES } from "@/lib/services";
import { Icon } from "./Icon";
import { Logo } from "./Logo";
import { EASE, Magnetic } from "./Motion";
import { OpenStatus } from "./OpenStatus";
import { setScrollLocked } from "./SmoothScroll";

/**
 * Site header — three layers (see docs/design/05-components.md#header):
 *  1. Utility strip (desktop): live office status, phone, email, payment link. Folds away on scroll.
 *  2. Main bar: logo · centred nav with a sliding hover pill · "Start a project". Glass once scrolled.
 *  3. A hairline scroll-progress beam along the bottom edge in the nebula gradient.
 * Mobile gets a full-screen menu with large numbered links.
 */
export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);
  const [menuFor, setMenuFor] = useState(pathname);
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 200, damping: 40, mass: 0.3 });

  // Close the mobile menu on navigation (adjusting state during render, not in an effect).
  if (menuFor !== pathname) {
    setMenuFor(pathname);
    setOpen(false);
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    setScrollLocked(true);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      setScrollLocked(false);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));
  const active = NAV.find((n) => isActive(n.href))?.href ?? null;
  const pillFor = hovered ?? active;
  const solid = scrolled || open;

  return (
    <motion.header
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 1, ease: EASE, delay: 0.1 }}
      className="fixed inset-x-0 top-0 z-50"
    >
      {/* 1 — utility strip */}
      <div
        className={`hidden overflow-hidden border-b border-white/[0.06] text-xs text-muted transition-[height,opacity] duration-500 lg:block ${
          scrolled ? "h-0 opacity-0" : "h-9 opacity-100"
        }`}
      >
        <div className="mx-auto flex h-9 max-w-[1400px] items-center justify-between px-10">
          <div className="flex items-center gap-5">
            <OpenStatus />
            <span aria-hidden className="h-3 w-px bg-white/10" />
            <span>
              {SITE.address.city}, {SITE.address.region}
            </span>
          </div>
          <div className="flex items-center gap-5">
            <a href={SITE.phoneHref} className="transition-colors hover:text-ink">
              {SITE.phone}
            </a>
            <a href={`mailto:${SITE.email}`} className="transition-colors hover:text-ink">
              {SITE.email}
            </a>
            <span aria-hidden className="h-3 w-px bg-white/10" />
            <Link href="/make-a-payment" className="inline-flex items-center gap-1.5 text-ink-soft transition-colors hover:text-ink">
              <Icon name="card" className="size-3.5 text-violet" /> Make a payment
            </Link>
          </div>
        </div>
      </div>

      {/* 2 — main bar */}
      <div
        className={`relative z-50 transition-[background-color,border-color,box-shadow] duration-500 ${
          solid
            ? "border-b border-white/[0.08] bg-bg/75 shadow-[0_20px_50px_-30px_rgba(0,0,0,0.9)] backdrop-blur-xl"
            : "border-b border-transparent"
        }`}
      >
        <div className="mx-auto grid h-[72px] max-w-[1400px] grid-cols-[1fr_auto] items-center px-5 sm:px-10 lg:grid-cols-[1fr_auto_1fr]">
          <Logo className="h-7 w-auto sm:h-8" />

          <nav className="hidden lg:block" aria-label="Primary" onPointerLeave={() => setHovered(null)}>
            <ul className="flex items-center rounded-full border border-white/[0.08] bg-white/[0.03] p-1 backdrop-blur-md">
              {NAV.map((item) => (
                <li
                  key={item.href}
                  className={item.href === "/services" ? "group relative" : "relative"}
                  onPointerEnter={() => setHovered(item.href)}
                >
                  <Link
                    href={item.href}
                    aria-current={isActive(item.href) ? "page" : undefined}
                    className={`relative z-10 flex items-center gap-1 rounded-full px-4 py-2 text-sm transition-colors ${
                      pillFor === item.href ? "text-ink" : "text-ink-soft hover:text-ink"
                    }`}
                    onFocus={() => setHovered(item.href)}
                    onBlur={() => setHovered(null)}
                  >
                    {item.label}
                    {item.href === "/services" && (
                      <svg viewBox="0 0 24 24" className="size-3.5 transition-transform group-hover:rotate-180" aria-hidden>
                        <path d="m6 9 6 6 6-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                      </svg>
                    )}
                  </Link>
                  {pillFor === item.href && (
                    <motion.span
                      layoutId="nav-pill"
                      transition={{ type: "spring", stiffness: 420, damping: 36 }}
                      className="absolute inset-0 rounded-full bg-white/[0.08] shadow-[inset_0_0_0_1px_rgb(255_255_255/0.08)]"
                    />
                  )}
                  {active === item.href && (
                    <span
                      aria-hidden
                      className="absolute -bottom-[5px] left-1/2 size-1 -translate-x-1/2 rounded-full bg-violet shadow-[0_0_8px_rgb(166_123_255)]"
                    />
                  )}
                  {item.href === "/services" && <ServicesMenu />}
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center justify-end gap-2">
            <Magnetic strength={0.25}>
              <Link href="/contact-us" className="btn btn-primary hidden py-2 pr-1.5 text-sm sm:inline-flex">
                Start a project
                <span className="btn-arrow size-7">
                  <Icon name="arrowUpRight" className="size-3.5" />
                </span>
              </Link>
            </Magnetic>
            <button
              className="grid size-11 place-items-center rounded-full border border-white/10 bg-white/[0.06] text-ink lg:hidden"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              aria-controls="mobile-nav"
              onClick={() => setOpen((v) => !v)}
            >
              <Icon name={open ? "close" : "menu"} className="size-5" />
            </button>
          </div>
        </div>

        {/* 3 — scroll progress beam */}
        <motion.span
          aria-hidden
          style={{ scaleX: progress }}
          className={`absolute inset-x-0 -bottom-px h-px origin-left bg-gradient-to-r from-violet-600 via-violet to-pink transition-opacity duration-500 ${
            scrolled ? "opacity-100" : "opacity-0"
          }`}
        />
      </div>

      <AnimatePresence>{open && <MobileMenu isActive={isActive} />}</AnimatePresence>
    </motion.header>
  );
}

/** Services dropdown: opens on hover and on keyboard focus (focus-within). */
function ServicesMenu() {
  return (
    <div className="invisible absolute top-full left-1/2 w-[620px] -translate-x-1/2 pt-4 opacity-0 transition-all duration-300 group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100">
      <div className="grid grid-cols-[1.35fr_1fr] gap-2 rounded-3xl border border-white/10 bg-surface/95 p-2 shadow-[0_30px_60px_-20px_rgba(0,0,0,0.9)] backdrop-blur-xl">
        <ul>
          {SERVICES.map((s) => (
            <li key={s.slug}>
              <Link
                href={`/services/${s.slug}`}
                className="group/item flex items-start gap-3.5 rounded-2xl p-3 transition-colors hover:bg-white/[0.05]"
              >
                <span className="grid size-10 shrink-0 place-items-center rounded-xl border border-white/10 text-violet transition-colors group-hover/item:border-violet group-hover/item:bg-violet group-hover/item:text-[#12091f]">
                  <Icon name={s.icon} className="size-4" />
                </span>
                <span>
                  <span className="block text-sm font-semibold text-ink">{s.title}</span>
                  <span className="mt-0.5 line-clamp-2 block text-xs leading-relaxed text-muted">{s.summary}</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
        <Link
          href="/projects"
          className="group/feat relative isolate flex flex-col justify-end overflow-hidden rounded-2xl border border-white/[0.08] p-5"
        >
          <span aria-hidden className="nebula-wash absolute inset-0 -z-10" />
          <span aria-hidden className="starfield absolute inset-0 -z-10 opacity-70" />
          <span
            aria-hidden
            className="orbit-spin absolute -top-16 -right-16 -z-10 size-48 rounded-full border border-white/10 [animation-duration:30s]"
          >
            <span className="absolute top-1/2 -left-1 size-2 rounded-full bg-violet shadow-[0_0_12px_3px_rgb(166_123_255/0.7)]" />
          </span>
          <span className="text-xs font-semibold tracking-[0.2em] text-violet uppercase">Our work</span>
          <span className="mt-2 text-lg leading-snug font-semibold text-ink">See what we&apos;ve launched — and what&apos;s next.</span>
          <span className="mt-4 inline-flex items-center gap-1.5 text-sm text-ink-soft transition-colors group-hover/feat:text-ink">
            View projects <Icon name="arrowRight" className="size-4 transition-transform group-hover/feat:translate-x-1" />
          </span>
        </Link>
      </div>
    </div>
  );
}

function MobileMenu({ isActive }: { isActive: (href: string) => boolean }) {
  const links = [{ label: "Home", href: "/" }, ...NAV, { label: "Make a payment", href: "/make-a-payment" }];
  return (
    <motion.div
      id="mobile-nav"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35, ease: EASE }}
      className="fixed inset-0 z-40 flex flex-col overflow-y-auto bg-bg/95 px-5 pt-24 pb-8 backdrop-blur-2xl sm:px-10 lg:hidden"
      data-lenis-prevent
    >
      <div aria-hidden className="nebula-wash pointer-events-none absolute inset-0 -z-10 opacity-70" />
      <div aria-hidden className="starfield pointer-events-none absolute inset-0 -z-10 opacity-50" />
      <nav aria-label="Mobile">
        <ol>
          {links.map((item, i) => (
            <motion.li
              key={item.href}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: EASE, delay: 0.05 + i * 0.045 }}
            >
              <Link
                href={item.href}
                aria-current={isActive(item.href) ? "page" : undefined}
                className="group flex items-baseline gap-4 border-b border-white/[0.07] py-4"
              >
                <span className="w-7 font-serif text-sm text-muted italic">0{i + 1}</span>
                <span
                  className={`flex-1 text-[clamp(1.9rem,8vw,2.6rem)] leading-none font-semibold tracking-[-0.03em] ${
                    isActive(item.href) ? "nebula-text" : "text-ink"
                  }`}
                >
                  {item.label}
                </span>
                <Icon name="arrowUpRight" className="size-5 self-center text-muted transition-transform group-hover:rotate-45" />
              </Link>
            </motion.li>
          ))}
        </ol>
      </nav>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="mt-auto grid gap-3 pt-10"
      >
        <OpenStatus className="text-sm text-ink-soft" />
        <a href={SITE.phoneHref} className="btn btn-outline w-full">
          <Icon name="call" className="size-4" /> {SITE.phone}
        </a>
        <Link href="/contact-us" className="btn btn-primary w-full">
          Start a project <Icon name="arrowUpRight" className="size-4" />
        </Link>
      </motion.div>
    </motion.div>
  );
}
