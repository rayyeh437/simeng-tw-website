'use client';

import styles from './error.module.css';

export default function Error({ error }: { error: Error }) {
  return (
    <div className={styles.container}>
      <h1>500 - 服務器錯誤</h1>
      <p>抱歉，發生了一個錯誤。</p>
    </div>
  );
}
