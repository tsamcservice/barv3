# 系統故障排除指南

## 🚨 **常見問題與解決方案**

### **問題1：圖片庫無法載入，出現HTTP 500錯誤**

#### **症狀**
- 點擊"選擇已上傳的圖片"出現錯誤
- Console顯示：`HTTP 500: Internal Server Error`
- API返回HTML而非JSON（`SyntaxError: Unexpected token '<'`）

#### **根本原因**
**Vercel環境變數問題**：`SUPABASE_SERVICE_ROLE_KEY`無法在Vercel中正確讀取

#### **診斷方法**
1. 打開F12 Console
2. 執行：`testSimpleAPI()`
3. 檢查返回的環境變數狀態：
   ```javascript
   環境變數狀態: {
     SUPABASE_URL: true,      // ✅ 正常
     ANON_KEY: true,          // ✅ 正常  
     SERVICE_ROLE_KEY: false  // ❌ 問題所在
   }
   ```

#### **解決方案**
**步驟1：修改API使用ANON_KEY**
```javascript
// 修改 pages/api/uploaded-images.js
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY  // 改用ANON_KEY
);
```

**步驟2：設定開放式RLS政策**
```sql
-- 在Supabase SQL Editor執行
DROP POLICY IF EXISTS "Allow all operations on uploaded_images" ON uploaded_images;

CREATE POLICY "Allow all read operations on uploaded_images" ON uploaded_images
FOR SELECT USING (true);

CREATE POLICY "Allow all insert operations on uploaded_images" ON uploaded_images
FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow all update operations on uploaded_images" ON uploaded_images
FOR UPDATE USING (true) WITH CHECK (true);

CREATE POLICY "Allow all delete operations on uploaded_images" ON uploaded_images
FOR DELETE USING (true);

ALTER TABLE uploaded_images ENABLE ROW LEVEL SECURITY;
```

#### **預防措施**
1. **優先使用ANON_KEY**：對於不需要管理員權限的操作
2. **測試環境變數**：使用`testSimpleAPI()`定期檢查
3. **RLS政策**：設計適合ANON_KEY的安全政策

---

### **問題2：圖片上傳成功但圖片庫無法顯示**

#### **症狀**
- 圖片上傳成功
- 資料庫中有記錄
- 但圖片庫顯示"暫無已上傳的圖片"

#### **可能原因**
1. **表格不存在**：`uploaded_images`表未建立
2. **權限問題**：RLS政策阻擋查詢
3. **資料不一致**：line_user_id不匹配

#### **診斷方法**
執行：`testImageLibraryDeep()`查看詳細錯誤

#### **解決方案**
1. **建立圖片記錄表**：執行`supabase/create-uploaded-images-table.sql`
2. **修復權限**：執行`supabase/fix-uploaded-images-rls.sql`
3. **檢查資料**：確認line_user_id正確記錄

---

## 🧪 **調試工具**

### **基本測試**
```javascript
testSimpleAPI()      // 測試API基礎功能
testImageLibrary()   // 測試圖片庫功能
testImageLibraryDeep() // 深度診斷測試
```

### **環境變數檢查**
- `NEXT_PUBLIC_SUPABASE_URL`：✅ 應該顯示true
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`：✅ 應該顯示true  
- `SUPABASE_SERVICE_ROLE_KEY`：⚠️ 在Vercel中可能顯示false

### **常用SQL檢查**
```sql
-- 檢查表格是否存在
SELECT * FROM uploaded_images LIMIT 1;

-- 檢查RLS政策
SELECT * FROM pg_policies WHERE tablename = 'uploaded_images';

-- 檢查資料記錄
SELECT count(*) FROM uploaded_images WHERE line_user_id = 'YOUR_USER_ID';
```

---

## 📋 **最佳實踐**

### **環境變數管理**
1. **前端變數**：使用`NEXT_PUBLIC_*`前綴
2. **後端變數**：避免依賴在Vercel中讀取有問題的變數
3. **備用方案**：準備ANON_KEY和SERVICE_ROLE_KEY兩套方案

### **RLS政策設計**
1. **開發階段**：使用開放政策確保功能正常
2. **生產階段**：逐步收緊權限
3. **測試**：每次修改政策後測試所有功能

### **API設計原則**
1. **容錯性**：提供詳細錯誤信息
2. **調試友好**：包含充分的日誌
3. **環境適應**：支援多種環境變數配置

---

*最後更新：2025-06-07*  
*解決方案：SERVICE_ROLE_KEY問題修復* 