"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { savePost } from "@/app/admin/actions";
import {
  PUBLISH_STATUSES,
  parseTags,
  readingMinutes,
  slugify,
  today,
  validatePost,
  type FormState,
  type Post,
  type PostInput,
} from "@/lib/content/schema";
import { Cover, formatDate } from "../Content";
import { FormAlert, MarkdownField, Panel, Segmented, SubmitButton, TextArea, TextField } from "./fields";

export function PostForm({ post, defaultAuthor }: { post?: Post; defaultAuthor: string }) {
  const [state, formAction] = useActionState<FormState, FormData>(savePost, {});
  const [local, setLocal] = useState<FormState>({});
  const [slugTouched, setSlugTouched] = useState(Boolean(post));
  const [form, setForm] = useState({
    title: post?.title ?? "",
    slug: post?.slug ?? "",
    excerpt: post?.excerpt ?? "",
    body: post?.body ?? "",
    author: post?.author ?? defaultAuthor,
    status: post?.status ?? "DRAFT",
    publishedAt: post?.publishedAt ?? today(),
    coverImage: post?.coverImage ?? "",
    tags: post?.tags.join(", ") ?? "",
  });

  const [seenState, setSeenState] = useState(state);
  if (seenState !== state) {
    setSeenState(state);
    setLocal({});
  }
  const errors = { ...state.fields, ...local.fields };
  const error = local.error ?? state.error;
  const scheduled = form.status === "PUBLISHED" && form.publishedAt > today();

  const set = <K extends keyof typeof form>(key: K) => (value: (typeof form)[K]) => {
    setForm((f) => {
      const next = { ...f, [key]: value };
      if (key === "title" && !slugTouched) next.slug = slugify(value as string);
      return next;
    });
    if (local.fields?.[key]) setLocal((l) => ({ ...l, fields: { ...l.fields, [key]: "" } }));
  };

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    const fields = validatePost({ ...form, tags: parseTags(form.tags) } as PostInput);
    if (Object.keys(fields).length) {
      e.preventDefault();
      setLocal({ error: "Please check the highlighted fields.", fields });
      requestAnimationFrame(() => document.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus());
    }
  }

  return (
    <form action={formAction} onSubmit={onSubmit} noValidate className="grid gap-5 pb-28 xl:grid-cols-[minmax(0,1fr)_360px]">
      {post && <input type="hidden" name="id" value={post.id} />}

      <div className="grid content-start gap-5">
        <Panel>
          <TextField
            name="title"
            label="Title"
            value={form.title}
            onChange={set("title")}
            error={errors.title}
            placeholder="e.g. 5 signs your website needs maintenance"
            className="[&_input]:text-lg [&_input]:font-semibold"
          />
          <TextField
            name="slug"
            label="URL"
            prefix="/blog/"
            value={form.slug}
            onChange={(v) => {
              setSlugTouched(true);
              set("slug")(v.toLowerCase());
            }}
            error={errors.slug}
            hint={post ? "Changing this breaks existing links" : "Filled in from the title"}
          />
          <TextArea
            name="excerpt"
            label="Excerpt"
            value={form.excerpt}
            onChange={set("excerpt")}
            error={errors.excerpt}
            max={320}
            placeholder="A sentence or two for the blog list, social shares and search results."
          />
        </Panel>
        <Panel>
          <MarkdownField name="body" label="Post" value={form.body} onChange={set("body")} error={errors.body} rows={24} />
        </Panel>
      </div>

      <div className="grid content-start gap-5">
        <Panel title="Publishing">
          <Segmented
            name="status"
            label="Visibility"
            value={form.status}
            onChange={(v) => set("status")(v as typeof form.status)}
            options={PUBLISH_STATUSES.map((s) => ({
              ...s,
              hint: s.value === "DRAFT" ? "Only visible here in the dashboard." : "Visible on /blog from the publish date.",
            }))}
            error={errors.status}
          />
          <TextField
            name="publishedAt"
            label="Publish date"
            type="date"
            value={form.publishedAt}
            onChange={set("publishedAt")}
            error={errors.publishedAt}
            hint={scheduled ? "Scheduled — goes live on this date" : undefined}
          />
          <TextField name="author" label="Author" value={form.author} onChange={set("author")} error={errors.author} />
          <TextField name="tags" label="Tags" value={form.tags} onChange={set("tags")} hint="Comma separated" placeholder="SEO, Maintenance" />
          <p className="text-xs text-muted">≈ {readingMinutes(form.body)} min read</p>
        </Panel>

        <Panel title="Cover">
          <Cover seed={form.slug || "new-post"} image={form.coverImage || undefined} className="aspect-[16/10] rounded-xl border border-white/[0.08]" />
          <TextField
            name="coverImage"
            label="Image URL"
            value={form.coverImage}
            onChange={set("coverImage")}
            error={errors.coverImage}
            placeholder="https://… or /images/…"
            hint="Leave empty for generated art"
          />
        </Panel>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-white/[0.08] bg-bg/85 backdrop-blur-xl lg:left-[260px]">
        <div className="mx-auto flex max-w-[1400px] flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <div className="min-w-0 flex-1">{error ? <FormAlert message={error} /> : <p className="text-xs text-muted">{post ? `Last saved ${formatDate(post.updatedAt)}` : "Not saved yet"}</p>}</div>
          <div className="flex items-center gap-2">
            <Link href="/admin/posts" className="btn btn-outline py-2.5 text-sm">
              Cancel
            </Link>
            <SubmitButton>{post ? "Save changes" : form.status === "PUBLISHED" ? (scheduled ? "Schedule post" : "Publish post") : "Save draft"}</SubmitButton>
          </div>
        </div>
      </div>
    </form>
  );
}
