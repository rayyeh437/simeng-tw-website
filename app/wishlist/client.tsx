import Link from 'next/link'
import { MainLayout } from '@/components/layout'
import { trpc } from '@/lib/trpc'
import { useAuth } from '@/hooks/use-auth'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
'use client';


interface WishlistItem {
  id: string
  productId: number
  productName: string
  price: number
  originalPrice?: number
  category: string
  addedDate: string
  image?: string
}

export function WishlistClient() {
  const { isAuthenticated, isLoading: authLoading } = useAuth()
  const router = useRouter()
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([])
  const [loading, setLoading] = useState(true)
  const [sortBy, setSortBy] = useState<'date' | 'price'>('date')
  const [removingId, setRemovingId] = useState<string | null>(null)

  // 重定向未登入用戶
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/user-login')
    }
  }, [isAuthenticated, authLoading, router])

  // 初始化願望清單 - 從 localStorage 讀取
  useEffect(() => {
    if (isAuthenticated && !authLoading) {
      try {
        const stored = localStorage.getItem('wishlist')
        if (stored) {
          const parsed = JSON.parse(stored)
          setWishlistItems(parsed)
        }
      } catch (error) {
        console.error('讀取願望清單失敗:', error)
      } finally {
        setLoading(false)
      }
    }
  }, [isAuthenticated, authLoading])

  // 保存願望清單到 localStorage
  const saveWishlist = (items: WishlistItem[]) => {
    setWishlistItems(items)
    localStorage.setItem('wishlist', JSON.stringify(items))
  }

  // 移除願望清單項目
  const handleRemoveItem = (id: string) => {
    setRemovingId(id)
    const newItems = wishlistItems.filter((item) => item.id !== id)
    saveWishlist(newItems)
    setRemovingId(null)
  }

  // 添加到購物車
  const handleAddToCart = (item: WishlistItem) => {
    try {
      // 從 localStorage 讀取購物車
      const cartStored = localStorage.getItem('cart')
      const cart = cartStored ? JSON.parse(cartStored) : { items: [], couponCode: null, couponDiscount: 0 }

      // 檢查商品是否已在購物車中
      const existingItem = cart.items.find((i: any) => i.productId === item.productId)

      if (existingItem) {
        existingItem.quantity += 1
      } else {
        cart.items.push({
          id: `${item.productId}-${Date.now()}`,
          productId: item.productId,
          productName: item.productName,
          price: item.price,
          quantity: 1,
          image: item.image,
        })
      }

      // 保存購物車
      localStorage.setItem('cart', JSON.stringify(cart))
      alert(`已將 "${item.productName}" 添加到購物車`)
    } catch (error) {
      alert('添加到購物車失敗：' + (error instanceof Error ? error.message : '未知錯誤'))
    }
  }

  // 清空願望清單
  const handleClearAll = () => {
    if (confirm('確定要清空所有願望清單項目嗎？')) {
      saveWishlist([])
    }
  }

  // 排序項目
  const sortedItems = [...wishlistItems].sort((a, b) => {
    if (sortBy === 'date') {
      return new Date(b.addedDate).getTime() - new Date(a.addedDate).getTime()
    } else {
      return a.price - b.price
    }
  })

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

  const totalPrice = wishlistItems.reduce((sum, item) => sum + item.price, 0)
  const priceReduction = wishlistItems.reduce((sum, item) => sum + ((item.originalPrice || item.price) - item.price), 0)

  return (
    <MainLayout>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
        {/* 頁面頭部 */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <div>
            <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#1a1a1a', marginBottom: '0.5rem' }}>
              願望清單
            </h1>
            <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
              {wishlistItems.length} 個商品
              {priceReduction > 0 && ` • 可節省 ¥${(priceReduction / 100).toFixed(2)}`}
            </p>
          </div>
          {wishlistItems.length > 0 && (
            <button
              onClick={handleClearAll}
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
              清空清單
            </button>
          )}
        </div>

        {/* 排序選項 */}
        {wishlistItems.length > 0 && (
          <div style={{ marginBottom: '2rem', display: 'flex', gap: '1rem' }}>
            <label style={{ fontSize: '0.875rem', fontWeight: '600', color: '#6b7280' }}>
              排序方式：
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'date' | 'price')}
              style={{
                padding: '0.5rem 1rem',
                border: '1px solid #e5e7eb',
                borderRadius: '0.375rem',
                fontSize: '0.875rem',
                cursor: 'pointer',
              }}
            >
              <option value="date">最新添加</option>
              <option value="price">價格低到高</option>
            </select>
          </div>
        )}

        {/* 加載狀態 */}
        {loading && (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#6b7280' }}>
            <p>載入中...</p>
          </div>
        )}

        {/* 空狀態 */}
        {!loading && wishlistItems.length === 0 && (
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
              願望清單是空的
            </p>
            <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '1.5rem' }}>
              瀏覽商品並將您喜歡的商品添加到願望清單
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
              瀏覽商品
            </Link>
          </div>
        )}

        {/* 願望清單項目 */}
        {!loading && wishlistItems.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1.5rem' }}>
            {sortedItems.map((item) => {
              const discount = item.originalPrice ? item.originalPrice - item.price : 0
              const discountPercent = item.originalPrice ? Math.round((discount / item.originalPrice) * 100) : 0

              return (
                <div
                  key={item.id}
                  style={{
                    background: '#f8f8f8',
                    border: '1px solid #e5e7eb',
                    borderRadius: '0.5rem',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'all 0.3s ease',
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
                  {/* 商品圖片 */}
                  <div
                    style={{
                      width: '100%',
                      height: '200px',
                      background: '#e5e7eb',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '3rem',
                      position: 'relative',
                    }}
                  >
                    📦
                    {discountPercent > 0 && (
                      <div
                        style={{
                          position: 'absolute',
                          top: '0.5rem',
                          right: '0.5rem',
                          background: '#ef4444',
                          color: 'white',
                          padding: '0.25rem 0.75rem',
                          borderRadius: '9999px',
                          fontSize: '0.75rem',
                          fontWeight: '600',
                        }}
                      >
                        -{discountPercent}%
                      </div>
                    )}
                  </div>

                  {/* 商品信息 */}
                  <div style={{ padding: '1rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <p style={{ fontSize: '0.75rem', color: '#9ca3af', marginBottom: '0.5rem' }}>
                      {item.category}
                    </p>
                    <h3 style={{ fontSize: '0.875rem', fontWeight: '600', color: '#1a1a1a', marginBottom: '0.75rem', flex: 1 }}>
                      {item.productName}
                    </h3>

                    {/* 價格 */}
                    <div style={{ marginBottom: '1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                        <span style={{ fontSize: '1rem', fontWeight: 'bold', color: '#7c3aed' }}>
                          ¥{(item.price / 100).toFixed(2)}
                        </span>
                        {item.originalPrice && item.originalPrice > item.price && (
                          <span style={{ fontSize: '0.75rem', color: '#9ca3af', textDecoration: 'line-through' }}>
                            ¥{(item.originalPrice / 100).toFixed(2)}
                          </span>
                        )}
                      </div>
                      <p style={{ fontSize: '0.75rem', color: '#9ca3af' }}>
                        添加於：{new Date(item.addedDate).toLocaleDateString('zh-TW')}
                      </p>
                    </div>

                    {/* 按鈕 */}
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button
                        onClick={() => handleAddToCart(item)}
                        style={{
                          flex: 1,
                          padding: '0.5rem',
                          background: '#7c3aed',
                          color: 'white',
                          border: 'none',
                          borderRadius: '0.375rem',
                          cursor: 'pointer',
                          fontSize: '0.75rem',
                          fontWeight: '600',
                        }}
                      >
                        加入購物車
                      </button>
                      <button
                        onClick={() => handleRemoveItem(item.id)}
                        disabled={removingId === item.id}
                        style={{
                          flex: 1,
                          padding: '0.5rem',
                          background: '#fee2e2',
                          color: '#991b1b',
                          border: 'none',
                          borderRadius: '0.375rem',
                          cursor: removingId === item.id ? 'not-allowed' : 'pointer',
                          fontSize: '0.75rem',
                          fontWeight: '600',
                          opacity: removingId === item.id ? 0.6 : 1,
                        }}
                      >
                        {removingId === item.id ? '移除中...' : '移除'}
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* 購物車提示 */}
        {!loading && wishlistItems.length > 0 && (
          <div
            style={{
              marginTop: '2rem',
              padding: '1rem',
              background: '#f0f4ff',
              border: '1px solid #dbeafe',
              borderRadius: '0.5rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div>
              <p style={{ fontSize: '0.875rem', fontWeight: '600', color: '#1e40af', marginBottom: '0.25rem' }}>
                準備好購物了嗎？
              </p>
              <p style={{ fontSize: '0.75rem', color: '#1e40af' }}>
                您的願望清單中有 {wishlistItems.length} 個商品，總價值 ¥{(totalPrice / 100).toFixed(2)}
              </p>
            </div>
            <Link
              href="/cart"
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
              查看購物車
            </Link>
          </div>
        )}
      </div>
    </MainLayout>
  )
}
