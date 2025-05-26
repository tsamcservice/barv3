import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }
  const { cardIdTypeArr } = req.body;
  if (!Array.isArray(cardIdTypeArr) || cardIdTypeArr.length === 0) {
    return res.status(400).json({ success: false, error: 'No cardIdTypeArr provided' });
  }
  let error = null;
  for (const { id, type } of cardIdTypeArr) {
    if (!id) continue;
    try {
      if (type === 'main') {
        const { error: updateError } = await supabase
          .from('member_cards')
          .update({ pageview: supabase.raw('COALESCE(pageview, 0) + 1') })
          .eq('id', id);
        if (updateError) throw updateError;
      } else {
        const { error: updateError } = await supabase
          .from('promo_cards')
          .update({ pageview: supabase.raw('COALESCE(pageview, 0) + 1') })
          .eq('id', id);
        if (updateError) throw updateError;
      }
    } catch (e) {
      error = e;
      console.error('Update pageview error:', e);
    }
  }
  if (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
  res.status(200).json({ success: true });
} 