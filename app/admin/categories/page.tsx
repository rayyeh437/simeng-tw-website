'use client'

import { useState, useEffect } from 'react'
import { getCategories } from '@/lib/api'
import type { Category } from '@/lib/types'

export default function CategoriesAdminPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const data = await getCategories()
        // tRPC 返回的格式是 { result: { data: [...] } }
        const categoryList = Array.isArray(data) ? data : (data as any)?.result?.data || [];
        setCategories(categoryList)
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
      <h1>分類管理</h1>
      
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
          新增分類
        </button>
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: '#f5f5f5', borderBottom: '1px solid #ddd' }}>
            <th style={{ padding: '10px', textAlign: 'left' }}>ID</th>
            <th style={{ padding: '10px', textAlign: 'left' }}>分類名稱</th>
            <th style={{ padding: '10px', textAlign: 'left' }}>Slug</th>
            <th style={{ padding: '10px', textAlign: 'left' }}>排序</th>
            <th style={{ padding: '10px', textAlign: 'left' }}>狀態</th>
            <th style={{ padding: '10px', textAlign: 'left' }}>操作</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((category) => (
            <tr key={category.id} style={{ borderBottom: '1px solid #eee' }}>
              <td style={{ padding: '10px' }}>{category.id}</td>
              <td style={{ padding: '10px' }}>{category.name}</td>
              <td style={{ padding: '10px' }}>{category.slug}</td>
              <td style={{ padding: '10px' }}>{category.order}</td>
              <td style={{ padding: '10px' }}>
                <span
                  style={{
                    padding: '5px 10px',
                    borderRadius: '3px',
                    background: category.isActive ? '#d4edda' : '#f8d7da',
                    color: category.isActive ? '#155724' : '#721c24',
                  }}
                >
                  {category.isActive ? '啟用' : '禁用'}
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
          ))}
        </tbody>
      </table>

      {categories.length === 0 && (
        <div style={{ padding: '20px', textAlign: 'center', color: '#999' }}>
          <p>暫無分類</p>
        </div>
      )}
    </div>
  )
}
