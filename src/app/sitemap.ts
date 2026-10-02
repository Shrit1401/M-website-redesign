import type { MetadataRoute } from "next";
import { SERVICES } from "@/lib/services";
import { SITE } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["", "/about", "/services", "/contact-us", "/make-a-payment", "/privacy-policy", "/terms-and-conditions"].map(
    (p) => ({
      url: `${SITE.url}${p}`,
      changeFrequency: "monthly" as const,
      priority: p === "" ? 1 : p.includes("polic") || p.includes("terms") ? 0.3 : 0.8,
    }),
  );
  const services = SERVICES.map((s) => ({ url: `${SITE.url}/services/${s.slug}`, priority: 0.9 }));
  return [...pages, ...services];
}
