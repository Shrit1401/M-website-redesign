import Journey from "@/components/Journey";
import Calm from "@/components/Calm";
import { AppDetails, Cta, PageHero } from "@/components/Sections";
import { APP_DETAILS } from "@/lib/content";

export const metadata = {
  title: "Apps",
  description: "Counter register, self-order kiosk, kitchen display, online ordering and Back Office — working from one order stream.",
};

export default function AppsPage() {
  return (
    <>
      <PageHero
        label="Product ecosystem"
        title="Four ways to order. | {One system.}"
        lede="Customers order the way they like. Your team sees it all in the same place, from the same menu, with the same prices."
        anchors={APP_DETAILS.map((a) => ({ href: `#${a.id}`, label: a.kicker }))}
      />
      <Journey />
      <AppDetails />
      <Calm />
      <Cta />
    </>
  );
}
