'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { MainLayout } from '@/components/layout'

const CATEGORIES = [
  { id: 'all', name: '全部商品', icon: '📦' },
  { id: 'new', name: '新品上市', icon: '✨' },
  { id: 'hot', name: '熱銷排行', icon: '🔥' },
  { id: 'sale', name: '限時優惠', icon: '🏷️' },
  { id: 'featured', name: '精選推薦', icon: '⭐' },
  { id: 'preorder', name: '預購商品', icon: '📅' },
  { id: 'accessories', name: '周邊商品', icon: '🛍️' },
  { id: 'collectibles', name: '收藏品', icon: '💎' },
  { id: 'apparel', name: '服飾', icon: '👕' },
]

const WHY_CHOOSE_SIMENG = [
  { icon: '⚡', title: '優質商品', description: '精選全球優質商品，品質保證' },
  { icon: '🚚', title: '快速配送', description: '全台灣 3-5 天送達，免運費' },
  { icon: '🔒', title: '安全支付', description: '多種支付方式，安全有保障' },
  { icon: '💬', title: '24/7 客服', description: '隨時準備幫助您解決問題' },
  { icon: '🎁', title: '會員優惠', description: '專屬會員折扣和積分獎勵' },
  { icon: '🔗', title: '無縫整合', description: 'App 和網站數據完全同步' },
]

export default function HomePage() {
  const [currentCarouselIndex, setCurrentCarouselIndex] = useState(0)
  const [selectedCategory, setSelectedCategory] = useState('all')

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentCarouselIndex((prev) => (prev + 1) % 3)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  return (
    <MainLayout>
      {/* Logo Header */}
      <div style={{ background: '#ffffff', padding: '1.5rem', borderBottom: '1px solid #E5E7EB', textAlign: 'center' }}>
        <img src="/logo-full.png" alt="喜萌 Logo" style={{ height: '70px', objectFit: 'contain' }} />
      </div>

      {/* 搜尋欄 */}
      <div style={{ background: '#F8F8F8', padding: '1rem', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <input
              type="text"
              placeholder="搜尋商品..."
              style={{
                flex: 1,
                padding: '0.75rem 1rem',
                border: '1px solid #E5E7EB',
                borderRadius: '0.375rem',
                fontSize: '0.875rem',
              }}
            />
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
              搜尋
            </button>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* 標語 */}
        <div
          style={{
            background: 'linear-gradient(135deg, #7C3AED 0%, #EC4899 100%)',
            color: 'white',
            padding: '2rem',
            textAlign: 'center',
            margin: '2rem 0',
            borderRadius: '0.75rem',
          }}
        >
          <p style={{ fontSize: '0.75rem', fontStyle: 'italic', fontWeight: 'bold', marginBottom: '0.5rem' }}>
            ⚡ 夢開始的地方 ⚡
          </p>
        </div>

        {/* 輪播圖 */}
        <div style={{ margin: '2rem 0', position: 'relative', overflow: 'hidden', borderRadius: '0.75rem' }}>
          <div
            style={{
              position: 'relative',
              width: '100%',
              paddingBottom: '60%',
              background: '#E5E7EB',
              borderRadius: '0.75rem',
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '4rem',
            }}
          >
            🎠
          </div>

          {/* 輪播指示器 */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '1rem' }}>
            {[0, 1, 2].map((index) => (
              <button
                key={index}
                onClick={() => setCurrentCarouselIndex(index)}
                style={{
                  width: index === currentCarouselIndex ? '24px' : '8px',
                  height: '8px',
                  borderRadius: '9999px',
                  background: index === currentCarouselIndex ? '#7C3AED' : '#E5E7EB',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                }}
              />
            ))}
          </div>
        </div>

        {/* 分類菜單 */}
        <div style={{ overflowX: 'auto', marginBottom: '2rem', paddingBottom: '1rem' }}>
          <div style={{ display: 'flex', gap: '0.75rem', minWidth: 'min-content' }}>
            {CATEGORIES.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                style={{
                  padding: '0.75rem 1rem',
                  borderRadius: '9999px',
                  border: selectedCategory === category.id ? 'none' : '1px solid #E5E7EB',
                  background: selectedCategory === category.id ? '#7C3AED' : '#ffffff',
                  color: selectedCategory === category.id ? 'white' : '#1A1A1A',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  whiteSpace: 'nowrap',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                }}
              >
                <span>{category.icon}</span>
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* 精選商品 */}
        <div style={{ marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem', color: '#1A1A1A' }}>
            精選商品
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1.5rem' }}>
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Link key={i} href={`/products/${i}`}>
                <div
                  style={{
                    background: '#F8F8F8',
                    borderRadius: '0.75rem',
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
                      fontSize: '3rem',
                    }}
                  >
                    📦
                  </div>

                  <div style={{ padding: '1rem' }}>
                    <h3 style={{ fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.5rem', color: '#1A1A1A' }}>
                      限定版精靈寶可夢卡牌盒 {i}
                    </h3>
                    <p style={{ fontSize: '0.75rem', color: '#6B7280', marginBottom: '0.75rem' }}>
                      預購商品
                    </p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '1.125rem', fontWeight: 'bold', color: '#7C3AED' }}>
                        ¥1,299
                      </span>
                      <button
                        style={{
                          padding: '0.5rem 0.75rem',
                          background: '#F3E8FF',
                          color: '#7C3AED',
                          border: 'none',
                          borderRadius: '0.25rem',
                          cursor: 'pointer',
                          fontSize: '0.75rem',
                        }}
                      >
                        ❤️
                      </button>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* 為什麼選擇 Simeng */}
        <div style={{ marginBottom: '3rem', background: '#F8F8F8', padding: '3rem 2rem', borderRadius: '0.75rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '2rem', textAlign: 'center', color: '#1A1A1A' }}>
            為什麼選擇喜萌？
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
            {WHY_CHOOSE_SIMENG.map((item, index) => (
              <div key={index} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>{item.icon}</div>
                <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '0.5rem', color: '#1A1A1A' }}>
                  {item.title}
                </h3>
                <p style={{ color: '#6B7280', fontSize: '0.875rem' }}>
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* 聯絡我們 */}
        <div
          style={{
            marginBottom: '3rem',
            background: 'linear-gradient(135deg, #7C3AED 0%, #EC4899 100%)',
            color: 'white',
            padding: '3rem 2rem',
            borderRadius: '0.75rem',
          }}
        >
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem', textAlign: 'center' }}>
            聯絡我們
          </h2>
          <p style={{ textAlign: 'center', marginBottom: '2rem', opacity: 0.9 }}>
            有任何問題或建議？我們很樂意聽到您的意見
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem', marginBottom: '2rem' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>📧</div>
              <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.5rem' }}>電子郵件</h3>
              <a href="mailto:support@simeng.tw" style={{ color: 'white', textDecoration: 'underline', fontSize: '0.875rem' }}>
                support@simeng.tw
              </a>
            </div>

            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>📞</div>
              <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.5rem' }}>電話</h3>
              <a href="tel:+886-2-1234-5678" style={{ color: 'white', textDecoration: 'underline', fontSize: '0.875rem' }}>
                +886-2-1234-5678
              </a>
            </div>

            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>📱</div>
              <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.5rem' }}>社群媒體</h3>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
                <a href="https://www.instagram.com/simengco" target="_blank" rel="noopener noreferrer" style={{ color: 'white', textDecoration: 'none', fontSize: '1.5rem' }}>
                  📷
                </a>
                <a href="https://www.facebook.com/profile.php?id=61590990701683" target="_blank" rel="noopener noreferrer" style={{ color: 'white', textDecoration: 'none', fontSize: '1.5rem' }}>
                  👍
                </a>
                <a href="https://www.threads.com/@simengco" target="_blank" rel="noopener noreferrer" style={{ color: 'white', textDecoration: 'none', fontSize: '1.5rem' }}>
                  💬
                </a>
              </div>
            </div>
          </div>

          {/* 聯絡表單 */}
          <form style={{ maxWidth: '600px', margin: '0 auto' }}>
            <div style={{ marginBottom: '1rem' }}>
              <input type="text" placeholder="您的姓名" style={{ width: '100%', padding: '0.75rem', borderRadius: '0.375rem', border: 'none', fontSize: '0.875rem' }} />
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <input type="email" placeholder="您的郵箱" style={{ width: '100%', padding: '0.75rem', borderRadius: '0.375rem', border: 'none', fontSize: '0.875rem' }} />
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <textarea placeholder="您的訊息" rows={4} style={{ width: '100%', padding: '0.75rem', borderRadius: '0.375rem', border: 'none', fontSize: '0.875rem', fontFamily: 'inherit' }} />
            </div>
            <button type="submit" style={{ width: '100%', padding: '0.75rem', background: 'white', color: '#7C3AED', border: 'none', borderRadius: '0.375rem', fontWeight: '600', cursor: 'pointer' }}>
              發送訊息
            </button>
          </form>
        </div>

        {/* 下載應用 */}
        <div style={{ marginBottom: '3rem', textAlign: 'center' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem', color: '#1A1A1A' }}>
            立即下載應用
          </h2>
          <p style={{ color: '#6B7280', marginBottom: '2rem' }}>
            在 iOS 和 Android 上享受完整的購物體驗
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <a href="https://apps.apple.com" target="_blank" rel="noopener noreferrer" style={{ padding: '1rem 2rem', background: '#000000', color: 'white', borderRadius: '0.5rem', textDecoration: 'none', fontWeight: '600', display: 'inline-flex', alignItems: 'center', gap: '0.75rem' }}>
              🍎 App Store
            </a>
            <a href="https://play.google.com" target="_blank" rel="noopener noreferrer" style={{ padding: '1rem 2rem', background: '#3DDC84', color: 'white', borderRadius: '0.5rem', textDecoration: 'none', fontWeight: '600', display: 'inline-flex', alignItems: 'center', gap: '0.75rem' }}>
              🤖 Google Play
            </a>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
