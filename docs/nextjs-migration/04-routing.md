# 4. Routing: React Router → App Router

> **Status:** ✅ done. All routes below exist under `src/app/`, and the redirects are in `next.config.ts`. Views still use React Router–style hooks through the shim in `src/lib/router.tsx`. The boilerplate further down shows how each page becomes a **server** component once Prisma is in.

`src/App.tsx` defines every route. Each route becomes a folder under `src/app/` with a `page.tsx`. Layout routes (`PublicLayout`, `DashboardLayout`) become `layout.tsx` files.

Route groups in parentheses, such as `(public)`, share a layout without adding a URL segment.

## Route map

### Public (`PublicLayout` → `src/app/(public)/layout.tsx`)

| URL | Today | New file |
|---|---|---|
| `/` | `pages/public/Home.tsx` | `app/(public)/page.tsx` |
| `/courses` | `pages/public/Courses.tsx` | `app/(public)/courses/page.tsx` |
| `/courses/:id` | `pages/public/CourseDetail.tsx` | `app/(public)/courses/[id]/page.tsx` |
| `/about-us` | `Misc.tsx → About` | `app/(public)/about-us/page.tsx` |
| `/join-us` | `Misc.tsx → JoinUs` | `app/(public)/join-us/page.tsx` |
| `/contact` | `Misc.tsx → Contact` | `app/(public)/contact/page.tsx` |
| `/news` | `News.tsx → News` | `app/(public)/news/page.tsx` |
| `/news/:slug` | `News.tsx → NewsPost` | `app/(public)/news/[slug]/page.tsx` |
| `/make-a-payment` | `Misc.tsx → MakePayment` | `app/(public)/make-a-payment/page.tsx` |
| `/cart` | `Misc.tsx → Cart` | `app/(public)/cart/page.tsx` |
| `/checkout/success` | `Misc.tsx → CheckoutSuccess` (student) | `app/(public)/checkout/success/page.tsx` + `requireRole('STUDENT')` |
| `*` | `Misc.tsx → NotFound` | `app/(public)/[...notFound]/page.tsx` |

### Redirects (`<Navigate>`)

Put these in `next.config.ts`:

```ts
import type { NextConfig } from 'next'

const config: NextConfig = {
  async redirects() {
    return [
      { source: '/about', destination: '/about-us', permanent: true },
      { source: '/teach', destination: '/join-us', permanent: true },
    ]
  },
}
export default config
```

### Auth (no layout chrome → `src/app/(auth)/`)

| URL | Today | New file |
|---|---|---|
| `/login` | `Auth.tsx → Login` | `app/(auth)/login/page.tsx` |
| `/signup` | `Auth.tsx → Signup` | `app/(auth)/signup/page.tsx` |

### Course player

| URL | Today | New file |
|---|---|---|
| `/learn/:id` | `student/Player.tsx` (student) | `app/learn/[id]/page.tsx` |

### Student (`DashboardLayout role="student"` → `app/dashboard/layout.tsx`)

| URL | Today | New file |
|---|---|---|
| `/dashboard` | `StudentOverview` | `app/dashboard/page.tsx` |
| `/dashboard/learning` | `MyLearning` | `app/dashboard/learning/page.tsx` |
| `/dashboard/wishlist` | `Wishlist` | `app/dashboard/wishlist/page.tsx` |
| `/dashboard/orders` | `Orders` | `app/dashboard/orders/page.tsx` |
| `/dashboard/account` | `AccountPage` | `app/dashboard/account/page.tsx` |

### Tutor (`app/tutor/layout.tsx`)

| URL | Today | New file |
|---|---|---|
| `/tutor` | `TutorOverview` | `app/tutor/page.tsx` |
| `/tutor/courses` | `TutorCourses` | `app/tutor/courses/page.tsx` |
| `/tutor/courses/new` | `CourseEditor key="new"` | `app/tutor/courses/new/page.tsx` |
| `/tutor/courses/:id/edit` | `CourseEditor` | `app/tutor/courses/[id]/edit/page.tsx` |
| `/tutor/students` | `TutorStudents` | `app/tutor/students/page.tsx` |
| `/tutor/earnings` | `TutorEarnings` | `app/tutor/earnings/page.tsx` |
| `/tutor/account` | `AccountPage title="Instructor profile"` | `app/tutor/account/page.tsx` |

### Admin (`app/admin/layout.tsx`)

| URL | Today | New file |
|---|---|---|
| `/admin` | `AdminOverview` | `app/admin/page.tsx` |
| `/admin/users` | `AdminUsers` | `app/admin/users/page.tsx` |
| `/admin/courses` | `AdminCourses` | `app/admin/courses/page.tsx` |
| `/admin/categories` | `AdminCategories` | `app/admin/categories/page.tsx` |
| `/admin/payments` | `AdminPayments` | `app/admin/payments/page.tsx` |
| `/admin/settings` | `AdminSettings` | `app/admin/settings/page.tsx` |

## Boilerplate

### Root layout — `src/app/layout.tsx`

```tsx
import type { Metadata } from 'next'
import { Plus_Jakarta_Sans } from 'next/font/google'
import './globals.css'
import { Toaster } from '@/components/ui'

const font = Plus_Jakarta_Sans({ subsets: ['latin'], variable: '--font-sans' })

export const metadata: Metadata = {
  title: { default: 'Revive Skills', template: '%s · Revive Skills' },
  description: 'Learn new skills from expert instructors.',
  icons: { icon: '/favicon-32.png', apple: '/apple-touch-icon.png' },
  openGraph: { images: ['/assets/og-image.png'] },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={font.variable} suppressHydrationWarning>
      <body>
        {children}
        <Toaster />
      </body>
    </html>
  )
}
```

Move the `<head>` tags from `index.html` into `metadata`. `index.html` and `src/main.tsx` are no longer needed.

### Public layout — `src/app/(public)/layout.tsx`

```tsx
import { getCurrentUser } from '@/lib/guards'
import { SiteHeader, SiteFooter } from '@/components/PublicChrome'

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser()
  return (
    <>
      <SiteHeader user={user} />
      <main>{children}</main>
      <SiteFooter />
    </>
  )
}
```

Split `src/layouts/PublicLayout.tsx` into `SiteHeader` (client, because of the menu state) and `SiteFooter` (server).

### Dynamic page — `src/app/(public)/courses/[id]/page.tsx`

```tsx
import { notFound } from 'next/navigation'
import { getCourseDetail } from '@/data/queries'
import { getCurrentUser } from '@/lib/guards'
import CourseDetailView from './CourseDetailView'

export default async function CoursePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const [course, user] = await Promise.all([getCourseDetail(id), getCurrentUser()])
  if (!course) notFound()
  return <CourseDetailView course={course} user={user} />
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const course = await getCourseDetail((await params).id)
  return { title: course?.title ?? 'Course' }
}
```

### Static news pages

`src/data/news.ts` is static, so pre-render it:

```tsx
// src/app/(public)/news/[slug]/page.tsx
import { POSTS } from '@/data/news'
export const generateStaticParams = () => POSTS.map((p) => ({ slug: p.slug }))
```

## React Router API → Next.js API

| React Router | Next.js |
|---|---|
| `<Link to="/x">` | `<Link href="/x">` from `next/link` |
| `<NavLink>` active state | `usePathname()` + compare (client component) |
| `useNavigate()` | `useRouter().push()` from `next/navigation` |
| `useParams()` | `params` prop in page (server) or `useParams()` (client) |
| `useSearchParams()` | `searchParams` prop in page or `useSearchParams()` |
| `useLocation()` | `usePathname()` + `useSearchParams()` |
| `<Navigate to>` | `redirect()` (server) or `router.replace()` (client) |
| `<Outlet />` | `{children}` in `layout.tsx` |

Find every place that needs changing:

```bash
grep -rn "react-router-dom" src/
```
