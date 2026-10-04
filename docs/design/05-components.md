# 05 · Components

Where they live, what they look like, and how to use them. Utility classes (`.btn`, `.card`, `.field`, `.eyebrow`, `.spot`, `.nebula-text`) are in `src/app/globals.css` inside `@layer components`, so Tailwind utilities can override them.

## Header

`src/components/Header.tsx` (client). Rendered by `src/app/(site)/layout.tsx` and the global 404.

Three layers, fixed to the top (`fixed inset-x-0 top-0 z-50`):

1. **Utility strip** (`lg+`, 36px): left — live `<OpenStatus />` (green pulsing dot when Mon–Fri 9–5 Chicago time, otherwise "Closed · back Mon–Fri, 9 am CST") and city; right — phone, email, "Make a payment" with a card icon. Folds to `h-0` once the page scrolls past 24px.
2. **Main bar** (72px, `grid-cols-[1fr_auto_1fr]`): logo left; centred **nav capsule** (`rounded-full border-white/[0.08] bg-white/[0.03] p-1`) holding About · Services ▾ · Projects · Blog · Contact; right — "Start a project" primary button (from `sm`) and the menu button (below `lg`). Transparent at the top; glass (`bg-bg/75 backdrop-blur-xl` + bottom hairline) once scrolled or when the menu is open.
   - A **sliding pill** (`motion` `layoutId="nav-pill"`, spring 420/36) follows the hovered/focused item and rests on the active one.
   - The active page also gets a **4px violet dot** under the capsule.
   - **Services ▾** opens a 620px two-column dropdown on hover *and* keyboard focus (`group-focus-within`): the three services (icon tile turns solid violet on hover) and a "Our work" feature tile with nebula wash, starfield and a turning orbit → `/projects`.
3. **Progress beam**: a 1px `from-violet-600 via-violet to-pink` line on the bar's bottom edge, `scaleX` bound to page scroll (spring-smoothed). Visible only once scrolled.

**Mobile menu**: full-screen overlay (`fixed inset-0 bg-bg/95 backdrop-blur-2xl`, nebula wash + starfield), large numbered links (`01 Home` … serif-italic numbers, `clamp(1.9rem,8vw,2.6rem)` semibold, active item in `.nebula-text`), staggered in at 45ms; bottom: open status, phone (outline) and "Start a project" (primary). Locks page scroll via `setScrollLocked()` (stops Lenis), closes on Escape and on navigation.

Nav items come from `NAV` in `src/lib/site.ts` — edit there, not in the component.

## Footer

`src/components/Footer.tsx` (server, with small client islands). Four bands on `bg-bg-2` with a faint starfield:

1. **Contact deck** — a hairline grid (`rounded-[2rem]`) of three cells: *Write to us* (email), *Call us* (phone), *Visit us* (address → Google Maps). Each: small-caps label with violet icon, big `clamp(1.25rem,2vw,1.6rem)` value, arrow chip that rotates 45° and fills violet on hover, gradient underline that draws in.
2. **Brand + links** — mark | serif-italic tagline; "Notes from the studio" newsletter (`NewsletterForm`); social icon buttons. Then four columns: Explore, Services, Company, **Office hours** (live `OpenStatus`, hours, and `OfficeTime` — "10:42 AM in Palatine"). Links get a 12px violet line that slides in on hover.
3. **Horizon** — decorative: the word "Nebula" at `clamp(5rem,19vw,17rem)` in a white→violet→transparent gradient, partly hidden behind a giant planet arc (`rounded-full border-t border-violet/40`, dark body, violet + pink glow above its edge).
4. **Legal bar** — `bg-bg`, copyright, "Designed & built in Palatine, Illinois.", **Back to top** button (Lenis-aware `scrollToTop()`).

## Buttons

| Class | Look | Use |
|---|---|---|
| `.btn .btn-primary` | Near-white pill `#f1eaff`, dark text `#12091f`, violet glow shadow; hover → white + pink glow | One primary action per view |
| `.btn .btn-outline` | Transparent pill, `line-strong` border, blur; hover → violet border + 10% violet fill | Secondary |
| `.btn-lg` | Larger padding | Heroes, CTAs |
| `.btn-arrow` | 1.85rem dark circle inside a primary button; rotates 45° on hover | Pair with `arrowUpRight` |

```tsx
<Magnetic>
  <Link href="/contact-us" className="btn btn-primary btn-lg">
    Get in touch
    <span className="btn-arrow"><Icon name="arrowUpRight" className="size-4" /></span>
  </Link>
</Magnetic>
```

Small/admin buttons: add `py-2.5 text-sm`. Danger (admin delete): `btn border border-danger/30 text-danger hover:bg-danger/10`.

**Icon buttons**: `grid size-9–11 place-items-center rounded-full border border-white/10`, hover → violet fill + `text-[#12091f]`. Always give an `aria-label`.

## Cards

- `.card` — vertical gradient `white/4.5% → 1.5%`, hairline border, `1.5rem` radius.
- `.spot` + `<Spotlight>` — adds a 380px violet radial highlight that follows the cursor.
- Hover: `hover:border-violet/40`, inner arrow chip rotates and fills violet, icon tile tilts (`group-hover:-rotate-6`).

## Eyebrow

`<p className="eyebrow">Our services</p>` — small uppercase violet label with a gradient line before it. Above every section headline. Add `justify-center` when centred.

## PageHero / SectionHead / Accent / FinalCta

All in `src/components/Sections.tsx`.

- **`PageHero`** `{ eyebrow, lines, intro?, crumbs?, children? }` — inner-page hero: nebula wash, starfield, slowly turning orbit rings on the right (md+), breadcrumb, `MaskLines` h1, intro. Put extra actions in `children`.
- **`SectionHead`** `{ eyebrow, lines, intro?, align?: "left" | "split" }` — `split` puts the intro on the right at `lg`.
- **`Accent`** — the serif-italic gradient word (see 03).
- **`FinalCta`** — big rounded CTA panel with orbit ellipses; end most pages with it.
- **`ServiceCards`**, **`Process`** (5-step hairline grid), **`Why`**, **`Marquee`** (capabilities ticker).

## Content cards (projects & blog)

`src/components/Content.tsx`:

- **`Cover`** `{ seed, image?, className }` — the image if provided (plain `<img>`, `object-cover`), otherwise generated nebula art seeded by the slug (see 07).
- **`StageBadge`** — glass pill with a status dot: Launched / In progress / Coming soon.
- **`ProjectCard`** `{ project, index, large? }` — `p-2` card with inset cover (4:3), stage badge top-left, star top-right if featured; meta line (service · year), title, client in violet, summary, "View project" / "Preview" (upcoming) with arrow chip.
- **`PostCard`** `{ post, index, large? }` — cover 16:10, meta (date · N min read), title, excerpt, up to 3 tags. `large` = the lead post: side-by-side at `lg`.
- **`PostMeta`**, **`formatDate`** (UTC, "Oct 4, 2026").
- **`EmptyOrbit`** — dashed rounded panel with a small turning orbit; used when a list has nothing published.

## Forms

`src/components/Forms.tsx` (public) and `src/components/admin/fields.tsx` (admin).

- Inputs use `.field`: translucent fill, `line-strong` border, violet border + 4px violet ring on focus, `aria-invalid` → danger border.
- Labels above inputs, `text-sm font-medium text-ink-soft`; "(optional)" in `text-muted`.
- Errors under the field: `text-xs text-[#ff9db4]` with `alert` icon, linked by `aria-describedby`. On submit, focus moves to the first invalid field.
- Form-level error: rounded alert box with danger tint, `role="alert"`.
- Success: centred check in a glowing violet circle.
- Every public form has a hidden honeypot (`website`).

## Icons

`src/components/Icon.tsx` — inline SVG, 24×24 viewBox, 1.6 stroke, round caps, `currentColor`, `aria-hidden`. Usage: `<Icon name="arrowUpRight" className="size-4" />`. Sizes: `size-3.5` (in chips), `size-4` (buttons), `size-5` (tiles), `size-6/7` (feature tiles). To add one, add a path to `PATHS` in the same style (Lucide-like geometry). Don't import an icon library.

## Other

- **`Logo`** — wordmark linking home.
- **`OpenStatus` / `OfficeTime` / `useOfficeClock`** — live office status in America/Chicago; renders a static fallback on the server to avoid hydration mismatch.
- **`BackToTop`**, **`JsonLd`** (escaped schema.org script), **`NotFoundContent`**.
