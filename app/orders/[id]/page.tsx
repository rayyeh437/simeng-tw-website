'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { MainLayout } from '@/components/layout'
import { useAuth } from '@/hooks/use-auth'

interface OrderItem {
  id: number
  productName: string
  quantity: number
  price: number
}

interface Order {
  id: number
  orderNumber: string
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  totalPrice: number
  createdAt: string
  updatedAt: string
  items: OrderItem[]
  shippingAddress: string
  trackingNumber?: string
  estimatedDelivery?: string
}

export default function OrderDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { isAuthenticated, isLoading } = useAuth()
  const orderId = params.id as string

  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/auth/login')
    }
  }, [isAuthenticated, isLoading, router])

  useEffect(() => {
    // 模擬載入訂單詳情
    const mockOrder: Order = {
      id: Number(orderId),
      orderNumber: `ORD-2024-${String(orderId).padStart(3, '0')}`,
      status: 'shipped',
      totalPrice: 259800,
      createdAt: '2024-06-15',
      updatedAt: '2024-06-20',
      items: [
        {
          id: 1,
          productName: '限定版精靈寶可夢卡牌盒',
          quantity: 2,
          price: 129900,
        },
      ],
      shippingAddress: '台灣 台北市 信義區 信義路 123 號',
      trackingNumber: 'TW123456789',
      estimatedDelivery: '2024-06-25',
    }
    setOrder(mockOrder)
    setLoading(false)
  }, [orderId])

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

  const statusSteps = [
    { key: 'pending', label: '訂單確認' },
    { key: 'processing', label: '準備中' },
    { key: 'shipped', label: '已出貨' },
    { key: 'delivered', label: '已送達' },
  ]

  if (isLoading || loading) {
    return (
      <MainLayout>
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <p>載入中...</p>
        </div>
      </MainLayout>
    )
  }

  if (!isAuthenticated || !order) {
    return null
  }

  const currentStepIndex = statusSteps.findIndex((s) => s.key === order.status)

  return (
    <MainLayout>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* 返回按鈕 */}
        <Link href="/orders">
          <button
            style={{
              marginBottom: '2rem',
              padding: '0.5rem 1rem',
              background: '#F8F8F8',
              color: '#7C3AED',
              border: '1px solid #E5E7EB',
              borderRadius: '0.375rem',
              cursor: 'pointer',
              fontSize: '0.875rem',
            }}
          >
            ← 返回訂單列表
          </button>
        </Link>

        {/* 訂單頭部 */}
        <div style={{ background: '#F8F8F8', padding: '2rem', borderRadius: '0.75rem', marginBottom: '2rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
            <div>
              <p style={{ color: '#6B7280', fontSize: '0.875rem', marginBottom: '0.25rem' }}>訂單編號</p>
              <p style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#1A1A1A' }}>
                {order.orderNumber}
              </p>
            </div>
            <div>
              <p style={{ color: '#6B7280', fontSize: '0.875rem', marginBottom: '0.25rem' }}>訂單狀態</p>
              <span
                style={{
                  display: 'inline-block',
                  padding: '0.5rem 1rem',
                  borderRadius: '9999px',
                  background: statusColors[order.status].bg,
                  color: statusColors[order.status].text,
                  fontSize: '0.875rem',
                  fontWeight: '600',
                }}
              >
                {statusLabels[order.status]}
              </span>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
            <div>
              <p style={{ color: '#6B7280', fontSize: '0.875rem', marginBottom: '0.25rem' }}>訂購日期</p>
              <p style={{ fontSize: '1rem', color: '#1A1A1A' }}>
                {new Date(order.createdAt).toLocaleDateString('zh-TW')}
              </p>
            </div>
            <div>
              <p style={{ color: '#6B7280', fontSize: '0.875rem', marginBottom: '0.25rem' }}>總金額</p>
              <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#7C3AED' }}>
                ¥{(order.totalPrice / 100).toFixed(2)}
              </p>
            </div>
          </div>
        </div>

        {/* 訂單進度 */}
        <div style={{ background: '#F8F8F8', padding: '2rem', borderRadius: '0.75rem', marginBottom: '2rem' }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '2rem', color: '#1A1A1A' }}>
            訂單進度
          </h3>

          <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative' }}>
            {/* 進度線 */}
            <div
              style={{
                position: 'absolute',
                top: '20px',
                left: '0',
                right: '0',
                height: '2px',
                background: '#E5E7EB',
                zIndex: 0,
              }}
            />
            <div
              style={{
                position: 'absolute',
                top: '20px',
                left: '0',
                width: `${(currentStepIndex / (statusSteps.length - 1)) * 100}%`,
                height: '2px',
                background: '#7C3AED',
                zIndex: 1,
                transition: 'width 0.3s ease',
              }}
            />

            {/* 進度步驟 */}
            {statusSteps.map((step, index) => (
              <div
                key={step.key}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  zIndex: 2,
                  flex: 1,
                }}
              >
                <div
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    background: index <= currentStepIndex ? '#7C3AED' : '#E5E7EB',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.25rem',
                    fontWeight: 'bold',
                    marginBottom: '0.75rem',
                  }}
                >
                  {index <= currentStepIndex ? '✓' : index + 1}
                </div>
                <p style={{ fontSize: '0.875rem', color: index <= currentStepIndex ? '#7C3AED' : '#6B7280', fontWeight: '500' }}>
                  {step.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '2rem' }}>
          {/* 主要內容 */}
          <div>
            {/* 商品列表 */}
            <div style={{ background: '#F8F8F8', padding: '2rem', borderRadius: '0.75rem', marginBottom: '2rem' }}>
              <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1.5rem', color: '#1A1A1A' }}>
                訂單商品
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {order.items.map((item) => (
                  <div
                    key={item.id}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '1rem',
                      background: '#ffffff',
                      borderRadius: '0.375rem',
                      border: '1px solid #E5E7EB',
                    }}
                  >
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flex: 1 }}>
                      <div
                        style={{
                          width: '80px',
                          height: '80px',
                          background: '#E5E7EB',
                          borderRadius: '0.375rem',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '2rem',
                        }}
                      >
                        📦
                      </div>
                      <div>
                        <h4 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.25rem', color: '#1A1A1A' }}>
                          {item.productName}
                        </h4>
                        <p style={{ color: '#6B7280', fontSize: '0.875rem' }}>
                          數量：{item.quantity}
                        </p>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right', minWidth: '100px' }}>
                      <p style={{ fontSize: '1.125rem', fontWeight: 'bold', color: '#7C3AED' }}>
                        ¥{((item.price * item.quantity) / 100).toFixed(2)}
                      </p>
                      <p style={{ fontSize: '0.875rem', color: '#6B7280' }}>
                        ¥{(item.price / 100).toFixed(2)} × {item.quantity}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 配送信息 */}
            {order.status !== 'cancelled' && (
              <div style={{ background: '#F8F8F8', padding: '2rem', borderRadius: '0.75rem' }}>
                <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1.5rem', color: '#1A1A1A' }}>
                  配送信息
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div>
                    <p style={{ color: '#6B7280', fontSize: '0.875rem', marginBottom: '0.25rem' }}>
                      收貨地址
                    </p>
                    <p style={{ color: '#1A1A1A', fontSize: '1rem' }}>
                      {order.shippingAddress}
                    </p>
                  </div>

                  {order.trackingNumber && (
                    <div>
                      <p style={{ color: '#6B7280', fontSize: '0.875rem', marginBottom: '0.25rem' }}>
                        追蹤號碼
                      </p>
                      <p style={{ color: '#1A1A1A', fontSize: '1rem', fontFamily: 'monospace' }}>
                        {order.trackingNumber}
                      </p>
                    </div>
                  )}

                  {order.estimatedDelivery && (
                    <div>
                      <p style={{ color: '#6B7280', fontSize: '0.875rem', marginBottom: '0.25rem' }}>
                        預計送達日期
                      </p>
                      <p style={{ color: '#1A1A1A', fontSize: '1rem' }}>
                        {new Date(order.estimatedDelivery).toLocaleDateString('zh-TW')}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* 側邊欄 */}
          <div>
            {/* 訂單摘要 */}
            <div style={{ background: '#F8F8F8', padding: '1.5rem', borderRadius: '0.75rem' }}>
              <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem', color: '#1A1A1A' }}>
                訂單摘要
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#6B7280' }}>小計</span>
                  <span style={{ color: '#1A1A1A', fontWeight: '500' }}>
                    ¥{(order.totalPrice / 100).toFixed(2)}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#6B7280' }}>運費</span>
                  <span style={{ color: '#1A1A1A', fontWeight: '500' }}>¥0.00</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#6B7280' }}>稅金</span>
                  <span style={{ color: '#1A1A1A', fontWeight: '500' }}>¥0.00</span>
                </div>
              </div>

              <div
                style={{
                  borderTop: '1px solid #E5E7EB',
                  paddingTop: '1rem',
                  marginTop: '1rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                }}
              >
                <span style={{ fontSize: '1.125rem', fontWeight: '600', color: '#1A1A1A' }}>合計</span>
                <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#7C3AED' }}>
                  ¥{(order.totalPrice / 100).toFixed(2)}
                </span>
              </div>

              {/* 操作按鈕 */}
              <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {order.status === 'delivered' && (
                  <button
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      background: '#7C3AED',
                      color: 'white',
                      border: 'none',
                      borderRadius: '0.375rem',
                      cursor: 'pointer',
                      fontSize: '0.875rem',
                      fontWeight: '600',
                    }}
                  >
                    再次購買
                  </button>
                )}
                <button
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    background: '#F8F8F8',
                    color: '#7C3AED',
                    border: '1px solid #E5E7EB',
                    borderRadius: '0.375rem',
                    cursor: 'pointer',
                    fontSize: '0.875rem',
                  }}
                >
                  聯絡客服
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
