# 部署保護說明

## 當前穩定版本
- **Commit**: 981ada8
- **部署日期**: 2026-07-03
- **部署平台**: Vercel (https://www.simeng.tw)

## 已完成的修改（不應被覆蓋）
1. ✅ Header 佈局重新設計 - Logo 置中 + 右邊導航
2. ✅ 下載按鈕替換為官方 App Store 和 Google Play 圖示
3. ✅ 「為什麼選擇 SIMENG」和「聯絡我們」並排佈局
4. ✅ 聯絡我們區塊灰色底色和標題水平對齊
5. ✅ 版權文字更新為「© 2026 喜萌SIMENG」
6. ✅ 輪播圖高度縮短

## 部署檢查清單
- [ ] 確認 Vercel 部署成功
- [ ] 驗證 https://www.simeng.tw 顯示最新修改
- [ ] 清除瀏覽器快取後重新驗證
- [ ] 檢查 GitHub 上的最新提交是否為 981ada8

## 防止覆蓋的措施
1. 所有修改已提交到 GitHub main 分支
2. Vercel 應部署 main 分支的最新代碼
3. 不應使用 git reset --hard 或強制推送
4. 所有新修改應通過 git add + git commit + git push 完成

## 如果修改被覆蓋
1. 檢查 Vercel 部署日誌
2. 檢查是否有其他分支被部署
3. 驗證 GitHub 上的代碼是否正確
4. 聯繫 Vercel 支持
