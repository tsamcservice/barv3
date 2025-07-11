import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

export default async function handler(req, res) {
  if (req.method === 'GET') {
    // 取得M01001的初始點數設定
    try {
      const { pageId = 'M01001' } = req.query;
      
      const { data, error } = await supabase
        .from('member_cards')
        .select('user_points')
        .eq('page_id', pageId)
        .single();
      
      if (error) {
        console.error('讀取初始點數失敗:', error);
        throw error;
      }
      
      res.status(200).json({ 
        success: true, 
        data: {
          pageId: pageId,
          initialPoints: data?.user_points || 168
        }
      });
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        error: error.message 
      });
    }
    
  } else if (req.method === 'POST') {
    // 更新M01001的初始點數設定
    try {
      const { pageId = 'M01001', initialPoints } = req.body;
      
      if (typeof initialPoints !== 'number' || initialPoints < 0) {
        return res.status(400).json({ 
          success: false, 
          error: '請提供有效的點數值 (≥0)' 
        });
      }
      
      const { data, error } = await supabase
        .from('member_cards')
        .update({ 
          user_points: initialPoints,
          updated_at: new Date().toISOString()
        })
        .eq('page_id', pageId)
        .select();
      
      if (error) {
        console.error('更新初始點數失敗:', error);
        throw error;
      }
      
      if (!data || data.length === 0) {
        return res.status(404).json({ 
          success: false, 
          error: `找不到頁面ID: ${pageId}` 
        });
      }
      
      res.status(200).json({ 
        success: true, 
        message: `已成功更新 ${pageId} 的初始點數為 ${initialPoints} 點`,
        data: {
          pageId: pageId,
          initialPoints: initialPoints,
          updatedAt: data[0].updated_at
        }
      });
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        error: error.message 
      });
    }
    
  } else {
    res.status(405).json({ 
      success: false, 
      error: 'Method not allowed' 
    });
  }
} 