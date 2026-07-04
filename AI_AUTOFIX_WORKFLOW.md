# AI AutoFix 自動檢查工作流程

本文檔描述了如何在代碼生成後自動檢查和修復問題，確保代碼質量。

## 工作流程概述

```
代碼生成 → AI AutoFix 檢查 → 修復問題 → 本地測試 → 提交 → Vercel 部署
```

## 檢查腳本

### 基礎檢查腳本
```bash
bash scripts/ai-autofix-check.sh
```

**檢查項目：**
1. page.tsx 和 client.tsx 配對
2. Dynamic 指令檢查
3. 組件名稱檢查
4. error.tsx 和 not-found.tsx 配置
5. 'use client' 指令檢查
6. TypeScript 編譯檢查

### 擴展檢查腳本（推薦）
```bash
bash scripts/ai-autofix-check-extended.sh
```

**檢查項目：**

#### 第一部分：基礎結構檢查
- page.tsx 和 client.tsx 配對
- Dynamic 指令檢查
- 組件名稱檢查
- error.tsx 和 not-found.tsx 配置

#### 第二部分：代碼風格檢查
- 未使用的 import
- console.log 調試代碼
- TODO/FIXME 註釋
- 硬編碼的 URL
- 代碼行長度（>120 字符）

#### 第三部分：性能檢查
- useEffect 使用情況
- useMemo/useCallback 優化
- 列表渲染方式（ScrollView vs FlatList）

#### 第四部分：安全檢查
- eval() 調用
- dangerouslySetInnerHTML 使用
- 硬編碼的密鑰/令牌

#### 第五部分：TypeScript 和構建檢查
- TypeScript 編譯
- ESLint 檢查

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

### 4. 代碼風格檢查
- ✅ 檢查 console.log 調試代碼
- ✅ 檢查 TODO/FIXME 註釋
- ✅ 檢查硬編碼的 URL（應使用環境變量）
- ✅ 檢查代碼行長度

### 5. 性能檢查
- ✅ 檢查 useEffect 使用
- ✅ 檢查性能優化（useMemo/useCallback）
- ✅ 檢查列表渲染方式

### 6. 安全檢查
- ✅ 檢查 eval() 調用
- ✅ 檢查 dangerouslySetInnerHTML 使用
- ✅ 檢查硬編碼的密鑰/令牌

## 使用方法

### 手動運行檢查
```bash
# 基礎檢查
bash scripts/ai-autofix-check.sh

# 擴展檢查（推薦）
bash scripts/ai-autofix-check-extended.sh
```

### 在 CI/CD 中使用
```bash
# 在 package.json 中添加
"scripts": {
  "ai-check": "bash scripts/ai-autofix-check.sh",
  "ai-check-extended": "bash scripts/ai-autofix-check-extended.sh",
  "build": "pnpm ai-check-extended && next build"
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

### 問題 5: console.log 調試代碼
**症狀：** 檢查發現多個 console.log 語句

**修復：**
1. 移除所有 console.log 調試代碼
2. 使用適當的日誌庫（如 winston、pino）進行生產環境日誌
3. 在開發環境中可以保留有限的調試日誌

### 問題 6: 硬編碼的 URL
**症狀：** 檢查發現硬編碼的 http:// 或 https://

**修復：**
1. 將 URL 移到環境變量中
2. 在 .env.local 中定義 URL
3. 在代碼中使用 `process.env.NEXT_PUBLIC_API_URL`

## 最佳實踐

### 生成新代碼時
1. 生成代碼後立即運行 `bash scripts/ai-autofix-check-extended.sh`
2. 修復所有報告的錯誤
3. 對警告進行審查並決定是否修復
4. 運行本地測試確保功能正常
5. 提交代碼並推送到 GitHub

### 提交前檢查清單
- [ ] 運行 `bash scripts/ai-autofix-check-extended.sh` 並確保通過
- [ ] 運行 `pnpm build` 確保本地構建成功
- [ ] 測試所有受影響的頁面功能
- [ ] 檢查 Git diff 確保沒有意外的更改
- [ ] 移除所有 console.log 調試代碼
- [ ] 確保沒有硬編碼的密鑰

### Vercel 部署前
- [ ] 確保所有本地檢查都通過
- [ ] 確保 Git 提交信息清晰
- [ ] 監控 Vercel 部署日誌

## 檢查結果解釋

### ✅ 綠色（通過）
表示檢查項目已通過，代碼符合要求。

### ⚠️ 黃色（警告）
表示檢查項目發現潛在問題，建議審查和修復，但不會阻止部署。

### ❌ 紅色（錯誤）
表示檢查項目發現嚴重問題，必須修復才能部署。

## 自動修復腳本

未來可以創建自動修復腳本，自動修復常見的問題：
- 自動修復無效的組件名稱
- 自動添加缺失的指令
- 自動修復 import/export 不匹配
- 自動移除 console.log 調試代碼
- 自動提取硬編碼的 URL 到環境變量

## 相關文件

- `scripts/ai-autofix-check.sh` - 基礎自動檢查腳本
- `scripts/ai-autofix-check-extended.sh` - 擴展自動檢查腳本
- `next.config.js` - Next.js 配置
- `app/error.tsx` - 錯誤邊界組件
- `app/not-found.tsx` - 404 頁面

## 聯繫支持

如果遇到無法自動修復的問題，請：
1. 查看 Vercel 部署日誌
2. 運行 `bash scripts/ai-autofix-check-extended.sh` 獲取詳細信息
3. 根據錯誤信息進行手動修復
4. 如果問題持續存在，請查看 Git 提交歷史以了解最近的更改
