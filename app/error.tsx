'use client';

export const dynamic = 'force-dynamic';

export default function Error({ error }: { error: Error }) {
  return (
    <div style={{ textAlign: 'center', padding: '50px' }}>
      <h1>500 - 服務器錯誤</h1>
      <p>抱歉，發生了一個錯誤。</p>
    </div>
  );
}
