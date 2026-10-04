import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { deleteProject } from "@/app/admin/actions";
import { Icon } from "@/components/Icon";
import { ProjectForm } from "@/components/admin/ProjectForm";
import { DeleteButton } from "@/components/admin/buttons";
import { PageTitle, StatusPill } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/admin/auth";
import { projects } from "@/lib/content/store";

export const metadata: Metadata = { title: "Edit project" };

export default async function EditProject({ params }: PageProps<"/admin/projects/[id]">) {
  await requireAdmin();
  const project = await projects.get((await params).id);
  if (!project) notFound();

  return (
    <>
      <Link href="/admin/projects" className="mb-4 inline-flex items-center gap-2 text-sm text-muted hover:text-ink">
        <Icon name="arrowLeft" className="size-4" /> Projects
      </Link>
      <PageTitle
        title={project.title}
        actions={
          <>
            <StatusPill status={project.status} />
            {project.status === "PUBLISHED" && (
              <a href={`/projects/${project.slug}`} target="_blank" rel="noopener noreferrer" className="btn btn-outline py-2.5 text-sm">
                View on site <Icon name="arrowUpRight" className="size-4" />
              </a>
            )}
            <DeleteButton id={project.id} label={project.title} action={deleteProject} />
          </>
        }
      />
      {/* Keyed by updatedAt so the form re-initialises after a save. */}
      <ProjectForm key={project.updatedAt} project={project} />
    </>
  );
}
