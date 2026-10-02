import type { Metadata, Viewport } from "next";
import { Instrument_Serif, Urbanist } from "next/font/google";
import { Header } from "@/components/Header";
import { JsonLd } from "@/components/JsonLd";
import { Footer } from "@/components/Sections";
import { SmoothScroll } from "@/components/SmoothScroll";
import { SITE } from "@/lib/site";
import { SERVICES } from "@/lib/services";
import "./globals.css";

// Urbanist is the closest Google font to the geometric Nebula Webtech wordmark.
const urbanist = Urbanist({
  variable: "--font-urbanist",
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
    default: "Nebula Webtech LLC | Web Design, Development & Digital Marketing in Palatine, IL",
    template: "%s | Nebula Webtech LLC",
  },
  description:
    "Nebula Webtech LLC builds customized websites and grows them with maintenance and digital marketing — SEO, SEM, SMO and SMM. Based in Palatine, IL.",
  openGraph: {
    title: "Nebula Webtech LLC",
    description: "Elevate your business with customized web solutions.",
    url: SITE.url,
    siteName: SITE.name,
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#07040f",
  colorScheme: "dark",
};

const organization = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "@id": `${SITE.url}/#org`,
  name: SITE.name,
  slogan: SITE.tagline,
  url: SITE.url,
  email: SITE.email,
  telephone: "+1-224-457-0242",
  logo: `${SITE.url}/nebula-logo-white.png`,
  image: `${SITE.url}/nebula-logo-white.png`,
  address: {
    "@type": "PostalAddress",
    streetAddress: SITE.address.street,
    addressLocality: SITE.address.city,
    addressRegion: SITE.address.region,
    postalCode: SITE.address.postal,
    addressCountry: SITE.address.country,
  },
  geo: { "@type": "GeoCoordinates", latitude: 42.1186951, longitude: -88.0677781 },
  openingHours: "Mo-Fr 09:00-17:00",
  sameAs: SITE.socials.map((s) => s.href),
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Services",
    itemListElement: SERVICES.map((s) => ({
      "@type": "Offer",
      itemOffered: { "@type": "Service", name: s.fullTitle, description: s.summary, url: `${SITE.url}/services/${s.slug}` },
    })),
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${urbanist.variable} ${serif.variable} antialiased`}>
      <body className="min-h-full">
        <JsonLd data={organization} />
        <a
          href="#main"
          className="sr-only z-[60] rounded-full bg-white px-4 py-2 text-sm text-[#12091f] focus:not-sr-only focus:fixed focus:top-4 focus:left-4"
        >
          Skip to content
        </a>
        <SmoothScroll>
          <Header />
          <main id="main">{children}</main>
          <Footer />
        </SmoothScroll>
      </body>
    </html>
  );
}
