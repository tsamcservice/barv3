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
        .limit(1);
      
      if (error) {
        console.error('讀取初始點數失敗:', error);
        throw error;
      }
      
      // 如果沒有找到記錄，返回預設值168
      const initialPoints = (data && data.length > 0) ? data[0].user_points : 168;
      
      res.status(200).json({ 
        success: true, 
        data: {
          pageId: pageId,
          initialPoints: initialPoints || 168
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
      
      // 先檢查記錄是否存在，然後決定更新或插入
      const { data: existingData, error: checkError } = await supabase
        .from('member_cards')
        .select('id, page_id')
        .eq('page_id', pageId)
        .limit(1);
      
      if (checkError) {
        console.error('檢查記錄失敗:', checkError);
        throw checkError;
      }
      
      let data, error;
      
      if (existingData && existingData.length > 0) {
        // 記錄存在，執行更新
        console.log(`更新現有記錄 ${pageId}`);
        const result = await supabase
          .from('member_cards')
          .update({ 
            user_points: initialPoints,
            updated_at: new Date().toISOString()
          })
          .eq('page_id', pageId)
          .select();
        
        data = result.data;
        error = result.error;
      } else {
        // 記錄不存在，執行插入
        console.log(`創建新記錄 ${pageId}`);
        const result = await supabase
          .from('member_cards')
          .insert({ 
            page_id: pageId,
            user_points: initialPoints,
            updated_at: new Date().toISOString(),
            created_at: new Date().toISOString(),
            // 添加基本欄位
            card_alt_title: `${pageId}初始卡片`,
            flex_json: JSON.stringify({
              "type": "bubble",
              "hero": {
                "type": "image",
                "url": "https://scdn.line-apps.com/n/channel_devcenter/img/fx/01_1_cafe.png",
                "size": "full"
              },
              "body": {
                "type": "box",
                "layout": "vertical",
                "contents": [
                  {
                    "type": "text",
                    "text": "預設卡片",
                    "weight": "bold",
                    "size": "xl"
                  }
                ]
              }
            })
          })
          .select();
        
        data = result.data;
        error = result.error;
      }
      
      if (error) {
        console.error('更新初始點數失敗:', error);
        throw error;
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