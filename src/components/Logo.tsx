import Image from "next/image";
import Link from "next/link";
import logo from "../../public/nebula-logo-white.png";

/** Official Nebula Webtech wordmark (white, for the dark theme). */
export function Logo({ className = "h-8 w-auto" }: { className?: string }) {
  return (
    <Link href="/" aria-label="Nebula Webtech — home" className="shrink-0">
      <Image src={logo} alt="Nebula Webtech" priority className={className} />
    </Link>
  );
}
