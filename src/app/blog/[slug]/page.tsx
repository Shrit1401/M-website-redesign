import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Icon } from "@/components/Icon";
import { JsonLd } from "@/components/JsonLd";
import { MaskLines, Reveal } from "@/components/Motion";
import { PostCard, formatDate } from "@/components/PostCard";
import { FinalCta } from "@/components/Sections";
import { SITE } from "@/lib/content";
import { POSTS, getPost } from "@/lib/posts";
import { getService } from "@/lib/services";

export function generateStaticParams() {
  return POSTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/blog/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: { type: "article", images: [post.image], publishedTime: post.date },
  };
}

export default async function PostPage({ params }: PageProps<"/blog/[slug]">) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const service = post.service ? getService(post.service) : undefined;
  const more = POSTS.filter((p) => p.slug !== slug).slice(0, 3);

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          headline: post.title,
          description: post.excerpt,
          datePublished: post.date,
          image: `${SITE.url}${post.image}`,
          url: `${SITE.url}/blog/${post.slug}`,
          author: { "@id": `${SITE.url}/#org` },
          publisher: { "@id": `${SITE.url}/#org` },
        }}
      />

      <article>
        <header className="mx-auto max-w-4xl px-5 pt-36 text-center sm:px-10">
          <Reveal y={8}>
            <nav aria-label="Breadcrumb" className="flex justify-center gap-2 text-xs text-muted">
              <Link href="/" className="hover:text-brand">
                Home
              </Link>
              <span className="text-ink/20">/</span>
              <Link href="/blog" className="hover:text-brand">
                Blog
              </Link>
            </nav>
            <p className="mt-8 inline-flex rounded-full bg-brand-soft px-3 py-1 text-xs text-brand">{post.category}</p>
          </Reveal>
          <MaskLines
            as="h1"
            onMount
            delay={0.1}
            className="mt-6 text-[clamp(2.2rem,5vw,4.2rem)] leading-[1.02] font-medium tracking-[-0.04em] text-ink"
            lines={[post.title]}
          />
          <Reveal delay={0.3}>
            <p className="mt-6 flex items-center justify-center gap-4 text-sm text-muted">
              <span className="flex items-center gap-1.5">
                <Icon name="calendar" className="size-4" /> {formatDate(post.date)}
              </span>
              <span className="flex items-center gap-1.5">
                <Icon name="clock" className="size-4" /> {post.readMinutes} min read
              </span>
            </p>
          </Reveal>
        </header>

        <Reveal delay={0.2} className="mx-auto mt-14 max-w-6xl px-5 sm:px-10">
          <div className="relative aspect-[16/8] overflow-hidden rounded-[2rem]">
            <Image
              src={post.image}
              alt=""
              fill
              priority
              sizes="(min-width: 1152px) 1152px, 100vw"
              className="object-cover"
            />
          </div>
        </Reveal>

        <div className="prose-macro mx-auto max-w-3xl px-5 py-16 sm:px-10">
          {post.body.map((b, i) => {
            if (b.type === "h2") return <h2 key={i}>{b.text}</h2>;
            if (b.type === "ul")
              return (
                <ul key={i}>
                  {b.items.map((it) => (
                    <li key={it}>{it}</li>
                  ))}
                </ul>
              );
            if (b.type === "quote") return <blockquote key={i}>{b.text}</blockquote>;
            return (
              <p key={i} className={i === 0 ? "!text-xl !leading-relaxed !text-ink" : undefined}>
                {b.text}
              </p>
            );
          })}

          {service && (
            <Link
              href={`/services/${service.slug}`}
              className="group mt-14 flex items-center gap-5 rounded-3xl border border-line bg-white p-6 no-underline transition-colors hover:border-brand/40"
            >
              <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-brand text-white">
                <Icon name={service.icon} className="size-5" />
              </span>
              <span className="flex-1">
                <span className="block text-xs tracking-[0.2em] text-muted uppercase">Related service</span>
                <span className="mt-1 block font-medium text-ink group-hover:text-brand">{service.title}</span>
              </span>
              <Icon name="arrowUpRight" className="size-5 text-brand" />
            </Link>
          )}
        </div>
      </article>

      <section className="mx-auto max-w-[1400px] px-5 pb-24 sm:px-10">
        <p className="text-xs tracking-[0.2em] text-muted uppercase">Keep reading</p>
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {more.map((p) => (
            <PostCard key={p.slug} post={p} />
          ))}
        </div>
      </section>

      <FinalCta />
    </>
  );
}
