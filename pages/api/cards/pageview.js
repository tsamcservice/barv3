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
    
    // 取得回饋設定 (提前到外層，確保作用域)
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
      
      // 回饋設定已在外層取得，這裡不需要重複查詢
      
      // 處理每張卡片的點數交易
      for (let i = 0; i < cardIdTypeArr.length; i++) {
        const { id, type, position = i } = cardIdTypeArr[i]; // 如果沒有position，使用索引
        // 🔧 修復：支援臨時主卡ID
        const isTempMainCard = id && id.startsWith('temp-main-card-');
        const isValidUUID = id && id.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i);
        
        if (!id || id === 'test-main-card') {
          console.log(`跳過無效的卡片ID: ${id}`);
          continue;
        }
        
        if (!isValidUUID && !isTempMainCard) {
          console.log(`跳過無效的卡片ID格式: ${id}`);
          continue;
        }
        
        // 🔧 臨時主卡特殊處理 - 修正：使用動態初始點數
        if (isTempMainCard && type === 'main') {
          console.log(`使用臨時主卡ID，查詢動態初始點數設定`);
          
          // 🔧 修正：從points_config讀取動態初始點數
          let tempCurrentPoints = 168; // fallback
          try {
            const { data: configData } = await supabase
              .from('points_config')
              .select('config_value')
              .eq('config_key', 'initial_points_M01001')
              .single();
            
            if (configData) {
              tempCurrentPoints = configData.config_value;
              console.log(`✅ 讀取到動態初始點數: ${tempCurrentPoints}`);
            } else {
              console.log(`⚠️ 未找到初始點數設定，使用fallback: ${tempCurrentPoints}`);
            }
          } catch (configError) {
            console.log(`⚠️ 讀取初始點數設定失敗，使用fallback: ${tempCurrentPoints}`, configError);
          }
          const afterDeduct = tempCurrentPoints - 10;
          
          // 記錄臨時主卡扣點交易（不更新資料庫）
          await supabase.from('points_transactions').insert({
            card_id: id,
            card_type: type,
            transaction_type: 'deduct_share',
            amount: -10,
            balance_before: tempCurrentPoints,
            balance_after: afterDeduct,
            share_session_id: shareSessionId,
            position_index: position
          });
          
          totalDeducted += 10;
          
          // 🔧 計算臨時主卡回饋（所有位置回饋都給主卡）
          let totalTempMainCardReward = 0;
          let tempCurrentBalance = afterDeduct;
          
          // 為每個位置計算回饋，但都給臨時主卡
          for (let pos = 0; pos < cardIdTypeArr.length; pos++) {
            const setting = settingsData?.find(s => s.position_index === pos);
            const percentage = setting?.reward_percentage || 10.0;
            const positionReward = 10 * (percentage / 100);
            totalTempMainCardReward += positionReward;
            
            console.log(`臨時主卡位置 ${pos}: ${percentage}% = +${positionReward.toFixed(2)} 點`);
            
            if (positionReward > 0) {
              // 記錄臨時主卡回饋交易（不更新資料庫）
              try {
                const { data: tempRewardTransaction, error: tempRewardError } = await supabase.from('points_transactions').insert({
                  card_id: id,
                  card_type: type,
                  transaction_type: 'reward_share',
                  amount: positionReward,
                  balance_before: tempCurrentBalance,
                  balance_after: tempCurrentBalance + positionReward,
                  share_session_id: shareSessionId,
                  position_index: pos,
                  reward_percentage: percentage
                });
                
                if (tempRewardError) {
                  console.error(`❌ 臨時主卡回饋交易記錄失敗 (位置${pos}):`, tempRewardError);
                } else {
                  console.log(`✅ 臨時主卡回饋交易記錄成功 (位置${pos}): +${positionReward}點`);
                }
                
                tempCurrentBalance += positionReward;
              } catch (insertError) {
                console.error(`❌ 臨時主卡回饋交易插入異常 (位置${pos}):`, insertError);
                tempCurrentBalance += positionReward; // 仍然更新餘額，避免計算錯誤
              }
            }
          }
          
          totalRewarded += totalTempMainCardReward;
          
          console.log(`臨時主卡，跳過資料庫更新，僅返回計算結果`);
          console.log(`[points] cardId=${id}, old=${tempCurrentPoints}, reward=${totalTempMainCardReward}, new=${afterDeduct + totalTempMainCardReward}`);
          
          pointsResults.push({
            cardId: id,
            type: type,
            deducted: 10,
            rewarded: totalTempMainCardReward,
            finalBalance: afterDeduct + totalTempMainCardReward,
            isTemp: true
          });
          
          continue; // 跳過正常的資料庫處理流程
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
          if (getError.code === 'PGRST116') {
            throw new Error(`${type === 'main' ? '分享卡' : '活動卡'}不存在: ${id}`);
          } else {
            throw new Error(`查詢${type === 'main' ? '分享卡' : '活動卡'}點數失敗: ${getError.message}`);
          }
        }
        
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
        
        // 2. 計算回饋 (🔧 修正邏輯：所有位置的回饋都給分享卡)
        let cardReward = 0;
        let currentBalance = afterDeduct;
        
        // 🎯 修正邏輯：只有分享卡獲得回饋，但回饋基於所有位置計算
        if (type === 'main') {
          // 找出主卡並計算所有位置的總回饋
          let totalMainCardReward = 0;
          
          // 為每個位置計算回饋，但都給主卡
          for (let pos = 0; pos < cardIdTypeArr.length; pos++) {
            const setting = settingsData?.find(s => s.position_index === pos);
            const percentage = setting?.reward_percentage || 10.0;
            const positionReward = 10 * (percentage / 100);
            totalMainCardReward += positionReward;
            
            console.log(`位置 ${pos}: ${percentage}% = +${positionReward.toFixed(2)} 點 (給分享卡)`);
            
            // 記錄每個位置的回饋交易（都記錄到主卡）
            if (positionReward > 0) {
              try {
                const { data: rewardTransaction, error: rewardError } = await supabase.from('points_transactions').insert({
                  card_id: id,
                  card_type: type,
                  transaction_type: 'reward_share',
                  amount: positionReward,
                  balance_before: currentBalance,
                  balance_after: currentBalance + positionReward,
                  share_session_id: shareSessionId,
                  position_index: pos,
                  reward_percentage: percentage
                });
                
                if (rewardError) {
                  console.error(`❌ 回饋交易記錄失敗 (位置${pos}):`, rewardError);
                } else {
                  console.log(`✅ 回饋交易記錄成功 (位置${pos}): +${positionReward}點`);
                }
                
                currentBalance += positionReward;
              } catch (insertError) {
                console.error(`❌ 回饋交易插入異常 (位置${pos}):`, insertError);
                currentBalance += positionReward; // 仍然更新餘額，避免計算錯誤
              }
            }
          }
          
          cardReward = totalMainCardReward;
          
          if (cardReward > 0) {
            // 更新分享卡點數
            await supabase.from(table).update({ [pointsField]: currentBalance }).eq('id', id);
            console.log(`✅ 分享卡回饋完成：總回饋 ${cardReward.toFixed(2)} 點，最終餘額 ${currentBalance} 點`);
          }
        } else {
          // 活動卡不獲得回饋
          console.log(`ℹ️ 活動卡不獲得回饋：位置${position}`);
        }
        
        totalRewarded += cardReward;
        
        // 修復變數作用域問題
        let finalBalance = currentBalance || afterDeduct;
        
        pointsResults.push({
          cardId: id,
          type: type,
          deducted: 10,
          rewarded: cardReward,
          finalBalance: finalBalance
        });
        
        console.log(`[points] ${type} ${id}: -10點 ${type === 'main' && cardReward > 0 ? `+${cardReward.toFixed(2)}點回饋` : ''}`);
      } // 結束 for 迴圈
    }
    
    // 2. 處理 pageview 更新 (原有邏輯)
    let pageviewError = null;
    for (const { id, type } of cardIdTypeArr) {
      // 🔧 修復：支援臨時主卡ID
      const isTempMainCard = id && id.startsWith('temp-main-card-');
      const isValidUUID = id && id.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i);
      
      if (!id || id === 'test-main-card') {
        console.log(`跳過無效的卡片ID: ${id}`);
        continue;
      }
      
      if (!isValidUUID && !isTempMainCard) {
        console.log(`跳過無效的卡片ID格式: ${id}`);
        continue;
      }
      
      // 🔧 臨時主卡跳過pageview更新
      if (isTempMainCard && type === 'main') {
        console.log(`臨時主卡跳過pageview更新: ${id}`);
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
        if (getError) {
          console.error(`查詢${type === 'main' ? '分享卡' : '活動卡'}瀏覽次數失敗:`, getError);
          if (getError.code === 'PGRST116') {
            throw new Error(`${type === 'main' ? '分享卡' : '活動卡'}不存在: ${id}`);
          } else {
            throw new Error(`查詢${type === 'main' ? '分享卡' : '活動卡'}瀏覽次數失敗: ${getError.message}`);
          }
        }
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
      // 🔧 修復：計算所有位置的回饋詳細資訊（所有回饋都給分享卡）
      const rewardDetails = [];
      const mainCard = cardIdTypeArr.find(c => c.type === 'main');
      
      // 🎯 修正邏輯：為每個位置生成回饋詳情，但所有回饋都給分享卡
      for (let i = 0; i < cardIdTypeArr.length; i++) {
        const card = cardIdTypeArr[i];
        const setting = settingsData?.find(s => s.position_index === i);
        const percentage = setting?.reward_percentage || 10.0;
        const positionReward = 10 * (percentage / 100);
        
        rewardDetails.push({
          position: i,
          percentage: percentage,
          reward: positionReward,
          cardType: card.type,
          description: `位置${i + 1}${card.type === 'main' ? '(分享卡)' : '(活動卡)'}`,
          isMainCard: card.type === 'main',
          rewardTo: 'main', // 標記回饋給分享卡
          note: card.type === 'main' ? '獲得回饋' : '回饋給分享卡'
        });
      }
      
      console.log('📊 回饋詳情生成完成:', rewardDetails.map(r => `位置${r.position}: ${r.cardType} ${r.reward}點 (${r.note})`));
      
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