'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { MainLayout } from '@/components/layout'
import { useAuth } from '@/hooks/use-auth'
import { trpc } from '@/lib/trpc'

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

const getTimelineSteps = (status: OrderStatus): Array<{ label: string; completed: boolean }> => {
  const steps = [
    { label: '訂單已下單', completed: true },
    { label: '訂單已確認', completed: ['confirmed', 'shipped', 'delivered'].includes(status) },
    { label: '商品已出貨', completed: ['shipped', 'delivered'].includes(status) },
    { label: '配送中', completed: false },
    { label: '預計送達', completed: status === 'delivered' },
  ]
  return steps
}

export default function OrderDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { isAuthenticated, isLoading: authLoading } = useAuth()
  const orderId = params.id as string

  // 重定向未登入用戶
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/user-login')
    }
  }, [isAuthenticated, authLoading, router])

  // 獲取訂單詳情
  const { data: order, isLoading, error } = trpc.orders.get.useQuery(
    { orderId: Number(orderId) },
    {
      enabled: isAuthenticated && !authLoading && !!orderId,
    }
  ) as any

  if (authLoading || isLoading) {
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

  if (error || !order) {
    return (
      <MainLayout>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem', textAlign: 'center' }}>
          <p style={{ color: '#ef4444', marginBottom: '1rem' }}>無法加載訂單詳情</p>
          <Link href="/orders" style={{ color: '#7c3aed', textDecoration: 'none' }}>
            返回訂單列表
          </Link>
        </div>
      </MainLayout>
    )
  }

  const isPreorder = order.paymentMethod === 'bank_transfer'
  const totalPrice = order.totalAmount / 100
  const transferPrice = order.transferAmount ? order.transferAmount / 100 : totalPrice - 1
  const timelineSteps = getTimelineSteps(order.status)

  return (
    <MainLayout>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
        {/* 返回按鈕 */}
        <Link
          href="/orders"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            color: '#7c3aed',
            textDecoration: 'none',
            marginBottom: '1.5rem',
            fontSize: '0.875rem',
            fontWeight: '600',
          }}
        >
          ← 返回訂單列表
        </Link>

        {/* 訂單頭部 */}
        <div
          style={{
            background: '#f8f8f8',
            border: '1px solid #e5e7eb',
            borderRadius: '0.5rem',
            padding: '1.5rem',
            marginBottom: '2rem',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
            <div>
              <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1a1a1a', marginBottom: '0.5rem' }}>
                訂單詳情
              </h1>
              <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                訂單號：<span style={{ fontWeight: '600', color: '#1a1a1a' }}>{order.orderNumber}</span>
              </p>
              <p style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '0.25rem' }}>
                下單時間：{new Date(order.createdAt).toLocaleString('zh-TW')}
              </p>
            </div>
            <div
              style={{
                padding: '0.75rem 1.5rem',
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
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
          {/* 左側：商品和時間線 */}
          <div>
            {/* 商品列表 */}
            <div
              style={{
                background: '#f8f8f8',
                border: '1px solid #e5e7eb',
                borderRadius: '0.5rem',
                padding: '1.5rem',
                marginBottom: '2rem',
              }}
            >
              <h2 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#1a1a1a', marginBottom: '1rem' }}>
                商品信息
              </h2>
              {order.items.map((item) => (
                <div
                  key={item.id}
                  style={{
                    display: 'flex',
                    gap: '1rem',
                    padding: '1rem 0',
                    borderBottom: '1px solid #e5e7eb',
                  }}
                >
                  <div
                    style={{
                      width: '80px',
                      height: '80px',
                      background: '#e5e7eb',
                      borderRadius: '0.375rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '2rem',
                      flexShrink: 0,
                    }}
                  >
                    📦
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: '0.875rem', fontWeight: '600', color: '#1a1a1a', marginBottom: '0.25rem' }}>
                      {item.productName || '未知商品'}
                    </p>
                    <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem' }}>
                      數量：{item.quantity}
                    </p>
                    <p style={{ fontSize: '0.875rem', fontWeight: '600', color: '#7c3aed' }}>
                      ¥{(item.price / 100).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* 訂單時間線 */}
            <div
              style={{
                background: '#f8f8f8',
                border: '1px solid #e5e7eb',
                borderRadius: '0.5rem',
                padding: '1.5rem',
              }}
            >
              <h2 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#1a1a1a', marginBottom: '1.5rem' }}>
                訂單進度
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {timelineSteps.map((step, index) => (
                  <div key={index} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                    <div
                      style={{
                        width: '24px',
                        height: '24px',
                        borderRadius: '50%',
                        background: step.completed ? '#10b981' : '#e5e7eb',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontSize: '0.75rem',
                        fontWeight: 'bold',
                        flexShrink: 0,
                      }}
                    >
                      {step.completed ? '✓' : ''}
                    </div>
                    <div>
                      <p
                        style={{
                          fontSize: '0.875rem',
                          fontWeight: '600',
                          color: step.completed ? '#10b981' : '#6b7280',
                        }}
                      >
                        {step.label}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 右側：價格明細和收件信息 */}
          <div>
            {/* 價格明細 */}
            <div
              style={{
                background: '#f8f8f8',
                border: '1px solid #e5e7eb',
                borderRadius: '0.5rem',
                padding: '1.5rem',
                marginBottom: '2rem',
              }}
            >
              <h2 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#1a1a1a', marginBottom: '1rem' }}>
                價格明細
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>商品小計</span>
                  <span style={{ fontSize: '0.875rem', fontWeight: '600', color: '#1a1a1a' }}>
                    ¥{totalPrice.toFixed(2)}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>運費</span>
                  <span style={{ fontSize: '0.875rem', fontWeight: '600', color: '#1a1a1a' }}>¥0.00</span>
                </div>
                <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '0.75rem', marginTop: '0.75rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '1rem', fontWeight: '600', color: '#1a1a1a' }}>
                      {isPreorder ? '需匯款金額' : '總計'}
                    </span>
                    <span
                      style={{
                        fontSize: '1.25rem',
                        fontWeight: 'bold',
                        color: '#7c3aed',
                      }}
                    >
                      ¥{isPreorder ? transferPrice.toFixed(2) : totalPrice.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* 收件信息 */}
            <div
              style={{
                background: '#f8f8f8',
                border: '1px solid #e5e7eb',
                borderRadius: '0.5rem',
                padding: '1.5rem',
              }}
            >
              <h2 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#1a1a1a', marginBottom: '1rem' }}>
                收件信息
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <p style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.25rem', textTransform: 'uppercase' }}>
                    配送地址
                  </p>
                  <p style={{ fontSize: '0.875rem', color: '#1a1a1a', fontWeight: '600' }}>
                    {order.shippingAddress || '未提供地址'}
                  </p>
                </div>
                {isPreorder && (
                  <div
                    style={{
                      background: '#f0f4ff',
                      border: '1px solid #dbeafe',
                      borderRadius: '0.375rem',
                      padding: '1rem',
                    }}
                  >
                    <p style={{ fontSize: '0.75rem', color: '#1e40af', marginBottom: '0.25rem', fontWeight: '600' }}>
                      預購訂單
                    </p>
                    <p style={{ fontSize: '0.875rem', color: '#1e40af' }}>
                      {getPaymentStatusLabel(order.paymentStatus)}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* 操作按鈕 */}
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <Link
            href="/orders"
            style={{
              padding: '0.75rem 1.5rem',
              background: '#f3f4f6',
              color: '#1a1a1a',
              border: 'none',
              borderRadius: '0.375rem',
              cursor: 'pointer',
              fontSize: '0.875rem',
              fontWeight: '600',
              textDecoration: 'none',
              display: 'inline-block',
            }}
          >
            返回訂單列表
          </Link>
          <button
            style={{
              padding: '0.75rem 1.5rem',
              background: '#7c3aed',
              color: 'white',
              border: 'none',
              borderRadius: '0.375rem',
              cursor: 'pointer',
              fontSize: '0.875rem',
              fontWeight: '600',
            }}
            onClick={() => {
              // 聯絡客服
              alert('客服功能即將推出')
            }}
          >
            聯絡客服
          </button>
        </div>
      </div>
    </MainLayout>
  )
}
