'use client';
import Link from 'next/link'
import { MainLayout } from '@/components/layout'
import { loginUser, sendOtpCode, verifyOtpCode } from '@/lib/auth-api'
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

      if (result.success) {
        // 登入成功
        router.replace('/')
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
            會員登入
          </h1>
          <p style={{ color: '#6B7280', fontSize: '14px' }}>
            登入您的喜萌帳戶，享受完整購物體驗
          </p>
        </div>

        {step === 'login' ? (
          <form onSubmit={handleLogin}>
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

            {/* 登入方式選擇 */}
            <div style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
              <button
                type="button"
                onClick={() => {
                  setUseOtp(false)
                  setError('')
                  setMobile('')
                  setOtpCode('')
                }}
                style={{
                  flex: 1,
                  padding: '10px',
                  background: !useOtp ? '#7C3AED' : '#F3F4F6',
                  color: !useOtp ? 'white' : '#6B7280',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: '500',
                  fontSize: '14px',
                }}
              >
                帳號密碼登入
              </button>
              <button
                type="button"
                onClick={() => {
                  setUseOtp(true)
                  setError('')
                  setEmail('')
                  setPassword('')
                }}
                style={{
                  flex: 1,
                  padding: '10px',
                  background: useOtp ? '#7C3AED' : '#F3F4F6',
                  color: useOtp ? 'white' : '#6B7280',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: '500',
                  fontSize: '14px',
                }}
              >
                手機驗證登入
              </button>
            </div>

            {!useOtp ? (
              <>
                {/* 帳號密碼登入 */}
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
                    電子郵件
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="請輸入您的電子郵件"
                    required
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: '1px solid #D1D5DB',
                      borderRadius: '6px',
                      fontSize: '14px',
                      boxSizing: 'border-box',
                      fontFamily: 'inherit',
                    }}
                  />
                </div>

                <div style={{ marginBottom: '20px' }}>
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
                      padding: '10px 12px',
                      border: '1px solid #D1D5DB',
                      borderRadius: '6px',
                      fontSize: '14px',
                      boxSizing: 'border-box',
                      fontFamily: 'inherit',
                    }}
                  />
                </div>

                <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontSize: '14px' }}>
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      style={{ cursor: 'pointer' }}
                    />
                    <span>保持登入</span>
                  </label>
                  <Link href="/forgot-password" style={{ color: '#7C3AED', textDecoration: 'none', fontSize: '14px' }}>
                    忘記密碼？
                  </Link>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    width: '100%',
                    padding: '12px',
                    background: loading ? '#D1D5DB' : '#7C3AED',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '16px',
                    fontWeight: '600',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    transition: 'background 0.3s',
                  }}
                >
                  {loading ? '登入中...' : '登入'}
                </button>
              </>
            ) : (
              <>
                {/* 手機驗證登入 */}
                <div style={{ marginBottom: '20px' }}>
                  <label
                    htmlFor="mobile"
                    style={{
                      display: 'block',
                      marginBottom: '6px',
                      fontWeight: '500',
                      color: '#1A1A1A',
                      fontSize: '14px',
                    }}
                  >
                    手機號碼
                  </label>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <input
                      id="mobile"
                      type="tel"
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value)}
                      placeholder="09xxxxxxxx"
                      required
                      style={{
                        flex: 1,
                        padding: '10px 12px',
                        border: '1px solid #D1D5DB',
                        borderRadius: '6px',
                        fontSize: '14px',
                        boxSizing: 'border-box',
                        fontFamily: 'inherit',
                      }}
                    />
                    <button
                      type="button"
                      onClick={handleSendOtp}
                      disabled={loading || otpCountdown > 0}
                      style={{
                        padding: '10px 16px',
                        background: otpCountdown > 0 ? '#D1D5DB' : '#7C3AED',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: otpCountdown > 0 ? 'not-allowed' : 'pointer',
                        fontWeight: '500',
                        fontSize: '14px',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {otpCountdown > 0 ? `${otpCountdown}秒` : '發送驗證碼'}
                    </button>
                  </div>
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <label
                    htmlFor="otp"
                    style={{
                      display: 'block',
                      marginBottom: '6px',
                      fontWeight: '500',
                      color: '#1A1A1A',
                      fontSize: '14px',
                    }}
                  >
                    驗證碼
                  </label>
                  <input
                    id="otp"
                    type="text"
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    placeholder="請輸入 6 位驗證碼"
                    maxLength={6}
                    required
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: '1px solid #D1D5DB',
                      borderRadius: '6px',
                      fontSize: '14px',
                      boxSizing: 'border-box',
                      fontFamily: 'inherit',
                      letterSpacing: '4px',
                      textAlign: 'center',
                    }}
                  />
                </div>

                <button
                  type="button"
                  onClick={handleVerifyOtp}
                  disabled={loading}
                  style={{
                    width: '100%',
                    padding: '12px',
                    background: loading ? '#D1D5DB' : '#7C3AED',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '16px',
                    fontWeight: '600',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    transition: 'background 0.3s',
                  }}
                >
                  {loading ? '驗證中...' : '驗證並登入'}
                </button>
              </>
            )}
          </form>
        ) : null}

        <div style={{ marginTop: '30px', textAlign: 'center', color: '#6B7280', fontSize: '14px' }}>
          <p>
            還沒有帳戶？{' '}
            <Link href="/user-register" style={{ color: '#7C3AED', textDecoration: 'none', fontWeight: '600' }}>
              立即註冊
            </Link>
          </p>
        </div>

        <div style={{ marginTop: '30px', padding: '15px', background: '#F9FAFB', borderRadius: '6px', fontSize: '12px', color: '#6B7280' }}>
          <p style={{ marginBottom: '8px', margin: 0 }}>
            <strong style={{ color: '#1A1A1A' }}>隱私政策：</strong>
            您的登入信息將被安全存儲，僅用於身份驗證。
          </p>
          <p style={{ margin: 0 }}>
            <strong style={{ color: '#1A1A1A' }}>服務條款：</strong>
            使用本系統即表示您同意我們的服務條款和隱私政策。
          </p>
        </div>
      </div>
    </MainLayout>
  )
}
