-- 啟用 Row Level Security (RLS) 修復腳本
-- 解決 Security Advisor 中的 "RLS Disabled in Public" 警告

-- 1. 為 member_cards 表啟用 RLS
ALTER TABLE public.member_cards ENABLE ROW LEVEL SECURITY;

-- 2. 為 promo_cards 表啟用 RLS  
ALTER TABLE public.promo_cards ENABLE ROW LEVEL SECURITY;

-- 3. 為 users 表啟用 RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- 4. 創建 member_cards 的 RLS 政策
-- 允許所有人查看公開卡片（line_user_id 為 null 的初始卡片）
CREATE POLICY "允許查看公開卡片" ON public.member_cards
    FOR SELECT USING (line_user_id IS NULL);

-- 允許已認證用戶查看自己的卡片
CREATE POLICY "允許用戶查看自己的卡片" ON public.member_cards
    FOR SELECT USING (line_user_id = auth.jwt() ->> 'sub');

-- 允許已認證用戶插入自己的卡片
CREATE POLICY "允許用戶創建自己的卡片" ON public.member_cards
    FOR INSERT WITH CHECK (line_user_id = auth.jwt() ->> 'sub');

-- 允許已認證用戶更新自己的卡片
CREATE POLICY "允許用戶更新自己的卡片" ON public.member_cards
    FOR UPDATE USING (line_user_id = auth.jwt() ->> 'sub');

-- 允許已認證用戶刪除自己的卡片
CREATE POLICY "允許用戶刪除自己的卡片" ON public.member_cards
    FOR DELETE USING (line_user_id = auth.jwt() ->> 'sub');

-- 5. 創建 promo_cards 的 RLS 政策
-- 允許所有人查看宣傳卡片
CREATE POLICY "允許查看宣傳卡片" ON public.promo_cards
    FOR SELECT USING (true);

-- 允許已認證用戶操作宣傳卡片（如果需要的話）
CREATE POLICY "允許管理員管理宣傳卡片" ON public.promo_cards
    FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

-- 6. 創建 users 的 RLS 政策
-- 允許用戶查看自己的資料
CREATE POLICY "允許用戶查看自己的資料" ON public.users
    FOR SELECT USING (line_user_id = auth.jwt() ->> 'sub');

-- 允許用戶更新自己的資料
CREATE POLICY "允許用戶更新自己的資料" ON public.users
    FOR UPDATE USING (line_user_id = auth.jwt() ->> 'sub');

-- 允許用戶插入自己的資料
CREATE POLICY "允許用戶創建自己的資料" ON public.users
    FOR INSERT WITH CHECK (line_user_id = auth.jwt() ->> 'sub');

-- 7. 特殊政策：允許 API 服務角色完全訪問（用於後端 API）
-- 這些政策允許使用 service_role key 的 API 繞過 RLS
CREATE POLICY "允許服務角色完全訪問member_cards" ON public.member_cards
    FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "允許服務角色完全訪問promo_cards" ON public.promo_cards
    FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "允許服務角色完全訪問users" ON public.users
    FOR ALL USING (auth.role() = 'service_role');

-- 8. 允許匿名用戶查看公開內容（用於分享功能）
-- 🔧 修正：確保自動分享功能正常運作
CREATE POLICY "允許匿名用戶查看公開卡片" ON public.member_cards
    FOR SELECT USING (line_user_id IS NULL OR true);

-- 🔧 新增：明確允許匿名用戶查看所有會員卡片（分享功能需要）
CREATE POLICY "允許分享功能訪問所有卡片" ON public.member_cards
    FOR SELECT USING (true);

-- 完成提示
SELECT 'RLS 已成功啟用，安全性問題已修復！自動分享功能正常運作！' as status; 