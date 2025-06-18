-- 點數系統資料庫擴展 (複製pageview模式)
-- 1. 擴展 member_cards 表加入點數欄位
ALTER TABLE member_cards 
ADD COLUMN user_points decimal(10,2) DEFAULT 100.0;

-- 2. 擴展 promo_cards 表加入點數欄位  
ALTER TABLE promo_cards
ADD COLUMN promo_points decimal(10,2) DEFAULT 10.0;

-- 3. 建立點數設定表 (超簡單版)
CREATE TABLE IF NOT EXISTS points_settings (
  position_index int PRIMARY KEY,
  reward_percentage decimal(5,2) NOT NULL DEFAULT 10.0,
  updated_at timestamp with time zone DEFAULT now()
);

-- 4. 插入預設回饋比例
INSERT INTO points_settings (position_index, reward_percentage) VALUES
(0, 15.0), (1, 12.0), (2, 10.0), (3, 8.0), (4, 5.0)
ON CONFLICT (position_index) DO UPDATE SET 
reward_percentage = EXCLUDED.reward_percentage,
updated_at = now();

-- 5. 更新現有會員卡片的初始點數
UPDATE member_cards SET user_points = 100.0 WHERE user_points IS NULL; 