import Legal from "@/components/Legal";
import { PRIVACY } from "@/lib/legal";

export const metadata = {
  title: "Privacy Policy",
  description: "How Farasha POS Solutions collects, uses and protects information from quote, contact and donation forms, and your choices about your personal data.",
};

export default function PrivacyPage() {
  return <Legal label="Legal" title="Privacy | {policy.}" lede="What we collect, why we collect it, and the choices you have." sections={PRIVACY} />;
}
