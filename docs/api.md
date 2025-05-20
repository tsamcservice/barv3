# BarV2 API 文件

## 卡片管理 API

### 儲存卡片
- **端點**: `POST /api/cards/save`
- **參數**:
  ```json
  {
    "content": "卡片內容",
    "type": "卡片類型"
  }
  ```
- **回應**:
  ```json
  {
    "success": true,
    "cardId": "卡片ID"
  }
  ```

### 取得卡片列表
- **端點**: `GET /api/cards/list`
- **參數**: `userId` (查詢參數)
- **回應**:
  ```json
  {
    "success": true,
    "cards": [
      {
        "id": "卡片ID",
        "content": "卡片內容",
        "type": "卡片類型",
        "created_at": "建立時間"
      }
    ]
  }
  ```

### 刪除卡片
- **端點**: `DELETE /api/cards/delete`
- **參數**: 
  - `cardId` (查詢參數)
  - `userId` (查詢參數)
- **回應**:
  ```json
  {
    "success": true,
    "message": "卡片已刪除"
  }
  ```

## 後台管理 API

### 搜尋使用者
- **端點**: `GET /api/admin/users/search`
- **參數**: `query` (查詢參數)
- **回應**:
  ```json
  {
    "success": true,
    "users": [
      {
        "id": "使用者ID",
        "name": "使用者名稱",
        "email": "電子郵件"
      }
    ]
  }
  ```

### 搜尋卡片
- **端點**: `GET /api/admin/cards/search`
- **參數**: `query` (查詢參數)
- **回應**:
  ```json
  {
    "success": true,
    "cards": [
      {
        "id": "卡片ID",
        "content": "卡片內容",
        "user_id": "使用者ID",
        "created_at": "建立時間"
      }
    ]
  }
  ```

### 管理員刪除卡片
- **端點**: `DELETE /api/admin/cards/delete`
- **參數**: `cardId` (查詢參數)
- **回應**:
  ```json
  {
    "success": true,
    "message": "卡片已刪除"
  }
  ``` 