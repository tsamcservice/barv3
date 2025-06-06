import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: '僅支援GET方法' });
  }

  try {
    const { userId } = req.query;
    
    if (!userId) {
      return res.status(400).json({ success: false, message: '缺少userId參數' });
    }

    // 從用戶資料夾中獲取所有圖片
    const { data: files, error } = await supabase.storage
      .from('member-cards')
      .list(`${userId}/`, {
        limit: 100,
        offset: 0,
        sortBy: { column: 'created_at', order: 'desc' }
      });

    if (error) {
      console.error('獲取圖片列表錯誤:', error);
      return res.status(500).json({ success: false, message: '獲取圖片列表失敗' });
    }

    // 過濾圖片檔案並生成完整URL
    const imageFiles = files
      .filter(file => {
        const ext = file.name.toLowerCase();
        return ext.endsWith('.jpg') || ext.endsWith('.jpeg') || 
               ext.endsWith('.png') || ext.endsWith('.gif') || 
               ext.endsWith('.webp');
      })
      .map(file => {
        const { data } = supabase.storage
          .from('member-cards')
          .getPublicUrl(`${userId}/${file.name}`);
        
        return {
          name: file.name,
          url: data.publicUrl,
          size: file.metadata?.size || 0,
          created_at: file.created_at,
          updated_at: file.updated_at
        };
      });

    res.status(200).json({
      success: true,
      data: imageFiles,
      total: imageFiles.length
    });

  } catch (error) {
    console.error('API錯誤:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message || '伺服器內部錯誤' 
    });
  }
} 