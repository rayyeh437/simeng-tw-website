'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { MainLayout } from '@/components/layout'

const PRODUCTS_DATA: Record<string, any> = {
  '1': {
    id: '1',
    name: '限定版精靈寶可夢卡牌盒',
    category: '預購商品',
    price: 1299,
    rating: 4.8,
    reviews: 156,
    description: '這是一個限定版的精靈寶可夢卡牌收藏盒，包含獨家卡牌和精美包裝。適合收藏家和寶可夢愛好者。',
    details: [
      '包含 10 張獨家卡牌',
      '精美禮盒包裝',
      '官方授權產品',
      '限量 500 套',
      '預計 2026 年 7 月到貨',
    ],
    shopUrl: 'https://myship.7-11.com.tw/general/detail/GM2511178467088',
    relatedProducts: ['2', '3'],
  },
  '2': {
    id: '2',
    name: '特別版寶可夢公仔套組',
    category: '收藏品',
    price: 899,
    rating: 4.6,
    reviews: 89,
    description: '精緻的寶可夢公仔套組，包含 6 個不同角色的公仔。每個公仔都經過精心設計和製作。',
    details: [
      '包含 6 個公仔',
      '高品質塑膠材質',
      '適合展示和收藏',
      '官方正版授權',
      '現貨供應',
    ],
    shopUrl: 'https://myship.7-11.com.tw/general/detail/GM2511178467088',
    relatedProducts: ['1', '3'],
  },
  '3': {
    id: '3',
    name: '寶可夢卡牌收藏冊',
    category: '周邊商品',
    price: 599,
    rating: 4.7,
    reviews: 234,
    description: '高質量的寶可夢卡牌收藏冊，可容納 200 張卡牌。採用防水防塵設計。',
    details: [
      '容量 200 張卡牌',
      '防水防塵設計',
      '精美封面設計',
      '多色可選',
      '現貨供應',
    ],
    shopUrl: 'https://myship.7-11.com.tw/general/detail/GM2511178467088',
    relatedProducts: ['1', '2'],
  },
}

const SHARE_OPTIONS = [
  { id: 'line', name: 'LINE', icon: '💬', color: '#06C755' },
  { id: 'facebook', name: 'Facebook', icon: '👍', color: '#1877F2' },
  { id: 'twitter', name: 'Twitter', icon: '𝕏', color: '#000000' },
]

export default function ProductDetailPage() {
  const params = useParams()
  const router = useRouter()
  const productId = params.id as string
  const [isFavorited, setIsFavorited] = useState(false)

  const product = productId ? PRODUCTS_DATA[productId] : null

  if (!product) {
    return (
      <MainLayout>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem', textAlign: 'center' }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>
            商品未找到
          </h1>
          <Link href="/products">
            <button
              style={{
                padding: '0.75rem 1.5rem',
                background: '#7C3AED',
                color: 'white',
                border: 'none',
                borderRadius: '0.375rem',
                cursor: 'pointer',
                fontWeight: '600',
              }}
            >
              返回商品列表
            </button>
          </Link>
        </div>
      </MainLayout>
    )
  }

  const relatedProducts = product.relatedProducts
    .map((id: string) => PRODUCTS_DATA[id])
    .filter(Boolean)

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
