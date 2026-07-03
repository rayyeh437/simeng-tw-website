'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { MainLayout } from '@/components/layout'
import { useAuth } from '@/hooks/use-auth'
import { trpc } from '@/lib/trpc'

interface CartItem {
  id: string
  productId: number
  productName: string
  price: number
  quantity: number
  image?: string
}

interface CartState {
  items: CartItem[]
  couponCode: string | null
  couponDiscount: number
}

export default function CartPage() {
  const { isAuthenticated, isLoading: authLoading } = useAuth()
  const router = useRouter()
  const [cartState, setCartState] = useState<CartState>({
    items: [],
    couponCode: null,
    couponDiscount: 0,
  })
  const [loading, setLoading] = useState(true)
  const [couponInput, setCouponInput] = useState('')
  const [validatingCoupon, setValidatingCoupon] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  // 重定向未登入用戶
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/user-login')
    }
  }, [isAuthenticated, authLoading, router])

  // 初始化購物車 - 從 localStorage 讀取
  useEffect(() => {
    if (isAuthenticated && !authLoading) {
      try {
        const stored = localStorage.getItem('cart')
        if (stored) {
          const parsed = JSON.parse(stored)
          setCartState(parsed)
        }
      } catch (error) {
        console.error('讀取購物車失敗:', error)
      } finally {
        setLoading(false)
      }
    }
  }, [isAuthenticated, authLoading])

  // 保存購物車到 localStorage
  const saveCart = (newState: CartState) => {
    setCartState(newState)
    localStorage.setItem('cart', JSON.stringify(newState))
  }

  // 驗證優惠券
  const validateCouponMutation = trpc.shares.validateCoupon.useMutation({
    onSuccess: (data: any) => {
      if (data?.success) {
        const discount = data.discount || 0
        saveCart({
          ...cartState,
          couponCode: couponInput.toUpperCase(),
          couponDiscount: discount,
        })
        setCouponInput('')
        alert('優惠券已套用')
      } else {
        alert('優惠券驗證失敗：' + (data?.message || '未知錯誤'))
      }
      setValidatingCoupon(false)
    },
    onError: (err: any) => {
      alert('優惠券驗證失敗：' + (err.message || '未知錯誤'))
      setValidatingCoupon(false)
    },
  })

  const handleUpdateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveItem(id)
    } else {
      const newItems = cartState.items.map((item) =>
        item.id === id ? { ...item, quantity } : item
      )
      saveCart({ ...cartState, items: newItems })
    }
  }

  const handleRemoveItem = (id: string) => {
    const newItems = cartState.items.filter((item) => item.id !== id)
    saveCart({ ...cartState, items: newItems })
  }

  const handleApplyCoupon = async () => {
    if (!couponInput.trim()) {
      alert('請輸入優惠券代碼')
      return
    }

    setValidatingCoupon(true)
    const totalAmount = cartState.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
    validateCouponMutation.mutate({
      couponCode: couponInput.trim().toUpperCase(),
      totalAmount: totalAmount * 100, // 轉換為分
    } as any)
  }

  const handleCheckout = async () => {
    if (cartState.items.length === 0) {
      alert('購物車是空的')
      return
    }

    setSubmitting(true)
    try {
      // 這裡應該調用結帳 API，先導向結帳頁面
      router.push('/checkout')
    } catch (error) {
      alert('結帳失敗：' + (error instanceof Error ? error.message : '未知錯誤'))
      setSubmitting(false)
    }
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

  const subtotal = cartState.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const shipping = 0
  const discount = cartState.couponDiscount
  const total = Math.max(subtotal + shipping - discount, 0)

  return (
    <MainLayout>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
        <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#1a1a1a', marginBottom: '2rem' }}>
          購物車
        </h1>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '2rem' }}>
          {/* 購物車商品列表 */}
          <div>
            {loading ? (
              <div style={{ textAlign: 'center', padding: '3rem', color: '#6b7280' }}>
                <p>載入中...</p>
              </div>
            ) : cartState.items.length === 0 ? (
              <div
                style={{
                  textAlign: 'center',
                  padding: '3rem',
                  background: '#f8f8f8',
                  border: '1px solid #e5e7eb',
                  borderRadius: '0.5rem',
                }}
              >
                <p style={{ fontSize: '1.125rem', fontWeight: '600', color: '#1a1a1a', marginBottom: '0.5rem' }}>
                  購物車是空的
                </p>
                <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '1.5rem' }}>
                  繼續購物，添加您喜歡的商品
                </p>
                <Link
                  href="/products"
                  style={{
                    padding: '0.75rem 1.5rem',
                    background: '#7c3aed',
                    color: 'white',
                    border: 'none',
                    borderRadius: '0.375rem',
                    cursor: 'pointer',
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    textDecoration: 'none',
                    display: 'inline-block',
                  }}
                >
                  繼續購物
                </Link>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {cartState.items.map((item) => (
                  <div
                    key={item.id}
                    style={{
                      background: '#f8f8f8',
                      border: '1px solid #e5e7eb',
                      borderRadius: '0.5rem',
                      padding: '1.5rem',
                      display: 'flex',
                      gap: '1.5rem',
                    }}
                  >
                    {/* 商品圖片 */}
                    <div
                      style={{
                        width: '120px',
                        height: '120px',
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

                    {/* 商品信息 */}
                    <div style={{ flex: 1 }}>
                      <h3 style={{ fontSize: '1rem', fontWeight: '600', color: '#1a1a1a', marginBottom: '0.5rem' }}>
                        {item.productName}
                      </h3>
                      <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '1rem' }}>
                        商品 ID：{item.productId}
                      </p>

                      {/* 數量和價格 */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', border: '1px solid #e5e7eb', borderRadius: '0.375rem' }}>
                          <button
                            onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                            style={{
                              padding: '0.25rem 0.5rem',
                              background: 'none',
                              border: 'none',
                              cursor: 'pointer',
                              fontSize: '1rem',
                            }}
                          >
                            −
                          </button>
                          <span style={{ padding: '0.25rem 0.75rem', fontSize: '0.875rem', fontWeight: '600' }}>
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                            style={{
                              padding: '0.25rem 0.5rem',
                              background: 'none',
                              border: 'none',
                              cursor: 'pointer',
                              fontSize: '1rem',
                            }}
                          >
                            +
                          </button>
                        </div>
                        <p style={{ fontSize: '1rem', fontWeight: '600', color: '#7c3aed', flex: 1 }}>
                          ¥{(item.price / 100).toFixed(2)}
                        </p>
                        <button
                          onClick={() => handleRemoveItem(item.id)}
                          style={{
                            padding: '0.5rem 1rem',
                            background: '#fee2e2',
                            color: '#991b1b',
                            border: 'none',
                            borderRadius: '0.375rem',
                            cursor: 'pointer',
                            fontSize: '0.875rem',
                            fontWeight: '600',
                          }}
                        >
                          移除
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 購物車摘要 */}
          <div
            style={{
              background: '#f8f8f8',
              border: '1px solid #e5e7eb',
              borderRadius: '0.5rem',
              padding: '1.5rem',
              height: 'fit-content',
              position: 'sticky',
              top: '2rem',
            }}
          >
            <h2 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#1a1a1a', marginBottom: '1.5rem' }}>
              訂單摘要
            </h2>

            {/* 價格明細 */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                <span style={{ color: '#6b7280' }}>商品小計</span>
                <span style={{ fontWeight: '600', color: '#1a1a1a' }}>¥{(subtotal / 100).toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                <span style={{ color: '#6b7280' }}>運費</span>
                <span style={{ fontWeight: '600', color: '#1a1a1a' }}>¥{(shipping / 100).toFixed(2)}</span>
              </div>
              {discount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                  <span style={{ color: '#10b981' }}>優惠券折扣</span>
                  <span style={{ fontWeight: '600', color: '#10b981' }}>-¥{(discount / 100).toFixed(2)}</span>
                </div>
              )}
            </div>

            {/* 總計 */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                paddingTop: '1rem',
                borderTop: '1px solid #e5e7eb',
                marginBottom: '1.5rem',
              }}
            >
              <span style={{ fontSize: '1rem', fontWeight: '600', color: '#1a1a1a' }}>總計</span>
              <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#7c3aed' }}>
                ¥{(total / 100).toFixed(2)}
              </span>
            </div>

            {/* 優惠券輸入 */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '600', color: '#6b7280', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
                優惠券代碼
              </label>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input
                  type="text"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                  disabled={validatingCoupon || !!cartState.couponCode}
                  style={{
                    flex: 1,
                    padding: '0.5rem',
                    border: '1px solid #e5e7eb',
                    borderRadius: '0.375rem',
                    fontSize: '0.875rem',
                    opacity: validatingCoupon || !!cartState.couponCode ? 0.5 : 1,
                  }}
                  placeholder="輸入代碼"
                />
                <button
                  onClick={handleApplyCoupon}
                  disabled={validatingCoupon || !couponInput.trim() || !!cartState.couponCode}
                  style={{
                    padding: '0.5rem 1rem',
                    background: cartState.couponCode ? '#10b981' : '#7c3aed',
                    color: 'white',
                    border: 'none',
                    borderRadius: '0.375rem',
                    cursor: validatingCoupon || !couponInput.trim() || !!cartState.couponCode ? 'not-allowed' : 'pointer',
                    fontSize: '0.75rem',
                    fontWeight: '600',
                    opacity: validatingCoupon || !couponInput.trim() || !!cartState.couponCode ? 0.6 : 1,
                  }}
                >
                  {validatingCoupon ? '驗證中...' : cartState.couponCode ? '✓ 已套用' : '套用'}
                </button>
              </div>
              {cartState.couponCode && (
                <p style={{ fontSize: '0.75rem', color: '#10b981', marginTop: '0.5rem' }}>
                  優惠券：{cartState.couponCode}
                </p>
              )}
            </div>

            {/* 結帳按鈕 */}
            <button
              onClick={handleCheckout}
              disabled={cartState.items.length === 0 || submitting}
              style={{
                width: '100%',
                padding: '0.75rem 1.5rem',
                background: cartState.items.length === 0 ? '#d1d5db' : '#7c3aed',
                color: 'white',
                border: 'none',
                borderRadius: '0.375rem',
                cursor: cartState.items.length === 0 || submitting ? 'not-allowed' : 'pointer',
                fontSize: '0.875rem',
                fontWeight: '600',
                marginBottom: '0.75rem',
              }}
            >
              {submitting ? '處理中...' : '前往結帳'}
            </button>

            <Link
              href="/products"
              style={{
                display: 'block',
                textAlign: 'center',
                padding: '0.75rem 1.5rem',
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
              繼續購物
            </Link>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
