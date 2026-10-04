import type { Metadata } from "next";
import Link from "next/link";
import { Icon } from "@/components/Icon";
import { PostForm } from "@/components/admin/PostForm";
import { PageTitle } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/admin/auth";
import { SITE } from "@/lib/site";

export const metadata: Metadata = { title: "New post" };

export default async function NewPost() {
  await requireAdmin();
  return (
    <>
      <Link href="/admin/posts" className="mb-4 inline-flex items-center gap-2 text-sm text-muted hover:text-ink">
        <Icon name="arrowLeft" className="size-4" /> Blog posts
      </Link>
      <PageTitle title="New post" description="Saved as a draft until you switch Visibility to Published. A future publish date schedules it." />
      <PostForm defaultAuthor={`${SITE.shortName} Team`} />
    </>
  );
}
