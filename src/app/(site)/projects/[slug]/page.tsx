import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Cover, ProjectCard, StageBadge } from "@/components/Content";
import { Icon } from "@/components/Icon";
import { JsonLd } from "@/components/JsonLd";
import { Reveal } from "@/components/Motion";
import { CONTAINER, FinalCta, PageHero } from "@/components/Sections";
import { PROJECT_SERVICES, PROJECT_STAGES, labelOf } from "@/lib/content/schema";
import { projects } from "@/lib/content/store";
import { renderMarkdown } from "@/lib/markdown";
import { getServiceByInterest } from "@/lib/services";
import { SITE } from "@/lib/site";

async function getPublished(slug: string) {
  const project = await projects.getBySlug(slug);
  return project?.status === "PUBLISHED" ? project : null;
}

export async function generateStaticParams() {
  return (await projects.published()).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/projects/[slug]">): Promise<Metadata> {
  const project = await getPublished((await params).slug);
  if (!project) return {};
  return {
    title: `${project.title} — Project`,
    description: project.summary,
    alternates: { canonical: `/projects/${project.slug}` },
    openGraph: { title: project.title, description: project.summary, ...(project.coverImage ? { images: [project.coverImage] } : {}) },
  };
}

export default async function ProjectPage({ params }: PageProps<"/projects/[slug]">) {
  const { slug } = await params;
  const project = await getPublished(slug);
  if (!project) notFound();

  const others = (await projects.published()).filter((p) => p.id !== project.id).slice(0, 3);
  const url = `${SITE.url}/projects/${slug}`;
  const meta = [
    { label: "Client", value: project.client },
    { label: "Service", value: labelOf(PROJECT_SERVICES, project.service), href: `/services/${getServiceByInterest(project.service)?.slug ?? ""}` },
    { label: project.stage === "LIVE" ? "Year" : "Timeline", value: project.year },
    { label: "Status", value: labelOf(PROJECT_STAGES, project.stage) },
  ].filter((m) => m.value);

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "CreativeWork",
              name: project.title,
              description: project.summary,
              url,
              creator: { "@id": `${SITE.url}/#org` },
              ...(project.coverImage ? { image: new URL(project.coverImage, SITE.url).toString() } : {}),
              ...(project.tags.length ? { keywords: project.tags.join(", ") } : {}),
            },
            {
              "@type": "BreadcrumbList",
              itemListElement: [
                { "@type": "ListItem", position: 1, name: "Home", item: SITE.url },
                { "@type": "ListItem", position: 2, name: "Projects", item: `${SITE.url}/projects` },
                { "@type": "ListItem", position: 3, name: project.title, item: url },
              ],
            },
          ],
        }}
      />

      <PageHero
        eyebrow={labelOf(PROJECT_SERVICES, project.service)}
        crumbs={[{ label: "Projects", href: "/projects" }, { label: project.title }]}
        lines={[project.title]}
        intro={project.summary}
      >
        <Reveal delay={0.4}>
          <div className="mt-10 flex flex-wrap items-center gap-3">
            <StageBadge stage={project.stage} className="py-2 text-sm" />
            {project.liveUrl && project.stage === "LIVE" && (
              <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                Visit the live site <Icon name="arrowUpRight" className="size-4" />
              </a>
            )}
          </div>
        </Reveal>
      </PageHero>

      <section className={`${CONTAINER} pb-20`}>
        <Reveal>
          <div className="card p-2">
            <Cover seed={project.slug} image={project.coverImage} className="aspect-[16/9] rounded-[1.25rem] sm:aspect-[21/9]" />
          </div>
        </Reveal>
      </section>

      <section className={`${CONTAINER} grid gap-12 pb-24 sm:pb-32 lg:grid-cols-[0.7fr_1.3fr] lg:gap-20`}>
        <aside className="lg:sticky lg:top-32 lg:self-start">
          <Reveal>
            <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-white/[0.08] bg-white/[0.08]">
              {meta.map((m) => (
                <div key={m.label} className="bg-bg p-5">
                  <dt className="text-xs tracking-[0.18em] text-muted uppercase">{m.label}</dt>
                  <dd className="mt-2 text-ink">
                    {m.href ? (
                      <Link href={m.href} className="hover:text-violet">
                        {m.value}
                      </Link>
                    ) : (
                      m.value
                    )}
                  </dd>
                </div>
              ))}
            </dl>
            {project.tags.length > 0 && (
              <ul className="mt-6 flex flex-wrap gap-2">
                {project.tags.map((t) => (
                  <li key={t} className="rounded-full border border-white/10 px-3 py-1 text-xs text-muted">
                    {t}
                  </li>
                ))}
              </ul>
            )}
          </Reveal>
        </aside>

        <Reveal delay={0.1}>
          {project.body ? (
            <article className="prose-nebula max-w-3xl" dangerouslySetInnerHTML={{ __html: renderMarkdown(project.body) }} />
          ) : (
            <p className="text-lg leading-relaxed text-ink-soft">
              {project.stage === "UPCOMING"
                ? "This project is still on the launch pad. Check back soon for the full story."
                : "The full case study is on its way."}
            </p>
          )}
        </Reveal>
      </section>

      {others.length > 0 && (
        <section className={`${CONTAINER} pb-24 sm:pb-32`}>
          <div className="flex items-end justify-between gap-4">
            <p className="eyebrow">More projects</p>
            <Link href="/projects" className="inline-flex items-center gap-2 text-sm font-semibold text-violet hover:text-ink">
              All projects <Icon name="arrowRight" className="size-4" />
            </Link>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {others.map((p, i) => (
              <ProjectCard key={p.id} project={p} index={i} />
            ))}
          </div>
        </section>
      )}

      <FinalCta />
    </>
  );
}
