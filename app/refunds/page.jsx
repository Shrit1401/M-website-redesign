import Legal from "@/components/Legal";
import { REFUNDS } from "@/lib/legal";

export const metadata = {
  title: "Refund Policy",
  description: "Refunds for Farasha POS pilots, subscriptions, hardware and donations: what can be refunded, how to cancel a monthly gift, and how to request a refund.",
};

export default function RefundsPage() {
  return <Legal label="Legal" title="Refund | {policy.}" lede="Pilots, subscriptions, hardware and donations — and how to ask for a refund." sections={REFUNDS} />;
}
