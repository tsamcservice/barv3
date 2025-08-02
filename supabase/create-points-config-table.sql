-- 現在這個腳本可以重複執行而不會出錯
-- supabase/create-points-config-table.sql

-- 點數系統配置表 (統一管理所有點數相關設定)
-- 用於存儲：初始點數、獎勵設定、系統參數等

CREATE TABLE IF NOT EXISTS points_config (
    id SERIAL PRIMARY KEY,
    config_key VARCHAR(100) UNIQUE NOT NULL,
    config_value INTEGER NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 創建索引 (如果不存在)
CREATE INDEX IF NOT EXISTS idx_points_config_key ON points_config(config_key);

-- 插入預設設定 (如果不存在)
INSERT INTO points_config (config_key, config_value, description) 
VALUES 
    ('initial_points_M01001', 168, 'M01001頁面新用戶初始點數'),
    ('share_reward_base', 10, '分享基礎獎勵點數'),
    ('daily_share_limit', 100, '每日分享點數上限')
ON CONFLICT (config_key) DO NOTHING;

-- 添加註釋
COMMENT ON TABLE points_config IS '點數系統統一配置表 - 管理初始點數、獎勵設定等';
COMMENT ON COLUMN points_config.config_key IS '設定鍵值 (如: initial_points_M01001)';
COMMENT ON COLUMN points_config.config_value IS '設定數值';

-- 啟用RLS (如果尚未啟用)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_class c 
        JOIN pg_namespace n ON n.oid = c.relnamespace 
        WHERE c.relname = 'points_config' AND c.relrowsecurity = true
    ) THEN
        ALTER TABLE points_config ENABLE ROW LEVEL SECURITY;
    END IF;
END $$;

-- 🔧 修正：完善的政策管理，避免重複創建錯誤
DO $$ 
BEGIN
    -- 刪除可能存在的舊政策 (忽略不存在的錯誤)
    BEGIN
        DROP POLICY IF EXISTS "Enable read access for all users" ON points_config;
    EXCEPTION WHEN undefined_object THEN
        NULL; -- 忽略政策不存在的錯誤
    END;
    
    BEGIN
        DROP POLICY IF EXISTS "Enable update access for authenticated users" ON points_config;
    EXCEPTION WHEN undefined_object THEN
        NULL;
    END;
    
    BEGIN
        DROP POLICY IF EXISTS "Enable insert access for authenticated users" ON points_config;
    EXCEPTION WHEN undefined_object THEN
        NULL;
    END;
    
    -- 檢查新政策是否已存在，如果不存在才創建
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'points_config' 
        AND policyname = 'Allow all operations for points_config'
    ) THEN
        CREATE POLICY "Allow all operations for points_config" ON points_config
            FOR ALL USING (true) WITH CHECK (true);
        RAISE NOTICE '✅ 已創建新的RLS政策';
    ELSE
        RAISE NOTICE '⚠️ RLS政策已存在，跳過創建';
    END IF;
END $$;

-- 查詢確認
SELECT 'points_config表狀態' as status, COUNT(*) as total_configs FROM points_config;
SELECT 'RLS政策狀態' as status, COUNT(*) as total_policies FROM pg_policies WHERE tablename = 'points_config';
SELECT * FROM points_config ORDER BY config_key; 