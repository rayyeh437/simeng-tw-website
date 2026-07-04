'use client';
export const dynamic = 'force-dynamic';



import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { registerUser } from '@/lib/auth-api'

export default function RegisterPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // 驗證密碼
    if (password !== confirmPassword) {
      setError('兩次輸入的密碼不一致')
      return
    }

    if (password.length < 6) {
      setError('密碼長度至少為 6 個字符')
      return
    }

    setLoading(true)

    try {
      const result = await registerUser(email, password, name)
      
      if (result.success) {
        // 註冊成功，顯示成功信息並重定向到登入頁面
        alert(`註冊成功！您的會員編號是：${result.memberCode}`)
        router.push('/auth/login')
      } else {
        setError(result.error || '註冊失敗，請稍後重試')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '註冊失敗')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px' }}>
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h1 style={{ marginBottom: '10px' }}>喜萌後台管理</h1>
        <p style={{ color: '#666' }}>創建您的帳戶</p>
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
            htmlFor="name"
            style={{
              display: 'block',
              marginBottom: '5px',
              fontWeight: '500',
              color: '#333',
            }}
          >
            姓名
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="請輸入您的姓名"
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

        <div style={{ marginBottom: '15px' }}>
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
            placeholder="請輸入密碼（至少 6 個字符）"
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
            htmlFor="confirmPassword"
            style={{
              display: 'block',
              marginBottom: '5px',
              fontWeight: '500',
              color: '#333',
            }}
          >
            確認密碼
          </label>
          <input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="請再次輸入密碼"
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
          {loading ? '註冊中...' : '註冊'}
        </button>
      </form>

      <div style={{ marginTop: '20px', textAlign: 'center', color: '#666' }}>
        <p>
          已有帳戶？{' '}
          <Link href="/auth/login" style={{ color: '#007bff', textDecoration: 'none' }}>
            立即登入
          </Link>
        </p>
      </div>

      <div style={{ marginTop: '30px', padding: '15px', background: '#f5f5f5', borderRadius: '4px', fontSize: '12px', color: '#666' }}>
        <p style={{ marginBottom: '5px' }}>
          <strong>隱私政策：</strong>
          您的個人信息將被安全存儲，僅用於帳戶管理和身份驗證。
        </p>
        <p>
          <strong>服務條款：</strong>
          使用本系統即表示您同意我們的服務條款和隱私政策。
        </p>
      </div>
    </div>
  )
}
