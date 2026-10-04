import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { deletePost } from "@/app/admin/actions";
import { Icon } from "@/components/Icon";
import { PostForm } from "@/components/admin/PostForm";
import { DeleteButton } from "@/components/admin/buttons";
import { PageTitle, StatusPill } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/admin/auth";
import { today } from "@/lib/content/schema";
import { posts } from "@/lib/content/store";
import { SITE } from "@/lib/site";

export const metadata: Metadata = { title: "Edit post" };

export default async function EditPost({ params }: PageProps<"/admin/posts/[id]">) {
  await requireAdmin();
  const post = await posts.get((await params).id);
  if (!post) notFound();
  const live = post.status === "PUBLISHED" && post.publishedAt <= today();

  return (
    <>
      <Link href="/admin/posts" className="mb-4 inline-flex items-center gap-2 text-sm text-muted hover:text-ink">
        <Icon name="arrowLeft" className="size-4" /> Blog posts
      </Link>
      <PageTitle
        title={post.title}
        actions={
          <>
            <StatusPill status={post.status} scheduled={post.publishedAt > today()} />
            {live && (
              <a href={`/blog/${post.slug}`} target="_blank" rel="noopener noreferrer" className="btn btn-outline py-2.5 text-sm">
                View on site <Icon name="arrowUpRight" className="size-4" />
              </a>
            )}
            <DeleteButton id={post.id} label={post.title} action={deletePost} />
          </>
        }
      />
      <PostForm key={post.updatedAt} post={post} defaultAuthor={`${SITE.shortName} Team`} />
    </>
  );
}
