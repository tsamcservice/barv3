# 📱 手機版會員卡開發重點文件

## 📅 建立日期：2025-06-24
## 🎯 版本：v20250624-MOBILE-FINAL

---

## 🔧 LIFF 配置

### LIFF ID 設定
```javascript
// 🆕 手機版專用 LIFF ID
const LIFF_CONFIG = {
  liffId: '2007327814-DGly5XNk',
  url: 'https://liff.line.me/2007327814-DGly5XNk',
  endpointUrl: 'https://barv3.vercel.app/member-card-mobile.html',
  size: 'tall',
  scopes: ['openid', 'profile', 'chat_message.write']
};

// 🔄 對比：Simple版本 LIFF ID
const SIMPLE_LIFF_ID = '2007327814-YqvGJlmZ';
```

### LIFF 初始化架構
```javascript
const UNIFIED_LIFF = {
  isReady: false,
  profile: {
    userId: null,
    displayName: null,
    pictureUrl: null
  },
  environment: {
    isInClient: false,
    isLoggedIn: false,
    os: 'web'
  }
};
```

---

## 🏗️ 系統架構

### 檔案結構
```
📁 public/
├── 📄 member-card-mobile.html    # 手機版主頁面
├── 📄 member-card-simple.html    # Simple版本（舊版）
├── 📄 member-card-desktop.html   # 桌機版本
└── 📁 js/
    ├── 📄 member-card-mobile.js  # 手機版主程式
    ├── 📄 member-card-simple.js  # Simple版本程式
    └── 📄 member-card-desktop.js # 桌機版本程式
```

### 版本識別系統
```javascript
const VERSION_TAG = 'MOBILE-v20250624';
const MOBILE_FEATURES = {
  deviceDetection: true,      // 設備檢測
  tabNavigation: true,        // 頁籤導航
  touchOptimization: true,    // 觸控優化
  bridgeShare: true,          // 橋接分享
  debugMode: false            // 調試模式
};
```

---

## 🎨 UI/UX 特色

### 三頁籤設計
```html
<!-- 📱 手機版頁籤導航 -->
<div class="mobile-tabs">
  <button class="tab-btn active" data-tab="text-image">
    <div class="tab-icon">📝</div>
    <div class="tab-text">卡片編輯</div>
  </button>
  <button class="tab-btn" data-tab="promo-cards">
    <div class="tab-icon">🎨</div>
    <div class="tab-text">附加卡片</div>
  </button>
  <button class="tab-btn" data-tab="preview">
    <div class="tab-icon">👀</div>
    <div class="tab-text">卡片預覽</div>
  </button>
</div>
```

### 手機版優化特色
1. **簡化欄位顯示**：僅顯示核心欄位，隱藏進階設定
2. **大色塊顏色選擇器**：60x40px 大色塊設計
3. **多行副標題**：支援3行高的textarea
4. **觸控友善**：大按鈕、適當間距
5. **響應式設計**：適配不同手機尺寸

---

## 🔄 程式執行流程

### 初始化順序
```javascript
1. DOMContentLoaded 事件觸發
2. initMobileVersionCheck()     // 版本檢查
3. initMobileTabs()            // 頁籤功能
4. initMobileNavigation()      // 導航功能
5. initUnifiedSystem()         // 統一LIFF系統
   ├── initUnifiedLiff()       // LIFF初始化
   ├── handleAutoShareMode()   // 自動分享模式
   └── initGeneralMode()       // 一般編輯模式
     ├── fillAllFieldsWithProfile()  // 載入用戶資料
     ├── loadPromoCards()            // 載入宣傳卡片
     └── renderPreview()             // 渲染預覽
```

### 排序處理邏輯
```javascript
// ✅ 正確的排序處理流程
1. fillAllFieldsWithProfile()
   └── 暫存 window.pendingCardData = { card_order: [...] }

2. loadPromoCards()
   ├── 檢查 window.pendingCardData
   ├── 按照 card_order 重建 allCardsSortable
   └── 更新 selectedPromoCards

3. renderPreview() 
   └── 使用正確排序的 allCardsSortable
```

---

## 💰 點數系統架構

### 當前實現
```javascript
// 分享扣點機制
const SHARE_COST_PER_CARD = 10;  // 每張卡片10點

// 點數檢查流程
1. 計算所需點數 = 卡片數量 × 10點
2. 檢查用戶當前點數
3. 點數足夠 → 執行分享並扣點
4. 點數不足 → 顯示錯誤訊息
```

### 待開發功能
- [ ] **點數儲值系統**：LINE Pay 整合
- [ ] **點數獲得機制**：
  - [ ] 每日簽到獲得點數
  - [ ] 分享獲得點數回饋
  - [ ] 邀請好友獲得點數
- [ ] **點數歷史記錄**：查看點數使用明細
- [ ] **VIP會員制度**：高級會員享有點數優惠

---

## 🔗 API 整合

### 主要API端點
```javascript
// 卡片相關
GET  /api/cards?pageId=M01001&userId={userId}  // 取得個人卡片
POST /api/cards                               // 儲存卡片
POST /api/cards/pageview                      // 更新瀏覽數+點數交易

// 宣傳卡片
GET  /api/promo-cards                         // 取得宣傳卡片列表

// 圖片管理
GET  /api/uploaded-images                     // 取得圖片庫
POST /api/upload                              // 上傳圖片

// 點數系統
GET  /api/points-history                      // 點數歷史
POST /api/points-settings                     // 點數設定
```

### 資料庫欄位
```sql
-- cards 資料表關鍵欄位
{
  "id": "uuid",
  "page_id": "M01001",
  "line_user_id": "LINE用戶ID",
  "card_order": ["main", "promo1", "promo2", ...],  -- 排序資訊
  "user_points": 100,                                -- 用戶點數
  "flex_json": {...},                               -- FLEX訊息JSON
  "created_at": "2025-06-24T10:00:00Z"
}
```

---

## 🚀 後續開發計劃

### Phase 1: 點數系統完善 (優先級：高)
- [ ] LINE Pay 儲值整合
- [ ] 點數獲得機制
- [ ] 點數歷史查詢
- [ ] VIP會員制度

### Phase 2: 功能增強 (優先級：中)
- [ ] 卡片模板系統
- [ ] 批次編輯功能
- [ ] 卡片分類管理
- [ ] 社群分享功能

### Phase 3: 數據分析 (優先級：中)
- [ ] 卡片瀏覽統計
- [ ] 用戶行為分析
- [ ] 熱門卡片排行
- [ ] 分享效果追蹤

### Phase 4: 進階功能 (優先級：低)
- [ ] AI 卡片設計建議
- [ ] 動態效果編輯器
- [ ] 多語言支援
- [ ] 離線編輯模式

---

## 🔧 開發注意事項

### 1. LIFF 開發要點
```javascript
// ✅ 必須檢查項目
- LIFF ID 正確性
- 初始化順序
- 登入狀態檢查
- 錯誤處理機制
```

### 2. 手機版特殊處理
```javascript
// 📱 手機版專屬功能
- 觸控手勢優化
- 螢幕尺寸適配
- 網路狀況處理
- 電池使用優化
```

### 3. 效能優化
```javascript
// ⚡ 效能優化要點
- 圖片懶載入
- API 請求合併
- 快取機制
- 程式碼分割
```

### 4. 測試要點
```javascript
// 🧪 測試檢查清單
- [ ] 不同手機尺寸測試
- [ ] LINE 內建瀏覽器測試
- [ ] 網路斷線恢復測試
- [ ] 長時間使用測試
```

---

## 📊 效能指標

### 目標指標
- **載入時間**：< 3秒
- **首次互動**：< 1秒
- **記憶體使用**：< 50MB
- **網路請求**：< 10個

### 監控工具
- Google Analytics
- LINE 內建分析
- 自定義錯誤追蹤
- 效能監控面板

---

## 📞 技術支援

### 聯絡資訊
- **開發團隊**：TSAMC Service
- **技術文檔**：此文檔
- **BUG回報**：GitHub Issues
- **功能建議**：產品需求文檔

### 相關資源
- [LINE LIFF 官方文檔](https://developers.line.biz/en/docs/liff/)
- [Flex Message 設計工具](https://developers.line.biz/flex-simulator/)
- [專案 GitHub](https://github.com/tsamcservice/barv3)

---

*📝 此文檔會隨著開發進度持續更新*
*�� 最後更新：2025-06-24* 