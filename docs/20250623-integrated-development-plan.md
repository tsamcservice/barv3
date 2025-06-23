# 🚀 會員卡系統整合開發計劃
## 版本：v20250623 | 最後更新：2025-06-23

---

## 📋 **系統架構總覽**

### **雙軌系統設計**
```
🖥️ 桌機版：活動卡管理系統
├── 非LIFF環境，一般網頁應用
├── 多元登入：LINE Login/Google/Email
├── 管理P、A開頭活動卡片
├── 進階編輯、批次管理功能
└── 分享挑戰：需橋接到手機版LIFF

📱 手機版：會員卡分享系統 (現有LIFF)
├── LIFF ID: 2007327814-BdWpj70m
├── 專責M開頭會員卡(分享卡)
├── shareTargetPicker分享功能
├── 回饋機制：位置4組合回饋10%
└── 保持現有穩定功能
```

---

## 🎯 **卡片類型分工**

### **📱 手機版 (LIFF) - 會員卡系統**
- **M開頭**：會員卡(分享卡) - 可附加其他活動卡
- **功能**：快速編輯、即時分享、回饋機制
- **分享**：直接使用shareTargetPicker
- **回饋**：現有機制 - 位置4組合回饋10%到會員卡

### **🖥️ 桌機版 - 活動卡管理系統**
- **P開頭**：活動卡片
- **A開頭**：其他活動卡
- **功能**：新增、管理、編輯、加值
- **分享挑戰**：無法直接使用shareTargetPicker

---

## 📊 **使用場景流程**

### **場景1：新用戶首次使用會員卡**
```
1. 用戶點擊分享連結：?pageId=M01001 (僅M開頭)
2. 📱 手機版LIFF啟動
3. LINE登入 → 獲取userId
4. 檢查無現有卡片 → 創建新卡（帶入LINE頭像/名字）
5. 顯示簡化編輯介面
6. 分享成功 → 獲得回饋點數 (編輯暫不回饋)
```

### **場景2：桌機版活動卡管理與分享**
```
1. 用戶訪問桌機版：member-card-desktop.html
2. 多元登入（LINE/Google/Email）
3. 管理P、A開頭活動卡片
4. 進階編輯功能
5. 分享挑戰：需橋接到手機版LIFF啟動shareTargetPicker
   - 方案A：開啟手機版LIFF視窗橋接
   - 方案B：LINE Login + Messaging API
6. 分享完成（透過手機版LIFF）
```

### **場景3：現有用戶直接分享**
```
1. 任何人在LINE中點擊連結：?pageId=M01001&userId=xxx
2. 📱 手機版直接載入個人卡片
3. 直接啟動shareTargetPicker分享
4. 回饋機制：該卡片組合(位置4)的10%回饋到會員卡
```

---

## 🔧 **技術解決方案**

### **核心技術挑戰：桌機版分享**

#### **方案A：桌機版 → 手機版LIFF橋接 (推薦)**
```javascript
// 桌機版分享核心邏輯
function shareFromDesktop(cardData) {
  // 1. 準備分享資料
  const sharePackage = {
    action: 'shareTargetPicker',
    cardData: cardData,
    userId: getCurrentUserId(),
    timestamp: Date.now()
  };
  
  // 2. 開啟手機版LIFF橋接視窗
  const shareWindow = window.open(
    `https://liff.line.me/2007327814-BdWpj70m?bridgeShare=${encodeData(sharePackage)}`,
    'liffShare',
    'width=400,height=600,scrollbars=yes'
  );
  
  // 3. 監聽分享完成
  window.addEventListener('message', handleShareResult);
}
```

#### **方案B：LINE Login + Messaging API**
```javascript
// 桌機版LINE Login整合
function initDesktopLineLogin() {
  // 使用LINE Login API (非LIFF)
  // 獲取access token後使用Messaging API分享
}
```

### **資料庫架構**
```sql
-- 統一用戶表
CREATE TABLE unified_users (
  id UUID PRIMARY KEY,
  line_user_id TEXT,
  google_user_id TEXT,
  email TEXT,
  unified_user_id TEXT UNIQUE,
  created_at TIMESTAMP
);

-- 卡片表 (支援M/P/A類型)
CREATE TABLE cards (
  page_id TEXT,           -- M01001, P01001, A01001
  unified_user_id TEXT,
  card_type CHAR(1),      -- M/P/A
  card_data JSONB,
  created_at TIMESTAMP,
  PRIMARY KEY (page_id, unified_user_id)
);
```

---

## 📅 **開發階段規劃**

### **階段1：桌機版基礎建設 (3-5天)**
- [ ] 創建 `member-card-desktop.html`
- [ ] 多元登入系統整合
- [ ] 基礎編輯功能
- [ ] 資料庫API調整

### **階段2：分享橋接機制 (2-3天)**
- [ ] 桌機版 → 手機版LIFF橋接
- [ ] 分享完成回調機制
- [ ] 錯誤處理與用戶體驗

### **階段3：手機版優化 (1-2天)**
- [ ] 移除統一LIFF功能
- [ ] 保留登入狀況顯示
- [ ] 介面微調優化

### **階段4：測試與部署 (1-2天)**
- [ ] 跨平台測試
- [ ] 分享流程驗證
- [ ] 生產環境部署

---

## ⚠️ **風險控制策略**

### **保護現有系統**
- ✅ **不動 member-card-simple.html** (已有用戶使用)
- ✅ **保持現有LIFF功能穩定**
- ✅ **向後相容所有現有分享連結**

### **開發安全措施**
- 🔄 **獨立分支開發**
- 🧪 **完整測試環境**
- 📦 **階段性部署**
- 🔙 **快速回滾機制**

---

## 🎯 **成功指標**

### **功能指標**
- [ ] 桌機版活動卡管理正常運作
- [ ] 桌機版分享功能成功橋接
- [ ] 手機版會員卡功能保持穩定
- [ ] 回饋機制正確運作

### **性能指標**
- [ ] 分享成功率 > 95%
- [ ] 頁面載入時間 < 3秒
- [ ] 跨平台相容性 100%

---

## 📞 **技術支援與聯絡**

- **開發負責人**：AI Assistant
- **測試環境**：https://barv3.vercel.app/
- **文檔更新**：即時更新此文檔
- **問題回報**：GitHub Issues

---

*最後更新：2025-06-23*
*版本：v20250623* 

📁 新建文件：
├── public/member-card-desktop.html    (桌機版主頁面)
├── public/js/member-card-desktop.js   (桌機版邏輯)
├── public/css/desktop-style.css       (桌機版樣式)
└── pages/api/desktop-auth.js          (多元登入API)

🔧 功能開發：
├── 多元登入系統 (LINE/Google/Email)
├── P、A開頭活動卡管理
├── 進階編輯功能
└── 資料庫API擴展 