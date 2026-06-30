'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { MainLayout } from '@/components/layout'
import { getCategories } from '@/lib/api'
import type { Category } from '@/lib/types'

interface Product {
  id: number
  name: string
  description: string
  price: number
  stock: number
  categoryId: number
  status: string
  createdAt: string
  updatedAt: string
}

export default function ProductDetailPage() {
  const params = useParams()
  const router = useRouter()
  const productId = params.id as string

  const [product, setProduct] = useState<Product | null>(null)
  const [categories, setCategories] = useState<Category[]>([])
  const [quantity, setQuantity] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [addedToCart, setAddedToCart] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        // 獲取分類
        const categoriesData = await getCategories()
        const categoryList = Array.isArray(categoriesData) ? categoriesData : (categoriesData as any)?.result?.data || []
        setCategories(categoryList)

        // 模擬獲取商品詳情（實際應從 API 獲取）
        const mockProduct: Product = {
          id: Number(productId),
          name: '限定版精靈寶可夢卡牌盒',
          description: '這是一個精美的精靈寶可夢卡牌收藏盒，包含稀有卡牌和特殊配件。',
          price: 129900,
          stock: 50,
          categoryId: 1,
          status: 'published',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
        setProduct(mockProduct)
      } catch (err) {
        setError(err instanceof Error ? err.message : '載入數據失敗')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [productId])

  const handleAddToCart = () => {
    setAddedToCart(true)
    setTimeout(() => setAddedToCart(false), 2000)
  }

  const category = categories.find((c) => c.id === product?.categoryId)

  if (loading) {
    return (
      <MainLayout>
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <p>載入中...</p>
        </div>
      </MainLayout>
    )
  }

  if (error || !product) {
    return (
      <MainLayout>
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <p style={{ color: '#EF4444' }}>錯誤：{error || '商品不存在'}</p>
          <Link href="/products">
            <button
              style={{
                marginTop: '1rem',
                padding: '0.75rem 1.5rem',
                background: '#7C3AED',
                color: 'white',
                border: 'none',
                borderRadius: '0.375rem',
                cursor: 'pointer',
              }}
            >
              返回商品列表
            </button>
          </Link>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* 麵包屑 */}
        <div style={{ marginBottom: '2rem', display: 'flex', gap: '0.5rem', color: '#6B7280', fontSize: '0.875rem' }}>
          <Link href="/" style={{ color: '#7C3AED', textDecoration: 'none' }}>
            首頁
          </Link>
          <span>/</span>
          <Link href="/products" style={{ color: '#7C3AED', textDecoration: 'none' }}>
            商品
          </Link>
          <span>/</span>
          <span>{product.name}</span>
        </div>

        {/* 商品詳情 */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', marginBottom: '3rem' }}>
          {/* 商品圖片 */}
          <div
            style={{
              background: '#F8F8F8',
              borderRadius: '0.5rem',
              height: '400px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '5rem',
              border: '1px solid #E5E7EB',
            }}
          >
            📦
          </div>

          {/* 商品信息 */}
          <div>
            {/* 分類 */}
            {category && (
              <p style={{ color: '#6B7280', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                分類：<span style={{ color: '#7C3AED', fontWeight: '500' }}>{category.name}</span>
              </p>
            )}

            {/* 商品名稱 */}
            <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem', color: '#1A1A1A' }}>
              {product.name}
            </h1>

            {/* 描述 */}
            <p style={{ color: '#6B7280', fontSize: '1rem', marginBottom: '2rem', lineHeight: '1.6' }}>
              {product.description}
            </p>

            {/* 價格 */}
            <div style={{ marginBottom: '2rem', padding: '1rem', background: '#F8F8F8', borderRadius: '0.5rem' }}>
              <p style={{ color: '#6B7280', fontSize: '0.875rem', marginBottom: '0.5rem' }}>價格</p>
              <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#7C3AED' }}>
                ¥{(product.price / 100).toFixed(2)}
              </p>
            </div>

            {/* 庫存 */}
            <div style={{ marginBottom: '2rem' }}>
              <p style={{ color: '#6B7280', fontSize: '0.875rem', marginBottom: '0.5rem' }}>庫存</p>
              <p style={{ fontSize: '1.125rem', fontWeight: '500', color: '#1A1A1A' }}>
                {product.stock > 0 ? `${product.stock} 件` : '缺貨'}
              </p>
            </div>

            {/* 數量選擇 */}
            <div style={{ marginBottom: '2rem' }}>
              <p style={{ color: '#6B7280', fontSize: '0.875rem', marginBottom: '0.5rem' }}>數量</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  style={{
                    width: '40px',
                    height: '40px',
                    border: '1px solid #E5E7EB',
                    borderRadius: '0.375rem',
                    background: '#ffffff',
                    cursor: 'pointer',
                    fontSize: '1.125rem',
                  }}
                >
                  −
                </button>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                  style={{
                    width: '60px',
                    height: '40px',
                    border: '1px solid #E5E7EB',
                    borderRadius: '0.375rem',
                    textAlign: 'center',
                    fontSize: '1rem',
                  }}
                />
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  style={{
                    width: '40px',
                    height: '40px',
                    border: '1px solid #E5E7EB',
                    borderRadius: '0.375rem',
                    background: '#ffffff',
                    cursor: 'pointer',
                    fontSize: '1.125rem',
                  }}
                >
                  +
                </button>
              </div>
            </div>

            {/* 加入購物車按鈕 */}
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                style={{
                  flex: 1,
                  padding: '1rem',
                  background: product.stock === 0 ? '#9CA3AF' : '#7C3AED',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.375rem',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: product.stock === 0 ? 'not-allowed' : 'pointer',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  if (product.stock > 0) {
                    e.currentTarget.style.background = '#EC4899'
                  }
                }}
                onMouseLeave={(e) => {
                  if (product.stock > 0) {
                    e.currentTarget.style.background = '#7C3AED'
                  }
                }}
              >
                {addedToCart ? '✓ 已加入購物車' : '加入購物車'}
              </button>
              <button
                style={{
                  padding: '1rem 2rem',
                  background: '#F8F8F8',
                  color: '#7C3AED',
                  border: '2px solid #7C3AED',
                  borderRadius: '0.375rem',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#F3E8FF'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#F8F8F8'
                }}
              >
                ♡ 收藏
              </button>
            </div>

            {/* 狀態提示 */}
            {product.stock === 0 && (
              <p style={{ marginTop: '1rem', color: '#EF4444', fontSize: '0.875rem' }}>
                ⚠️ 此商品暫時缺貨
              </p>
            )}
          </div>
        </div>

        {/* 商品詳細信息 */}
        <div style={{ background: '#F8F8F8', padding: '2rem', borderRadius: '0.5rem', marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem', color: '#1A1A1A' }}>
            商品詳細信息
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
            <div>
              <p style={{ color: '#6B7280', fontSize: '0.875rem', marginBottom: '0.25rem' }}>商品 ID</p>
              <p style={{ color: '#1A1A1A', fontWeight: '500' }}>{product.id}</p>
            </div>
            <div>
              <p style={{ color: '#6B7280', fontSize: '0.875rem', marginBottom: '0.25rem' }}>狀態</p>
              <p style={{ color: '#1A1A1A', fontWeight: '500' }}>
                {product.status === 'published' ? '已上架' : '草稿'}
              </p>
            </div>
            <div>
              <p style={{ color: '#6B7280', fontSize: '0.875rem', marginBottom: '0.25rem' }}>建立時間</p>
              <p style={{ color: '#1A1A1A', fontWeight: '500' }}>
                {new Date(product.createdAt).toLocaleDateString('zh-TW')}
              </p>
            </div>
            <div>
              <p style={{ color: '#6B7280', fontSize: '0.875rem', marginBottom: '0.25rem' }}>更新時間</p>
              <p style={{ color: '#1A1A1A', fontWeight: '500' }}>
                {new Date(product.updatedAt).toLocaleDateString('zh-TW')}
              </p>
            </div>
          </div>
        </div>

        {/* 返回按鈕 */}
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
            ← 返回商品列表
          </button>
        </Link>
      </div>
    </MainLayout>
  )
}
