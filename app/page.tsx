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
  { icon: '⚡', title: '積極效率', description: '快速出貨、服務周到' },
  { icon: '💳', title: '安心購物', description: '貨源保證、安全交易' },
  { icon: '🛡️', title: '預購保障', description: '優惠價格、保證發貨' },
]

const CONTACT_CHANNELS = [
  {
    id: 'line',
    title: '官方 LINE 客服',
    subtitle: '點擊加入好友諮詢',
    icon: '💬',
    bgColor: '#06C755',
    url: 'https://lin.ee/WAZ74tV',
  },
  {
    id: 'email',
    title: '電子郵件',
    subtitle: 'simengco@gmail.com',
    icon: '📧',
    bgColor: '#7C3AED',
    url: 'mailto:simengco@gmail.com',
  },
  {
    id: 'instagram',
    title: 'Instagram',
    subtitle: '@simengco',
    icon: '📷',
    bgColor: '#E1306C',
    url: 'https://www.instagram.com/simengco?igsh=cmFmbm83cnoyd2lo',
  },
  {
    id: 'facebook',
    title: 'Facebook',
    subtitle: 'SIMENG',
    icon: '👍',
    bgColor: '#1877F2',
    url: 'https://www.facebook.com/profile.php?id=61590990701683',
  },
  {
    id: 'threads',
    title: 'Threads',
    subtitle: '@simengco',
    icon: '💬',
    bgColor: '#000000',
    url: 'https://www.threads.com/@simengco?igshid=NTc4MTIwNjQ2YQ==',
  },
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
              paddingBottom: '40%',
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
                        NT$1,299
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

        {/* 為什麼選擇 Simeng 和聯絡我們 - 並排 */}
        <div style={{ marginBottom: '3rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
          {/* 為什麼選擇 Simeng */}
          <div style={{ background: '#F8F8F8', padding: '3rem 2rem', borderRadius: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '3rem', gap: '0.5rem' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1A1A1A', margin: 0 }}>
                為什麼選擇
              </h2>
              <img src="/logo-full.png" alt="喜萌" style={{ height: '40px', objectFit: 'contain' }} />
              <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1A1A1A', margin: 0 }}>
                ？
              </h2>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {WHY_CHOOSE_SIMENG.map((item, index) => (
                <div key={index} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <div
                    style={{
                      width: '48px',
                      height: '48px',
                      background: '#7C3AED',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.5rem',
                      flexShrink: 0,
                    }}
                  >
                    {item.icon}
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.25rem', color: '#1A1A1A' }}>
                      {item.title}
                    </h3>
                    <p style={{ color: '#6B7280', fontSize: '0.875rem', margin: 0 }}>
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 聯絡我們 */}
          <div style={{ background: '#F8F8F8', padding: '3rem 2rem', borderRadius: '0.75rem' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '3rem', color: '#1A1A1A', margin: 0 }}>
              聯絡我們
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
              {CONTACT_CHANNELS.map((channel) => (
              <a
                key={channel.id}
                href={channel.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex',
                  gap: '1rem',
                  alignItems: 'center',
                  padding: '1rem',
                  background: '#F8F8F8',
                  borderRadius: '0.75rem',
                  border: '1px solid #E5E7EB',
                  textDecoration: 'none',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)'
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = 'none'
                }}
              >
                <div
                  style={{
                    width: '48px',
                    height: '48px',
                    background: channel.bgColor,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.5rem',
                    flexShrink: 0,
                  }}
                >
                  {channel.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.25rem', color: '#1A1A1A', margin: 0 }}>
                    {channel.title}
                  </h3>
                  <p style={{ color: '#7C3AED', fontSize: '0.875rem', margin: 0 }}>
                    {channel.subtitle}
                  </p>
                </div>
              </a>
              ))}
            </div>
          </div>
        </div>

        {/* 下載應用 */}
        <div style={{ marginBottom: '3rem', textAlign: 'center' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem', color: '#1A1A1A' }}>
            立即下載APP
          </h2>
          <p style={{ color: '#6B7280', marginBottom: '2rem' }}>
            在 iOS 和 Android 上享受完整的購物體驗
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <a href="https://apps.apple.com" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', display: 'inline-block' }}>
              <img src="/app-store-badge.png" alt="Download on the App Store" style={{ width: '180px', objectFit: 'contain' }} />
            </a>
            <a href="https://play.google.com" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', display: 'inline-block' }}>
              <img src="/google-play-badge.jpg" alt="Get it on Google Play" style={{ width: '180px', objectFit: 'contain' }} />
            </a>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
