'use client';
import Link from 'next/link'
import { MainLayout } from '@/components/layout'
import { trpc } from '@/lib/trpc'
import { useAuth } from '@/hooks/use-auth'
import { useRouter } from 'next/navigation'
import { useState, useEffect, useCallback } from 'react'


type OrderStatus = 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled'
type PaymentStatus = 'awaiting_payment' | 'payment_submitted' | 'payment_verified' | 'payment_rejected'

interface OrderItem {
  id: number
  productId: number
  quantity: number
  price: number
  productName: string | null
  productImage: string | null
}

interface Order {
  id: number
  userId: number
  orderNumber: string
  totalAmount: number
  transferAmount: number | null
  status: OrderStatus
  paymentStatus: PaymentStatus | null
  paymentMethod: string | null
  bankLastFiveDigits: string | null
  paymentTime: string | null
  shippingAddress: string | null
  notes: string | null
  createdAt: string
  updatedAt: string
  items: OrderItem[]
}

const getStatusLabel = (status: OrderStatus): string => {
  const labels: Record<OrderStatus, string> = {
    pending: '待確認',
    confirmed: '已確認',
    shipped: '已出貨',
    delivered: '已完成',
    cancelled: '已取消',
  }
  return labels[status]
}

const getStatusColor = (status: OrderStatus): string => {
  const colorMap: Record<OrderStatus, string> = {
    pending: '#f59e0b',
    confirmed: '#3b82f6',
    shipped: '#3b82f6',
    delivered: '#10b981',
    cancelled: '#ef4444',
  }
  return colorMap[status]
}

const getPaymentStatusLabel = (status: PaymentStatus | null): string => {
  if (!status) return '未知'
  const labels: Record<PaymentStatus, string> = {
    awaiting_payment: '待匯款',
    payment_submitted: '已回傳匯款資訊',
    payment_verified: '訂單已正式成立',
    payment_rejected: '匯款未通過',
  }
  return labels[status]
}

const getPaymentStatusColor = (status: PaymentStatus | null): string => {
  if (!status) return '#9ca3af'
  const colorMap: Record<PaymentStatus, string> = {
    awaiting_payment: '#f59e0b',
    payment_submitted: '#3b82f6',
    payment_verified: '#10b981',
    payment_rejected: '#ef4444',
  }
  return colorMap[status]
}

export function PageClient() {
  const { isAuthenticated, isLoading: authLoading } = useAuth()
  const router = useRouter()
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus | null>(null)
  const [page, setPage] = useState(1)
  const [allOrders, setAllOrders] = useState<Order[]>([])

  // 重定向未登入用戶
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/user-login')
    }
  }, [isAuthenticated, authLoading, router])

  // 獲取訂單列表
  const { data, isLoading, refetch } = trpc.orders.list.useQuery(
    {
      page,
      pageSize: 10,
      status: selectedStatus || undefined,
    },
    {
      enabled: isAuthenticated && !authLoading,
    }
  ) as any

  // 合併訂單數據
  useEffect(() => {
    if (data?.orders) {
      if (page === 1) {
        setAllOrders(data.orders)
      } else {
        setAllOrders((prev) => [...prev, ...data.orders])
      }
    }
  }, [data, page])

  // 下拉刷新
  const handleRefresh = useCallback(() => {
    setPage(1)
    setAllOrders([])
    refetch()
  }, [refetch])

  // 加載更多
  const handleLoadMore = useCallback(() => {
    if (data?.pagination && page < data.pagination.totalPages) {
      setPage((prev) => prev + 1)
    }
  }, [data?.pagination, page])

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

  const hasMorePages = data?.pagination && page < data.pagination.totalPages

  return (
    <MainLayout>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
        <h1 style={{ marginBottom: '2rem', color: '#1a1a1a', fontSize: '1.875rem', fontWeight: 'bold' }}>
          我的訂單
        </h1>

        {/* 狀態篩選 */}
        <div style={{ marginBottom: '2rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button
            onClick={() => {
              setSelectedStatus(null)
              setPage(1)
              setAllOrders([])
              refetch()
            }}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '9999px',
              border: selectedStatus === null ? '2px solid #7c3aed' : '1px solid #e5e7eb',
              background: selectedStatus === null ? '#f3e8ff' : '#ffffff',
              color: selectedStatus === null ? '#7c3aed' : '#6b7280',
              cursor: 'pointer',
              fontSize: '0.875rem',
              fontWeight: '500',
            }}
          >
            全部
          </button>
          {(['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'] as OrderStatus[]).map(
            (status) => (
              <button
                key={status}
                onClick={() => {
                  setSelectedStatus(status)
                  setPage(1)
                  setAllOrders([])
                  refetch()
                }}
                style={{
                  padding: '0.5rem 1rem',
                  borderRadius: '9999px',
                  border: selectedStatus === status ? '2px solid #7c3aed' : '1px solid #e5e7eb',
                  background: selectedStatus === status ? '#f3e8ff' : '#ffffff',
                  color: selectedStatus === status ? '#7c3aed' : '#6b7280',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                }}
              >
                {getStatusLabel(status)}
              </button>
            )
          )}
        </div>

        {/* 加載狀態 */}
        {isLoading && allOrders.length === 0 && (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#6b7280' }}>
            <p>載入中...</p>
          </div>
        )}

        {/* 訂單列表 */}
        {!isLoading && allOrders.length === 0 && (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#6b7280' }}>
            <p style={{ fontSize: '1.125rem', marginBottom: '0.5rem' }}>還沒有訂單</p>
            <p style={{ fontSize: '0.875rem' }}>開始購物，建立您的第一個訂單</p>
          </div>
        )}

        {allOrders.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {allOrders.map((order) => {
              const isPreorder = order.paymentMethod === 'bank_transfer'
              const totalPrice = order.totalAmount / 100
              const transferPrice = order.transferAmount ? order.transferAmount / 100 : totalPrice - 1

              return (
                <Link
                  key={order.id}
                  href={`/orders/${order.id}`}
                  style={{ textDecoration: 'none' }}
                >
                  <div
                    style={{
                      background: '#f8f8f8',
                      border: '1px solid #e5e7eb',
                      borderRadius: '0.5rem',
                      padding: '1.5rem',
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
                    {/* 訂單頭部 */}
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '1rem',
                      }}
                    >
                      <div>
                        <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>
                          訂單號：{order.orderNumber}
                        </p>
                        <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                          日期：{new Date(order.createdAt).toLocaleDateString('zh-TW')}
                        </p>
                      </div>
                      <div
                        style={{
                          padding: '0.5rem 1rem',
                          borderRadius: '0.375rem',
                          background: isPreorder
                            ? getPaymentStatusColor(order.paymentStatus)
                            : getStatusColor(order.status),
                          color: 'white',
                          fontSize: '0.875rem',
                          fontWeight: '600',
                        }}
                      >
                        {isPreorder ? getPaymentStatusLabel(order.paymentStatus) : getStatusLabel(order.status)}
                      </div>
                    </div>

                    {/* 商品信息 */}
                    <div style={{ marginBottom: '1rem' }}>
                      {order.items.map((item) => (
                        <div
                          key={item.id}
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            padding: '0.5rem 0',
                            borderBottom: '1px solid #e5e7eb',
                          }}
                        >
                          <span style={{ fontSize: '0.875rem', color: '#1a1a1a', flex: 1 }}>
                            {item.productName || '未知商品'}
                          </span>
                          <span style={{ fontSize: '0.875rem', color: '#6b7280', marginRight: '1rem' }}>
                            x{item.quantity}
                          </span>
                          <span style={{ fontSize: '0.875rem', fontWeight: '600', color: '#1a1a1a' }}>
                            ¥{(item.price / 100).toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* 價格信息 */}
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        paddingTop: '1rem',
                        borderTop: '1px solid #e5e7eb',
                      }}
                    >
                      <div>
                        {isPreorder ? (
                          <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                            需匯款金額：<span style={{ fontWeight: 'bold', color: '#7c3aed' }}>
                              ¥{transferPrice.toLocaleString()}
                            </span>
                          </p>
                        ) : (
                          <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                            總金額：<span style={{ fontWeight: 'bold', color: '#1a1a1a' }}>
                              ¥{totalPrice.toLocaleString()}
                            </span>
                          </p>
                        )}
                      </div>
                      <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                        查看詳情 →
                      </p>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        )}

        {/* 加載更多按鈕 */}
        {hasMorePages && (
          <div style={{ textAlign: 'center', marginTop: '2rem' }}>
            <button
              onClick={handleLoadMore}
              disabled={isLoading}
              style={{
                padding: '0.75rem 1.5rem',
                background: '#7c3aed',
                color: 'white',
                border: 'none',
                borderRadius: '0.375rem',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                fontSize: '1rem',
                fontWeight: '600',
                opacity: isLoading ? 0.6 : 1,
              }}
            >
              {isLoading ? '載入中...' : '加載更多'}
            </button>
          </div>
        )}

        {/* 已顯示全部 */}
        {!hasMorePages && allOrders.length > 0 && (
          <div style={{ textAlign: 'center', marginTop: '2rem', color: '#6b7280' }}>
            <p>已顯示全部訂單</p>
          </div>
        )}
      </div>
    </MainLayout>
  )
}
