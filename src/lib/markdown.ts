import { Marked } from "marked";
import { isSafeUrl } from "./content/schema";

/**
 * Markdown → HTML for project write-ups and blog posts (rendered inside `.prose-nebula`).
 *
 * Safe to inject without a sanitizer: raw HTML in the source is escaped, not rendered, and links and
 * images only accept http(s) URLs, site paths and #anchors. Used on the server for public pages and in
 * the browser for the admin editor's preview, so both always match.
 */

const escape = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");

const okHref = (href: string) => href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:") || isSafeUrl(href);

const marked = new Marked({
  gfm: true,
  breaks: false,
  renderer: {
    html({ text }) {
      return escape(text);
    },
    link({ href, title, tokens }) {
      const text = this.parser.parseInline(tokens);
      if (!okHref(href)) return text;
      const external = /^https?:\/\//.test(href) && !href.startsWith("https://nebulawebtech.com");
      return `<a href="${escape(href)}"${title ? ` title="${escape(title)}"` : ""}${
        external ? ' target="_blank" rel="noopener noreferrer"' : ""
      }>${text}</a>`;
    },
    image({ href, title, text }) {
      if (!isSafeUrl(href)) return escape(text);
      return `<img src="${escape(href)}" alt="${escape(text)}" loading="lazy" decoding="async"${
        title ? ` title="${escape(title)}"` : ""
      } />`;
    },
  },
});

export function renderMarkdown(source: string): string {
  return marked.parse(source, { async: false });
}
