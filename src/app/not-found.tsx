import Link from "next/link";
import { Icon } from "@/components/Icon";

export default function NotFound() {
  return (
    <section className="mx-auto flex min-h-[80svh] max-w-3xl flex-col items-center justify-center px-5 pt-24 text-center">
      <p className="text-[clamp(6rem,20vw,12rem)] leading-none font-medium tracking-[-0.06em] text-brand/15">404</p>
      <h1 className="mt-4 text-4xl font-medium tracking-[-0.03em] text-ink sm:text-5xl">
        This page <span className="font-serif font-normal text-brand italic">moved on.</span>
      </h1>
      <p className="mt-4 text-muted">The page you’re looking for doesn’t exist or has been relocated.</p>
      <div className="mt-10 flex flex-wrap justify-center gap-3">
        <Link href="/" className="btn btn-primary">
          Back home <Icon name="arrowRight" className="size-4" />
        </Link>
        <Link href="/services" className="btn btn-outline">
          Our services
        </Link>
      </div>
    </section>
  );
}
