-- 點數系統資料庫擴展 (複製pageview模式)
-- 執行日期: 2025-06-18
-- 說明: 為會員卡系統添加點數功能

-- 1. 擴展 member_cards 表加入點數欄位
ALTER TABLE member_cards 
ADD COLUMN IF NOT EXISTS user_points decimal(10,2) DEFAULT 100.0;

-- 2. 擴展 promo_cards 表加入點數欄位  
ALTER TABLE promo_cards
ADD COLUMN IF NOT EXISTS promo_points decimal(10,2) DEFAULT 10.0;

-- 3. 建立點數設定表 (超簡單版)
CREATE TABLE IF NOT EXISTS points_settings (
  position_index int PRIMARY KEY,
  reward_percentage decimal(5,2) NOT NULL DEFAULT 10.0,
  updated_at timestamp with time zone DEFAULT now()
);

-- 4. 插入預設回饋比例 (位置越左邊回饋越高)
INSERT INTO points_settings (position_index, reward_percentage) VALUES
(0, 15.0),  -- 最左邊位置：15%回饋
(1, 12.0),  -- 第二個位置：12%回饋  
(2, 10.0),  -- 第三個位置：10%回饋
(3, 8.0),   -- 第四個位置：8%回饋
(4, 5.0)    -- 第五個位置：5%回饋
ON CONFLICT (position_index) DO UPDATE SET 
reward_percentage = EXCLUDED.reward_percentage,
updated_at = now();

-- 5. 更新現有會員卡片的初始點數 (如果為空)
UPDATE member_cards SET user_points = 100.0 WHERE user_points IS NULL;

-- 6. 更新現有宣傳卡片的初始點數 (如果為空)
UPDATE promo_cards SET promo_points = 10.0 WHERE promo_points IS NULL;

-- 查詢確認
SELECT 'member_cards點數欄位' as table_name, COUNT(*) as count, AVG(user_points) as avg_points 
FROM member_cards WHERE user_points IS NOT NULL
UNION ALL
SELECT 'promo_cards點數欄位' as table_name, COUNT(*) as count, AVG(promo_points) as avg_points 
FROM promo_cards WHERE promo_points IS NOT NULL
UNION ALL
SELECT 'points_settings設定' as table_name, COUNT(*) as count, AVG(reward_percentage) as avg_percentage 
FROM points_settings; 