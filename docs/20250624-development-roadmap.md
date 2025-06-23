# 🚀 20250624 開發路線圖
## 基於 20250623-FINAL 標籤的分階段開發計劃

---

## 📋 **開發基底說明**

### **🏷️ 穩定版本標籤：20250623-FINAL**
- **用途**：作為後續開發的安全回復點
- **狀態**：移除統一LIFF功能後的穩定狀態
- **回復指令**：`git reset --hard 20250623-FINAL`

### **📁 文件結構**
```
✅ 已創建的開發基底：
├── public/member-card-simple.html     (原始版本，不可變動)
├── public/js/member-card-simple.js    (原始版本，不可變動)
├── public/member-card-mobile.html     (手機版開發基底)
├── public/js/member-card-mobile.js    (手機版邏輯基底)
├── public/member-card-desktop.html    (桌機版開發基底)
└── public/js/member-card-desktop.js   (桌機版邏輯基底)
```

---

## 🎯 **第一階段：手機版 (MOBILE) 開發**

### **📱 手機版特色定位**
- **目標用戶**：手機用戶，專注於M開頭會員卡
- **核心功能**：LIFF整合、快速編輯、即時分享、回饋機制
- **技術特點**：保持LIFF SDK，優化手機體驗

### **🔧 手機版開發任務**

#### **A. 介面優化 (1天)**
```css
/* 手機版專屬優化 */
@media (max-width: 768px) {
  /* 更大的觸控按鈕 */
  button { min-height: 48px; }
  
  /* 簡化表單布局 */
  .form-group { margin-bottom: 20px; }
  
  /* 優化預覽區域 */
  #main-card-preview { 
    max-width: 100%;
    overflow-x: auto;
  }
}
```

#### **B. LIFF功能強化 (1天)**
```javascript
// 手機版專屬LIFF功能
async function initMobileLiff() {
  // 1. 檢查設備類型
  if (!isMobileDevice()) {
    showDesktopRedirectMessage();
    return;
  }
  
  // 2. 初始化LIFF
  await liff.init({ liffId });
  
  // 3. 處理分享橋接
  handleShareBridge();
  
  // 4. 自動載入用戶資料
  await loadUserProfile();
}
```

#### **C. 分享橋接支援 (1天)**
```javascript
// 支援來自桌機版的分享請求
function handleShareBridge() {
  const urlParams = new URLSearchParams(window.location.search);
  
  // 檢查是否來自桌機版橋接
  if (urlParams.has('bridgeShare')) {
    const shareData = JSON.parse(decodeURIComponent(urlParams.get('bridgeShare')));
    executeBridgeShare(shareData);
  }
}

async function executeBridgeShare(shareData) {
  try {
    // 載入卡片資料
    await loadCardData(shareData.cardId);
    
    // 直接啟動分享
    const result = await liff.shareTargetPicker([{
      type: 'flex',
      altText: shareData.altText,
      contents: shareData.flexMessage
    }]);
    
    // 通知桌機版分享完成
    if (window.opener) {
      window.opener.postMessage({
        type: 'shareComplete',
        result: result
      }, '*');
      window.close();
    }
  } catch (error) {
    console.error('橋接分享失敗:', error);
  }
}
```

---

## 🎯 **第二階段：桌機版 (DESKTOP) 開發**

### **🖥️ 桌機版特色定位**
- **目標用戶**：桌機用戶，管理P、A開頭活動卡
- **核心功能**：多元登入、進階編輯、批次管理、分享橋接
- **技術特點**：移除LIFF SDK，使用一般網頁登入

### **🔧 桌機版開發任務**

#### **A. 移除LIFF依賴 (0.5天)**
```html
<!-- 移除LIFF SDK -->
<!-- <script src="https://static.line-scdn.net/liff/edge/2/sdk.js"></script> -->

<!-- 新增多元登入SDK -->
<script src="https://accounts.google.com/gsi/client"></script>
<script src="https://static.line-scdn.net/line-login/js/line-login.js"></script>
```

#### **B. 多元登入系統 (2天)**
```javascript
// 桌機版登入管理
class DesktopAuthManager {
  constructor() {
    this.loginMethods = ['line', 'google', 'email'];
    this.currentUser = null;
  }
  
  async initAuth() {
    // 檢查現有登入狀態
    await this.checkExistingAuth();
    
    // 初始化各種登入方式
    await this.initLineLogin();
    await this.initGoogleLogin();
    await this.initEmailLogin();
  }
  
  async loginWithLine() {
    // LINE Login (非LIFF)
    const result = await LineLogin.login({
      channel_id: 'YOUR_CHANNEL_ID',
      redirect_uri: window.location.origin + '/auth/line/callback'
    });
    return result;
  }
  
  async loginWithGoogle() {
    // Google OAuth
    const result = await GoogleAuth.signIn();
    return result;
  }
}
```

#### **C. 分享橋接機制 (2天)**
```javascript
// 桌機版分享核心
class DesktopShareManager {
  constructor() {
    this.mobileUrl = 'https://liff.line.me/2007327814-BdWpj70m';
  }
  
  async shareCard(cardData) {
    // 1. 準備分享資料包
    const sharePackage = {
      action: 'bridgeShare',
      cardId: cardData.pageId,
      userId: this.getCurrentUserId(),
      flexMessage: await this.generateFlexMessage(cardData),
      altText: cardData.card_alt_title || '分享會員卡',
      timestamp: Date.now()
    };
    
    // 2. 開啟手機版LIFF橋接視窗
    const shareUrl = `${this.mobileUrl}?bridgeShare=${encodeURIComponent(JSON.stringify(sharePackage))}`;
    const shareWindow = window.open(shareUrl, 'liffShare', 'width=400,height=600,scrollbars=yes');
    
    // 3. 監聽分享結果
    return new Promise((resolve, reject) => {
      const messageHandler = (event) => {
        if (event.data.type === 'shareComplete') {
          window.removeEventListener('message', messageHandler);
          shareWindow.close();
          resolve(event.data.result);
        }
      };
      
      window.addEventListener('message', messageHandler);
      
      // 5分鐘超時
      setTimeout(() => {
        window.removeEventListener('message', messageHandler);
        reject(new Error('分享超時'));
      }, 300000);
    });
  }
}
```

---

## 📅 **開發時程規劃**

### **第一週：手機版開發**
```
Day 1 (20250624)：
├── ✅ 手機版介面優化
├── ✅ LIFF功能強化
└── ✅ 基礎測試

Day 2 (20250625)：
├── ✅ 分享橋接支援
├── ✅ 錯誤處理完善
└── ✅ 手機版完整測試

Day 3 (20250626)：
├── ✅ 手機版部署
├── ✅ 用戶測試收集
└── ✅ 問題修復
```

### **第二週：桌機版開發**
```
Day 4 (20250627)：
├── ✅ 移除LIFF依賴
├── ✅ 多元登入系統設計
└── ✅ 基礎架構搭建

Day 5-6 (20250628-29)：
├── ✅ 多元登入完整實作
├── ✅ 用戶資料整合
└── ✅ API接口調整

Day 7-8 (20250630-01)：
├── ✅ 分享橋接機制實作
├── ✅ 跨視窗通訊測試
└── ✅ 完整流程驗證
```

---

## 🧪 **測試策略**

### **手機版測試重點**
- ✅ LIFF初始化穩定性
- ✅ shareTargetPicker功能
- ✅ 橋接分享處理
- ✅ 回饋機制正確性
- ✅ 不同手機瀏覽器相容性

### **桌機版測試重點**
- ✅ 多元登入流程
- ✅ 分享橋接成功率
- ✅ 跨視窗通訊穩定性
- ✅ 不同桌面瀏覽器相容性
- ✅ 與手機版協作測試

### **整合測試重點**
- ✅ 桌機版 → 手機版分享流程
- ✅ 分享完成回調機制
- ✅ 錯誤處理與用戶提示
- ✅ 性能與載入速度

---

## ⚠️ **重要注意事項**

### **保護現有系統**
- 🚫 **絕對不可修改** `member-card-simple.html` 和 `member-card-simple.js`
- ✅ 所有開發都在新複製的文件中進行
- ✅ 保持向後相容性

### **安全回復機制**
```bash
# 如需回復到穩定狀態
git reset --hard 20250623-FINAL
git push --force

# 查看所有標籤
git tag -l

# 查看標籤詳情
git show 20250623-FINAL
```

### **分支管理建議**
```bash
# 建議創建開發分支
git checkout -b feature/mobile-development
git checkout -b feature/desktop-development

# 完成後合併到主分支
git checkout master
git merge feature/mobile-development
```

---

## 🎯 **成功指標**

### **手機版成功指標**
- [ ] LIFF初始化成功率 > 98%
- [ ] 分享功能正常運作
- [ ] 橋接分享響應時間 < 3秒
- [ ] 用戶體驗流暢度評分 > 4.5/5

### **桌機版成功指標**
- [ ] 多元登入成功率 > 95%
- [ ] 分享橋接成功率 > 90%
- [ ] 頁面載入時間 < 2秒
- [ ] 跨瀏覽器相容性 100%

### **整體系統指標**
- [ ] 現有用戶零影響
- [ ] 新功能採用率 > 60%
- [ ] 系統穩定性 > 99.5%
- [ ] 用戶滿意度 > 4.0/5

---

*建立時間：2025-06-23*  
*基底標籤：20250623-FINAL*  
*預計完成：2025-07-01* 