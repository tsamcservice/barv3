# LIFF及重複調用BUG記錄與解決方案

## 📅 記錄日期：2025-06-24

---

## 🚨 主要BUG記錄

### 1. UNIFIED_LIFF未定義錯誤

#### 問題描述
- **錯誤訊息**：`UNIFIED_LIFF is not defined`
- **影響範圍**：手機版會員卡載入失敗，F12顯示錯誤
- **發生原因**：LIFF物件初始化順序問題

#### 解決方案
```javascript
// 🔧 解決方案：統一LIFF物件定義
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

// 初始化函數
async function initUnifiedLiff() {
  try {
    if (typeof liff !== 'undefined') {
      await liff.init({ liffId: LIFF_CONFIG.liffId });
      UNIFIED_LIFF.isReady = true;
      UNIFIED_LIFF.environment.isInClient = liff.isInClient();
      UNIFIED_LIFF.environment.isLoggedIn = liff.isLoggedIn();
      
      if (liff.isLoggedIn()) {
        UNIFIED_LIFF.profile = await liff.getProfile();
      }
    }
  } catch (error) {
    console.error('LIFF初始化失敗:', error);
  }
}
```

### 2. 排序問題：重複預覽渲染調用

#### 問題描述
- **現象**：附加卡片排序不按資料庫的card_order顯示
- **根本原因**：執行順序錯誤導致排序被覆蓋

#### 問題流程
```
1. fillAllFieldsWithProfile() 載入個人卡片並暫存card_order
2. ❌ 立即調用renderPreview() → 觸發預設排序邏輯
3. loadPromoCards() 處理card_order重建排序
4. ❌ 結果被步驟2的預設排序覆蓋
```

#### 解決方案
```javascript
// ❌ 錯誤的執行順序
async function fillAllFieldsWithProfile() {
  // ... 載入資料
  renderPreview();        // 🚫 這裡會觸發預設排序
  renderShareJsonBox();   // 🚫 覆蓋card_order
}

// ✅ 正確的執行順序
async function fillAllFieldsWithProfile() {
  // ... 載入資料並暫存card_order
  // 🔧 移除重複的預覽渲染調用
  // renderPreview();
  // renderShareJsonBox();
}

async function initGeneralMode() {
  if (UNIFIED_LIFF.profile.userId) {
    await fillAllFieldsWithProfile();  // 1. 載入並暫存card_order
  }
  
  await loadPromoCards();              // 2. 處理card_order重建排序
  
  // 3. 最後才渲染預覽，確保排序正確
  console.log('🎯 開始渲染預覽，當前排序:', allCardsSortable.map(c => c.id));
  renderPreview();
  renderShareJsonBox();
}
```

### 3. Chrome擴展錯誤干擾

#### 問題描述
- **錯誤訊息**：Chrome擴展的runtime.lastError
- **影響**：F12控制台出現無關錯誤訊息

#### 解決方案
```javascript
// 🔧 全域錯誤處理，過濾Chrome擴展錯誤
window.addEventListener('error', function(event) {
  if (event.message && event.message.includes('Extension')) {
    console.log('🔇 已過濾Chrome擴展錯誤:', event.message);
    event.preventDefault();
    return false;
  }
});
```

---

## 🔧 預防措施

### 1. 初始化順序檢查清單
```javascript
// ✅ 正確的初始化順序
1. 定義UNIFIED_LIFF物件
2. 初始化LIFF SDK
3. 載入用戶資料並暫存card_order
4. 載入宣傳卡片並處理card_order
5. 最後渲染預覽和JSON
```

### 2. 調試日誌標準
```javascript
// 🔍 關鍵點加入追蹤日誌
console.log('📋 暫存card_order資料:', cardOrder);
console.log('🎯 開始渲染預覽，當前排序:', allCardsSortable.map(c => c.id));
console.log('✅ 卡片排序處理完成，順序:', allCardsSortable.map(c => c.id));
```

### 3. 錯誤處理標準
```javascript
// 🚨 統一錯誤處理格式
try {
  // 主要邏輯
} catch (error) {
  console.error('❌ 功能名稱失敗:', error);
  // 用戶友善的錯誤提示
}
```

---

## 📋 待修復區域

### DESKTOP版本
- [ ] 套用UNIFIED_LIFF物件定義
- [ ] 檢查排序邏輯執行順序
- [ ] 添加全域錯誤處理

### SIMPLE版本
- [ ] 套用UNIFIED_LIFF物件定義
- [ ] 檢查是否有重複預覽渲染調用
- [ ] 統一初始化流程

---

## 📝 修復記錄

| 日期 | 版本 | 問題 | 解決方案 | 狀態 |
|------|------|------|----------|------|
| 2025-06-24 | MOBILE | UNIFIED_LIFF未定義 | 添加統一物件定義 | ✅ 已修復 |
| 2025-06-24 | MOBILE | 排序被覆蓋 | 調整執行順序，移除重複調用 | ✅ 已修復 |
| 2025-06-24 | MOBILE | Chrome擴展錯誤 | 添加全域錯誤過濾 | ✅ 已修復 |

---

## 🎯 經驗教訓

1. **初始化順序很重要**：必須確保依賴關係正確
2. **避免重複調用**：同一功能不要在多個地方重複執行
3. **加強日誌追蹤**：關鍵步驟都要有日誌輸出
4. **統一錯誤處理**：避免無關錯誤干擾調試

---

*此文檔將持續更新，記錄所有LIFF相關的BUG和解決方案* 