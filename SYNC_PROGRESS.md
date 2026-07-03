# SIMENG App → 網頁版本功能同步進度

## 已完成的功能

### 第一階段：用戶認證系統 ✅
- [x] 更新 auth-api.ts 支持 localStorage Token 存儲
- [x] 更新 useAuth hook 支持本地緩存和 API 同步
- [x] 創建用戶登入頁面 (/user-login)
  - [x] 帳號密碼登入
  - [x] 手機 OTP 驗證登入
  - [x] 「保持登入」功能
- [x] 創建用戶註冊頁面 (/user-register)
  - [x] 顯示會員編號（memberCode: SM + 6位數字）
  - [x] 服務條款和隱私政策同意
- [x] 更新個人資料頁面 (/profile)
  - [x] 顯示會員編號（memberCode）
  - [x] 暱稱管理（14天冷卻期）
  - [x] 真實姓名顯示（保存後鎖定）
  - [x] 手機號碼管理
  - [x] 登出功能

### 第二階段：商品搜尋與分類 ✅ (部分)
- [x] 商品列表頁面 (/products)
  - [x] 搜尋功能
  - [x] 分類篩選
  - [x] 商品網格展示
  - [ ] 價格範圍篩選
  - [ ] 排序選項（最新、價格低到高、價格高到低、推薦）
  - [ ] 分頁加載

## 待實現的功能

### 第三階段：訂單管理
- [ ] 訂單列表頁面 (/orders)
  - [ ] 訂單狀態篩選（待出貨、已出貨、已完成、已取消）
  - [ ] 下拉刷新功能
  - [ ] 分頁加載
- [ ] 訂單詳情頁面 (/orders/[id])
  - [ ] 商品資訊展示
  - [ ] 收件人與配送地址
  - [ ] 配送追蹤號碼
  - [ ] 訂單時間線

### 第四階段：個人資料與地址管理
- [ ] 地址管理頁面
  - [ ] 新增地址
  - [ ] 編輯地址
  - [ ] 刪除地址
  - [ ] 設定預設地址
  - [ ] 台灣地址聯動選單
- [ ] 個人資料編輯
  - [ ] 暱稱修改（14天冷卻期）
  - [ ] 手機號碼驗證

### 第五階段：其他功能
- [ ] 購物車功能
- [ ] 願望清單功能
- [ ] 通知中心
- [ ] 管理後台

## API 端點同步狀態

### 認證相關
- [x] /trpc/auth.loginLocal - 本地登入
- [x] /trpc/auth.registerLocal - 本地註冊
- [x] /trpc/auth.me - 獲取當前用戶
- [x] /trpc/auth.logout - 登出
- [x] /trpc/auth.sendOtpSms - 發送 OTP 驗證碼
- [x] /trpc/auth.verifyOtp - 驗證 OTP

### 商品相關
- [x] /trpc/products.categories - 獲取分類
- [x] /trpc/products.search - 搜尋商品
- [ ] /trpc/products.get - 獲取商品詳情
- [ ] /trpc/products.featured - 獲取推薦商品

### 訂單相關
- [ ] /trpc/orders.list - 獲取訂單列表
- [ ] /trpc/orders.get - 獲取訂單詳情
- [ ] /trpc/orders.stats - 獲取訂單統計

### 地址相關
- [ ] /trpc/addresses.list - 獲取地址列表
- [ ] /trpc/addresses.create - 新增地址
- [ ] /trpc/addresses.update - 編輯地址
- [ ] /trpc/addresses.delete - 刪除地址
- [ ] /trpc/addresses.setDefault - 設定預設地址

## 部署信息

- **部署平台**: Vercel
- **部署域名**: https://www.simeng.tw
- **GitHub 倉庫**: https://github.com/rayyeh437/simeng-tw-website
- **最新提交**: 4095345

## 下一步行動

1. 實現商品詳情頁面
2. 實現訂單列表和詳情頁面
3. 實現地址管理功能
4. 集成購物車功能
5. 進行端到端測試

## 注意事項

- 所有認證相關的 API 調用都使用 tRPC 格式
- Token 存儲在 localStorage 中（鍵名: `auth_session_token`）
- 用戶信息存儲在 localStorage 中（鍵名: `auth_user`）
- 會員編號格式：SM + 6位隨機數字（例如：SM482037）
- 暱稱修改需要等待 14 天才能再次修改
- 真實姓名保存後無法修改
