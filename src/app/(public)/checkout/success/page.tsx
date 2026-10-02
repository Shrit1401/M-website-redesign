import { RequireRole } from '@/layouts/DashboardLayout'
import { CheckoutSuccess } from '@/views/public/Misc'

export default function Page() {
  return <RequireRole role="student"><CheckoutSuccess /></RequireRole>
}
