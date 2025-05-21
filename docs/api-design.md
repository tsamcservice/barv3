# API 設計文件

## 1. 卡片相關 API

### 1.1 查詢卡片
```typescript
GET /api/cards
Query Parameters:
- pageId: string (必填)
- userId?: string (選填)

Response:
{
  success: boolean,
  data?: {
    id: string,
    page_id: string,
    line_user_id?: string,
    card_alt_title: string,
    main_image_url: string,
    // ... 其他欄位
  },
  error?: string
}
```

### 1.2 儲存卡片
```typescript
POST /api/cards
Request Body:
{
  pageId: string,
  userId?: string,
  cardData: {
    card_alt_title: string,
    main_image_url: string,
    // ... 其他欄位
  }
}

Response:
{
  success: boolean,
  data?: {
    id: string,
    // ... 儲存後的資料
  },
  error?: string
}
```

### 1.3 刪除卡片
```typescript
DELETE /api/cards
Query Parameters:
- pageId: string (必填)
- userId: string (必填)

Response:
{
  success: boolean,
  error?: string
}
```

## 2. 圖片上傳 API

### 2.1 上傳圖片
```typescript
POST /api/upload
Request Body:
{
  file: string (base64),
  fileName: string,
  fileType: string
}

Response:
{
  success: boolean,
  data?: {
    url: string
  },
  error?: string
}
```

## 3. 宣傳卡片 API

### 3.1 查詢宣傳卡片
```typescript
GET /api/promo-cards
Query Parameters:
- cardId: string (必填)

Response:
{
  success: boolean,
  data?: Array<{
    id: string,
    json_content: object,
    sort_order: number
  }>,
  error?: string
}
```

### 3.2 儲存宣傳卡片
```typescript
POST /api/promo-cards
Request Body:
{
  cardId: string,
  jsonContent: object,
  sortOrder: number
}

Response:
{
  success: boolean,
  data?: {
    id: string,
    // ... 儲存後的資料
  },
  error?: string
}
```

## 4. 錯誤處理

所有 API 回傳格式統一為：
```typescript
{
  success: boolean,
  data?: any,
  error?: string
}
```

錯誤代碼：
- 400: 請求參數錯誤
- 401: 未授權
- 403: 權限不足
- 404: 資源不存在
- 500: 伺服器錯誤

## 5. 安全性

- 所有 API 需要驗證 LINE LIFF 登入狀態
- 圖片上傳限制檔案大小和類型
- 使用 Supabase 的 RLS 進行資料庫權限控管 