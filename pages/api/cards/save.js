import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req, res) {
  // 設定 CORS 標頭
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  // 處理 OPTIONS 請求
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'POST') {
    try {
      const { page_id, line_user_id, ...cardData } = req.body;
      
      if (!page_id || !line_user_id) {
        return res.status(400).json({
          success: false,
          message: '缺少必要參數：page_id 或 line_user_id'
        });
      }

      const { data, error } = await supabase
        .from('member_cards')
        .upsert({
          page_id,
          line_user_id,
          ...cardData,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'page_id,line_user_id'
        });
      
      if (error) throw error;
      
      res.status(200).json({
        success: true,
        data
      });
    } catch (error) {
      console.error('API Error:', error);
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).json({
      success: false,
      message: `不支援的請求方法: ${req.method}`
    });
  }
} 