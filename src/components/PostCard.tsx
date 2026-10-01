import Image from "next/image";
import Link from "next/link";
import type { Post } from "@/lib/posts";

export function formatDate(iso: string) {
  return new Date(`${iso}T12:00:00Z`).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

export function PostCard({ post, featured = false }: { post: Post; featured?: boolean }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className={`group flex h-full flex-col overflow-hidden rounded-3xl border border-line bg-white transition-shadow duration-500 hover:shadow-[0_30px_60px_-30px_rgba(0,119,181,0.45)] ${
        featured ? "lg:grid lg:grid-cols-[1.2fr_1fr]" : ""
      }`}
    >
      <div
        className={`relative overflow-hidden ${featured ? "aspect-[16/10] lg:aspect-auto lg:min-h-[26rem]" : "aspect-[16/10]"}`}
      >
        <Image
          src={post.image}
          alt=""
          fill
          sizes={
            featured ? "(min-width: 1024px) 60vw, 100vw" : "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          }
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <span className="absolute top-4 left-4 rounded-full bg-white/85 px-3 py-1 text-xs text-ink backdrop-blur">
          {post.category}
        </span>
      </div>
      <div className={`flex flex-1 flex-col p-7 ${featured ? "lg:justify-center lg:p-12" : ""}`}>
        <p className="text-xs text-muted">
          {formatDate(post.date)} · {post.readMinutes} min read
        </p>
        <h3
          className={`mt-3 font-medium tracking-tight text-ink transition-colors group-hover:text-brand ${
            featured ? "text-[clamp(1.8rem,3vw,2.6rem)] leading-[1.1]" : "text-xl leading-snug"
          }`}
        >
          {post.title}
        </h3>
        <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-muted">{post.excerpt}</p>
        <span className="mt-auto pt-6 text-sm font-medium text-brand">Read article →</span>
      </div>
    </Link>
  );
}
