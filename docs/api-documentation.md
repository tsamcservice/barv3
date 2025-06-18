# 📚 API 文檔

## 🏷️ **版本**: `20250618-FINAL`
**更新日期**: 2025-06-18  
**基礎URL**: `https://barv3.vercel.app`

---

## 🔗 **API 端點總覽**

### **會員卡管理**
- `GET /api/cards` - 查詢會員卡
- `POST /api/cards` - 儲存/更新會員卡
- `POST /api/cards/pageview` - 更新瀏覽統計
- `DELETE /api/cards/delete` - 刪除會員卡
- `GET /api/cards/list` - 取得會員卡列表

### **點數系統** 🆕
- `POST /api/cards/points` - 計算點數回饋
- `GET /api/points-settings` - 取得點數設定
- `POST /api/points-settings` - 更新點數設定

### **圖片管理**
- `POST /api/upload` - 圖片上傳
- `GET /api/uploaded-images` - 取得已上傳圖片
- `POST /api/image-management` - 圖片管理操作

### **宣傳卡片**
- `GET /api/promo-cards` - 取得宣傳卡片
- `POST /api/promo-cards` - 新增/更新宣傳卡片

---

## 🎯 **點數系統 API** 

### **POST /api/cards/points**
計算宣傳卡片附加的點數回饋

#### **請求格式**
```json
{
  "cardId": "string",           // 會員卡ID，使用 "temp-card-id" 為預覽模式
  "promoPositions": [0, 2, 4]   // 附加位置陣列 (0-4)
}
```

#### **回應格式**
```json
{
  "success": true,
  "oldPoints": 100,             // 原始點數
  "reward": 30,                 // 總回饋點數
  "newPoints": 130,             // 新的點數總計
  "rewardDetails": [            // 詳細回饋明細
    {
      "position": 0,
      "percentage": 15,
      "reward": 15
    },
    {
      "position": 2, 
      "percentage": 10,
      "reward": 10
    },
    {
      "position": 4,
      "percentage": 5,
      "reward": 5
    }
  ]
}
```

#### **錯誤回應**
```json
{
  "success": false,
  "error": "點數不足，無法附加宣傳卡片"
}
```

#### **使用範例**
```javascript
// 計算位置1,3,5的點數回饋
const response = await fetch('/api/cards/points', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    cardId: 'M01001_user123',
    promoPositions: [0, 2, 4]
  })
});

const result = await response.json();
if (result.success) {
  console.log(`獲得 ${result.reward} 點回饋！`);
}
```

---

### **GET /api/points-settings**
取得點數回饋設定

#### **回應格式**
```json
{
  "success": true,
  "data": [
    {
      "position_index": 0,
      "reward_percentage": 15.0,
      "updated_at": "2025-06-18T12:28:06.599848+00:00"
    },
    {
      "position_index": 1,
      "reward_percentage": 12.0,
      "updated_at": "2025-06-18T12:28:06.599848+00:00"
    },
    // ... 其他位置設定
  ]
}
```

---

### **POST /api/points-settings**
更新點數回饋設定

#### **請求格式**
```json
[
  {
    "position_index": 0,
    "reward_percentage": 20.0
  },
  {
    "position_index": 1,
    "reward_percentage": 15.0
  }
  // ... 其他位置設定
]
```

#### **回應格式**
```json
{
  "success": true,
  "message": "Settings updated successfully"
}
```

---

## 📊 **會員卡管理 API**

### **GET /api/cards**
查詢會員卡資料

#### **查詢參數**
- `pageId` (必填): 會員卡頁面ID
- `userId` (選填): 使用者ID，用於個人化查詢

#### **回應格式**
```json
{
  "success": true,
  "data": {
    "id": "M01001_user123",
    "page_id": "M01001",
    "user_id": "user123",
    "user_points": 150.0,        // 🆕 點數欄位
    "card_data": {
      "type": "flex",
      "altText": "會員卡",
      "contents": { /* FLEX JSON */ }
    },
    "view_count": 25,
    "created_at": "2025-06-18T10:00:00Z",
    "updated_at": "2025-06-18T12:00:00Z"
  }
}
```

---

### **POST /api/cards**
儲存或更新會員卡

#### **請求格式**
```json
{
  "pageId": "M01001",
  "userId": "user123",
  "cardData": {
    "type": "flex",
    "altText": "會員卡",
    "contents": { /* FLEX JSON */ }
  },
  "userPoints": 150.0           // 🆕 點數欄位
}
```

#### **回應格式**
```json
{
  "success": true,
  "data": {
    "id": "M01001_user123",
    "message": "會員卡已成功儲存"
  }
}
```

---

## 🖼️ **圖片管理 API**

### **POST /api/upload**
上傳圖片檔案

#### **請求格式**
```
Content-Type: multipart/form-data

file: [圖片檔案]
folder: "vip" | "public" | "templates"
```

#### **回應格式**
```json
{
  "success": true,
  "data": {
    "url": "https://supabase-url/storage/v1/object/public/uploads/vip/filename.jpg",
    "filename": "filename.jpg",
    "size": 1024000,
    "width": 800,               // 🆕 圖片寬度
    "height": 600               // 🆕 圖片高度
  }
}
```

---

## 📈 **統計 API**

### **POST /api/cards/pageview**
批次更新頁面瀏覽統計

#### **請求格式**
```json
{
  "updates": [
    {
      "pageId": "M01001",
      "userId": "user123",
      "increment": 1
    }
  ]
}
```

#### **回應格式**
```json
{
  "success": true,
  "results": [
    {
      "pageId": "M01001",
      "userId": "user123", 
      "newViewCount": 26,
      "success": true
    }
  ]
}
```

---

## 🛡️ **錯誤處理**

### **通用錯誤格式**
```json
{
  "success": false,
  "error": "錯誤訊息描述",
  "code": "ERROR_CODE"        // 選填
}
```

### **常見錯誤代碼**
- `400` - 請求參數錯誤
- `401` - 未授權存取
- `404` - 資源不存在
- `405` - 方法不允許
- `500` - 伺服器內部錯誤

### **點數系統特定錯誤**
- `INSUFFICIENT_POINTS` - 點數不足
- `INVALID_POSITION` - 無效的附加位置
- `CALCULATION_ERROR` - 點數計算錯誤

---

## 🔐 **認證與權限**

### **資料庫權限 (RLS)**
- **會員卡**: 基於 `user_id` 的行級安全
- **宣傳卡片**: 公開讀取，限制寫入
- **點數設定**: 管理員權限控制
- **圖片**: 基於資料夾的權限控制

### **API 權限**
- **公開端點**: `/api/cards` (GET), `/api/promo-cards` (GET)
- **使用者端點**: `/api/cards` (POST), `/api/upload`
- **管理員端點**: `/api/points-settings` (POST)

---

## 📝 **使用範例**

### **完整的點數計算流程**
```javascript
// 1. 取得當前點數設定
const settings = await fetch('/api/points-settings').then(r => r.json());

// 2. 計算點數回饋
const pointsResult = await fetch('/api/cards/points', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    cardId: 'M01001_user123',
    promoPositions: [0, 1, 2] // 前三個位置
  })
});

// 3. 處理結果
const points = await pointsResult.json();
if (points.success) {
  alert(`恭喜！獲得 ${points.reward} 點回饋，總點數：${points.newPoints}`);
} else {
  alert(`錯誤：${points.error}`);
}
```

### **會員卡儲存與點數更新**
```javascript
// 儲存會員卡並更新點數
const saveResult = await fetch('/api/cards', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    pageId: 'M01001',
    userId: 'user123',
    cardData: flexJsonData,
    userPoints: newPointsValue
  })
});
```

---

## 🔧 **開發工具**

### **測試端點**
- `/admin-points.html` - 點數設定管理介面
- `/test-share-debug.html` - 分享功能診斷工具

### **API 測試工具**
```javascript
// 在瀏覽器控制台中測試
// 測試點數API
fetch('/api/cards/points', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    cardId: 'temp-card-id',
    promoPositions: [0, 2, 4]
  })
}).then(r => r.json()).then(console.log);
```

---

## 📋 **更新記錄**

### **2025-06-18 - 點數系統上線**
- ✅ 新增點數計算API
- ✅ 新增點數設定管理API  
- ✅ 會員卡表新增點數欄位
- ✅ 宣傳卡表新增點數欄位
- ✅ 完整的API測試驗證

### **2025-06-08 - 分享功能修復**
- ✅ 修復JSON清理問題
- ✅ 移除 `_logged` 欄位污染

### **2025-06-07 - 圖片功能擴展**
- ✅ 圖片尺寸自動檢測
- ✅ 新增 `image_width`, `image_height` 欄位

---

**最後更新**: 2025-06-18  
**API版本**: v1.2.0  
**狀態**: 穩定 - 點數系統完整上線 