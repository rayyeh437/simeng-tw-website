# Vercel 部署指南 - Fixie 代理配置

本指南說明如何在 Vercel 上配置 Fixie 代理環境變數並部署網頁。

## 步驟 1: 在 Vercel 後台添加環境變數

### 1.1 進入 Vercel 專案設定

1. 登入 Vercel (https://vercel.com)
2. 進入您的專案 **simeng-tw-website**
3. 點擊 **Settings** (設定)
4. 在左側菜單中找到 **Environment Variables** (環境變數)

### 1.2 添加 NEXT_PUBLIC_FIXIE_URL

1. 點擊 **Add New** (添加新的)
2. 填寫以下資訊:

| 欄位 | 值 |
|------|-----|
| **Name** | `NEXT_PUBLIC_FIXIE_URL` |
| **Value** | `http://fixie:O2vgfgxQnqLBLkn@criterium.usefixie.com:80` |
| **Environments** | 選擇 **Production**, **Preview**, **Development** |

3. 點擊 **Save** (保存)

### 1.3 添加 NEXT_PUBLIC_FIXIE_PROXY_TYPE (可選)

1. 點擊 **Add New**
2. 填寫以下資訊:

| 欄位 | 值 |
|------|-----|
| **Name** | `NEXT_PUBLIC_FIXIE_PROXY_TYPE` |
| **Value** | `http` |
| **Environments** | 選擇 **Production**, **Preview**, **Development** |

3. 點擊 **Save**

## 步驟 2: 觸發重新部署

### 方法 1: 自動部署 (推薦)

由於我們已經推送代碼到 GitHub，Vercel 應該會自動檢測到新的提交並部署。

**檢查部署狀態:**
1. 進入 Vercel 專案
2. 點擊 **Deployments** (部署)
3. 查看最新的部署是否正在進行或已完成

### 方法 2: 手動觸發部署

1. 進入 Vercel 專案
2. 點擊 **Deployments** (部署)
3. 找到最新的部署
4. 點擊 **Redeploy** (重新部署)

### 方法 3: 從 Git 推送觸發

```bash
cd /home/ubuntu/simeng-tw-website
git commit --allow-empty -m "Trigger Vercel deployment"
git push
```

## 步驟 3: 驗證部署

### 3.1 檢查部署狀態

1. 進入 Vercel 專案
2. 點擊 **Deployments** (部署)
3. 等待部署完成 (狀態應顯示 "Ready")

### 3.2 測試網頁

1. 訪問 https://www.simeng.tw
2. 打開瀏覽器開發者工具 (F12)
3. 進入 **Console** (控制台)
4. 查看是否有 `[API]` 或 `[ProxyAPI]` 的日誌消息

**預期日誌:**
```
[API] 使用伺服器端代理發送請求
[ProxyAPI] GET 請求: https://maibaoshop-hqnzqh8u.manus.space/trpc/products.categories?input={}
[ProxyAPI] 使用 Fixie 代理發送請求
```

## 步驟 4: 在後端日誌中驗證固定 IP

### 4.1 查看後端日誌

1. 進入後端應用的日誌系統 (例如 Manus 平台)
2. 查看最近的請求日誌
3. 檢查請求的來源 IP

### 4.2 預期結果

**固定 IP 驗證:**

| 項目 | 預期值 |
|------|--------|
| **請求來源 IP** | Fixie 的固定 IP (例如: 203.0.113.42) |
| **不再是** | Vercel 的動態 IP (例如: 64.29.17.1 或 216.198.79.1) |
| **一致性** | 所有請求都來自相同的 IP |

### 4.3 後端日誌示例

```
[2026-07-02 12:00:00] API 請求
  - 來源 IP: 203.0.113.42 (Fixie 固定 IP) ✅
  - 端點: /trpc/products.categories
  - 狀態: 200 OK
  - 時間: 245ms

[2026-07-02 12:00:05] API 請求
  - 來源 IP: 203.0.113.42 (Fixie 固定 IP) ✅
  - 端點: /trpc/products.search
  - 狀態: 200 OK
  - 時間: 312ms
```

## 故障排查

### 問題 1: 部署失敗

**症狀:** Vercel 顯示 "Build Failed"

**解決方案:**
1. 檢查 Vercel 部署日誌
2. 確認所有環境變數已正確添加
3. 嘗試手動觸發重新部署

### 問題 2: 代理未被使用

**症狀:** 日誌中沒有 `[ProxyAPI]` 消息

**解決方案:**
1. 確認 `NEXT_PUBLIC_FIXIE_URL` 環境變數已添加
2. 檢查環境變數是否應用到 Production 環境
3. 清除瀏覽器快取並重新加載頁面

### 問題 3: API 請求失敗

**症狀:** API 返回 500 錯誤或超時

**解決方案:**
1. 驗證 Fixie 代理 URL 正確
2. 檢查 Fixie 帳戶是否有效
3. 查看 Vercel 函數日誌中的詳細錯誤
4. 嘗試禁用代理測試直接連接

## 環境變數參考

### NEXT_PUBLIC_FIXIE_URL

- **格式**: `http://user:password@host:port`
- **範例**: `http://fixie:O2vgfgxQnqLBLkn@criterium.usefixie.com:80`
- **來源**: Fixie 後台 Dashboard → Connection
- **必需**: 是
- **作用**: 指定 Fixie 代理伺服器位置

### NEXT_PUBLIC_FIXIE_PROXY_TYPE

- **值**: `http` 或 `socks5`
- **默認**: `http`
- **必需**: 否
- **作用**: 指定代理協議類型

## 監控和驗證

### 實時監控

1. **Vercel 函數日誌**
   - 進入 Vercel 專案 → Deployments → 選擇部署 → Logs
   - 查看 `/api/proxy` 路由的日誌

2. **後端日誌**
   - 進入後端應用的日誌系統
   - 搜索 "Fixie" 或特定 IP 地址
   - 驗證所有請求都來自固定 IP

### 定期檢查

- 每天檢查一次部署狀態
- 監控 API 錯誤率
- 驗證固定 IP 的一致性

## 相關文件

- `app/api/proxy/route.ts` - 代理 API 實現
- `lib/api.ts` - API 客戶端
- `FIXIE_PROXY_SETUP.md` - 本地開發配置

## 支持

如有問題，請檢查:
1. Vercel 部署日誌
2. 環境變數配置
3. Fixie 後台狀態
4. 後端 API 日誌
