# 6. Moving the UI

> **Status:** the mechanical move is done. Every view under `src/views/` is a `'use client'` component rendered by a thin `src/app/**/page.tsx`. This guide covers the next step: splitting views into server pages (Prisma data) and small client components, once the database exists.

Most of the JSX and Tailwind classes copy over unchanged. What changes is **where the data comes from** and **which components run on the client**.

## Server vs client components

All components in `app/` are **server components** by default. They can be `async` and call Prisma directly. A component needs `'use client'` at the top if it uses any of:

- `useState`, `useEffect`, `useTransition`, `useActionState`
- event handlers (`onClick`, `onChange`, ...)
- browser APIs (`localStorage`, `window`)

The usual pattern is a server `page.tsx` that loads data and renders a client `*View.tsx` that holds the interactive parts:

```
app/dashboard/learning/
├─ page.tsx          ← server: requireRole + getMyLearning(user.id)
└─ LearningView.tsx  ← 'use client': tabs, filters, buttons
```

Keep the client components small and the data plain: numbers instead of `Decimal`, ISO strings or `Date`, and no Prisma objects with methods.

## File-by-file guide

| Current file | Becomes | Notes |
|---|---|---|
| `src/main.tsx`, `index.html`, `src/App.tsx` | ✅ deleted | replaced by `app/layout.tsx` and route folders |
| `src/lib/router.tsx` (shim) | delete at the end | switch views to `next/link` / `next/navigation` directly |
| `src/store/store.tsx` | deleted | replaced by `data/queries.ts` + `actions/*` (05) |
| `src/data/seed.ts`, `types.ts` | stay | used only by `prisma/seed.ts`; components switch to Prisma types |
| `src/data/news.ts` | `src/data/news.ts` | unchanged |
| `src/index.css` | ✅ `src/app/globals.css` | Tailwind v4 via `@tailwindcss/postcss` |
| `src/components/ui.tsx` | `src/components/ui.tsx` | add `'use client'` (Modal, Tabs and Toaster use state) or split into `ui-server.tsx` / `ui-client.tsx` |
| `src/components/charts.tsx` | same | pure SVG, so it can stay a server component |
| `src/components/CourseCard.tsx` | same | server component; move the wishlist heart into a small client `WishlistButton` |
| `src/components/AccountForm.tsx` | same + `'use client'` | submit via `updateProfile` action |
| `src/layouts/PublicLayout.tsx` | `app/(public)/layout.tsx` + `components/SiteHeader.tsx` (client) | user comes from `getCurrentUser()` |
| `src/layouts/DashboardLayout.tsx` | `app/{dashboard,tutor,admin}/layout.tsx` + `components/DashboardShell.tsx` (client) | `useNav()` badge counts come from the server as props |
| `src/views/**` | `app/**/page.tsx` (server) + `*View.tsx` (client) | see the route table in 04 |
| `src/lib/utils.ts` | same | `homeFor` → `HOME_FOR` in `lib/guards.ts`; `progress()` takes counts instead of an `Enrollment` |

## Tailwind v4 in Next.js

✅ Done. `postcss.config.mjs` uses `@tailwindcss/postcss`. The Inter font loads through `next/font` (`--font-inter`, see `src/app/layout.tsx`).

## Theme toggle (light/dark)

If the theme is stored in `localStorage` today, add a small inline script in `app/layout.tsx` `<head>` that sets the class before paint. That prevents a flash of the wrong theme. Keep `suppressHydrationWarning` on `<html>`.

## Toasts

`toast()` lives in the store today. Replace it with a tiny client-side store:

```tsx
// src/components/toast.tsx
'use client'

import { useSyncExternalStore } from 'react'

type Toast = { id: number; message: string }
let toasts: Toast[] = []
const listeners = new Set<() => void>()
const emit = () => listeners.forEach((l) => l())

export function toast(message: string) {
  const id = Date.now()
  toasts = [...toasts, { id, message }]
  emit()
  setTimeout(() => { toasts = toasts.filter((t) => t.id !== id); emit() }, 2800)
}

export function Toaster() {
  const list = useSyncExternalStore(
    (l) => { listeners.add(l); return () => listeners.delete(l) },
    () => toasts,
    () => toasts,
  )
  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2">
      {list.map((t) => <div key={t.id} className="rounded-lg bg-slate-900 px-4 py-2 text-white">{t.message}</div>)}
    </div>
  )
}
```

## Images

Swap `<img>` for `next/image` where it matters (hero, course cards) to get resizing and lazy loading:

```tsx
import Image from 'next/image'
<Image src={course.image ?? '/img/c-react.jpg'} alt="" width={480} height={270} className="..." />
```

## Loading and error states

Add these per area. They replace manual loading flags:

```
app/dashboard/loading.tsx   ← skeleton while server data loads
app/dashboard/error.tsx     ← 'use client' error boundary
```

## Suggested porting order

1. Root layout, globals.css, public layout, home page (no data, so it checks styling)
2. `/courses` and `/courses/[id]` (read-only queries)
3. Login, signup and logout (auth working end to end)
4. Cart, checkout, wishlist, student dashboard
5. Course player (`/learn/[id]`): progress and reviews
6. Tutor area and the course editor
7. Admin area
8. Delete `src/store/` and `src/lib/router.tsx`
