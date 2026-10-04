"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { checkPassword, adminConfigured, endSession, loginAllowed, requireAdmin, startSession } from "@/lib/admin/auth";
import type { ServiceInterest } from "@/lib/contracts";
import {
  parseTags,
  validatePost,
  validateProject,
  type FormState,
  type PostInput,
  type ProjectInput,
  type ProjectStage,
  type PublishStatus,
} from "@/lib/content/schema";
import { SlugTakenError, posts, projects } from "@/lib/content/store";

const str = (fd: FormData, key: string) => {
  const v = fd.get(key);
  return typeof v === "string" ? v.trim() : "";
};
const opt = (fd: FormData, key: string) => str(fd, key) || undefined;

/** Projects and posts appear on the home page, list pages, detail pages and the sitemap. */
function refreshSite() {
  revalidatePath("/", "layout");
}

function saveError(error: unknown, kind: string): FormState {
  if (error instanceof SlugTakenError) {
    return { error: "Please check the highlighted fields.", fields: { slug: `Another ${kind} already uses this URL.` } };
  }
  const code = (error as NodeJS.ErrnoException)?.code;
  if (code === "EROFS" || code === "EACCES" || code === "EPERM") {
    return {
      error:
        "This server can't write to content/. On read-only hosts (e.g. Vercel) move the store to Postgres — see docs/nextjs-prisma/06-admin-content.md.",
    };
  }
  console.error(`[admin] save ${kind}`, error);
  return { error: `Couldn't save the ${kind}. Please try again.` };
}

/* ------------------------------------------------------------------ session */

export async function login(_prev: FormState, formData: FormData): Promise<FormState> {
  if (!adminConfigured()) {
    return { error: "Admin is disabled: set ADMIN_PASSWORD in .env.local (see .env.example) and restart the server." };
  }
  if (!(await loginAllowed())) return { error: "Too many attempts. Wait 15 minutes and try again." };
  if (!checkPassword(str(formData, "password"))) return { error: "That password isn't right.", fields: { password: " " } };

  await startSession();
  const next = str(formData, "next");
  // Only ever bounce back inside the dashboard.
  redirect(next.startsWith("/admin") && !next.startsWith("/admin/login") ? next : "/admin");
}

export async function logout() {
  await endSession();
  redirect("/admin/login");
}

/* ----------------------------------------------------------------- projects */

export async function saveProject(_prev: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const id = str(formData, "id");
  const input: ProjectInput = {
    title: str(formData, "title"),
    slug: str(formData, "slug"),
    client: opt(formData, "client"),
    summary: str(formData, "summary"),
    body: str(formData, "body"),
    service: str(formData, "service") as ServiceInterest,
    stage: str(formData, "stage") as ProjectStage,
    status: str(formData, "status") as PublishStatus,
    featured: formData.get("featured") === "on",
    year: opt(formData, "year"),
    liveUrl: opt(formData, "liveUrl"),
    coverImage: opt(formData, "coverImage"),
    tags: parseTags(str(formData, "tags")),
  };

  const fields = validateProject(input);
  if (Object.keys(fields).length) return { error: "Please check the highlighted fields.", fields };

  try {
    const saved = id ? await projects.update(id, input) : await projects.create(input);
    if (!saved) return { error: "This project no longer exists. It may have been deleted." };
  } catch (error) {
    return saveError(error, "project");
  }
  refreshSite();
  redirect(`/admin/projects?saved=${encodeURIComponent(input.title)}`);
}

export async function setProjectStatus(formData: FormData) {
  await requireAdmin();
  const status = str(formData, "status");
  if (status !== "DRAFT" && status !== "PUBLISHED") return;
  await projects.patch(str(formData, "id"), { status });
  refreshSite();
}

export async function deleteProject(formData: FormData) {
  await requireAdmin();
  await projects.remove(str(formData, "id"));
  refreshSite();
  redirect("/admin/projects?deleted=1");
}

/* -------------------------------------------------------------------- posts */

export async function savePost(_prev: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const id = str(formData, "id");
  const input: PostInput = {
    title: str(formData, "title"),
    slug: str(formData, "slug"),
    excerpt: str(formData, "excerpt"),
    body: str(formData, "body"),
    author: str(formData, "author"),
    status: str(formData, "status") as PublishStatus,
    publishedAt: str(formData, "publishedAt"),
    coverImage: opt(formData, "coverImage"),
    tags: parseTags(str(formData, "tags")),
  };

  const fields = validatePost(input);
  if (Object.keys(fields).length) return { error: "Please check the highlighted fields.", fields };

  try {
    const saved = id ? await posts.update(id, input) : await posts.create(input);
    if (!saved) return { error: "This post no longer exists. It may have been deleted." };
  } catch (error) {
    return saveError(error, "post");
  }
  refreshSite();
  redirect(`/admin/posts?saved=${encodeURIComponent(input.title)}`);
}

export async function setPostStatus(formData: FormData) {
  await requireAdmin();
  const id = str(formData, "id");
  const status = str(formData, "status");
  if (status !== "DRAFT" && status !== "PUBLISHED") return;
  const post = await posts.get(id);
  // Same rule as the editor: an empty draft can't go live.
  if (!post || (status === "PUBLISHED" && Object.keys(validatePost({ ...post, status })).length)) return;
  await posts.patch(id, { status });
  refreshSite();
}

export async function deletePost(formData: FormData) {
  await requireAdmin();
  await posts.remove(str(formData, "id"));
  refreshSite();
  redirect("/admin/posts?deleted=1");
}
