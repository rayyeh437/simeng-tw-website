import Link from 'next/link'
import { MainLayout } from '@/components/layout'
import { trpc } from '@/lib/trpc'
import { useAuth } from '@/hooks/use-auth'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
'use client';


interface Address {
  id: number
  userId: number
  name: string
  phone: string
  address: string
  city: string
  district: string
  zipCode: string | null
  isDefault: number
  createdAt: string
  updatedAt: string
}

export function PageClient() {
  const { isAuthenticated, isLoading: authLoading } = useAuth()
  const router = useRouter()
  const [addresses, setAddresses] = useState<Address[]>([])
  const [loading, setLoading] = useState(true)
  const [deletingId, setDeletingId] = useState<number | null>(null)

  // 重定向未登入用戶
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/user-login')
    }
  }, [isAuthenticated, authLoading, router])

  // 獲取地址列表
  const { data: addressList = [], isLoading: queryLoading, refetch } = trpc.addresses.list.useQuery(undefined as any, {
    enabled: isAuthenticated && !authLoading,
  }) as any

  useEffect(() => {
    setAddresses(addressList || [])
    setLoading(queryLoading)
  }, [addressList, queryLoading])

  // 刪除地址
  const deleteAddressMutation = trpc.addresses.delete.useMutation({
    onSuccess: () => {
      setDeletingId(null)
      refetch()
    },
    onError: (err: any) => {
      alert('刪除地址失敗：' + (err.message || '未知錯誤'))
      setDeletingId(null)
    },
  })

  // 設定預設地址
  const setDefaultMutation = trpc.addresses.setDefault.useMutation({
    onSuccess: () => {
      refetch()
    },
    onError: (err: any) => {
      alert('設定預設地址失敗：' + (err.message || '未知錯誤'))
    },
  })

  const handleDelete = (id: number) => {
    if (confirm('確定要刪除此地址嗎？')) {
      setDeletingId(id)
      deleteAddressMutation.mutate({ addressId: id })
    }
  }

  const handleSetDefault = (id: number) => {
    setDefaultMutation.mutate({ addressId: id })
  }

  if (authLoading) {
    return (
      <MainLayout>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem', textAlign: 'center' }}>
          <p style={{ color: '#6b7280' }}>載入中...</p>
        </div>
      </MainLayout>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <MainLayout>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
        {/* 頁面頭部 */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#1a1a1a' }}>
            收件地址
          </h1>
          <Link
            href="/addresses/edit"
            style={{
              padding: '0.75rem 1.5rem',
              background: '#7c3aed',
              color: 'white',
              border: 'none',
              borderRadius: '0.375rem',
              cursor: 'pointer',
              fontSize: '0.875rem',
              fontWeight: '600',
              textDecoration: 'none',
              display: 'inline-block',
            }}
          >
            + 新增地址
          </Link>
        </div>

        {/* 加載狀態 */}
        {loading && (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#6b7280' }}>
            <p>載入中...</p>
          </div>
        )}

        {/* 空狀態 */}
        {!loading && addresses.length === 0 && (
          <div
            style={{
              textAlign: 'center',
              padding: '3rem',
              background: '#f8f8f8',
              border: '1px solid #e5e7eb',
              borderRadius: '0.5rem',
            }}
          >
            <p style={{ fontSize: '1.125rem', fontWeight: '600', color: '#1a1a1a', marginBottom: '0.5rem' }}>
              還沒有保存的地址
            </p>
            <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '1.5rem' }}>
              新增您的第一個收件地址
            </p>
            <Link
              href="/addresses/edit"
              style={{
                padding: '0.75rem 1.5rem',
                background: '#7c3aed',
                color: 'white',
                border: 'none',
                borderRadius: '0.375rem',
                cursor: 'pointer',
                fontSize: '0.875rem',
                fontWeight: '600',
                textDecoration: 'none',
                display: 'inline-block',
              }}
            >
              新增地址
            </Link>
          </div>
        )}

        {/* 地址列表 */}
        {!loading && addresses.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {addresses.map((address) => (
              <div
                key={address.id}
                style={{
                  background: '#f8f8f8',
                  border: '1px solid #e5e7eb',
                  borderRadius: '0.5rem',
                  padding: '1.5rem',
                  position: 'relative',
                }}
              >
                {/* 預設標籤 */}
                {address.isDefault === 1 && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '1rem',
                      right: '1rem',
                      padding: '0.25rem 0.75rem',
                      background: '#fbbf24',
                      color: '#78350f',
                      borderRadius: '9999px',
                      fontSize: '0.75rem',
                      fontWeight: '600',
                    }}
                  >
                    ⭐ 預設
                  </div>
                )}

                {/* 地址信息 */}
                <div style={{ marginBottom: '1rem', paddingRight: address.isDefault === 1 ? '80px' : '0' }}>
                  <p style={{ fontSize: '1rem', fontWeight: '600', color: '#1a1a1a', marginBottom: '0.5rem' }}>
                    {address.name}
                  </p>
                  <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>
                    {address.phone}
                  </p>
                  <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                    {address.city} {address.district} {address.address}
                  </p>
                  {address.zipCode && (
                    <p style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: '0.5rem' }}>
                      郵編：{address.zipCode}
                    </p>
                  )}
                </div>

                {/* 操作按鈕 */}
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                  <Link
                    href={`/addresses/edit?id=${address.id}`}
                    style={{
                      padding: '0.5rem 1rem',
                      background: '#e5e7eb',
                      color: '#1a1a1a',
                      border: 'none',
                      borderRadius: '0.375rem',
                      cursor: 'pointer',
                      fontSize: '0.875rem',
                      fontWeight: '600',
                      textDecoration: 'none',
                      display: 'inline-block',
                    }}
                  >
                    編輯
                  </Link>
                  <button
                    onClick={() => handleDelete(address.id)}
                    disabled={deletingId === address.id}
                    style={{
                      padding: '0.5rem 1rem',
                      background: '#fee2e2',
                      color: '#991b1b',
                      border: 'none',
                      borderRadius: '0.375rem',
                      cursor: deletingId === address.id ? 'not-allowed' : 'pointer',
                      fontSize: '0.875rem',
                      fontWeight: '600',
                      opacity: deletingId === address.id ? 0.6 : 1,
                    }}
                  >
                    {deletingId === address.id ? '刪除中...' : '刪除'}
                  </button>
                  {address.isDefault !== 1 && (
                    <button
                      onClick={() => handleSetDefault(address.id)}
                      style={{
                        padding: '0.5rem 1rem',
                        background: '#f3e8ff',
                        color: '#7c3aed',
                        border: 'none',
                        borderRadius: '0.375rem',
                        cursor: 'pointer',
                        fontSize: '0.875rem',
                        fontWeight: '600',
                      }}
                    >
                      設為預設
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  )
}
