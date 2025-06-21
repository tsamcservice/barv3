import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

// 🎯 自動分享回饋API - 固定10%回饋
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }
  
  const { cardId, userId, rewardPercentage = 10.0, source = 'auto_share' } = req.body;
  
  if (!cardId) {
    return res.status(400).json({ success: false, error: 'cardId is required' });
  }

  try {
    console.log(`[auto-share-reward] 開始處理自動分享回饋，cardId: ${cardId}, userId: ${userId}`);
    
    // 1. 查詢卡片資料和當前點數
    const { data: cardData, error: getError } = await supabase
      .from('member_cards')
      .select('user_points, main_title_1, display_name')
      .eq('id', cardId)
      .single();
      
    if (getError) {
      console.error('查詢卡片失敗:', getError);
      if (getError.code === 'PGRST116') {
        throw new Error(`卡片不存在: ${cardId}`);
      } else {
        throw new Error(`查詢卡片失敗: ${getError.message}`);
      }
    }
    
    const currentPoints = cardData.user_points || 0;
    console.log(`當前點數: ${currentPoints}`);
    
    // 2. 從資料庫讀取回饋設定 (位置4的回饋比例 - 位置5最右邊)
    const { data: settingsData, error: settingsError } = await supabase
      .from('points_settings')
      .select('position_index, reward_percentage')
      .eq('position_index', 4) // 自動分享使用位置4的回饋比例（位置5最右邊）
      .single();
    
    let actualRewardPercentage = 10.0; // 預設10%
    if (!settingsError && settingsData) {
      actualRewardPercentage = settingsData.reward_percentage;
      console.log(`從設定讀取回饋比例: ${actualRewardPercentage}%`);
    } else {
      console.log(`使用預設回饋比例: ${actualRewardPercentage}%`);
    }
    
    // 計算回饋點數
    const baseAmount = 10; // 基礎分享成本
    const rewardAmount = Math.round(baseAmount * (actualRewardPercentage / 100) * 100) / 100; // 四捨五入到小數點後2位
    const newPoints = currentPoints + rewardAmount;
    
    console.log(`回饋計算: ${baseAmount} × ${actualRewardPercentage}% = ${rewardAmount} 點`);
    console.log(`點數更新: ${currentPoints} → ${newPoints}`);
    
    // 3. 更新卡片點數
    const { error: updateError } = await supabase
      .from('member_cards')
      .update({ user_points: newPoints })
      .eq('id', cardId);
      
    if (updateError) {
      console.error('更新點數失敗:', updateError);
      throw new Error(`更新點數失敗: ${updateError.message}`);
    }
    
    // 4. 記錄交易
    const shareSessionId = crypto.randomUUID();
    
    // 記錄回饋交易
    const { error: transactionError } = await supabase
      .from('points_transactions')
      .insert({
        card_id: cardId,
        card_type: 'main',
        transaction_type: 'reward_auto_share',
        amount: rewardAmount,
        balance_before: currentPoints,
        balance_after: newPoints,
        share_session_id: shareSessionId,
        position_index: 4, // 自動分享固定為位置4（位置5最右邊）
        reward_percentage: actualRewardPercentage
      });
      
    if (transactionError) {
      console.error('記錄交易失敗:', transactionError);
      // 交易記錄失敗不影響回饋，只記錄錯誤
    }
    
    // 5. 記錄分享會話
    const { error: sessionError } = await supabase
      .from('share_sessions')
      .insert({
        id: shareSessionId,
        main_card_id: cardId,
        user_id: userId,
        total_cards: 1,
        attached_cards: [],
        total_deducted: 0, // 自動分享不扣點
        total_rewarded: rewardAmount,
        net_amount: rewardAmount,
        status: 'completed'
      });
      
    if (sessionError) {
      console.error('記錄分享會話失敗:', sessionError);
      // 會話記錄失敗不影響回饋，只記錄錯誤
    }
    
    console.log(`[auto-share-reward] 回饋處理完成: +${rewardAmount}點, 新餘額: ${newPoints}`);
    
    res.status(200).json({
      success: true,
      rewardAmount: rewardAmount,
      oldPoints: currentPoints,
      newPoints: newPoints,
      cardTitle: cardData.main_title_1 || cardData.display_name || '會員卡',
      shareSessionId: shareSessionId
    });
    
  } catch (error) {
    console.error('Auto share reward error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message
    });
  }
} 