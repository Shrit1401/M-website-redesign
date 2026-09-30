import { ContactForms } from "@/components/ContactForms";
import { Engagements } from "@/components/Engagements";
import { Faq } from "@/components/Faq";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { FinalCta, Footer, Marquee, Pillars, Process, Services, Testimonial } from "@/components/Sections";
import { AI_SERVICE, FAQS, SERVICES, SITE } from "@/lib/content";

// Structured data so search and AI answer engines can understand and cite the business + FAQ.
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "ProfessionalService",
      "@id": `${SITE.url}/#org`,
      name: SITE.name,
      url: SITE.url,
      email: SITE.email,
      logo: `${SITE.url}/macro-logo.png`,
      description: "Custom software, SaaS, web & mobile development, IT infrastructure, digital marketing and AI / answer engine optimization.",
      priceRange: "Custom quote",
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "Services",
        itemListElement: [...SERVICES.map((s) => ({ name: s.title, description: s.body })), { name: AI_SERVICE.title, description: AI_SERVICE.body }].map(
          (s) => ({ "@type": "Offer", itemOffered: { "@type": "Service", ...s } }),
        ),
      },
    },
    {
      "@type": "FAQPage",
      mainEntity: FAQS.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
  ],
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <Header />
      <main>
        <Hero />
        <Pillars />
        <Services />
        <Marquee />
        <Process />
        <Engagements />
        <Testimonial />
        <Faq />
        <ContactForms />
        <FinalCta />
      </main>
      <Footer />
    </>
  );
}
