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

    // 改為從資料庫中收集用戶已使用過的圖片URL
    const { data: memberCards, error: cardsError } = await supabase
      .from('member_cards')
      .select('main_image_url, snow_image_url, calendar_image_url, love_icon_url, member_image_url, updated_at')
      .eq('line_user_id', userId)
      .order('updated_at', { ascending: false });

    if (cardsError) {
      console.error('查詢會員卡錯誤:', cardsError);
      return res.status(500).json({ success: false, message: '查詢資料失敗' });
    }

    // 收集所有非空的圖片URL
    const imageUrls = new Set();
    const imageDetails = [];

    if (memberCards && memberCards.length > 0) {
      memberCards.forEach(card => {
        const urls = [
          card.main_image_url,
          card.snow_image_url, 
          card.calendar_image_url,
          card.love_icon_url,
          card.member_image_url
        ];
        
        urls.forEach(url => {
          if (url && url.trim() && url.startsWith('http') && !imageUrls.has(url)) {
            imageUrls.add(url);
            
            // 從URL中提取檔案名稱
            const filename = url.split('/').pop() || 'unknown';
            
            imageDetails.push({
              name: filename,
              url: url,
              created_at: card.updated_at,
              type: 'used_in_card'
            });
          }
        });
      });
    }

    // 如果沒有找到圖片，提供範例圖片
    if (imageDetails.length === 0) {
      imageDetails.push({
        name: '暫無已使用圖片',
        url: '',
        created_at: new Date().toISOString(),
        type: 'placeholder'
      });
    }

    // 按時間排序，最新的在前
    imageDetails.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    res.status(200).json({
      success: true,
      data: imageDetails,
      total: imageDetails.length,
      message: `找到 ${imageDetails.length} 張已使用的圖片`
    });

  } catch (error) {
    console.error('API錯誤:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message || '伺服器內部錯誤' 
    });
  }
} 