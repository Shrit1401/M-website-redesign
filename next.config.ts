import type { NextConfig } from "next";
import { POSTS } from "./src/lib/posts";
import { SERVICES } from "./src/lib/services";

// Keep links and search rankings from the old WordPress site working.
const legacy = [
  { source: "/about-us", destination: "/about" },
  { source: "/contact-us", destination: "/contact" },
  { source: "/pricing", destination: "/quote" },
  { source: "/testimonials", destination: "/about" },
  { source: "/html-sitemap", destination: "/sitemap.xml" },
  ...SERVICES.map((s) => ({ source: `/${s.slug}`, destination: `/services/${s.slug}` })),
  ...POSTS.map((p) => ({ source: `/${p.slug}`, destination: `/blog/${p.slug}` })),
];

const nextConfig: NextConfig = {
  async redirects() {
    return legacy.flatMap((r) => [
      { ...r, permanent: true },
      { source: `${r.source}/`, destination: r.destination, permanent: true },
    ]);
  },
};

export default nextConfig;
