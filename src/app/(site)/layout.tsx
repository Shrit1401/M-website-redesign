import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { JsonLd } from "@/components/JsonLd";
import { SmoothScroll } from "@/components/SmoothScroll";
import { SERVICES } from "@/lib/services";
import { SITE } from "@/lib/site";

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

/** The public site: header, footer, Lenis smooth scrolling and the Organization JSON-LD. */
export default function SiteLayout({ children }: LayoutProps<"/">) {
  return (
    <SmoothScroll>
      <JsonLd data={organization} />
      <Header />
      <main id="main">{children}</main>
      <Footer />
    </SmoothScroll>
  );
}
