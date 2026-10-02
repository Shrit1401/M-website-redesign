# 5. Data layer: `useStore()` → queries and server actions

Today every page calls `useStore()` and gets back the whole `db` object plus mutation functions. In Next.js:

- **Reads:** server components call functions in `src/data/queries.ts`, which use Prisma.
- **Writes:** client components call **server actions** in `src/actions/*.ts`. The action checks the session, writes with Prisma, then calls `revalidatePath()` so the page shows fresh data.
- **Toasts** stay client-side. Call `toast()` after the action resolves.

## Action map

| `useStore()` today | New location | Who can call |
|---|---|---|
| `login` / `signup` / `loginAs` / `logout` | `actions/auth.ts` (see 03) | anyone |
| `updateProfile(patch)` | `actions/account.ts → updateProfile` | signed in |
| `addToCart(courseId)` | `actions/cart.ts → addToCart` | student |
| `removeFromCart(courseId)` | `actions/cart.ts → removeFromCart` | student |
| `toggleWishlist(courseId)` | `actions/cart.ts → toggleWishlist` | student |
| `checkout()` | `actions/cart.ts → checkout` | student |
| `enrollFree(courseId)` | `actions/cart.ts → enrollFree` | student |
| `markLesson(courseId, lessonId, done)` | `actions/learning.ts → markLesson` | enrolled student |
| `setLastLesson(courseId, lessonId)` | `actions/learning.ts → setLastLesson` | enrolled student |
| `addReview(courseId, rating, text)` | `actions/learning.ts → addReview` | enrolled student |
| `saveCourse(course)` | `actions/tutor.ts → saveCourse` | course owner (tutor) |
| `deleteCourse(courseId)` | `actions/tutor.ts → deleteCourse` | course owner or admin |
| `setCourseStatus(id, status)` | `actions/admin.ts → setCourseStatus` | admin |
| `setUser(id, patch)` | `actions/admin.ts → updateUser` | admin |
| `addUser(user)` | `actions/admin.ts → inviteUser` | admin |
| `deleteUser(id)` | `actions/admin.ts → deleteUser` | admin |
| `refundOrder(id)` | `actions/admin.ts → refundOrder` | admin |
| `addCategory` / `removeCategory` | `actions/admin.ts` | admin |
| `resetDemo()` | `actions/admin.ts → resetDemo` (runs the seed) | admin, demo mode only |
| `db.courses.filter(...)` etc. | `data/queries.ts` | server components |

## Queries — `src/data/queries.ts`

```ts
import 'server-only'
import { cache } from 'react'
import type { Prisma } from '@prisma/client'
import { prisma } from '@/lib/prisma'

const cardSelect = {
  id: true, slug: true, title: true, subtitle: true, image: true, hue: true, level: true,
  price: true, ratingAvg: true, reviewCount: true, studentCount: true, bestseller: true,
  category: { select: { name: true } },
  tutor: { select: { id: true, name: true } },
} satisfies Prisma.CourseSelect

// Catalogue page: search / filter / sort (today done in Courses.tsx on the client)
export async function listCourses(opts: { q?: string; category?: string; level?: string; sort?: string }) {
  const where: Prisma.CourseWhereInput = {
    status: 'PUBLISHED',
    ...(opts.q && { OR: [{ title: { contains: opts.q, mode: 'insensitive' } }, { subtitle: { contains: opts.q, mode: 'insensitive' } }] }),
    ...(opts.category && { category: { name: opts.category } }),
  }
  const orderBy: Prisma.CourseOrderByWithRelationInput =
    opts.sort === 'rating' ? { ratingAvg: 'desc' }
    : opts.sort === 'newest' ? { createdAt: 'desc' }
    : opts.sort === 'price-asc' ? { price: 'asc' }
    : { studentCount: 'desc' }

  return prisma.course.findMany({ where, orderBy, select: cardSelect })
}

// cache() dedupes the call between generateMetadata and the page
export const getCourseDetail = cache((idOrSlug: string) =>
  prisma.course.findFirst({
    where: { OR: [{ id: idOrSlug }, { slug: idOrSlug }] },
    include: {
      category: true,
      tutor: { select: { id: true, name: true, headline: true, bio: true, avatar: true } },
      sections: { orderBy: { position: 'asc' }, include: { lessons: { orderBy: { position: 'asc' } } } },
      reviews: { orderBy: { createdAt: 'desc' }, take: 10, include: { user: { select: { name: true, avatar: true } } } },
    },
  }),
)

export function getMyLearning(userId: string) {
  return prisma.enrollment.findMany({
    where: { userId },
    orderBy: { enrolledAt: 'desc' },
    include: {
      course: { select: { ...cardSelect, sections: { select: { lessons: { select: { id: true, minutes: true } } } } } },
      _count: { select: { progress: true } },
    },
  })
}

export function getCart(userId: string) {
  return prisma.cartItem.findMany({ where: { userId }, include: { course: { select: cardSelect } } })
}

export function getTutorCourses(tutorId: string) {
  return prisma.course.findMany({ where: { tutorId }, orderBy: { updatedAt: 'desc' }, select: { ...cardSelect, status: true, updatedAt: true } })
}

export function getAdminUsers() {
  return prisma.user.findMany({ orderBy: { createdAt: 'desc' }, omit: { passwordHash: true } })
}
```

**Do not return `passwordHash` to any page.** Use `select` or `omit` every time you read users.

## Server actions

### Shared helper — `src/actions/_utils.ts`

```ts
import 'server-only'
import type { Role } from '@prisma/client'
import { auth } from '@/lib/auth'

export async function actor(role?: Role) {
  const session = await auth()
  if (!session?.user) throw new Error('Not signed in')
  if (role && session.user.role !== role) throw new Error('Forbidden')
  return session.user
}
```

### Cart and checkout — `src/actions/cart.ts`

```ts
'use server'

import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'
import { actor } from './_utils'

export async function addToCart(courseId: string) {
  const user = await actor('STUDENT')
  await prisma.cartItem.upsert({
    where: { userId_courseId: { userId: user.id, courseId } },
    create: { userId: user.id, courseId },
    update: {},
  })
  revalidatePath('/cart')
}

export async function removeFromCart(courseId: string) {
  const user = await actor('STUDENT')
  await prisma.cartItem.deleteMany({ where: { userId: user.id, courseId } })
  revalidatePath('/cart')
}

export async function toggleWishlist(courseId: string) {
  const user = await actor('STUDENT')
  const key = { userId_courseId: { userId: user.id, courseId } }
  const existing = await prisma.wishlistItem.findUnique({ where: key })
  if (existing) await prisma.wishlistItem.delete({ where: key })
  else await prisma.wishlistItem.create({ data: { userId: user.id, courseId } })
  revalidatePath('/dashboard/wishlist')
  return !existing
}

// Mock payment — swap the body for a Stripe Checkout Session + webhook when going live
export async function checkout(): Promise<string | null> {
  const user = await actor('STUDENT')

  return prisma.$transaction(async (tx) => {
    const cart = await tx.cartItem.findMany({ where: { userId: user.id }, include: { course: { select: { id: true, price: true } } } })
    if (!cart.length) return null

    const total = cart.reduce((s, i) => s + Number(i.course.price), 0)
    const number = `ORD-${Math.floor(10000 + Math.random() * 89999)}`

    await tx.order.create({
      data: {
        number, userId: user.id, total,
        items: { create: cart.map((i) => ({ courseId: i.course.id, price: i.course.price })) },
      },
    })
    await tx.enrollment.createMany({
      data: cart.map((i) => ({ userId: user.id, courseId: i.course.id })),
      skipDuplicates: true,
    })
    await tx.course.updateMany({ where: { id: { in: cart.map((i) => i.course.id) } }, data: { studentCount: { increment: 1 } } })
    await tx.cartItem.deleteMany({ where: { userId: user.id } })
    return number
  })
}

export async function enrollFree(courseId: string) {
  const user = await actor('STUDENT')
  const course = await prisma.course.findUniqueOrThrow({ where: { id: courseId }, select: { price: true } })
  if (Number(course.price) !== 0) throw new Error('Course is not free')
  await prisma.enrollment.upsert({
    where: { userId_courseId: { userId: user.id, courseId } },
    create: { userId: user.id, courseId },
    update: {},
  })
  revalidatePath('/dashboard/learning')
}
```

### Learning — `src/actions/learning.ts`

```ts
'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { actor } from './_utils'

async function enrollmentFor(userId: string, courseId: string) {
  return prisma.enrollment.findUniqueOrThrow({ where: { userId_courseId: { userId, courseId } } })
}

export async function markLesson(courseId: string, lessonId: string, done: boolean) {
  const user = await actor('STUDENT')
  const e = await enrollmentFor(user.id, courseId)
  const key = { enrollmentId_lessonId: { enrollmentId: e.id, lessonId } }
  if (done) await prisma.lessonProgress.upsert({ where: key, create: { enrollmentId: e.id, lessonId }, update: {} })
  else await prisma.lessonProgress.deleteMany({ where: { enrollmentId: e.id, lessonId } })
  revalidatePath(`/learn/${courseId}`)
}

export async function setLastLesson(courseId: string, lessonId: string) {
  const user = await actor('STUDENT')
  await prisma.enrollment.update({
    where: { userId_courseId: { userId: user.id, courseId } },
    data: { lastLessonId: lessonId },
  })
}

const reviewSchema = z.object({ rating: z.number().int().min(1).max(5), text: z.string().trim().min(1).max(2000) })

export async function addReview(courseId: string, rating: number, text: string) {
  const user = await actor('STUDENT')
  await enrollmentFor(user.id, courseId) // must be enrolled
  const data = reviewSchema.parse({ rating, text })

  await prisma.$transaction(async (tx) => {
    await tx.review.upsert({
      where: { userId_courseId: { userId: user.id, courseId } },
      create: { ...data, userId: user.id, courseId },
      update: data,
    })
    const agg = await tx.review.aggregate({ where: { courseId }, _avg: { rating: true }, _count: true })
    await tx.course.update({ where: { id: courseId }, data: { ratingAvg: agg._avg.rating ?? 0, reviewCount: agg._count } })
  })
  revalidatePath(`/courses/${courseId}`)
}
```

### Tutor — `src/actions/tutor.ts`

The course editor (`src/views/tutor/CourseEditor.tsx`) keeps its local form state. On save it sends the whole course, including the curriculum. The simplest correct approach is to replace all sections and lessons inside a transaction.

```ts
'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { actor } from './_utils'

const lessonSchema = z.object({
  title: z.string().min(1), minutes: z.number().int().min(0),
  type: z.enum(['VIDEO', 'READING', 'QUIZ']), preview: z.boolean().default(false),
})
const courseSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(3), subtitle: z.string(), description: z.string(),
  categoryId: z.string(), level: z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'ALL_LEVELS']),
  price: z.number().min(0), hue: z.number().int(), image: z.string().optional(),
  outcomes: z.array(z.string()), requirements: z.array(z.string()),
  submit: z.boolean().default(false), // "Submit for review" → PENDING
  sections: z.array(z.object({ title: z.string().min(1), lessons: z.array(lessonSchema) })),
})

export async function saveCourse(input: z.input<typeof courseSchema>) {
  const user = await actor('TUTOR')
  const { id, sections, submit, ...fields } = courseSchema.parse(input)

  if (id) {
    const owned = await prisma.course.findFirst({ where: { id, tutorId: user.id }, select: { id: true } })
    if (!owned) throw new Error('Forbidden')
  }

  const curriculum = {
    create: sections.map((s, si) => ({
      title: s.title, position: si,
      lessons: { create: s.lessons.map((l, li) => ({ ...l, position: li })) },
    })),
  }
  const status = submit ? 'PENDING' : 'DRAFT'

  const course = await prisma.$transaction(async (tx) => {
    if (id) {
      await tx.section.deleteMany({ where: { courseId: id } })
      return tx.course.update({ where: { id }, data: { ...fields, status, sections: curriculum } })
    }
    return tx.course.create({
      data: { ...fields, status, slug: `${slugify(fields.title)}-${Date.now().toString(36)}`, tutorId: user.id, sections: curriculum },
    })
  })

  revalidatePath('/tutor/courses')
  return course.id
}

export async function deleteCourse(courseId: string) {
  const user = await actor()
  const where = user.role === 'ADMIN' ? { id: courseId } : { id: courseId, tutorId: user.id }
  await prisma.course.deleteMany({ where })
  revalidatePath('/tutor/courses')
}

const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
```

Replacing sections deletes `LessonProgress` rows for lessons that students already completed. If that matters for published courses, diff the curriculum instead: update by lesson `id` and only delete lessons that were removed.

### Admin — `src/actions/admin.ts`

```ts
'use server'

import { revalidatePath } from 'next/cache'
import type { CourseStatus, Role, UserStatus } from '@prisma/client'
import { prisma } from '@/lib/prisma'
import { actor } from './_utils'

export async function setCourseStatus(courseId: string, status: CourseStatus) {
  await actor('ADMIN')
  await prisma.course.update({ where: { id: courseId }, data: { status } })
  revalidatePath('/admin/courses')
}

export async function updateUser(userId: string, patch: { role?: Role; status?: UserStatus }) {
  const me = await actor('ADMIN')
  if (userId === me.id && patch.role && patch.role !== 'ADMIN') throw new Error('You cannot demote yourself')
  await prisma.user.update({ where: { id: userId }, data: patch })
  revalidatePath('/admin/users')
}

export async function deleteUser(userId: string) {
  const me = await actor('ADMIN')
  if (userId === me.id) throw new Error('You cannot delete yourself')
  await prisma.user.delete({ where: { id: userId } })
  revalidatePath('/admin/users')
}

export async function refundOrder(orderId: string) {
  await actor('ADMIN')
  await prisma.order.update({ where: { id: orderId }, data: { status: 'REFUNDED' } })
  revalidatePath('/admin/payments')
}

export async function addCategory(name: string) {
  await actor('ADMIN')
  await prisma.category.upsert({ where: { name }, create: { name }, update: {} })
  revalidatePath('/admin/categories')
}

export async function removeCategory(name: string) {
  await actor('ADMIN')
  const inUse = await prisma.course.count({ where: { category: { name } } })
  if (inUse) throw new Error(`${inUse} courses still use this category`)
  await prisma.category.delete({ where: { name } })
  revalidatePath('/admin/categories')
}

// inviteUser: create the user with a random password and email a reset link (needs an email provider)
// resetDemo: guard with NEXT_PUBLIC_DEMO_MODE, then run the same logic as prisma/seed.ts (export main() from it)
```

## Calling an action from a client component

```tsx
'use client'

import { useTransition } from 'react'
import { addToCart } from '@/actions/cart'
import { toast } from '@/components/ui' // turn Toaster into a tiny client-side store

export function AddToCartButton({ courseId }: { courseId: string }) {
  const [pending, start] = useTransition()
  return (
    <button
      disabled={pending}
      onClick={() => start(async () => {
        await addToCart(courseId)
        toast('Added to cart')
      })}
    >
      Add to cart
    </button>
  )
}
```

## Analytics (`src/lib/analytics.ts`)

`monthlyGross(db, courses)` loops over `db.orders` in memory. Replace it with a SQL aggregate:

```ts
import { Prisma } from '@prisma/client'
import { prisma } from '@/lib/prisma'

export async function monthlyGross(tutorId?: string) {
  return prisma.$queryRaw<{ month: Date; gross: number }[]>`
    SELECT date_trunc('month', o."createdAt") AS month, SUM(oi.price)::float AS gross
    FROM "OrderItem" oi
    JOIN "Order" o ON o.id = oi."orderId"
    JOIN "Course" c ON c.id = oi."courseId"
    WHERE o.status = 'PAID'
      AND o."createdAt" > now() - interval '6 months'
      ${tutorId ? Prisma.sql`AND c."tutorId" = ${tutorId}` : Prisma.empty}
    GROUP BY 1 ORDER BY 1`
}
```

`TUTOR_SHARE = 0.7` can stay a constant, or move into the `Setting` table so admins can change it.
