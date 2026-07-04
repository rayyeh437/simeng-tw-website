'use client';
import Link from 'next/link'
import { MainLayout } from '@/components/layout'
import { loginUser, sendOtpCode, verifyOtpCode } from '@/lib/auth-api'
import { useAuth } from '@/hooks/use-auth'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'


export function LoginClient() {
  const router = useRouter()
  const { isAuthenticated, isLoading: authLoading, user } = useAuth()

  // 如果已登入，根據角色重定向
  useEffect(() => {
    if (!authLoading && isAuthenticated && user) {
      if (user.role === 'admin') {
        router.replace('/admin')
      } else {
        router.replace('/')
      }
    }
  }, [authLoading, isAuthenticated, user, router])

  const [step, setStep] = useState<'login' | 'otp'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [mobile, setMobile] = useState('')
  const [otpCode, setOtpCode] = useState('')
  const [rememberMe, setRememberMe] = useState(true)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [otpCountdown, setOtpCountdown] = useState(0)
  const [useOtp, setUseOtp] = useState(false)

  // OTP 倒計時
  useEffect(() => {
    if (otpCountdown > 0) {
      const timer = setTimeout(() => setOtpCountdown(otpCountdown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [otpCountdown])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (!email || !password) {
        setError('請填寫所有必填欄位')
        return
      }

      const result = await loginUser(email, password)

      if (result.success && result.user) {
        // 登入成功，根據角色重定向
        if (result.user.role === 'admin') {
          router.replace('/admin')
        } else {
          router.replace('/')
        }
      } else {
        setError(result.error || '登入失敗，請檢查您的郵箱和密碼')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '登入失敗')
    } finally {
      setLoading(false)
    }
  }

  const handleSendOtp = async () => {
    setError('')
    setLoading(true)

    try {
      if (!mobile) {
        setError('請輸入手機號碼')
        return
      }

      const result = await sendOtpCode(mobile)

      if (result.success) {
        setOtpCountdown(60)
        setStep('otp')
      } else {
        setError(result.error || '發送驗證碼失敗')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '發送驗證碼失敗')
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (!otpCode) {
        setError('請輸入驗證碼')
        return
      }

      const result = await verifyOtpCode(mobile, otpCode)

      if (result.success) {
        // OTP 驗證成功，重定向到首頁
        router.replace('/')
      } else {
        setError(result.error || 'OTP 驗證失敗')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'OTP 驗證失敗')
    } finally {
      setLoading(false)
    }
  }

  if (authLoading) {
    return (
      <MainLayout>
        <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', textAlign: 'center' }}>
          <p style={{ color: '#666' }}>載入中...</p>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px' }}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h1 style={{ marginBottom: '10px' }}>歡迎回到 SIMENG</h1>
          <p style={{ color: '#666' }}>登入您的帳戶</p>
        </div>

        <form onSubmit={step === 'login' ? handleLogin : handleVerifyOtp}>
          {error && (
            <div
              style={{
                padding: '12px',
                marginBottom: '15px',
                background: '#f8d7da',
                color: '#721c24',
                borderRadius: '4px',
                fontSize: '14px',
              }}
            >
              {error}
            </div>
          )}

          {step === 'login' ? (
            <>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
                  電子郵件
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="請輸入電子郵件"
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    fontSize: '14px',
                    boxSizing: 'border-box',
                  }}
                  disabled={loading}
                />
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
                  密碼
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="請輸入密碼"
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    fontSize: '14px',
                    boxSizing: 'border-box',
                  }}
                  disabled={loading}
                />
              </div>

              <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label style={{ display: 'flex', alignItems: 'center', fontSize: '14px' }}>
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    style={{ marginRight: '5px' }}
                  />
                  保持登入
                </label>
                <Link href="/forgot-password" style={{ color: '#0066cc', textDecoration: 'none', fontSize: '14px' }}>
                  忘記密碼？
                </Link>
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '10px',
                  background: '#0066cc',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  fontSize: '16px',
                  fontWeight: '500',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  opacity: loading ? 0.6 : 1,
                }}
              >
                {loading ? '登入中...' : '登入'}
              </button>

              <div style={{ marginTop: '20px', textAlign: 'center' }}>
                <p style={{ fontSize: '14px', color: '#666' }}>
                  還沒有帳戶？{' '}
                  <Link href="/user-register" style={{ color: '#0066cc', textDecoration: 'none' }}>
                    立即註冊
                  </Link>
                </p>
              </div>
            </>
          ) : (
            <>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
                  驗證碼
                </label>
                <input
                  type="text"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  placeholder="請輸入 6 位驗證碼"
                  maxLength={6}
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    fontSize: '14px',
                    boxSizing: 'border-box',
                  }}
                  disabled={loading}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '10px',
                  background: '#0066cc',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  fontSize: '16px',
                  fontWeight: '500',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  opacity: loading ? 0.6 : 1,
                }}
              >
                {loading ? '驗證中...' : '驗證'}
              </button>

              <button
                type="button"
                onClick={() => setStep('login')}
                style={{
                  width: '100%',
                  padding: '10px',
                  marginTop: '10px',
                  background: '#f0f0f0',
                  color: '#333',
                  border: 'none',
                  borderRadius: '4px',
                  fontSize: '14px',
                  cursor: 'pointer',
                }}
              >
                返回登入
              </button>
            </>
          )}
        </form>
      </div>
    </MainLayout>
  )
}
