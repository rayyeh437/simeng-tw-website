'use client';
import Link from 'next/link'
import type { Product, Category } from '@/lib/types'
import { MainLayout } from '@/components/layout'
import { searchProducts, getCategories } from '@/lib/api'
import { useState, useEffect } from 'react'


export function ProductsClient() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        // 獲取分類
        const categoriesData = await getCategories()
        const categoryList = Array.isArray(categoriesData) ? categoriesData : (categoriesData as any)?.result?.data || []
        setCategories(categoryList)

        // 獲取商品
        const productsData = await searchProducts({ pageSize: 100 })
        const productList = (productsData as any)?.result?.data?.items || []
        setProducts(productList)
      } catch (err) {
        setError(err instanceof Error ? err.message : '載入數據失敗')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const filteredProducts = products.filter((product) => {
    const matchesCategory = !selectedCategory || product.categoryId === selectedCategory
    const matchesSearch = !searchQuery || product.name.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <MainLayout>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <h1 style={{ marginBottom: '2rem', color: '#1A1A1A' }}>商品列表</h1>

        {/* 搜尋和篩選 */}
        <div style={{ marginBottom: '2rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <input
            type="text"
            placeholder="搜尋商品..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              flex: 1,
              minWidth: '200px',
              padding: '0.75rem',
              border: '1px solid #E5E7EB',
              borderRadius: '0.375rem',
              fontSize: '1rem',
            }}
          />
          <select
            value={selectedCategory || ''}
            onChange={(e) => setSelectedCategory(e.target.value ? Number(e.target.value) : null)}
            style={{
              padding: '0.75rem',
              border: '1px solid #E5E7EB',
              borderRadius: '0.375rem',
              fontSize: '1rem',
              minWidth: '150px',
            }}
          >
            <option value="">所有分類</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        {/* 分類標籤 */}
        <div style={{ marginBottom: '2rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button
            onClick={() => setSelectedCategory(null)}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '9999px',
              border: selectedCategory === null ? '2px solid #7C3AED' : '1px solid #E5E7EB',
              background: selectedCategory === null ? '#F3E8FF' : '#ffffff',
              color: selectedCategory === null ? '#7C3AED' : '#6B7280',
              cursor: 'pointer',
              fontSize: '0.875rem',
              fontWeight: '500',
            }}
          >
            全部
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '9999px',
                border: selectedCategory === category.id ? '2px solid #7C3AED' : '1px solid #E5E7EB',
                background: selectedCategory === category.id ? '#F3E8FF' : '#ffffff',
                color: selectedCategory === category.id ? '#7C3AED' : '#6B7280',
                cursor: 'pointer',
                fontSize: '0.875rem',
                fontWeight: '500',
              }}
            >
              {category.name}
            </button>
          ))}
        </div>

        {/* 加載狀態 */}
        {loading && <p style={{ textAlign: 'center', color: '#6B7280' }}>載入中...</p>}

        {/* 錯誤狀態 */}
        {error && <p style={{ textAlign: 'center', color: '#EF4444' }}>錯誤：{error}</p>}

        {/* 商品網格 */}
        {!loading && !error && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
              gap: '1.5rem',
            }}
          >
            {filteredProducts.map((product) => (
              <Link
                key={product.id}
                href={`/products/${product.id}`}
                style={{ textDecoration: 'none' }}
              >
                <div
                  style={{
                    background: '#F8F8F8',
                    borderRadius: '0.5rem',
                    overflow: 'hidden',
                    border: '1px solid #E5E7EB',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = '0 10px 25px rgba(0,0,0,0.1)'
                    e.currentTarget.style.transform = 'translateY(-5px)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = 'none'
                    e.currentTarget.style.transform = 'translateY(0)'
                  }}
                >
                  {/* 商品圖片 */}
                  <div
                    style={{
                      width: '100%',
                      height: '200px',
                      background: '#E5E7EB',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '3rem',
                    }}
                  >
                    📦
                  </div>

                  {/* 商品信息 */}
                  <div style={{ padding: '1rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.5rem', color: '#1A1A1A' }}>
                      {product.name}
                    </h3>
                    <p style={{ fontSize: '0.875rem', color: '#6B7280', marginBottom: '1rem', flex: 1 }}>
                      {product.description || '暫無描述'}
                    </p>

                    {/* 價格和狀態 */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#7C3AED' }}>
                        ¥{(product.price / 100).toFixed(2)}
                      </span>
                      <span
                        style={{
                          fontSize: '0.75rem',
                          padding: '0.25rem 0.75rem',
                          borderRadius: '9999px',
                          background: product.status === 'published' ? '#D1FAE5' : '#FEE2E2',
                          color: product.status === 'published' ? '#065F46' : '#7F1D1D',
                        }}
                      >
                        {product.status === 'published' ? '上架' : '下架'}
                      </span>
                    </div>

                    {/* 庫存 */}
                    <p style={{ fontSize: '0.875rem', color: '#6B7280', marginTop: '0.5rem' }}>
                      庫存：{product.stock}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* 空狀態 */}
        {!loading && !error && filteredProducts.length === 0 && (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#6B7280' }}>
            <p style={{ fontSize: '1.125rem', marginBottom: '0.5rem' }}>沒有找到商品</p>
            <p style={{ fontSize: '0.875rem' }}>請嘗試調整搜尋條件或分類篩選</p>
          </div>
        )}
      </div>
    </MainLayout>
  )
}
