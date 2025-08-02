-- 創建點數交易記錄表 (重新利用 initial_points_settings 概念)
-- 記錄所有點數變動：初始、充值、扣款、分享獎勵等

CREATE TABLE IF NOT EXISTS points_transactions (
    id SERIAL PRIMARY KEY,
    page_id VARCHAR(50) NOT NULL,
    line_user_id VARCHAR(100) NOT NULL,
    transaction_type VARCHAR(50) NOT NULL, -- 'initial', 'recharge', 'deduction', 'share_reward', 'admin_adjust'
    amount INTEGER NOT NULL, -- 正數為增加，負數為扣除
    balance_before INTEGER NOT NULL DEFAULT 0, -- 交易前餘額
    balance_after INTEGER NOT NULL DEFAULT 0, -- 交易後餘額
    description TEXT, -- 交易說明
    reference_id VARCHAR(100), -- 關聯ID (如卡片ID、分享ID等)
    created_by VARCHAR(100), -- 操作者 (系統/管理員ID)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- 添加約束
    CONSTRAINT points_transactions_amount_check CHECK (amount != 0),
    CONSTRAINT points_transactions_balance_check CHECK (balance_after >= 0)
);

-- 創建索引
CREATE INDEX IF NOT EXISTS idx_points_transactions_user ON points_transactions(page_id, line_user_id);
CREATE INDEX IF NOT EXISTS idx_points_transactions_type ON points_transactions(transaction_type);
CREATE INDEX IF NOT EXISTS idx_points_transactions_date ON points_transactions(created_at DESC);

-- 添加註釋
COMMENT ON TABLE points_transactions IS '點數交易記錄表 - 記錄所有點數變動';
COMMENT ON COLUMN points_transactions.transaction_type IS '交易類型：initial(初始), recharge(充值), deduction(扣款), share_reward(分享獎勵), admin_adjust(管理員調整)';
COMMENT ON COLUMN points_transactions.amount IS '交易金額：正數為增加，負數為扣除';
COMMENT ON COLUMN points_transactions.balance_before IS '交易前餘額';
COMMENT ON COLUMN points_transactions.balance_after IS '交易後餘額';

-- 啟用RLS
ALTER TABLE points_transactions ENABLE ROW LEVEL SECURITY;

-- 創建RLS政策
CREATE POLICY "Enable read access for all users" ON points_transactions
    FOR SELECT USING (true);

CREATE POLICY "Enable insert access for authenticated users" ON points_transactions
    FOR INSERT WITH CHECK (true); 