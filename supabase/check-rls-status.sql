-- RLS 狀態檢查腳本
-- 執行RLS操作前後都可以使用此腳本檢查狀態

-- 1. 檢查表格的RLS狀態
SELECT 
    schemaname,
    tablename,
    rowsecurity as rls_enabled,
    CASE 
        WHEN rowsecurity THEN '✅ RLS已啟用' 
        ELSE '❌ RLS未啟用' 
    END as rls_status
FROM pg_tables 
WHERE tablename IN ('member_cards', 'promo_cards')
AND schemaname = 'public'
ORDER BY tablename;

-- 2. 檢查現有的RLS政策
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename IN ('member_cards', 'promo_cards')
AND schemaname = 'public'
ORDER BY tablename, policyname;

-- 3. 檢查政策數量統計
SELECT 
    tablename,
    COUNT(*) as policy_count
FROM pg_policies 
WHERE tablename IN ('member_cards', 'promo_cards')
AND schemaname = 'public'
GROUP BY tablename
UNION ALL
SELECT 
    '總計' as tablename,
    COUNT(*) as policy_count
FROM pg_policies 
WHERE tablename IN ('member_cards', 'promo_cards')
AND schemaname = 'public';

-- 4. 顯示當前資料庫連接角色
SELECT 
    current_user as current_db_user,
    current_role as current_db_role,
    session_user as session_user; 