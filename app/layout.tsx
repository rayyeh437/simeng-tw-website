import type { Metadata } from 'next'
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
        <header style={{ background: '#f5f5f5', padding: '20px', textAlign: 'center' }}>
          <h1>{appName}</h1>
          <p>您的購物好幫手</p>
        </header>
        <main style={{ minHeight: 'calc(100vh - 200px)', padding: '20px' }}>
          {children}
        </main>
        <footer style={{ background: '#f5f5f5', padding: '20px', textAlign: 'center', marginTop: '40px' }}>
          <p>&copy; 2024 {appName}. 版權所有。</p>
        </footer>
      </body>
    </html>
  )
}
