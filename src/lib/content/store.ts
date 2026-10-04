import "server-only";

import { randomUUID } from "node:crypto";
import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";
import type { Post, PostInput, Project, ProjectInput } from "./schema";

/**
 * File-backed content store: one JSON file per collection in /content, committed with the repo.
 *
 * It works anywhere the server has a writable disk (`next dev`, `next start` on a VM or Docker volume).
 * Serverless hosts such as Vercel have a read-only filesystem, so saving from /admin fails there —
 * swap this module for the Prisma version in docs/nextjs-prisma/06-admin-content.md. Every caller goes
 * through `projects` / `posts` below, so that swap touches only this file.
 */

const DIR = path.join(process.cwd(), "content");

export class SlugTakenError extends Error {}

type Item = { id: string; slug: string; createdAt: string; updatedAt: string };

function collection<T extends Item, Input extends { slug: string }>(file: string) {
  const filePath = path.join(DIR, file);
  // Writes are queued so two saves in the same process can't interleave read-modify-write.
  let queue: Promise<unknown> = Promise.resolve();

  async function readAll(): Promise<T[]> {
    try {
      return JSON.parse(await readFile(filePath, "utf8")) as T[];
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === "ENOENT") return [];
      throw error;
    }
  }

  async function writeAll(items: T[]) {
    await mkdir(DIR, { recursive: true });
    // Write to a temp file and rename, so a crash mid-write never leaves half a JSON file.
    const tmp = `${filePath}.${process.pid}.tmp`;
    await writeFile(tmp, JSON.stringify(items, null, 2) + "\n", "utf8");
    await rename(tmp, filePath);
  }

  function mutate<R>(fn: (items: T[]) => { items: T[]; result: R }): Promise<R> {
    const run = queue.then(async () => {
      const { items, result } = fn(await readAll());
      await writeAll(items);
      return result;
    });
    queue = run.catch(() => {});
    return run;
  }

  const assertSlugFree = (items: T[], slug: string, exceptId?: string) => {
    if (items.some((i) => i.slug === slug && i.id !== exceptId)) throw new SlugTakenError(slug);
  };

  return {
    all: readAll,
    get: async (id: string) => (await readAll()).find((i) => i.id === id) ?? null,
    getBySlug: async (slug: string) => (await readAll()).find((i) => i.slug === slug) ?? null,

    create: (input: Input) =>
      mutate((items) => {
        assertSlugFree(items, input.slug);
        const now = new Date().toISOString();
        const item = { ...input, id: randomUUID(), createdAt: now, updatedAt: now } as unknown as T;
        return { items: [item, ...items], result: item };
      }),

    update: (id: string, input: Input) =>
      mutate((items) => {
        const current = items.find((i) => i.id === id);
        if (!current) return { items, result: null };
        assertSlugFree(items, input.slug, id);
        const item = { ...current, ...input, updatedAt: new Date().toISOString() } as T;
        return { items: items.map((i) => (i.id === id ? item : i)), result: item };
      }),

    patch: (id: string, changes: Partial<Input>) =>
      mutate((items) => {
        const current = items.find((i) => i.id === id);
        if (!current) return { items, result: null };
        const item = { ...current, ...changes, updatedAt: new Date().toISOString() } as T;
        return { items: items.map((i) => (i.id === id ? item : i)), result: item };
      }),

    remove: (id: string) =>
      mutate((items) => ({ items: items.filter((i) => i.id !== id), result: items.some((i) => i.id === id) })),
  };
}

const STAGE_ORDER = { LIVE: 0, IN_PROGRESS: 1, UPCOMING: 2 } as const;

const projectStore = collection<Project, ProjectInput>("projects.json");
const postStore = collection<Post, PostInput>("posts.json");

export const projects = {
  ...projectStore,
  /** Admin list: newest edits first. */
  list: async () => (await projectStore.all()).sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)),
  /** Public list: published only — featured first, then launched → in progress → coming soon. */
  published: async () =>
    (await projectStore.all())
      .filter((p) => p.status === "PUBLISHED")
      .sort(
        (a, b) =>
          Number(b.featured) - Number(a.featured) ||
          STAGE_ORDER[a.stage] - STAGE_ORDER[b.stage] ||
          b.createdAt.localeCompare(a.createdAt),
      ),
};

export const posts = {
  ...postStore,
  list: async () =>
    (await postStore.all()).sort((a, b) => b.publishedAt.localeCompare(a.publishedAt) || b.updatedAt.localeCompare(a.updatedAt)),
  /** Public list: published, dated today or earlier, newest first. Future dates act as scheduled posts. */
  published: async () => {
    const now = new Date().toISOString().slice(0, 10);
    return (await postStore.all())
      .filter((p) => p.status === "PUBLISHED" && p.publishedAt <= now)
      .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt) || b.createdAt.localeCompare(a.createdAt));
  },
};
