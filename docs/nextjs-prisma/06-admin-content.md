# 6. Admin content in Postgres

The admin dashboard (`/admin`) stores projects and blog posts in `content/*.json` through `src/lib/content/store.ts`. That works on any server with a writable disk, but **not on Vercel** (read-only filesystem). Once Prisma is set up ([01](01-setup.md), [02](02-database.md)), move the two collections to Postgres. Only `store.ts` changes — pages, actions and forms call the same functions.

## Schema additions (`prisma/schema.prisma`)

Enum values match `src/lib/content/schema.ts` exactly.

```prisma
enum PublishStatus {
  DRAFT
  PUBLISHED
}

enum ProjectStage {
  LIVE
  IN_PROGRESS
  UPCOMING
}

model Project {
  id         String          @id @default(uuid())
  title      String
  slug       String          @unique
  client     String?
  summary    String
  body       String          @db.Text
  service    ServiceInterest // reuses the enum from 02-database.md
  stage      ProjectStage
  status     PublishStatus   @default(DRAFT)
  featured   Boolean         @default(false)
  year       String?
  liveUrl    String?
  coverImage String?
  tags       String[]
  createdAt  DateTime        @default(now())
  updatedAt  DateTime        @updatedAt

  @@index([status, featured])
}

model Post {
  id          String        @id @default(uuid())
  title       String
  slug        String        @unique
  excerpt     String
  body        String        @db.Text
  author      String
  status      PublishStatus @default(DRAFT)
  publishedAt String        // YYYY-MM-DD, compared as a string like the file store
  coverImage  String?
  tags        String[]
  createdAt   DateTime      @default(now())
  updatedAt   DateTime      @updatedAt

  @@index([status, publishedAt])
}
```

```bash
npx prisma migrate dev --name admin-content
```

## Replace `src/lib/content/store.ts`

Keep the exported names and return shapes (dates as ISO strings, optional fields as `undefined`).

```ts
import "server-only";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import type { Post, PostInput, Project, ProjectInput } from "./schema";

export class SlugTakenError extends Error {}

const iso = <T extends { createdAt: Date; updatedAt: Date }>(row: T) => {
  const out: Record<string, unknown> = { ...row, createdAt: row.createdAt.toISOString(), updatedAt: row.updatedAt.toISOString() };
  for (const k of Object.keys(out)) if (out[k] === null) out[k] = undefined;
  return out;
};
const asProject = (r: Prisma.ProjectGetPayload<object>) => iso(r) as unknown as Project;
const asPost = (r: Prisma.PostGetPayload<object>) => iso(r) as unknown as Post;

async function slugSafe<T>(fn: () => Promise<T>) {
  try {
    return await fn();
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") throw new SlugTakenError();
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2025") return null;
    throw e;
  }
}

const STAGE_ORDER = { LIVE: 0, IN_PROGRESS: 1, UPCOMING: 2 } as const;

export const projects = {
  all: async () => (await prisma.project.findMany()).map(asProject),
  list: async () => (await prisma.project.findMany({ orderBy: { updatedAt: "desc" } })).map(asProject),
  published: async () =>
    (await prisma.project.findMany({ where: { status: "PUBLISHED" }, orderBy: [{ featured: "desc" }, { createdAt: "desc" }] }))
      .map(asProject)
      .sort((a, b) => Number(b.featured) - Number(a.featured) || STAGE_ORDER[a.stage] - STAGE_ORDER[b.stage]),
  get: async (id: string) => {
    const r = await prisma.project.findUnique({ where: { id } });
    return r && asProject(r);
  },
  getBySlug: async (slug: string) => {
    const r = await prisma.project.findUnique({ where: { slug } });
    return r && asProject(r);
  },
  create: (data: ProjectInput) => slugSafe(async () => asProject(await prisma.project.create({ data }))),
  update: (id: string, data: ProjectInput) => slugSafe(async () => asProject(await prisma.project.update({ where: { id }, data }))),
  patch: (id: string, data: Partial<ProjectInput>) => slugSafe(async () => asProject(await prisma.project.update({ where: { id }, data }))),
  remove: async (id: string) => (await prisma.project.deleteMany({ where: { id } })).count > 0,
};

export const posts = {
  all: async () => (await prisma.post.findMany()).map(asPost),
  list: async () => (await prisma.post.findMany({ orderBy: [{ publishedAt: "desc" }, { updatedAt: "desc" }] })).map(asPost),
  published: async () => {
    const today = new Date().toISOString().slice(0, 10);
    return (
      await prisma.post.findMany({
        where: { status: "PUBLISHED", publishedAt: { lte: today } },
        orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
      })
    ).map(asPost);
  },
  get: async (id: string) => {
    const r = await prisma.post.findUnique({ where: { id } });
    return r && asPost(r);
  },
  getBySlug: async (slug: string) => {
    const r = await prisma.post.findUnique({ where: { slug } });
    return r && asPost(r);
  },
  create: (data: PostInput) => slugSafe(async () => asPost(await prisma.post.create({ data }))),
  update: (id: string, data: PostInput) => slugSafe(async () => asPost(await prisma.post.update({ where: { id }, data }))),
  patch: (id: string, data: Partial<PostInput>) => slugSafe(async () => asPost(await prisma.post.update({ where: { id }, data }))),
  remove: async (id: string) => (await prisma.post.deleteMany({ where: { id } })).count > 0,
};
```

Optional fields arrive from the form as `undefined`; on `update`, Prisma ignores `undefined`, so to *clear* a field (e.g. remove a cover image) map `undefined` → `null` before saving.

## Import existing JSON content

```ts
// scripts/import-content.ts — run once: npx tsx scripts/import-content.ts
import projects from "../content/projects.json";
import posts from "../content/posts.json";
import { prisma } from "../src/lib/prisma";

await prisma.project.createMany({ data: projects, skipDuplicates: true });
await prisma.post.createMany({ data: posts, skipDuplicates: true });
```

## Pages stay static

Public pages still prerender at build (which now needs `DATABASE_URL` at build time) and refresh through `revalidatePath` after each admin save — nothing else changes.
