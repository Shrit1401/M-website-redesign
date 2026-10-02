import type { MetadataRoute } from "next";
import { SITE } from "@/lib/content";
import { POSTS } from "@/lib/posts";
import { SERVICES } from "@/lib/services";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["", "/about", "/services", "/blog", "/careers", "/career", "/faq", "/contact"].map((p) => ({
    url: `${SITE.url}${p}`,
    changeFrequency: "monthly" as const,
    priority: p === "" ? 1 : 0.8,
  }));
  const services = SERVICES.map((s) => ({ url: `${SITE.url}/services/${s.slug}`, priority: 0.7 }));
  const posts = POSTS.map((p) => ({ url: `${SITE.url}/blog/${p.slug}`, lastModified: p.date, priority: 0.5 }));
  return [...pages, ...services, ...posts];
}
