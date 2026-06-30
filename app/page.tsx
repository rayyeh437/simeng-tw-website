'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

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
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      {/* Navigation */}
      <nav style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        padding: '20px 0',
        borderBottom: '1px solid #eee',
        marginBottom: '40px'
      }}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#333' }}>
          {appName}
        </h1>
        <div style={{ display: 'flex', gap: '20px' }}>
          <Link href="#features" style={{ color: '#666', textDecoration: 'none' }}>
            功能
          </Link>
          <Link href="#categories" style={{ color: '#666', textDecoration: 'none' }}>
            分類
          </Link>
          <Link href="#download" style={{ color: '#666', textDecoration: 'none' }}>
            下載
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section style={{ textAlign: 'center', marginBottom: '60px', paddingTop: '40px' }}>
        <h2 style={{ fontSize: '48px', marginBottom: '20px', color: '#333', fontWeight: 'bold' }}>
          歡迎來到 {appName}
        </h2>
        <p style={{ fontSize: '18px', color: '#666', marginBottom: '30px', lineHeight: '1.6' }}>
          發現您喜愛的商品，享受最佳購物體驗。
          <br />
          {appName} 是一款內嵌賣貨便賣場的行動應用程式，提供品牌首頁、商品瀏覽、購物車及訂單管理等功能。
        </p>
        <button
          onClick={() => {
            const appStoreUrl = 'https://apps.apple.com'
            const playStoreUrl = 'https://play.google.com'
            // 在實際應用中，這裡應該鏈接到真實的應用商店
            alert('應用即將上線！')
          }}
          style={{
            background: '#007bff',
            color: 'white',
            padding: '12px 30px',
            fontSize: '16px',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontWeight: 'bold',
            transition: 'background 0.3s ease',
          }}
          onMouseOver={(e) => (e.currentTarget.style.background = '#0056b3')}
          onMouseOut={(e) => (e.currentTarget.style.background = '#007bff')}
        >
          開始購物
        </button>
      </section>

      {/* Features Section */}
      <section id="features" style={{ marginBottom: '60px' }}>
        <h3 style={{ fontSize: '32px', marginBottom: '30px', textAlign: 'center', color: '#333', fontWeight: 'bold' }}>
          為什麼選擇 {appName}？
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '30px' }}>
          {[
            { title: '優質商品', description: '精選優質商品，品質保證' },
            { title: '快速配送', description: '快速配送，送達您家' },
            { title: '安全支付', description: '安全支付方式，保護您的信息' },
            { title: '24/7 客服', description: '隨時幫助您解決問題' },
            { title: '會員優惠', description: '專享會員折扣和優惠券' },
            { title: '無縫整合', description: '與賣貨便平台完美整合' },
          ].map((feature, index) => (
            <div
              key={index}
              style={{
                padding: '20px',
                background: '#f9f9f9',
                borderRadius: '8px',
                textAlign: 'center',
                border: '1px solid #eee',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = '#f0f0f0'
                e.currentTarget.style.transform = 'translateY(-5px)'
                e.currentTarget.style.boxShadow = '0 5px 15px rgba(0,0,0,0.1)'
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = '#f9f9f9'
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = 'none'
              }}
            >
              <h4 style={{ fontSize: '20px', marginBottom: '10px', color: '#333', fontWeight: 'bold' }}>
                {feature.title}
              </h4>
              <p style={{ color: '#666', lineHeight: '1.6' }}>
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Categories Section */}
      <section id="categories" style={{ marginBottom: '60px' }}>
        <h3 style={{ fontSize: '32px', marginBottom: '30px', textAlign: 'center', color: '#333', fontWeight: 'bold' }}>
          商品分類
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
          {['電子產品', '服裝', '家居用品', '美妝', '食品飲料', '運動'].map((category, index) => (
            <div
              key={index}
              style={{
                padding: '30px',
                background: '#f0f0f0',
                borderRadius: '8px',
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                fontWeight: 'bold',
                color: '#333',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = '#007bff'
                e.currentTarget.style.color = 'white'
                e.currentTarget.style.transform = 'scale(1.05)'
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = '#f0f0f0'
                e.currentTarget.style.color = '#333'
                e.currentTarget.style.transform = 'scale(1)'
              }}
            >
              <h4 style={{ fontSize: '18px' }}>{category}</h4>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section id="download" style={{ textAlign: 'center', marginBottom: '60px', padding: '40px', background: '#f5f5f5', borderRadius: '8px' }}>
        <h3 style={{ fontSize: '28px', marginBottom: '20px', color: '#333', fontWeight: 'bold' }}>
          下載我們的應用
        </h3>
        <p style={{ fontSize: '16px', color: '#666', marginBottom: '30px', lineHeight: '1.6' }}>
          在 iOS 和 Android 上下載 {appName} 應用，隨時隨地購物
        </p>
        <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={() => alert('App Store 連結即將推出')}
            style={{
              background: '#333',
              color: 'white',
              padding: '12px 30px',
              fontSize: '16px',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontWeight: 'bold',
              transition: 'background 0.3s ease',
            }}
            onMouseOver={(e) => (e.currentTarget.style.background = '#555')}
            onMouseOut={(e) => (e.currentTarget.style.background = '#333')}
          >
            App Store
          </button>
          <button
            onClick={() => alert('Google Play 連結即將推出')}
            style={{
              background: '#333',
              color: 'white',
              padding: '12px 30px',
              fontSize: '16px',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontWeight: 'bold',
              transition: 'background 0.3s ease',
            }}
            onMouseOver={(e) => (e.currentTarget.style.background = '#555')}
            onMouseOut={(e) => (e.currentTarget.style.background = '#333')}
          >
            Google Play
          </button>
        </div>
      </section>

      {/* Info Section */}
      <section style={{ marginBottom: '40px', padding: '20px', background: '#f9f9f9', borderRadius: '8px' }}>
        <h4 style={{ color: '#333', marginBottom: '10px', fontWeight: 'bold' }}>系統信息</h4>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
          <div>
            <p style={{ color: '#666', fontSize: '14px', marginBottom: '5px' }}>
              應用名稱：<code style={{ background: '#eee', padding: '2px 6px', borderRadius: '3px' }}>{appName}</code>
            </p>
          </div>
          <div>
            <p style={{ color: '#666', fontSize: '14px', marginBottom: '5px' }}>
              API 伺服器：<code style={{ background: '#eee', padding: '2px 6px', borderRadius: '3px' }}>{apiUrl}</code>
            </p>
          </div>
          <div>
            <p style={{ color: '#666', fontSize: '14px' }}>
              API 狀態：
              <span style={{
                display: 'inline-block',
                marginLeft: '5px',
                padding: '2px 8px',
                borderRadius: '3px',
                background: apiStatus === 'connected' ? '#d4edda' : apiStatus === 'error' ? '#f8d7da' : '#e2e3e5',
                color: apiStatus === 'connected' ? '#155724' : apiStatus === 'error' ? '#721c24' : '#383d41',
                fontSize: '12px',
                fontWeight: 'bold'
              }}>
                {apiStatus === 'loading' ? '檢查中...' : apiStatus === 'connected' ? '✓ 已連接' : '✗ 未連接'}
              </span>
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ 
        textAlign: 'center', 
        padding: '20px', 
        borderTop: '1px solid #eee',
        color: '#666',
        fontSize: '14px',
        marginTop: '40px'
      }}>
        <p>© 2024 {appName}. 版權所有。</p>
      </footer>
    </div>
  )
}
