import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";
import { TERMS } from "@/lib/legal";

export const metadata: Metadata = {
  title: "Terms and Conditions",
  description: "The terms that govern your use of the Nebula Webtech LLC website and services.",
  alternates: { canonical: "/terms-and-conditions" },
};

export default function TermsPage() {
  return <LegalPage title="Terms and Conditions" {...TERMS} />;
}
