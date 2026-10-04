/**
 * Content model for projects and blog posts, edited in the admin dashboard (/admin).
 *
 * Plain TypeScript with no browser or server dependencies — the same pattern as src/lib/contracts.ts —
 * so the admin forms, the Server Actions and a future Prisma backend all share these types and rules.
 * See docs/design/09-content-model.md.
 */

import { SERVICE_INTERESTS, type FieldErrors, type ServiceInterest } from "../contracts";

export const PUBLISH_STATUSES = [
  { value: "DRAFT", label: "Draft" },
  { value: "PUBLISHED", label: "Published" },
] as const;

/** Where a project is in its life. UPCOMING lets the team announce future work before it ships. */
export const PROJECT_STAGES = [
  { value: "LIVE", label: "Launched" },
  { value: "IN_PROGRESS", label: "In progress" },
  { value: "UPCOMING", label: "Coming soon" },
] as const;

/** Projects reuse the contact form's service values, minus "something else". */
export const PROJECT_SERVICES = SERVICE_INTERESTS.filter((s) => s.value !== "OTHER");

export type PublishStatus = (typeof PUBLISH_STATUSES)[number]["value"];
export type ProjectStage = (typeof PROJECT_STAGES)[number]["value"];

type Timestamps = {
  id: string;
  /** ISO timestamps, set by the store. */
  createdAt: string;
  updatedAt: string;
};

export type ProjectInput = {
  title: string;
  slug: string;
  client?: string;
  /** One or two sentences for cards and meta descriptions. */
  summary: string;
  /** Markdown. */
  body: string;
  service: ServiceInterest;
  stage: ProjectStage;
  status: PublishStatus;
  featured: boolean;
  /** Display year or launch target, e.g. "2026" or "Q1 2027". */
  year?: string;
  liveUrl?: string;
  coverImage?: string;
  tags: string[];
};

export type PostInput = {
  title: string;
  slug: string;
  excerpt: string;
  /** Markdown. */
  body: string;
  author: string;
  status: PublishStatus;
  /** YYYY-MM-DD. Shown as the post date and used for ordering. */
  publishedAt: string;
  coverImage?: string;
  tags: string[];
};

export type Project = ProjectInput & Timestamps;
export type Post = PostInput & Timestamps;

/** What a Server Action returns to an admin form. */
export type FormState = { error?: string; fields?: FieldErrors };

/* ------------------------------------------------------------------ helpers */

const trim = (v: unknown) => (typeof v === "string" ? v.trim() : "");

function check(errors: FieldErrors, field: string, ok: boolean, message: string) {
  if (!ok && !errors[field]) errors[field] = message;
}

export const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

export function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80)
    .replace(/-+$/, "");
}

/** "seo, Web Design ,seo" → ["seo", "Web Design"] */
export function parseTags(value: string) {
  const seen = new Set<string>();
  return value
    .split(",")
    .map((t) => t.trim().slice(0, 32))
    .filter((t) => t && !seen.has(t.toLowerCase()) && seen.add(t.toLowerCase()))
    .slice(0, 8);
}

/** http(s) URLs and site-relative paths only — never javascript: or data: URLs. */
export function isSafeUrl(url: string) {
  if (url.startsWith("/") && !url.startsWith("//")) return true;
  try {
    const u = new URL(url);
    return u.protocol === "https:" || u.protocol === "http:";
  } catch {
    return false;
  }
}

export function readingMinutes(markdown: string) {
  const words = markdown.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 220));
}

export const today = () => new Date().toISOString().slice(0, 10);

/* --------------------------------------------------------------- validators */

export function validateProject(input: Partial<ProjectInput>): FieldErrors {
  const e: FieldErrors = {};
  const title = trim(input.title);
  const summary = trim(input.summary);
  const liveUrl = trim(input.liveUrl);
  const cover = trim(input.coverImage);
  check(e, "title", title.length >= 2, "Give the project a title.");
  check(e, "title", title.length <= 120, "Keep the title under 120 characters.");
  check(e, "slug", SLUG_RE.test(trim(input.slug)), "Use lowercase letters, numbers and dashes only.");
  check(e, "summary", summary.length >= 10, "Write a one or two sentence summary (at least 10 characters).");
  check(e, "summary", summary.length <= 280, "Keep the summary under 280 characters.");
  check(e, "body", trim(input.body).length <= 50_000, "The write-up is too long (50,000 characters max).");
  check(e, "client", trim(input.client).length <= 120, "Client name is too long.");
  check(e, "year", trim(input.year).length <= 20, "Keep this short, e.g. 2026 or Q1 2027.");
  check(e, "service", PROJECT_SERVICES.some((s) => s.value === input.service), "Choose a service.");
  check(e, "stage", PROJECT_STAGES.some((s) => s.value === input.stage), "Choose a stage.");
  check(e, "status", PUBLISH_STATUSES.some((s) => s.value === input.status), "Choose draft or published.");
  check(e, "liveUrl", !liveUrl || (isSafeUrl(liveUrl) && liveUrl.length <= 300), "Enter a full URL starting with https://");
  check(e, "coverImage", !cover || (isSafeUrl(cover) && cover.length <= 500), "Use an https:// image URL or a /path in public/.");
  return e;
}

export function validatePost(input: Partial<PostInput>): FieldErrors {
  const e: FieldErrors = {};
  const title = trim(input.title);
  const excerpt = trim(input.excerpt);
  const cover = trim(input.coverImage);
  check(e, "title", title.length >= 2, "Give the post a title.");
  check(e, "title", title.length <= 160, "Keep the title under 160 characters.");
  check(e, "slug", SLUG_RE.test(trim(input.slug)), "Use lowercase letters, numbers and dashes only.");
  check(e, "excerpt", excerpt.length >= 10, "Write a short excerpt (at least 10 characters).");
  check(e, "excerpt", excerpt.length <= 320, "Keep the excerpt under 320 characters.");
  check(e, "body", trim(input.body).length <= 100_000, "The post is too long (100,000 characters max).");
  check(e, "author", trim(input.author).length >= 2, "Add an author name.");
  check(e, "author", trim(input.author).length <= 80, "Author name is too long.");
  check(e, "status", PUBLISH_STATUSES.some((s) => s.value === input.status), "Choose draft or published.");
  check(e, "publishedAt", DATE_RE.test(trim(input.publishedAt)) && !Number.isNaN(Date.parse(trim(input.publishedAt))), "Pick a date.");
  check(e, "coverImage", !cover || (isSafeUrl(cover) && cover.length <= 500), "Use an https:// image URL or a /path in public/.");
  // A published post needs a body; a draft can be saved half-written.
  check(e, "body", input.status !== "PUBLISHED" || trim(input.body).length >= 50, "Write at least a paragraph before publishing.");
  return e;
}

export const labelOf = <T extends { value: string; label: string }>(list: readonly T[], value: string) =>
  list.find((x) => x.value === value)?.label ?? value;
