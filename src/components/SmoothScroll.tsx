"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";

let lenis: Lenis | null = null;

/** Smooth-scroll to a selector, falling back to native scrolling when Lenis is off. */
export function scrollToTarget(target: string) {
  if (lenis) lenis.scrollTo(target, { offset: -96, duration: 1.4 });
  else document.querySelector(target)?.scrollIntoView({ behavior: "smooth" });
}

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    lenis = new Lenis({ autoRaf: true, lerp: 0.09, anchors: { offset: -96, duration: 1.4 } });
    document.documentElement.classList.add("lenis");
    return () => {
      lenis?.destroy();
      lenis = null;
    };
  }, []);

  // Lenis keeps its own scroll target, so reset it on client-side navigation or it drags the new page back down.
  useEffect(() => {
    if (!window.location.hash) lenis?.scrollTo(0, { immediate: true, force: true });
  }, [pathname]);

  return <>{children}</>;
}
