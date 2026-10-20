import { Cta, Faq, PageHero } from "@/components/Sections";
import { FAQ, PILOT_FAQ } from "@/lib/content";

export const metadata = {
  title: "FAQ",
  description: "Equipment, offline service, payments, data ownership and setup time — common questions about Farasha POS Solutions.",
};

export default function FaqPage() {
  return (
    <>
      <PageHero
        label="Questions"
        title="Straight | {answers.}"
        lede="Equipment, payments, offline service, your data and the pilot."
        anchors={[
          { href: "#product-faq", label: "Product & setup" },
          { href: "#pilot-faq", label: "Pilot & pricing" },
        ]}
      />
      <Faq id="product-faq" items={FAQ} label="Product & setup" title="Asked | {and answered.}" />
      <Faq id="pilot-faq" items={PILOT_FAQ} label="Pilot & pricing" title="Trying it | {first.}" />
      <Cta />
    </>
  );
}
