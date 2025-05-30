import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// 設定檔案大小限制為 5MB
const MAX_FILE_SIZE = 5 * 1024 * 1024;

// 允許的檔案類型
const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/gif'];

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const { file, fileName, fileType } = req.body;
    
    if (!file || !fileName || !fileType) {
      return res.status(400).json({ 
        success: false, 
        error: '缺少必要參數' 
      });
    }

    // 驗證檔案類型
    if (!ALLOWED_FILE_TYPES.includes(fileType)) {
      return res.status(400).json({ 
        success: false, 
        error: '不支援的檔案類型，請上傳 JPG、PNG 或 GIF 圖片' 
      });
    }

    // 移除 base64 前綴並計算檔案大小
    const base64Data = file.replace(/^data:image\/\w+;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');

    // 驗證檔案大小
    if (buffer.length > MAX_FILE_SIZE) {
      return res.status(400).json({ 
        success: false, 
        error: '檔案大小超過限制，請上傳小於 5MB 的圖片' 
      });
    }

    // 生成唯一檔名
    const timestamp = Date.now();
    const uniqueFileName = `${timestamp}-${fileName}`;

    console.log('開始上傳檔案到 Supabase Storage:', uniqueFileName);

    // 上傳到 Supabase Storage
    const { data, error } = await supabase.storage
      .from('member-cards')
      .upload(uniqueFileName, buffer, {
        contentType: fileType,
        upsert: false
      });

    if (error) {
      console.error('Supabase upload error:', error);
      return res.status(500).json({ 
        success: false, 
        error: '上傳失敗，請稍後再試' 
      });
    }

    console.log('檔案上傳成功，取得公開 URL');

    // 取得公開 URL
    const { data: { publicUrl } } = supabase.storage
      .from('member-cards')
      .getPublicUrl(data.path);

    console.log('成功取得公開 URL:', publicUrl);

    return res.status(200).json({ 
      success: true,
      data: { url: publicUrl }
    });
  } catch (error) {
    console.error('Upload error:', error);
    return res.status(500).json({ 
      success: false, 
      error: '上傳失敗，請稍後再試' 
    });
  }
} 