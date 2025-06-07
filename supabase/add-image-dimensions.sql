-- 為 uploaded_images 表添加圖片尺寸相關欄位
-- 用於顯示圖片的完整資訊：檔名、長寬、檔案大小

-- 添加圖片寬度和高度欄位
ALTER TABLE uploaded_images 
ADD COLUMN IF NOT EXISTS image_width integer,
ADD COLUMN IF NOT EXISTS image_height integer;

-- 添加說明
COMMENT ON COLUMN uploaded_images.image_width IS '圖片寬度（像素）';
COMMENT ON COLUMN uploaded_images.image_height IS '圖片高度（像素）';

-- 為了向後相容，為現有記錄設定預設值（可選）
-- UPDATE uploaded_images 
-- SET image_width = 0, image_height = 0 
-- WHERE image_width IS NULL OR image_height IS NULL;

-- 驗證表格結構
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'uploaded_images' 
ORDER BY ordinal_position; 