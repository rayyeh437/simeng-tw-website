'use client';
export const dynamic = 'force-dynamic';



import { useState } from 'react'
import { useParams } from 'next/navigation'
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
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '1rem 0',
            marginBottom: '2rem',
            borderBottom: '1px solid #E5E7EB',
          }}
        >
          <Link href="/products">
            <button
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: '1.5rem',
              }}
            >
              ←
            </button>
          </Link>
          <h1 style={{ fontSize: '1.125rem', fontWeight: 'bold', color: '#1A1A1A', flex: 1, marginLeft: '1rem', margin: 0 }}>
            商品詳情
          </h1>
          <button
            onClick={() => setIsFavorited(!isFavorited)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: '1.5rem',
            }}
          >
            {isFavorited ? '❤️' : '🤍'}
          </button>
        </div>

        {/* Product Image */}
        <div
          style={{
            background: '#F8F8F8',
            padding: '2rem',
            textAlign: 'center',
            marginBottom: '2rem',
            borderRadius: '0.75rem',
          }}
        >
          <div
            style={{
              width: '192px',
              height: '192px',
              background: '#E5E7EB',
              borderRadius: '0.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '4rem',
              margin: '0 auto',
            }}
          >
            📦
          </div>
        </div>

        {/* Product Info */}
        <div style={{ paddingBottom: '2rem' }}>
          {/* Category Badge */}
          <div style={{ marginBottom: '1rem' }}>
            <span
              style={{
                display: 'inline-block',
                background: '#7C3AED',
                color: 'white',
                padding: '0.25rem 0.75rem',
                borderRadius: '9999px',
                fontSize: '0.75rem',
                fontWeight: '600',
              }}
            >
              {product.category}
            </span>
          </div>

          {/* Product Name */}
          <h2 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1A1A1A', marginBottom: '1rem', margin: 0 }}>
            {product.name}
          </h2>

          {/* Rating */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', gap: '0.25rem' }}>
              {[...Array(5)].map((_, i) => (
                <span key={i} style={{ fontSize: '1rem' }}>
                  {i < Math.floor(product.rating) ? '⭐' : '☆'}
                </span>
              ))}
            </div>
            <span style={{ fontSize: '0.875rem', color: '#6B7280' }}>
              {product.rating} ({product.reviews} 評論)
            </span>
          </div>

          {/* Price */}
          <h3 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#7C3AED', marginBottom: '1.5rem', margin: 0 }}>
            NT${product.price.toLocaleString()}
          </h3>

          {/* Description */}
          <div style={{ marginBottom: '2rem' }}>
            <h4 style={{ fontSize: '0.875rem', fontWeight: '600', color: '#1A1A1A', marginBottom: '0.5rem', margin: 0 }}>
              商品描述
            </h4>
            <p style={{ fontSize: '0.875rem', color: '#6B7280', lineHeight: '1.5', margin: 0 }}>
              {product.description}
            </p>
          </div>

          {/* Details */}
          <div style={{ marginBottom: '2rem' }}>
            <h4 style={{ fontSize: '0.875rem', fontWeight: '600', color: '#1A1A1A', marginBottom: '1rem', margin: 0 }}>
              商品特色
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {product.details.map((detail: string, index: number) => (
                <div key={index} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                  <span style={{ fontSize: '1rem', marginTop: '2px', flexShrink: 0 }}>✓</span>
                  <span style={{ fontSize: '0.875rem', color: '#6B7280' }}>{detail}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2rem' }}>
            <a
              href={product.shopUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'block',
                padding: '0.75rem',
                background: '#7C3AED',
                color: 'white',
                border: 'none',
                borderRadius: '0.5rem',
                textAlign: 'center',
                fontWeight: '600',
                textDecoration: 'none',
                cursor: 'pointer',
              }}
            >
              前往購買
            </a>
            <button
              style={{
                padding: '0.75rem',
                background: 'white',
                color: '#7C3AED',
                border: '2px solid #7C3AED',
                borderRadius: '0.5rem',
                fontWeight: '600',
                cursor: 'pointer',
              }}
            >
              加入預購購物車
            </button>
          </div>

          {/* Social Share Section */}
          <div style={{ borderTop: '1px solid #E5E7EB', paddingTop: '2rem' }}>
            <h4 style={{ fontSize: '1.125rem', fontWeight: 'bold', color: '#1A1A1A', marginBottom: '1rem', margin: 0 }}>
              分享商品
            </h4>
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
              {SHARE_OPTIONS.map((option) => (
                <button
                  key={option.id}
                  style={{
                    flex: '1',
                    maxWidth: '30%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.75rem',
                    border: '1px solid #E5E7EB',
                    borderRadius: '0.5rem',
                    background: 'white',
                    cursor: 'pointer',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#F8F8F8'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'white'
                  }}
                >
                  <div
                    style={{
                      width: '48px',
                      height: '48px',
                      background: option.color,
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.5rem',
                    }}
                  >
                    {option.icon}
                  </div>
                  <span style={{ fontSize: '0.75rem', fontWeight: '600', color: '#1A1A1A' }}>
                    {option.name}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <div style={{ marginTop: '3rem', borderTop: '1px solid #E5E7EB', paddingTop: '2rem' }}>
              <h4 style={{ fontSize: '1.125rem', fontWeight: 'bold', color: '#1A1A1A', marginBottom: '1.5rem', margin: 0 }}>
                相關商品
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
                {relatedProducts.map((relatedProduct: any) => (
                  <Link key={relatedProduct.id} href={`/products/${relatedProduct.id}`}>
                    <div
                      style={{
                        background: '#F8F8F8',
                        borderRadius: '0.5rem',
                        overflow: 'hidden',
                        border: '1px solid #E5E7EB',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-4px)'
                        e.currentTarget.style.boxShadow = '0 10px 25px rgba(0,0,0,0.1)'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)'
                        e.currentTarget.style.boxShadow = 'none'
                      }}
                    >
                      <div
                        style={{
                          width: '100%',
                          paddingBottom: '100%',
                          position: 'relative',
                          background: '#E5E7EB',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '2rem',
                        }}
                      >
                        📦
                      </div>
                      <div style={{ padding: '0.75rem' }}>
                        <h5 style={{ fontSize: '0.75rem', fontWeight: '600', marginBottom: '0.25rem', color: '#1A1A1A', margin: 0 }}>
                          {relatedProduct.name}
                        </h5>
                        <p style={{ fontSize: '0.75rem', color: '#6B7280', marginBottom: '0.5rem', margin: 0 }}>
                          {relatedProduct.category}
                        </p>
                        <span style={{ fontSize: '1rem', fontWeight: 'bold', color: '#7C3AED' }}>
                          NT${relatedProduct.price}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  )
}
