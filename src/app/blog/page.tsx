import type { Metadata } from "next";
import { Reveal } from "@/components/Motion";
import { Accent, PageHero } from "@/components/PageHero";
import { PostCard } from "@/components/PostCard";
import { FinalCta } from "@/components/Sections";
import { POSTS } from "@/lib/posts";

export const metadata: Metadata = {
  title: "Blog — Insights & Trends",
  description: "Practical insights on SaaS, cloud solutions, IT infrastructure, custom software and DevOps.",
};

export default function BlogPage() {
  const [featured, second, ...rest] = POSTS;
  return (
    <>
      <PageHero
        eyebrow="Blog"
        crumbs={[{ label: "Blog" }]}
        lines={["Insights", <Accent key="a">& trends.</Accent>]}
        intro="Stay ahead with the latest updates in SaaS, cloud solutions, and IT advancements."
      />
      <section className="mx-auto max-w-[1400px] px-5 py-24 sm:px-10">
        <Reveal>
          <PostCard post={featured} featured />
        </Reveal>
        <Reveal className="mt-6">
          <PostCard post={second} featured />
        </Reveal>
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {rest.map((p, i) => (
            <Reveal key={p.slug} delay={(i % 3) * 0.08} className="h-full">
              <PostCard post={p} />
            </Reveal>
          ))}
        </div>
      </section>
      <FinalCta />
    </>
  );
}
