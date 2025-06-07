import { createClient } from '@supabase/supabase-js';

// 嘗試使用ANON_KEY而不是SERVICE_ROLE_KEY
const supabaseAnon = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// 同時準備SERVICE_ROLE_KEY版本
const supabaseService = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  console.log('🧪 測試API被調用');
  console.log('🧪 環境變數檢查:');
  console.log('  - SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? '已設定' : '❌ 未設定');
  console.log('  - ANON_KEY:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '已設定' : '❌ 未設定');
  console.log('  - SERVICE_ROLE_KEY:', process.env.SUPABASE_SERVICE_ROLE_KEY ? '已設定' : '❌ 未設定');
  
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: '僅支援GET方法' });
  }

  const { userId } = req.query;
  console.log('🧪 測試用戶ID:', userId);
  
  if (!userId) {
    return res.status(400).json({ success: false, message: '缺少userId參數' });
  }

  const results = {
    userId: userId,
    tests: []
  };

  // 測試1：檢查表格是否存在（使用SERVICE_ROLE_KEY）
  try {
    console.log('🧪 測試1: 檢查表格是否存在...');
    const { data: tableTest, error: tableError } = await supabaseService
      .from('uploaded_images')
      .select('count')
      .limit(1);
      
    results.tests.push({
      name: '表格存在檢查',
      success: !tableError,
      data: tableTest,
      error: tableError ? tableError.message : null
    });
    
    console.log('🧪 表格檢查結果:', { tableTest, tableError });
  } catch (error) {
    results.tests.push({
      name: '表格存在檢查',
      success: false,
      error: error.message
    });
    console.log('🧪 表格檢查異常:', error);
  }

  // 測試2：嘗試查詢用戶資料（使用SERVICE_ROLE_KEY）
  try {
    console.log('🧪 測試2: 查詢用戶資料 (SERVICE_ROLE_KEY)...');
    const { data: serviceData, error: serviceError } = await supabaseService
      .from('uploaded_images')
      .select('*')
      .eq('line_user_id', userId);
      
    results.tests.push({
      name: '查詢資料 (SERVICE_ROLE_KEY)',
      success: !serviceError,
      count: serviceData ? serviceData.length : 0,
      data: serviceData,
      error: serviceError ? serviceError.message : null
    });
    
    console.log('🧪 SERVICE_ROLE_KEY查詢結果:', { serviceData, serviceError });
  } catch (error) {
    results.tests.push({
      name: '查詢資料 (SERVICE_ROLE_KEY)',
      success: false,
      error: error.message
    });
    console.log('🧪 SERVICE_ROLE_KEY查詢異常:', error);
  }

  // 測試3：嘗試查詢用戶資料（使用ANON_KEY）
  try {
    console.log('🧪 測試3: 查詢用戶資料 (ANON_KEY)...');
    const { data: anonData, error: anonError } = await supabaseAnon
      .from('uploaded_images')
      .select('*')
      .eq('line_user_id', userId);
      
    results.tests.push({
      name: '查詢資料 (ANON_KEY)',
      success: !anonError,
      count: anonData ? anonData.length : 0,
      data: anonData,
      error: anonError ? anonError.message : null
    });
    
    console.log('🧪 ANON_KEY查詢結果:', { anonData, anonError });
  } catch (error) {
    results.tests.push({
      name: '查詢資料 (ANON_KEY)',
      success: false,
      error: error.message
    });
    console.log('🧪 ANON_KEY查詢異常:', error);
  }

  // 返回所有測試結果
  console.log('🧪 所有測試完成，返回結果');
  res.status(200).json({
    success: true,
    message: '診斷測試完成',
    results: results
  });
} 