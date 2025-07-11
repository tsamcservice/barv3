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
      
      // 使用upsert確保記錄存在
      const { data, error } = await supabase
        .from('member_cards')
        .upsert({ 
          page_id: pageId,
          user_points: initialPoints,
          updated_at: new Date().toISOString(),
          // 如果是新記錄，添加基本欄位
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
        }, { 
          onConflict: 'page_id',
          ignoreDuplicates: false 
        })
        .select();
      
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