import { RequireRole } from '@/layouts/DashboardLayout'
import Player from '@/views/student/Player'

export default function Page() {
  return <RequireRole role="student"><Player /></RequireRole>
}
