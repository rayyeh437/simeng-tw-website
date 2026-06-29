# 喜萌 - 台灣版網站

這是喜萌台灣版的官方網站，使用 Next.js 構建。

## 快速開始

### 安裝依賴

```bash
npm install
# 或
pnpm install
```

### 開發模式

```bash
npm run dev
# 或
pnpm dev
```

訪問 [http://localhost:3000](http://localhost:3000) 查看結果。

### 生產構建

```bash
npm run build
npm run start
```

## 環境變數

複製 `.env.example` 到 `.env.local` 並設定環境變數：

```bash
cp .env.example .env.local
```

### 可用的環境變數

- `NEXT_PUBLIC_API_URL` - API 伺服器地址（默認：https://api.simeng.tw）
- `NEXT_PUBLIC_APP_NAME` - 應用名稱（默認：喜萌）
- `NEXT_PUBLIC_LANGUAGE` - 應用語言（默認：zh-TW）

## 項目結構

```
simeng-tw-website/
├── app/
│   ├── layout.tsx       # 主佈局
│   ├── page.tsx         # 首頁
│   ├── globals.css      # 全局樣式
│   └── api/             # API 路由
├── public/              # 靜態資源
├── next.config.js       # Next.js 配置
├── tsconfig.json        # TypeScript 配置
├── package.json         # 項目配置
└── README.md           # 此文件
```

## 部署

### 部署到 Vercel

1. 推送代碼到 GitHub
2. 在 Vercel 中導入項目
3. 設定環境變數
4. 部署

### 自訂域名

在 Vercel 中配置自訂域名 `simeng.tw`

## 功能

- ✅ 響應式設計
- ✅ 快速加載
- ✅ SEO 優化
- ✅ 環境變數支持
- ✅ TypeScript 支持

## 許可證

© 2024 喜萌。版權所有。
