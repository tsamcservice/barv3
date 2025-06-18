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
      
      if (!Array.isArray(updates)) {
        return res.status(400).json({ success: false, error: 'Invalid data format' });
      }
      
      for (const update of updates) {
        if (typeof update.position_index !== 'number' || typeof update.reward_percentage !== 'number') {
          return res.status(400).json({ success: false, error: 'Invalid update format' });
        }
        
        const { error } = await supabase
          .from('points_settings')
          .upsert({
            position_index: update.position_index,
            reward_percentage: update.reward_percentage,
            updated_at: new Date().toISOString()
          });
        
        if (error) throw error;
      }
      
      res.status(200).json({ success: true, message: 'Settings updated successfully' });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
    
  } else {
    res.status(405).json({ success: false, error: 'Method not allowed' });
  }
} 