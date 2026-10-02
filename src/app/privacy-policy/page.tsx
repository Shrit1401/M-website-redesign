import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";
import { PRIVACY } from "@/lib/legal";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Nebula Webtech LLC collects, uses and protects your information.",
  alternates: { canonical: "/privacy-policy" },
};

export default function PrivacyPage() {
  return <LegalPage title="Privacy Policy" {...PRIVACY} />;
}
