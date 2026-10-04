import { NotFoundContent } from "@/components/NotFoundContent";

/** notFound() inside a site page — rendered within (site)/layout.tsx, so header and footer are already there. */
export default function NotFound() {
  return <NotFoundContent />;
}
