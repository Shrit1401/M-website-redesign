import Legal from "@/components/Legal";
import { TERMS } from "@/lib/legal";

export const metadata = {
  title: "Terms of Use",
  description: "The terms for using farashapos.com, including the demo ordering site, our content and links to third-party services such as payment providers.",
};

export default function TermsPage() {
  return <Legal label="Legal" title="Terms | {of use.}" lede="The ground rules for using this website." sections={TERMS} />;
}
