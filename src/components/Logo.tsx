import Image from "next/image";
import Link from "next/link";

/** The official Macro Software Solution LLC lockup, as used in the live site header. */
export function Logo({ className = "h-11 w-auto" }: { className?: string }) {
  return (
    <Link href="/" className="flex shrink-0 items-center" aria-label="Macro Software Solution LLC — home">
      <Image
        src="/macro-logo.png"
        alt="Macro Software Solution LLC"
        width={434}
        height={146}
        priority
        className={className}
      />
    </Link>
  );
}
