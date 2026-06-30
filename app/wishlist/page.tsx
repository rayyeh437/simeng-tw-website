'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { MainLayout } from '@/components/layout'
import { useAuth } from '@/hooks/use-auth'
import { useRouter } from 'next/navigation'

interface WishlistItem {
  id: number
  productId: number
  productName: string
  price: number
  originalPrice?: number
  category: string
  addedDate: string
  image?: string
}

export default function WishlistPage() {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([])
  const [loading, setLoading] = useState(true)
  const [sortBy, setSortBy] = useState<'date' | 'price'>('date')

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/auth/login')
    }
  }, [isAuthenticated, isLoading, router])

  useEffect(() => {
    // 模擬載入收藏清單
    const mockWishlist: WishlistItem[] = [
      {
        id: 1,
        productId: 1,
        productName: '限定版精靈寶可夢卡牌盒',
        price: 129900,
        originalPrice: 129900,
        category: '預購商品',
        addedDate: '2024-06-05',
      },
      {
        id: 2,
        productId: 2,
        productName: '特別版寶可夢公仔套組',
        price: 89900,
        originalPrice: 99900,
        category: '收藏品',
        addedDate: '2024-06-03',
      },
      {
        id: 3,
        productId: 3,
        productName: '寶可夢周邊商品套組',
        price: 59900,
        originalPrice: 59900,
        category: '周邊商品',
        addedDate: '2024-06-01',
      },
    ]
    setWishlistItems(mockWishlist)
    setLoading(false)
  }, [])

  const handleRemoveItem = (id: number) => {
    setWishlistItems(wishlistItems.filter((item) => item.id !== id))
  }

  const handleAddToCart = (item: WishlistItem) => {
    // 模擬添加到購物車
    alert(`已將 "${item.productName}" 添加到購物車`)
  }

  const sortedItems = [...wishlistItems].sort((a, b) => {
    if (sortBy === 'date') {
      return new Date(b.addedDate).getTime() - new Date(a.addedDate).getTime()
    } else {
      return a.price - b.price
    }
  })

  const savingsTotal = wishlistItems.reduce((sum, item) => {
    const savings = (item.originalPrice || item.price) - item.price
    return sum + savings
  }, 0)

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
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h1 style={{ color: '#1A1A1A' }}>我的收藏</h1>
          <span style={{ fontSize: '1rem', color: '#6B7280' }}>
            {wishlistItems.length} 件商品
          </span>
        </div>

        {wishlistItems.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', background: '#F8F8F8', borderRadius: '0.5rem' }}>
            <p style={{ fontSize: '1.125rem', marginBottom: '1rem', color: '#6B7280' }}>
              您的收藏清單是空的
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
          <>
            {/* 統計和排序 */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', background: '#F8F8F8', padding: '1rem', borderRadius: '0.5rem' }}>
              <div>
                <p style={{ color: '#6B7280', fontSize: '0.875rem', marginBottom: '0.25rem' }}>
                  預計節省
                </p>
                <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#22C55E' }}>
                  ¥{(savingsTotal / 100).toFixed(2)}
                </p>
              </div>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'date' | 'price')}
                style={{
                  padding: '0.5rem 1rem',
                  border: '1px solid #E5E7EB',
                  borderRadius: '0.375rem',
                  fontSize: '0.875rem',
                }}
              >
                <option value="date">最新添加</option>
                <option value="price">價格最低</option>
              </select>
            </div>

            {/* 收藏項目列表 */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {sortedItems.map((item) => {
                const savings = (item.originalPrice || item.price) - item.price
                const hasSavings = savings > 0

                return (
                  <div
                    key={item.id}
                    style={{
                      background: '#F8F8F8',
                      padding: '1.5rem',
                      borderRadius: '0.5rem',
                      border: '1px solid #E5E7EB',
                      display: 'grid',
                      gridTemplateColumns: '100px 1fr 200px',
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
                      }}
                    >
                      📦
                    </div>

                    {/* 商品信息 */}
                    <div>
                      <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.5rem', color: '#1A1A1A' }}>
                        {item.productName}
                      </h3>
                      <p style={{ color: '#6B7280', fontSize: '0.875rem', marginBottom: '0.75rem' }}>
                        分類：{item.category}
                      </p>
                      <p style={{ color: '#6B7280', fontSize: '0.875rem' }}>
                        添加日期：{new Date(item.addedDate).toLocaleDateString('zh-TW')}
                      </p>

                      {/* 價格信息 */}
                      <div style={{ marginTop: '0.75rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        <span style={{ fontSize: '1.125rem', fontWeight: 'bold', color: '#7C3AED' }}>
                          ¥{(item.price / 100).toFixed(2)}
                        </span>
                        {item.originalPrice && item.originalPrice > item.price && (
                          <>
                            <span style={{ fontSize: '0.875rem', color: '#6B7280', textDecoration: 'line-through' }}>
                              ¥{(item.originalPrice / 100).toFixed(2)}
                            </span>
                            <span style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem', background: '#FEE2E2', color: '#DC2626', borderRadius: '0.25rem' }}>
                              省 ¥{(savings / 100).toFixed(2)}
                            </span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* 操作按鈕 */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      <button
                        onClick={() => handleAddToCart(item)}
                        style={{
                          padding: '0.75rem 1rem',
                          background: '#7C3AED',
                          color: 'white',
                          border: 'none',
                          borderRadius: '0.375rem',
                          cursor: 'pointer',
                          fontSize: '0.875rem',
                          fontWeight: '600',
                        }}
                      >
                        加入購物車
                      </button>
                      <button
                        onClick={() => handleRemoveItem(item.id)}
                        style={{
                          padding: '0.75rem 1rem',
                          background: '#FEE2E2',
                          color: '#DC2626',
                          border: 'none',
                          borderRadius: '0.375rem',
                          cursor: 'pointer',
                          fontSize: '0.875rem',
                        }}
                      >
                        移除
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* 底部操作 */}
            <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <Link href="/products">
                <button
                  style={{
                    padding: '0.75rem 1.5rem',
                    background: '#F8F8F8',
                    color: '#7C3AED',
                    border: '1px solid #E5E7EB',
                    borderRadius: '0.375rem',
                    cursor: 'pointer',
                    fontSize: '1rem',
                  }}
                >
                  繼續購物
                </button>
              </Link>
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
                全部加入購物車
              </button>
            </div>
          </>
        )}
      </div>
    </MainLayout>
  )
}
