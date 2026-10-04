import Link from "next/link";
import { PROJECT_SERVICES, PROJECT_STAGES, labelOf, readingMinutes, type Post, type Project, type ProjectStage } from "@/lib/content/schema";
import { Icon } from "./Icon";
import { Reveal, Spotlight } from "./Motion";

/* Display pieces for projects and blog posts. See docs/design/05-components.md#content-cards. */

/** "2026-10-04" → "Oct 4, 2026". Parsed as UTC so the day never shifts with the server's timezone. */
export function formatDate(iso: string) {
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" }).format(
    new Date(iso.length === 10 ? `${iso}T00:00:00Z` : iso),
  );
}

/* ------------------------------------------------------------------- cover */

// Pairs of glow colours, all from the brand palette (violet, pink, star blue, deep brand violet).
const GLOWS = [
  ["rgb(166 123 255 / 0.55)", "rgb(240 106 200 / 0.35)"],
  ["rgb(110 60 220 / 0.6)", "rgb(143 216 255 / 0.25)"],
  ["rgb(240 106 200 / 0.45)", "rgb(73 34 109 / 0.8)"],
  ["rgb(143 216 255 / 0.3)", "rgb(166 123 255 / 0.5)"],
] as const;

function seeded(text: string) {
  let h = 2166136261;
  for (const ch of text) h = Math.imul(h ^ ch.charCodeAt(0), 16777619);
  let s = h >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Cover art for a project or post. Uses `image` when set; otherwise draws a small nebula — glow,
 * stars and a tilted orbit — seeded by the slug, so each item has its own stable artwork.
 */
export function Cover({ seed, image, className = "" }: { seed: string; image?: string; className?: string }) {
  if (image) {
    return (
      <div className={`relative overflow-hidden bg-surface ${className}`}>
        {/* Admin-entered URLs can point anywhere, so a plain <img> avoids next/image remotePatterns. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={image} alt="" loading="lazy" decoding="async" className="absolute inset-0 size-full object-cover" />
      </div>
    );
  }
  const r = seeded(seed);
  const [a, b] = GLOWS[Math.floor(r() * GLOWS.length)];
  const x = 25 + r() * 50;
  const y = 30 + r() * 40;
  const ring = 70 + r() * 50;
  const tilt = -35 + r() * 70;
  return (
    <div aria-hidden className={`relative isolate overflow-hidden bg-surface ${className}`}>
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(38% 48% at ${x}% ${y}%, ${a}, transparent 70%), radial-gradient(55% 65% at ${100 - x}% ${100 - y}%, ${b}, transparent 70%)`,
        }}
      />
      <div className="starfield absolute inset-0 opacity-80" />
      <div className="absolute" style={{ left: `${x}%`, top: `${y}%`, width: `${ring}%`, transform: `translate(-50%, -50%) rotate(${tilt}deg)` }}>
        <div className="aspect-[2.4/1] w-full rounded-[50%] border border-white/15" />
        <span className="absolute top-1/2 -left-1 size-2 -translate-y-1/2 rounded-full bg-white shadow-[0_0_14px_4px_rgb(166_123_255/0.8)]" />
      </div>
      <div
        className="absolute size-[18%] min-w-10 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle_at_35%_35%,#ffe6f8,rgb(240_106_200/0.6)_40%,transparent_70%)] blur-[2px]"
        style={{ left: `${x}%`, top: `${y}%` }}
      />
    </div>
  );
}

/* ------------------------------------------------------------- stage badge */

const STAGE_DOT: Record<ProjectStage, string> = {
  LIVE: "bg-signal shadow-[0_0_8px_var(--signal)]",
  IN_PROGRESS: "bg-warn shadow-[0_0_8px_var(--warn)] animate-pulse",
  UPCOMING: "bg-violet shadow-[0_0_8px_var(--violet)]",
};

export function StageBadge({ stage, className = "" }: { stage: ProjectStage; className?: string }) {
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border border-white/10 bg-bg/60 px-3 py-1 text-xs text-ink-soft backdrop-blur-md ${className}`}
    >
      <span className={`size-1.5 rounded-full ${STAGE_DOT[stage]}`} />
      {labelOf(PROJECT_STAGES, stage)}
    </span>
  );
}

/* ------------------------------------------------------------ project card */

export function ProjectCard({ project, index = 0, large = false }: { project: Project; index?: number; large?: boolean }) {
  return (
    <Reveal delay={(index % 3) * 0.08} className="h-full">
      <Spotlight className="spot card group h-full overflow-hidden transition-colors duration-500 hover:border-violet/40">
        <Link href={`/projects/${project.slug}`} className="flex h-full flex-col">
          <div className="relative p-2">
            <Cover
              seed={project.slug}
              image={project.coverImage}
              className={`rounded-[1.1rem] ${large ? "aspect-[16/9]" : "aspect-[4/3]"} transition-transform duration-700 group-hover:scale-[1.015]`}
            />
            <StageBadge stage={project.stage} className="absolute top-5 left-5" />
            {project.featured && (
              <span className="absolute top-5 right-5 grid size-8 place-items-center rounded-full border border-white/10 bg-bg/60 text-violet backdrop-blur-md">
                <Icon name="star" className="size-3.5" />
                <span className="sr-only">Featured</span>
              </span>
            )}
          </div>
          <div className="flex flex-1 flex-col px-6 pt-4 pb-7 sm:px-8">
            <p className="flex flex-wrap items-center gap-x-2 text-xs tracking-[0.16em] text-muted uppercase">
              {labelOf(PROJECT_SERVICES, project.service)}
              {project.year && (
                <>
                  <span aria-hidden>·</span> {project.year}
                </>
              )}
            </p>
            <h3 className={`mt-3 font-semibold tracking-tight text-ink ${large ? "text-3xl" : "text-2xl"}`}>{project.title}</h3>
            {project.client && <p className="mt-1 text-sm text-violet">{project.client}</p>}
            <p className="mt-3 flex-1 leading-relaxed text-ink-soft">{project.summary}</p>
            <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-ink">
              {project.stage === "UPCOMING" ? "Preview" : "View project"}
              <span className="grid size-8 place-items-center rounded-full border border-white/15 transition-all duration-500 group-hover:rotate-45 group-hover:border-violet group-hover:bg-violet group-hover:text-[#12091f]">
                <Icon name="arrowUpRight" className="size-4" />
              </span>
            </span>
          </div>
        </Link>
      </Spotlight>
    </Reveal>
  );
}

/* --------------------------------------------------------------- post card */

export function PostMeta({ post, className = "" }: { post: Post; className?: string }) {
  return (
    <p className={`flex flex-wrap items-center gap-x-2 text-xs tracking-[0.16em] text-muted uppercase ${className}`}>
      <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
      <span aria-hidden>·</span>
      {readingMinutes(post.body)} min read
    </p>
  );
}

export function PostCard({ post, index = 0, large = false }: { post: Post; index?: number; large?: boolean }) {
  return (
    <Reveal delay={(index % 3) * 0.08} className="h-full">
      <Link
        href={`/blog/${post.slug}`}
        className={`group card flex h-full overflow-hidden transition-colors duration-500 hover:border-violet/40 ${
          large ? "flex-col lg:grid lg:grid-cols-[1.15fr_1fr]" : "flex-col"
        }`}
      >
        <div className="p-2">
          <Cover
            seed={post.slug}
            image={post.coverImage}
            className={`rounded-[1.1rem] transition-transform duration-700 group-hover:scale-[1.015] ${
              large ? "aspect-[16/10] lg:aspect-auto lg:h-full lg:min-h-80" : "aspect-[16/10]"
            }`}
          />
        </div>
        <div className={`flex flex-1 flex-col px-6 pt-4 pb-7 sm:px-8 ${large ? "lg:justify-center lg:p-12" : ""}`}>
          <PostMeta post={post} />
          <h3
            className={`mt-3 font-semibold tracking-tight text-ink transition-colors group-hover:text-white ${
              large ? "text-[clamp(1.8rem,3vw,2.6rem)] leading-[1.08] tracking-[-0.03em]" : "text-xl leading-snug"
            }`}
          >
            {post.title}
          </h3>
          <p className={`mt-3 leading-relaxed text-ink-soft ${large ? "text-lg" : "line-clamp-3 flex-1 text-sm"}`}>{post.excerpt}</p>
          {post.tags.length > 0 && (
            <ul className="mt-6 flex flex-wrap gap-2">
              {post.tags.slice(0, 3).map((t) => (
                <li key={t} className="rounded-full border border-white/10 px-3 py-1 text-xs text-muted">
                  {t}
                </li>
              ))}
            </ul>
          )}
        </div>
      </Link>
    </Reveal>
  );
}

/** Empty state for list pages before anything is published. */
export function EmptyOrbit({ title, body, children }: { title: string; body: string; children?: React.ReactNode }) {
  return (
    <div className="relative isolate overflow-hidden rounded-[2rem] border border-dashed border-white/15 px-6 py-20 text-center">
      <div aria-hidden className="starfield absolute inset-0 -z-10 opacity-60" />
      <div aria-hidden className="relative mx-auto size-24">
        <div className="absolute inset-[30%] rounded-full bg-[radial-gradient(circle,rgb(240_106_200/0.5),transparent_70%)]" />
        <div className="orbit-spin absolute inset-0 rounded-full border border-white/10 [animation-duration:12s]">
          <span className="absolute top-1/2 -left-1.5 size-3 -translate-y-1/2 rounded-full bg-violet shadow-[0_0_20px_4px_rgb(166_123_255/0.7)]" />
        </div>
      </div>
      <h2 className="mt-8 text-2xl font-semibold tracking-tight text-ink">{title}</h2>
      <p className="mx-auto mt-2 max-w-md text-ink-soft">{body}</p>
      {children}
    </div>
  );
}
