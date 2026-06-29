import Link from 'next/link'

export default function Home() {
  const appName = process.env.NEXT_PUBLIC_APP_NAME || '喜萌'
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://api.simeng.tw'

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      {/* Hero Section */}
      <section style={{ textAlign: 'center', marginBottom: '60px', paddingTop: '40px' }}>
        <h2 style={{ fontSize: '48px', marginBottom: '20px', color: '#333' }}>
          歡迎來到 {appName}
        </h2>
        <p style={{ fontSize: '18px', color: '#666', marginBottom: '30px' }}>
          發現您喜愛的商品，享受最佳購物體驗
        </p>
        <button
          style={{
            background: '#007bff',
            color: 'white',
            padding: '12px 30px',
            fontSize: '16px',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
          }}
        >
          開始購物
        </button>
      </section>

      {/* Features Section */}
      <section style={{ marginBottom: '60px' }}>
        <h3 style={{ fontSize: '32px', marginBottom: '30px', textAlign: 'center', color: '#333' }}>
          為什麼選擇 {appName}？
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '30px' }}>
          {[
            { title: '優質商品', description: '精選優質商品，品質保證' },
            { title: '快速配送', description: '快速配送，送達您家' },
            { title: '安全支付', description: '安全支付方式，保護您的信息' },
            { title: '客服支持', description: '24/7 客服支持，隨時幫助您' },
          ].map((feature, index) => (
            <div
              key={index}
              style={{
                padding: '20px',
                background: '#f9f9f9',
                borderRadius: '8px',
                textAlign: 'center',
                border: '1px solid #eee',
              }}
            >
              <h4 style={{ fontSize: '20px', marginBottom: '10px', color: '#333' }}>
                {feature.title}
              </h4>
              <p style={{ color: '#666', lineHeight: '1.6' }}>
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Categories Section */}
      <section style={{ marginBottom: '60px' }}>
        <h3 style={{ fontSize: '32px', marginBottom: '30px', textAlign: 'center', color: '#333' }}>
          商品分類
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
          {['電子產品', '服裝', '家居', '美妝', '食品', '運動'].map((category, index) => (
            <div
              key={index}
              style={{
                padding: '30px',
                background: '#f0f0f0',
                borderRadius: '8px',
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLDivElement).style.background = '#e0e0e0'
                ;(e.currentTarget as HTMLDivElement).style.transform = 'scale(1.05)'
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.background = '#f0f0f0'
                ;(e.currentTarget as HTMLDivElement).style.transform = 'scale(1)'
              }}
            >
              <h4 style={{ fontSize: '18px', color: '#333' }}>{category}</h4>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section style={{ textAlign: 'center', marginBottom: '60px', padding: '40px', background: '#f5f5f5', borderRadius: '8px' }}>
        <h3 style={{ fontSize: '28px', marginBottom: '20px', color: '#333' }}>
          下載我們的應用
        </h3>
        <p style={{ fontSize: '16px', color: '#666', marginBottom: '30px' }}>
          在 iOS 和 Android 上下載 {appName} 應用，隨時隨地購物
        </p>
        <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
          <button
            style={{
              background: '#333',
              color: 'white',
              padding: '12px 30px',
              fontSize: '16px',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
            }}
          >
            App Store
          </button>
          <button
            style={{
              background: '#333',
              color: 'white',
              padding: '12px 30px',
              fontSize: '16px',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
            }}
          >
            Google Play
          </button>
        </div>
      </section>

      {/* Info Section */}
      <section style={{ marginBottom: '40px', padding: '20px', background: '#f9f9f9', borderRadius: '8px' }}>
        <h4 style={{ color: '#333', marginBottom: '10px' }}>API 信息</h4>
        <p style={{ color: '#666', fontSize: '14px' }}>
          API 伺服器：<code>{apiUrl}</code>
        </p>
        <p style={{ color: '#666', fontSize: '14px' }}>
          應用名稱：<code>{appName}</code>
        </p>
      </section>
    </div>
  )
}
