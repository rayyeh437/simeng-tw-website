'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { MainLayout } from '@/components/layout'
import { useAuth } from '@/hooks/use-auth'
import { useRouter } from 'next/navigation'

interface CartItem {
  id: number
  productId: number
  productName: string
  price: number
  quantity: number
}

export default function CartPage() {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/auth/login')
    }
  }, [isAuthenticated, isLoading, router])

  useEffect(() => {
    // 模擬載入購物車數據
    const mockCartItems: CartItem[] = [
      {
        id: 1,
        productId: 1,
        productName: '限定版精靈寶可夢卡牌盒',
        price: 129900,
        quantity: 2,
      },
      {
        id: 2,
        productId: 2,
        productName: '遊戲王卡牌套裝',
        price: 89900,
        quantity: 1,
      },
    ]
    setCartItems(mockCartItems)
    setLoading(false)
  }, [])

  const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)

  const handleRemoveItem = (id: number) => {
    setCartItems(cartItems.filter((item) => item.id !== id))
  }

  const handleUpdateQuantity = (id: number, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveItem(id)
    } else {
      setCartItems(
        cartItems.map((item) =>
          item.id === id ? { ...item, quantity } : item
        )
      )
    }
  }

  const handleCheckout = () => {
    router.push('/checkout')
  }

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
        <h1 style={{ marginBottom: '2rem', color: '#1A1A1A' }}>購物車</h1>

        {cartItems.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', background: '#F8F8F8', borderRadius: '0.5rem' }}>
            <p style={{ fontSize: '1.125rem', marginBottom: '1rem', color: '#6B7280' }}>
              您的購物車是空的
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
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '2rem' }}>
            {/* 購物車項目 */}
            <div>
              <div style={{ background: '#F8F8F8', borderRadius: '0.5rem', overflow: 'hidden' }}>
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    style={{
                      padding: '1.5rem',
                      borderBottom: '1px solid #E5E7EB',
                      display: 'flex',
                      gap: '1.5rem',
                      alignItems: 'center',
                    }}
                  >
                    {/* 商品圖片 */}
                    <div
                      style={{
                        width: '100px',
                        height: '100px',
                        background: '#E5E7EB',
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
                      <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.5rem', color: '#1A1A1A' }}>
                        {item.productName}
                      </h3>
                      <p style={{ fontSize: '1.125rem', fontWeight: 'bold', color: '#7C3AED', marginBottom: '1rem' }}>
                        ¥{(item.price / 100).toFixed(2)}
                      </p>

                      {/* 數量控制 */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <button
                          onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                          style={{
                            width: '30px',
                            height: '30px',
                            border: '1px solid #E5E7EB',
                            borderRadius: '0.25rem',
                            background: '#ffffff',
                            cursor: 'pointer',
                            fontSize: '1rem',
                          }}
                        >
                          −
                        </button>
                        <input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => handleUpdateQuantity(item.id, Number(e.target.value))}
                          style={{
                            width: '50px',
                            height: '30px',
                            border: '1px solid #E5E7EB',
                            borderRadius: '0.25rem',
                            textAlign: 'center',
                            fontSize: '0.875rem',
                          }}
                        />
                        <button
                          onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                          style={{
                            width: '30px',
                            height: '30px',
                            border: '1px solid #E5E7EB',
                            borderRadius: '0.25rem',
                            background: '#ffffff',
                            cursor: 'pointer',
                            fontSize: '1rem',
                          }}
                        >
                          +
                        </button>
                      </div>
                    </div>

                    {/* 小計 */}
                    <div style={{ textAlign: 'right', minWidth: '100px' }}>
                      <p style={{ fontSize: '0.875rem', color: '#6B7280', marginBottom: '0.5rem' }}>小計</p>
                      <p style={{ fontSize: '1.125rem', fontWeight: 'bold', color: '#7C3AED', marginBottom: '1rem' }}>
                        ¥{((item.price * item.quantity) / 100).toFixed(2)}
                      </p>
                      <button
                        onClick={() => handleRemoveItem(item.id)}
                        style={{
                          padding: '0.25rem 0.75rem',
                          background: '#FEE2E2',
                          color: '#DC2626',
                          border: 'none',
                          borderRadius: '0.25rem',
                          cursor: 'pointer',
                          fontSize: '0.75rem',
                        }}
                      >
                        移除
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 訂單摘要 */}
            <div style={{ background: '#F8F8F8', padding: '1.5rem', borderRadius: '0.5rem', height: 'fit-content' }}>
              <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1.5rem', color: '#1A1A1A' }}>
                訂單摘要
              </h3>

              <div style={{ marginBottom: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                  <span style={{ color: '#6B7280' }}>小計</span>
                  <span style={{ color: '#1A1A1A', fontWeight: '500' }}>
                    ¥{(totalPrice / 100).toFixed(2)}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                  <span style={{ color: '#6B7280' }}>運費</span>
                  <span style={{ color: '#1A1A1A', fontWeight: '500' }}>¥0.00</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                  <span style={{ color: '#6B7280' }}>稅金</span>
                  <span style={{ color: '#1A1A1A', fontWeight: '500' }}>¥0.00</span>
                </div>
              </div>

              <div
                style={{
                  borderTop: '1px solid #E5E7EB',
                  paddingTop: '1rem',
                  marginBottom: '1.5rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                }}
              >
                <span style={{ fontSize: '1.125rem', fontWeight: '600', color: '#1A1A1A' }}>合計</span>
                <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#7C3AED' }}>
                  ¥{(totalPrice / 100).toFixed(2)}
                </span>
              </div>

              <button
                onClick={handleCheckout}
                style={{
                  width: '100%',
                  padding: '1rem',
                  background: '#7C3AED',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.375rem',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  marginBottom: '0.75rem',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#EC4899'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#7C3AED'
                }}
              >
                前往結帳
              </button>

              <Link href="/products">
                <button
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    background: '#ffffff',
                    color: '#7C3AED',
                    border: '1px solid #E5E7EB',
                    borderRadius: '0.375rem',
                    fontSize: '0.875rem',
                    cursor: 'pointer',
                  }}
                >
                  繼續購物
                </button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  )
}
