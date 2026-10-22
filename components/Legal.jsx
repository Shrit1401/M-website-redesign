import { PageHero } from "./Sections";
import { LEGAL_UPDATED } from "@/lib/legal";

/** Shared layout for the Privacy, Terms and Refund pages. */
export default function Legal({ label, title, lede, sections }) {
  return (
    <>
      <PageHero label={label} title={title} lede={lede} />
      <section className="section light">
        <div className="container legal">
          <p className="label">Last updated {LEGAL_UPDATED}</p>
          {sections.map((s) => (
            <div key={s.h} className="legal-block">
              <h2>{s.h}</h2>
              {s.p.map((t) => <p key={t}>{t}</p>)}
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
