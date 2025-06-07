export default function handler(req, res) {
  console.log('🧪 簡單測試API被調用');
  
  try {
    // 基本環境檢查
    const env_check = {
      SUPABASE_URL: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      ANON_KEY: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      SERVICE_ROLE_KEY: !!process.env.SUPABASE_SERVICE_ROLE_KEY
    };
    
    console.log('🧪 環境變數檢查:', env_check);
    
    // 返回基本信息
    res.status(200).json({
      success: true,
      message: '簡單測試成功',
      environment: env_check,
      timestamp: new Date().toISOString(),
      method: req.method,
      query: req.query
    });
    
  } catch (error) {
    console.error('🧪 簡單測試錯誤:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      stack: error.stack
    });
  }
} 