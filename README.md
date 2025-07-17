# 會員卡系統 v3 (barv3)

## 🎯 系統概述

這是一個基於 Next.js 的會員卡管理系統，支援 LINE LIFF 整合、點數管理、分享回饋等功能。

## 🎯 系統特色

### 分享卡專屬回饋系統 ⭐ (2025年6月21日新增)
- **5位置排列回饋**：A-E位置分別提供80%-50%-10%-10%-10%回饋
- **分享卡獨享**：所有位置的回饋點數統一給分享卡
- **活動卡支援**：活動卡可作為附屬卡片，扣點但不獲得回饋
- **臨時主卡機制**：當主卡不存在時自動生成臨時主卡處理

### 動態卡片設計
- 基於FlexBox的響應式佈局
- 支援圖片、文字、圖標等多種元素
- 即時預覽和編輯功能
- 多種卡片範本選擇

### 分享與社群功能
- 一鍵分享到LINE、Facebook等平台
- 自動生成分享圖片和連結
- 分享追蹤和統計分析
- 回饋點數自動計算和發放

### 點數管理系統
- 完整的點數交易記錄
- 支援扣除、回饋、充值等操作
- 詳細的交易歷史查詢
- 管理員點數設定功能

## 🚀 最新更新 (2025年6月21日)

### ✅ 重大修復完成
1. **分享流程優化**：移除重複確認對話框，簡化用戶操作
2. **回饋計算修正**：實現分享卡專屬回饋邏輯
3. **交易記錄完善**：每筆扣除和回饋都正確記錄到資料庫
4. **錯誤處理改進**：區分不同錯誤類型，提供清楚的解決建議
5. **前端體驗提升**：詳細的分享成功訊息和回饋明細

### 🔧 技術改進
- 修復JavaScript變數作用域問題
- 優化資料庫查詢邏輯
- 改進API錯誤處理
- 統一術語使用（分享卡/活動卡）

## 🛠️ 快速開始

### 環境需求
- Node.js 18.0+
- npm 或 yarn
- Supabase 帳號

### 安裝步驟

1. **克隆專案**
```bash
git clone [repository-url]
cd barv3
```

2. **安裝依賴**
```bash
npm install
```

3. **環境設定**
創建 `.env.local` 檔案：
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

4. **資料庫初始化**
```bash
# 執行資料庫腳本
psql -f supabase/supabase-init.sql
psql -f supabase/add-share-points-system.sql
psql -f supabase/fix-promo-cards-points.sql
```

5. **啟動開發伺服器**
```bash
npm run dev
```

訪問 `http://localhost:3000` 開始使用！

## 📁 專案結構

```
barv3/
├── pages/                    # Next.js 頁面
│   ├── api/                 # API 路由
│   │   ├── cards/          # 卡片相關API
│   │   ├── points-*.js     # 點數系統API
│   │   └── upload/         # 檔案上傳API
│   └── index.js            # 首頁
├── public/                  # 靜態資源
│   ├── js/                 # JavaScript檔案
│   ├── css/                # 樣式檔案
│   ├── *.html              # 靜態頁面
│   └── uploads/            # 上傳檔案
├── components/             # React元件
├── supabase/              # 資料庫腳本
├── docs/                  # 技術文件
├── scripts/               # 工具腳本
└── README.md
```

## 🎮 主要功能

### 1. 卡片編輯器
- **位置**: `/member-card-simple.html`
- **功能**: 拖拽式卡片設計、即時預覽、範本選擇
- **特色**: 支援多種元素類型、響應式佈局

### 2. 分享系統
- **核心邏輯**: 5位置排列回饋系統
- **支援平台**: LINE、Facebook、Twitter等
- **回饋機制**: 分享卡專屬回饋，最高80%回饋率

### 3. 點數管理
- **交易記錄**: `/points-history.html`
- **管理後台**: `/admin-points.html`
- **功能**: 點數查詢、充值、設定回饋比例

### 4. 首頁系統
- **Next.js首頁**: `/` (包含管理後台)
- **會員卡編輯**: `/member-card-simple.html` (簡化介面)

## 🔧 API 端點

### 卡片管理
- `GET /api/cards/list` - 獲取卡片列表
- `POST /api/cards/save` - 儲存卡片
- `DELETE /api/cards/delete` - 刪除卡片
- `POST /api/cards/pageview` - 分享處理 (核心API)

### 點數系統
- `GET /api/points-history` - 交易記錄查詢
- `GET /api/points-settings` - 點數設定查詢
- `POST /api/points-settings` - 點數設定更新
- `POST /api/cards/points` - 點數計算

### 檔案管理
- `POST /api/upload` - 檔案上傳
- `GET /api/uploaded-images` - 圖片列表

## 📊 資料庫結構

### 主要資料表
- `member_cards` - 會員卡資料
- `promo_cards` - 活動卡資料
- `points_transactions` - 點數交易記錄
- `share_sessions` - 分享會話記錄
- `uploaded_images` - 上傳圖片記錄
- `points_settings` - 點數系統設定

### 關鍵欄位
- `position_index` - 位置索引 (0-4對應A-E)
- `reward_percentage` - 回饋比例
- `transaction_type` - 交易類型 (deduction/reward)
- `card_type` - 卡片類型 (main/promo)

## 🎯 分享回饋邏輯

### 位置回饋比例
```
位置A (index 0): 80%回饋
位置B (index 1): 50%回饋  
位置C (index 2): 10%回饋
位置D (index 3): 10%回饋
位置E (index 4): 10%回饋
```

### 回饋分配規則
1. **分享卡專屬**：所有位置的回饋點數統一給分享卡
2. **活動卡支援**：活動卡只扣點，不獲得回饋
3. **位置計算**：根據整體排列順序計算位置索引
4. **扣點統一**：每張卡片扣除10點（未來可能差異化）

### 範例計算
```
分享組合: 活動卡A + 分享卡B + 活動卡C
扣除: 10+10+10 = 30點
回饋: 8+5+1 = 14點 (全部給分享卡B)
淨消耗: 30-14 = 16點
```

## 🛡️ 安全性

### 資料保護
- Row Level Security (RLS) 啟用
- API金鑰分離（匿名/服務金鑰）
- 輸入驗證和清理
- SQL注入防護

### 錯誤處理
- 統一錯誤格式
- 敏感資訊隱藏
- 詳細日誌記錄
- 友善錯誤訊息

## 📈 效能優化

### 前端優化
- 圖片懶載入
- 靜態資源CDN
- 程式碼分割
- 瀏覽器緩存控制

### 後端優化
- 資料庫索引優化
- API回應快取
- 查詢效能監控
- 連線池管理

## 🔍 故障排除

### 常見問題

1. **Next.js開發環境錯誤**
```bash
# 清理快取並重啟
rm -rf .next
npm run dev
```

2. **webpack錯誤**
```bash
# 強制終止Node進程並重啟
taskkill /F /IM node.exe
npm run dev
```

3. **資料庫連線問題**
- 檢查 `.env.local` 設定
- 確認Supabase服務狀態
- 驗證API金鑰權限

4. **分享功能異常**
- 檢查卡片ID格式
- 確認點數餘額充足
- 查看瀏覽器控制台錯誤

### 除錯工具
- `POST /api/simple-test` - 環境測試
- 瀏覽器開發者工具
- Supabase Dashboard
- 伺服器日誌

## 📚 相關文件

- [開發總結](docs/20250621-development-summary.md) - 最新修復記錄
- [API文件](docs/api-documentation.md) - 詳細API說明
- [系統架構](docs/system-architecture.md) - 技術架構文件
- [待辦事項](docs/mem-card-todo.md) - 開發計畫
- [效能分析](docs/performance-analysis.md) - 效能優化指南

## 🚀 部署指南

### Vercel部署
1. 連接GitHub倉庫
2. 設定環境變數
3. 自動部署完成

### 自定義部署
```bash
# 建置專案
npm run build

# 啟動生產伺服器
npm start
```

## 🤝 貢獻指南

1. Fork 專案
2. 創建功能分支 (`git checkout -b feature/amazing-feature`)
3. 提交變更 (`git commit -m 'Add amazing feature'`)
4. 推送分支 (`git push origin feature/amazing-feature`)
5. 開啟Pull Request

## 📝 版本記錄

### v3.2.0 (2025-06-21)
- ✅ 分享卡專屬回饋系統
- ✅ 臨時主卡支援機制
- ✅ 前端分享流程優化
- ✅ 點數交易記錄完善
- ✅ 錯誤處理全面改進

### v3.1.0 (2025-06-18)
- 基礎分享點數系統
- 點數交易記錄
- 管理後台功能

### v3.0.0 (2025-06-07)
- Next.js架構重構
- Supabase整合
- 現代化UI設計

## 📄 授權

本專案採用 MIT 授權條款。詳見 [LICENSE](LICENSE) 檔案。

## 📞 聯絡資訊

- 專案維護者: 開發團隊
- 技術支援: [建立Issue](https://github.com/your-repo/issues)
- 文件更新: 2025年6月21日

---

**🎉 感謝使用會員卡系統！如有任何問題或建議，歡迎提出Issue或Pull Request。**

## 🎯 自動分享回饋系統 (20250621-FINAL2)

**核心功能**：
- ✅ 直接分享連結自動回饋
- ✅ 動態回饋比例設定（管理後台位置5）
- ✅ 完整交易記錄
- ✅ 用戶友善提示

**使用方式**：
1. **管理員設定**：在 `admin-points.html` 位置5調整回饋比例
2. **用戶分享**：透過快捷連結 `pageId+userId` 自動分享
3. **自動回饋**：分享成功後自動獲得點數回饋

**技術特點**：
- 基礎扣點：10點
- 回饋計算：`10點 × 設定比例% = 回饋點數`
- 預設比例：10%
- 即時生效：無需重新部署

## 📱 使用指南

### 管理員操作
1. **設定回饋比例**
   - 開啟 `admin-points.html`
   - 調整位置5（最右邊）的回饋比例
   - 點擊「💾 儲存設定」

2. **查看交易記錄**
   - 開啟 `points-history.html`
   - 篩選交易類型和時間範圍
   - 匯出或分析數據

### 用戶操作
1. **編輯會員卡**
   - 開啟 `member-card-simple.html`
   - 編輯卡片內容和圖片
   - 預覽和分享

2. **快捷分享**
   - 使用連結：`https://liff.line.me/LIFF_ID?pageId=M01001&userId=USER_ID`
   - 自動分享並獲得回饋
   - 查看點數更新

## 🔧 配置說明

### LIFF 設定
```javascript
// LIFF 初始化
liff.init({ liffId: 'your-liff-id' });
```

### Supabase 設定
```javascript
// Supabase 客戶端
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);
```

## 🏷️ 版本標籤

### 20250621-FINAL2 (最新)
- ✅ 自動分享回饋功能完成
- ✅ 動態回饋比例設定
- ✅ 完整交易記錄系統
- ✅ 用戶體驗優化
- ✅ 彈跳視窗顯示修復

### 主要更新
- 新增自動分享回饋API
- 管理後台位置5回饋設定
- 分享成功彈跳視窗優化
- 完整的錯誤處理機制

## 📞 技術支援

### 常見問題
1. **分享回饋沒有生效？**
   - 檢查管理後台位置5設定
   - 確認卡片ID正確
   - 查看瀏覽器控制台錯誤

2. **點數計算不正確？**
   - 檢查 `points_settings` 表設定
   - 確認API返回值
   - 查看交易記錄詳情

### 開發聯絡
- 問題回報：GitHub Issues
- 功能建議：GitHub Discussions
- 技術諮詢：開發團隊

## 📄 授權條款

本專案採用 MIT 授權條款。

---

**最後更新**：2025年6月21日  
**版本**：20250621-FINAL2  
**狀態**：✅ 穩定運行，供後續開發使用
#   ��|vV e r c e l �r  -   0 7 / 1 7 / 2 0 2 5   2 0 : 1 9 : 1 7  
 