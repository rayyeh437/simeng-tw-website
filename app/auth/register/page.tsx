import { Suspense } from 'react'

export const dynamic = 'force-dynamic'

function LoadingUI() {
  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem', textAlign: 'center' }}>
      <p style={{ color: '#6b7280' }}>載入中...</p>
    </div>
  )
}
import { RegisterClient } from './client'

export default function Page() {
  return (
    <Suspense fallback={<LoadingUI />}>
      <RegisterClient />
    </Suspense>
  )
}
