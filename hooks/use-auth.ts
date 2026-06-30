'use client'

import { useState, useEffect, useCallback } from 'react'
import { getCurrentUser, logoutUser, type User } from '@/lib/auth-api'

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
      const currentUser = await getCurrentUser()
      setUser(currentUser)
    } catch (error) {
      console.error('Failed to fetch user:', error)
      setUser(null)
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
