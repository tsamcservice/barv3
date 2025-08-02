-- 創建初始點數設定表
-- 用於管理不同頁面的新用戶初始點數，不影響現有用戶的累計點數

CREATE TABLE IF NOT EXISTS initial_points_settings (
    id SERIAL PRIMARY KEY,
    page_id VARCHAR(50) UNIQUE NOT NULL,
    initial_points INTEGER NOT NULL DEFAULT 168,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- 添加約束
    CONSTRAINT initial_points_settings_points_check CHECK (initial_points >= 0),
    CONSTRAINT initial_points_settings_page_id_check CHECK (page_id != '')
);

-- 創建索引
CREATE INDEX IF NOT EXISTS idx_initial_points_settings_page_id ON initial_points_settings(page_id);

-- 插入預設設定
INSERT INTO initial_points_settings (page_id, initial_points) 
VALUES ('M01001', 168)
ON CONFLICT (page_id) DO NOTHING;

-- 添加註釋
COMMENT ON TABLE initial_points_settings IS '初始點數設定表 - 管理新用戶的初始點數，不影響現有用戶';
COMMENT ON COLUMN initial_points_settings.page_id IS '頁面ID (如 M01001)';
COMMENT ON COLUMN initial_points_settings.initial_points IS '新用戶的初始點數';

-- 啟用RLS (Row Level Security)
ALTER TABLE initial_points_settings ENABLE ROW LEVEL SECURITY;

-- 創建RLS政策 - 允許所有用戶讀取，但只有管理員可以修改
CREATE POLICY "Enable read access for all users" ON initial_points_settings
    FOR SELECT USING (true);

CREATE POLICY "Enable insert access for authenticated users" ON initial_points_settings
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update access for authenticated users" ON initial_points_settings
    FOR UPDATE USING (true); 