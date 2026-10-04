import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { LoginForm } from "@/components/admin/LoginForm";
import { Icon } from "@/components/Icon";
import { adminConfigured } from "@/lib/admin/auth";
import mark from "../../../../../public/nebula-mark-white.png";

export const metadata: Metadata = {
  title: "Sign in — Dashboard",
  robots: { index: false, follow: false },
};

export default async function LoginPage({ searchParams }: PageProps<"/admin/login">) {
  const { next } = await searchParams;
  const configured = adminConfigured();

  return (
    <main id="main" className="relative isolate grid min-h-svh place-items-center overflow-hidden px-5 py-16">
      <div aria-hidden className="nebula-wash absolute inset-0 -z-20" />
      <div aria-hidden className="starfield absolute inset-0 -z-10 opacity-70" />
      <div aria-hidden className="pointer-events-none absolute top-1/2 left-1/2 -z-10 aspect-square w-[44rem] max-w-[160vw] -translate-x-1/2 -translate-y-1/2">
        <div className="orbit-spin absolute inset-0 rounded-full border border-white/[0.06]" />
        <div className="absolute inset-[20%] rounded-full border border-violet/15" />
        <div className="orbit-spin absolute inset-0 [animation-duration:28s]">
          <span className="absolute top-1/2 -left-1.5 size-3 rounded-full bg-violet shadow-[0_0_20px_4px_rgb(166_123_255/0.7)]" />
        </div>
      </div>

      <div className="w-full max-w-sm">
        <div className="text-center">
          <Image src={mark} alt="Nebula Webtech" className="mx-auto h-14 w-auto" priority />
          <h1 className="mt-6 text-3xl font-semibold tracking-[-0.03em] text-ink">Content dashboard</h1>
          <p className="mt-2 text-sm text-ink-soft">Sign in to manage projects and blog posts.</p>
        </div>

        <div className="mt-8 rounded-3xl border border-white/10 bg-surface/80 p-6 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.9)] backdrop-blur-xl sm:p-8">
          {configured ? (
            <LoginForm next={typeof next === "string" ? next : undefined} />
          ) : (
            <div className="text-sm leading-relaxed text-ink-soft">
              <p className="flex items-center gap-2 font-semibold text-ink">
                <Icon name="lock" className="size-4 text-violet" /> Admin isn&apos;t set up yet
              </p>
              <p className="mt-3">
                Add <code className="rounded bg-white/[0.06] px-1.5 py-0.5 text-xs text-ink">ADMIN_PASSWORD</code> to{" "}
                <code className="rounded bg-white/[0.06] px-1.5 py-0.5 text-xs text-ink">.env.local</code> (see{" "}
                <code className="rounded bg-white/[0.06] px-1.5 py-0.5 text-xs text-ink">.env.example</code>) and restart the
                server.
              </p>
            </div>
          )}
        </div>

        <Link href="/" className="mt-6 flex items-center justify-center gap-2 text-sm text-muted transition-colors hover:text-ink">
          <Icon name="arrowLeft" className="size-4" /> Back to the website
        </Link>
      </div>
    </main>
  );
}
