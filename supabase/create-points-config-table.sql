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

-- 創建索引
CREATE INDEX IF NOT EXISTS idx_points_config_key ON points_config(config_key);

-- 插入預設設定
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

-- 啟用RLS
ALTER TABLE points_config ENABLE ROW LEVEL SECURITY;

-- 創建RLS政策 (允許讀取和更新)
CREATE POLICY "Enable read access for all users" ON points_config
    FOR SELECT USING (true);

CREATE POLICY "Enable update access for authenticated users" ON points_config
    FOR UPDATE USING (true);

-- 查詢確認
SELECT * FROM points_config ORDER BY config_key; 