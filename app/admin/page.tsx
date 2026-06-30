'use client'

import Link from 'next/link'

export default function AdminPage() {
  return (
    <div style={{ padding: '20px' }}>
      <h1>後台管理系統</h1>
      <p style={{ color: '#666', marginBottom: '30px' }}>
        歡迎使用喜萌後台管理系統。您可以在此管理商品、分類、訂單等信息。
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
        {/* 商品管理 */}
        <Link href="/admin/products">
          <div
            style={{
              padding: '20px',
              background: '#f9f9f9',
              borderRadius: '8px',
              border: '1px solid #eee',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
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
            <h3 style={{ marginBottom: '10px', color: '#333' }}>📦 商品管理</h3>
            <p style={{ color: '#666', fontSize: '14px' }}>
              新增、編輯、刪除商品，管理商品信息和庫存
            </p>
          </div>
        </Link>

        {/* 分類管理 */}
        <Link href="/admin/categories">
          <div
            style={{
              padding: '20px',
              background: '#f9f9f9',
              borderRadius: '8px',
              border: '1px solid #eee',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
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
            <h3 style={{ marginBottom: '10px', color: '#333' }}>🏷️ 分類管理</h3>
            <p style={{ color: '#666', fontSize: '14px' }}>
              管理商品分類，設置分類順序和狀態
            </p>
          </div>
        </Link>

        {/* 訂單管理 */}
        <div
          style={{
            padding: '20px',
            background: '#f9f9f9',
            borderRadius: '8px',
            border: '1px solid #eee',
            opacity: 0.6,
            cursor: 'not-allowed',
          }}
        >
          <h3 style={{ marginBottom: '10px', color: '#999' }}>📋 訂單管理</h3>
          <p style={{ color: '#999', fontSize: '14px' }}>
            查看和管理訂單信息（即將推出）
          </p>
        </div>

        {/* 優惠券管理 */}
        <div
          style={{
            padding: '20px',
            background: '#f9f9f9',
            borderRadius: '8px',
            border: '1px solid #eee',
            opacity: 0.6,
            cursor: 'not-allowed',
          }}
        >
          <h3 style={{ marginBottom: '10px', color: '#999' }}>🎟️ 優惠券管理</h3>
          <p style={{ color: '#999', fontSize: '14px' }}>
            創建和管理優惠券（即將推出）
          </p>
        </div>

        {/* 用戶管理 */}
        <div
          style={{
            padding: '20px',
            background: '#f9f9f9',
            borderRadius: '8px',
            border: '1px solid #eee',
            opacity: 0.6,
            cursor: 'not-allowed',
          }}
        >
          <h3 style={{ marginBottom: '10px', color: '#999' }}>👥 用戶管理</h3>
          <p style={{ color: '#999', fontSize: '14px' }}>
            管理用戶信息和權限（即將推出）
          </p>
        </div>

        {/* 數據統計 */}
        <div
          style={{
            padding: '20px',
            background: '#f9f9f9',
            borderRadius: '8px',
            border: '1px solid #eee',
            opacity: 0.6,
            cursor: 'not-allowed',
          }}
        >
          <h3 style={{ marginBottom: '10px', color: '#999' }}>📊 數據統計</h3>
          <p style={{ color: '#999', fontSize: '14px' }}>
            查看銷售數據和統計信息（即將推出）
          </p>
        </div>
      </div>

      {/* 系統信息 */}
      <div style={{ marginTop: '40px', padding: '20px', background: '#f5f5f5', borderRadius: '8px' }}>
        <h3 style={{ marginBottom: '15px', color: '#333' }}>系統信息</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
          <div>
            <p style={{ color: '#666', fontSize: '14px', marginBottom: '5px' }}>API 伺服器</p>
            <p style={{ color: '#333', fontWeight: 'bold' }}>
              {process.env.NEXT_PUBLIC_API_URL || 'https://maibaoshop-hqnzqh8u.manus.space'}
            </p>
          </div>
          <div>
            <p style={{ color: '#666', fontSize: '14px', marginBottom: '5px' }}>應用名稱</p>
            <p style={{ color: '#333', fontWeight: 'bold' }}>
              {process.env.NEXT_PUBLIC_APP_NAME || '喜萌'}
            </p>
          </div>
          <div>
            <p style={{ color: '#666', fontSize: '14px', marginBottom: '5px' }}>語言</p>
            <p style={{ color: '#333', fontWeight: 'bold' }}>
              {process.env.NEXT_PUBLIC_LANGUAGE || 'zh-TW'}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
