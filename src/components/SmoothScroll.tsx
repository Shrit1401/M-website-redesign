"use client";

import { useEffect } from "react";
import Lenis from "lenis";

let lenis: Lenis | null = null;

/** Smooth-scroll to a selector, falling back to native scrolling when Lenis is off. */
export function scrollToTarget(target: string) {
  if (lenis) lenis.scrollTo(target, { offset: -72, duration: 1.4 });
  else document.querySelector(target)?.scrollIntoView({ behavior: "smooth" });
}

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    lenis = new Lenis({ autoRaf: true, lerp: 0.09, anchors: { offset: -72, duration: 1.4 } });
    document.documentElement.classList.add("lenis");
    return () => {
      lenis?.destroy();
      lenis = null;
    };
  }, []);

  return <>{children}</>;
}
