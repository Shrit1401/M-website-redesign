# 08 · Admin dashboard

`/admin` is where the team adds **projects** (including future, not-yet-launched ones) and **blog posts**. It uses the same tokens and components as the public site, tuned for a working tool: denser, calmer, faster.

## Access

| | |
|---|---|
| URL | `/admin` (login at `/admin/login`) |
| Auth | One shared password: `ADMIN_PASSWORD` in `.env.local`. No user accounts. |
| Session | httpOnly cookie `nebula_admin` = `<expiry>.<HMAC-SHA256>`, 12 hours, `SameSite=Lax`, `Secure` in production. Key: `ADMIN_SESSION_SECRET` or the password. Changing either signs everyone out. |
| Checks | `src/proxy.ts` redirects signed-out visitors (optimistic). **`requireAdmin()`** in `src/lib/admin/auth.ts` is the real check — called in the panel layout, every admin page, and every Server Action. |
| Throttle | 8 login attempts / 15 min / IP (in-memory, per server instance) |
| Indexing | `robots.txt` disallows `/admin`; pages have `noindex`; proxy adds `X-Robots-Tag` |

Without `ADMIN_PASSWORD` the login page explains how to enable it and refuses to sign in.

## Routes

| Route | File | Purpose |
|---|---|---|
| `/admin/login` | `src/app/admin/(auth)/login/page.tsx` | Password form |
| `/admin` | `src/app/admin/(panel)/page.tsx` | Overview: 4 stat tiles, quick-create, recent projects & posts |
| `/admin/projects` | `…/(panel)/projects/page.tsx` | List with All/Published/Drafts tabs, search, publish toggle, view, edit, delete |
| `/admin/projects/new`, `/admin/projects/[id]` | `…/projects/new`, `…/projects/[id]` | Editor |
| `/admin/posts…` | `…/(panel)/posts/…` | Same for blog posts |

`(auth)` and `(panel)` are route groups: the login page has no sidebar, everything in `(panel)` is wrapped by `AdminShell` and guarded by `requireAdmin()`. The admin is **outside** `(site)`, so it never gets the marketing header, footer or Lenis.

Server Actions: `src/app/admin/actions.ts` — `login`, `logout`, `saveProject`, `setProjectStatus`, `deleteProject`, `savePost`, `setPostStatus`, `deletePost`. Each one: `requireAdmin()` → parse `FormData` → validate with `src/lib/content/schema.ts` → write via the store → `revalidatePath("/", "layout")` → redirect with a flash (`?saved=Title`).

## Layout

- **Sidebar** (`lg+`, 260px, `bg-bg-2`, faint starfield): mark + "Content dashboard"; *Content* — Overview, Projects, Blog posts (with counts); *Create* — New project, New post (dashed plus tiles); bottom — View site ↗, Sign out. Active item: `bg-white/[0.07]`, violet icon, glowing violet rail on the left edge.
- **Mobile**: sticky top bar (mark + "Dashboard" + menu button) and a 280px slide-in drawer with a dimmed backdrop.
- **Content area**: `max-w-[1400px] px-5 sm:px-8 py-8 sm:py-10`.

## Visual adjustments vs. the public site

| Public site | Admin |
|---|---|
| Huge clamp headlines, Accent words | `PageTitle`: small eyebrow + `clamp(1.8rem,3vw,2.4rem)` h1, no Accent |
| `.card` gradients, spotlight | Flat panels: `rounded-2xl border-white/[0.08] bg-surface/70 p-5 sm:p-6` (`Panel`) |
| Reveal / MaskLines / Magnetic | No entrance animation; only hover transitions |
| `text-base`/`text-lg` copy | `text-sm` copy, `text-xs` meta |
| Big CTAs | Buttons with `py-2.5 text-sm` |
| Atmosphere everywhere | Atmosphere only on login, quick-create tiles and the sidebar |

Status uses the status tokens: **Published** = signal (green), **Scheduled** = warn (amber), **Draft** = neutral white/40. Project stage uses `StageBadge` (same as public).

## Editor pattern

Two columns at `xl` (`minmax(0,1fr) 360px`), stacked below:

- **Main column**: Title (large), URL slug with fixed prefix (`/projects/` or `/blog/`), Summary/Excerpt with live character counter, Markdown body with **Write / Preview** tabs (preview uses the exact public renderer + `.prose-nebula`) and a word count.
- **Side column** panels: *Publishing* (Draft/Published segmented control with a one-line explanation, Featured toggle or Publish date + Author + Tags), *Project* (Stage segmented control with hints, Service, Client, Year/Timeline, Live URL, Tags), *Cover* (live `Cover` preview + image URL).
- **Sticky save bar** (`fixed bottom-0`, glass, offset by the sidebar): last-saved date or the error, Cancel, and a context-aware submit label — "Save draft", "Publish project", "Schedule post", "Save changes".

Behaviour:

- **Slugs** fill in from the title for new items until edited by hand; existing items keep their slug (warning: changing it breaks links).
- **Validation** runs in the browser first (same validators as the server) and focuses the first invalid field; the server re-validates and its field errors show under the same inputs.
- **Inputs are controlled.** React 19 resets uncontrolled forms after a form action; controlled state keeps the editor intact when the server returns errors.
- **Delete** asks `confirm()` first. **Publish/Unpublish** from a list row is one click; a post with too little body can't be published that way.

## Components (`src/components/admin/`)

| File | Exports |
|---|---|
| `AdminShell.tsx` | Sidebar/drawer chrome |
| `fields.tsx` | `TextField`, `TextArea`, `Select`, `Segmented`, `Toggle`, `MarkdownField`, `Panel`, `SubmitButton`, `FormAlert`, `Label`, `FieldError` |
| `ProjectForm.tsx`, `PostForm.tsx` | Editors |
| `buttons.tsx` | `DeleteButton`, `StatusToggle` |
| `ui.tsx` | `PageTitle`, `StatusPill`, `Notice`, `FilterTabs`, `AdminEmpty` |
| `LoginForm.tsx` | Password form with show/hide |

## Adding a new content type

1. Add types + validator to `src/lib/content/schema.ts`.
2. Add a collection in `src/lib/content/store.ts` (`collection<T, Input>("things.json")`) and an empty `content/things.json`.
3. Add actions in `src/app/admin/actions.ts` (always start with `requireAdmin()`).
4. Add `(panel)/things/` list/new/[id] pages using the existing components, and a sidebar entry in `AdminShell`.
5. Add public pages under `src/app/(site)/`, and to `sitemap.ts`.
6. Document it in `09-content-model.md`.
