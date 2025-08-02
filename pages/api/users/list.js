import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ 
      success: false, 
      error: 'Method not allowed' 
    });
  }

  try {
    const { pageId } = req.query;
    
    if (!pageId) {
      return res.status(400).json({ 
        success: false, 
        error: '請提供頁面ID' 
      });
    }
    
    // 🔧 查詢指定頁面的所有用戶
    const { data, error } = await supabase
      .from('member_cards')
      .select('line_user_id, display_name, user_points, updated_at')
      .eq('page_id', pageId)
      .not('line_user_id', 'is', null) // 排除沒有用戶ID的記錄
      .order('updated_at', { ascending: false }); // 按更新時間排序
    
    if (error) {
      console.error('查詢用戶清單失敗:', error);
      throw error;
    }
    
    if (!data || data.length === 0) {
      return res.status(200).json({ 
        success: true, 
        data: [],
        message: `頁面 ${pageId} 目前沒有用戶資料`
      });
    }
    
    // 🔧 格式化用戶資料
    const userList = data.map(user => ({
      userId: user.line_user_id,
      displayName: user.display_name || '未設定名稱',
      points: user.user_points || 0,
      updatedAt: user.updated_at
    }));
    
    console.log(`✅ 成功讀取 ${pageId} 的 ${userList.length} 位用戶`);
    
    res.status(200).json({ 
      success: true, 
      data: userList,
      message: `成功讀取 ${userList.length} 位用戶`
    });
    
  } catch (error) {
    console.error('API錯誤:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
} 