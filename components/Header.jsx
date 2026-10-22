"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { EASE } from "./Motion";
import { getLenis } from "./SmoothScroll";
import { APP_DETAILS, INDUSTRIES, NAV, QUOTE_HREF, SITE } from "@/lib/content";

/** Emblem + stacked FARASHA / POS SOLUTIONS, as the guidelines ask for in-product navigation. */
function Lockup() {
  return (
    <span className="lockup">
      <img src="/brand/emblem-256.png" alt="" width="60" height="60" />
      <span className="lockup-text">
        <span className="lockup-name">Farasha</span>
        <span className="lockup-sub">POS Solutions</span>
      </span>
    </span>
  );
}

// The Apps link opens a two-column menu: every app (its section on /apps) and every industry (its card on home).
const APPS_MENU = [
  { title: "Apps", items: APP_DETAILS.map((a) => ({ href: `/apps#${a.id}`, label: a.kicker, note: a.title })) },
  { title: "Industries", items: INDUSTRIES.map((x) => ({ href: `/#industry-${x.id}`, label: x.title, note: x.kicker })) },
];

const Chevron = () => (
  <svg className="nav-chevron" width="10" height="10" viewBox="0 0 10 10" aria-hidden="true">
    <path d="M2 3.5 5 6.5 8 3.5" fill="none" stroke="currentColor" strokeWidth="1.4" />
  </svg>
);

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, "change", (y) => setScrolled(y > 24));

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    if (open) getLenis()?.stop();
    else getLenis()?.start();
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const current = (href) => (pathname === href ? "page" : undefined);

  const navLinks = NAV.map((n) =>
    n.href === "/apps" ? (
      <div key={n.href} className="nav-item">
        <Link href={n.href} aria-current={current(n.href)} aria-haspopup="true">
          {n.label} <Chevron />
        </Link>
        <div className="nav-menu">
          <div className="nav-menu-inner">
            {APPS_MENU.map((g) => (
              <div key={g.title} className="nav-menu-group">
                <p className="label label-mint">{g.title}</p>
                <ul>
                  {g.items.map((m) => (
                    <li key={m.href}>
                      <Link href={m.href}>
                        <strong>{m.label}</strong>
                        <span>{m.note}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    ) : (
      <Link key={n.href} href={n.href} aria-current={current(n.href)}>
        {n.label}
      </Link>
    )
  );

  const mobileLinks = NAV.map((n) => (
    <div key={n.href} className="mobile-group">
      <Link href={n.href} aria-current={current(n.href)}>{n.label}</Link>
      {n.href === "/apps" && (
        <div className="mobile-sub">
          {APPS_MENU.flatMap((g) => g.items).map((m) => <Link key={m.href} href={m.href}>{m.label}</Link>)}
        </div>
      )}
    </div>
  ));

  return (
    <header className={`header ${scrolled || open ? "is-solid" : ""} ${open ? "is-open" : ""}`}>
      <div className="container header-row">
        <Link href="/" aria-label="Farasha POS Solutions home"><Lockup /></Link>
        <nav className="header-nav" aria-label="Primary">{navLinks}</nav>
        <div className="header-actions">
          <a className="header-link" href={SITE.demoOrdering} target="_blank" rel="noreferrer">Demo ordering site ↗</a>
          <Link className="btn btn-green btn-sm" href={QUOTE_HREF}>Request a quote</Link>
          <button className="menu-btn" aria-expanded={open} aria-controls="mobile-menu" onClick={() => setOpen((o) => !o)}>
            <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
            <span className={`menu-icon ${open ? "is-open" : ""}`} aria-hidden="true"><i /><i /></span>
          </button>
        </div>
      </div>
      <AnimatePresence>
        {open && (
          <motion.nav
            id="mobile-menu"
            className="mobile-menu"
            aria-label="Mobile"
            initial={{ height: 0 }}
            animate={{ height: "auto" }}
            exit={{ height: 0 }}
            transition={{ duration: 0.5, ease: EASE }}
          >
            <div className="container">
              {mobileLinks}
              <Link className="btn btn-green" href={QUOTE_HREF}>Request a quote</Link>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
