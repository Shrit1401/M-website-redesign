import type { Metadata } from "next";
import Link from "next/link";
import { formatDate } from "@/components/Content";
import { Icon, type IconName } from "@/components/Icon";
import { PageTitle, StatusPill } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/admin/auth";
import { PROJECT_STAGES, labelOf, today } from "@/lib/content/schema";
import { posts, projects } from "@/lib/content/store";

export const metadata: Metadata = { title: "Overview" };

export default async function AdminOverview() {
  await requireAdmin();
  const [allProjects, allPosts] = await Promise.all([projects.list(), posts.list()]);
  const now = today();

  const stats: { label: string; value: number; note: string; icon: IconName; href: string }[] = [
    {
      label: "Live projects",
      value: allProjects.filter((p) => p.status === "PUBLISHED" && p.stage === "LIVE").length,
      note: `${allProjects.filter((p) => p.status === "PUBLISHED").length} published in total`,
      icon: "folder",
      href: "/admin/projects?status=PUBLISHED",
    },
    {
      label: "Coming soon",
      value: allProjects.filter((p) => p.stage !== "LIVE").length,
      note: "In progress or upcoming",
      icon: "rocket",
      href: "/admin/projects",
    },
    {
      label: "Published posts",
      value: allPosts.filter((p) => p.status === "PUBLISHED" && p.publishedAt <= now).length,
      note: `${allPosts.filter((p) => p.status === "PUBLISHED" && p.publishedAt > now).length} scheduled`,
      icon: "document",
      href: "/admin/posts?status=PUBLISHED",
    },
    {
      label: "Drafts",
      value: [...allProjects, ...allPosts].filter((x) => x.status === "DRAFT").length,
      note: "Projects and posts",
      icon: "edit",
      href: "/admin/posts?status=DRAFT",
    },
  ];

  return (
    <>
      <PageTitle
        eyebrow="Dashboard"
        title="Welcome back."
        description="Add new projects — including ones that haven't launched yet — and publish blog posts. Changes appear on the website as soon as you save."
        actions={
          <a href="/" target="_blank" rel="noopener noreferrer" className="btn btn-outline py-2.5 text-sm">
            View site <Icon name="arrowUpRight" className="size-4" />
          </a>
        }
      />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((s) => (
          <Link
            key={s.label}
            href={s.href}
            className="group rounded-2xl border border-white/[0.08] bg-surface/70 p-5 transition-colors hover:border-violet/40"
          >
            <span className="flex items-center justify-between text-sm text-ink-soft">
              {s.label}
              <Icon name={s.icon} className="size-4 text-muted transition-colors group-hover:text-violet" />
            </span>
            <span className="mt-4 block text-4xl font-semibold tracking-tight text-ink tabular-nums">{s.value}</span>
            <span className="mt-1 block text-xs text-muted">{s.note}</span>
          </Link>
        ))}
      </div>

      <div className="mt-3 grid gap-3 md:grid-cols-2">
        {[
          { href: "/admin/projects/new", title: "Add a project", body: "Launched, in progress, or coming soon.", icon: "folder" as const },
          { href: "/admin/posts/new", title: "Write a post", body: "Draft now, publish now, or schedule for later.", icon: "document" as const },
        ].map((a) => (
          <Link
            key={a.href}
            href={a.href}
            className="group relative isolate flex items-center gap-5 overflow-hidden rounded-2xl border border-white/[0.08] p-6 transition-colors hover:border-violet/40"
          >
            <span aria-hidden className="nebula-wash absolute inset-0 -z-10 opacity-60" />
            <span aria-hidden className="starfield absolute inset-0 -z-10 opacity-50" />
            <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-violet/30 to-pink/10 text-violet shadow-[0_0_30px_-6px_rgb(166_123_255/0.6)]">
              <Icon name={a.icon} className="size-5" />
            </span>
            <span className="flex-1">
              <span className="block font-semibold text-ink">{a.title}</span>
              <span className="mt-0.5 block text-sm text-ink-soft">{a.body}</span>
            </span>
            <span className="grid size-9 place-items-center rounded-full border border-white/15 transition-all duration-500 group-hover:rotate-90 group-hover:border-violet group-hover:bg-violet group-hover:text-[#12091f]">
              <Icon name="plus" className="size-4" />
            </span>
          </Link>
        ))}
      </div>

      <div className="mt-10 grid gap-6 xl:grid-cols-2">
        <RecentList
          title="Recent projects"
          href="/admin/projects"
          empty="No projects yet."
          rows={allProjects.slice(0, 5).map((p) => ({
            id: p.id,
            title: p.title,
            href: `/admin/projects/${p.id}`,
            meta: `${labelOf(PROJECT_STAGES, p.stage)} · edited ${formatDate(p.updatedAt)}`,
            pill: <StatusPill status={p.status} />,
          }))}
        />
        <RecentList
          title="Recent posts"
          href="/admin/posts"
          empty="No posts yet."
          rows={allPosts.slice(0, 5).map((p) => ({
            id: p.id,
            title: p.title,
            href: `/admin/posts/${p.id}`,
            meta: `${formatDate(p.publishedAt)} · ${p.author}`,
            pill: <StatusPill status={p.status} scheduled={p.publishedAt > now} />,
          }))}
        />
      </div>
    </>
  );
}

function RecentList({
  title,
  href,
  empty,
  rows,
}: {
  title: string;
  href: string;
  empty: string;
  rows: { id: string; title: string; href: string; meta: string; pill: React.ReactNode }[];
}) {
  return (
    <section className="rounded-2xl border border-white/[0.08] bg-surface/70">
      <div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-4">
        <h2 className="text-sm font-semibold text-ink">{title}</h2>
        <Link href={href} className="text-xs text-muted hover:text-ink">
          View all
        </Link>
      </div>
      {rows.length === 0 ? (
        <p className="px-5 py-8 text-center text-sm text-muted">{empty}</p>
      ) : (
        <ul className="divide-y divide-white/[0.05]">
          {rows.map((r) => (
            <li key={r.id}>
              <Link href={r.href} className="flex items-center gap-4 px-5 py-3.5 transition-colors hover:bg-white/[0.03]">
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium text-ink">{r.title}</span>
                  <span className="mt-0.5 block truncate text-xs text-muted">{r.meta}</span>
                </span>
                {r.pill}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
