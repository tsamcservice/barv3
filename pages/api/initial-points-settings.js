import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

export default async function handler(req, res) {
  if (req.method === 'GET') {
    // 🔧 修正：從資料庫讀取初始點數設定
    try {
      const { pageId = 'M01001' } = req.query;
      const configKey = `initial_points_${pageId}`;
      
      const { data, error } = await supabase
        .from('points_config')
        .select('config_value')
        .eq('config_key', configKey)
        .single();
      
      if (error && error.code !== 'PGRST116') { // PGRST116 = 找不到記錄
        console.error('讀取初始點數設定失敗:', error);
        throw error;
      }
      
      const initialPoints = data ? data.config_value : 168; // 預設值
      console.log(`從資料庫讀取 ${pageId} 初始點數設定:`, initialPoints);
      
      return res.status(200).json({ 
        success: true, 
        data: {
          pageId: pageId,
          initialPoints: initialPoints,
          source: 'database'
        }
      });
      
    } catch (error) {
      console.error('讀取初始點數設定失敗:', error);
      res.status(500).json({ 
        success: false, 
        error: error.message 
      });
    }
    
  } else if (req.method === 'POST') {
    // 🔧 修正：儲存初始點數設定到資料庫
    try {
      const { pageId = 'M01001', initialPoints } = req.body;
      
      if (typeof initialPoints !== 'number' || initialPoints < 0) {
        return res.status(400).json({ 
          success: false, 
          error: '請提供有效的點數值 (≥0)' 
        });
      }
      
      const configKey = `initial_points_${pageId}`;
      
      // 🔧 使用upsert儲存到資料庫
      const { data, error } = await supabase
        .from('points_config')
        .upsert({
          config_key: configKey,
          config_value: initialPoints,
          description: `${pageId}頁面新用戶初始點數`,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'config_key'
        })
        .select();
      
      if (error) {
        console.error('儲存初始點數設定失敗:', error);
        throw error;
      }
      
      console.log(`✅ 已儲存 ${pageId} 初始點數設定到資料庫: ${initialPoints} 點`);
      
      res.status(200).json({ 
        success: true, 
        message: `已成功儲存 ${pageId} 的初始點數設定為 ${initialPoints} 點 (僅影響新用戶)`,
        data: {
          pageId: pageId,
          initialPoints: initialPoints,
          updatedAt: data[0].updated_at,
          note: '此設定已儲存到資料庫，僅影響新用戶'
        }
      });
    } catch (error) {
      console.error('API錯誤:', error);
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