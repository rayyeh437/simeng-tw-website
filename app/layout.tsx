import type { Metadata } from 'next'
import { Providers } from '@/lib/providers'
import './globals.css'

const appName = process.env.NEXT_PUBLIC_APP_NAME || '喜萌'

export const metadata: Metadata = {
  title: appName,
  description: '喜萌 - 您的購物好幫手',
  keywords: ['購物', '商城', '喜萌'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-TW">
      <body>
        <Providers>
          <header style={{ background: '#f5f5f5', padding: '20px', textAlign: 'center' }}>
            <img src="/logo-full.png" alt="喜萌 Logo" style={{ height: '60px', objectFit: 'contain' }} />
          </header>
          <main style={{ minHeight: 'calc(100vh - 200px)', padding: '20px' }}>
            {children}
          </main>

        </Providers>
      </body>
    </html>
  )
}
