import { Cta, Features, PageHero, Promotions, Service, Team, Why } from "@/components/Sections";

export const metadata = {
  title: "Features",
  description: "Online ordering, back office, promotions, loyalty, staff roles and data you own — everything that runs the restaurant.",
};

export default function FeaturesPage() {
  return (
    <>
      <PageHero
        label="Beyond the counter"
        title="Everything that runs | {the restaurant.}"
        lede="Online ordering, menus, promotions, loyalty and staff — managed in one place, across every location."
        anchors={[
          { href: "#overview", label: "Overview" },
          { href: "#promotions", label: "Promotions & loyalty" },
          { href: "#team", label: "Staff & roles" },
          { href: "#why", label: "Why Farasha" },
        ]}
      />
      <Features />
      <Promotions />
      <Team />
      <Service />
      <Why />
      <Cta />
    </>
  );
}
