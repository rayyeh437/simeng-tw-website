'use client';
export const dynamic = 'force-dynamic';



import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { loginUser } from '@/lib/auth-api'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const result = await loginUser(email, password)
      
      if (result.success) {
        // 登入成功，重定向到後台
        router.push('/admin')
      } else {
        setError(result.error || '登入失敗，請檢查您的郵箱和密碼')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '登入失敗')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px' }}>
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h1 style={{ marginBottom: '10px' }}>喜萌後台管理</h1>
        <p style={{ color: '#666' }}>登入您的帳戶</p>
      </div>

      <form onSubmit={handleSubmit}>
        {error && (
          <div
            style={{
              padding: '12px',
              marginBottom: '15px',
              background: '#f8d7da',
              color: '#721c24',
              borderRadius: '4px',
              border: '1px solid #f5c6cb',
            }}
          >
            {error}
          </div>
        )}

        <div style={{ marginBottom: '15px' }}>
          <label
            htmlFor="email"
            style={{
              display: 'block',
              marginBottom: '5px',
              fontWeight: '500',
              color: '#333',
            }}
          >
            郵箱地址
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="請輸入您的郵箱"
            required
            style={{
              width: '100%',
              padding: '10px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '14px',
              boxSizing: 'border-box',
            }}
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label
            htmlFor="password"
            style={{
              display: 'block',
              marginBottom: '5px',
              fontWeight: '500',
              color: '#333',
            }}
          >
            密碼
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="請輸入您的密碼"
            required
            style={{
              width: '100%',
              padding: '10px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '14px',
              boxSizing: 'border-box',
            }}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            padding: '10px',
            background: loading ? '#ccc' : '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            fontSize: '16px',
            fontWeight: '500',
            cursor: loading ? 'not-allowed' : 'pointer',
            transition: 'background 0.3s',
          }}
        >
          {loading ? '登入中...' : '登入'}
        </button>
      </form>

      <div style={{ marginTop: '20px', textAlign: 'center', color: '#666' }}>
        <p>
          還沒有帳戶？{' '}
          <Link href="/auth/register" style={{ color: '#007bff', textDecoration: 'none' }}>
            立即註冊
          </Link>
        </p>
      </div>

      <div style={{ marginTop: '30px', padding: '15px', background: '#f5f5f5', borderRadius: '4px', fontSize: '12px', color: '#666' }}>
        <p style={{ marginBottom: '5px' }}>
          <strong>隱私政策：</strong>
          您的登入信息將被安全存儲，僅用於身份驗證。
        </p>
        <p>
          <strong>服務條款：</strong>
          使用本系統即表示您同意我們的服務條款和隱私政策。
        </p>
      </div>
    </div>
  )
}
