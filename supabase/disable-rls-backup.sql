-- RLS 回復腳本 - 緊急時使用
-- 此腳本可完全停用RLS，回復到原始狀態

-- 1. 刪除所有RLS政策
DROP POLICY IF EXISTS "完全開放member_cards" ON public.member_cards;
DROP POLICY IF EXISTS "完全開放promo_cards" ON public.promo_cards;
DROP POLICY IF EXISTS "service_role完全權限member_cards" ON public.member_cards;
DROP POLICY IF EXISTS "service_role完全權限promo_cards" ON public.promo_cards;

-- 2. 停用RLS
ALTER TABLE public.member_cards DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.promo_cards DISABLE ROW LEVEL SECURITY;

-- 3. 確認狀態
SELECT 
    schemaname,
    tablename,
    rowsecurity,
    CASE 
        WHEN rowsecurity THEN 'RLS已啟用' 
        ELSE 'RLS已停用' 
    END as rls_status
FROM pg_tables 
WHERE tablename IN ('member_cards', 'promo_cards')
AND schemaname = 'public';

-- 完成提示
SELECT 'RLS已完全停用，系統回復到原始狀態！' as status; 