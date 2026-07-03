'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { MainLayout } from '@/components/layout'
import { useAuth } from '@/hooks/use-auth'
import { trpc } from '@/lib/trpc'

interface Order {
  id: number
  userId: number
  status: string
  totalAmount: number
  createdAt: string
  updatedAt: string
  user?: {
    email: string
    nickname: string
  }
}

export default function AdminOrdersPage() {
  const { isAuthenticated, isLoading: authLoading, user } = useAuth()
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  // 重定向未登入用戶
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/user-login')
    }
  }, [isAuthenticated, authLoading, router])

  // 獲取訂單列表
  const { data: orderList = [] } = trpc.orders.list.useQuery(undefined as any, {
    enabled: isAuthenticated && !authLoading,
  }) as any

  useEffect(() => {
    if (orderList && orderList.length > 0) {
      setOrders(orderList)
      setLoading(false)
    }
  }, [orderList])

  // 應用篩選和搜尋
  useEffect(() => {
    let filtered = orders

    // 按狀態篩選
    if (statusFilter !== 'all') {
      filtered = filtered.filter((order) => order.status === statusFilter)
    }

    // 按搜尋詞篩選
    if (searchTerm) {
      filtered = filtered.filter(
        (order) =>
          order.id.toString().includes(searchTerm) ||
          order.user?.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.user?.nickname.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    setFilteredOrders(filtered)
    setCurrentPage(1)
  }, [orders, statusFilter, searchTerm])

  // 分頁
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage)
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const getStatusBadgeColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: '#f59e0b',
      confirmed: '#3b82f6',
      shipped: '#3b82f6',
      delivered: '#10b981',
      cancelled: '#ef4444',
    }
    return colors[status] || '#6b7280'
  }

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
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '2rem' }}>
        {/* 頁面頭部 */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#1a1a1a' }}>
            訂單管理
          </h1>
          <Link
            href="/admin"
            style={{
              padding: '0.5rem 1rem',
              background: '#f3f4f6',
              color: '#1a1a1a',
              border: 'none',
              borderRadius: '0.375rem',
              cursor: 'pointer',
              fontSize: '0.875rem',
              fontWeight: '600',
              textDecoration: 'none',
            }}
          >
            返回後台
          </Link>
        </div>

        {/* 篩選和搜尋 */}
        <div
          style={{
            background: '#f8f8f8',
            border: '1px solid #e5e7eb',
            borderRadius: '0.5rem',
            padding: '1.5rem',
            marginBottom: '2rem',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '1rem',
          }}
        >
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#6b7280', marginBottom: '0.5rem' }}>
              狀態篩選
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{
                width: '100%',
                padding: '0.5rem',
                border: '1px solid #e5e7eb',
                borderRadius: '0.375rem',
                fontSize: '0.875rem',
              }}
            >
              <option value="all">所有訂單</option>
              <option value="pending">待確認</option>
              <option value="confirmed">已確認</option>
              <option value="shipped">已出貨</option>
              <option value="delivered">已完成</option>
              <option value="cancelled">已取消</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#6b7280', marginBottom: '0.5rem' }}>
              搜尋訂單
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="搜尋訂單 ID、用戶郵箱或暱稱"
              style={{
                width: '100%',
                padding: '0.5rem',
                border: '1px solid #e5e7eb',
                borderRadius: '0.375rem',
                fontSize: '0.875rem',
              }}
            />
          </div>
        </div>

        {/* 訂單統計 */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
          {[
            { label: '待確認', count: orders.filter((o) => o.status === 'pending').length, color: '#f59e0b' },
            { label: '已確認', count: orders.filter((o) => o.status === 'confirmed').length, color: '#3b82f6' },
            { label: '已出貨', count: orders.filter((o) => o.status === 'shipped').length, color: '#3b82f6' },
            { label: '已完成', count: orders.filter((o) => o.status === 'delivered').length, color: '#10b981' },
            { label: '已取消', count: orders.filter((o) => o.status === 'cancelled').length, color: '#ef4444' },
          ].map((stat) => (
            <div
              key={stat.label}
              style={{
                background: '#f8f8f8',
                border: '1px solid #e5e7eb',
                borderRadius: '0.5rem',
                padding: '1rem',
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: stat.color, marginBottom: '0.5rem' }}>
                {stat.count}
              </div>
              <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* 訂單表格 */}
        <div
          style={{
            background: '#f8f8f8',
            border: '1px solid #e5e7eb',
            borderRadius: '0.5rem',
            overflow: 'hidden',
          }}
        >
          {loading ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: '#6b7280' }}>
              <p>載入中...</p>
            </div>
          ) : paginatedOrders.length === 0 ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: '#6b7280' }}>
              <p>沒有找到訂單</p>
            </div>
          ) : (
            <>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#e5e7eb', borderBottom: '1px solid #d1d5db' }}>
                    <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: '600', color: '#1a1a1a' }}>
                      訂單 ID
                    </th>
                    <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: '600', color: '#1a1a1a' }}>
                      用戶
                    </th>
                    <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: '600', color: '#1a1a1a' }}>
                      金額
                    </th>
                    <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: '600', color: '#1a1a1a' }}>
                      狀態
                    </th>
                    <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: '600', color: '#1a1a1a' }}>
                      建立時間
                    </th>
                    <th style={{ padding: '1rem', textAlign: 'center', fontSize: '0.875rem', fontWeight: '600', color: '#1a1a1a' }}>
                      操作
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedOrders.map((order) => (
                    <tr key={order.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                      <td style={{ padding: '1rem', fontSize: '0.875rem', color: '#1a1a1a', fontWeight: '600' }}>
                        #{order.id}
                      </td>
                      <td style={{ padding: '1rem', fontSize: '0.875rem', color: '#6b7280' }}>
                        <div>{order.user?.nickname || 'N/A'}</div>
                        <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>{order.user?.email}</div>
                      </td>
                      <td style={{ padding: '1rem', fontSize: '0.875rem', fontWeight: '600', color: '#7c3aed' }}>
                        ¥{(order.totalAmount / 100).toFixed(2)}
                      </td>
                      <td style={{ padding: '1rem', fontSize: '0.875rem' }}>
                        <span
                          style={{
                            display: 'inline-block',
                            padding: '0.25rem 0.75rem',
                            background: getStatusBadgeColor(order.status),
                            color: 'white',
                            borderRadius: '9999px',
                            fontSize: '0.75rem',
                            fontWeight: '600',
                          }}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td style={{ padding: '1rem', fontSize: '0.875rem', color: '#6b7280' }}>
                        {new Date(order.createdAt).toLocaleDateString('zh-TW')}
                      </td>
                      <td style={{ padding: '1rem', textAlign: 'center' }}>
                        <Link
                          href={`/admin/orders/${order.id}`}
                          style={{
                            padding: '0.25rem 0.75rem',
                            background: '#7c3aed',
                            color: 'white',
                            border: 'none',
                            borderRadius: '0.375rem',
                            cursor: 'pointer',
                            fontSize: '0.75rem',
                            fontWeight: '600',
                            textDecoration: 'none',
                            display: 'inline-block',
                          }}
                        >
                          查看詳情
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* 分頁 */}
              {totalPages > 1 && (
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '1.5rem',
                    borderTop: '1px solid #e5e7eb',
                  }}
                >
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    style={{
                      padding: '0.5rem 1rem',
                      background: currentPage === 1 ? '#d1d5db' : '#7c3aed',
                      color: 'white',
                      border: 'none',
                      borderRadius: '0.375rem',
                      cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                      fontSize: '0.875rem',
                      fontWeight: '600',
                    }}
                  >
                    上一頁
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      style={{
                        padding: '0.5rem 0.75rem',
                        background: page === currentPage ? '#7c3aed' : '#f3f4f6',
                        color: page === currentPage ? 'white' : '#1a1a1a',
                        border: 'none',
                        borderRadius: '0.375rem',
                        cursor: 'pointer',
                        fontSize: '0.875rem',
                        fontWeight: '600',
                      }}
                    >
                      {page}
                    </button>
                  ))}

                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    style={{
                      padding: '0.5rem 1rem',
                      background: currentPage === totalPages ? '#d1d5db' : '#7c3aed',
                      color: 'white',
                      border: 'none',
                      borderRadius: '0.375rem',
                      cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                      fontSize: '0.875rem',
                      fontWeight: '600',
                    }}
                  >
                    下一頁
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </MainLayout>
  )
}
