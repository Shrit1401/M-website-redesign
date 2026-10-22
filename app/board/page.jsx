import Link from "next/link";
import { Reveal, Words } from "@/components/Motion";
import { LeafButterfly } from "@/components/Butterfly";
import { Cta, PageHero } from "@/components/Sections";
import { BOARD, OWNER } from "@/lib/content";

export const metadata = {
  title: "Board",
  description: "Meet the board and advisors guiding Farasha POS Solutions, a Nebula Webtech LLC product, with restaurant, payments and technology experience.",
};

const initials = (name) => name.split(/\s+/).map((w) => w[0]).slice(0, 2).join("").toUpperCase();

export default function BoardPage() {
  return (
    <>
      <PageHero
        label="Board & advisors"
        title="The people | {behind Farasha.}"
        lede={`Farasha POS Solutions is owned and operated by ${OWNER.name}. Our board and advisors bring restaurant, payments and technology experience to every decision.`}
      />

      <section className="section light">
        <div className="container">
          <div className="section-head">
            <div>
              <Reveal><p className="label">Board members</p></Reveal>
              <Words className="display" text="Guided by | {operators.}" />
            </div>
            <Reveal delay={0.1}>
              <p className="section-intro">
                People who have run shops, moved payments and built software — keeping Farasha practical for the counter and the kitchen.
              </p>
            </Reveal>
          </div>
          <ul className="board-grid">
            {BOARD.map((m, i) => (
              <Reveal as="li" key={m.role} delay={(i % 3) * 0.08} className="board-card">
                <div className="board-photo" aria-hidden={!m.photo}>
                  {m.photo ? (
                    <img src={m.photo} alt={m.name} loading="lazy" />
                  ) : m.name ? (
                    <span>{initials(m.name)}</span>
                  ) : (
                    <LeafButterfly tone="brand" />
                  )}
                </div>
                <p className="label">{m.role}</p>
                <h3>{m.name ?? "To be announced"}</h3>
                {m.bio && <p>{m.bio}</p>}
              </Reveal>
            ))}
          </ul>
          <Reveal>
            <p className="board-join">
              Interested in serving on the board or as an advisor? <Link className="link" href="/contact">Get in touch</Link>.
            </p>
          </Reveal>
        </div>
      </section>

      <Cta />
    </>
  );
}
