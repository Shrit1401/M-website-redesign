import { MaskLines, Reveal } from "./Motion";

export function SectionHead({
  index,
  eyebrow,
  lines,
  sub,
}: {
  index: string;
  eyebrow: string;
  lines: React.ReactNode[];
  sub?: string;
}) {
  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
      <div>
        <Reveal y={10}>
          <p className="flex items-center gap-3 text-xs tracking-[0.2em] text-muted uppercase">
            <span className="text-brand">({index})</span>
            <span className="h-px w-8 bg-ink/15" />
            {eyebrow}
          </p>
        </Reveal>
        <MaskLines
          className="mt-6 text-[clamp(2.4rem,5.4vw,4.6rem)] leading-[1] font-medium tracking-[-0.04em] text-ink"
          lines={lines}
        />
      </div>
      {sub && (
        <Reveal delay={0.2} className="max-w-sm">
          <p className="text-lg leading-relaxed text-muted">{sub}</p>
        </Reveal>
      )}
    </div>
  );
}
