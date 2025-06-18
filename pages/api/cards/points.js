import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }
  
  const { cardId, promoPositions } = req.body;
  if (!cardId || !Array.isArray(promoPositions)) {
    return res.status(400).json({ success: false, error: 'Invalid parameters' });
  }

  try {
    let currentPoints = 100.0; // 預設點數
    
    // 1. 取得現有會員卡點數
    if (cardId !== 'temp-card-id') {
      const { data: memberCard, error: getError } = await supabase
        .from('member_cards')
        .select('user_points')
        .eq('id', cardId)
        .single();
      
      if (getError) {
        console.log('查詢會員卡失敗，使用預設點數:', getError.message);
      } else {
        currentPoints = memberCard?.user_points || 100.0;
      }
    } else {
      console.log('使用臨時cardId，採用預設點數:', currentPoints);
    }
    
    // 2. 檢查點數是否足夠 (小於0無法附加)
    if (currentPoints < 0) {
      return res.status(400).json({ 
        success: false, 
        error: '點數不足，無法附加宣傳卡片' 
      });
    }
    
    // 3. 取得回饋比例設定
    const { data: settings, error: settingsError } = await supabase
      .from('points_settings')
      .select('*')
      .order('position_index');
    
    if (settingsError) {
      console.log('取得設定失敗，使用預設比例:', settingsError.message);
    }
    
    // 4. 計算總回饋點數
    let totalReward = 0;
    const rewardDetails = [];
    
    promoPositions.forEach(position => {
      const setting = settings?.find(s => s.position_index === position);
      const percentage = setting?.reward_percentage || 10.0;
      const reward = currentPoints * (percentage / 100);
      totalReward += reward;
      
      rewardDetails.push({
        position: position,
        percentage: percentage,
        reward: reward
      });
      
      console.log(`位置 ${position}: ${percentage}% = +${reward.toFixed(2)} 點`);
    });
    
    // 5. 更新會員卡點數
    const newPoints = currentPoints + totalReward;
    
    if (cardId !== 'temp-card-id') {
      const { data, error: updateError } = await supabase
        .from('member_cards')
        .update({ user_points: newPoints })
        .eq('id', cardId)
        .select();
      
      if (updateError) {
        console.log('更新點數失敗，但仍返回計算結果:', updateError.message);
      }
    } else {
      console.log('臨時cardId，跳過資料庫更新，僅返回計算結果');
    }
    
    console.log(`[points] cardId=${cardId}, old=${currentPoints}, reward=${totalReward}, new=${newPoints}`);
    
    res.status(200).json({
      success: true,
      oldPoints: currentPoints,
      reward: totalReward,
      newPoints: newPoints,
      rewardDetails: rewardDetails
    });
    
  } catch (error) {
    console.error('Points API error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
} 