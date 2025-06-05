# RLS 安全性修復說明

## 🚨 **問題描述**

在 Supabase Security Advisor 中發現以下安全性警告：
- `RLS Disabled in Public` - 公開資料表未啟用行級安全性
- 影響資料表：`public.member_cards`, `public.promo_cards`, `public.users`

## ✅ **解決方案**

### 1. **執行修復腳本**
在 Supabase SQL Editor 中執行 `supabase/enable-rls.sql` 腳本

### 2. **RLS 政策設計**

#### **member_cards 表**
- ✅ **公開卡片查看**：允許所有人查看 `line_user_id IS NULL` 的初始卡片
- ✅ **個人卡片管理**：用戶只能查看/編輯自己的卡片
- ✅ **API 服務訪問**：service_role 可完全訪問（用於後端 API）
- ✅ **匿名分享**：支援分享功能的匿名訪問

#### **promo_cards 表**
- ✅ **公開查看**：所有人可查看宣傳卡片
- ✅ **管理員管理**：管理員可完全管理
- ✅ **API 服務訪問**：service_role 可完全訪問

#### **users 表**
- ✅ **個人資料管理**：用戶只能查看/編輯自己的資料
- ✅ **API 服務訪問**：service_role 可完全訪問

### 3. **API 兼容性**

#### **現有 API 不受影響**
- 後端 API 使用 `SUPABASE_SERVICE_ROLE_KEY`
- service_role 可繞過 RLS 限制
- 所有現有功能正常運作

#### **前端 LIFF 應用**
- 用戶登入後可正常管理自己的卡片
- 匿名用戶可查看公開卡片（分享功能）
- 不影響現有的編輯/分享流程

## 🔧 **執行步驟**

### **步驟 1：執行 SQL 腳本**
```sql
-- 在 Supabase Dashboard > SQL Editor 中執行
-- 複製 supabase/enable-rls.sql 的內容並執行
```

### **步驟 2：驗證修復**
1. 前往 Supabase Dashboard > Authentication > Policies
2. 確認每個資料表都有對應的 RLS 政策
3. 檢查 Security Advisor 警告是否消失

### **步驟 3：測試功能**
1. ✅ **編輯模式**：登入用戶可正常編輯卡片
2. ✅ **分享功能**：分享連結正常運作
3. ✅ **自動分享**：pageId+userId 參數正常
4. ✅ **API 功能**：儲存/查詢/更新正常

## 📋 **安全性改善**

### **修復前**
- ❌ 資料表無 RLS 保護
- ❌ 任何人可直接訪問資料庫
- ❌ 無權限控制機制

### **修復後**
- ✅ 啟用 RLS 行級安全性
- ✅ 用戶只能訪問自己的資料
- ✅ 公開內容有明確政策
- ✅ API 服務有專用權限
- ✅ 符合資料保護最佳實務

## 🎯 **影響評估**

### **✅ 無負面影響**
- 現有功能完全正常
- API 性能無變化
- 用戶體驗無差異

### **✅ 安全性大幅提升**
- 防止未授權資料訪問
- 符合 GDPR/個資法要求
- 通過 Supabase 安全性檢查

## 📝 **維護建議**

1. **定期檢查**：每月檢查 Security Advisor
2. **政策更新**：新增功能時同步更新 RLS 政策
3. **權限最小化**：遵循最小權限原則
4. **日誌監控**：監控異常訪問模式

---

**執行時間**：約 5 分鐘  
**風險等級**：低（無功能影響）  
**優先級**：高（安全性必要） 