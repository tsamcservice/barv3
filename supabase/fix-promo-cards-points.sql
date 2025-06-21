-- 修復附加卡片點數問題
-- 執行日期: 2025-06-21
-- 說明: 確保所有附加卡片都有正確的初始點數

-- 1. 檢查現有附加卡片的點數狀況
SELECT 
  'promo_cards點數檢查' as info,
  COUNT(*) as total_cards,
  COUNT(promo_points) as has_points_field,
  AVG(promo_points) as avg_points,
  MIN(promo_points) as min_points,
  MAX(promo_points) as max_points,
  COUNT(CASE WHEN promo_points IS NULL THEN 1 END) as null_points,
  COUNT(CASE WHEN promo_points = 0 THEN 1 END) as zero_points
FROM promo_cards;

-- 2. 更新所有點數為NULL或0的附加卡片
UPDATE promo_cards 
SET promo_points = 50.0, 
    updated_at = now()
WHERE promo_points IS NULL OR promo_points = 0;

-- 3. 確保promo_points欄位有預設值
ALTER TABLE promo_cards 
ALTER COLUMN promo_points SET DEFAULT 50.0;

-- 4. 再次檢查更新結果
SELECT 
  'promo_cards更新後檢查' as info,
  COUNT(*) as total_cards,
  AVG(promo_points) as avg_points,
  MIN(promo_points) as min_points,
  MAX(promo_points) as max_points,
  COUNT(CASE WHEN promo_points IS NULL THEN 1 END) as null_points,
  COUNT(CASE WHEN promo_points = 0 THEN 1 END) as zero_points
FROM promo_cards;

-- 5. 檢查主卡點數狀況
SELECT 
  'member_cards點數檢查' as info,
  COUNT(*) as total_cards,
  AVG(user_points) as avg_points,
  MIN(user_points) as min_points,
  MAX(user_points) as max_points,
  COUNT(CASE WHEN user_points IS NULL THEN 1 END) as null_points,
  COUNT(CASE WHEN user_points = 0 THEN 1 END) as zero_points
FROM member_cards; 