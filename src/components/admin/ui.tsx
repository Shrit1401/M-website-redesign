import Link from "next/link";
import type { PublishStatus } from "@/lib/content/schema";
import { Icon } from "../Icon";

/* Server-safe display pieces shared by the admin pages. See docs/design/08-admin.md. */

export function PageTitle({
  eyebrow,
  title,
  description,
  actions,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: React.ReactNode;
}) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div>
        {eyebrow && <p className="eyebrow text-[0.65rem]">{eyebrow}</p>}
        <h1 className="mt-3 text-[clamp(1.8rem,3vw,2.4rem)] leading-none font-semibold tracking-[-0.035em] text-ink">{title}</h1>
        {description && <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink-soft">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}

export function StatusPill({ status, scheduled }: { status: PublishStatus; scheduled?: boolean }) {
  const look =
    status === "DRAFT"
      ? { dot: "bg-white/40", text: "Draft", ring: "border-white/10 text-muted" }
      : scheduled
        ? { dot: "bg-warn", text: "Scheduled", ring: "border-warn/30 text-warn" }
        : { dot: "bg-signal", text: "Published", ring: "border-signal/30 text-signal" };
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs whitespace-nowrap ${look.ring}`}>
      <span className={`size-1.5 rounded-full ${look.dot}`} />
      {look.text}
    </span>
  );
}

/** Flash message after a redirect (?saved=… / ?deleted=1). */
export function Notice({ children }: { children: React.ReactNode }) {
  return (
    <p role="status" className="mb-6 flex items-center gap-2.5 rounded-xl border border-signal/25 bg-signal/[0.07] px-4 py-3 text-sm text-ink">
      <Icon name="check" className="size-4 text-signal" /> {children}
    </p>
  );
}

/** Filter tabs driven by the URL (?status=…), so they work without JavaScript. */
export function FilterTabs({ base, current, tabs }: { base: string; current: string; tabs: { value: string; label: string; count: number }[] }) {
  return (
    <nav aria-label="Filter" className="flex flex-wrap gap-1 rounded-full border border-white/[0.08] bg-white/[0.02] p-1">
      {tabs.map((t) => (
        <Link
          key={t.value}
          href={t.value === "all" ? base : `${base}?status=${t.value}`}
          aria-current={current === t.value ? "page" : undefined}
          className={`flex items-center gap-2 rounded-full px-3.5 py-1.5 text-sm transition-colors ${
            current === t.value ? "bg-white/[0.09] text-ink" : "text-muted hover:text-ink"
          }`}
        >
          {t.label}
          <span className="text-xs text-muted tabular-nums">{t.count}</span>
        </Link>
      ))}
    </nav>
  );
}

export function AdminEmpty({ icon, title, body, action }: { icon: "folder" | "document"; title: string; body: string; action: React.ReactNode }) {
  return (
    <div className="grid place-items-center rounded-2xl border border-dashed border-white/15 px-6 py-16 text-center">
      <span className="grid size-14 place-items-center rounded-2xl border border-white/10 bg-white/[0.03] text-violet">
        <Icon name={icon} className="size-6" />
      </span>
      <h2 className="mt-5 text-lg font-semibold text-ink">{title}</h2>
      <p className="mt-1 max-w-sm text-sm text-ink-soft">{body}</p>
      <div className="mt-6">{action}</div>
    </div>
  );
}
