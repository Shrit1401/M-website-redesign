import DashboardLayout from '@/layouts/DashboardLayout'

export default function Layout({ children }: { children: React.ReactNode }) {
  return <DashboardLayout role="tutor">{children}</DashboardLayout>
}
