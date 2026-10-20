"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { EASE } from "./Motion";
import { getLenis } from "./SmoothScroll";
import { NAV, QUOTE_HREF, SITE } from "@/lib/content";

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

  const navLinks = NAV.map((n) => (
    <Link key={n.href} href={n.href} aria-current={pathname === n.href ? "page" : undefined}>
      {n.label}
    </Link>
  ));

  return (
    <header className={`header ${scrolled || open ? "is-solid" : ""} ${open ? "is-open" : ""}`}>
      <div className="container header-row">
        <Link href="/" aria-label="Farasha POS Solutions home"><Lockup /></Link>
        <nav className="header-nav" aria-label="Primary">{navLinks}</nav>
        <div className="header-actions">
          <a className="header-link" href={SITE.liveOrdering} target="_blank" rel="noreferrer">Live ordering site ↗</a>
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
              {navLinks}
              <Link className="btn btn-green" href={QUOTE_HREF}>Request a quote</Link>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
