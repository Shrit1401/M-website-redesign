"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { saveProject } from "@/app/admin/actions";
import {
  PROJECT_SERVICES,
  PROJECT_STAGES,
  PUBLISH_STATUSES,
  parseTags,
  slugify,
  validateProject,
  type FormState,
  type Project,
  type ProjectInput,
} from "@/lib/content/schema";
import { Cover, formatDate } from "../Content";
import { FormAlert, MarkdownField, Panel, Segmented, Select, SubmitButton, TextArea, TextField, Toggle } from "./fields";

const STAGE_HINTS: Record<string, string> = {
  LIVE: "Shipped. Shows a “Visit the live site” button when a URL is set.",
  IN_PROGRESS: "Being built right now.",
  UPCOMING: "Announced but not started — a future project. Use the timeline field for the launch target.",
};

export function ProjectForm({ project }: { project?: Project }) {
  const [state, formAction] = useActionState<FormState, FormData>(saveProject, {});
  const [local, setLocal] = useState<FormState>({});
  const [slugTouched, setSlugTouched] = useState(Boolean(project));
  const [form, setForm] = useState({
    title: project?.title ?? "",
    slug: project?.slug ?? "",
    client: project?.client ?? "",
    summary: project?.summary ?? "",
    body: project?.body ?? "",
    service: project?.service ?? PROJECT_SERVICES[0].value,
    stage: project?.stage ?? "LIVE",
    status: project?.status ?? "DRAFT",
    featured: project?.featured ?? false,
    year: project?.year ?? "",
    liveUrl: project?.liveUrl ?? "",
    coverImage: project?.coverImage ?? "",
    tags: project?.tags.join(", ") ?? "",
  });

  // Server errors arrive with a new `state` object; local (pre-submit) errors are cleared when it does.
  const [seenState, setSeenState] = useState(state);
  if (seenState !== state) {
    setSeenState(state);
    setLocal({});
  }
  const errors = { ...state.fields, ...local.fields };
  const error = local.error ?? state.error;

  const set = <K extends keyof typeof form>(key: K) => (value: (typeof form)[K]) => {
    setForm((f) => {
      const next = { ...f, [key]: value };
      if (key === "title" && !slugTouched) next.slug = slugify(value as string);
      return next;
    });
    if (local.fields?.[key]) setLocal((l) => ({ ...l, fields: { ...l.fields, [key]: "" } }));
  };

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    const fields = validateProject({ ...form, tags: parseTags(form.tags) } as ProjectInput);
    if (Object.keys(fields).length) {
      e.preventDefault();
      setLocal({ error: "Please check the highlighted fields.", fields });
      requestAnimationFrame(() => document.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus());
    }
  }

  return (
    <form action={formAction} onSubmit={onSubmit} noValidate className="grid gap-5 pb-28 xl:grid-cols-[minmax(0,1fr)_360px]">
      {project && <input type="hidden" name="id" value={project.id} />}

      <div className="grid content-start gap-5">
        <Panel>
          <TextField
            name="title"
            label="Project name"
            value={form.title}
            onChange={set("title")}
            error={errors.title}
            placeholder="e.g. Lakeside Dental website"
            className="[&_input]:text-lg [&_input]:font-semibold"
          />
          <TextField
            name="slug"
            label="URL"
            prefix="/projects/"
            value={form.slug}
            onChange={(v) => {
              setSlugTouched(true);
              set("slug")(v.toLowerCase());
            }}
            error={errors.slug}
            hint={project ? "Changing this breaks existing links" : "Filled in from the name"}
          />
          <TextArea
            name="summary"
            label="Summary"
            value={form.summary}
            onChange={set("summary")}
            error={errors.summary}
            max={280}
            placeholder="One or two sentences for cards and search results."
          />
        </Panel>
        <Panel>
          <MarkdownField name="body" label="Case study" value={form.body} onChange={set("body")} error={errors.body} />
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
              hint: s.value === "DRAFT" ? "Only visible here in the dashboard." : "Visible on /projects and the home page.",
            }))}
            error={errors.status}
          />
          <Toggle
            name="featured"
            label="Featured"
            hint="Pinned to the front of the list and the home page."
            checked={form.featured}
            onChange={set("featured")}
          />
        </Panel>

        <Panel title="Project">
          <Segmented
            name="stage"
            label="Stage"
            value={form.stage}
            onChange={(v) => set("stage")(v as typeof form.stage)}
            options={PROJECT_STAGES.map((s) => ({ ...s, hint: STAGE_HINTS[s.value] }))}
            error={errors.stage}
          />
          <Select
            name="service"
            label="Service"
            value={form.service}
            onChange={(v) => set("service")(v as typeof form.service)}
            options={PROJECT_SERVICES}
            error={errors.service}
          />
          <TextField name="client" label="Client" value={form.client} onChange={set("client")} error={errors.client} hint="Optional" />
          <TextField
            name="year"
            label={form.stage === "LIVE" ? "Year" : "Timeline"}
            value={form.year}
            onChange={set("year")}
            error={errors.year}
            placeholder={form.stage === "LIVE" ? "2026" : "Q1 2027"}
            hint="Optional"
          />
          <TextField
            name="liveUrl"
            label="Live site URL"
            type="url"
            value={form.liveUrl}
            onChange={set("liveUrl")}
            error={errors.liveUrl}
            placeholder="https://"
            hint="Optional"
          />
          <TextField
            name="tags"
            label="Tags"
            value={form.tags}
            onChange={set("tags")}
            hint="Comma separated, up to 8"
            placeholder="WordPress, E-commerce, SEO"
          />
        </Panel>

        <Panel title="Cover">
          <Cover seed={form.slug || "new-project"} image={form.coverImage || undefined} className="aspect-[4/3] rounded-xl border border-white/[0.08]" />
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

      {/* Sticky action bar */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-white/[0.08] bg-bg/85 backdrop-blur-xl lg:left-[260px]">
        <div className="mx-auto flex max-w-[1400px] flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <div className="min-w-0 flex-1">{error ? <FormAlert message={error} /> : <p className="text-xs text-muted">{project ? `Last saved ${formatDate(project.updatedAt)}` : "Not saved yet"}</p>}</div>
          <div className="flex items-center gap-2">
            <Link href="/admin/projects" className="btn btn-outline py-2.5 text-sm">
              Cancel
            </Link>
            <SubmitButton>{project ? "Save changes" : form.status === "PUBLISHED" ? "Publish project" : "Save draft"}</SubmitButton>
          </div>
        </div>
      </div>
    </form>
  );
}
