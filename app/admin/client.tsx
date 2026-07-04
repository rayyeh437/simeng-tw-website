'use client';
import Link from 'next/link'
import { MainLayout } from '@/components/layout'
import { trpc } from '@/lib/trpc'
import { useAuth } from '@/hooks/use-auth'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'


interface DashboardStats {
  totalOrders: number
  totalUsers: number
  totalRevenue: number
  pendingOrders: number
  todayOrders: number
  todayRevenue: number
}

export function PageClient() {
  const { isAuthenticated, isLoading: authLoading, user } = useAuth()
  const router = useRouter()
  const [stats, setStats] = useState<DashboardStats>({
    totalOrders: 0,
    totalUsers: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    todayOrders: 0,
    todayRevenue: 0,
  })
  const [loading, setLoading] = useState(true)

  // 重定向未登入用戶
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/user-login')
    }
  }, [isAuthenticated, authLoading, router])

  // 獲取訂單統計
  const { data: orderStats } = trpc.orders.stats.useQuery(undefined as any, {
    enabled: isAuthenticated && !authLoading,
  }) as any

  useEffect(() => {
    if (orderStats) {
      // 計算統計數據
      const totalOrders = Object.values(orderStats).reduce((a: number, b: any) => a + (typeof b === 'number' ? b : 0), 0)
      const pendingOrders = orderStats.pending || 0

      setStats({
        totalOrders,
        totalUsers: 0, // 需要從 API 獲取
        totalRevenue: 0, // 需要從 API 獲取
        pendingOrders,
        todayOrders: 0, // 需要從 API 獲取
        todayRevenue: 0, // 需要從 API 獲取
      })
      setLoading(false)
    }
  }, [orderStats])

  if (authLoading) {
    return (
      <MainLayout>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem', textAlign: 'center' }}>
          <p style={{ color: '#6b7280' }}>載入中...</p>
        </div>
      </MainLayout>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <MainLayout>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
        {/* 頁面頭部 */}
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#1a1a1a', marginBottom: '0.5rem' }}>
            管理後台
          </h1>
          <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
            歡迎回來，{user?.nickname || user?.email}
          </p>
        </div>

        {/* 統計卡片 */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
          {[
            { label: '總訂單數', value: stats.totalOrders, color: '#3b82f6', icon: '📦' },
            { label: '待確認訂單', value: stats.pendingOrders, color: '#f59e0b', icon: '⏳' },
            { label: '總用戶數', value: stats.totalUsers, color: '#10b981', icon: '👥' },
            { label: '總營收', value: `¥${(stats.totalRevenue / 100).toFixed(2)}`, color: '#7c3aed', icon: '💰' },
          ].map((stat) => (
            <div
              key={stat.label}
              style={{
                background: '#f8f8f8',
                border: '1px solid #e5e7eb',
                borderRadius: '0.5rem',
                padding: '1.5rem',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                <div>
                  <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem' }}>
                    {stat.label}
                  </p>
                  <p style={{ fontSize: '1.875rem', fontWeight: 'bold', color: stat.color }}>
                    {stat.value}
                  </p>
                </div>
                <div style={{ fontSize: '2rem' }}>{stat.icon}</div>
              </div>
            </div>
          ))}
        </div>

        {/* 快速操作 */}
        <div style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#1a1a1a', marginBottom: '1rem' }}>
            快速操作
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            {[
              { label: '訂單管理', href: '/admin/orders', icon: '📋' },
              { label: '商品管理', href: '/admin/products', icon: '🛍️' },
              { label: '用戶管理', href: '/admin/users', icon: '👨‍💼' },
              { label: '優惠券管理', href: '/admin/coupons', icon: '🎟️' },
              { label: '分類管理', href: '/admin/categories', icon: '📂' },
              { label: '系統設置', href: '/admin/settings', icon: '⚙️' },
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

        {/* 最近訂單 */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h2 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#1a1a1a' }}>
              最近訂單
            </h2>
            <Link
              href="/admin/orders"
              style={{
                fontSize: '0.875rem',
                color: '#7c3aed',
                textDecoration: 'none',
                fontWeight: '600',
              }}
            >
              查看全部 →
            </Link>
          </div>
          <div
            style={{
              background: '#f8f8f8',
              border: '1px solid #e5e7eb',
              borderRadius: '0.5rem',
              padding: '1.5rem',
              textAlign: 'center',
              color: '#6b7280',
            }}
          >
            <p>暫無最近訂單</p>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
