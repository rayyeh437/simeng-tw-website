import './globals.css'
import type { Metadata } from 'next'
import { Providers } from '@/lib/providers'

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
          <main>
            {children}
          </main>
        </Providers>
      </body>
    </html>
  )
}
