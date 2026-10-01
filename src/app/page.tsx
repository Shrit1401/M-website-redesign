import { Engagements } from "@/components/Engagements";
import { Faq } from "@/components/Faq";
import { Hero } from "@/components/Hero";
import { FinalCta, Marquee, Pillars, Process, Services, Testimonial } from "@/components/Sections";
import { FAQS } from "@/lib/content";

export default function Home() {
  return (
    <>
      <Hero />
      <Pillars />
      <Services />
      <Marquee />
      <Process />
      <Engagements />
      <Testimonial />
      <Faq items={FAQS.filter((f) => f.category !== "AI & AEO").slice(0, 6)} />
      <FinalCta />
    </>
  );
}
