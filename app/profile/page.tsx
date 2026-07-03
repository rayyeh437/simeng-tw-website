'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { MainLayout } from '@/components/layout'
import { useAuth } from '@/hooks/use-auth'
import { useRouter } from 'next/navigation'

export default function ProfilePage() {
  const { user, isAuthenticated, isLoading, logout } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    nickname: '',
    mobile: '',
  })

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/user-login')
    }
  }, [isAuthenticated, isLoading, router])

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        nickname: user.nickname || user.name || '',
        mobile: user.mobile || '',
      })
      setLoading(false)
    }
  }, [user])

  const handleLogout = async () => {
    await logout()
    router.push('/')
  }

  const handleSave = async () => {
    // TODO: 實現保存用戶信息的 API 調用
    setIsEditing(false)
  }

  if (isLoading || loading) {
    return (
      <MainLayout>
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <p>載入中...</p>
        </div>
      </MainLayout>
    )
  }

  if (!isAuthenticated || !user) {
    return null
  }

  return (
    <MainLayout>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <h1 style={{ marginBottom: '2rem', color: '#1A1A1A' }}>個人資料</h1>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '2rem' }}>
          {/* 主要內容 */}
          <div>
            {/* 用戶卡片 */}
            <div style={{ background: '#F8F8F8', padding: '2rem', borderRadius: '0.75rem', marginBottom: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', marginBottom: '2rem' }}>
                <div
                  style={{
                    width: '100px',
                    height: '100px',
                    background: '#E5E7EB',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '3rem',
                  }}
                >
                  👤
                </div>
                <div>
                  <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.5rem', color: '#1A1A1A' }}>
                    {formData.nickname}
                  </h2>
                  <p style={{ color: '#6B7280', marginBottom: '0.5rem' }}>
                    會員編號：<strong style={{ color: '#7C3AED', fontFamily: 'monospace' }}>{user.memberCode}</strong>
                  </p>
                  <p style={{ color: '#6B7280', fontSize: '0.875rem' }}>
                    {user.email}
                  </p>
                </div>
              </div>

              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  style={{
                    padding: '0.75rem 1.5rem',
                    background: '#7C3AED',
                    color: 'white',
                    border: 'none',
                    borderRadius: '0.375rem',
                    cursor: 'pointer',
                    fontSize: '1rem',
                    fontWeight: '600',
                  }}
                >
                  編輯資料
                </button>
              ) : (
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button
                    onClick={handleSave}
                    style={{
                      padding: '0.75rem 1.5rem',
                      background: '#22C55E',
                      color: 'white',
                      border: 'none',
                      borderRadius: '0.375rem',
                      cursor: 'pointer',
                      fontSize: '1rem',
                      fontWeight: '600',
                    }}
                  >
                    保存更改
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    style={{
                      padding: '0.75rem 1.5rem',
                      background: '#D1D5DB',
                      color: '#1A1A1A',
                      border: 'none',
                      borderRadius: '0.375rem',
                      cursor: 'pointer',
                      fontSize: '1rem',
                      fontWeight: '600',
                    }}
                  >
                    取消
                  </button>
                </div>
              )}
            </div>

            {/* 個人信息 */}
            <div style={{ background: '#F8F8F8', padding: '2rem', borderRadius: '0.75rem', marginBottom: '2rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1.5rem', color: '#1A1A1A' }}>
                個人信息
              </h3>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                {/* 電子郵件 */}
                <div>
                  <label style={{ display: 'block', color: '#6B7280', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                    電子郵件
                  </label>
                  <input
                    type="email"
                    value={user.email}
                    disabled
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #E5E7EB',
                      borderRadius: '0.375rem',
                      background: '#ffffff',
                      color: '#6B7280',
                      cursor: 'not-allowed',
                    }}
                  />
                </div>

                {/* 真實姓名 */}
                <div>
                  <label style={{ display: 'block', color: '#6B7280', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                    真實姓名
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    disabled
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #E5E7EB',
                      borderRadius: '0.375rem',
                      background: '#F0F0F0',
                      color: '#6B7280',
                      cursor: 'not-allowed',
                    }}
                  />
                  <p style={{ fontSize: '0.75rem', color: '#9CA3AF', marginTop: '0.25rem' }}>
                    ℹ️ 真實姓名保存後無法修改
                  </p>
                </div>

                {/* 暱稱 */}
                <div>
                  <label style={{ display: 'block', color: '#6B7280', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                    暱稱
                  </label>
                  <input
                    type="text"
                    value={formData.nickname}
                    onChange={(e) => setFormData({ ...formData, nickname: e.target.value })}
                    disabled={!isEditing}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #E5E7EB',
                      borderRadius: '0.375rem',
                      background: isEditing ? '#ffffff' : '#F0F0F0',
                      color: '#1A1A1A',
                      cursor: isEditing ? 'text' : 'not-allowed',
                    }}
                  />
                  <p style={{ fontSize: '0.75rem', color: '#9CA3AF', marginTop: '0.25rem' }}>
                    ℹ️ 暱稱修改需等待 14 天才能再次修改
                  </p>
                </div>

                {/* 手機號碼 */}
                <div>
                  <label style={{ display: 'block', color: '#6B7280', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                    手機號碼
                  </label>
                  <input
                    type="tel"
                    value={formData.mobile}
                    onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                    disabled={!isEditing}
                    placeholder="09xxxxxxxx"
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #E5E7EB',
                      borderRadius: '0.375rem',
                      background: isEditing ? '#ffffff' : '#F0F0F0',
                      color: '#1A1A1A',
                      cursor: isEditing ? 'text' : 'not-allowed',
                    }}
                  />
                  <p style={{ fontSize: '0.75rem', color: '#9CA3AF', marginTop: '0.25rem' }}>
                    ℹ️ 手機號碼用於訂單通知和 OTP 驗證
                  </p>
                </div>

                {/* 會員編號 */}
                <div>
                  <label style={{ display: 'block', color: '#6B7280', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                    會員編號
                  </label>
                  <input
                    type="text"
                    value={user.memberCode}
                    disabled
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #E5E7EB',
                      borderRadius: '0.375rem',
                      background: '#F0F0F0',
                      color: '#7C3AED',
                      cursor: 'not-allowed',
                      fontFamily: 'monospace',
                      fontWeight: 'bold',
                    }}
                  />
                  <p style={{ fontSize: '0.75rem', color: '#9CA3AF', marginTop: '0.25rem' }}>
                    ℹ️ 唯一的會員識別碼，用於訂單和會員優惠
                  </p>
                </div>
              </div>
            </div>

            {/* 快速操作 */}
            <div style={{ background: '#F8F8F8', padding: '2rem', borderRadius: '0.75rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1.5rem', color: '#1A1A1A' }}>
                快速操作
              </h3>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <Link href="/orders">
                  <button
                    style={{
                      width: '100%',
                      padding: '1rem',
                      background: '#ffffff',
                      color: '#7C3AED',
                      border: '1px solid #E5E7EB',
                      borderRadius: '0.375rem',
                      cursor: 'pointer',
                      fontSize: '0.875rem',
                      fontWeight: '500',
                      textAlign: 'center',
                    }}
                  >
                    📦 我的訂單
                  </button>
                </Link>

                <Link href="/wishlist">
                  <button
                    style={{
                      width: '100%',
                      padding: '1rem',
                      background: '#ffffff',
                      color: '#7C3AED',
                      border: '1px solid #E5E7EB',
                      borderRadius: '0.375rem',
                      cursor: 'pointer',
                      fontSize: '0.875rem',
                      fontWeight: '500',
                      textAlign: 'center',
                    }}
                  >
                    ❤️ 我的收藏
                  </button>
                </Link>

                <Link href="/notifications">
                  <button
                    style={{
                      width: '100%',
                      padding: '1rem',
                      background: '#ffffff',
                      color: '#7C3AED',
                      border: '1px solid #E5E7EB',
                      borderRadius: '0.375rem',
                      cursor: 'pointer',
                      fontSize: '0.875rem',
                      fontWeight: '500',
                      textAlign: 'center',
                    }}
                  >
                    🔔 通知中心
                  </button>
                </Link>

                <button
                  onClick={handleLogout}
                  style={{
                    width: '100%',
                    padding: '1rem',
                    background: '#FEE2E2',
                    color: '#DC2626',
                    border: 'none',
                    borderRadius: '0.375rem',
                    cursor: 'pointer',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                  }}
                >
                  🚪 登出
                </button>
              </div>
            </div>
          </div>

          {/* 側邊欄 */}
          <div>
            {/* 帳戶安全 */}
            <div style={{ background: '#F8F8F8', padding: '1.5rem', borderRadius: '0.75rem', marginBottom: '2rem' }}>
              <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem', color: '#1A1A1A' }}>
                帳戶安全
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <button
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    background: '#ffffff',
                    color: '#7C3AED',
                    border: '1px solid #E5E7EB',
                    borderRadius: '0.375rem',
                    cursor: 'pointer',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    textAlign: 'left',
                  }}
                >
                  🔐 更改密碼
                </button>

                <button
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    background: '#ffffff',
                    color: '#7C3AED',
                    border: '1px solid #E5E7EB',
                    borderRadius: '0.375rem',
                    cursor: 'pointer',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    textAlign: 'left',
                  }}
                >
                  📱 雙因素認證
                </button>

                <button
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    background: '#ffffff',
                    color: '#7C3AED',
                    border: '1px solid #E5E7EB',
                    borderRadius: '0.375rem',
                    cursor: 'pointer',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    textAlign: 'left',
                  }}
                >
                  📋 登入歷史
                </button>
              </div>
            </div>

            {/* 幫助 */}
            <div style={{ background: '#F8F8F8', padding: '1.5rem', borderRadius: '0.75rem' }}>
              <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem', color: '#1A1A1A' }}>
                幫助
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <Link href="/faq">
                  <button
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      background: '#ffffff',
                      color: '#7C3AED',
                      border: '1px solid #E5E7EB',
                      borderRadius: '0.375rem',
                      cursor: 'pointer',
                      fontSize: '0.875rem',
                      fontWeight: '500',
                      textAlign: 'left',
                    }}
                  >
                    ❓ 常見問題
                  </button>
                </Link>

                <Link href="/contact">
                  <button
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      background: '#ffffff',
                      color: '#7C3AED',
                      border: '1px solid #E5E7EB',
                      borderRadius: '0.375rem',
                      cursor: 'pointer',
                      fontSize: '0.875rem',
                      fontWeight: '500',
                      textAlign: 'left',
                    }}
                  >
                    📧 聯絡我們
                  </button>
                </Link>

                <Link href="/privacy">
                  <button
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      background: '#ffffff',
                      color: '#7C3AED',
                      border: '1px solid #E5E7EB',
                      borderRadius: '0.375rem',
                      cursor: 'pointer',
                      fontSize: '0.875rem',
                      fontWeight: '500',
                      textAlign: 'left',
                    }}
                  >
                    📋 隱私政策
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
