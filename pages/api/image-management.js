import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY // 使用ANON_KEY而不是SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  console.log('🔍 image-management API 被調用');
  console.log('🔍 請求方法:', req.method);
  console.log('🔍 請求內容:', req.body);

  // 檢查請求方法
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      success: false, 
      message: `方法 ${req.method} 不被允許，請使用 POST` 
    });
  }

  try {
    const { userId, action, imageUrl } = req.body;

    if (!userId || !action) {
      return res.status(400).json({ 
        success: false, 
        message: '缺少必要參數: userId, action' 
      });
    }

    if (action === 'delete') {
      if (!imageUrl) {
        return res.status(400).json({ 
          success: false, 
          message: '刪除操作需要imageUrl參數' 
        });
      }

      console.log('🔍 準備刪除圖片:', imageUrl);

      // 1. 查詢所有會員卡記錄，然後在代碼中篩選
      console.log('🔍 查詢所有會員卡記錄...');
      
      const { data: allCards, error: fetchError } = await supabase
        .from('member_cards')
        .select('*');
      
      if (fetchError) {
        console.error('❌ 查詢會員卡失敗:', fetchError);
        return res.status(500).json({ 
          success: false, 
          message: '查詢會員卡失敗: ' + fetchError.message 
        });
      }
      
      // 2. 篩選包含此圖片URL的記錄
      const imageFields = ['main_image_url', 'snow_image_url', 'calendar_image_url', 'love_icon_url', 'member_image_url'];
      const memberCards = allCards.filter(card => 
        imageFields.some(field => card[field] === imageUrl)
      );
      
      console.log('🔍 找到包含此圖片的卡片數量:', memberCards.length);

      // 3. 更新所有包含此圖片URL的記錄
      const updates = [];
      memberCards.forEach(card => {
        const updatedCard = { ...card };
        let hasChanges = false;

        ['main_image_url', 'snow_image_url', 'calendar_image_url', 'love_icon_url', 'member_image_url'].forEach(field => {
          if (updatedCard[field] === imageUrl) {
            updatedCard[field] = null;
            hasChanges = true;
          }
        });

        if (hasChanges) {
          updates.push(updatedCard);
        }
      });

      console.log('🔍 需要更新的卡片數量:', updates.length);

      // 3. 批次更新資料庫
      if (updates.length > 0) {
        for (const update of updates) {
          const { error: updateError } = await supabase
            .from('member_cards')
            .update({
              main_image_url: update.main_image_url,
              snow_image_url: update.snow_image_url,
              calendar_image_url: update.calendar_image_url,
              love_icon_url: update.love_icon_url,
              member_image_url: update.member_image_url
            })
            .eq('id', update.id);

          if (updateError) {
            console.error('❌ 更新卡片失敗:', updateError);
          }
        }
      }
      
      // 4. 同時從uploaded_images表中標記圖片為非活躍狀態
      console.log('🔍 更新uploaded_images表...');
      const { data: uploadedImagesUpdate, error: uploadedImagesError } = await supabase
        .from('uploaded_images')
        .update({ is_active: false })
        .eq('image_url', imageUrl);
      
      if (uploadedImagesError) {
        console.error('❌ 更新uploaded_images失敗:', uploadedImagesError);
      } else {
        console.log('✅ uploaded_images更新成功:', uploadedImagesUpdate);
      }

      // 4. 嘗試從Storage中刪除檔案（如果是我們的域名）
      if (imageUrl.includes('supabase.co') && imageUrl.includes('member-cards')) {
        try {
          const pathMatch = imageUrl.match(/member-cards\/(.+)$/);
          if (pathMatch && pathMatch[1]) {
            const filePath = pathMatch[1];
            console.log('🔍 嘗試從Storage刪除:', filePath);
            
            const { error: deleteError } = await supabase.storage
              .from('member-cards')
              .remove([filePath]);

            if (deleteError) {
              console.log('⚠️ Storage刪除失敗:', deleteError);
              // 不阻斷流程，因為資料庫已經清理
            } else {
              console.log('✅ Storage刪除成功');
            }
          }
        } catch (storageError) {
          console.log('⚠️ Storage操作異常:', storageError);
        }
      }

      // 計算總影響記錄數
      const totalUpdated = updates.length + (uploadedImagesUpdate ? 1 : 0);
      
      return res.status(200).json({
        success: true,
        message: '圖片已從系統中移除',
        updatedRecords: totalUpdated,
        memberCardsUpdated: updates.length,
        uploadedImagesUpdated: uploadedImagesUpdate ? 1 : 0
      });

    } else if (action === 'list') {
      // 列出用戶的圖片（重複現有的uploaded-images邏輯）
      return res.status(200).json({
        success: true,
        message: '請使用 /api/uploaded-images 來列出圖片'
      });
    }

    return res.status(400).json({
      success: false,
      message: '不支援的操作: ' + action
    });

  } catch (error) {
    console.error('❌ API錯誤:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message || '伺服器內部錯誤' 
    });
  }
} 