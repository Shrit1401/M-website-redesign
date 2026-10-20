const ROUTES = ["", "/apps", "/features", "/pilot", "/faq", "/request-quote", "/contact"];

export default function sitemap() {
  return ROUTES.map((path) => ({ url: `https://farashapos.com${path}`, changeFrequency: "monthly", priority: path ? 0.8 : 1 }));
}
