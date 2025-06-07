-- 為 uploaded_images 表設定 RLS 政策

-- 啟用 RLS
ALTER TABLE uploaded_images ENABLE ROW LEVEL SECURITY;

-- 創建允許所有操作的政策（暫時使用，確保功能正常）
CREATE POLICY "Allow all operations on uploaded_images" ON uploaded_images
FOR ALL USING (true) WITH CHECK (true);

-- 如果要更嚴格的政策，可以使用以下替代（先註解掉）
/*
-- 僅允許讀取自己的圖片
CREATE POLICY "Users can read own images" ON uploaded_images
FOR SELECT USING (true);  -- 暫時允許所有讀取

-- 僅允許插入自己的圖片
CREATE POLICY "Users can insert own images" ON uploaded_images  
FOR INSERT WITH CHECK (true);  -- 暫時允許所有插入

-- 僅允許更新自己的圖片
CREATE POLICY "Users can update own images" ON uploaded_images
FOR UPDATE USING (true) WITH CHECK (true);  -- 暫時允許所有更新

-- 僅允許刪除自己的圖片  
CREATE POLICY "Users can delete own images" ON uploaded_images
FOR DELETE USING (true);  -- 暫時允許所有刪除
*/ 