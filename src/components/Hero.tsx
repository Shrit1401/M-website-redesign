"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { motion } from "motion/react";
import { SERVICES } from "@/lib/services";
import { Icon } from "./Icon";
import { EASE, Magnetic, MaskLines } from "./Motion";

const NebulaScene = dynamic(() => import("./NebulaScene"), { ssr: false });

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 1, ease: EASE, delay },
});

export function Hero() {
  return (
    <section id="top" className="relative isolate flex min-h-[100svh] flex-col overflow-hidden">
      <div aria-hidden className="hero-bg absolute inset-0 -z-20" />
      <motion.div
        className="absolute inset-0 -z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2.4, ease: "easeOut", delay: 0.2 }}
      >
        <NebulaScene />
      </motion.div>
      {/* Keeps the copy legible where it overlaps the galaxy on smaller screens. */}
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 -z-10 h-2/3 bg-gradient-to-b from-bg/80 via-bg/40 to-transparent lg:hidden"
      />

      <div className="pointer-events-none mx-auto flex w-full max-w-[1400px] flex-1 flex-col px-5 pt-32 pb-[38svh] sm:px-10 lg:justify-center lg:pt-28 lg:pb-0">
        <div className="pointer-events-auto max-w-[46rem]">
          <motion.p
            {...fadeUp(0.1)}
            className="inline-flex items-center gap-2.5 rounded-full border border-white/10 bg-white/[0.04] py-1.5 pr-4 pl-1.5 text-xs text-ink-soft backdrop-blur-md"
          >
            <span className="relative flex size-6 items-center justify-center rounded-full bg-violet/20">
              <span className="absolute size-2 animate-ping rounded-full bg-violet/60" />
              <span className="size-2 rounded-full bg-violet" />
            </span>
            Boost your online presence
          </motion.p>

          <MaskLines
            as="h1"
            onMount
            delay={0.2}
            className="mt-7 text-[clamp(2.8rem,6.4vw,6rem)] leading-[0.95] font-semibold tracking-[-0.04em] text-ink"
            lines={[
              "Elevate your",
              "business with",
              <>
                customized web{" "}
                <span className="nebula-text pr-[0.06em] font-serif font-normal tracking-[-0.01em] italic">
                  solutions.
                </span>
              </>,
            ]}
          />

          <motion.p {...fadeUp(0.65)} className="mt-8 max-w-lg text-lg leading-relaxed text-ink-soft">
            Website design & development, maintenance and digital marketing — SEO, SEM, SMO and SMM — from a team that
            treats your site like the storefront it is.
          </motion.p>

          <motion.div {...fadeUp(0.8)} className="mt-10 flex flex-wrap items-center gap-3">
            <Magnetic>
              <Link href="/contact-us" className="btn btn-primary btn-lg">
                Get started
                <span className="btn-arrow">
                  <Icon name="arrowUpRight" className="size-4" />
                </span>
              </Link>
            </Magnetic>
            <Magnetic strength={0.2}>
              <Link href="/services" className="btn btn-outline btn-lg">
                Explore services
              </Link>
            </Magnetic>
          </motion.div>
        </div>
      </div>

      <motion.div
        {...fadeUp(1.1)}
        className="mx-auto flex w-full max-w-[1400px] items-end justify-between gap-6 px-5 pb-8 sm:px-10"
      >
        <span className="hidden items-center gap-3 text-xs tracking-[0.2em] text-muted uppercase sm:flex">
          <span className="relative h-10 w-px overflow-hidden bg-white/10">
            <span className="scroll-cue absolute inset-x-0 top-0 h-4 bg-violet" />
          </span>
          Scroll
        </span>
        <ul className="flex flex-wrap gap-2 sm:justify-end">
          {SERVICES.map((s) => (
            <li key={s.slug}>
              <Link
                href={`/services/${s.slug}`}
                className="flex items-center gap-2 rounded-full border border-white/10 bg-bg/40 px-3.5 py-2 text-xs text-ink-soft backdrop-blur-md transition-colors hover:border-violet/60 hover:text-ink"
              >
                <Icon name={s.icon} className="size-3.5 text-violet" />
                {s.title}
              </Link>
            </li>
          ))}
        </ul>
      </motion.div>
    </section>
  );
}
