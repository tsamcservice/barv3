# API 文檔

## 📡 **圖片管理相關API**

### **1. 圖片上傳API**
**端點**：`POST /api/upload`

**描述**：上傳圖片並自動記錄到資料庫

**配置**：
```javascript
// pages/api/upload/index.ts
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!  // 使用ANON_KEY
);
```

**請求參數**：
```javascript
{
  "file": "data:image/png;base64,...",  // Base64編碼的圖片
  "fileName": "example.png",            // 原始檔名
  "fileType": "image/png",              // MIME類型
  "userId": "Ueb6db8be8de..."           // LINE用戶ID（可選）
}
```

**回應格式**：
```javascript
{
  "success": true,
  "data": {
    "url": "https://...supabase.co/storage/v1/object/public/member-cards/...",
    "fileName": "example.png",
    "fileSize": 123456,
    "recorded": true  // 是否已記錄到資料庫
  }
}
```

### **2. 圖片庫查詢API**
**端點**：`GET /api/uploaded-images?userId={userId}`

**描述**：查詢用戶已上傳的圖片列表

**配置**：
```javascript
// pages/api/uploaded-images.js
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY  // ⚠️ 改用ANON_KEY解決Vercel環境問題
);
```

**請求參數**：
- `userId`：LINE用戶ID

**回應格式**：
```javascript
{
  "success": true,
  "data": [
    {
      "name": "TS-B1.png",
      "url": "https://...supabase.co/storage/v1/object/public/member-cards/...",
      "created_at": "2025-06-07T09:48:28.973166+00:00",
      "file_size": 816333,
      "file_type": "image/png",
      "usage_count": 0,
      "type": "uploaded"
    }
  ],
  "total": 2,
  "message": "找到 2 張已上傳的圖片"
}
```

### **3. 圖片管理API**
**端點**：`POST /api/image-management`

**描述**：刪除圖片記錄和檔案

**請求參數**：
```javascript
{
  "userId": "Ueb6db8be8de...",
  "action": "delete",
  "imageUrl": "https://...supabase.co/storage/v1/object/public/member-cards/..."
}
```

---

## 🧪 **測試API**

### **1. 簡單測試API**
**端點**：`GET /api/simple-test`

**描述**：測試API基礎功能和環境變數

**回應格式**：
```javascript
{
  "success": true,
  "message": "簡單測試成功",
  "environment": {
    "SUPABASE_URL": true,
    "ANON_KEY": true,
    "SERVICE_ROLE_KEY": false  // ⚠️ Vercel環境常見問題
  }
}
```

### **2. 深度診斷API**
**端點**：`GET /api/test-uploaded-images?userId={userId}`

**描述**：測試圖片庫相關功能，診斷權限問題

---

## ⚙️ **環境變數配置**

### **必要變數**
```env
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### **可選變數**
```env
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```
**注意**：SERVICE_ROLE_KEY在Vercel環境中可能無法正確讀取，建議優先使用ANON_KEY + 適當的RLS政策

---

## 🔒 **資料庫配置**

### **必要表格**
```sql
-- 用戶上傳圖片記錄表
CREATE TABLE uploaded_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  line_user_id text NOT NULL,
  image_url text NOT NULL,
  original_filename text,
  file_size integer,
  file_type text,
  storage_path text,
  created_at timestamp with time zone DEFAULT now(),
  last_used_at timestamp with time zone,
  usage_count integer DEFAULT 0,
  is_active boolean DEFAULT true
);
```

### **RLS政策**
```sql
-- 適用於ANON_KEY的開放政策
CREATE POLICY "Allow all read operations on uploaded_images" ON uploaded_images
FOR SELECT USING (true);

CREATE POLICY "Allow all insert operations on uploaded_images" ON uploaded_images
FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow all update operations on uploaded_images" ON uploaded_images
FOR UPDATE USING (true) WITH CHECK (true);

CREATE POLICY "Allow all delete operations on uploaded_images" ON uploaded_images
FOR DELETE USING (true);
```

---

## 📋 **最佳實踐**

### **API設計原則**
1. **環境適應性**：支援ANON_KEY和SERVICE_ROLE_KEY
2. **錯誤處理**：提供詳細的錯誤信息
3. **日誌記錄**：包含充分的調試信息

### **安全考量**
1. **RLS政策**：使用適當的行級安全政策
2. **輸入驗證**：驗證檔案類型和大小
3. **權限最小化**：僅給予必要的權限

### **環境變數管理**
1. **前端變數**：使用`NEXT_PUBLIC_*`確保可讀取
2. **備用方案**：準備ANON_KEY和SERVICE_ROLE_KEY兩套配置
3. **定期測試**：使用`testSimpleAPI()`檢查環境狀態

---

*最後更新：2025-06-07*  
*狀態：SERVICE_ROLE_KEY問題已修復，改用ANON_KEY* 