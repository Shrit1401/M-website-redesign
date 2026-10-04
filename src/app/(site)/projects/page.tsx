import type { Metadata } from "next";
import Link from "next/link";
import { EmptyOrbit, ProjectCard } from "@/components/Content";
import { Icon } from "@/components/Icon";
import { Reveal } from "@/components/Motion";
import { Accent, CONTAINER, FinalCta, PageHero } from "@/components/Sections";
import { PROJECT_STAGES, type ProjectStage } from "@/lib/content/schema";
import { projects } from "@/lib/content/store";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Websites, maintenance and digital marketing work by Nebula Webtech LLC — launched projects, work in progress and what's coming next.",
  alternates: { canonical: "/projects" },
};

const SECTION: Record<ProjectStage, { id: string; eyebrow: string; title: string }> = {
  LIVE: { id: "launched", eyebrow: "Launched", title: "Live and doing their job." },
  IN_PROGRESS: { id: "in-progress", eyebrow: "In progress", title: "On the workbench right now." },
  UPCOMING: { id: "coming-soon", eyebrow: "Coming soon", title: "On the horizon." },
};

export default async function ProjectsPage() {
  const all = await projects.published();
  const groups = PROJECT_STAGES.map((s) => ({ ...s, ...SECTION[s.value], items: all.filter((p) => p.stage === s.value) })).filter(
    (g) => g.items.length,
  );

  return (
    <>
      <PageHero
        eyebrow="Our work"
        crumbs={[{ label: "Projects" }]}
        lines={[
          "Work that's live —",
          <>
            and work on the <Accent>horizon.</Accent>
          </>,
        ]}
        intro="A look at the sites we've launched, what we're building now, and the projects about to take off."
      >
        {groups.length > 1 && (
          <Reveal delay={0.4}>
            <ul className="mt-10 flex flex-wrap gap-2">
              {groups.map((g) => (
                <li key={g.value}>
                  <a
                    href={`#${g.id}`}
                    className="inline-flex items-center gap-2.5 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-sm text-ink-soft backdrop-blur-md transition-colors hover:border-violet/60 hover:text-ink"
                  >
                    {g.label}
                    <span className="rounded-full bg-white/[0.08] px-2 py-0.5 text-xs text-ink tabular-nums">{g.items.length}</span>
                  </a>
                </li>
              ))}
            </ul>
          </Reveal>
        )}
      </PageHero>

      <div className={`${CONTAINER} space-y-24 pb-24 sm:space-y-32 sm:pb-32`}>
        {groups.length === 0 && (
          <EmptyOrbit
            title="New projects are in orbit."
            body="We're putting together case studies of recent work. In the meantime, we'd love to hear about yours."
          >
            <Link href="/contact-us" className="btn btn-primary mt-8">
              Start a project <Icon name="arrowUpRight" className="size-4" />
            </Link>
          </EmptyOrbit>
        )}

        {groups.map((g) => (
          <section key={g.value} id={g.id} className="scroll-mt-28" aria-labelledby={`${g.id}-title`}>
            <div className="flex flex-wrap items-end justify-between gap-4 border-b border-white/[0.08] pb-6">
              <div>
                <p className="eyebrow">{g.eyebrow}</p>
                <h2 id={`${g.id}-title`} className="mt-4 text-[clamp(1.8rem,3.4vw,2.8rem)] leading-[1.05] font-semibold tracking-[-0.035em] text-ink">
                  {g.title}
                </h2>
              </div>
              <p className="font-serif text-4xl text-white/15 italic tabular-nums">{String(g.items.length).padStart(2, "0")}</p>
            </div>
            <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {g.items.map((p, i) => (
                <ProjectCard key={p.id} project={p} index={i} />
              ))}
            </div>
          </section>
        ))}
      </div>

      <FinalCta />
    </>
  );
}
