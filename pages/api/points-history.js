import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const { cardId, limit = 20, offset = 0, sessionId } = req.query;

    // 查詢點數交易歷史
    let query = supabase
      .from('points_transactions')
      .select(`
        *
      `)
      .order('created_at', { ascending: false });

    // 依據查詢條件過濾
    if (cardId) {
      query = query.eq('card_id', cardId);
    }

    if (sessionId) {
      query = query.eq('share_session_id', sessionId);
    }

    // 分頁
    if (limit) {
      query = query.limit(parseInt(limit));
    }
    if (offset) {
      query = query.range(parseInt(offset), parseInt(offset) + parseInt(limit) - 1);
    }

    const { data: transactions, error } = await query;

    if (error) {
      throw error;
    }

    // 取得對應的分享會話資訊
    let sessionsData = {};
    if (transactions && transactions.length > 0) {
      const sessionIds = [...new Set(transactions.map(t => t.share_session_id))];
      const { data: sessions } = await supabase
        .from('share_sessions')
        .select('*')
        .in('id', sessionIds);
      
      if (sessions) {
        sessions.forEach(session => {
          sessionsData[session.id] = session;
        });
      }
    }

    // 合併交易和會話資料
    const enrichedTransactions = transactions.map(transaction => ({
      ...transaction,
      share_session: sessionsData[transaction.share_session_id] || null
    }));

    // 如果指定了cardId，也取得卡片基本資訊
    let cardInfo = null;
    if (cardId) {
      // 嘗試從會員卡表查詢
      const { data: memberCard } = await supabase
        .from('member_cards')
        .select('id, card_name, user_points')
        .eq('id', cardId)
        .single();

      if (memberCard) {
        cardInfo = { ...memberCard, type: 'main' };
      } else {
        // 嘗試從宣傳卡表查詢
        const { data: promoCard } = await supabase
          .from('promo_cards')
          .select('id, card_name, promo_points')
          .eq('id', cardId)
          .single();

        if (promoCard) {
          cardInfo = { 
            ...promoCard, 
            type: 'promo',
            user_points: promoCard.promo_points 
          };
        }
      }
    }

    // 統計資訊
    const stats = {
      totalTransactions: enrichedTransactions.length,
      totalDeducted: enrichedTransactions
        .filter(t => t.transaction_type === 'deduct_share')
        .reduce((sum, t) => sum + Math.abs(t.amount), 0),
      totalRewarded: enrichedTransactions
        .filter(t => t.transaction_type === 'reward_share')
        .reduce((sum, t) => sum + t.amount, 0)
    };

    res.status(200).json({
      success: true,
      data: {
        transactions: enrichedTransactions,
        cardInfo,
        stats,
        pagination: {
          limit: parseInt(limit),
          offset: parseInt(offset),
          hasMore: transactions.length === parseInt(limit)
        }
      }
    });

  } catch (error) {
    console.error('Points history error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
} 