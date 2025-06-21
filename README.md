# 會員卡系統 (Member Card System)

一個功能完整的會員卡管理和分享系統，支援點數經濟、卡片組合分享等功能。

## 🎯 最新更新 (2025/06/21)

### v20250621-FINAL - 分享點數系統完整修復
- ✅ **分享卡專屬回饋機制**：所有位置回饋統一給分享卡
- ✅ **5位置排列系統**：A(80%) B(50%) C(10%) D(10%) E(10%)
- ✅ **臨時主卡支援**：自動處理主卡不存在情況
- ✅ **完整交易記錄**：扣除和回饋完整記錄到資料庫
- ✅ **簡化分享流程**：移除確認對話框，直接分享
- ✅ **名詞統一**：主卡→分享卡，附加卡→活動卡
- ✅ **詳細回饋顯示**：清楚展示各位置賺取明細

## 🌟 核心功能

### 分享卡系統
- **搭載功能**：可搭配最多4張活動卡進行組合分享
- **專屬回饋**：獲得所有位置的回饋點數
- **位置靈活**：可在任意位置獲得對應回饋
- **臨時支援**：系統自動處理特殊情況

### 點數經濟系統
- **分享扣點**：每張卡片扣除10點數
- **位置回饋**：根據5位置排列系統計算回饋
- **交易記錄**：完整的扣除和回饋記錄
- **餘額管理**：即時更新點數餘額

### 卡片管理
- **分享卡**：核心功能卡片，可獲得回饋
- **活動卡**：內容豐富化工具，僅扣點不回饋
- **圖片上傳**：支援多種格式圖片上傳
- **預覽功能**：分享前可預覽效果

## 🚀 快速開始

### 環境需求
- Node.js 18+
- Next.js 15+
- Supabase 資料庫

### 安裝步驟
```bash
# 克隆專案
git clone [repository-url]
cd barv3

# 安裝依賴
npm install

# 設定環境變數
cp .env.example .env.local
# 編輯 .env.local 填入 Supabase 配置

# 初始化資料庫
# 執行 supabase/ 目錄下的 SQL 腳本

# 啟動開發服務器
npm run dev
```

### 訪問應用
- 主頁面：http://localhost:3000
- 會員卡編輯器：http://localhost:3000/member-card-simple.html
- 點數交易記錄：http://localhost:3000/points-history.html
- 管理後台：http://localhost:3000/admin-points.html

## 📁 專案結構

```
barv3/
├── pages/
│   ├── api/                 # API 路由
│   │   ├── cards/          # 卡片相關 API
│   │   ├── points-*.js     # 點數系統 API
│   │   └── upload/         # 圖片上傳 API
│   └── index.js            # Next.js 主頁
├── public/
│   ├── js/                 # 前端 JavaScript
│   ├── css/                # 樣式文件
│   ├── *.html              # 靜態頁面
│   └── uploads/            # 上傳的圖片
├── components/             # React 組件
├── docs/                   # 文件目錄
├── supabase/              # 資料庫腳本
└── scripts/               # 工具腳本
```

## 🎯 主要功能頁面

### 1. 會員卡編輯器 (`member-card-simple.html`)
- 卡片設計和編輯
- 分享功能
- 點數顯示

### 2. 點數交易記錄 (`points-history.html`)
- 交易記錄查詢
- 卡片類型篩選
- 日期範圍查詢

### 3. 管理後台 (`admin-points.html`)
- 點數設定管理
- 系統參數配置

## 📊 API 端點

### 卡片相關
- `GET /api/cards/list` - 卡片列表
- `POST /api/cards/save` - 儲存卡片
- `POST /api/cards/pageview` - 分享處理
- `POST /api/cards/points` - 點數計算

### 點數系統
- `GET /api/points-settings` - 點數設定查詢
- `POST /api/points-settings` - 點數設定更新
- `GET /api/points-history` - 交易記錄查詢

### 圖片管理
- `POST /api/upload` - 圖片上傳
- `GET /api/uploaded-images` - 已上傳圖片列表

## 🔧 版本回復

### 回復到穩定版本
```bash
# 使用回復腳本
.\scripts\restore-20250621-final.ps1

# 或手動回復
git checkout v20250621-FINAL
```

### 切換回開發版本
```bash
git checkout master
```

## 📚 文件資源

- [開發總結](docs/20250621-development-summary.md) - 詳細的開發過程和技術實現
- [分享卡功能指南](docs/分享卡功能說明與行銷文件.md) - 用戶使用指南
- [TODO清單](docs/mem-card-todo.md) - 待開發功能列表
- [API文件](docs/api-documentation.md) - API詳細說明
- [系統架構](docs/system-architecture.md) - 系統設計說明

## 🎯 分享卡使用指南

### 基本概念
- **分享卡**：可搭載其他卡片並獲得所有回饋的核心卡片
- **活動卡**：提供內容豐富化的附屬卡片，僅扣點不回饋

### 位置回饋系統
```
位置A (80%) | 位置B (50%) | 位置C (10%) | 位置D (10%) | 位置E (10%)
```

### 使用策略
1. **高回饋策略**：分享卡放A位置，最大化回饋
2. **高曝光策略**：分享卡+多張活動卡，最大化內容
3. **平衡策略**：分享卡+1-2張活動卡，兼顧成本效果

## 🛠️ 開發工具

### 資料庫管理
- Supabase Dashboard
- SQL 腳本位於 `supabase/` 目錄

### 調試工具
- Browser DevTools
- Next.js 開發模式
- API 測試端點：`/api/simple-test`

## 🔒 安全性

- RLS (Row Level Security) 政策
- API 速率限制
- 圖片上傳驗證
- 輸入資料驗證

## 📈 性能優化

- 圖片壓縮和優化
- API 響應緩存
- 資料庫查詢優化
- 前端資源壓縮

## 🤝 貢獻指南

1. Fork 專案
2. 創建功能分支
3. 提交變更
4. 發起 Pull Request

## 📄 授權

此專案採用 MIT 授權條款。

## 📞 支援

如有問題或建議，請：
- 查看文件目錄
- 檢查 TODO 清單
- 聯繫開發團隊

---

**版本**: v20250621-FINAL  
**狀態**: 穩定版本 - 分享點數系統完整修復  
**更新日期**: 2025年6月21日
