import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

export default async function handler(req, res) {
  if (req.method === 'GET') {
    // 查詢用戶點數
    try {
      const { pageId, userId } = req.query;
      
      if (!pageId || !userId) {
        return res.status(400).json({ 
          success: false, 
          error: '請提供頁面ID和用戶ID' 
        });
      }
      
      const { data, error } = await supabase
        .from('member_cards')
        .select('id, user_points, display_name, updated_at')
        .eq('page_id', pageId)
        .eq('line_user_id', userId)
        .limit(1);
      
      if (error) {
        console.error('查詢用戶點數失敗:', error);
        throw error;
      }
      
      if (!data || data.length === 0) {
        return res.status(404).json({ 
          success: false, 
          error: `找不到用戶 ${userId} 在頁面 ${pageId} 的資料` 
        });
      }
      
      const userCard = data[0];
      res.status(200).json({ 
        success: true, 
        data: {
          pageId: pageId,
          userId: userId,
          points: userCard.user_points || 0,
          displayName: userCard.display_name,
          cardId: userCard.id,
          updatedAt: userCard.updated_at
        }
      });
      
    } catch (error) {
      console.error('API錯誤:', error);
      res.status(500).json({ 
        success: false, 
        error: error.message 
      });
    }
    
  } else if (req.method === 'POST') {
    // 調整用戶點數
    try {
      const { pageId, userId, pointsAdjustment } = req.body;
      
      if (!pageId || !userId || typeof pointsAdjustment !== 'number') {
        return res.status(400).json({ 
          success: false, 
          error: '請提供有效的頁面ID、用戶ID和點數調整值' 
        });
      }
      
      // 先查詢現有點數
      const { data: existingData, error: queryError } = await supabase
        .from('member_cards')
        .select('id, user_points, display_name')
        .eq('page_id', pageId)
        .eq('line_user_id', userId)
        .limit(1);
      
      if (queryError) {
        console.error('查詢現有資料失敗:', queryError);
        throw queryError;
      }
      
      if (!existingData || existingData.length === 0) {
        return res.status(404).json({ 
          success: false, 
          error: `找不到用戶 ${userId} 在頁面 ${pageId} 的資料` 
        });
      }
      
      const currentPoints = existingData[0].user_points || 0;
      const newPoints = currentPoints + pointsAdjustment;
      
      // 檢查點數不能為負數
      if (newPoints < 0) {
        return res.status(400).json({ 
          success: false, 
          error: `調整後點數不能為負數 (當前: ${currentPoints}, 調整: ${pointsAdjustment}, 結果: ${newPoints})` 
        });
      }
      
      // 更新點數
      const { data: updateData, error: updateError } = await supabase
        .from('member_cards')
        .update({ 
          user_points: newPoints,
          updated_at: new Date().toISOString()
        })
        .eq('id', existingData[0].id)
        .select('user_points, updated_at');
      
      if (updateError) {
        console.error('更新點數失敗:', updateError);
        throw updateError;
      }
      
      console.log(`✅ 用戶 ${userId} 在 ${pageId} 的點數已從 ${currentPoints} 調整為 ${newPoints}`);
      
      res.status(200).json({ 
        success: true, 
        message: `用戶點數調整成功 (${currentPoints} → ${newPoints})`,
        data: {
          pageId: pageId,
          userId: userId,
          previousPoints: currentPoints,
          pointsAdjustment: pointsAdjustment,
          points: newPoints,
          displayName: existingData[0].display_name,
          updatedAt: updateData[0].updated_at
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