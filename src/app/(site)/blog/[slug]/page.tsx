import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Cover, PostCard, PostMeta } from "@/components/Content";
import { Icon } from "@/components/Icon";
import { JsonLd } from "@/components/JsonLd";
import { MaskLines, Reveal } from "@/components/Motion";
import { CONTAINER, FinalCta } from "@/components/Sections";
import { posts } from "@/lib/content/store";
import { renderMarkdown } from "@/lib/markdown";
import { SITE } from "@/lib/site";

export const revalidate = 3600;

async function getPublished(slug: string) {
  return (await posts.published()).find((p) => p.slug === slug) ?? null;
}

export async function generateStaticParams() {
  return (await posts.published()).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/blog/[slug]">): Promise<Metadata> {
  const post = await getPublished((await params).slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.excerpt,
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      authors: [post.author],
      ...(post.coverImage ? { images: [post.coverImage] } : {}),
    },
  };
}

export default async function PostPage({ params }: PageProps<"/blog/[slug]">) {
  const { slug } = await params;
  const post = await getPublished(slug);
  if (!post) notFound();

  const all = await posts.published();
  // Related: shares a tag first, then most recent.
  const related = all
    .filter((p) => p.id !== post.id)
    .sort((a, b) => Number(b.tags.some((t) => post.tags.includes(t))) - Number(a.tags.some((t) => post.tags.includes(t))))
    .slice(0, 3);
  const url = `${SITE.url}/blog/${slug}`;

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "BlogPosting",
              headline: post.title,
              description: post.excerpt,
              url,
              datePublished: post.publishedAt,
              dateModified: post.updatedAt,
              author: { "@type": "Person", name: post.author },
              publisher: { "@id": `${SITE.url}/#org` },
              mainEntityOfPage: url,
              ...(post.coverImage ? { image: new URL(post.coverImage, SITE.url).toString() } : {}),
              ...(post.tags.length ? { keywords: post.tags.join(", ") } : {}),
            },
            {
              "@type": "BreadcrumbList",
              itemListElement: [
                { "@type": "ListItem", position: 1, name: "Home", item: SITE.url },
                { "@type": "ListItem", position: 2, name: "Blog", item: `${SITE.url}/blog` },
                { "@type": "ListItem", position: 3, name: post.title, item: url },
              ],
            },
          ],
        }}
      />

      <article>
        <header className="relative isolate overflow-hidden pt-36 pb-14 sm:pt-44">
          <div aria-hidden className="nebula-wash absolute inset-0 -z-20" />
          <div aria-hidden className="starfield absolute inset-0 -z-10 opacity-60" />
          <div className={`${CONTAINER} max-w-4xl text-center`}>
            <nav aria-label="Breadcrumb" className="mb-8 flex justify-center">
              <Link href="/blog" className="inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-ink">
                <Icon name="arrowLeft" className="size-4" /> All posts
              </Link>
            </nav>
            <PostMeta post={post} className="justify-center" />
            <MaskLines
              as="h1"
              onMount
              delay={0.1}
              lines={[post.title]}
              className="mt-6 text-[clamp(2.2rem,5vw,4.2rem)] leading-[1.02] font-semibold tracking-[-0.04em] text-ink"
            />
            <Reveal delay={0.3}>
              <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-ink-soft">{post.excerpt}</p>
              <p className="mt-8 inline-flex items-center gap-3 text-sm text-ink-soft">
                <span className="grid size-9 place-items-center rounded-full bg-gradient-to-br from-violet/40 to-pink/30 font-semibold text-ink">
                  {post.author.charAt(0)}
                </span>
                {post.author}
              </p>
            </Reveal>
          </div>
        </header>

        <Reveal className={`${CONTAINER} max-w-6xl`}>
          <div className="card p-2">
            <Cover seed={post.slug} image={post.coverImage} className="aspect-[16/9] rounded-[1.25rem] sm:aspect-[2.2/1]" />
          </div>
        </Reveal>

        <div className={`${CONTAINER} max-w-3xl py-16 sm:py-20`}>
          <div className="prose-nebula" dangerouslySetInnerHTML={{ __html: renderMarkdown(post.body) }} />
          {post.tags.length > 0 && (
            <ul className="mt-14 flex flex-wrap gap-2 border-t border-white/[0.08] pt-8">
              {post.tags.map((t) => (
                <li key={t} className="rounded-full border border-white/10 px-3 py-1 text-xs text-muted">
                  {t}
                </li>
              ))}
            </ul>
          )}
        </div>
      </article>

      {related.length > 0 && (
        <section className={`${CONTAINER} pb-24 sm:pb-32`}>
          <p className="eyebrow">Keep reading</p>
          <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {related.map((p, i) => (
              <PostCard key={p.id} post={p} index={i} />
            ))}
          </div>
        </section>
      )}

      <FinalCta />
    </>
  );
}
