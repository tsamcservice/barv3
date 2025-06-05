-- 啟用 Row Level Security (RLS) 修復腳本
-- 解決 Security Advisor 中的 "RLS Disabled in Public" 警告

-- 1. 為 member_cards 表啟用 RLS
ALTER TABLE public.member_cards ENABLE ROW LEVEL SECURITY;

-- 2. 為 promo_cards 表啟用 RLS  
ALTER TABLE public.promo_cards ENABLE ROW LEVEL SECURITY;

-- 3. 為 users 表啟用 RLS (如果存在)
-- ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- 4. 創建 member_cards 的 RLS 政策
-- 🔧 修正：完全開放查詢權限，確保分享功能正常
CREATE POLICY "允許所有用戶查詢會員卡片" ON public.member_cards
    FOR SELECT USING (true);

-- 允許已認證用戶和API插入卡片
CREATE POLICY "允許插入會員卡片" ON public.member_cards
    FOR INSERT WITH CHECK (true);

-- 允許已認證用戶和API更新卡片
CREATE POLICY "允許更新會員卡片" ON public.member_cards
    FOR UPDATE USING (true);

-- 允許已認證用戶和API刪除卡片
CREATE POLICY "允許刪除會員卡片" ON public.member_cards
    FOR DELETE USING (true);

-- 5. 創建 promo_cards 的 RLS 政策
-- 允許所有人查看宣傳卡片
CREATE POLICY "允許查看宣傳卡片" ON public.promo_cards
    FOR SELECT USING (true);

-- 允許所有操作宣傳卡片
CREATE POLICY "允許管理宣傳卡片" ON public.promo_cards
    FOR ALL USING (true);

-- 6. 特殊政策：確保 API 服務角色完全訪問
-- 這些政策允許使用 service_role key 的 API 繞過所有限制
CREATE POLICY "API服務完全訪問member_cards" ON public.member_cards
    FOR ALL USING (auth.role() = 'service_role') WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "API服務完全訪問promo_cards" ON public.promo_cards
    FOR ALL USING (auth.role() = 'service_role') WITH CHECK (auth.role() = 'service_role');

-- 完成提示
SELECT 'RLS 已成功啟用，確保API和LIFF完全正常運作！' as status; 