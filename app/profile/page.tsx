'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { MainLayout } from '@/components/layout'
import { useAuth } from '@/hooks/use-auth'
import { useRouter } from 'next/navigation'

interface UserProfile {
  id: number
  email: string
  name: string
  phone: string
  avatar?: string
  membershipNumber: string
  joinDate: string
  totalOrders: number
  totalSpent: number
}

export default function ProfilePage() {
  const { user, isAuthenticated, isLoading } = useAuth()
  const router = useRouter()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/auth/login')
    }
  }, [isAuthenticated, isLoading, router])

  useEffect(() => {
    // 模擬載入用戶資料
    const mockProfile: UserProfile = {
      id: 1,
      email: user?.email || 'user@example.com',
      name: user?.name || '用戶名稱',
      phone: '+886-9-1234-5678',
      avatar: '👤',
      membershipNumber: 'SIMENG-2024-001',
      joinDate: '2024-01-15',
      totalOrders: 5,
      totalSpent: 259800,
    }
    setProfile(mockProfile)
    setLoading(false)
  }, [user])

  if (isLoading || loading) {
    return (
      <MainLayout>
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <p>載入中...</p>
        </div>
      </MainLayout>
    )
  }

  if (!isAuthenticated || !profile) {
    return null
  }

  return (
    <MainLayout>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <h1 style={{ marginBottom: '2rem', color: '#1A1A1A' }}>我的資料</h1>

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
                  {profile.avatar}
                </div>
                <div>
                  <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.5rem', color: '#1A1A1A' }}>
                    {profile.name}
                  </h2>
                  <p style={{ color: '#6B7280', marginBottom: '0.5rem' }}>
                    會員編號：{profile.membershipNumber}
                  </p>
                  <p style={{ color: '#6B7280', fontSize: '0.875rem' }}>
                    加入日期：{new Date(profile.joinDate).toLocaleDateString('zh-TW')}
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
                <button
                  onClick={() => setIsEditing(false)}
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
              )}
            </div>

            {/* 個人信息 */}
            <div style={{ background: '#F8F8F8', padding: '2rem', borderRadius: '0.75rem', marginBottom: '2rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1.5rem', color: '#1A1A1A' }}>
                個人信息
              </h3>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                {/* 郵箱 */}
                <div>
                  <label style={{ display: 'block', color: '#6B7280', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                    郵箱
                  </label>
                  <input
                    type="email"
                    value={profile.email}
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

                {/* 姓名 */}
                <div>
                  <label style={{ display: 'block', color: '#6B7280', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                    姓名
                  </label>
                  <input
                    type="text"
                    value={profile.name}
                    disabled={!isEditing}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
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
                </div>

                {/* 電話 */}
                <div>
                  <label style={{ display: 'block', color: '#6B7280', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                    電話
                  </label>
                  <input
                    type="tel"
                    value={profile.phone}
                    disabled={!isEditing}
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
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
                </div>

                {/* 會員編號 */}
                <div>
                  <label style={{ display: 'block', color: '#6B7280', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                    會員編號
                  </label>
                  <input
                    type="text"
                    value={profile.membershipNumber}
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
                </div>
              </div>
            </div>

            {/* 統計信息 */}
            <div style={{ background: '#F8F8F8', padding: '2rem', borderRadius: '0.75rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1.5rem', color: '#1A1A1A' }}>
                購物統計
              </h3>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                <div style={{ background: '#ffffff', padding: '1.5rem', borderRadius: '0.5rem', border: '1px solid #E5E7EB' }}>
                  <p style={{ color: '#6B7280', fontSize: '0.875rem', marginBottom: '0.5rem' }}>總訂單數</p>
                  <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#7C3AED' }}>
                    {profile.totalOrders}
                  </p>
                </div>

                <div style={{ background: '#ffffff', padding: '1.5rem', borderRadius: '0.5rem', border: '1px solid #E5E7EB' }}>
                  <p style={{ color: '#6B7280', fontSize: '0.875rem', marginBottom: '0.5rem' }}>總消費金額</p>
                  <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#7C3AED' }}>
                    ¥{(profile.totalSpent / 100).toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* 側邊欄 */}
          <div>
            {/* 快速鏈接 */}
            <div style={{ background: '#F8F8F8', padding: '1.5rem', borderRadius: '0.75rem', marginBottom: '2rem' }}>
              <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem', color: '#1A1A1A' }}>
                快速鏈接
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <Link href="/orders">
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
                    📦 我的訂單
                  </button>
                </Link>

                <Link href="/wishlist">
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
                    ❤️ 我的收藏
                  </button>
                </Link>

                <Link href="/notifications">
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
                    🔔 通知中心
                  </button>
                </Link>

                <button
                  style={{
                    width: '100%',
                    padding: '0.75rem',
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

            {/* 幫助 */}
            <div style={{ background: '#F8F8F8', padding: '1.5rem', borderRadius: '0.75rem' }}>
              <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem', color: '#1A1A1A' }}>
                幫助
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
                  ❓ 常見問題
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
                  📧 聯絡我們
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
                  📋 隱私政策
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
