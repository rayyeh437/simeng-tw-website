'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/use-auth'
import { ProtectedRoute } from '@/components/protected-route'

function AdminPageContent() {
  const router = useRouter()
  const { user, logout } = useAuth()

  const handleLogout = async () => {
    await logout()
    router.push('/auth/login')
  }

  return (
    <div style={{ padding: '20px' }}>
      {/* 頂部用戶菜單 */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', paddingBottom: '20px', borderBottom: '1px solid #eee' }}>
        <h1>後台管理系統</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <span style={{ color: '#666' }}>
            歡迎，<strong>{user?.name || user?.email}</strong>
          </span>
          <button
            onClick={handleLogout}
            style={{
              background: '#dc3545',
              color: 'white',
              padding: '8px 16px',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px',
            }}
          >
            登出
          </button>
        </div>
      </div>

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
            <p style={{ color: '#666', fontSize: '14px', marginBottom: '5px' }}>用戶角色</p>
            <p style={{ color: '#333', fontWeight: 'bold' }}>
              {user?.role === 'admin' ? '管理員' : '普通用戶'}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function AdminPage() {
  return (
    <ProtectedRoute requiredRole="admin">
      <AdminPageContent />
    </ProtectedRoute>
  )
}
