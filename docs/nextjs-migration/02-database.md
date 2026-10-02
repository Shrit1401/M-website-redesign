# 2. Database (Prisma + Postgres)

The schema below is mapped from `src/data/types.ts`.

| Today (`DB` in localStorage) | Postgres table |
|---|---|
| `users: User[]` | `User` |
| `courses: Course[]` | `Course` |
| `course.curriculum: Section[]` | `Section` |
| `section.lessons: Lesson[]` | `Lesson` |
| `enrollments: Enrollment[]` | `Enrollment` |
| `enrollment.completed: string[]` | `LessonProgress` |
| `orders: Order[]` | `Order` |
| `order.courseIds: string[]` | `OrderItem` |
| `reviews: Review[]` | `Review` |
| `carts: Record<userId, courseId[]>` | `CartItem` |
| `wishlists: Record<userId, courseId[]>` | `WishlistItem` |
| `categories: string[]` | `Category` |

## `prisma/schema.prisma`

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ─── Enums ───────────────────────────────────────────────

enum Role {
  STUDENT
  TUTOR
  ADMIN
}

enum UserStatus {
  ACTIVE
  SUSPENDED
}

enum CourseStatus {
  PUBLISHED
  PENDING
  DRAFT
  REJECTED
}

enum Level {
  BEGINNER
  INTERMEDIATE
  ADVANCED
  ALL_LEVELS
}

enum LessonType {
  VIDEO
  READING
  QUIZ
}

enum OrderStatus {
  PAID
  REFUNDED
}

// ─── Users ───────────────────────────────────────────────

model User {
  id           String     @id @default(cuid())
  name         String
  email        String     @unique
  passwordHash String
  role         Role       @default(STUDENT)
  status       UserStatus @default(ACTIVE)
  headline     String?
  bio          String?
  avatar       String?
  createdAt    DateTime   @default(now())
  updatedAt    DateTime   @updatedAt

  courses     Course[]       @relation("TutorCourses")
  enrollments Enrollment[]
  orders      Order[]
  reviews     Review[]
  cartItems   CartItem[]
  wishlist    WishlistItem[]
}

// ─── Catalogue ───────────────────────────────────────────

model Category {
  id      String   @id @default(cuid())
  name    String   @unique
  courses Course[]
}

model Course {
  id           String       @id @default(cuid())
  slug         String       @unique
  title        String
  subtitle     String
  description  String
  level        Level
  price        Decimal      @db.Decimal(10, 2)
  status       CourseStatus @default(DRAFT)
  hue          Int
  image        String?
  bestseller   Boolean      @default(false)
  outcomes     String[]
  requirements String[]
  createdAt    DateTime     @default(now())
  updatedAt    DateTime     @updatedAt

  // Denormalised counters (today: course.rating / reviews / students).
  // Keep them updated in the server actions, or compute them with aggregates.
  ratingAvg    Float        @default(0)
  reviewCount  Int          @default(0)
  studentCount Int          @default(0)

  tutorId    String
  tutor      User     @relation("TutorCourses", fields: [tutorId], references: [id], onDelete: Cascade)
  categoryId String
  category   Category @relation(fields: [categoryId], references: [id])

  sections    Section[]
  enrollments Enrollment[]
  reviews     Review[]
  orderItems  OrderItem[]
  cartItems   CartItem[]
  wishlist    WishlistItem[]

  @@index([status])
  @@index([tutorId])
  @@index([categoryId])
}

model Section {
  id       String   @id @default(cuid())
  title    String
  position Int
  courseId String
  course   Course   @relation(fields: [courseId], references: [id], onDelete: Cascade)
  lessons  Lesson[]

  @@index([courseId, position])
}

model Lesson {
  id        String     @id @default(cuid())
  title     String
  minutes   Int
  type      LessonType @default(VIDEO)
  preview   Boolean    @default(false)
  position  Int
  videoUrl  String?
  content   String?    // reading body / quiz JSON
  sectionId String
  section   Section    @relation(fields: [sectionId], references: [id], onDelete: Cascade)

  progress      LessonProgress[]
  lastLessonFor Enrollment[]     @relation("LastLesson")

  @@index([sectionId, position])
}

// ─── Learning ────────────────────────────────────────────

model Enrollment {
  id         String   @id @default(cuid())
  enrolledAt DateTime @default(now())

  userId   String
  user     User   @relation(fields: [userId], references: [id], onDelete: Cascade)
  courseId String
  course   Course @relation(fields: [courseId], references: [id], onDelete: Cascade)

  lastLessonId String?
  lastLesson   Lesson? @relation("LastLesson", fields: [lastLessonId], references: [id], onDelete: SetNull)

  progress LessonProgress[]

  @@unique([userId, courseId])
}

model LessonProgress {
  enrollmentId String
  enrollment   Enrollment @relation(fields: [enrollmentId], references: [id], onDelete: Cascade)
  lessonId     String
  lesson       Lesson     @relation(fields: [lessonId], references: [id], onDelete: Cascade)
  completedAt  DateTime   @default(now())

  @@id([enrollmentId, lessonId])
}

model Review {
  id        String   @id @default(cuid())
  rating    Int      // 1–5, validate with zod
  text      String
  createdAt DateTime @default(now())

  userId   String
  user     User   @relation(fields: [userId], references: [id], onDelete: Cascade)
  courseId String
  course   Course @relation(fields: [courseId], references: [id], onDelete: Cascade)

  @@unique([userId, courseId])
}

// ─── Commerce ────────────────────────────────────────────

model Order {
  id        String      @id @default(cuid())
  number    String      @unique // human-friendly, e.g. ORD-48213
  total     Decimal     @db.Decimal(10, 2)
  status    OrderStatus @default(PAID)
  createdAt DateTime    @default(now())

  userId String
  user   User        @relation(fields: [userId], references: [id], onDelete: Cascade)
  items  OrderItem[]
}

model OrderItem {
  orderId  String
  order    Order   @relation(fields: [orderId], references: [id], onDelete: Cascade)
  courseId String
  course   Course  @relation(fields: [courseId], references: [id])
  price    Decimal @db.Decimal(10, 2) // price at time of purchase

  @@id([orderId, courseId])
}

model CartItem {
  userId   String
  user     User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  courseId String
  course   Course   @relation(fields: [courseId], references: [id], onDelete: Cascade)
  addedAt  DateTime @default(now())

  @@id([userId, courseId])
}

model WishlistItem {
  userId   String
  user     User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  courseId String
  course   Course   @relation(fields: [courseId], references: [id], onDelete: Cascade)
  addedAt  DateTime @default(now())

  @@id([userId, courseId])
}

// ─── Settings (admin → settings page) ────────────────────

model Setting {
  key   String @id
  value Json
}
```

Create the first migration:

```bash
npm run db:migrate -- --name init
```

## `src/lib/prisma.ts`

One client per process, reused across hot reloads in dev:

```ts
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient }

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({ log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'] })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
```

## Seed: `prisma/seed.ts`

Reuse the existing `createSeed()` from `src/data/seed.ts` so the demo data stays the same. Import it directly from `src/data/seed.ts`.

```ts
import { PrismaClient, type Level, type LessonType } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { createSeed } from '../src/data/seed'

const prisma = new PrismaClient()

const enumOf = <T extends string>(v: string) => v.toUpperCase().replace(/ /g, '_') as T
const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

async function main() {
  const db = createSeed()

  // Wipe in dependency order
  await prisma.$transaction([
    prisma.lessonProgress.deleteMany(),
    prisma.enrollment.deleteMany(),
    prisma.orderItem.deleteMany(),
    prisma.order.deleteMany(),
    prisma.review.deleteMany(),
    prisma.cartItem.deleteMany(),
    prisma.wishlistItem.deleteMany(),
    prisma.lesson.deleteMany(),
    prisma.section.deleteMany(),
    prisma.course.deleteMany(),
    prisma.category.deleteMany(),
    prisma.user.deleteMany(),
  ])

  // Categories
  const categoryId = new Map<string, string>()
  for (const name of db.categories) {
    const c = await prisma.category.create({ data: { name } })
    categoryId.set(name, c.id)
  }

  // Users — keep the seed ids so the rest of the seed's references still line up
  for (const u of db.users) {
    await prisma.user.create({
      data: {
        id: u.id,
        name: u.name,
        email: u.email,
        passwordHash: await bcrypt.hash(u.password, 10),
        role: enumOf(u.role),
        status: enumOf(u.status),
        headline: u.headline,
        bio: u.bio,
        avatar: u.avatar,
        createdAt: new Date(u.joined),
      },
    })
  }

  // Courses + curriculum
  for (const c of db.courses) {
    await prisma.course.create({
      data: {
        id: c.id,
        slug: slugify(c.title),
        title: c.title,
        subtitle: c.subtitle,
        description: c.description,
        level: enumOf<Level>(c.level),
        price: c.price,
        status: enumOf(c.status),
        hue: c.hue,
        image: c.image,
        bestseller: c.bestseller ?? false,
        outcomes: c.outcomes,
        requirements: c.requirements,
        ratingAvg: c.rating,
        reviewCount: c.reviews,
        studentCount: c.students,
        updatedAt: new Date(c.updated),
        tutorId: c.tutorId,
        categoryId: categoryId.get(c.category)!,
        sections: {
          create: c.curriculum.map((s, si) => ({
            id: s.id,
            title: s.title,
            position: si,
            lessons: {
              create: s.lessons.map((l, li) => ({
                id: l.id,
                title: l.title,
                minutes: l.minutes,
                type: enumOf<LessonType>(l.type),
                preview: l.preview ?? false,
                position: li,
              })),
            },
          })),
        },
      },
    })
  }

  // Enrollments + progress
  for (const e of db.enrollments) {
    await prisma.enrollment.create({
      data: {
        userId: e.userId,
        courseId: e.courseId,
        enrolledAt: new Date(e.enrolledAt),
        lastLessonId: e.lastLessonId,
        progress: { create: e.completed.map((lessonId) => ({ lessonId })) },
      },
    })
  }

  // Orders
  for (const o of db.orders) {
    await prisma.order.create({
      data: {
        number: o.id,
        userId: o.userId,
        total: o.total,
        status: enumOf(o.status),
        createdAt: new Date(o.date),
        items: {
          create: o.courseIds.map((courseId) => ({
            courseId,
            price: db.courses.find((c) => c.id === courseId)?.price ?? 0,
          })),
        },
      },
    })
  }

  // Reviews
  await prisma.review.createMany({
    data: db.reviews.map((r) => ({
      userId: r.userId, courseId: r.courseId, rating: r.rating, text: r.text, createdAt: new Date(r.date),
    })),
    skipDuplicates: true,
  })

  // Carts + wishlists
  await prisma.cartItem.createMany({
    data: Object.entries(db.carts).flatMap(([userId, ids]) => ids.map((courseId) => ({ userId, courseId }))),
  })
  await prisma.wishlistItem.createMany({
    data: Object.entries(db.wishlists).flatMap(([userId, ids]) => ids.map((courseId) => ({ userId, courseId }))),
  })

  console.log(`Seeded ${db.users.length} users, ${db.courses.length} courses`)
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
```

```bash
npm run db:seed
npm run db:studio   # browse the data at http://localhost:5555
```

## Notes

- **Money:** `Decimal` comes back as a `Prisma.Decimal` object. Convert it with `Number(course.price)` before passing it to client components, because `Decimal` cannot be serialised across the server/client boundary.
- **Enum labels:** the UI shows `'Beginner'`, `'All levels'` and so on. Add a small map in `src/lib/labels.ts` (for example `LEVEL_LABEL: Record<Level, string>`) instead of changing every component.
- **Course URLs:** the SPA uses `/courses/:id`. With the `slug` column you can switch to `/courses/:slug` later. Both work if you look up by `id` OR `slug`.
