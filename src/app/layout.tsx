import type { Metadata, Viewport } from "next";
import { Instrument_Serif, Urbanist } from "next/font/google";
import { SITE } from "@/lib/site";
import "./globals.css";

// Only the document shell lives here. The public site's header, footer and smooth scrolling are in
// (site)/layout.tsx; the admin dashboard has its own chrome in admin/(panel)/layout.tsx.

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

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${urbanist.variable} ${serif.variable} antialiased`}>
      <body className="min-h-full">
        <a
          href="#main"
          className="sr-only z-[60] rounded-full bg-white px-4 py-2 text-sm text-[#12091f] focus:not-sr-only focus:fixed focus:top-4 focus:left-4"
        >
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
