-- 修復 uploaded_images 表的 RLS 政策
-- 由於 SERVICE_ROLE_KEY 無法在 Vercel 中正確讀取，改用完全開放的政策

-- 先刪除現有政策（如果存在）
DROP POLICY IF EXISTS "Allow all operations on uploaded_images" ON uploaded_images;

-- 創建完全開放的讀取政策
CREATE POLICY "Allow all read operations on uploaded_images" ON uploaded_images
FOR SELECT USING (true);

-- 創建完全開放的插入政策  
CREATE POLICY "Allow all insert operations on uploaded_images" ON uploaded_images
FOR INSERT WITH CHECK (true);

-- 創建完全開放的更新政策
CREATE POLICY "Allow all update operations on uploaded_images" ON uploaded_images
FOR UPDATE USING (true) WITH CHECK (true);

-- 創建完全開放的刪除政策
CREATE POLICY "Allow all delete operations on uploaded_images" ON uploaded_images
FOR DELETE USING (true);

-- 確認RLS已啟用
ALTER TABLE uploaded_images ENABLE ROW LEVEL SECURITY; 