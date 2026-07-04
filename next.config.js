/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // 使用 standalone 輸出以便於部署
  output: 'standalone',
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'https://maibaoshop-hqnzqh8u.manus.space',
    NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME || '喜萌',
    NEXT_PUBLIC_LANGUAGE: process.env.NEXT_PUBLIC_LANGUAGE || 'zh-TW',
  },
  // 完全禁用靜態生成
  typescript: {
    tsconfigPath: './tsconfig.json',
  },

}

module.exports = nextConfig
