"use client";

import { Icon } from "./Icon";
import { scrollToTop } from "./SmoothScroll";

export function BackToTop() {
  return (
    <button
      type="button"
      onClick={scrollToTop}
      className="group inline-flex items-center gap-2 text-xs text-muted transition-colors hover:text-ink"
    >
      Back to top
      <span className="grid size-8 place-items-center rounded-full border border-white/10 transition-colors group-hover:border-violet group-hover:bg-violet group-hover:text-[#12091f]">
        <Icon name="arrowUp" className="size-3.5 transition-transform duration-500 group-hover:-translate-y-0.5" />
      </span>
    </button>
  );
}
