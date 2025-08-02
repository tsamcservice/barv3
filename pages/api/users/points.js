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
          error: '請提供完整的參數 (pageId, userId, pointsAdjustment)' 
        });
      }
      
      // 查詢當前點數
      const { data: currentData, error: queryError } = await supabase
        .from('member_cards')
        .select('user_points, display_name, id')
        .eq('page_id', pageId)
        .eq('line_user_id', userId)
        .single();
      
      if (queryError) {
        return res.status(404).json({ 
          success: false, 
          error: '找不到用戶記錄' 
        });
      }
      
      const oldPoints = currentData.user_points || 0;
      const newPoints = oldPoints + pointsAdjustment;
      
      if (newPoints < 0) {
        return res.status(400).json({ 
          success: false, 
          error: '調整後點數不能為負數' 
        });
      }
      
      // 🔧 新增：創建交易記錄
      const shareSessionId = crypto.randomUUID();
      
      // 先記錄交易
      const { error: transactionError } = await supabase
        .from('points_transactions')
        .insert({
          card_id: currentData.id,
          card_type: 'main',
          transaction_type: 'admin_adjust',
          amount: pointsAdjustment,
          balance_before: oldPoints,
          balance_after: newPoints,
          share_session_id: shareSessionId,
          position_index: null,
          reward_percentage: null
        });
      
      if (transactionError) {
        console.error('創建交易記錄失敗:', transactionError);
        return res.status(500).json({ 
          success: false, 
          error: '創建交易記錄失敗' 
        });
      }
      
      // 更新用戶點數
      const { error: updateError } = await supabase
        .from('member_cards')
        .update({ 
          user_points: newPoints,
          updated_at: new Date().toISOString()
        })
        .eq('page_id', pageId)
        .eq('line_user_id', userId);
      
      if (updateError) {
        return res.status(500).json({ 
          success: false, 
          error: '更新點數失敗' 
        });
      }
      
      res.status(200).json({
        success: true,
        message: '點數調整成功',
        data: {
          userId: userId,
          displayName: currentData.display_name,
          oldPoints: oldPoints,
          adjustment: pointsAdjustment,
          newPoints: newPoints,
          updatedAt: new Date().toISOString(),
          transactionId: shareSessionId
        }
      });
      
    } catch (error) {
      console.error('調整點數失敗:', error);
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