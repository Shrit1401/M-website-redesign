import Link from "next/link";
import { Arrow } from "@/components/Motion";
import { PageHero } from "@/components/Sections";

export default function NotFound() {
  return (
    <PageHero label="404" title="This order | {went astray.}" lede="The page you’re looking for doesn’t exist or has moved.">
      <div className="hero-ctas">
        <Link className="btn btn-green btn-lg" href="/">Back to home <Arrow /></Link>
      </div>
    </PageHero>
  );
}
