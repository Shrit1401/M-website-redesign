import type { Metadata } from "next";
import Link from "next/link";
import { Icon } from "@/components/Icon";
import { ProjectForm } from "@/components/admin/ProjectForm";
import { PageTitle } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/admin/auth";

export const metadata: Metadata = { title: "New project" };

export default async function NewProject() {
  await requireAdmin();
  return (
    <>
      <Link href="/admin/projects" className="mb-4 inline-flex items-center gap-2 text-sm text-muted hover:text-ink">
        <Icon name="arrowLeft" className="size-4" /> Projects
      </Link>
      <PageTitle title="New project" description="Saved as a draft until you switch Visibility to Published." />
      <ProjectForm />
    </>
  );
}
