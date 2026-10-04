import type { Metadata } from "next";
import { EmptyOrbit, PostCard } from "@/components/Content";
import { NewsletterForm } from "@/components/Forms";
import { Reveal } from "@/components/Motion";
import { Accent, CONTAINER, FinalCta, PageHero } from "@/components/Sections";
import { posts } from "@/lib/content/store";

export const metadata: Metadata = {
  title: "Blog",
  description: "Web design, development, maintenance and digital marketing advice from the Nebula Webtech team in Palatine, IL.",
  alternates: { canonical: "/blog" },
};

// Posts dated in the future go live on their date; re-check hourly.
export const revalidate = 3600;

export default async function BlogPage() {
  const [lead, ...rest] = await posts.published();

  return (
    <>
      <PageHero
        eyebrow="Blog"
        crumbs={[{ label: "Blog" }]}
        lines={[
          "Notes from",
          <>
            the <Accent>studio.</Accent>
          </>,
        ]}
        intro="Practical advice on websites, search and marketing — what we're learning while building for our clients."
      />

      <section className={`${CONTAINER} pb-24 sm:pb-32`}>
        {!lead ? (
          <EmptyOrbit title="The first posts are on their way." body="Subscribe and we'll let you know when they land.">
            <div className="mx-auto mt-8 max-w-sm text-left">
              <NewsletterForm />
            </div>
          </EmptyOrbit>
        ) : (
          <>
            <PostCard post={lead} large />
            {rest.length > 0 && (
              <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {rest.map((p, i) => (
                  <PostCard key={p.id} post={p} index={i} />
                ))}
              </div>
            )}
            <Reveal>
              <div className="mt-16 grid gap-6 rounded-3xl border border-white/[0.08] bg-surface/60 p-8 sm:p-10 lg:grid-cols-[1fr_auto] lg:items-center">
                <div>
                  <p className="text-xl font-semibold tracking-tight text-ink">Get new posts by email</p>
                  <p className="mt-1 text-ink-soft">A short note when we publish. Unsubscribe any time.</p>
                </div>
                <div className="w-full lg:w-96">
                  <NewsletterForm />
                </div>
              </div>
            </Reveal>
          </>
        )}
      </section>

      <FinalCta />
    </>
  );
}
