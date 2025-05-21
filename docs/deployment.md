# 部署流程文件

## 1. 環境需求
- Node.js 18+
- Vercel CLI
- Supabase 專案
- GitHub 帳號

## 2. 環境變數設定
在 Vercel 專案設定中，需要設定以下環境變數：
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 3. 標準部署流程

### 3.1 程式碼修改
1. 確保在正確的分支上工作：
   ```bash
   git checkout main
   ```

2. 進行程式碼修改

3. 提交變更：
   ```bash
   git add .
   git commit -m "feat: 更新功能說明"
   ```

### 3.2 推送到 GitHub
1. 推送到 GitHub：
   ```bash
   git push origin main
   ```

2. 確認 GitHub Actions 工作流程已啟動

### 3.3 自動部署
1. Vercel 會自動偵測 GitHub 的變更
2. 執行建置流程
3. 部署到 Vercel CDN

### 3.4 部署確認
1. 確認部署狀態：https://vercel.com/dashboard
2. 測試部署網址：https://barv3.vercel.app
3. 測試頁面連結：https://barv3.vercel.app/member-card-simple.html

## 4. 測試項目
1. 圖片上傳功能
   - 上傳新圖片
   - 預覽功能
   - 圖片 URL 更新
2. 會員卡編輯
   - 所有欄位可編輯
   - 預覽功能正常
3. 分享功能
   - 分享按鈕正常
   - Flex Message 格式正確

## 5. 回滾機制
如發現問題，可立即回滾到上一個穩定版本：
```bash
git checkout <previous-version>
git push origin main
```

## 6. 監控與維護
- 定期檢查 Vercel 部署狀態
- 監控錯誤日誌
- 追蹤使用者回饋

## 7. 自動部署連結
- GitHub 專案：https://github.com/tsamcservice/barv3
- Vercel 部署：https://barv3.vercel.app
- 測試頁面：https://barv3.vercel.app/member-card-simple.html 