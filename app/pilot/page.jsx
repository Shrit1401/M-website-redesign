import { Cta, Faq, PageHero, PilotTimeline, TwoLists } from "@/components/Sections";
import { PILOT_FAQ, PILOT_GOALS, PILOT_NEEDS } from "@/lib/content";

export const metadata = {
  title: "90-day pilot program",
  description: "A 90-day pilot at one or two of your locations. Your menu, your team, your customers, with success goals we agree on at the start.",
};

export default function PilotPage() {
  return (
    <>
      <PageHero
        label="90-day pilot program"
        title="Try it in your own shop | {before you commit.}"
        lede="A 90-day pilot at one or two of your locations. Your menu, your team, your customers, with success goals we agree on at the start."
        anchors={[
          { href: "#timeline", label: "Timeline" },
          { href: "#goals", label: "Goals & what we need" },
          { href: "#pilot-faq", label: "Pricing & FAQ" },
        ]}
      />
      <PilotTimeline />
      <TwoLists
        id="goals"
        dark
        actions
        left={{ label: "What success looks like", title: "Goals we agree up front.", items: PILOT_GOALS }}
        right={{ label: "What we need from you", title: "Not much.", items: PILOT_NEEDS }}
      />
      <Faq id="pilot-faq" items={PILOT_FAQ} label="Pricing & questions" title="Before you | {start.}" />
      <Cta title="Ready to plan | {a pilot?}" text="Tell us which location to start with and what matters most to you." />
    </>
  );
}
