import type { Metadata } from "next";
import { AdminShell } from "@/components/admin/AdminShell";
import { requireAdmin } from "@/lib/admin/auth";
import { posts, projects } from "@/lib/content/store";

export const metadata: Metadata = {
  title: { default: "Dashboard", template: "%s — Dashboard | Nebula Webtech" },
  robots: { index: false, follow: false },
};

export default async function PanelLayout({ children }: LayoutProps<"/admin">) {
  await requireAdmin();
  const [p, b] = await Promise.all([projects.all(), posts.all()]);
  return <AdminShell counts={{ "/admin/projects": p.length, "/admin/posts": b.length }}>{children}</AdminShell>;
}
