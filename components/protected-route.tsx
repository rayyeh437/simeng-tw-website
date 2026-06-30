'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/use-auth'

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRole?: 'admin' | 'user'
}

export function ProtectedRoute({ children, requiredRole = 'user' }: ProtectedRouteProps) {
  const router = useRouter()
  const { user, isAuthenticated, isLoading } = useAuth()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      // 未登入，重定向到登入頁面
      router.push('/auth/login')
    }
  }, [isAuthenticated, isLoading, router])

  if (isLoading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <p>載入中...</p>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  // 檢查角色權限
  if (requiredRole === 'admin' && user?.role !== 'admin') {
    return (
      <div style={{ padding: '20px', textAlign: 'center', color: 'red' }}>
        <p>您沒有權限訪問此頁面</p>
      </div>
    )
  }

  return <>{children}</>
}
