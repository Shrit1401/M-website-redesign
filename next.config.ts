import type { NextConfig } from "next";

// Old WordPress URLs that don't exist on the new site. Service, about, contact-us and legal
// pages keep their original paths, so they need no redirect.
const legacy = [
  { source: "/contact", destination: "/contact-us" },
  { source: "/html-sitemap", destination: "/sitemap.xml" },
  { source: "/home", destination: "/" },
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
