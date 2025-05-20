# BarV2 資料庫結構

## 資料表結構

### cards 資料表
```sql
CREATE TABLE cards (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id TEXT NOT NULL,
  content JSONB NOT NULL,
  type TEXT NOT NULL,
  share_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 建立索引
CREATE INDEX idx_cards_user_id ON cards(user_id);
CREATE INDEX idx_cards_type ON cards(type);
CREATE INDEX idx_cards_created_at ON cards(created_at);
```

### users 資料表
```sql
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  name TEXT,
  email TEXT,
  last_login TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 建立索引
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_last_login ON users(last_login);
```

## 資料關係
- cards.user_id 關聯到 users.id
- 一個使用者可以有多張卡片
- 每張卡片都必須屬於一個使用者

## 資料類型說明
- UUID: 通用唯一識別碼
- TEXT: 文字字串
- JSONB: JSON 格式資料
- TIMESTAMP WITH TIME ZONE: 時間戳記（含時區）
- INTEGER: 整數

## 索引說明
1. cards 資料表
   - user_id: 加速使用者卡片查詢
   - type: 加速卡片類型篩選
   - created_at: 加速時間排序

2. users 資料表
   - email: 加速電子郵件搜尋
   - last_login: 加速最後登入時間排序 