import { Reveal } from "./Motion";
import { CONTAINER, PageHero } from "./Sections";
import type { LegalSection } from "@/lib/legal";
import { SITE } from "@/lib/site";

export function LegalPage({
  title,
  intro,
  sections,
}: {
  title: string;
  intro: string[];
  sections: LegalSection[];
}) {
  return (
    <>
      <PageHero eyebrow="Legal" crumbs={[{ label: title }]} lines={[title]} />
      <section className={`${CONTAINER} pb-24 sm:pb-32`}>
        <Reveal>
          <article className="prose-nebula max-w-3xl">
            {intro.map((p) => (
              <p key={p}>{p}</p>
            ))}
            {sections.map((s, i) => (
              <section key={s.title}>
                <h2>
                  {i + 1}. {s.title}
                </h2>
                {s.body?.map((p) => <p key={p}>{p}</p>)}
                {s.list && (
                  <ul>
                    {s.list.map((li) => (
                      <li key={li}>{li}</li>
                    ))}
                  </ul>
                )}
                {s.after?.map((p) => <p key={p}>{p}</p>)}
              </section>
            ))}
            <section>
              <h2>{sections.length + 1}. Contact Information</h2>
              <p>
                {SITE.name}
                <br />
                {SITE.address.street}
                <br />
                {SITE.address.city}, {SITE.address.region} {SITE.address.postal}
                <br />
                United States
              </p>
              <p>
                Email: <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
                <br />
                Phone: <a href={SITE.phoneHref}>{SITE.phone}</a>
              </p>
            </section>
          </article>
        </Reveal>
      </section>
    </>
  );
}
