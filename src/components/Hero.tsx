"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { motion } from "motion/react";
import { Icon } from "./Icon";
import { Magnetic, MaskLines } from "./Motion";

const HeroScene = dynamic(() => import("./HeroScene"), { ssr: false });

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 1, ease: [0.16, 1, 0.3, 1] as const, delay },
});

export function Hero() {
  return (
    <section id="top" className="relative isolate flex min-h-[100svh] flex-col overflow-hidden">
      <div aria-hidden className="hero-bg absolute inset-0 -z-20" />
      <div aria-hidden className="hero-grid absolute inset-0 -z-10" />
      <div className="absolute inset-0 -z-10">
        <HeroScene />
      </div>

      <div className="pointer-events-none mx-auto flex w-full max-w-[1400px] flex-1 flex-col px-5 pt-28 pb-[42svh] sm:px-10 lg:justify-center lg:pt-24 lg:pb-0">
        <div className="pointer-events-auto max-w-[44rem]">
          <motion.p
            {...fadeUp(0.1)}
            className="inline-flex items-center gap-2.5 rounded-full border border-brand/15 bg-white/70 py-1.5 pr-4 pl-2 text-xs text-ink-soft backdrop-blur-md"
          >
            <span className="shrink-0 rounded-full bg-brand px-2 py-0.5 text-[0.65rem] whitespace-nowrap font-medium tracking-wider text-white uppercase">
              SaaS + IT
            </span>
            <span className="sm:hidden">Software, cloud & AI</span>
            <span className="hidden sm:inline">Custom software, cloud & AI — built to scale</span>
          </motion.p>

          <MaskLines
            as="h1"
            onMount
            delay={0.2}
            className="mt-7 text-[clamp(2.7rem,6.2vw,5.6rem)] leading-[0.95] font-medium tracking-[-0.045em] text-ink"
            lines={[
              "Software for",
              "your next stage",
              <>
                of <span className="font-serif font-normal tracking-[-0.02em] text-brand italic">growth.</span>
              </>,
            ]}
          />

          <motion.p {...fadeUp(0.65)} className="mt-8 max-w-md text-lg leading-relaxed text-muted">
            Build, connect and scale with custom software, SaaS products and reliable IT.
          </motion.p>

          <motion.div {...fadeUp(0.8)} className="mt-10 flex flex-wrap items-center gap-3">
            <Magnetic>
              <Link href="/quote" className="btn btn-primary btn-lg group">
                Start a project
                <span className="grid size-7 place-items-center rounded-full bg-white/15 transition-transform duration-500 group-hover:rotate-45">
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
        className="mx-auto flex w-full max-w-[1400px] items-end justify-between px-5 pb-8 sm:px-10"
      >
        <span className="flex items-center gap-3 text-xs tracking-[0.2em] text-muted uppercase">
          <span className="relative h-10 w-px overflow-hidden bg-ink/10">
            <span className="scroll-cue absolute inset-x-0 top-0 h-4 bg-brand" />
          </span>
          Scroll
        </span>
        <p className="eyebrow text-right text-[0.68rem] leading-5">
          Built to connect.
          <br />
          Ready to scale.
        </p>
      </motion.div>
    </section>
  );
}
