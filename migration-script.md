# 🔄 MTEST → MOBILE 遷移指南

## 📋 遷移步驟

### 步驟 1：備份現有版本
```bash
cp public/member-card-mobile.html public/member-card-mobile-OLD.html
cp public/js/member-card-mobile.js public/js/member-card-mobile-OLD.js
```

### 步驟 2：複製MTEST版本
```bash
cp public/mcard-mtest.html public/member-card-mobile.html
cp public/js/mcard-mtest.js public/js/member-card-mobile.js
```

### 步驟 3：修改配置文件

#### 3-1. HTML文件修改 (member-card-mobile.html)
- 標題：`手機測試版` → `手機版`
- LIFF ID：`2007648986-3LJzyYbK` → `2007327814-DGly5XNk`
- 版本註解：移除測試版標記

#### 3-2. JS文件修改 (member-card-mobile.js)
- LIFF ID：`2007327814-OoJBbnwP` → `2007327814-DGly5XNk`
- 版本標識：`MOBILE-TEST-v20250625` → `MOBILE-v20250626`
- 分享連結：更新為正式版LIFF

### 步驟 4：測試驗證
- 載入速度測試
- 分享功能測試
- 自動分享測試
- 交易記錄測試

## 🔧 需要修改的具體內容

### HTML文件 (member-card-mobile.html)
```html
<!-- 修改前 -->
<title>我專屬的會員卡片 (手機測試版)</title>
<div>🚀 LIFF ID: 2007648986-3LJzyYbK | 版本: v20250625-TEST</div>

<!-- 修改後 -->
<title>我專屬的會員卡片 (手機版)</title>
<div>🚀 LIFF ID: 2007327814-DGly5XNk | 版本: v20250626</div>
```

### JS文件 (member-card-mobile.js)
```javascript
// 修改前
const VERSION_TAG = 'MOBILE-TEST-v20250625-SAME-CHANNEL';
const liffId = '2007327814-OoJBbnwP';

// 修改後
const VERSION_TAG = 'MOBILE-v20250626';
const liffId = '2007327814-DGly5XNk';
```

## ⚠️ 注意事項

1. **LIFF ID 差異**：確保使用正確的LIFF ID
2. **用戶數據**：不同LIFF ID可能影響用戶數據載入
3. **測試完整性**：遷移後需要完整測試所有功能
4. **回滾準備**：保留備份文件以便快速回滾

## 🧪 測試清單

- [ ] 頁面正常載入
- [ ] 用戶登入功能
- [ ] 卡片編輯功能
- [ ] 附加活動卡功能
- [ ] 預覽及分享功能
- [ ] 自動分享功能
- [ ] 點數系統功能
- [ ] 交易記錄功能 