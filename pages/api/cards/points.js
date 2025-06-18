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
    // 1. 取得現有會員卡點數
    const { data: memberCard, error: getError } = await supabase
      .from('member_cards')
      .select('user_points')
      .eq('id', cardId)
      .single();
    
    if (getError) throw getError;
    
    const currentPoints = memberCard?.user_points || 0;
    
    // 2. 檢查點數是否足夠 (小於0無法附加)
    if (currentPoints < 0) {
      return res.status(400).json({ 
        success: false, 
        error: '點數不足，無法附加宣傳卡片',
        currentPoints 
      });
    }
    
    // 3. 取得回饋設定
    const { data: settings, error: settingsError } = await supabase
      .from('points_settings')
      .select('*')
      .order('position_index');
    
    if (settingsError) throw settingsError;
    
    // 4. 計算總回饋點數
    let totalReward = 0;
    promoPositions.forEach(position => {
      const setting = settings.find(s => s.position_index === position);
      if (setting) {
        const baseValue = 10; // 每張宣傳卡片基礎價值10點
        const reward = (baseValue * setting.reward_percentage) / 100;
        totalReward += reward;
      }
    });
    
    // 5. 更新會員卡點數
    const newPoints = currentPoints + totalReward;
    const { data, error: updateError } = await supabase
      .from('member_cards')
      .update({ user_points: newPoints })
      .eq('id', cardId)
      .select();
    
    if (updateError) throw updateError;
    
    console.log(`[points] cardId=${cardId}, old=${currentPoints}, reward=${totalReward}, new=${newPoints}`);
    
    res.status(200).json({ 
      success: true, 
      oldPoints: currentPoints,
      reward: totalReward,
      newPoints: newPoints
    });
    
  } catch (error) {
    console.error('Update points error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
} 