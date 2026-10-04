"use client";

import { useSyncExternalStore } from "react";

// Office hours from SITE.hours: Monday–Friday, 9 am – 5 pm, Palatine (America/Chicago).
const TZ = "America/Chicago";

const subscribe = (tick: () => void) => {
  const id = window.setInterval(tick, 15_000);
  return () => window.clearInterval(id);
};
// A new value every 15 s re-renders the clock; the server snapshot is 0 so SSR renders a placeholder
// and the real time only appears after hydration (no mismatch).
const getSnapshot = () => Math.floor(Date.now() / 15_000);
const getServerSnapshot = () => 0;

function officeClock() {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat("en-US", { timeZone: TZ, weekday: "short", hour: "numeric", hour12: false })
      .formatToParts(new Date())
      .map((p) => [p.type, p.value]),
  );
  const hour = Number(parts.hour) % 24;
  const open = !["Sat", "Sun"].includes(parts.weekday) && hour >= 9 && hour < 17;
  const time = new Intl.DateTimeFormat("en-US", { timeZone: TZ, hour: "numeric", minute: "2-digit" }).format(new Date());
  return { open, time };
}

export function useOfficeClock() {
  const tick = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  return tick === 0 ? null : officeClock();
}

/** "● Open now" / "● Closed · opens Mon–Fri 9 am" with a pulsing dot. */
export function OpenStatus({ className = "" }: { className?: string }) {
  const clock = useOfficeClock();
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <span className="relative flex size-2">
        {clock?.open && <span className="absolute inset-0 animate-ping rounded-full bg-signal/60" />}
        <span className={`relative size-2 rounded-full ${clock?.open ? "bg-signal" : "bg-white/25"}`} />
      </span>
      {clock ? (clock.open ? "Open now" : "Closed · back Mon–Fri, 9 am CST") : "Mon–Fri, 9 am – 5 pm CST"}
    </span>
  );
}

/** "10:42 AM in Palatine" — the office's local time, so out-of-state visitors know when we'll reply. */
export function OfficeTime({ className = "" }: { className?: string }) {
  const clock = useOfficeClock();
  return <span className={`tabular-nums ${className}`}>{clock ? `${clock.time} in Palatine` : "Palatine, IL"}</span>;
}
