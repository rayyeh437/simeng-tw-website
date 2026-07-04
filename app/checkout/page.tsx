'use client';
export const dynamic = 'force-dynamic';



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

interface Address {
  id: number
  userId: number
  name: string
  phone: string
  address: string
  city: string
  district: string
  zipCode: string | null
  isDefault: number
  createdAt: string
  updatedAt: string
}

interface CheckoutState {
  items: CartItem[]
  couponCode: string | null
  couponDiscount: number
}

export default function CheckoutPage() {
  const { isAuthenticated, isLoading: authLoading, user } = useAuth()
  const router = useRouter()
  const [checkoutState, setCheckoutState] = useState<CheckoutState>({
    items: [],
    couponCode: null,
    couponDiscount: 0,
  })
  const [addresses, setAddresses] = useState<Address[]>([])
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null)
  const [shippingMethod, setShippingMethod] = useState<'standard' | 'express'>('standard')
  const [paymentMethod, setPaymentMethod] = useState<'credit_card' | 'bank_transfer' | 'convenience_store'>('credit_card')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // 重定向未登入用戶
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/user-login')
    }
  }, [isAuthenticated, authLoading, router])

  // 初始化結帳狀態
  useEffect(() => {
    if (isAuthenticated && !authLoading) {
      try {
        // 從 localStorage 讀取購物車
        const cartStored = localStorage.getItem('cart')
        if (cartStored) {
          const cart = JSON.parse(cartStored)
          setCheckoutState(cart)
        }

        // 從 localStorage 讀取地址
        const addressesStored = localStorage.getItem('addresses')
        if (addressesStored) {
          const addrs = JSON.parse(addressesStored)
          setAddresses(addrs)
          // 自動選擇預設地址
          const defaultAddr = addrs.find((a: Address) => a.isDefault === 1)
          if (defaultAddr) {
            setSelectedAddressId(defaultAddr.id)
          }
        }
      } catch (error) {
        console.error('初始化結帳失敗:', error)
      } finally {
        setLoading(false)
      }
    }
  }, [isAuthenticated, authLoading])

  // 獲取地址列表
  const { data: addressList = [] } = trpc.addresses.list.useQuery(undefined as any, {
    enabled: isAuthenticated && !authLoading,
  }) as any

  useEffect(() => {
    if (addressList && addressList.length > 0) {
      setAddresses(addressList)
      // 自動選擇預設地址
      const defaultAddr = addressList.find((a: Address) => a.isDefault === 1)
      if (defaultAddr) {
        setSelectedAddressId(defaultAddr.id)
      } else if (addressList.length > 0) {
        setSelectedAddressId(addressList[0].id)
      }
    }
  }, [addressList])

  // 創建訂單 mutation
  const createOrderMutation = trpc.orders.create.useMutation({
    onSuccess: (data: any) => {
      // 清空購物車
      localStorage.removeItem('cart')
      // 導向訂單詳情頁面
      router.push(`/orders/${data.id}`)
    },
    onError: (err: any) => {
      setError(err.message || '創建訂單失敗')
      setSubmitting(false)
    },
  })

  const handleSubmitOrder = async () => {
    if (checkoutState.items.length === 0) {
      setError('購物車是空的')
      return
    }

    if (!selectedAddressId) {
      setError('請選擇收件地址')
      return
    }

    setSubmitting(true)
    setError(null)

    const selectedAddress = addresses.find((a) => a.id === selectedAddressId)
    if (!selectedAddress) {
      setError('收件地址不存在')
      setSubmitting(false)
      return
    }

    const subtotal = checkoutState.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
    const shippingCost = shippingMethod === 'express' ? 3000 : 0 // 快速配送 30 元
    const totalAmount = subtotal + shippingCost - checkoutState.couponDiscount

    createOrderMutation.mutate({
      items: checkoutState.items.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
      })),
      shippingAddress: `${selectedAddress.city} ${selectedAddress.district} ${selectedAddress.address}`,
      paymentMethod,
      couponCode: checkoutState.couponCode || undefined,
      totalAmount: Math.round(totalAmount),
      transferAmount: paymentMethod === 'bank_transfer' ? Math.round(totalAmount) : undefined,
    } as any)
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

  if (checkoutState.items.length === 0) {
    return (
      <MainLayout>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem', textAlign: 'center' }}>
          <p style={{ fontSize: '1.125rem', fontWeight: '600', color: '#1a1a1a', marginBottom: '1rem' }}>
            購物車是空的
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
      </MainLayout>
    )
  }

  const subtotal = checkoutState.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const shippingCost = shippingMethod === 'express' ? 3000 : 0
  const total = subtotal + shippingCost - checkoutState.couponDiscount

  return (
    <MainLayout>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
        <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#1a1a1a', marginBottom: '2rem' }}>
          結帳
        </h1>

        {error && (
          <div
            style={{
              background: '#fee2e2',
              border: '1px solid #fecaca',
              borderRadius: '0.5rem',
              padding: '1rem',
              marginBottom: '2rem',
              color: '#991b1b',
            }}
          >
            {error}
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '2rem' }}>
          {/* 左側：結帳信息 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {/* 收件地址 */}
            <div
              style={{
                background: '#f8f8f8',
                border: '1px solid #e5e7eb',
                borderRadius: '0.5rem',
                padding: '1.5rem',
              }}
            >
              <h2 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#1a1a1a', marginBottom: '1rem' }}>
                收件地址
              </h2>

              {addresses.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '2rem', color: '#6b7280' }}>
                  <p style={{ marginBottom: '1rem' }}>還沒有保存的地址</p>
                  <Link
                    href="/addresses/edit"
                    style={{
                      padding: '0.5rem 1rem',
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
                    新增地址
                  </Link>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {addresses.map((address) => (
                    <label
                      key={address.id}
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '1rem',
                        padding: '1rem',
                        border: selectedAddressId === address.id ? '2px solid #7c3aed' : '1px solid #e5e7eb',
                        borderRadius: '0.375rem',
                        cursor: 'pointer',
                        background: selectedAddressId === address.id ? '#f3e8ff' : '#ffffff',
                      }}
                    >
                      <input
                        type="radio"
                        name="address"
                        value={address.id}
                        checked={selectedAddressId === address.id}
                        onChange={(e) => setSelectedAddressId(Number(e.target.value))}
                        style={{ marginTop: '0.25rem', cursor: 'pointer' }}
                      />
                      <div>
                        <p style={{ fontSize: '0.875rem', fontWeight: '600', color: '#1a1a1a', marginBottom: '0.25rem' }}>
                          {address.name} {address.phone}
                        </p>
                        <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                          {address.city} {address.district} {address.address}
                        </p>
                      </div>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* 配送方式 */}
            <div
              style={{
                background: '#f8f8f8',
                border: '1px solid #e5e7eb',
                borderRadius: '0.5rem',
                padding: '1.5rem',
              }}
            >
              <h2 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#1a1a1a', marginBottom: '1rem' }}>
                配送方式
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
                  <input
                    type="radio"
                    name="shipping"
                    value="standard"
                    checked={shippingMethod === 'standard'}
                    onChange={(e) => setShippingMethod(e.target.value as 'standard' | 'express')}
                  />
                  <span style={{ fontSize: '0.875rem', color: '#1a1a1a' }}>
                    標準配送 (3-5 個工作天) - 免運費
                  </span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
                  <input
                    type="radio"
                    name="shipping"
                    value="express"
                    checked={shippingMethod === 'express'}
                    onChange={(e) => setShippingMethod(e.target.value as 'standard' | 'express')}
                  />
                  <span style={{ fontSize: '0.875rem', color: '#1a1a1a' }}>
                    快速配送 (1-2 個工作天) - 加 ¥30
                  </span>
                </label>
              </div>
            </div>

            {/* 支付方式 */}
            <div
              style={{
                background: '#f8f8f8',
                border: '1px solid #e5e7eb',
                borderRadius: '0.5rem',
                padding: '1.5rem',
              }}
            >
              <h2 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#1a1a1a', marginBottom: '1rem' }}>
                支付方式
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
                  <input
                    type="radio"
                    name="payment"
                    value="credit_card"
                    checked={paymentMethod === 'credit_card'}
                    onChange={(e) => setPaymentMethod(e.target.value as any)}
                  />
                  <span style={{ fontSize: '0.875rem', color: '#1a1a1a' }}>信用卡</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
                  <input
                    type="radio"
                    name="payment"
                    value="bank_transfer"
                    checked={paymentMethod === 'bank_transfer'}
                    onChange={(e) => setPaymentMethod(e.target.value as any)}
                  />
                  <span style={{ fontSize: '0.875rem', color: '#1a1a1a' }}>銀行轉帳</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
                  <input
                    type="radio"
                    name="payment"
                    value="convenience_store"
                    checked={paymentMethod === 'convenience_store'}
                    onChange={(e) => setPaymentMethod(e.target.value as any)}
                  />
                  <span style={{ fontSize: '0.875rem', color: '#1a1a1a' }}>便利店取貨付款</span>
                </label>
              </div>
            </div>
          </div>

          {/* 右側：訂單摘要 */}
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

            {/* 商品列表 */}
            <div style={{ marginBottom: '1.5rem', maxHeight: '300px', overflowY: 'auto' }}>
              {checkoutState.items.map((item) => (
                <div
                  key={item.id}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '0.75rem 0',
                    borderBottom: '1px solid #e5e7eb',
                    fontSize: '0.875rem',
                  }}
                >
                  <span style={{ color: '#6b7280' }}>
                    {item.productName} x{item.quantity}
                  </span>
                  <span style={{ fontWeight: '600', color: '#1a1a1a' }}>
                    ¥{((item.price * item.quantity) / 100).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            {/* 價格明細 */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                <span style={{ color: '#6b7280' }}>商品小計</span>
                <span style={{ fontWeight: '600', color: '#1a1a1a' }}>¥{(subtotal / 100).toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                <span style={{ color: '#6b7280' }}>配送費用</span>
                <span style={{ fontWeight: '600', color: '#1a1a1a' }}>¥{(shippingCost / 100).toFixed(2)}</span>
              </div>
              {checkoutState.couponDiscount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                  <span style={{ color: '#10b981' }}>優惠券折扣</span>
                  <span style={{ fontWeight: '600', color: '#10b981' }}>
                    -¥{(checkoutState.couponDiscount / 100).toFixed(2)}
                  </span>
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

            {/* 提交按鈕 */}
            <button
              onClick={handleSubmitOrder}
              disabled={submitting || addresses.length === 0}
              style={{
                width: '100%',
                padding: '0.75rem 1.5rem',
                background: addresses.length === 0 ? '#d1d5db' : '#7c3aed',
                color: 'white',
                border: 'none',
                borderRadius: '0.375rem',
                cursor: addresses.length === 0 || submitting ? 'not-allowed' : 'pointer',
                fontSize: '0.875rem',
                fontWeight: '600',
                opacity: submitting ? 0.6 : 1,
              }}
            >
              {submitting ? '提交中...' : '確認訂單'}
            </button>

            <Link
              href="/cart"
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
                marginTop: '0.75rem',
              }}
            >
              返回購物車
            </Link>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
