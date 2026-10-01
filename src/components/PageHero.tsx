import Link from "next/link";
import { MaskLines, Reveal } from "./Motion";

type Crumb = { label: string; href?: string };

/**
 * Inner-page hero: a light take on the live site's blue banner — soft brand light, grid and
 * a glass panel for the intro copy.
 */
export function PageHero({
  eyebrow,
  lines,
  intro,
  crumbs = [],
  children,
}: {
  eyebrow: string;
  lines: React.ReactNode[];
  intro?: string;
  crumbs?: Crumb[];
  children?: React.ReactNode;
}) {
  const trail: Crumb[] = [{ label: "Home", href: "/" }, ...crumbs];
  return (
    <section className="relative isolate overflow-hidden px-3 pt-24 sm:px-6">
      <div className="page-hero relative isolate mx-auto max-w-[1400px] overflow-hidden rounded-[2rem] border border-white px-6 pt-16 pb-14 sm:px-12 sm:pt-24 sm:pb-20">
        <div aria-hidden className="page-hero-beam" />
        <div aria-hidden className="glass-stack">
          <span />
          <span />
          <span />
        </div>
        <div aria-hidden className="hero-grid absolute inset-0 -z-10" />
        <Reveal y={8}>
          <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-xs text-muted">
            {trail.map((c, i) => (
              <span key={c.label} className="flex items-center gap-2">
                {c.href && i < trail.length - 1 ? (
                  <Link href={c.href} className="hover:text-brand">
                    {c.label}
                  </Link>
                ) : (
                  <span aria-current="page" className="text-ink-soft">
                    {c.label}
                  </span>
                )}
                {i < trail.length - 1 && <span className="text-ink/20">/</span>}
              </span>
            ))}
          </nav>
        </Reveal>
        <Reveal y={10} delay={0.05}>
          <p className="mt-10 flex items-center gap-3 text-xs tracking-[0.2em] text-brand uppercase">
            <span className="h-px w-8 bg-brand/40" />
            {eyebrow}
          </p>
        </Reveal>
        <MaskLines
          as="h1"
          onMount
          delay={0.15}
          className="mt-6 max-w-5xl text-[clamp(2.6rem,6.4vw,5.8rem)] leading-[0.98] font-medium tracking-[-0.045em] text-ink"
          lines={lines}
        />
        {intro && (
          <Reveal delay={0.4}>
            <p className="mt-8 max-w-2xl text-lg leading-relaxed text-muted sm:text-xl">{intro}</p>
          </Reveal>
        )}
        {children && <Reveal delay={0.5}>{children}</Reveal>}
      </div>
    </section>
  );
}

export const Accent = ({ children }: { children: React.ReactNode }) => (
  <span className="font-serif font-normal tracking-[-0.01em] text-brand italic">{children}</span>
);
