"use client";

import { useState } from "react";
import { FAQS } from "@/lib/content";
import { Icon } from "./Icon";
import { SectionHead } from "./SectionHead";

export function Faq() {
  const [open, setOpen] = useState(0);

  return (
    <section id="faq" className="mx-auto max-w-[1400px] px-5 py-28 sm:px-10 lg:py-36">
      <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="lg:sticky lg:top-32 lg:self-start">
          <SectionHead
            index="05"
            eyebrow="FAQ"
            lines={[
              "A few things",
              <span key="l" className="font-serif font-normal text-brand italic">
                you might ask.
              </span>,
            ]}
          />
          <p className="mt-6 max-w-md text-muted">
            Straight answers about our services, quotes and how we work. Can’t find yours?{" "}
            <a href="#start" className="text-brand underline-offset-4 hover:underline">
              Send us an inquiry
            </a>
            .
          </p>
        </div>
        <div className="border-t border-line">
          {FAQS.map((f, i) => {
            const isOpen = open === i;
            return (
              <div key={f.q} className="border-b border-line">
                <h3>
                  <button
                    type="button"
                    className="group flex w-full items-center justify-between gap-6 py-6 text-left text-lg font-medium tracking-tight text-ink transition-colors hover:text-brand"
                    aria-expanded={isOpen}
                    aria-controls={`faq-${i}`}
                    onClick={() => setOpen(isOpen ? -1 : i)}
                  >
                    {f.q}
                    <span
                      className={`grid size-9 shrink-0 place-items-center rounded-full border transition-all duration-500 ${
                        isOpen
                          ? "rotate-45 border-brand bg-brand text-white"
                          : "border-line text-brand group-hover:border-brand"
                      }`}
                    >
                      <Icon name="plus" className="size-4" />
                    </span>
                  </button>
                </h3>
                {/* Answers stay in the DOM (hidden via grid rows) so crawlers and answer engines can read them. */}
                <div
                  id={`faq-${i}`}
                  className={`grid transition-[grid-template-rows] duration-300 ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
                >
                  <p className="overflow-hidden pr-14 leading-relaxed text-muted">
                    <span className="block pb-7">{f.a}</span>
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
