import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }
  const { data, error } = await supabase
    .from('promo_cards')
    .select('*')
    .order('id', { ascending: true });
  if (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
  res.status(200).json({ success: true, data });
} 