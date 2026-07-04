'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
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
          <h1 style={{ fontSize: '48px', marginBottom: '10px', fontWeight: 'bold' }}>500</h1>
          <p style={{ fontSize: '18px', marginBottom: '20px', color: '#666' }}>
            服務器錯誤
          </p>
          <p style={{ fontSize: '14px', marginBottom: '30px', color: '#999' }}>
            抱歉，發生了一個錯誤。
          </p>
          <button
            onClick={() => reset()}
            style={{
              padding: '10px 20px',
              backgroundColor: '#0066cc',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px',
            }}
          >
            重試
          </button>
        </div>
      </body>
    </html>
  );
}
