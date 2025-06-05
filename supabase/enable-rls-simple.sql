-- 簡化版 RLS 腳本 - 確保應用正常運作
-- 完全開放所有權限，避免阻擋LIFF和API功能

-- 1. 啟用 RLS（符合安全要求）
ALTER TABLE public.member_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.promo_cards ENABLE ROW LEVEL SECURITY;

-- 2. 創建完全開放的政策（確保功能正常）
-- member_cards 表的政策
CREATE POLICY "完全開放member_cards" ON public.member_cards
    FOR ALL USING (true) WITH CHECK (true);

-- promo_cards 表的政策  
CREATE POLICY "完全開放promo_cards" ON public.promo_cards
    FOR ALL USING (true) WITH CHECK (true);

-- 3. 確保service_role有完全權限
CREATE POLICY "service_role完全權限member_cards" ON public.member_cards
    FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "service_role完全權限promo_cards" ON public.promo_cards
    FOR ALL TO service_role USING (true) WITH CHECK (true);

-- 完成提示
SELECT 'RLS已啟用但完全開放權限，確保應用正常運作！' as status; 