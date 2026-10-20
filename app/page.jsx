import Journey from "@/components/Journey";
import { Cta, Explore, Hero, Idea, PilotTeaser, Service } from "@/components/Sections";

export default function Home() {
  return (
    <>
      <Hero />
      <Idea />
      <Journey />
      <Service />
      <Explore />
      <PilotTeaser />
      <Cta />
    </>
  );
}
