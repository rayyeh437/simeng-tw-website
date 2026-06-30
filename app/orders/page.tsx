'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { MainLayout } from '@/components/layout'
import { useAuth } from '@/hooks/use-auth'
import { useRouter } from 'next/navigation'

interface Order {
  id: number
  orderNumber: string
  totalPrice: number
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  createdAt: string
  items: Array<{
    productName: string
    quantity: number
    price: number
  }>
}

export default function OrdersPage() {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null)

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/auth/login')
    }
  }, [isAuthenticated, isLoading, router])

  useEffect(() => {
    // 模擬載入訂單數據
    const mockOrders: Order[] = [
      {
        id: 1,
        orderNumber: 'ORD-2024-001',
        totalPrice: 259800,
        status: 'delivered',
        createdAt: '2024-06-15',
        items: [
          {
            productName: '限定版精靈寶可夢卡牌盒',
            quantity: 2,
            price: 129900,
          },
        ],
      },
      {
        id: 2,
        orderNumber: 'ORD-2024-002',
        totalPrice: 89900,
        status: 'shipped',
        createdAt: '2024-06-20',
        items: [
          {
            productName: '遊戲王卡牌套裝',
            quantity: 1,
            price: 89900,
          },
        ],
      },
      {
        id: 3,
        orderNumber: 'ORD-2024-003',
        totalPrice: 199900,
        status: 'processing',
        createdAt: '2024-06-25',
        items: [
          {
            productName: '魔法風雲會卡牌包',
            quantity: 3,
            price: 66633,
          },
        ],
      },
    ]
    setOrders(mockOrders)
    setLoading(false)
  }, [])

  const statusLabels: Record<string, string> = {
    pending: '待處理',
    processing: '處理中',
    shipped: '已出貨',
    delivered: '已送達',
    cancelled: '已取消',
  }

  const statusColors: Record<string, { bg: string; text: string }> = {
    pending: { bg: '#FEF3C7', text: '#92400E' },
    processing: { bg: '#DBEAFE', text: '#1E40AF' },
    shipped: { bg: '#D1FAE5', text: '#065F46' },
    delivered: { bg: '#D1FAE5', text: '#065F46' },
    cancelled: { bg: '#FEE2E2', text: '#7F1D1D' },
  }

  const filteredOrders = selectedStatus
    ? orders.filter((order) => order.status === selectedStatus)
    : orders

  if (isLoading || loading) {
    return (
      <MainLayout>
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <p>載入中...</p>
        </div>
      </MainLayout>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <MainLayout>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <h1 style={{ marginBottom: '2rem', color: '#1A1A1A' }}>我的訂單</h1>

        {/* 狀態篩選 */}
        <div style={{ marginBottom: '2rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button
            onClick={() => setSelectedStatus(null)}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '9999px',
              border: selectedStatus === null ? '2px solid #7C3AED' : '1px solid #E5E7EB',
              background: selectedStatus === null ? '#F3E8FF' : '#ffffff',
              color: selectedStatus === null ? '#7C3AED' : '#6B7280',
              cursor: 'pointer',
              fontSize: '0.875rem',
              fontWeight: '500',
            }}
          >
            全部 ({orders.length})
          </button>
          {Object.entries(statusLabels).map(([key, label]) => {
            const count = orders.filter((order) => order.status === key).length
            return (
              <button
                key={key}
                onClick={() => setSelectedStatus(key)}
                style={{
                  padding: '0.5rem 1rem',
                  borderRadius: '9999px',
                  border: selectedStatus === key ? '2px solid #7C3AED' : '1px solid #E5E7EB',
                  background: selectedStatus === key ? '#F3E8FF' : '#ffffff',
                  color: selectedStatus === key ? '#7C3AED' : '#6B7280',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                }}
              >
                {label} ({count})
              </button>
            )
          })}
        </div>

        {/* 訂單列表 */}
        {filteredOrders.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', background: '#F8F8F8', borderRadius: '0.5rem' }}>
            <p style={{ fontSize: '1.125rem', marginBottom: '1rem', color: '#6B7280' }}>
              沒有找到訂單
            </p>
            <Link href="/products">
              <button
                style={{
                  padding: '0.75rem 1.5rem',
                  background: '#7C3AED',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.375rem',
                  cursor: 'pointer',
                  fontSize: '1rem',
                }}
              >
                繼續購物
              </button>
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {filteredOrders.map((order) => {
              const colors = statusColors[order.status]
              return (
                <div
                  key={order.id}
                  style={{
                    background: '#F8F8F8',
                    borderRadius: '0.5rem',
                    padding: '1.5rem',
                    border: '1px solid #E5E7EB',
                  }}
                >
                  {/* 訂單頭部 */}
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '1rem',
                      paddingBottom: '1rem',
                      borderBottom: '1px solid #E5E7EB',
                    }}
                  >
                    <div>
                      <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#1A1A1A', marginBottom: '0.25rem' }}>
                        {order.orderNumber}
                      </h3>
                      <p style={{ fontSize: '0.875rem', color: '#6B7280' }}>
                        訂購日期：{new Date(order.createdAt).toLocaleDateString('zh-TW')}
                      </p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span
                        style={{
                          display: 'inline-block',
                          padding: '0.5rem 1rem',
                          borderRadius: '9999px',
                          background: colors.bg,
                          color: colors.text,
                          fontSize: '0.875rem',
                          fontWeight: '500',
                          marginBottom: '0.5rem',
                        }}
                      >
                        {statusLabels[order.status]}
                      </span>
                      <p style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#7C3AED' }}>
                        ¥{(order.totalPrice / 100).toFixed(2)}
                      </p>
                    </div>
                  </div>

                  {/* 訂單項目 */}
                  <div style={{ marginBottom: '1rem' }}>
                    {order.items.map((item, index) => (
                      <div key={index} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                        <span style={{ color: '#1A1A1A' }}>
                          {item.productName} × {item.quantity}
                        </span>
                        <span style={{ color: '#6B7280' }}>
                          ¥{((item.price * item.quantity) / 100).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* 操作按鈕 */}
                  <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <button
                      style={{
                        padding: '0.5rem 1rem',
                        background: '#7C3AED',
                        color: 'white',
                        border: 'none',
                        borderRadius: '0.375rem',
                        cursor: 'pointer',
                        fontSize: '0.875rem',
                      }}
                    >
                      查看詳情
                    </button>
                    {order.status === 'delivered' && (
                      <button
                        style={{
                          padding: '0.5rem 1rem',
                          background: '#F8F8F8',
                          color: '#7C3AED',
                          border: '1px solid #E5E7EB',
                          borderRadius: '0.375rem',
                          cursor: 'pointer',
                          fontSize: '0.875rem',
                        }}
                      >
                        再次購買
                      </button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </MainLayout>
  )
}
