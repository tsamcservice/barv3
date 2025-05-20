import { createClient } from '@supabase/supabase-js';

// 初始化 Supabase 客戶端
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

  if (req.method === 'GET') {
    try {
      const { pageId, userId } = req.query;
      let query = supabase.from('member_cards').select('*');
      
      if (pageId) {
        query = query.eq('page_id', pageId);
      }
      if (userId) {
        query = query.eq('line_user_id', userId);
      }
      
      const { data, error } = await query;
      
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
  } else if (req.method === 'POST') {
    try {
      const { page_id, line_user_id, flex_json, card_alt_title, ...cardData } = req.body;
      if (!page_id || !line_user_id) {
        return res.status(400).json({
          success: false,
          message: '缺少必要參數：page_id 或 line_user_id'
        });
      }
      // 查詢或建立 user
      let user_id = null;
      let userRes = await supabase.from('users').select('id').eq('line_user_id', line_user_id).single();
      if (!userRes.data) {
        // 建立新 user
        const newUser = await supabase.from('users').insert({ line_user_id }).select('id').single();
        user_id = newUser.data?.id || null;
      } else {
        user_id = userRes.data.id;
      }
      // upsert member_cards
      const { data, error } = await supabase
        .from('member_cards')
        .upsert({
          page_id,
          line_user_id,
          user_id,
          card_alt_title,
          flex_json,
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
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).json({
      success: false,
      message: `不支援的請求方法: ${req.method}`
    });
  }
} 