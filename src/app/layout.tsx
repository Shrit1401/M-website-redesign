import type { Metadata } from "next";
import { Instrument_Serif, Lexend } from "next/font/google";
import { Header } from "@/components/Header";
import { JsonLd } from "@/components/JsonLd";
import { Footer } from "@/components/Sections";
import { SmoothScroll } from "@/components/SmoothScroll";
import { SITE } from "@/lib/content";
import { SERVICES } from "@/lib/services";
import "./globals.css";

const lexend = Lexend({
  variable: "--font-lexend",
  subsets: ["latin"],
});

const serif = Instrument_Serif({
  variable: "--font-serif",
  weight: "400",
  style: ["normal", "italic"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: "Macro Software Solution | SaaS, Custom Software & IT Solutions",
    template: "%s | Macro Software Solution",
  },
  description:
    "Macro Software Solution builds custom software, SaaS products, websites, mobile apps and reliable IT — plus AI optimization and answer engine optimization. Every project is custom-quoted.",
  openGraph: {
    title: "Macro Software Solution",
    description: "Software for your next stage of growth.",
    url: SITE.url,
    siteName: "Macro Software Solution",
    type: "website",
  },
};

// Site-wide entity data so search and AI answer engines can identify and cite the business.
const organization = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "@id": `${SITE.url}/#org`,
  name: SITE.name,
  url: SITE.url,
  email: SITE.email,
  telephone: SITE.phone,
  logo: `${SITE.url}/macro-logo.png`,
  image: `${SITE.url}/macro-logo.png`,
  priceRange: "Custom quote",
  address: {
    "@type": "PostalAddress",
    streetAddress: SITE.address.street,
    addressLocality: SITE.address.city,
    addressRegion: SITE.address.region,
    postalCode: SITE.address.postal,
    addressCountry: SITE.address.country,
  },
  openingHours: "Mo-Fr 09:00-17:00",
  areaServed: "Worldwide",
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Services",
    itemListElement: SERVICES.map((s) => ({
      "@type": "Offer",
      itemOffered: { "@type": "Service", name: s.title, description: s.summary, url: `${SITE.url}/services/${s.slug}` },
    })),
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${lexend.variable} ${serif.variable} antialiased`}>
      <body className="min-h-full">
        <JsonLd data={organization} />
        <SmoothScroll>
          <Header />
          <main>{children}</main>
          <Footer />
        </SmoothScroll>
      </body>
    </html>
  );
}
