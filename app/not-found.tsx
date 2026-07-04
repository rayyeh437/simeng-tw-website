import Link from 'next/link'
import styles from './error.module.css';

export default function NotFound() {
  return (
    <div className={styles.container}>
      <h1>404 - 頁面未找到</h1>
      <p>抱歉，您要查找的頁面不存在。</p>
      <Link href="/" className={styles.link}>
        返回首頁
      </Link>
    </div>
  )
}
