import { DonateForm } from "@/components/Forms";
import { PageHero } from "@/components/Sections";
import { DONATION_TYPES, OWNER, SITE } from "@/lib/content";

export const metadata = {
  title: "Donate",
  description: "Support Farasha POS Solutions: choose general, monthly, restaurant fund, tribute or hardware giving, then continue to a secure payment page.",
};

export default function DonatePage() {
  return (
    <>
      <PageHero
        label="Donate"
        title="Help more shops | {take flight.}"
        lede="Choose the kind of donation you’d like to make, and we’ll take you straight to the right place to give."
      />
      <section className="section section-tight light">
        <div className="container form-wrap">
          <aside className="form-aside">
            <p className="label">Ways to give</p>
            <h2>Every gift has a home.</h2>
            <ul className="donate-types">
              {DONATION_TYPES.map((t) => (
                <li key={t.value}>
                  <strong>{t.label}</strong>
                  <span>{t.body}</span>
                </li>
              ))}
            </ul>
            <p>
              Questions about a gift? Email <a className="link" href={`mailto:${SITE.contactEmail}`}>{SITE.contactEmail}</a> or
              call {OWNER.phone}.
            </p>
          </aside>
          <DonateForm />
        </div>
      </section>
    </>
  );
}
