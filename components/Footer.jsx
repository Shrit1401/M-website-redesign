import Link from "next/link";
import { FOOTER_COLS, OWNER, SITE } from "@/lib/content";
import { LEGAL_LINKS } from "@/lib/legal";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-top">
        <div className="footer-brand">
          <img className="footer-wordmark" src="/brand/wordmark.png" alt="Farasha POS Solutions" width="600" height="225" loading="lazy" />
          <p>{SITE.description}</p>
          <p className="footer-owner">
            A product owned by <a href={OWNER.url} target="_blank" rel="noreferrer">{OWNER.name}</a>
          </p>
        </div>
        <div className="footer-cols">
          {FOOTER_COLS.map((col) => (
            <nav key={col.title} aria-label={col.title} className="footer-links">
              <p className="label label-mint">{col.title}</p>
              {col.links.map((l) =>
                l.external || !l.href.startsWith("/") ? (
                  <a key={l.label} href={l.href} {...(l.external ? { target: "_blank", rel: "noreferrer" } : {})}>{l.label}</a>
                ) : (
                  <Link key={l.label} href={l.href}>{l.label}</Link>
                )
              )}
            </nav>
          ))}
        </div>
      </div>
      <div className="container footer-base">
        <span>© {new Date().getFullYear()} {OWNER.name}. All rights reserved.</span>
        <nav aria-label="Legal" className="footer-legal">
          {LEGAL_LINKS.map((l) => <Link key={l.href} href={l.href}>{l.label}</Link>)}
        </nav>
        <span>{SITE.positioning}</span>
      </div>
    </footer>
  );
}
