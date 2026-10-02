import { NotFound } from '@/views/public/Misc'

// Catch-all inside the public group so unknown URLs keep the site header/footer
export default function Page() {
  return <NotFound />
}
