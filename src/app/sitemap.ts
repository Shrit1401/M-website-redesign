import type { MetadataRoute } from "next";
import { posts, projects } from "@/lib/content/store";
import { SERVICES } from "@/lib/services";
import { SITE } from "@/lib/site";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const pages = [
    "",
    "/about",
    "/services",
    "/projects",
    "/blog",
    "/contact-us",
    "/make-a-payment",
    "/privacy-policy",
    "/terms-and-conditions",
  ].map((p) => ({
    url: `${SITE.url}${p}`,
    changeFrequency: "monthly" as const,
    priority: p === "" ? 1 : p.includes("polic") || p.includes("terms") ? 0.3 : 0.8,
  }));
  const services = SERVICES.map((s) => ({ url: `${SITE.url}/services/${s.slug}`, priority: 0.9 }));
  const work = (await projects.published()).map((p) => ({
    url: `${SITE.url}/projects/${p.slug}`,
    lastModified: p.updatedAt,
    priority: 0.7,
  }));
  const articles = (await posts.published()).map((p) => ({
    url: `${SITE.url}/blog/${p.slug}`,
    lastModified: p.updatedAt,
    priority: 0.6,
  }));
  return [...pages, ...services, ...work, ...articles];
}
