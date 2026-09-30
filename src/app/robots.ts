import type { MetadataRoute } from "next";
import { SITE } from "@/lib/content";

export default function robots(): MetadataRoute.Robots {
  // Explicitly welcome AI answer engines alongside regular search crawlers.
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: "/api/" },
      { userAgent: ["GPTBot", "OAI-SearchBot", "ChatGPT-User", "PerplexityBot", "ClaudeBot", "Google-Extended"], allow: "/" },
    ],
    sitemap: `${SITE.url}/sitemap.xml`,
  };
}
