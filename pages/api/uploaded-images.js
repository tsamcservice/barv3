import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  console.log('🔍 uploaded-images API 被調用');
  console.log('🔍 請求方法:', req.method);
  console.log('🔍 請求參數:', req.query);
  console.log('🔍 Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? '已設定' : '未設定');
  console.log('🔍 Service Role Key:', process.env.SUPABASE_SERVICE_ROLE_KEY ? '已設定' : '未設定');
  
  if (req.method !== 'GET') {
    console.log('❌ 不支援的請求方法:', req.method);
    return res.status(405).json({ success: false, message: '僅支援GET方法' });
  }

  try {
    const { userId } = req.query;
    console.log('🔍 提取的userId:', userId);
    
    if (!userId) {
      console.log('❌ 缺少userId參數');
      return res.status(400).json({ success: false, message: '缺少userId參數' });
    }

    // 從專門的 uploaded_images 表讀取用戶上傳的圖片
    console.log('🔍 開始查詢上傳圖片記錄...');
    console.log('🔍 查詢條件:', { line_user_id: userId, is_active: true });
    
    const { data: uploadedImages, error: imagesError } = await supabase
      .from('uploaded_images')
      .select('*')
      .eq('line_user_id', userId)
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    console.log('🔍 上傳圖片查詢結果:');
    console.log('🔍 - 資料:', uploadedImages);
    console.log('🔍 - 錯誤:', imagesError);
    console.log('🔍 - 錯誤詳情:', imagesError ? JSON.stringify(imagesError, null, 2) : '無錯誤');

    if (imagesError) {
      console.error('❌ 查詢上傳圖片錯誤:', imagesError);
      return res.status(500).json({ success: false, message: '查詢圖片資料失敗: ' + imagesError.message });
    }

    let imageDetails = [];

    if (uploadedImages && uploadedImages.length > 0) {
      imageDetails = uploadedImages.map(img => ({
        name: img.original_filename || img.image_url.split('/').pop() || 'unknown',
        url: img.image_url,
        created_at: img.created_at,
        file_size: img.file_size,
        file_type: img.file_type,
        usage_count: img.usage_count,
        last_used_at: img.last_used_at,
        type: 'uploaded'
      }));
    }

    // 如果沒有找到圖片，提供提示信息
    if (imageDetails.length === 0) {
      imageDetails.push({
        name: '暫無已上傳的圖片',
        url: '',
        created_at: new Date().toISOString(),
        type: 'placeholder'
      });
    }

    res.status(200).json({
      success: true,
      data: imageDetails,
      total: imageDetails.length,
      message: `找到 ${imageDetails.length} 張已上傳的圖片`
    });

  } catch (error) {
    console.error('API錯誤:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message || '伺服器內部錯誤' 
    });
  }
} 