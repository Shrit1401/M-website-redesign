import Link from "next/link";
import { NAV, OWNER, SITE } from "@/lib/content";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-top">
        <img className="footer-wordmark" src="/brand/wordmark.png" alt="Farasha POS Solutions" width="600" height="225" loading="lazy" />
        <div className="footer-cols">
          <nav aria-label="Footer" className="footer-links">
            <p className="label label-mint">Product</p>
            {NAV.map((n) => <Link key={n.href} href={n.href}>{n.label}</Link>)}
            <Link href="/request-quote">Request a quote</Link>
          </nav>
          <div className="footer-links">
            <p className="label label-mint">Contact</p>
            <a href={`mailto:${SITE.contactEmail}`}>{SITE.contactEmail}</a>
            <a href={`mailto:${SITE.quotesEmail}`}>{SITE.quotesEmail}</a>
            <a href={SITE.liveOrdering} target="_blank" rel="noreferrer">order.farashapos.com ↗</a>
          </div>
        </div>
      </div>
      <div className="container footer-base">
        <span>© {new Date().getFullYear()} Farasha POS Solutions</span>
        <span>{SITE.positioning}</span>
        <span>Owned by <a href={OWNER.url} target="_blank" rel="noreferrer">{OWNER.name}</a></span>
      </div>
    </footer>
  );
}
