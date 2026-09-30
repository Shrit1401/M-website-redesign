"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { NAV } from "@/lib/content";
import { Icon } from "./Icon";
import { Logo } from "./Logo";
import { Magnetic } from "./Motion";

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
      className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-6"
    >
      <div
        className={`mx-auto flex h-16 max-w-[1400px] items-center justify-between rounded-full pr-2 pl-4 transition-all duration-500 sm:pl-5 ${
          scrolled || open
            ? "border border-white/60 bg-white/70 shadow-[0_10px_40px_-15px_rgba(10,22,34,0.25)] backdrop-blur-xl"
            : "border border-transparent"
        }`}
      >
        <Logo />
        <nav className="hidden items-center gap-1 md:flex" aria-label="Primary">
          {NAV.slice(0, 4).map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="rounded-full px-4 py-2 text-sm text-ink-soft transition-colors hover:bg-brand-soft hover:text-brand"
            >
              {item.label}
            </a>
          ))}
        </nav>
        <div className="hidden md:block">
          <Magnetic strength={0.25}>
            <a href="#start" className="btn btn-primary group py-2.5 pr-2 text-sm">
              Start a project
              <span className="grid size-7 place-items-center rounded-full bg-white/15 transition-transform duration-500 group-hover:rotate-45">
                <Icon name="arrowUpRight" className="size-3.5" />
              </span>
            </a>
          </Magnetic>
        </div>
        <button
          className="grid size-11 place-items-center rounded-full bg-ink text-white md:hidden"
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
            className="mx-auto mt-2 max-w-[1400px] rounded-3xl border border-white/60 bg-white/90 px-6 pb-6 shadow-xl backdrop-blur-xl md:hidden"
            aria-label="Mobile"
          >
            {NAV.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="block border-b border-line py-4 text-2xl font-medium tracking-tight text-ink"
              >
                {item.label}
              </a>
            ))}
            <a href="#start" onClick={() => setOpen(false)} className="btn btn-primary mt-6 w-full">
              Start a project <Icon name="arrowUpRight" className="size-4" />
            </a>
          </motion.nav>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
