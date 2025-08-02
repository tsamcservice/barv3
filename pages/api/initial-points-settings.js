import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

// 🔧 簡化：使用簡單的設定物件管理初始點數
const INITIAL_POINTS_CONFIG = {
  'M01001': 168  // 預設初始點數
};

export default async function handler(req, res) {
  if (req.method === 'GET') {
    // 🔧 簡化：直接返回設定值
    try {
      const { pageId = 'M01001' } = req.query;
      const initialPoints = INITIAL_POINTS_CONFIG[pageId] || 168;
      
      console.log(`讀取 ${pageId} 初始點數設定:`, initialPoints);
      
      return res.status(200).json({ 
        success: true, 
        data: {
          pageId: pageId,
          initialPoints: initialPoints,
          source: 'config'
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
    // 🔧 簡化：更新設定值（實際應用中可存到設定檔或環境變數）
    try {
      const { pageId = 'M01001', initialPoints } = req.body;
      
      if (typeof initialPoints !== 'number' || initialPoints < 0) {
        return res.status(400).json({ 
          success: false, 
          error: '請提供有效的點數值 (≥0)' 
        });
      }
      
      // 🔧 更新設定（實際環境中應該存到設定檔）
      INITIAL_POINTS_CONFIG[pageId] = initialPoints;
      
      console.log(`✅ 已更新 ${pageId} 初始點數設定為 ${initialPoints} 點`);
      
      res.status(200).json({ 
        success: true, 
        message: `已成功更新 ${pageId} 的初始點數設定為 ${initialPoints} 點 (僅影響新用戶)`,
        data: {
          pageId: pageId,
          initialPoints: initialPoints,
          updatedAt: new Date().toISOString(),
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