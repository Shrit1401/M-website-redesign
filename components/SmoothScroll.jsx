"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";

let lenis = null;
export const getLenis = () => lenis;

/** Lenis smooth scrolling for the whole site; jumps to the top (or the linked section) on every route change. */
export default function SmoothScroll() {
  const pathname = usePathname();

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // `anchors` smooth-scrolls in-page #links; each target's CSS scroll-margin keeps it clear of the fixed header.
    lenis = new Lenis({ lerp: 0.1, anchors: true });
    let id;
    const raf = (t) => {
      lenis.raf(t);
      id = requestAnimationFrame(raf);
    };
    id = requestAnimationFrame(raf);
    return () => {
      cancelAnimationFrame(id);
      lenis.destroy();
      lenis = null;
    };
  }, []);

  // New page: start at the top, unless the link targets a section (e.g. /apps#kiosk).
  useEffect(() => {
    const target = window.location.hash && document.querySelector(window.location.hash);
    if (target) {
      requestAnimationFrame(() => {
        if (lenis) lenis.scrollTo(target, { immediate: true, force: true });
        else target.scrollIntoView();
      });
      return;
    }
    lenis?.scrollTo(0, { immediate: true, force: true });
  }, [pathname]);

  return null;
}
