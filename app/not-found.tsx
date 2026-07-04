'use client';
export const dynamic = 'force-dynamic';

export default function NotFound() {
  return (
    <div style={{ textAlign: 'center', padding: '50px' }}>
      <h1>404 - 頁面未找到</h1>
      <p>抱歉，您要查找的頁面不存在。</p>
    </div>
  );
}
