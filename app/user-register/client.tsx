'use client';
import Link from 'next/link'
import { MainLayout } from '@/components/layout'
import { registerUser } from '@/lib/auth-api'
import { useAuth } from '@/hooks/use-auth'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'


export function PageClient() {
  const router = useRouter()
  const { isAuthenticated, isLoading: authLoading } = useAuth()

  // 如果已登入，重定向到首頁
  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      router.replace('/')
    }
  }, [authLoading, isAuthenticated, router])

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [name, setName] = useState('')
  const [agreeTerms, setAgreeTerms] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const [memberCode, setMemberCode] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    // 驗證
    if (!email || !password || !confirmPassword || !name) {
      setError('請填寫所有必填欄位')
      return
    }

    if (password !== confirmPassword) {
      setError('兩次輸入的密碼不一致')
      return
    }

    if (password.length < 6) {
      setError('密碼長度至少為 6 個字符')
      return
    }

    if (!agreeTerms) {
      setError('請同意服務條款和隱私政策')
      return
    }

    setLoading(true)

    try {
      const result = await registerUser(email, password, name)

      if (result.success) {
        // 註冊成功
        setSuccess(`✅ 註冊成功！您的會員編號是：${result.memberCode}`)
        setMemberCode(result.memberCode || '')

        // 3 秒後重定向到登入頁面
        setTimeout(() => {
          router.push('/user-login')
        }, 3000)
      } else {
        setError(result.error || '註冊失敗，請稍後重試')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '註冊失敗')
    } finally {
      setLoading(false)
    }
  }

  if (authLoading) {
    return (
      <MainLayout>
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <p>載入中...</p>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout showHeader={true} showFooter={true}>
      <div style={{ maxWidth: '450px', margin: '40px auto', padding: '30px' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1 style={{ marginBottom: '10px', color: '#1A1A1A', fontSize: '28px', fontWeight: 'bold' }}>
            建立帳戶
          </h1>
          <p style={{ color: '#6B7280', fontSize: '14px' }}>
            加入喜萌，開始您的購物之旅
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          {error && (
            <div
              style={{
                padding: '12px',
                marginBottom: '20px',
                background: '#FEE2E2',
                color: '#991B1B',
                borderRadius: '6px',
                border: '1px solid #FECACA',
                fontSize: '14px',
              }}
            >
              {error}
            </div>
          )}

          {success && (
            <div
              style={{
                padding: '12px',
                marginBottom: '20px',
                background: '#DCFCE7',
                color: '#166534',
                borderRadius: '6px',
                border: '1px solid #BBFBDC',
                fontSize: '14px',
              }}
            >
              {success}
            </div>
          )}

          <div style={{ marginBottom: '15px' }}>
            <label
              htmlFor="name"
              style={{
                display: 'block',
                marginBottom: '6px',
                fontWeight: '500',
                color: '#1A1A1A',
                fontSize: '14px',
              }}
            >
              姓名 <span style={{ color: '#EF4444' }}>*</span>
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="請輸入您的姓名"
              required
              disabled={loading}
              style={{
                width: '100%',
                padding: '10px 12px',
                border: '1px solid #D1D5DB',
                borderRadius: '6px',
                fontSize: '14px',
                boxSizing: 'border-box',
                fontFamily: 'inherit',
                opacity: loading ? 0.6 : 1,
              }}
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label
              htmlFor="email"
              style={{
                display: 'block',
                marginBottom: '6px',
                fontWeight: '500',
                color: '#1A1A1A',
                fontSize: '14px',
              }}
            >
              電子郵件 <span style={{ color: '#EF4444' }}>*</span>
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="請輸入您的電子郵件"
              required
              disabled={loading}
              style={{
                width: '100%',
                padding: '10px 12px',
                border: '1px solid #D1D5DB',
                borderRadius: '6px',
                fontSize: '14px',
                boxSizing: 'border-box',
                fontFamily: 'inherit',
                opacity: loading ? 0.6 : 1,
              }}
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label
              htmlFor="password"
              style={{
                display: 'block',
                marginBottom: '6px',
                fontWeight: '500',
                color: '#1A1A1A',
                fontSize: '14px',
              }}
            >
              密碼 <span style={{ color: '#EF4444' }}>*</span>
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="至少 6 個字符"
              required
              disabled={loading}
              style={{
                width: '100%',
                padding: '10px 12px',
                border: '1px solid #D1D5DB',
                borderRadius: '6px',
                fontSize: '14px',
                boxSizing: 'border-box',
                fontFamily: 'inherit',
                opacity: loading ? 0.6 : 1,
              }}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label
              htmlFor="confirmPassword"
              style={{
                display: 'block',
                marginBottom: '6px',
                fontWeight: '500',
                color: '#1A1A1A',
                fontSize: '14px',
              }}
            >
              確認密碼 <span style={{ color: '#EF4444' }}>*</span>
            </label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="請再次輸入密碼"
              required
              disabled={loading}
              style={{
                width: '100%',
                padding: '10px 12px',
                border: '1px solid #D1D5DB',
                borderRadius: '6px',
                fontSize: '14px',
                boxSizing: 'border-box',
                fontFamily: 'inherit',
                opacity: loading ? 0.6 : 1,
              }}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', cursor: 'pointer', fontSize: '14px' }}>
              <input
                type="checkbox"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                disabled={loading}
                style={{ cursor: 'pointer', marginTop: '2px' }}
              />
              <span>
                我同意喜萌的{' '}
                <Link href="/terms" style={{ color: '#7C3AED', textDecoration: 'none' }}>
                  服務條款
                </Link>
                {' '}和{' '}
                <Link href="/privacy" style={{ color: '#7C3AED', textDecoration: 'none' }}>
                  隱私政策
                </Link>
              </span>
            </label>
          </div>

          <button
            type="submit"
            disabled={loading || !agreeTerms}
            style={{
              width: '100%',
              padding: '12px',
              background: loading || !agreeTerms ? '#D1D5DB' : '#7C3AED',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: loading || !agreeTerms ? 'not-allowed' : 'pointer',
              transition: 'background 0.3s',
            }}
          >
            {loading ? '註冊中...' : '建立帳戶'}
          </button>
        </form>

        <div style={{ marginTop: '30px', textAlign: 'center', color: '#6B7280', fontSize: '14px' }}>
          <p>
            已有帳戶？{' '}
            <Link href="/user-login" style={{ color: '#7C3AED', textDecoration: 'none', fontWeight: '600' }}>
              立即登入
            </Link>
          </p>
        </div>

        <div style={{ marginTop: '30px', padding: '15px', background: '#F9FAFB', borderRadius: '6px', fontSize: '12px', color: '#6B7280' }}>
          <p style={{ marginBottom: '8px', margin: 0 }}>
            <strong style={{ color: '#1A1A1A' }}>💡 提示：</strong>
            註冊後，您將獲得一個唯一的會員編號（SM 開頭），可用於訂單追蹤和會員優惠。
          </p>
          <p style={{ margin: 0 }}>
            <strong style={{ color: '#1A1A1A' }}>🔒 安全：</strong>
            您的密碼將被加密存儲，我們不會與第三方分享您的個人信息。
          </p>
        </div>
      </div>
    </MainLayout>
  )
}
