const ROUTES = ["", "/apps", "/features", "/pilot", "/pricing", "/faq", "/request-quote", "/contact", "/board", "/donate", "/privacy", "/terms", "/refunds"];

export default function sitemap() {
  return ROUTES.map((path) => ({ url: `https://farashapos.com${path}`, changeFrequency: "monthly", priority: path ? 0.8 : 1 }));
}
