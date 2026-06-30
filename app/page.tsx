'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { MainLayout } from '@/components/layout'

export default function Home() {
  const appName = process.env.NEXT_PUBLIC_APP_NAME || '喜萌'
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://maibaoshop-hqnzqh8u.manus.space'
  const [apiStatus, setApiStatus] = useState<'loading' | 'connected' | 'error'>('loading')

  // Check API connectivity
  useEffect(() => {
    const checkApi = async () => {
      try {
        const response = await fetch(`${apiUrl}/health`, { method: 'GET' })
        setApiStatus(response.ok ? 'connected' : 'error')
      } catch (error) {
        setApiStatus('error')
      }
    }

    checkApi()
  }, [apiUrl])

  return (
    <MainLayout showHeader={false} showFooter={true}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* 英雄區 */}
        <section
          style={{
            background: 'linear-gradient(135deg, #7C3AED 0%, #EC4899 100%)',
            borderRadius: '1rem',
            padding: '4rem 2rem',
            textAlign: 'center',
            color: 'white',
            marginBottom: '3rem',
          }}
        >
          <h1 style={{ fontSize: '3rem', fontWeight: 'bold', marginBottom: '1rem' }}>
            ⚡ 夢開始的地方 ⚡
          </h1>
          <p style={{ fontSize: '1.25rem', marginBottom: '2rem', opacity: 0.9 }}>
            發現最新的限定版卡牌、收藏品和獨家商品
          </p>
          <Link href="/products">
            <button
              style={{
                padding: '1rem 2rem',
                background: 'white',
                color: '#7C3AED',
                border: 'none',
                borderRadius: '0.5rem',
                fontSize: '1.125rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.05)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)'
              }}
            >
              立即購物
            </button>
          </Link>
        </section>

        {/* 功能區 */}
        <section style={{ marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '2rem', color: '#1A1A1A' }}>
            為什麼選擇喜萌？
          </h2>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '1.5rem',
            }}
          >
            {[
              { icon: '✨', title: '優質商品', desc: '精選全球限定版商品' },
              { icon: '🚀', title: '快速配送', desc: '24小時內發貨' },
              { icon: '🔒', title: '安全支付', desc: '多種支付方式' },
              { icon: '📞', title: '24/7 客服', desc: '隨時為您服務' },
              { icon: '🎁', title: '會員優惠', desc: '獨家會員折扣' },
              { icon: '🔗', title: '無縫整合', desc: 'App 和網站同步' },
            ].map((feature, index) => (
              <div
                key={index}
                style={{
                  background: '#F8F8F8',
                  padding: '2rem',
                  borderRadius: '0.75rem',
                  border: '1px solid #E5E7EB',
                  textAlign: 'center',
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
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>{feature.icon}</div>
                <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '0.5rem', color: '#1A1A1A' }}>
                  {feature.title}
                </h3>
                <p style={{ color: '#6B7280', fontSize: '0.875rem' }}>{feature.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 分類區 */}
        <section style={{ marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '2rem', color: '#1A1A1A' }}>
            熱門分類
          </h2>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
              gap: '1rem',
            }}
          >
            {[
              { name: '電子產品', emoji: '📱' },
              { name: '服裝', emoji: '👕' },
              { name: '家居用品', emoji: '🏠' },
              { name: '美妝', emoji: '💄' },
              { name: '食品飲料', emoji: '🍔' },
              { name: '運動', emoji: '⚽' },
            ].map((category, index) => (
              <Link key={index} href="/products">
                <div
                  style={{
                    background: '#F8F8F8',
                    padding: '2rem',
                    borderRadius: '0.75rem',
                    textAlign: 'center',
                    cursor: 'pointer',
                    border: '1px solid #E5E7EB',
                    transition: 'all 0.3s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#F3E8FF'
                    e.currentTarget.style.borderColor = '#7C3AED'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = '#F8F8F8'
                    e.currentTarget.style.borderColor = '#E5E7EB'
                  }}
                >
                  <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>{category.emoji}</div>
                  <p style={{ fontWeight: '500', color: '#1A1A1A' }}>{category.name}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* 下載區 */}
        <section
          style={{
            background: '#F8F8F8',
            padding: '3rem 2rem',
            borderRadius: '1rem',
            textAlign: 'center',
            marginBottom: '3rem',
          }}
        >
          <h2 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem', color: '#1A1A1A' }}>
            下載喜萌 App
          </h2>
          <p style={{ fontSize: '1rem', color: '#6B7280', marginBottom: '2rem' }}>
            隨時隨地購物，享受更好的體驗
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              style={{
                padding: '1rem 2rem',
                background: '#1A1A1A',
                color: 'white',
                border: 'none',
                borderRadius: '0.5rem',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#333'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#1A1A1A'
              }}
            >
              📱 App Store
            </button>
            <button
              style={{
                padding: '1rem 2rem',
                background: '#7C3AED',
                color: 'white',
                border: 'none',
                borderRadius: '0.5rem',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#EC4899'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#7C3AED'
              }}
            >
              🤖 Google Play
            </button>
          </div>
        </section>

        {/* API 狀態 */}
        <section
          style={{
            background: '#F8F8F8',
            padding: '1.5rem',
            borderRadius: '0.75rem',
            border: '1px solid #E5E7EB',
            fontSize: '0.875rem',
            color: '#6B7280',
          }}
        >
          <p style={{ marginBottom: '0.5rem' }}>
            <strong>API 伺服器狀態：</strong>{' '}
            <span
              style={{
                display: 'inline-block',
                padding: '0.25rem 0.75rem',
                borderRadius: '9999px',
                background: apiStatus === 'connected' ? '#D1FAE5' : apiStatus === 'error' ? '#FEE2E2' : '#E5E7EB',
                color: apiStatus === 'connected' ? '#065F46' : apiStatus === 'error' ? '#7F1D1D' : '#374151',
                fontSize: '0.75rem',
                fontWeight: '600',
              }}
            >
              {apiStatus === 'loading' ? '檢查中...' : apiStatus === 'connected' ? '● 正常運行' : '● 連接失敗'}
            </span>
          </p>
          <p>
            <strong>API 端點：</strong> {apiUrl}
          </p>
        </section>
      </div>
    </MainLayout>
  )
}
