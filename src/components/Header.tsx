"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { NAV } from "@/lib/content";
import { SERVICES } from "@/lib/services";
import { Icon } from "./Icon";
import { Logo } from "./Logo";
import { Magnetic } from "./Motion";

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

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <motion.header
      initial={{ y: -30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
      className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-6"
    >
      <div
        className={`mx-auto flex h-16 max-w-[1400px] items-center justify-between rounded-full pr-2 pl-5 transition-all duration-500 sm:pl-6 ${
          scrolled || open
            ? "border border-white/60 bg-white/75 shadow-[0_10px_40px_-15px_rgba(10,22,34,0.25)] backdrop-blur-xl"
            : "border border-transparent"
        }`}
      >
        <Logo className="h-10 w-auto sm:h-11" />

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
          {NAV.slice(0, 5).map((item) =>
            item.href === "/services" ? (
              <div key={item.href} className="group relative">
                <Link
                  href={item.href}
                  className={`flex items-center gap-1 rounded-full px-4 py-2 text-sm transition-colors hover:bg-brand-soft hover:text-brand ${
                    isActive(item.href) ? "text-brand" : "text-ink-soft"
                  }`}
                >
                  {item.label}
                  <svg viewBox="0 0 24 24" className="size-3.5 transition-transform group-hover:rotate-180" aria-hidden>
                    <path d="m6 9 6 6 6-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </Link>
                {/* Mega-menu: opens on hover/focus-within */}
                <div className="invisible absolute top-full left-1/2 w-[640px] -translate-x-1/2 pt-3 opacity-0 transition-all duration-300 group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100">
                  <div className="grid grid-cols-2 gap-1 rounded-3xl border border-line bg-white/95 p-3 shadow-[0_30px_60px_-20px_rgba(10,22,34,0.3)] backdrop-blur-xl">
                    {SERVICES.map((s) => (
                      <Link
                        key={s.slug}
                        href={`/services/${s.slug}`}
                        className="group/item flex items-start gap-3 rounded-2xl p-3 transition-colors hover:bg-brand-soft"
                      >
                        <span className="grid size-9 shrink-0 place-items-center rounded-xl border border-line bg-white text-brand transition-colors group-hover/item:border-brand group-hover/item:bg-brand group-hover/item:text-white">
                          <Icon name={s.icon} className="size-4" />
                        </span>
                        <span>
                          <span className="block text-sm font-medium text-ink">{s.title}</span>
                          <span className="mt-0.5 line-clamp-1 block text-xs text-muted">{s.summary}</span>
                        </span>
                      </Link>
                    ))}
                    <Link
                      href="/services"
                      className="flex items-center justify-between rounded-2xl bg-ink px-4 py-3 text-sm text-white transition-colors hover:bg-brand"
                    >
                      All services <Icon name="arrowRight" className="size-4" />
                    </Link>
                  </div>
                </div>
              </div>
            ) : (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-full px-4 py-2 text-sm transition-colors hover:bg-brand-soft hover:text-brand ${
                  isActive(item.href) ? "text-brand" : "text-ink-soft"
                }`}
              >
                {item.label}
              </Link>
            ),
          )}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <Link
            href="/contact"
            className={`rounded-full px-4 py-2 text-sm transition-colors hover:text-brand ${isActive("/contact") ? "text-brand" : "text-ink-soft"}`}
          >
            Contact
          </Link>
          <Magnetic strength={0.25}>
            <Link href="/contact" className="btn btn-primary group py-2.5 pr-2 text-sm">
              Get started
              <span className="grid size-7 place-items-center rounded-full bg-white/15 transition-transform duration-500 group-hover:rotate-45">
                <Icon name="arrowUpRight" className="size-3.5" />
              </span>
            </Link>
          </Magnetic>
        </div>

        <button
          className="grid size-11 place-items-center rounded-full bg-ink text-white lg:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <Icon name={open ? "close" : "menu"} className="size-5" />
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mx-auto mt-2 max-h-[calc(100svh-6rem)] max-w-[1400px] overflow-y-auto rounded-3xl border border-white/60 bg-white/95 px-6 pb-6 shadow-xl backdrop-blur-xl lg:hidden"
            aria-label="Mobile"
          >
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`block border-b border-line py-4 text-2xl font-medium tracking-tight ${
                  isActive(item.href) ? "text-brand" : "text-ink"
                }`}
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/careers"
              className="block border-b border-line py-4 text-2xl font-medium tracking-tight text-ink"
            >
              Careers
            </Link>
            <Link href="/contact" className="btn btn-primary mt-6 w-full">
              Get started <Icon name="arrowUpRight" className="size-4" />
            </Link>
          </motion.nav>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
