# 09 · Content model

Two kinds of content:

| Kind | Where | Edited by |
|---|---|---|
| **Static copy** — business info, about, services, process, legal | `src/lib/site.ts`, `services.ts`, `legal.ts` | Developers (code change) |
| **Managed content** — projects and blog posts | `content/projects.json`, `content/posts.json` | The team, in `/admin` |

Types and validation rules for managed content: `src/lib/content/schema.ts` (no server or browser imports — shared by the admin forms, Server Actions and any future backend). Storage: `src/lib/content/store.ts` (server-only).

## Project

| Field | Type | Rules / meaning |
|---|---|---|
| `id` | string (UUID) | Set by the store |
| `title` | string | 2–120 chars |
| `slug` | string | `^[a-z0-9]+(-[a-z0-9]+)*$`, unique → `/projects/<slug>` |
| `client` | string? | ≤ 120 |
| `summary` | string | 10–280; cards, meta description |
| `body` | markdown | ≤ 50,000; the case study. May be empty (page shows a "coming soon" line) |
| `service` | `WEB_DESIGN_DEVELOPMENT` \| `WEB_MAINTENANCE` \| `DIGITAL_MARKETING` | Same values as the contact form (`contracts.ts`); links to the service page |
| `stage` | `LIVE` \| `IN_PROGRESS` \| `UPCOMING` | Launched / In progress / **Coming soon** — the last one is how future projects are announced |
| `status` | `DRAFT` \| `PUBLISHED` | Drafts never appear publicly |
| `featured` | boolean | Sorted first; shown on the home page first |
| `year` | string? | ≤ 20. "2026" for launched; a target like "Q1 2027" for upcoming |
| `liveUrl` | URL? | http(s) only. Button shown only when stage is `LIVE` |
| `coverImage` | URL or `/path`? | Otherwise generated art |
| `tags` | string[] | ≤ 8, ≤ 32 chars each, de-duplicated case-insensitively |
| `createdAt`, `updatedAt` | ISO string | Set by the store |

**Public order** (`projects.published()`): featured first → Launched → In progress → Coming soon → newest.

**Appears on**: `/projects` (grouped by stage with jump chips), `/projects/<slug>`, home "Selected work" (first 3), header Services dropdown links to `/projects`, sitemap, `CreativeWork` JSON-LD.

## Post

| Field | Type | Rules / meaning |
|---|---|---|
| `id` | string (UUID) | |
| `title` | string | 2–160 |
| `slug` | string | Same pattern, unique → `/blog/<slug>` |
| `excerpt` | string | 10–320; list cards, meta description, OG |
| `body` | markdown | ≤ 100,000; **≥ 50 chars to publish** |
| `author` | string | 2–80; defaults to "Nebula Webtech Team" |
| `status` | `DRAFT` \| `PUBLISHED` | |
| `publishedAt` | `YYYY-MM-DD` | Display date and sort key. **A future date = scheduled**: hidden until that day |
| `coverImage`, `tags` | as above | |

**Public order** (`posts.published()`): published and `publishedAt ≤ today`, newest first.

**Appears on**: `/blog` (lead post large + grid + newsletter), `/blog/<slug>` (with related posts by shared tag), home "From the blog" (latest 3), sitemap, `BlogPosting` JSON-LD.

## Lifecycle

```
          ┌──────── Unpublish ────────┐
          ▼                            │
 New ──► DRAFT ──── Publish ───► PUBLISHED ──► (posts) live on publishedAt
          │                            │
          └──────── Delete ◄───────────┘
```

Every save/publish/delete calls `revalidatePath("/", "layout")`, so all cached pages (home, lists, details, sitemap) rebuild on the next request. Blog pages, the home page and the sitemap also revalidate hourly so scheduled posts appear on their date.

## Markdown

Rendered by `src/lib/markdown.ts` (marked, GFM) into `.prose-nebula`:

- Supported: `##`/`###`/`####` headings, paragraphs, **bold**, *italic*, lists, numbered lists, links, images, `> quotes`, `code`, fenced code, `---`, tables.
- **Raw HTML is escaped** (shown as text), links/images only allow http(s), site paths, `#`, `mailto:`, `tel:`. External links open in a new tab with `rel="noopener noreferrer"`.
- Start sections at `##` — the page already has the `h1`.

## Storage & deployment

`store.ts` keeps each collection in a JSON file and writes atomically (temp file + rename) with an in-process write queue. That works on any server with a writable disk (`next dev`, `next start` on a VM, Docker with a volume). **Serverless hosts (Vercel) have a read-only filesystem**: saving from `/admin` shows an explanatory error. Before deploying there, move content to Postgres — see [`docs/nextjs-prisma/06-admin-content.md`](../nextjs-prisma/06-admin-content.md). Only `store.ts` changes; its exported API (`all`, `list`, `published`, `get`, `getBySlug`, `create`, `update`, `patch`, `remove`) stays the same.

`content/*.json` is committed: content edited locally can be reviewed and shipped like code.
