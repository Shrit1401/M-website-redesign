"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { logout } from "@/app/admin/actions";
import mark from "../../../public/nebula-mark-white.png";
import { Icon, type IconName } from "../Icon";

const NAV: { label: string; href: string; icon: IconName }[] = [
  { label: "Overview", href: "/admin", icon: "dashboard" },
  { label: "Projects", href: "/admin/projects", icon: "folder" },
  { label: "Blog posts", href: "/admin/posts", icon: "document" },
];

/**
 * Admin chrome: a fixed 260px sidebar on desktop, a top bar with a slide-in drawer on mobile.
 * Deliberately calmer than the public site — no Lenis, no reveal animations, denser type.
 */
export function AdminShell({ counts, children }: { counts: Record<string, number>; children: React.ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [openFor, setOpenFor] = useState(pathname);
  if (openFor !== pathname) {
    setOpenFor(pathname);
    setOpen(false);
  }
  const isActive = (href: string) => (href === "/admin" ? pathname === "/admin" : pathname.startsWith(href));

  const sidebar = (
    <div className="flex h-full flex-col">
      <Link href="/admin" className="flex items-center gap-3 px-3 py-2">
        <Image src={mark} alt="" className="h-8 w-auto" />
        <span>
          <span className="block text-sm font-semibold text-ink">Nebula Webtech</span>
          <span className="block text-xs text-muted">Content dashboard</span>
        </span>
      </Link>

      <nav aria-label="Dashboard" className="mt-8">
        <p className="px-3 text-[0.65rem] font-semibold tracking-[0.22em] text-muted uppercase">Content</p>
        <ul className="mt-3 grid gap-1">
          {NAV.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={isActive(item.href) ? "page" : undefined}
                className={`group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors ${
                  isActive(item.href) ? "bg-white/[0.07] text-ink" : "text-ink-soft hover:bg-white/[0.04] hover:text-ink"
                }`}
              >
                {isActive(item.href) && (
                  <span aria-hidden className="absolute top-2 bottom-2 -left-3 w-0.5 rounded-full bg-violet shadow-[0_0_10px_var(--violet)]" />
                )}
                <Icon name={item.icon} className={`size-[1.1rem] ${isActive(item.href) ? "text-violet" : "text-muted group-hover:text-ink-soft"}`} />
                <span className="flex-1">{item.label}</span>
                {counts[item.href] !== undefined && (
                  <span className="rounded-full bg-white/[0.06] px-2 py-0.5 text-xs text-muted tabular-nums">{counts[item.href]}</span>
                )}
              </Link>
            </li>
          ))}
        </ul>

        <p className="mt-8 px-3 text-[0.65rem] font-semibold tracking-[0.22em] text-muted uppercase">Create</p>
        <ul className="mt-3 grid gap-1">
          {[
            { label: "New project", href: "/admin/projects/new" },
            { label: "New post", href: "/admin/posts/new" },
          ].map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-ink-soft transition-colors hover:bg-white/[0.04] hover:text-ink"
              >
                <span className="grid size-[1.1rem] place-items-center rounded-md border border-dashed border-white/20 text-muted">
                  <Icon name="plus" className="size-3" />
                </span>
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="mt-auto grid gap-1 border-t border-white/[0.06] pt-4">
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-ink-soft transition-colors hover:bg-white/[0.04] hover:text-ink"
        >
          <Icon name="globe" className="size-[1.1rem] text-muted" /> View site
          <Icon name="arrowUpRight" className="ml-auto size-3.5 text-muted" />
        </a>
        <form action={logout}>
          <button
            type="submit"
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-ink-soft transition-colors hover:bg-white/[0.04] hover:text-ink"
          >
            <Icon name="logout" className="size-[1.1rem] text-muted" /> Sign out
          </button>
        </form>
      </div>
    </div>
  );

  return (
    <div className="min-h-svh bg-bg">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[260px] border-r border-white/[0.06] bg-bg-2 px-4 py-6 lg:block">
        <div aria-hidden className="starfield pointer-events-none absolute inset-0 opacity-25" />
        <div className="relative h-full">{sidebar}</div>
      </aside>

      {/* Mobile top bar + drawer */}
      <div className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-white/[0.06] bg-bg/85 px-5 backdrop-blur-xl lg:hidden">
        <Link href="/admin" className="flex items-center gap-2.5 text-sm font-semibold text-ink">
          <Image src={mark} alt="" className="h-7 w-auto" /> Dashboard
        </Link>
        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="admin-drawer"
          onClick={() => setOpen((v) => !v)}
          className="grid size-10 place-items-center rounded-full border border-white/10 bg-white/[0.06] text-ink"
        >
          <Icon name={open ? "close" : "menu"} className="size-5" />
        </button>
      </div>
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden" id="admin-drawer">
          <button type="button" aria-label="Close menu" className="absolute inset-0 bg-black/60" onClick={() => setOpen(false)} />
          <aside className="absolute inset-y-0 left-0 w-[280px] border-r border-white/[0.08] bg-bg-2 px-4 py-6">{sidebar}</aside>
        </div>
      )}

      <div className="lg:pl-[260px]">
        <main id="main" className="mx-auto max-w-[1400px] px-5 py-8 sm:px-8 sm:py-10">
          {children}
        </main>
      </div>
    </div>
  );
}
