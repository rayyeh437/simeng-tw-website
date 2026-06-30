'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { getCategories, searchProducts } from '@/lib/api'
import { ProtectedRoute } from '@/components/protected-route'
import type { Product, Category } from '@/lib/types'

function ProductsContent() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        // 獲取分類
        const categoriesData = await getCategories()
        const categoryList = Array.isArray(categoriesData) ? categoriesData : (categoriesData as any)?.result?.data || [];
        setCategories(categoryList)

        // 獲取商品
        const productsData = await searchProducts({ pageSize: 100 })
        const productList = (productsData as any)?.result?.data?.items || [];
        setProducts(productList)
      } catch (err) {
        setError(err instanceof Error ? err.message : '載入數據失敗')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <p>載入中...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div style={{ padding: '20px', color: 'red' }}>
        <p>錯誤：{error}</p>
      </div>
    )
  }

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1>商品管理</h1>
        <Link href="/admin">
          <button
            style={{
              background: '#6c757d',
              color: 'white',
              padding: '8px 16px',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            返回首頁
          </button>
        </Link>
      </div>
      
      <div style={{ marginBottom: '20px' }}>
        <button
          style={{
            background: '#007bff',
            color: 'white',
            padding: '10px 20px',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
          }}
        >
          新增商品
        </button>
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: '#f5f5f5', borderBottom: '1px solid #ddd' }}>
            <th style={{ padding: '10px', textAlign: 'left' }}>ID</th>
            <th style={{ padding: '10px', textAlign: 'left' }}>商品名稱</th>
            <th style={{ padding: '10px', textAlign: 'left' }}>分類</th>
            <th style={{ padding: '10px', textAlign: 'left' }}>價格</th>
            <th style={{ padding: '10px', textAlign: 'left' }}>庫存</th>
            <th style={{ padding: '10px', textAlign: 'left' }}>狀態</th>
            <th style={{ padding: '10px', textAlign: 'left' }}>操作</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => {
            const category = categories.find(c => c.id === product.categoryId)
            return (
              <tr key={product.id} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '10px' }}>{product.id}</td>
                <td style={{ padding: '10px' }}>{product.name}</td>
                <td style={{ padding: '10px' }}>{category?.name || '-'}</td>
                <td style={{ padding: '10px' }}>¥{(product.price / 100).toFixed(2)}</td>
                <td style={{ padding: '10px' }}>{product.stock}</td>
                <td style={{ padding: '10px' }}>
                  <span
                    style={{
                      padding: '5px 10px',
                      borderRadius: '3px',
                      background: product.status === 'published' ? '#d4edda' : '#f8d7da',
                      color: product.status === 'published' ? '#155724' : '#721c24',
                    }}
                  >
                    {product.status === 'published' ? '已上架' : '草稿'}
                  </span>
                </td>
                <td style={{ padding: '10px' }}>
                  <button
                    style={{
                      background: '#28a745',
                      color: 'white',
                      padding: '5px 10px',
                      border: 'none',
                      borderRadius: '3px',
                      cursor: 'pointer',
                      marginRight: '5px',
                    }}
                  >
                    編輯
                  </button>
                  <button
                    style={{
                      background: '#dc3545',
                      color: 'white',
                      padding: '5px 10px',
                      border: 'none',
                      borderRadius: '3px',
                      cursor: 'pointer',
                    }}
                  >
                    刪除
                  </button>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>

      {products.length === 0 && (
        <div style={{ padding: '20px', textAlign: 'center', color: '#999' }}>
          <p>暫無商品</p>
        </div>
      )}
    </div>
  )
}

export default function ProductsAdminPage() {
  return (
    <ProtectedRoute requiredRole="admin">
      <ProductsContent />
    </ProtectedRoute>
  )
}
