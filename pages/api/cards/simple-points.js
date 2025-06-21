import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

// 🎯 簡化版回饋系統 - 固定10%回饋
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }
  
  const { cardIdTypeArr, userId } = req.body;
  
  if (!Array.isArray(cardIdTypeArr) || cardIdTypeArr.length === 0) {
    return res.status(400).json({ success: false, error: 'Invalid cardIdTypeArr' });
  }

  try {
    const shareSessionId = crypto.randomUUID();
    let totalDeducted = 0;
    let totalRewarded = 0;
    let pointsResults = [];
    
    console.log(`[simple-points] 開始處理簡化版分享點數，session: ${shareSessionId}`);
    
    // 1. 檢查所有卡片點數是否足夠
    for (const { id, type } of cardIdTypeArr) {
      if (!id || id === 'test-main-card') {
        console.log(`跳過無效的卡片ID: ${id}`);
        continue;
      }
      
      const isTempMainCard = id.startsWith('temp-main-card-');
      
      if (isTempMainCard && type === 'main') {
        console.log(`臨時主卡跳過點數檢查: ${id}`);
        continue;
      }
      
      const table = type === 'main' ? 'member_cards' : 'promo_cards';
      const pointsField = type === 'main' ? 'user_points' : 'promo_points';
      
      const { data: current, error: getError } = await supabase
        .from(table)
        .select(pointsField)
        .eq('id', id)
        .single();
        
      if (getError) {
        console.error(`查詢${type === 'main' ? '分享卡' : '活動卡'}失敗:`, getError);
        if (getError.code === 'PGRST116') {
          throw new Error(`${type === 'main' ? '分享卡' : '活動卡'}不存在: ${id}`);
        } else {
          throw new Error(`查詢${type === 'main' ? '分享卡' : '活動卡'}失敗: ${getError.message}`);
        }
      }
      
      const currentPoints = current?.[pointsField] || 0;
      if (currentPoints < 10) {
        throw new Error(`${type === 'main' ? '分享卡' : '活動卡'} ${id} 點數不足 (目前: ${currentPoints}點, 需要: 10點)`);
      }
    }
    
    // 2. 處理點數交易
    for (let i = 0; i < cardIdTypeArr.length; i++) {
      const { id, type } = cardIdTypeArr[i];
      
      if (!id || id === 'test-main-card') {
        console.log(`跳過無效的卡片ID: ${id}`);
        continue;
      }
      
      const isTempMainCard = id.startsWith('temp-main-card-');
      
      // 🔧 臨時主卡特殊處理
      if (isTempMainCard && type === 'main') {
        console.log(`使用臨時主卡ID，採用預設點數: 100`);
        
        const tempCurrentPoints = 100;
        const afterDeduct = tempCurrentPoints - 10;
        
        // 記錄臨時主卡扣點交易
        await supabase.from('points_transactions').insert({
          card_id: id,
          card_type: type,
          transaction_type: 'deduct_share',
          amount: -10,
          balance_before: tempCurrentPoints,
          balance_after: afterDeduct,
          share_session_id: shareSessionId,
          position_index: i
        });
        
        totalDeducted += 10;
        
        // 🎯 簡化版：固定10%回饋給分享卡
        const fixedReward = 10 * 0.10; // 固定10%回饋
        
        // 記錄臨時主卡回饋交易
        await supabase.from('points_transactions').insert({
          card_id: id,
          card_type: type,
          transaction_type: 'reward_share',
          amount: fixedReward,
          balance_before: afterDeduct,
          balance_after: afterDeduct + fixedReward,
          share_session_id: shareSessionId,
          position_index: i,
          reward_percentage: 10.0
        });
        
        totalRewarded += fixedReward;
        
        console.log(`✅ 臨時主卡回饋完成：固定回饋 ${fixedReward} 點`);
        console.log(`[simple-points] cardId=${id}, old=${tempCurrentPoints}, reward=${fixedReward}, new=${afterDeduct + fixedReward}`);
        
        pointsResults.push({
          cardId: id,
          type: type,
          deducted: 10,
          rewarded: fixedReward,
          finalBalance: afterDeduct + fixedReward,
          isTemp: true
        });
        
        continue;
      }
      
      const table = type === 'main' ? 'member_cards' : 'promo_cards';
      const pointsField = type === 'main' ? 'user_points' : 'promo_points';
      
      // 查詢當前點數
      const { data: current, error: getError } = await supabase
        .from(table)
        .select(pointsField)
        .eq('id', id)
        .single();
        
      if (getError) {
        console.error(`查詢${type === 'main' ? '分享卡' : '活動卡'}點數失敗:`, getError);
        throw new Error(`查詢${type === 'main' ? '分享卡' : '活動卡'}點數失敗: ${getError.message}`);
      }
      
      const currentPoints = current?.[pointsField] || 0;
      
      // 1. 扣除10點
      const afterDeduct = currentPoints - 10;
      
      await supabase.from(table).update({ [pointsField]: afterDeduct }).eq('id', id);
      
      // 記錄扣點交易
      await supabase.from('points_transactions').insert({
        card_id: id,
        card_type: type,
        transaction_type: 'deduct_share',
        amount: -10,
        balance_before: currentPoints,
        balance_after: afterDeduct,
        share_session_id: shareSessionId,
        position_index: i
      });
      
      totalDeducted += 10;
      
      // 2. 🎯 簡化版：只有分享卡獲得固定10%回饋
      let cardReward = 0;
      let finalBalance = afterDeduct;
      
      if (type === 'main') {
        cardReward = 10 * 0.10; // 固定10%回饋
        finalBalance = afterDeduct + cardReward;
        
        // 更新分享卡點數
        await supabase.from(table).update({ [pointsField]: finalBalance }).eq('id', id);
        
        // 記錄回饋交易
        await supabase.from('points_transactions').insert({
          card_id: id,
          card_type: type,
          transaction_type: 'reward_share',
          amount: cardReward,
          balance_before: afterDeduct,
          balance_after: finalBalance,
          share_session_id: shareSessionId,
          position_index: i,
          reward_percentage: 10.0
        });
        
        totalRewarded += cardReward;
        
        console.log(`✅ 分享卡回饋完成：固定回饋 ${cardReward} 點，最終餘額 ${finalBalance} 點`);
      } else {
        console.log(`ℹ️ 活動卡不獲得回饋：位置${i}`);
      }
      
      pointsResults.push({
        cardId: id,
        type: type,
        deducted: 10,
        rewarded: cardReward,
        finalBalance: finalBalance
      });
      
      console.log(`[simple-points] ${type} ${id}: -10點 ${cardReward > 0 ? `+${cardReward}點回饋` : ''}`);
    }
    
    // 3. 記錄分享會話
    await supabase.from('share_sessions').insert({
      id: shareSessionId,
      main_card_id: cardIdTypeArr.find(c => c.type === 'main')?.id || 'unknown',
      user_id: userId,
      total_cards: cardIdTypeArr.length,
      attached_cards: cardIdTypeArr.filter(c => c.type === 'promo').map((c, i) => ({ id: c.id, position: i })),
      total_deducted: totalDeducted,
      total_rewarded: totalRewarded,
      net_amount: totalRewarded - totalDeducted,
      status: 'completed'
    });
    
    console.log(`[simple-points] 完成分享交易，session: ${shareSessionId}, 扣除: ${totalDeducted}, 回饋: ${totalRewarded}, 淨額: ${totalRewarded - totalDeducted}`);
    
    // 4. 生成回饋詳情
    const rewardDetails = cardIdTypeArr.map((card, i) => ({
      position: i,
      percentage: card.type === 'main' ? 10.0 : 0.0,
      reward: card.type === 'main' ? 1.0 : 0.0,
      cardType: card.type,
      description: `位置${i + 1}${card.type === 'main' ? '(分享卡)' : '(活動卡)'}`,
      note: card.type === 'main' ? '獲得固定10%回饋' : '不獲得回饋'
    }));
    
    res.status(200).json({
      success: true,
      pointsTransaction: {
        shareSessionId,
        totalDeducted,
        totalRewarded,
        netAmount: totalRewarded - totalDeducted,
        details: pointsResults,
        rewardDetails: rewardDetails
      }
    });
    
  } catch (error) {
    console.error('Simple points error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message
    });
  }
} 