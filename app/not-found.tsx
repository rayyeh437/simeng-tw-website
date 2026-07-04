import Link from 'next/link';

export default function NotFound() {
  return (
    <html>
      <body style={{ margin: 0, padding: 0 }}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          backgroundColor: '#f5f5f5',
          padding: '20px',
          fontFamily: 'system-ui, -apple-system, sans-serif',
        }}>
          <h1 style={{ fontSize: '48px', marginBottom: '10px', fontWeight: 'bold' }}>404</h1>
          <p style={{ fontSize: '18px', marginBottom: '20px', color: '#666' }}>
            頁面未找到
          </p>
          <p style={{ fontSize: '14px', marginBottom: '30px', color: '#999' }}>
            抱歉，您要查找的頁面不存在。
          </p>
          <Link
            href="/"
            style={{
              padding: '10px 20px',
              backgroundColor: '#0066cc',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '4px',
              fontSize: '14px',
              display: 'inline-block',
            }}
          >
            返回首頁
          </Link>
        </div>
      </body>
    </html>
  );
}
