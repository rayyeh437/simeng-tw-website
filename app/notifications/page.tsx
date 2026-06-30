'use client'

import { useState, useEffect } from 'react'
import { MainLayout } from '@/components/layout'
import { useAuth } from '@/hooks/use-auth'
import { useRouter } from 'next/navigation'

interface Notification {
  id: number
  title: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error'
  timestamp: string
  read: boolean
  actionUrl?: string
}

export default function NotificationsPage() {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [filterType, setFilterType] = useState<'all' | 'unread'>('all')

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/auth/login')
    }
  }, [isAuthenticated, isLoading, router])

  useEffect(() => {
    // 模擬載入通知
    const mockNotifications: Notification[] = [
      {
        id: 1,
        title: '訂單已發貨',
        message: '您的訂單 ORD-2024-001 已發貨，預計 3-5 天送達',
        type: 'success',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        read: false,
        actionUrl: '/orders/1',
      },
      {
        id: 2,
        title: '商品降價提醒',
        message: '您收藏的 "限定版精靈寶可夢卡牌盒" 降價了！從 ¥1,299 降至 ¥1,099',
        type: 'info',
        timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
        read: false,
        actionUrl: '/products/1',
      },
      {
        id: 3,
        title: '會員積分到期提醒',
        message: '您有 500 積分將在 7 天後到期，請及時使用',
        type: 'warning',
        timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        read: true,
      },
      {
        id: 4,
        title: '訂單已完成',
        message: '您的訂單 ORD-2024-002 已送達，感謝您的購買',
        type: 'success',
        timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        read: true,
        actionUrl: '/orders/2',
      },
      {
        id: 5,
        title: '新品上市通知',
        message: '新品 "寶可夢限定卡牌" 已上市，現在可以預訂',
        type: 'info',
        timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        read: true,
        actionUrl: '/products',
      },
    ]
    setNotifications(mockNotifications)
    setLoading(false)
  }, [])

  const handleMarkAsRead = (id: number) => {
    setNotifications(
      notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n
      )
    )
  }

  const handleMarkAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })))
  }

  const handleDeleteNotification = (id: number) => {
    setNotifications(notifications.filter((n) => n.id !== id))
  }

  const filteredNotifications = filterType === 'unread'
    ? notifications.filter((n) => !n.read)
    : notifications

  const unreadCount = notifications.filter((n) => !n.read).length

  const typeIcons: Record<string, string> = {
    info: 'ℹ️',
    success: '✅',
    warning: '⚠️',
    error: '❌',
  }

  const typeColors: Record<string, { bg: string; text: string }> = {
    info: { bg: '#DBEAFE', text: '#1E40AF' },
    success: { bg: '#D1FAE5', text: '#065F46' },
    warning: { bg: '#FEF3C7', text: '#92400E' },
    error: { bg: '#FEE2E2', text: '#7F1D1D' },
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

  if (!isAuthenticated) {
    return null
  }

  return (
    <MainLayout>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h1 style={{ color: '#1A1A1A' }}>通知中心</h1>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            {unreadCount > 0 && (
              <span style={{ fontSize: '0.875rem', color: '#6B7280' }}>
                {unreadCount} 條未讀
              </span>
            )}
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                style={{
                  padding: '0.5rem 1rem',
                  background: '#7C3AED',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.375rem',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                }}
              >
                全部標記為已讀
              </button>
            )}
          </div>
        </div>

        {/* 篩選標籤 */}
        <div style={{ marginBottom: '2rem', display: 'flex', gap: '0.75rem' }}>
          <button
            onClick={() => setFilterType('all')}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '9999px',
              border: filterType === 'all' ? '2px solid #7C3AED' : '1px solid #E5E7EB',
              background: filterType === 'all' ? '#F3E8FF' : '#ffffff',
              color: filterType === 'all' ? '#7C3AED' : '#6B7280',
              cursor: 'pointer',
              fontSize: '0.875rem',
              fontWeight: '500',
            }}
          >
            全部 ({notifications.length})
          </button>
          <button
            onClick={() => setFilterType('unread')}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '9999px',
              border: filterType === 'unread' ? '2px solid #7C3AED' : '1px solid #E5E7EB',
              background: filterType === 'unread' ? '#F3E8FF' : '#ffffff',
              color: filterType === 'unread' ? '#7C3AED' : '#6B7280',
              cursor: 'pointer',
              fontSize: '0.875rem',
              fontWeight: '500',
            }}
          >
            未讀 ({unreadCount})
          </button>
        </div>

        {/* 通知列表 */}
        {filteredNotifications.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', background: '#F8F8F8', borderRadius: '0.5rem' }}>
            <p style={{ fontSize: '1.125rem', marginBottom: '0.5rem', color: '#6B7280' }}>
              {filterType === 'unread' ? '沒有未讀通知' : '沒有通知'}
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {filteredNotifications.map((notification) => {
              const colors = typeColors[notification.type]
              const icon = typeIcons[notification.type]
              const timeAgo = getTimeAgo(notification.timestamp)

              return (
                <div
                  key={notification.id}
                  style={{
                    background: notification.read ? '#F8F8F8' : '#F3E8FF',
                    padding: '1.5rem',
                    borderRadius: '0.5rem',
                    border: `1px solid ${notification.read ? '#E5E7EB' : '#DDD6FE'}`,
                    display: 'flex',
                    gap: '1rem',
                    alignItems: 'flex-start',
                  }}
                >
                  {/* 圖標 */}
                  <div
                    style={{
                      width: '40px',
                      height: '40px',
                      background: colors.bg,
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.5rem',
                      flexShrink: 0,
                    }}
                  >
                    {icon}
                  </div>

                  {/* 內容 */}
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.5rem' }}>
                      <h3 style={{ fontSize: '1rem', fontWeight: '600', color: '#1A1A1A' }}>
                        {notification.title}
                      </h3>
                      <span style={{ fontSize: '0.75rem', color: '#6B7280', whiteSpace: 'nowrap' }}>
                        {timeAgo}
                      </span>
                    </div>
                    <p style={{ color: '#6B7280', fontSize: '0.875rem', marginBottom: '1rem' }}>
                      {notification.message}
                    </p>

                    {/* 操作按鈕 */}
                    <div style={{ display: 'flex', gap: '0.75rem' }}>
                      {notification.actionUrl && (
                        <button
                          onClick={() => window.location.href = notification.actionUrl!}
                          style={{
                            padding: '0.5rem 1rem',
                            background: '#7C3AED',
                            color: 'white',
                            border: 'none',
                            borderRadius: '0.375rem',
                            cursor: 'pointer',
                            fontSize: '0.75rem',
                          }}
                        >
                          查看詳情
                        </button>
                      )}
                      {!notification.read && (
                        <button
                          onClick={() => handleMarkAsRead(notification.id)}
                          style={{
                            padding: '0.5rem 1rem',
                            background: '#ffffff',
                            color: '#7C3AED',
                            border: '1px solid #E5E7EB',
                            borderRadius: '0.375rem',
                            cursor: 'pointer',
                            fontSize: '0.75rem',
                          }}
                        >
                          標記為已讀
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteNotification(notification.id)}
                        style={{
                          padding: '0.5rem 1rem',
                          background: '#FEE2E2',
                          color: '#DC2626',
                          border: 'none',
                          borderRadius: '0.375rem',
                          cursor: 'pointer',
                          fontSize: '0.75rem',
                        }}
                      >
                        刪除
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </MainLayout>
  )
}

function getTimeAgo(timestamp: string): string {
  const now = new Date()
  const date = new Date(timestamp)
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (seconds < 60) return '剛剛'
  if (seconds < 3600) return `${Math.floor(seconds / 60)} 分鐘前`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} 小時前`
  if (seconds < 604800) return `${Math.floor(seconds / 86400)} 天前`

  return date.toLocaleDateString('zh-TW')
}
