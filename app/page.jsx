import Journey from "@/components/Journey";
import { Cta, Explore, Hero, Idea, Industries, PilotTeaser, Service } from "@/components/Sections";

export default function Home() {
  return (
    <>
      <Hero />
      <Idea />
      <Journey />
      <Service />
      <Industries />
      <Explore />
      <PilotTeaser />
      <Cta />
    </>
  );
}
