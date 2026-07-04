import Link from 'next/link'

export default function NotFound() {
  return (
    <div style={{ textAlign: 'center', padding: '50px' }}>
      <h1>404 - 頁面未找到</h1>
      <p>抱歉，您要查找的頁面不存在。</p>
      <Link href="/" style={{ color: '#7c3aed', textDecoration: 'none' }}>
        返回首頁
      </Link>
    </div>
  )
}
