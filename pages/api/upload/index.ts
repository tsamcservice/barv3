import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// 添加圖片尺寸檢測功能
function getImageDimensions(buffer: Buffer): Promise<{width: number, height: number}> {
  return new Promise((resolve, reject) => {
    // 檢測 PNG 格式
    if (buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4E && buffer[3] === 0x47) {
      const width = buffer.readUInt32BE(16);
      const height = buffer.readUInt32BE(20);
      resolve({ width, height });
      return;
    }
    
    // 檢測 JPEG 格式
    if (buffer[0] === 0xFF && buffer[1] === 0xD8) {
      let pos = 2;
      while (pos < buffer.length) {
        if (buffer[pos] === 0xFF) {
          const marker = buffer[pos + 1];
          if (marker === 0xC0 || marker === 0xC2) {
            const height = buffer.readUInt16BE(pos + 5);
            const width = buffer.readUInt16BE(pos + 7);
            resolve({ width, height });
            return;
          }
          pos += 2 + buffer.readUInt16BE(pos + 2);
        } else {
          pos++;
        }
      }
    }
    
    // 檢測 GIF 格式
    if (buffer.toString('ascii', 0, 6) === 'GIF87a' || buffer.toString('ascii', 0, 6) === 'GIF89a') {
      const width = buffer.readUInt16LE(6);
      const height = buffer.readUInt16LE(8);
      resolve({ width, height });
      return;
    }
    
    // 無法檢測時返回預設值
    resolve({ width: 0, height: 0 });
  });
}

// 設定檔案大小限制為 800KB (確保在Vercel限制內，考慮base64編碼)
const MAX_FILE_SIZE = 800 * 1024; // 800KB

// 允許的檔案類型
const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/gif'];

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '4mb', // 提升到4MB支援壓縮後的圖片
    },
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const { file, fileName, fileType, userId } = req.body;
    
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
      const fileSizeKB = Math.round(buffer.length / 1024);
      const maxSizeKB = Math.round(MAX_FILE_SIZE / 1024);
      return res.status(400).json({ 
        success: false, 
        error: `檔案大小 ${fileSizeKB}KB 超過限制，請上傳小於 ${maxSizeKB}KB 的圖片。建議先壓縮圖片後再上傳。` 
      });
    }

    // 清理檔名：移除特殊字符和中文，只保留英數字、點和連字符
    const cleanFileName = fileName
      .replace(/[^\w\-_.]/g, '') // 移除特殊字符
      .replace(/[\u4e00-\u9fff]/g, '') // 移除中文字符
      .replace(/\s+/g, '-') // 空格轉連字符
      .replace(/--+/g, '-') // 多個連字符合併
      .toLowerCase(); // 轉小寫
    
    // 生成唯一檔名
    const timestamp = Date.now();
    const fileExtension = cleanFileName.split('.').pop() || 'jpg';
    const uniqueFileName = `${timestamp}-upload.${fileExtension}`;
    
    console.log('原始檔名:', fileName);
    console.log('清理後檔名:', uniqueFileName);

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
        error: `上傳失敗: ${error.message || '請稍後再試'}`,
        details: error
      });
    }

    console.log('檔案上傳成功，取得公開 URL');

    // 取得公開 URL
    const { data: { publicUrl } } = supabase.storage
      .from('member-cards')
      .getPublicUrl(data.path);

    console.log('成功取得公開 URL:', publicUrl);

    // 檢測圖片尺寸
    const dimensions = await getImageDimensions(buffer);
    console.log('檢測到圖片尺寸:', dimensions);

    // 如果有提供 userId，記錄圖片到資料庫
    if (userId) {
      try {
        console.log('開始記錄圖片到資料庫:', { userId, publicUrl, fileName, dimensions });
        
        const { error: dbError } = await supabase
          .from('uploaded_images')
          .insert({
            line_user_id: userId,
            image_url: publicUrl,
            original_filename: fileName,
            file_size: buffer.length,
            file_type: fileType,
            storage_path: data.path,
            image_width: dimensions.width,
            image_height: dimensions.height,
            usage_count: 0,
            is_active: true
          });

        if (dbError) {
          console.error('記錄圖片到資料庫失敗:', dbError);
          // 不影響上傳成功，只是記錄失敗
        } else {
          console.log('✅ 圖片記錄成功寫入資料庫');
        }
      } catch (dbError) {
        console.error('資料庫操作錯誤:', dbError);
        // 不影響上傳成功
      }
    }

    return res.status(200).json({ 
      success: true,
      data: { 
        url: publicUrl,
        fileName: fileName,
        fileSize: buffer.length,
        width: dimensions.width,
        height: dimensions.height,
        recorded: !!userId
      }
    });
  } catch (error) {
    console.error('Upload error:', error);
    return res.status(500).json({ 
      success: false, 
      error: '上傳失敗，請稍後再試' 
    });
  }
} 