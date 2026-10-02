import Link from "next/link";
import { Icon } from "@/components/Icon";

export default function NotFound() {
  return (
    <section className="relative isolate grid min-h-[90svh] place-items-center overflow-hidden px-5 pt-24 text-center">
      <div aria-hidden className="nebula-wash absolute inset-0 -z-20" />
      <div aria-hidden className="starfield absolute inset-0 -z-10" />
      <div>
        <p className="text-outline text-[clamp(7rem,24vw,16rem)] leading-none font-bold tracking-[-0.06em]">404</p>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-ink sm:text-4xl">Lost in space.</h1>
        <p className="mx-auto mt-3 max-w-md text-ink-soft">
          The page you&apos;re looking for drifted out of orbit. Let&apos;s get you back.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/" className="btn btn-primary">
            Back home <Icon name="arrowRight" className="size-4" />
          </Link>
          <Link href="/contact-us" className="btn btn-outline">
            Contact us
          </Link>
        </div>
      </div>
    </section>
  );
}
