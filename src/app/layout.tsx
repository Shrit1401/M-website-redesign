import type { Metadata } from "next";
import { Instrument_Serif, Lexend } from "next/font/google";
import { SmoothScroll } from "@/components/SmoothScroll";
import { SITE } from "@/lib/content";
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
  title: "Macro Software Solution | SaaS, Custom Software & IT Solutions",
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

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${lexend.variable} ${serif.variable} antialiased`}>
      <body className="min-h-full">
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
