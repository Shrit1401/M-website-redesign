'use client'

import { useEffect, useState } from 'react'
import { Toaster } from '@/components/ui'
import { StoreProvider } from '@/store/store'

// The demo keeps all data in localStorage, so the store can only be created in
// the browser. Render nothing on the server and mount the app after hydration.
export default function Providers({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])
  if (!mounted) return null
  return (
    <StoreProvider>
      {children}
      <Toaster />
    </StoreProvider>
  )
}
