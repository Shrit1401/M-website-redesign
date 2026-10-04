import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { NotFoundContent } from "@/components/NotFoundContent";
import { SmoothScroll } from "@/components/SmoothScroll";

/** Unmatched URLs. Only the root layout wraps this, so it brings the site chrome itself. */
export default function NotFound() {
  return (
    <SmoothScroll>
      <Header />
      <main id="main">
        <NotFoundContent />
      </main>
      <Footer />
    </SmoothScroll>
  );
}
