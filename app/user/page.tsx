'use client';
export const dynamic = 'force-dynamic';



import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { MainLayout } from '@/components/layout'
import { useAuth } from '@/hooks/use-auth'
import { trpc } from '@/lib/trpc'

interface OrderStats {
  pending: number
  confirmed: number
  shipped: number
  delivered: number
  cancelled: number
}

export default function UserCenterPage() {
  const { isAuthenticated, isLoading: authLoading, user } = useAuth()
  const router = useRouter()
  const [orderStats, setOrderStats] = useState<OrderStats>({
    pending: 0,
    confirmed: 0,
    shipped: 0,
    delivered: 0,
    cancelled: 0,
  })
  const [loading, setLoading] = useState(true)

  // 重定向未登入用戶
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/user-login')
    }
  }, [isAuthenticated, authLoading, router])

  // 獲取訂單統計
  const { data: stats } = trpc.orders.stats.useQuery(undefined as any, {
    enabled: isAuthenticated && !authLoading,
  }) as any

  useEffect(() => {
    if (stats) {
      setOrderStats(stats)
      setLoading(false)
    }
  }, [stats])

  if (authLoading) {
    return (
      <MainLayout>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem', textAlign: 'center' }}>
          <p style={{ color: '#6b7280' }}>載入中...</p>
        </div>
      </MainLayout>
    )
  }

  if (!isAuthenticated || !user) {
    return null
  }

  const totalOrders = Object.values(orderStats).reduce((a, b) => a + b, 0)

  return (
    <MainLayout>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
        {/* 用戶信息卡片 */}
        <div
          style={{
            background: 'linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)',
            borderRadius: '0.5rem',
            padding: '2rem',
            color: 'white',
            marginBottom: '2rem',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
            <div>
              <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                歡迎回來，{user.nickname || user.email}！
              </h1>
              <p style={{ fontSize: '0.875rem', opacity: 0.9 }}>
                會員編號：{user.memberCode || 'N/A'}
              </p>
            </div>
            <Link
              href="/profile"
              style={{
                padding: '0.5rem 1rem',
                background: 'rgba(255, 255, 255, 0.2)',
                color: 'white',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                borderRadius: '0.375rem',
                cursor: 'pointer',
                fontSize: '0.875rem',
                fontWeight: '600',
                textDecoration: 'none',
                display: 'inline-block',
              }}
            >
              編輯個人資料
            </Link>
          </div>
        </div>

        {/* 訂單統計 */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
          {[
            { label: '待確認', value: orderStats.pending, color: '#f59e0b' },
            { label: '已確認', value: orderStats.confirmed, color: '#3b82f6' },
            { label: '已出貨', value: orderStats.shipped, color: '#3b82f6' },
            { label: '已完成', value: orderStats.delivered, color: '#10b981' },
            { label: '已取消', value: orderStats.cancelled, color: '#ef4444' },
          ].map((stat) => (
            <Link
              key={stat.label}
              href={`/orders?status=${stat.label.toLowerCase()}`}
              style={{
                background: '#f8f8f8',
                border: '1px solid #e5e7eb',
                borderRadius: '0.5rem',
                padding: '1.5rem',
                textAlign: 'center',
                textDecoration: 'none',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 10px 25px rgba(0,0,0,0.1)'
                e.currentTarget.style.transform = 'translateY(-5px)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = 'none'
                e.currentTarget.style.transform = 'translateY(0)'
              }}
            >
              <div
                style={{
                  fontSize: '1.5rem',
                  fontWeight: 'bold',
                  color: stat.color,
                  marginBottom: '0.5rem',
                }}
              >
                {stat.value}
              </div>
              <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                {stat.label}
              </div>
            </Link>
          ))}
        </div>

        {/* 快速操作 */}
        <div style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#1a1a1a', marginBottom: '1rem' }}>
            快速操作
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            {[
              { label: '我的訂單', href: '/orders', icon: '📦' },
              { label: '收件地址', href: '/addresses', icon: '📍' },
              { label: '願望清單', href: '/wishlist', icon: '❤️' },
              { label: '購物車', href: '/cart', icon: '🛒' },
            ].map((item) => (
              <Link
                key={item.label}
                href={item.href}
                style={{
                  background: '#f8f8f8',
                  border: '1px solid #e5e7eb',
                  borderRadius: '0.5rem',
                  padding: '1.5rem',
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#f3e8ff'
                  e.currentTarget.style.borderColor = '#7c3aed'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#f8f8f8'
                  e.currentTarget.style.borderColor = '#e5e7eb'
                }}
              >
                <div style={{ fontSize: '1.5rem' }}>{item.icon}</div>
                <div>
                  <p style={{ fontSize: '0.875rem', fontWeight: '600', color: '#1a1a1a' }}>
                    {item.label}
                  </p>
                  <p style={{ fontSize: '0.75rem', color: '#9ca3af' }}>
                    {item.label === '我的訂單' && `共 ${totalOrders} 個訂單`}
                    {item.label === '收件地址' && '管理您的收件地址'}
                    {item.label === '願望清單' && '查看您的願望清單'}
                    {item.label === '購物車' && '繼續購物'}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* 帳戶設置 */}
        <div>
          <h2 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#1a1a1a', marginBottom: '1rem' }}>
            帳戶設置
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            {[
              { label: '修改密碼', href: '/account/change-password', icon: '🔐' },
              { label: '安全設置', href: '/account/security', icon: '🛡️' },
              { label: '通知設置', href: '/account/notifications', icon: '🔔' },
              { label: '隱私設置', href: '/account/privacy', icon: '👁️' },
            ].map((item) => (
              <Link
                key={item.label}
                href={item.href}
                style={{
                  background: '#f8f8f8',
                  border: '1px solid #e5e7eb',
                  borderRadius: '0.5rem',
                  padding: '1.5rem',
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#f3e8ff'
                  e.currentTarget.style.borderColor = '#7c3aed'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#f8f8f8'
                  e.currentTarget.style.borderColor = '#e5e7eb'
                }}
              >
                <div style={{ fontSize: '1.5rem' }}>{item.icon}</div>
                <div>
                  <p style={{ fontSize: '0.875rem', fontWeight: '600', color: '#1a1a1a' }}>
                    {item.label}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
