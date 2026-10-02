"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { NAV, SITE } from "@/lib/site";
import { SERVICES } from "@/lib/services";
import { Icon } from "./Icon";
import { Logo } from "./Logo";
import { EASE, Magnetic } from "./Motion";

export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [menuFor, setMenuFor] = useState(pathname);

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
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));
  const linkClass = (href: string) =>
    `rounded-full px-4 py-2 text-sm transition-colors hover:bg-white/[0.06] hover:text-ink ${
      isActive(href) ? "text-ink" : "text-ink-soft"
    }`;

  return (
    <motion.header
      initial={{ y: -30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 1, ease: EASE, delay: 0.1 }}
      className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-6"
    >
      <div
        className={`mx-auto flex h-16 max-w-[1400px] items-center justify-between rounded-full pr-2 pl-5 transition-all duration-500 sm:pl-6 ${
          scrolled || open
            ? "border border-white/10 bg-[#0d0819]/80 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.8)] backdrop-blur-xl"
            : "border border-transparent"
        }`}
      >
        <Logo className="h-7 w-auto sm:h-8" />

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
          {NAV.slice(0, 3).map((item) =>
            item.href === "/services" ? (
              <div key={item.href} className="group relative">
                <Link href={item.href} className={`flex items-center gap-1 ${linkClass(item.href)}`}>
                  {item.label}
                  <svg viewBox="0 0 24 24" className="size-3.5 transition-transform group-hover:rotate-180" aria-hidden>
                    <path d="m6 9 6 6 6-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </Link>
                {/* Services menu: opens on hover/focus-within */}
                <div className="invisible absolute top-full left-1/2 w-[440px] -translate-x-1/2 pt-3 opacity-0 transition-all duration-300 group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100">
                  <div className="rounded-3xl border border-white/10 bg-[#120c22]/95 p-2 shadow-[0_30px_60px_-20px_rgba(0,0,0,0.9)] backdrop-blur-xl">
                    {SERVICES.map((s) => (
                      <Link
                        key={s.slug}
                        href={`/services/${s.slug}`}
                        className="group/item flex items-start gap-3.5 rounded-2xl p-3 transition-colors hover:bg-white/[0.05]"
                      >
                        <span className="grid size-10 shrink-0 place-items-center rounded-xl border border-white/10 text-violet transition-colors group-hover/item:border-violet group-hover/item:bg-violet group-hover/item:text-[#12091f]">
                          <Icon name={s.icon} className="size-4" />
                        </span>
                        <span>
                          <span className="block text-sm font-semibold text-ink">{s.title}</span>
                          <span className="mt-0.5 line-clamp-2 block text-xs leading-relaxed text-muted">
                            {s.summary}
                          </span>
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <Link key={item.href} href={item.href} className={linkClass(item.href)}>
                {item.label}
              </Link>
            ),
          )}
          <Link href="/make-a-payment" className={linkClass("/make-a-payment")}>
            Make a Payment
          </Link>
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <a href={SITE.phoneHref} className="rounded-full px-4 py-2 text-sm text-ink-soft transition-colors hover:text-ink">
            {SITE.phone}
          </a>
          <Magnetic strength={0.25}>
            <Link href="/contact-us" className="btn btn-primary py-2 pr-1.5 text-sm">
              Contact us
              <span className="btn-arrow size-7">
                <Icon name="arrowUpRight" className="size-3.5" />
              </span>
            </Link>
          </Magnetic>
        </div>

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

      <AnimatePresence>
        {open && (
          <motion.nav
            id="mobile-nav"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: EASE }}
            className="mx-auto mt-2 max-h-[calc(100svh-6rem)] max-w-[1400px] overflow-y-auto rounded-3xl border border-white/10 bg-[#0d0819]/95 px-6 pb-6 shadow-2xl backdrop-blur-xl lg:hidden"
            aria-label="Mobile"
          >
            {[...NAV, { label: "Make a Payment", href: "/make-a-payment" }].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center justify-between border-b border-white/[0.08] py-4 text-2xl font-semibold tracking-tight ${
                  isActive(item.href) ? "text-violet" : "text-ink"
                }`}
              >
                {item.label}
                <Icon name="arrowRight" className="size-5 text-muted" />
              </Link>
            ))}
            <a href={SITE.phoneHref} className="btn btn-outline mt-6 w-full">
              <Icon name="call" className="size-4" /> {SITE.phone}
            </a>
            <Link href="/contact-us" className="btn btn-primary mt-3 w-full">
              Get started <Icon name="arrowUpRight" className="size-4" />
            </Link>
          </motion.nav>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
