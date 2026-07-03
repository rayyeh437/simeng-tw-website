'use client'

import { useState, useEffect, useCallback } from 'react'
import { getCurrentUser, logoutUser, getStoredUser, type User } from '@/lib/auth-api'

interface UseAuthReturn {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  logout: () => Promise<void>
  refetch: () => Promise<void>
}

export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const fetchUser = useCallback(async () => {
    try {
      setIsLoading(true)
      // 優先從 localStorage 獲取
      const storedUser = getStoredUser()
      if (storedUser) {
        setUser(storedUser)
      }
      
      // 然後嘗試從 API 獲取最新信息
      const currentUser = await getCurrentUser()
      if (currentUser) {
        setUser(currentUser)
      } else if (!storedUser) {
        setUser(null)
      }
    } catch (error) {
      console.error('Failed to fetch user:', error)
      // 如果 API 失敗，嘗試使用 localStorage 中的用戶信息
      const storedUser = getStoredUser()
      if (storedUser) {
        setUser(storedUser)
      } else {
        setUser(null)
      }
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchUser()
  }, [fetchUser])

  const logout = useCallback(async () => {
    try {
      await logoutUser()
      setUser(null)
    } catch (error) {
      console.error('Failed to logout:', error)
      setUser(null)
    }
  }, [])

  return {
    user,
    isAuthenticated: !!user,
    isLoading,
    logout,
    refetch: fetchUser,
  }
}
