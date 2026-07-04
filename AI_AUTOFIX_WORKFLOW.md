# AI AutoFix 自動檢查工作流程

本文檔描述了如何在代碼生成後自動檢查和修復問題，確保代碼質量。

## 工作流程概述

```
代碼生成 → AI AutoFix 檢查 → 修復問題 → 本地測試 → 提交 → Vercel 部署
```

## 自動檢查項目

### 1. page.tsx 和 client.tsx 配對檢查
- ✅ 確保每個 page.tsx 都有對應的 client.tsx
- ✅ 確保 import 語句中的組件名稱與 client.tsx 中的 export 匹配
- ✅ 檢查組件名稱是否有效（不包含方括號等特殊字符）

### 2. Dynamic 指令檢查
- ✅ 所有 page.tsx 都應該有 `export const dynamic = 'force-dynamic'`
- ✅ 所有 client.tsx 都應該有 `'use client'`
- ✅ error.tsx 只應該有 `'use client'`，不應該有 dynamic 指令
- ✅ not-found.tsx 不應該有任何指令

### 3. 組件名稱檢查
- ✅ 檢查是否有無效的組件名稱（包含方括號）
- ✅ 動態路由頁面的組件名稱應該正確轉換（[id] → Id）

### 4. TypeScript 編譯檢查
- ✅ 運行 `pnpm tsc --noEmit` 確保沒有類型錯誤

## 使用方法

### 手動運行檢查
```bash
# 在項目根目錄運行
bash scripts/ai-autofix-check.sh
```

### 在 CI/CD 中使用
```bash
# 在 package.json 中添加
"scripts": {
  "ai-check": "bash scripts/ai-autofix-check.sh",
  "build": "pnpm ai-check && next build"
}
```

## 常見問題修復

### 問題 1: page.tsx 和 client.tsx 不匹配
**症狀：** `import { ComponentName } from './client'` 但 client.tsx 中沒有對應的 export

**修復：**
1. 檢查 client.tsx 中的 export 函數名稱
2. 確保 page.tsx 中的 import 語句與之匹配
3. 如果是動態路由，確保組件名稱正確轉換

### 問題 2: 動態路由組件名稱錯誤
**症狀：** `import { [Id]Client }` - 無效的 JavaScript 標識符

**修復：**
1. 將 `[id]` 轉換為 `Id`（首字母大寫）
2. 在 page.tsx 中使用 `import { IdClient }`
3. 在 client.tsx 中使用 `export function IdClient()`

### 問題 3: error.tsx 預生成超時
**症狀：** `Failed to build /_error: /500`

**修復：**
1. 確保 error.tsx 只有 `'use client'`
2. 不要添加 `export const dynamic = 'force-dynamic'`
3. 保持代碼簡單，沒有複雜的初始化邏輯

### 問題 4: not-found.tsx 預生成超時
**症狀：** `Export encountered an error on /_not-found/page`

**修復：**
1. 移除所有指令（`'use client'`、`export const dynamic` 等）
2. 保持代碼簡單，只返回 JSX
3. 不要在 not-found.tsx 中使用任何 hooks

## 最佳實踐

### 生成新代碼時
1. 生成代碼後立即運行 `bash scripts/ai-autofix-check.sh`
2. 修復所有報告的錯誤
3. 運行本地測試確保功能正常
4. 提交代碼並推送到 GitHub

### 提交前檢查清單
- [ ] 運行 `bash scripts/ai-autofix-check.sh` 並確保通過
- [ ] 運行 `pnpm build` 確保本地構建成功
- [ ] 測試所有受影響的頁面功能
- [ ] 檢查 Git diff 確保沒有意外的更改

### Vercel 部署前
- [ ] 確保所有本地檢查都通過
- [ ] 確保 Git 提交信息清晰
- [ ] 監控 Vercel 部署日誌

## 自動修復腳本

未來可以創建自動修復腳本，自動修復常見的問題：
- 自動修復無效的組件名稱
- 自動添加缺失的指令
- 自動修復 import/export 不匹配

## 相關文件

- `scripts/ai-autofix-check.sh` - 自動檢查腳本
- `next.config.js` - Next.js 配置
- `app/error.tsx` - 錯誤邊界組件
- `app/not-found.tsx` - 404 頁面

## 聯繫支持

如果遇到無法自動修復的問題，請：
1. 查看 Vercel 部署日誌
2. 運行 `bash scripts/ai-autofix-check.sh` 獲取詳細信息
3. 根據錯誤信息進行手動修復
