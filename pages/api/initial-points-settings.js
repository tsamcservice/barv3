import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

export default async function handler(req, res) {
  if (req.method === 'GET') {
    // 🔧 修正：從專用設定表讀取初始點數，不影響用戶資料
    try {
      const { pageId = 'M01001' } = req.query;
      
      // 🔧 首先嘗試從專用設定表讀取
      const { data: settingsData, error: settingsError } = await supabase
        .from('initial_points_settings')
        .select('initial_points')
        .eq('page_id', pageId)
        .limit(1);
      
      if (!settingsError && settingsData && settingsData.length > 0) {
        // 從專用設定表讀取成功
        const initialPoints = settingsData[0].initial_points;
        console.log(`從設定表讀取 ${pageId} 初始點數:`, initialPoints);
        
        return res.status(200).json({ 
          success: true, 
          data: {
            pageId: pageId,
            initialPoints: initialPoints || 168,
            source: 'settings_table'
          }
        });
      }
      
      // 🔧 fallback：如果設定表沒有資料，返回預設值168
      console.log(`設定表無資料，使用預設值168 for ${pageId}`);
      return res.status(200).json({ 
        success: true, 
        data: {
          pageId: pageId,
          initialPoints: 168,
          source: 'default'
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
    // 🔧 修正：更新專用設定表，不影響現有用戶資料
    try {
      const { pageId = 'M01001', initialPoints } = req.body;
      
      if (typeof initialPoints !== 'number' || initialPoints < 0) {
        return res.status(400).json({ 
          success: false, 
          error: '請提供有效的點數值 (≥0)' 
        });
      }
      
      // 🔧 使用upsert更新專用設定表
      const { data, error } = await supabase
        .from('initial_points_settings')
        .upsert({
          page_id: pageId,
          initial_points: initialPoints,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'page_id'
        })
        .select();
      
      if (error) {
        console.error('更新初始點數設定失敗:', error);
        throw error;
      }
      
      console.log(`✅ 已更新 ${pageId} 初始點數設定為 ${initialPoints} 點`);
      
      res.status(200).json({ 
        success: true, 
        message: `已成功更新 ${pageId} 的初始點數設定為 ${initialPoints} 點 (僅影響新用戶)`,
        data: {
          pageId: pageId,
          initialPoints: initialPoints,
          updatedAt: data[0].updated_at,
          note: '此設定僅影響新用戶，不會修改現有用戶的累計點數'
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