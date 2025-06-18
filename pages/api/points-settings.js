import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

export default async function handler(req, res) {
  if (req.method === 'GET') {
    // 取得設定
    try {
      const { data, error } = await supabase
        .from('points_settings')
        .select('*')
        .order('position_index');
      
      if (error) throw error;
      
      res.status(200).json({ success: true, data });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
    
  } else if (req.method === 'POST') {
    // 更新設定
    try {
      const updates = req.body;
      
      for (const update of updates) {
        const { error } = await supabase
          .from('points_settings')
          .upsert({
            position_index: update.position_index,
            reward_percentage: update.reward_percentage,
            updated_at: new Date()
          });
        
        if (error) throw error;
      }
      
      res.status(200).json({ success: true });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
    
  } else {
    res.status(405).json({ success: false, error: 'Method not allowed' });
  }
} 