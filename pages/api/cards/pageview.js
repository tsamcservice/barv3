import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }
  
  const { cardIdTypeArr, includePointsTransaction = false } = req.body;
  if (!Array.isArray(cardIdTypeArr) || cardIdTypeArr.length === 0) {
    return res.status(400).json({ success: false, error: 'No cardIdTypeArr provided' });
  }

  let shareSessionId = null;
  let sessionData = null;

  // 如果包含點數交易，先建立分享會話
  if (includePointsTransaction) {
    shareSessionId = crypto.randomUUID();
    const mainCard = cardIdTypeArr.find(c => c.type === 'main');
    
    sessionData = {
      id: shareSessionId,
      main_card_id: mainCard?.id || '',
      user_id: req.body.userId || null,
      total_cards: cardIdTypeArr.length,
      attached_cards: cardIdTypeArr.filter(c => c.type === 'promo').map((c, index) => ({
        id: c.id,
        position: c.position || index
      })),
      status: 'processing'
    };
  }

  try {
    let totalDeducted = 0;
    let totalRewarded = 0;
    let pointsResults = [];
    
    // 1. 處理點數交易 (如果需要)
    if (includePointsTransaction) {
      console.log(`[share-transaction] 開始處理分享點數交易，session: ${shareSessionId}`);
      
      // 先檢查所有卡片點數是否足夠
      for (const { id, type } of cardIdTypeArr) {
        if (!id || id === 'test-main-card' || !id.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)) {
          console.log(`跳過無效的卡片ID: ${id}`);
          continue;
        }
        
        const table = type === 'main' ? 'member_cards' : 'promo_cards';
        const pointsField = type === 'main' ? 'user_points' : 'promo_points';
        
        const { data: current, error: getError } = await supabase
          .from(table)
          .select(pointsField)
          .eq('id', id)
          .single();
          
        if (getError) throw getError;
        
        const currentPoints = current?.[pointsField] || 0;
        if (currentPoints < 10) {
          throw new Error(`${type === 'main' ? '主卡' : '附加卡'} ${id} 點數不足 (目前: ${currentPoints}點, 需要: 10點)`);
        }
      }
      
      // 取得回饋設定
      let settingsData = null;
      try {
        const { data: settings, error: settingsError } = await supabase
          .from('points_settings')
          .select('*')
          .order('position_index');
          
        if (settingsError) {
          console.log('取得回饋設定失敗，使用預設值:', settingsError.message);
          settingsData = null;
        } else {
          settingsData = settings || null;
        }
      } catch (error) {
        console.log('回饋設定查詢異常:', error.message);
        settingsData = null;
      }
      
      // 處理每張卡片的點數交易
      for (const { id, type, position } of cardIdTypeArr) {
        if (!id || id === 'test-main-card' || !id.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)) {
          console.log(`跳過無效的卡片ID: ${id}`);
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
          
        if (getError) throw getError;
        
        const currentPoints = current?.[pointsField] || 0;
        
        // 1. 扣除10點
        const deductAmount = -10;
        const afterDeduct = currentPoints + deductAmount;
        
        await supabase.from(table).update({ [pointsField]: afterDeduct }).eq('id', id);
        
        // 記錄扣點交易
        await supabase.from('points_transactions').insert({
          card_id: id,
          card_type: type,
          transaction_type: 'deduct_share',
          amount: deductAmount,
          balance_before: currentPoints,
          balance_after: afterDeduct,
          share_session_id: shareSessionId,
          position_index: position
        });
        
        totalDeducted += 10;
        
        // 2. 計算回饋 (僅主卡獲得回饋，根據所有卡片在5個位置的排列)
        let mainCardTotalReward = 0;
        let currentBalance = afterDeduct;
        
        if (type === 'main') {
          
          // 🎯 新邏輯：根據5個位置(A,B,C,D,E)計算回饋
          // 找出主卡在整體排列中的位置
          const allCards = cardIdTypeArr; // 包含主卡和所有附加卡
          const mainCardPosition = allCards.findIndex(card => card.type === 'main');
          
          console.log(`🎯 回饋計算：總共 ${allCards.length} 張卡，主卡在位置 ${mainCardPosition}`);
          
          // 根據主卡位置計算回饋
          if (mainCardPosition !== -1) {
            const setting = settingsData?.find(s => s.position_index === mainCardPosition);
            const percentage = setting?.reward_percentage || 10.0;
            const reward = 10 * (percentage / 100);
            mainCardTotalReward = reward;
            
            console.log(`主卡位置 ${mainCardPosition}: ${percentage}% = +${reward.toFixed(2)} 點`);
            
            // 記錄主卡回饋交易
            if (reward > 0) {
              await supabase.from('points_transactions').insert({
                card_id: id,
                card_type: type,
                transaction_type: 'reward_share',
                amount: reward,
                balance_before: currentBalance,
                balance_after: currentBalance + reward,
                share_session_id: shareSessionId,
                position_index: mainCardPosition,
                reward_percentage: percentage
              });
              
              currentBalance += reward;
            }
          }
          
          if (mainCardTotalReward > 0) {
            // 更新主卡點數
            await supabase.from(table).update({ [pointsField]: currentBalance }).eq('id', id);
            console.log(`✅ 主卡回饋完成：位置${mainCardPosition} 回饋 ${mainCardTotalReward.toFixed(2)} 點，最終餘額 ${currentBalance} 點`);
          } else {
            console.log(`ℹ️ 主卡無回饋：位置${mainCardPosition} 回饋為0`);
          }
          
          totalRewarded += mainCardTotalReward;
        }
        
        // 修復變數作用域問題
        let cardReward = 0;
        let finalBalance = afterDeduct;
        
        if (type === 'main') {
          cardReward = mainCardTotalReward || 0;
          finalBalance = currentBalance || afterDeduct;
        }
        
        pointsResults.push({
          cardId: id,
          type: type,
          deducted: 10,
          rewarded: cardReward,
          finalBalance: finalBalance
        });
        
        console.log(`[points] ${type} ${id}: -10點 ${type === 'main' && cardReward > 0 ? `+${cardReward.toFixed(2)}點回饋` : ''}`);
      }
    }
    
    // 2. 處理 pageview 更新 (原有邏輯)
    let pageviewError = null;
    for (const { id, type } of cardIdTypeArr) {
      if (!id || id === 'test-main-card' || !id.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)) {
        console.log(`跳過無效的卡片ID: ${id}`);
        continue;
      }
      try {
        let table = type === 'main' ? 'member_cards' : 'promo_cards';
        // 先查詢目前 pageview
        const { data: current, error: getError } = await supabase
          .from(table)
          .select('pageview')
          .eq('id', id)
          .single();
        if (getError) throw getError;
        const newPageview = (current?.pageview || 0) + 1;
        // 更新 pageview
        const { data, error: updateError } = await supabase
          .from(table)
          .update({ pageview: newPageview })
          .eq('id', id)
          .select();
        console.log(`[pageview] id=${id}, type=${type}, old=${current?.pageview || 0}, new=${newPageview}, updatedRows=${data ? data.length : 0}`);
        if (updateError) throw updateError;
        if (!data || data.length === 0) throw new Error('No row updated for id: ' + id);
      } catch (e) {
        pageviewError = e;
        console.error('Update pageview error:', e);
      }
    }
    
    // 3. 完成分享會話記錄
    if (includePointsTransaction && shareSessionId) {
      await supabase.from('share_sessions').insert({
        ...sessionData,
        total_deducted: totalDeducted,
        total_rewarded: totalRewarded,
        net_amount: totalRewarded - totalDeducted,
        status: 'completed'
      });
      
      console.log(`[share-transaction] 完成分享交易，session: ${shareSessionId}, 扣除: ${totalDeducted}, 回饋: ${totalRewarded}, 淨額: ${totalRewarded - totalDeducted}`);
    }
    
    if (pageviewError) {
      return res.status(500).json({ success: false, error: pageviewError.message });
    }
    
    const response = { success: true };
    if (includePointsTransaction) {
      // 計算回饋詳細資訊 (僅主卡有回饋)
      const rewardDetails = [];
      const mainCard = cardIdTypeArr.find(c => c.type === 'main');
      
      if (mainCard) {
        const mainCardPosition = cardIdTypeArr.findIndex(card => card.type === 'main');
        const setting = settingsData?.find(s => s.position_index === mainCardPosition);
        const percentage = setting?.reward_percentage || 10.0;
        const reward = 10 * (percentage / 100);
        
        if (reward > 0) {
          rewardDetails.push({
            position: mainCardPosition,
            percentage: percentage,
            reward: reward,
            cardType: 'main',
            description: `分享卡位置${mainCardPosition + 1}`
          });
        }
      }
      
      response.pointsTransaction = {
        shareSessionId,
        totalDeducted,
        totalRewarded,
        netAmount: totalRewarded - totalDeducted,
        details: pointsResults,
        rewardDetails: rewardDetails // 新增詳細回饋資訊
      };
    }
    
    res.status(200).json(response);
    
  } catch (error) {
    console.error('Share transaction error:', error);
    
    // 如果有分享會話，標記為失敗
    if (includePointsTransaction && shareSessionId) {
      try {
        await supabase.from('share_sessions').insert({
          ...sessionData,
          status: 'failed',
          error_message: error.message
        });
      } catch (e) {
        console.error('Failed to record error session:', e);
      }
    }
    
    return res.status(500).json({ 
      success: false, 
      error: error.message,
      shareSessionId: shareSessionId
    });
  }
} 