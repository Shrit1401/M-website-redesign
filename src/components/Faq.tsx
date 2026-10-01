"use client";

import { useState } from "react";
import Link from "next/link";
import type { Faq as FaqItem } from "@/lib/content";
import { Icon } from "./Icon";
import { SectionHead } from "./SectionHead";

/** Accordion list. Answers stay in the DOM (collapsed via grid rows) so crawlers and answer engines can read them. */
export function FaqList({
  items,
  idPrefix = "faq",
  firstOpen = true,
}: {
  items: FaqItem[];
  idPrefix?: string;
  firstOpen?: boolean;
}) {
  const [open, setOpen] = useState(firstOpen ? 0 : -1);

  return (
    <div className="border-t border-line">
      {items.map((f, i) => {
        const isOpen = open === i;
        const id = `${idPrefix}-${i}`;
        return (
          <div key={f.q} className="border-b border-line">
            <h3>
              <button
                type="button"
                className="group flex w-full items-center justify-between gap-6 py-6 text-left text-lg font-medium tracking-tight text-ink transition-colors hover:text-brand"
                aria-expanded={isOpen}
                aria-controls={id}
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
            <div
              id={id}
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
  );
}

/** Home-page FAQ preview with a link to the full FAQ page. */
export function Faq({ items, index = "05" }: { items: FaqItem[]; index?: string }) {
  return (
    <section id="faq" className="mx-auto max-w-[1400px] px-5 py-28 sm:px-10 lg:py-36">
      <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="lg:sticky lg:top-32 lg:self-start">
          <SectionHead
            index={index}
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
            <Link href="/contact?tab=inquiry" className="text-brand underline-offset-4 hover:underline">
              Send us an inquiry
            </Link>
            .
          </p>
          <Link href="/faq" className="btn btn-outline mt-8">
            See all FAQs <Icon name="arrowRight" className="size-4" />
          </Link>
        </div>
        <FaqList items={items} />
      </div>
    </section>
  );
}
