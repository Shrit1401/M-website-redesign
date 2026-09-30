import Image from "next/image";

export function Logo({ sub = "Software Solution" }: { sub?: string }) {
  return (
    <a href="#top" className="flex items-center gap-3" aria-label="Macro Software Solution — home">
      <Image src="/macro-icon.png" alt="" width={40} height={40} priority className="size-10" />
      <span className="leading-tight">
        <span className="block text-xl font-semibold tracking-tight text-ink">macro</span>
        <span className="block text-[0.72rem] tracking-wide text-muted">{sub}</span>
      </span>
    </a>
  );
}
