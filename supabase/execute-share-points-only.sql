-- 分享點數系統 - 僅新增表格部分
-- 執行日期: 2025-06-18
-- 說明: 僅建立新的分享交易相關表格，不修改現有表格

-- 1. 點數交易記錄表 (新增)
CREATE TABLE IF NOT EXISTS points_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- 基本資訊
  card_id text NOT NULL,                    -- 卡片ID
  card_type text NOT NULL,                  -- 'main' 或 'promo'
  transaction_type text NOT NULL,           -- 'deduct_share' 或 'reward_share'
  
  -- 金額資訊
  amount decimal(10,2) NOT NULL,            -- 交易金額 (負數=扣款，正數=回饋)
  balance_before decimal(10,2),             -- 交易前餘額
  balance_after decimal(10,2),              -- 交易後餘額
  
  -- 分享相關
  share_session_id uuid NOT NULL,          -- 同一次分享的唯一ID
  position_index int,                       -- 附加位置 (0-4)
  reward_percentage decimal(5,2),           -- 回饋比例 (僅回饋交易)
  
  -- 時間戳記
  created_at timestamp with time zone DEFAULT now()
);

-- 2. 分享會話記錄表 (新增)
CREATE TABLE IF NOT EXISTS share_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- 分享者資訊
  main_card_id text NOT NULL,              -- 主卡ID
  user_id text,                             -- LINE用戶ID
  
  -- 分享內容
  total_cards int DEFAULT 1,               -- 總卡片數 (主卡+附加卡)
  attached_cards jsonb,                     -- 附加卡片資訊 [{"id":"xxx","position":0}]
  
  -- 點數摘要
  total_deducted decimal(10,2) DEFAULT 0,  -- 總扣除點數
  total_rewarded decimal(10,2) DEFAULT 0,  -- 總回饋點數
  net_amount decimal(10,2) DEFAULT 0,      -- 淨額 (回饋-扣除)
  
  -- 狀態追蹤
  status text DEFAULT 'completed',         -- 'completed', 'failed', 'partial'
  error_message text,                       -- 錯誤訊息 (如果有)
  
  created_at timestamp with time zone DEFAULT now()
);

-- 3. 建立索引優化查詢 (新增)
CREATE INDEX IF NOT EXISTS idx_points_transactions_card 
ON points_transactions (card_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_points_transactions_session 
ON points_transactions (share_session_id);

CREATE INDEX IF NOT EXISTS idx_share_sessions_main_card 
ON share_sessions (main_card_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_share_sessions_user 
ON share_sessions (user_id, created_at DESC);

-- 4. RLS 政策設定 (新增)
ALTER TABLE points_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE share_sessions ENABLE ROW LEVEL SECURITY;

-- 允許讀取所有交易記錄 (用於管理和查詢)
CREATE POLICY "Allow read points_transactions" ON points_transactions
FOR SELECT USING (true);

-- 允許插入交易記錄 (API使用)
CREATE POLICY "Allow insert points_transactions" ON points_transactions
FOR INSERT WITH CHECK (true);

-- 允許讀取分享會話
CREATE POLICY "Allow read share_sessions" ON share_sessions
FOR SELECT USING (true);

-- 允許插入分享會話
CREATE POLICY "Allow insert share_sessions" ON share_sessions
FOR INSERT WITH CHECK (true);

-- 5. 驗證表格建立成功
SELECT 'points_transactions表建立成功' as status, COUNT(*) as count FROM points_transactions
UNION ALL
SELECT 'share_sessions表建立成功' as status, COUNT(*) as count FROM share_sessions; 