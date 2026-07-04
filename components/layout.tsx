'use client'

import Link from 'next/link'
import { useAuth } from '@/hooks/use-auth'
import { useRouter } from 'next/navigation'

interface LayoutProps {
  children: React.ReactNode
  showHeader?: boolean
  showFooter?: boolean
}

export function MainLayout({ children, showHeader = true, showFooter = true }: LayoutProps) {
  const { user, logout } = useAuth()
  const router = useRouter()

  const handleLogout = async () => {
    await logout()
    router.push('/login')
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {showHeader && (
        <>
          {/* 灰色 Header - Logo 置中 + 右邊導航 */}
          <header
            style={{
              background: '#F8F8F8',
              borderBottom: '1px solid #E5E7EB',
              padding: '1rem 2rem',
              position: 'sticky',
              top: 0,
              zIndex: 100,
            }}
          >
            <div
              style={{
                maxWidth: '1200px',
                margin: '0 auto',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                position: 'relative',
              }}
            >
              {/* Logo 置中 */}
              <Link href="/" style={{ textDecoration: 'none' }}>
                <img src="/logo-full.png" alt="喜萌 Logo" style={{ height: '40px', objectFit: 'contain' }} />
              </Link>

              {/* 導航菜單 - 絕對定位在右邊 */}
              <nav
                style={{
                  position: 'absolute',
                  right: '2rem',
                  display: 'flex',
                  gap: '2rem',
                  alignItems: 'center',
                }}
              >
                <Link href="/" style={{ color: '#1A1A1A', textDecoration: 'none', fontWeight: '500' }}>
                  首頁
                </Link>
                <Link href="/products" style={{ color: '#1A1A1A', textDecoration: 'none', fontWeight: '500' }}>
                  商品
                </Link>
                <Link href="/cart" style={{ color: '#1A1A1A', textDecoration: 'none', fontWeight: '500' }}>
                  購物車
                </Link>

                {user ? (
                  <>
                    <Link href="/orders" style={{ color: '#1A1A1A', textDecoration: 'none', fontWeight: '500' }}>
                      訂單
                    </Link>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <span style={{ color: '#6B7280', fontSize: '0.875rem' }}>{user.name || user.email}</span>
                      <button
                        onClick={handleLogout}
                        style={{
                          background: '#EF4444',
                          color: 'white',
                          padding: '0.5rem 1rem',
                          borderRadius: '0.375rem',
                          border: 'none',
                          cursor: 'pointer',
                          fontSize: '0.875rem',
                          fontWeight: '600',
                        }}
                      >
                        登出
                      </button>
                    </div>
                  </>
                ) : (
                  <Link href="/login" style={{ color: '#7C3AED', textDecoration: 'none', fontWeight: 'bold' }}>
                    登入
                  </Link>
                )}
              </nav>
            </div>
          </header>

          {/* 白色 Header - 只有搜尋欄 */}
          <header
            style={{
              background: '#ffffff',
              borderBottom: '1px solid #E5E7EB',
              padding: '1rem 2rem',
              position: 'sticky',
              top: '72px',
              zIndex: 99,
            }}
          >
            <div
              style={{
                maxWidth: '1200px',
                margin: '0 auto',
                display: 'flex',
                justifyContent: 'center',
              }}
            >
              {/* 搜尋欄 */}
              <div style={{ display: 'flex', gap: '0.75rem', width: '100%', maxWidth: '500px' }}>
                <input
                  type="text"
                  placeholder="搜尋商品..."
                  style={{
                    flex: 1,
                    padding: '0.75rem 1rem',
                    border: '1px solid #E5E7EB',
                    borderRadius: '0.375rem',
                    fontSize: '0.875rem',
                  }}
                />
                <button
                  style={{
                    padding: '0.75rem 1.5rem',
                    background: '#7C3AED',
                    color: 'white',
                    border: 'none',
                    borderRadius: '0.375rem',
                    cursor: 'pointer',
                    fontWeight: '600',
                  }}
                >
                  搜尋
                </button>
              </div>
            </div>
          </header>
        </>
      )}

      <main style={{ flex: 1, maxWidth: '1200px', margin: '0 auto', width: '100%', padding: '2rem' }}>
        {children}
      </main>

      {showFooter && (
        <footer
          style={{
            background: '#F8F8F8',
            borderTop: '1px solid #E5E7EB',
            padding: '2rem',
            marginTop: '2rem',
          }}
        >
          <div
            style={{
              maxWidth: '1200px',
              margin: '0 auto',
              textAlign: 'center',
              color: '#6B7280',
            }}
          >
            <p>&copy; 2026 喜萌SIMENG. 版權所有。</p>
            <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'center', gap: '2rem' }}>
              <Link href="/privacy" style={{ color: '#7C3AED', textDecoration: 'none' }}>
                隱私政策
              </Link>
              <Link href="/terms" style={{ color: '#7C3AED', textDecoration: 'none' }}>
                服務條款
              </Link>
              <Link href="/contact" style={{ color: '#7C3AED', textDecoration: 'none' }}>
                聯絡我們
              </Link>
            </div>
          </div>
        </footer>
      )}
    </div>
  )
}
