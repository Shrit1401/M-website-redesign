"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { CUSTOM_QUOTE_NOTE, NAV } from "@/lib/content";
import { SERVICES } from "@/lib/services";
import { Icon } from "./Icon";
import { Logo } from "./Logo";

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
    <header
      className={`fixed inset-x-0 top-0 z-50 border-b bg-white transition-shadow duration-300 ${
        scrolled || open ? "border-line shadow-[0_12px_30px_-20px_rgba(10,22,34,0.35)]" : "border-line/70"
      }`}
    >
      {/* Brand rule along the top edge */}
      <div aria-hidden className="h-[3px] bg-[linear-gradient(90deg,#0a3350,#0077b5_45%,#35a8e6)]" />

      <div className="mx-auto flex h-[68px] max-w-[1400px] items-center justify-between gap-6 px-5 sm:px-10">
        <Logo className="h-10 w-auto sm:h-11" />

        <nav className="hidden h-full items-stretch lg:flex" aria-label="Primary">
          {NAV.map((item) => {
            const active = isActive(item.href);
            const link = (
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`relative flex h-full items-center gap-1 px-4 text-[0.92rem] font-medium transition-colors hover:text-brand ${
                  active ? "text-brand" : "text-ink-soft"
                }`}
              >
                {item.label}
                {item.href === "/services" && (
                  <svg viewBox="0 0 24 24" className="size-3.5 transition-transform group-hover:rotate-180" aria-hidden>
                    <path d="m6 9 6 6 6-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                )}
                {active && (
                  <motion.span
                    layoutId="nav-active"
                    className="absolute inset-x-4 -bottom-px h-[3px] rounded-t-full bg-brand"
                    transition={{ type: "spring", stiffness: 500, damping: 40 }}
                  />
                )}
              </Link>
            );

            if (item.href !== "/services") return <div key={item.href}>{link}</div>;

            return (
              <div key={item.href} className="group">
                {link}
                {/* Full-width services panel: opens on hover/focus-within */}
                <div className="invisible absolute inset-x-0 top-full border-t border-line bg-white opacity-0 shadow-[0_30px_50px_-30px_rgba(10,22,34,0.35)] transition-all duration-200 group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100">
                  <div className="mx-auto grid max-w-[1400px] gap-8 px-10 py-8 lg:grid-cols-[18rem_1fr]">
                    <div className="flex flex-col rounded-2xl bg-ink p-6 text-white">
                      <p className="text-xs tracking-[0.2em] text-[#8fd3f7] uppercase">Our services</p>
                      <p className="mt-3 text-xl leading-snug font-medium">Software, apps &amp; IT — under one roof.</p>
                      <p className="mt-3 text-sm leading-relaxed text-white/65">{CUSTOM_QUOTE_NOTE}</p>
                      <div className="mt-auto flex flex-col gap-2 pt-6">
                        <Link
                          href="/quote"
                          className="flex items-center justify-between rounded-lg bg-brand px-4 py-2.5 text-sm font-medium hover:bg-brand-400"
                        >
                          Get a quote <Icon name="arrowRight" className="size-4" />
                        </Link>
                        <Link
                          href="/services"
                          className="flex items-center justify-between rounded-lg border border-white/20 px-4 py-2.5 text-sm hover:bg-white/10"
                        >
                          All services <Icon name="arrowRight" className="size-4" />
                        </Link>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-1">
                      {SERVICES.map((s) => (
                        <Link
                          key={s.slug}
                          href={`/services/${s.slug}`}
                          className="group/item flex items-start gap-3 rounded-xl p-3 transition-colors hover:bg-bg"
                        >
                          <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-brand-soft text-brand transition-colors group-hover/item:bg-brand group-hover/item:text-white">
                            <Icon name={s.icon} className="size-4" />
                          </span>
                          <span>
                            <span className="block text-sm font-medium text-ink group-hover/item:text-brand">
                              {s.title}
                            </span>
                            <span className="mt-0.5 line-clamp-2 block text-xs leading-relaxed text-muted">
                              {s.summary}
                            </span>
                          </span>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/quote"
            className={`hidden items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-medium text-white transition-colors sm:inline-flex ${
              isActive("/quote") ? "bg-ink" : "bg-brand hover:bg-ink"
            }`}
          >
            <Icon name="receipt" className="size-4" />
            Get a quote
          </Link>
          <button
            className="grid size-11 place-items-center rounded-lg border border-line text-ink lg:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            <Icon name={open ? "close" : "menu"} className="size-5" />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden border-t border-line bg-white lg:hidden"
            aria-label="Mobile"
          >
            <div className="max-h-[calc(100svh-72px)] overflow-y-auto px-5 pb-8 sm:px-10">
              {[...NAV, { label: "Careers", href: "/careers" }].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center justify-between border-b border-line py-4 text-xl font-medium tracking-tight ${
                    isActive(item.href) ? "text-brand" : "text-ink"
                  }`}
                >
                  {item.label}
                  <Icon name="arrowRight" className="size-4 text-muted" />
                </Link>
              ))}
              <Link
                href="/quote"
                className="mt-6 flex items-center justify-center gap-2 rounded-lg bg-brand px-5 py-3.5 font-medium text-white"
              >
                <Icon name="receipt" className="size-4" />
                Get a quote
              </Link>
              <p className="mt-3 text-center text-xs text-muted">{CUSTOM_QUOTE_NOTE}</p>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
