import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SmoothScroll from "@/components/SmoothScroll";
import { SITE } from "@/lib/content";
import "./globals.css";

export const metadata = {
  metadataBase: new URL("https://farashapos.com"),
  title: {
    default: "Farasha POS Solutions — From first tap to final plate",
    template: "%s — Farasha POS Solutions",
  },
  description: SITE.description,
  openGraph: {
    title: "Farasha POS Solutions",
    description: SITE.description,
    images: ["/brand/wordmark.png"],
  },
  icons: {
    icon: [{ url: "/favicon.ico", sizes: "any" }, { url: "/favicon-32x32.png", type: "image/png" }],
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
};

export const viewport = { themeColor: "#03251B" };

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <SmoothScroll />
        <a href="#main" className="skip-link">Skip to content</a>
        <Header />
        <main id="main">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
