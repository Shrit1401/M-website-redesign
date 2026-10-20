import Link from "next/link";
import { QuoteForm } from "@/components/Forms";
import { PageHero } from "@/components/Sections";
import { OWNER, SITE } from "@/lib/content";

export const metadata = {
  title: "Request a quote",
  description: "Tell us how many locations and devices you run. We’ll come back with a clear quote and a pilot plan within one business day.",
};

export default function QuotePage() {
  return (
    <>
      <PageHero
        label="Request a quote"
        title="Tell us about | {your shops.}"
        lede="Share how many locations and devices you run and what you use today. We’ll come back with a clear quote and a pilot plan."
      />
      <section className="section section-tight light">
        <div className="container form-wrap">
          <aside className="form-aside">
            <p className="label">How pricing works</p>
            <h2>Per location, no long-term commitment.</h2>
            <p>
              A one-time setup is credited toward your first year if you continue after the pilot. Device counts
              help us plan hardware and training — you only buy what’s been proven with your setup.
            </p>
            <ul className="checklist">
              <li>Reply within one business day</li>
              <li>Runs on tablets and PCs you already own</li>
              <li>Your data is exportable, always</li>
            </ul>
            <p>
              Prefer email? <a className="link" href={`mailto:${SITE.quotesEmail}`}>{SITE.quotesEmail}</a>
              <br />
              General questions? <Link className="link" href="/contact">Contact us</Link>
            </p>
            <p className="label label-ink" style={{ marginTop: 28 }}>Owned by {OWNER.name}</p>
          </aside>
          <QuoteForm />
        </div>
      </section>
    </>
  );
}
