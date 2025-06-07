-- 建立專門記錄用戶上傳圖片的資料表
CREATE TABLE IF NOT EXISTS uploaded_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  line_user_id text NOT NULL,
  image_url text NOT NULL,
  original_filename text,
  file_size integer,
  file_type text,
  storage_path text,
  created_at timestamp with time zone DEFAULT now(),
  last_used_at timestamp with time zone,
  usage_count integer DEFAULT 0,
  is_active boolean DEFAULT true
);

-- 建立索引
CREATE INDEX IF NOT EXISTS idx_uploaded_images_line_user_id ON uploaded_images(line_user_id);
CREATE INDEX IF NOT EXISTS idx_uploaded_images_created_at ON uploaded_images(created_at);
CREATE INDEX IF NOT EXISTS idx_uploaded_images_image_url ON uploaded_images(image_url);

-- 建立唯一約束（同一用戶不能重複記錄相同URL）
ALTER TABLE uploaded_images ADD CONSTRAINT unique_user_image_url UNIQUE (line_user_id, image_url);

-- 增加說明
COMMENT ON TABLE uploaded_images IS '用戶上傳圖片記錄表';
COMMENT ON COLUMN uploaded_images.line_user_id IS 'LINE用戶ID';
COMMENT ON COLUMN uploaded_images.image_url IS '圖片的公開URL';
COMMENT ON COLUMN uploaded_images.original_filename IS '原始檔案名稱';
COMMENT ON COLUMN uploaded_images.file_size IS '檔案大小（bytes）';
COMMENT ON COLUMN uploaded_images.file_type IS '檔案類型（MIME type）';
COMMENT ON COLUMN uploaded_images.storage_path IS 'Supabase Storage中的路徑';
COMMENT ON COLUMN uploaded_images.usage_count IS '使用次數';
COMMENT ON COLUMN uploaded_images.last_used_at IS '最後使用時間';
COMMENT ON COLUMN uploaded_images.is_active IS '是否啟用（軟刪除用）'; 