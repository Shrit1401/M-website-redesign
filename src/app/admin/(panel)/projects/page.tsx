import type { Metadata } from "next";
import Link from "next/link";
import { deleteProject, setProjectStatus } from "@/app/admin/actions";
import { Cover, StageBadge, formatDate } from "@/components/Content";
import { Icon } from "@/components/Icon";
import { DeleteButton, StatusToggle } from "@/components/admin/buttons";
import { AdminEmpty, FilterTabs, Notice, PageTitle, StatusPill } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/admin/auth";
import { PROJECT_SERVICES, labelOf } from "@/lib/content/schema";
import { projects } from "@/lib/content/store";

export const metadata: Metadata = { title: "Projects" };

export default async function AdminProjects({ searchParams }: PageProps<"/admin/projects">) {
  await requireAdmin();
  const { status = "all", q = "", saved, deleted } = (await searchParams) as Record<string, string | undefined>;
  const all = await projects.list();
  const query = q.trim().toLowerCase();
  const rows = all.filter(
    (p) =>
      (status === "all" || p.status === status) &&
      (!query || [p.title, p.client, p.slug, ...p.tags].some((v) => v?.toLowerCase().includes(query))),
  );

  return (
    <>
      <PageTitle
        eyebrow="Content"
        title="Projects"
        description="Case studies for /projects. Use the “Coming soon” stage to announce future work before it launches."
        actions={
          <Link href="/admin/projects/new" className="btn btn-primary py-2.5 text-sm">
            <Icon name="plus" className="size-4" /> New project
          </Link>
        }
      />

      {saved && <Notice>Saved “{saved}”.</Notice>}
      {deleted && <Notice>Project deleted.</Notice>}

      {all.length === 0 ? (
        <AdminEmpty
          icon="folder"
          title="No projects yet"
          body="Add your first project. Drafts stay private until you publish them."
          action={
            <Link href="/admin/projects/new" className="btn btn-primary py-2.5 text-sm">
              <Icon name="plus" className="size-4" /> New project
            </Link>
          }
        />
      ) : (
        <>
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <FilterTabs
              base="/admin/projects"
              current={status}
              tabs={[
                { value: "all", label: "All", count: all.length },
                { value: "PUBLISHED", label: "Published", count: all.filter((p) => p.status === "PUBLISHED").length },
                { value: "DRAFT", label: "Drafts", count: all.filter((p) => p.status === "DRAFT").length },
              ]}
            />
            <form role="search" className="relative w-full sm:w-72">
              {status !== "all" && <input type="hidden" name="status" value={status} />}
              <label htmlFor="q" className="sr-only">
                Search projects
              </label>
              <input id="q" name="q" defaultValue={q} placeholder="Search projects…" className="field rounded-full py-2 text-sm" />
            </form>
          </div>

          <div className="overflow-hidden rounded-2xl border border-white/[0.08] bg-surface/70">
            {rows.length === 0 ? (
              <p className="px-5 py-12 text-center text-sm text-muted">Nothing matches that filter.</p>
            ) : (
              <ul className="divide-y divide-white/[0.05]">
                {rows.map((p) => (
                  <li key={p.id} className="flex flex-wrap items-center gap-4 px-4 py-3.5 sm:flex-nowrap sm:px-5">
                    <Link href={`/admin/projects/${p.id}`} className="flex min-w-0 flex-1 items-center gap-4">
                      <Cover seed={p.slug} image={p.coverImage} className="aspect-[4/3] w-16 shrink-0 rounded-lg border border-white/[0.08]" />
                      <span className="min-w-0">
                        <span className="flex items-center gap-2 text-sm font-medium text-ink">
                          <span className="truncate">{p.title}</span>
                          {p.featured && <Icon name="star" className="size-3.5 shrink-0 text-violet" />}
                        </span>
                        <span className="mt-0.5 block truncate text-xs text-muted">
                          {labelOf(PROJECT_SERVICES, p.service)}
                          {p.client ? ` · ${p.client}` : ""} · edited {formatDate(p.updatedAt)}
                        </span>
                      </span>
                    </Link>
                    <StageBadge stage={p.stage} className="hidden md:inline-flex" />
                    <StatusPill status={p.status} />
                    <div className="flex items-center gap-1">
                      <StatusToggle id={p.id} published={p.status === "PUBLISHED"} action={setProjectStatus} />
                      {p.status === "PUBLISHED" && (
                        <a
                          href={`/projects/${p.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="View on site"
                          aria-label={`View ${p.title} on the site`}
                          className="grid size-9 place-items-center rounded-lg text-muted transition-colors hover:bg-white/[0.06] hover:text-ink"
                        >
                          <Icon name="eye" className="size-4" />
                        </a>
                      )}
                      <Link
                        href={`/admin/projects/${p.id}`}
                        title="Edit"
                        aria-label={`Edit ${p.title}`}
                        className="grid size-9 place-items-center rounded-lg text-muted transition-colors hover:bg-white/[0.06] hover:text-ink"
                      >
                        <Icon name="edit" className="size-4" />
                      </Link>
                      <DeleteButton id={p.id} label={p.title} action={deleteProject} compact />
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </>
      )}
    </>
  );
}
