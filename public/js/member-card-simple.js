// 版本標記函數
function createVersionTag() {
  return 'v20250531-O';
}

// 會員卡初始資料
const defaultCard = {
  main_image_url: 'https://barv3.vercel.app/uploads/vip/TS-B1.png',
  snow_image_url: 'https://barv3.vercel.app/uploads/vip/APNG1.png',
  main_image_link: 'https://secure.smore.com/n/td1qc',
  calendar_image_url: 'https://barv3.vercel.app/uploads/vip/icon_calendar.png',
  calendar_image_link: 'https://lihi3.cc/ZWV2u',
  amember_id: 'TSAMC',
  love_icon_url: 'https://barv3.vercel.app/uploads/vip/loveicon.png',
  love_icon_link: 'https://lihi.cc/jl7Pw',
  pageview: '0000',
  main_title_1: '我在呈璽',
  main_title_1_color: '#000000',
  main_title_2: '我在呈璽，欣賞美好幸福！我在呈璽，喝茶喝咖啡很悠閒！！我不在呈璽，就是在前往呈璽的路上！！！',
  main_title_2_color: '#000000',
  member_image_url: 'https://barv3.vercel.app/uploads/vip/TS-LOGO.png',
  member_image_link: 'https://secure.smore.com/n/td1qc',
  display_name: '呈璽',
  name_color1: '#A4924C', // 名字顏色 
  button_1_text: '加呈璽好友',
  button_1_url: 'https://lin.ee/JLLIBlP',
  button_1_color: '#A4924A', // 按鈕顏色 
  s_button_text: '分享給好友',
  s_button_url: 'https://liff.line.me/2007327814-BdWpj70m?pageId=M01001', // 初始值為 LIFF+頁面ID
  s_button_color: '#A4924B',
  card_alt_title: '我在呈璽/呈璽'
};

// 取得 LINE 頭像與名字
let liffProfile = { displayName: '', pictureUrl: '', userId: '' };
const liffId = '2007327814-BdWpj70m';

// LIFF 初始化與登入
async function initLiffAndLogin() {
  if (!window.liff) return;
  await liff.init({ liffId });
  if (!liff.isLoggedIn()) {
    liff.login();
    return false;
  }
  return true;
}

// 於右上角顯示LINE頭像、姓名與綠色LINE圖示
function renderLiffUserInfo(profile) {
  const el = document.getElementById('liffUserInfo');
  if (!el) return;
  if (!profile) { el.innerHTML = ''; return; }
  el.innerHTML = `
    <img src="${profile.pictureUrl}" style="width:36px;height:36px;border-radius:50%;vertical-align:middle;">
    <span style="font-weight:bold;">${profile.displayName}</span>
    <img src="https://scdn.line-apps.com/n/channel_devcenter/img/fx/01_1_cafe.png" style="width:24px;height:24px;vertical-align:middle;background:#06C755;border-radius:6px;box-shadow:0 1px 4px #0002;">
  `;
}

// 解析網址參數
function getQueryParam(name) {
  const url = new URL(window.location.href);
  return url.searchParams.get(name);
}

// 移除 input[data-default] 灰色樣式，強制黑色
const style = document.createElement('style');
style.innerHTML = `
  input { color: #222 !important; }
`;
document.head.appendChild(style);

function setInputDefaultStyle(input, defaultValue) {
  if (input.id === 'pageview') {
    input.value = formatPageview(defaultValue);
  } else {
    input.value = defaultValue;
  }
  input.setAttribute('data-default', defaultValue);
  function updateValue() {
    if (input.value === '') {
      input.value = input.getAttribute('data-default');
    }
  }
  input.addEventListener('input', updateValue);
  input.addEventListener('blur', updateValue);
}

// 工具函數：設置圖片預設樣式
function setImageDefaultStyle(img, defaultUrl) {
  img.src = defaultUrl;
  img.style.border = '2px solid #bbb';
  img.style.display = 'block';
}
function setImageUserStyle(img, url) {
  // 🔧 重要修復：先設定樣式，再設定圖片URL
  img.style.display = 'block';
  img.style.maxWidth = '200px';
  img.style.maxHeight = '200px';
  img.style.borderRadius = '4px';
  img.style.objectFit = 'cover';
  
  // 🎨 根據圖片類型設定背景色、大小和形狀
  const imgId = img.id;
  if (imgId === 'snow_image_preview') {
    img.style.backgroundColor = '#000000'; // 雪花動畫：黑色背景
  } else if (imgId === 'calendar_image_preview') {
    img.style.backgroundColor = '#A4924A'; // 行事曆：金色背景
    img.style.width = '100px'; // 固定寬度
    img.style.height = '100px'; // 固定高度
    img.style.maxWidth = '100px';
    img.style.maxHeight = '100px';
    img.style.borderRadius = '50%'; // 正圓形
  } else if (imgId === 'love_icon_preview') {
    img.style.backgroundColor = '#d00308'; // 愛心：紅色背景
    img.style.width = '100px'; // 固定寬度
    img.style.height = '100px'; // 固定高度
    img.style.maxWidth = '100px';
    img.style.maxHeight = '100px';
    img.style.borderRadius = '50%'; // 正圓形
  } else if (imgId === 'member_image_preview') {
    img.style.backgroundColor = 'transparent'; // 會員圖片：透明背景
    img.style.width = '100px'; // 固定寬度
    img.style.height = '100px'; // 固定高度
    img.style.maxWidth = '100px';
    img.style.maxHeight = '100px';
    img.style.borderRadius = '50%'; // 正圓形
  } else {
    img.style.backgroundColor = 'transparent'; // 其他：透明背景
  }
  
  // 🆕 為圖片添加載入狀態處理
  img.style.border = '3px solid #FFC107'; // 黃色表示載入中
  img.style.padding = '4px';
  img.style.margin = '8px 0';
  img.style.boxSizing = 'border-box';
  img.title = '圖片載入中...';
  
  // 🔧 修復：保持圓形設定不被覆蓋
  if (imgId === 'calendar_image_preview' || imgId === 'love_icon_preview' || imgId === 'member_image_preview') {
    // 保持圓形設定
    img.style.borderRadius = '50%';
  } else {
    img.style.borderRadius = '8px';
  }
  
  console.log('🎨 設定載入中樣式（黃色邊框）for:', url, '背景色:', img.style.backgroundColor);
  
  // 🆕 添加載入成功和失敗的事件處理
  img.onload = function() {
    console.log('🖼️ 預覽圖片載入成功:', url);
    img.style.border = '3px solid #4CAF50'; // 綠色表示成功
    img.title = '圖片載入成功';
  };
  
  img.onerror = function() {
    console.log('❌ 預覽圖片載入失敗:', url);
    img.style.border = '3px solid #F44336'; // 紅色表示失敗
    img.title = '圖片載入失敗，請檢查URL';
    // 🔧 顯示錯誤佔位符
    img.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZmZlYmVlIi8+PHRleHQgeD0iNTAlIiB5PSI0NSUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iI2Y0NDMzNiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPuWcluePh+eEoeazleiyn+WFpTwvdGV4dD48dGV4dCB4PSI1MCUiIHk9IjU1JSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjEyIiBmaWxsPSIjZjQ0MzM2IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+6KuL5qOA5p+lVVJMPC90ZXh0Pjwvc3ZnPg==';
  };
  
  // 最後設定圖片URL觸發載入
  img.src = url;
}

// **新增：清理FLEX JSON用於分享，移除自定義欄位確保符合LINE標準**
function cleanFlexJsonForShare(flexJson) {
  const cleanedJson = JSON.parse(JSON.stringify(flexJson)); // 深度複製
  
  // 🔧 修復：確保所有圖片URL都是絕對路徑
  function ensureAbsoluteUrls(obj) {
    if (typeof obj !== 'object' || obj === null) return;
    
    // 如果是圖片物件，確保URL是絕對路徑
    if (obj.type === 'image' && obj.url) {
      if (obj.url.startsWith('/')) {
        obj.url = `https://barv3.vercel.app${obj.url}`;
        console.log('🔗 轉換相對路徑為絕對路徑:', obj.url);
      }
    }
    
    // 遞迴處理子物件
    if (Array.isArray(obj)) {
      obj.forEach(ensureAbsoluteUrls);
    } else {
      Object.values(obj).forEach(ensureAbsoluteUrls);
    }
  }
  
  function removeCustomFields(obj) {
    if (typeof obj !== 'object' || obj === null) return;
    
    // 移除自定義欄位
    delete obj._cardId;
    delete obj._cardType;
    delete obj._logged;  // 🔧 修復：移除 _logged 欄位
    
    // 遞迴清理子物件
    if (Array.isArray(obj)) {
      obj.forEach(removeCustomFields);
    } else {
      Object.values(obj).forEach(removeCustomFields);
    }
  }
  
  // 先確保絕對URL，再清理自定義欄位
  ensureAbsoluteUrls(cleanedJson);
  removeCustomFields(cleanedJson);
  console.log('🧹 清理FLEX JSON：移除自定義欄位 + 確保圖片絕對路徑');
  return cleanedJson;
}

// 主卡片識別函數 - 使用pageId精確識別主卡片
function isMainCard(bubbleContent) {
  if (!bubbleContent) return false;
  
  // **方案1：檢查pageview文字中的隱藏標識（最穩定）**
  let isMainByPageviewMarker = false;
  if (bubbleContent.body && bubbleContent.body.contents) {
    // 遞迴搜尋所有文字內容
    function findPageviewMarker(contents) {
      if (!Array.isArray(contents)) return false;
      for (const item of contents) {
        if (item.type === 'text' && item.text && item.text.includes('\u200B')) {
          return true; // 找到零寬度空格標識
        }
        if (item.contents && Array.isArray(item.contents)) {
          if (findPageviewMarker(item.contents)) return true;
        }
      }
      return false;
    }
    isMainByPageviewMarker = findPageviewMarker(bubbleContent.body.contents);
  }
  
  // **方案2：使用自定義欄位識別（內部使用）**
  const isMainByCardType = bubbleContent._cardType === 'main';
  const isMainByCardId = bubbleContent._cardId && bubbleContent._cardId.startsWith('M');
  
  // **方案3：使用footer action URI中的參數識別（LINE規範內）**
  let isMainByFooterUri = false;
  if (bubbleContent.footer && bubbleContent.footer.contents && bubbleContent.footer.contents[0] && bubbleContent.footer.contents[0].action) {
    const uri = bubbleContent.footer.contents[0].action.uri || '';
    isMainByFooterUri = uri.includes('cardType=main') || uri.includes('pageId=M');
  }
  
  // **方案4：使用footer文字特徵識別（後備方案）**
  const isMainByFooterText = bubbleContent.footer && 
    bubbleContent.footer.contents && 
    bubbleContent.footer.contents[0] && 
    bubbleContent.footer.contents[0].text === '呈璽元宇宙3D展覽館';
  
  // **新增方案5：檢查愛心圖片下方的pageview數字格式**
  let isMainByPageviewFormat = false;
  if (bubbleContent.body && bubbleContent.body.contents) {
    function findPageviewText(contents) {
      if (!Array.isArray(contents)) return false;
      for (const item of contents) {
        if (item.type === 'text' && item.text) {
          // 檢查是否為4位數字格式（pageview）
          const text = item.text.replace('\u200B', ''); // 移除零寬度字符後檢查
          if (/^\d{4}$/.test(text)) {
            return true;
          }
        }
        if (item.contents && Array.isArray(item.contents)) {
          if (findPageviewText(item.contents)) return true;
        }
      }
      return false;
    }
    isMainByPageviewFormat = findPageviewText(bubbleContent.body.contents);
  }
  
  const isMain = isMainByPageviewMarker || isMainByCardType || isMainByCardId || isMainByFooterUri || isMainByFooterText || isMainByPageviewFormat;
  
  console.log('🔍 主卡片多重識別:', {
    _cardType: bubbleContent._cardType,
    _cardId: bubbleContent._cardId,
    footerUri: bubbleContent.footer?.contents?.[0]?.action?.uri,
    isMainByPageviewMarker,
    isMainByCardType,
    isMainByCardId,
    isMainByFooterUri,
    isMainByFooterText,
    isMainByPageviewFormat,
    isMain: isMain
  });
  
  return isMain;
}

// 修改 fillAllFieldsWithProfile 與卡片資料填入流程
async function fillAllFieldsWithProfile() {
  // 先填入預設值
  Object.keys(defaultCard).forEach(key => {
    if(document.getElementById(key)){
      setInputDefaultStyle(document.getElementById(key), defaultCard[key]);
    }
  });
  
  // 🔧 移除重複的initImagePreviews調用，讓DOMContentLoaded統一處理
  // initImagePreviews(); // 已移至DOMContentLoaded
  
  // 再用 LINE 資訊覆蓋會員圖片與名字（不動 card_alt_title）
  if (window.liff && liff.getProfile) {
    try {
      const profile = await liff.getProfile();
      liffProfile.displayName = profile.displayName;
      liffProfile.pictureUrl = profile.pictureUrl;
      liffProfile.userId = profile.userId;
      if(document.getElementById('display_name')) setInputDefaultStyle(document.getElementById('display_name'), profile.displayName);
      if(document.getElementById('member_image_url')) {
        setInputDefaultStyle(document.getElementById('member_image_url'), profile.pictureUrl);
        // 更新會員圖片預覽
        const memberPreview = document.getElementById('member_image_preview');
        if (memberPreview) {
          setImageUserStyle(memberPreview, profile.pictureUrl);
        }
      }
      renderLiffUserInfo(profile);
    } catch (e) {}
  }
  // 分享按鈕後連結自動帶入 LIFF 連結（含 pageId 與 userId）
  const pageId = 'M01001';
  let liffShareUrl = `https://liff.line.me/${liffId}?pageId=${pageId}`;
  const userIdParam = liffProfile.userId || getQueryParam('userId');
  if(userIdParam) liffShareUrl += `&userId=${userIdParam}`;
  if(document.getElementById('s_button_url')){
    setInputDefaultStyle(document.getElementById('s_button_url'), liffShareUrl);
  }
  renderPreview();
  renderShareJsonBox();
  
  // 🎯 關鍵修復：在表單資料填入完成後才初始化圖片預覽
  console.log('🎯 表單資料已填入，開始初始化圖片預覽...');
  initImagePreviews();
  
  // 🔧 強制觸發所有現有圖片的預覽顯示
  setTimeout(() => {
    const imageFields = [
      { urlId: 'main_image_url', previewId: 'main_image_preview' },
      { urlId: 'snow_image_url', previewId: 'snow_image_preview' },
      { urlId: 'calendar_image_url', previewId: 'calendar_image_preview' },
      { urlId: 'love_icon_url', previewId: 'love_icon_preview' },
      { urlId: 'member_image_url', previewId: 'member_image_preview' }
    ];
    
    imageFields.forEach(field => {
      const urlInput = document.getElementById(field.urlId);
      const preview = document.getElementById(field.previewId);
      
      if (urlInput && preview && urlInput.value && urlInput.value.trim() !== '') {
        console.log(`🎯 強制顯示現有圖片預覽 [${field.urlId}]:`, urlInput.value);
        setImageUserStyle(preview, urlInput.value);
      }
    });
    
    console.log('✅ 圖片預覽強制初始化完成');
  }, 100); // 短暫延遲確保DOM更新
}

// 新增：初始化所有圖片預覽
function initImagePreviews() {
  // 🔧 防止重複初始化
  if (window.imagePreviewsInitialized) {
    console.log('⚠️ 圖片預覽已初始化，跳過重複初始化');
    return;
  }
  
  console.log('🔄 開始初始化圖片預覽功能');
  
  const imageFields = [
    { urlId: 'main_image_url', previewId: 'main_image_preview' },
    { urlId: 'snow_image_url', previewId: 'snow_image_preview' },
    { urlId: 'calendar_image_url', previewId: 'calendar_image_preview' },
    { urlId: 'love_icon_url', previewId: 'love_icon_preview' },
    { urlId: 'member_image_url', previewId: 'member_image_preview' }
  ];
  
  imageFields.forEach(field => {
    const urlInput = document.getElementById(field.urlId);
    const preview = document.getElementById(field.previewId);
    
    if (urlInput && preview) {
      // 🔄 初始化時顯示現有圖片
      console.log(`🔄 初始化檢查 [${field.urlId}]:`, urlInput.value);
      if (urlInput.value && urlInput.value.trim() !== '') {
        console.log(`✅ 發現現有圖片URL，立即顯示預覽 [${field.urlId}]:`, urlInput.value);
        setImageUserStyle(preview, urlInput.value);
      } else {
        console.log(`🔄 沒有圖片URL，隱藏預覽 [${field.urlId}]`);
        preview.style.display = 'none';
      }
      
      // 🆕 新增：即時圖片預覽功能
      function updatePreview() {
        const url = urlInput.value.trim();
        console.log(`🖼️ 即時預覽觸發 [${field.urlId}]:`, url);
        
        if (url !== '') {
          // 檢查是否為有效的圖片URL格式
          if (isValidImageUrl(url)) {
            console.log(`✅ URL格式有效 [${field.urlId}]:`, url);
            
            // 🔧 修復：立即顯示預覽，不等待預載
            setImageUserStyle(preview, url);
            console.log(`🖼️ 已設定預覽圖片 [${field.urlId}]`);
            
            // 🆕 預載圖片以檢查是否能正常載入
            const testImg = new Image();
            
            // 🔧 重要：設定crossOrigin屬性以避免CORS問題
            testImg.crossOrigin = 'anonymous';
            
            testImg.onload = function() {
              console.log(`✅ 圖片載入成功 [${field.urlId}]:`, url);
              // 圖片載入成功，確保預覽顯示正確
              setImageUserStyle(preview, url);
              // 🆕 移除錯誤樣式
              preview.style.border = '2px solid #4caf50';
              preview.title = '圖片載入成功';
            };
            
            testImg.onerror = function(error) {
              console.log(`❌ 圖片載入失敗 [${field.urlId}]:`, url, error);
              
              // 🔧 修復：不管預載是否成功，都直接顯示圖片
              // 有些圖片雖然預載失敗，但在實際顯示時可能成功
              console.log(`🔧 預載失敗，但仍嘗試直接顯示圖片 [${field.urlId}]`);
              
              // 設定圖片並加上錯誤樣式
              preview.src = url;
              preview.style.display = 'block';
              preview.style.border = '2px solid #ff9800'; // 橙色邊框表示警告
              preview.title = '圖片可能載入有問題，請檢查URL';
              
              // 🆕 為實際預覽圖片添加錯誤處理
              preview.onerror = function() {
                console.log(`❌ 實際預覽也失敗 [${field.urlId}]:`, url);
                // 只有在實際預覽也失敗時才顯示佔位符
                preview.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjVmNWY1Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPuWcluePh+eEoeazleiyn+WFpTwvdGV4dD48L3N2Zz4=';
                preview.style.border = '2px dashed #f44336';
                preview.title = '圖片載入失敗';
              };
              
              preview.onload = function() {
                console.log(`✅ 實際預覽載入成功 [${field.urlId}]:`, url);
                preview.style.border = '2px solid #4caf50';
                preview.title = '圖片載入成功';
              };
            };
            
            // 🔧 增加載入超時處理
            setTimeout(function() {
              if (!testImg.complete) {
                console.log(`⏰ 圖片載入超時 [${field.urlId}]:`, url);
                testImg.onerror(new Error('載入超時'));
              }
            }, 5000); // 5秒超時
            
            testImg.src = url;
          } else {
            console.log(`❌ URL格式無效 [${field.urlId}]:`, url);
            // 🔧 修復：即使格式檢測失敗，也嘗試顯示圖片
            console.log(`🔧 嘗試強制顯示圖片 [${field.urlId}]`);
            setImageUserStyle(preview, url);
          }
        } else {
          console.log(`🔄 清空預覽 [${field.urlId}]`);
          // 空白URL，隱藏預覽
          preview.style.display = 'none';
        }
      }
      
      // 🆕 綁定即時更新事件
      console.log(`🔧 綁定事件監聽器 [${field.urlId}]`);
      
      urlInput.addEventListener('input', function(e) {
        console.log(`📝 input事件觸發 [${field.urlId}]:`, e.target.value);
        updatePreview();
      });
      
      urlInput.addEventListener('paste', function(e) {
        console.log(`📋 paste事件觸發 [${field.urlId}]`);
        // 延遲處理貼上事件，確保值已更新
        setTimeout(function() {
          console.log(`📋 paste延遲處理 [${field.urlId}]:`, urlInput.value);
          updatePreview();
        }, 100);
      });
      
      urlInput.addEventListener('blur', function(e) {
        console.log(`🔍 blur事件觸發 [${field.urlId}]:`, e.target.value);
        updatePreview();
      });
      
      // 🆕 立即觸發一次檢查
      if (urlInput.value && urlInput.value.trim() !== '') {
        console.log(`🔄 初始化觸發預覽 [${field.urlId}]:`, urlInput.value);
        updatePreview();
      }
    }
  });
  
  // 🔧 設置初始化完成標誌
  window.imagePreviewsInitialized = true;
  console.log('✅ 圖片預覽功能初始化完成');
}

// 🆕 新增：檢查是否為有效的圖片URL格式
function isValidImageUrl(url) {
  try {
    // 🔧 修復：允許相對路徑和特殊格式
    if (url.startsWith('data:image/')) {
      return true; // Base64圖片
    }
    
    // 🔧 修復：放寬URL檢測，允許相對路徑
    if (!url.startsWith('http://') && !url.startsWith('https://') && !url.startsWith('/')) {
      // 如果不是絕對URL也不是相對路徑，可能是特殊格式，嘗試檢測副檔名
      const imageExtensions = /\.(jpg|jpeg|png|gif|bmp|webp|svg)$/i;
      return imageExtensions.test(url);
    }
    
    // 檢查是否包含常見圖片格式
    const imageExtensions = /\.(jpg|jpeg|png|gif|bmp|webp|svg)(\?.*)?$/i;
    const isImageExtension = imageExtensions.test(url);
    
    // 🔧 重要修復：識別常見圖片存儲服務（包括Supabase）
    const isImageService = /\/(uploads|images|img|static|assets|storage)\//i.test(url) || 
                          /(imgur|vercel|cloudinary|unsplash|pexels|supabase)\./.test(url) ||
                          /supabase\.co\/storage/i.test(url) || 
                          /\.vercel\.app\/uploads/i.test(url);
    
    // 🔧 修復：如果有@符號，可能是特殊命名格式，放行
    const hasSpecialNaming = /@.*\.(jpg|jpeg|png|gif|bmp|webp|svg)$/i.test(url);
    
    // 🔧 關鍵修復：如果以上都不匹配，但是是HTTPS URL，優先放行
    const isHttpsUrl = url.startsWith('https://');
    
    const result = isImageExtension || isImageService || hasSpecialNaming || isHttpsUrl;
    
    console.log('🔍 URL檢測:', {
      url: url.substring(0, 50) + (url.length > 50 ? '...' : ''),
      isImageExtension,
      isImageService,
      hasSpecialNaming, 
      isHttpsUrl,
      result
    });
    
    return result;
  } catch (error) {
    console.log('🔍 URL檢測異常:', url, error);
    // 🔧 修復：如果URL檢測失敗，對於HTTPS URL默認放行
    return url.startsWith('https://') || url.startsWith('http://');
  }
}

function getFormData() {
  const data = {};
  Object.keys(defaultCard).forEach(key => {
    if (key === 'pageview') {
      data[key] = parseInt(document.getElementById(key).value, 10) || 0;
    } else {
      data[key] = document.getElementById(key).value;
    }
  });
  return data;
}

// 取得主卡片 bubble
function getMainBubble(cardData) {
  // 產生 s_button_url，優先用 userId
  const pageId = 'M01001';
  let s_button_url = `https://liff.line.me/${liffId}?pageId=${pageId}`;
  if (liffProfile.userId) {
    s_button_url += `&userId=${liffProfile.userId}`;
  } else if (getQueryParam('userId')) {
    s_button_url += `&userId=${getQueryParam('userId')}`;
  }
  // 依 line會員卡-json.txt 結構組裝
  const bubble = {
    type: 'bubble',
    size: 'mega',
    body: {
      type: 'box',
      layout: 'vertical',
      contents: [
        // 主圖
        {
          type: 'image',
          size: 'full',
          aspectRatio: '1:1',
          aspectMode: 'cover',
          url: cardData.main_image_url || defaultCard.main_image_url
        },
        // 雪花動畫圖層
        cardData.snow_image_url ? {
          type: 'image',
          url: cardData.snow_image_url,
          size: 'full',
          aspectRatio: '1:1',
          animated: true,
          aspectMode: 'cover',
          position: 'absolute',
          action: cardData.main_image_link ? {
            type: 'uri', label: 'action', uri: cardData.main_image_link
          } : undefined
        } : null,
        // 行事曆與愛心區塊
        {
          type: 'box',
          width: '90px',
          layout: 'horizontal',
          spacing: 'none',
          contents: [
            {
              type: 'box',
              action: {
                uri: cardData.calendar_image_link || defaultCard.calendar_image_link,
                type: 'uri',
                label: 'VIP會員號碼'
              },
              layout: 'vertical',
              contents: [
                {
                  url: cardData.calendar_image_url || defaultCard.calendar_image_url,
                  type: 'image',
                  action: (cardData.calendar_image_link || defaultCard.calendar_image_link) ? {
                    uri: cardData.calendar_image_link || defaultCard.calendar_image_link, type: 'uri', label: 'action'
                  } : undefined,
                  size: '35px'
                },
                {
                  type: 'text',
                  text: String(cardData.amember_id || defaultCard.amember_id),
                  size: '10px',
                  align: 'center',
                  gravity: 'center',
                  offsetTop: '30px',
                  position: 'absolute',
                  offsetStart: '12px',
                  color: '#FFFFFF'
                }
              ],
              cornerRadius: '30px',
              backgroundColor: '#A4924A'
            },
            {
              type: 'box',
              action: {
                uri: cardData.love_icon_link || defaultCard.love_icon_link,
                type: 'uri',
                label: '愛心會員號碼'
              },
              layout: 'vertical',
              contents: [
                {
                  url: cardData.love_icon_url || defaultCard.love_icon_url,
                  type: 'image',
                  action: (cardData.love_icon_link || defaultCard.love_icon_link) ? {
                    uri: cardData.love_icon_link || defaultCard.love_icon_link, type: 'uri', label: 'action'
                  } : undefined,
                  size: '32px'
                },
                {
                  type: 'text',
                  size: '10px',
                  align: 'center',
                  gravity: 'center',
                  position: 'absolute',
                  offsetTop: '30px',
                  offsetStart: '12px',
                  text: formatPageview(cardData.pageview || defaultCard.pageview) + '\u200B',
                  color: '#FFFFFF'
                }
              ],
              cornerRadius: '30px',
              backgroundColor: '#d00308'
            }
          ],
          offsetTop: '250px',
          offsetStart: '10px',
          height: '45px',
          position: 'absolute'
        },
        // 主標題
        {
          size: '20px',
          text: String(cardData.main_title_1 || defaultCard.main_title_1),
          type: 'text',
          align: 'center',
          color: cardData.main_title_1_color || defaultCard.main_title_1_color,
          weight: 'bold',
          margin: 'md'
        },
        // 副標題
        {
          type: 'box',
          layout: 'vertical',
          contents: [
            {
              type: 'text',
              text: String(cardData.main_title_2 || defaultCard.main_title_2),
              wrap: true,
              size: '16px',
              margin: 'sm',
              color: cardData.main_title_2_color || defaultCard.main_title_2_color
            }
          ],
          paddingEnd: '65px',
          paddingStart: '5px',
          height: '95px'
        },
        // 會員頭像與名字
        {
          type: 'box',
          width: '65px',
          layout: 'vertical',
          spacing: 'none',
          contents: [
            {
              type: 'box',
              action: cardData.member_image_link ? {
                uri: cardData.member_image_link, type: 'uri', label: 'action'
              } : undefined,
              layout: 'vertical',
              contents: [
                {
                  url: cardData.member_image_url || defaultCard.member_image_url,
                  type: 'image',
                  action: cardData.member_image_link ? {
                    uri: cardData.member_image_link, type: 'uri', label: '官網'
                  } : undefined,
                  aspectRatio: '1:1',
                  aspectMode: 'cover',
                  backgroundColor: '#E1E6E0'
                }
              ],
              cornerRadius: '35px',
              borderWidth: 'semi-bold',
              borderColor: cardData.name_color1 || defaultCard.name_color1
            },
            {
              type: 'box',
              layout: 'horizontal',
              contents: [
                {
                  type: 'text',
                  size: '14px',
                  text: String(cardData.display_name || defaultCard.display_name),
                  style: 'italic',
                  color: cardData.name_color1 || defaultCard.name_color1,
                  align: 'center',
                  weight: 'bold',
                  wrap: true,
                  margin: 'none'
                }
              ],
              paddingAll: 'none',
              cornerRadius: 'none',
              margin: 'none',
              spacing: 'none'
            }
          ],
          position: 'absolute',
          offsetEnd: '5px',
          margin: 'md',
          offsetTop: '315px'
        },
        // 按鈕
        {
          type: 'box',
          layout: 'horizontal',
          contents: [
            {
              type: 'button',
              action: {
                type: 'uri',
                label: cardData.button_1_text || defaultCard.button_1_text,
                uri: cardData.button_1_url || defaultCard.button_1_url
              },
              color: cardData.button_1_color || defaultCard.button_1_color,
              style: 'primary',
              height: 'sm',
              offsetEnd: '1px'
            },
            {
              type: 'button',
              action: {
                type: 'uri',
                label: cardData.s_button_text || defaultCard.s_button_text,
                uri: s_button_url
              },
              color: cardData.s_button_color || defaultCard.s_button_color,
              style: 'primary',
              height: 'sm',
              offsetStart: '1px'
            }
          ],
          margin: 'md'
        }
      ].filter(Boolean),
      backgroundColor: '#E1E6E0',
      paddingAll: '10px'
    },
    footer: {
      type: 'box',
      layout: 'horizontal',
      spacing: 'none',
      contents: [
        {
          type: 'text',
          text: '呈璽元宇宙3D展覽館',
          wrap: true,
          color: '#00000050',
          align: 'center',
          action: {
            type: 'uri',
            label: 'action',
            uri: 'https://lihi3.cc/LY5qf'
          },
          size: 'sm',
          margin: 'none'
        }
      ],
      backgroundColor: '#E1E6E0',
      height: '30px',
      margin: 'none',
      paddingAll: '2px'
    },
    styles: {
      footer: {
        separatorColor: '#000000',
        separator: true
      }
    }
  };
  
  // **關鍵修復：為主卡片加入pageId標識**
  bubble._cardId = cardData.page_id || pageId; // 使用實際的pageId
  bubble._cardType = 'main'; // 標示為主卡片
  
  // **新方案：在footer的action中加入隱藏的主卡標識（LINE規範內）**
  if (bubble.footer && bubble.footer.contents && bubble.footer.contents[0]) {
    // 在footer的action中加入pageId參數，LINE接受這種格式
    const originalUri = bubble.footer.contents[0].action.uri;
    bubble.footer.contents[0].action.uri = originalUri + `?cardType=main&pageId=${pageId}`;
  }
  
      // 只記錄一次，避免重複日誌
    if (!bubble._logged) {
      console.log('🏷️ 生成主卡片，加入標識:', {
        _cardId: bubble._cardId,
        _cardType: bubble._cardType,
        footerUri: bubble.footer?.contents?.[0]?.action?.uri
      });
      bubble._logged = true;
    }
  
  return bubble;
}

// 取得所有要分享的卡片（目前僅主卡片，未來可擴充多卡）
function getShareBubbles() {
  const cardData = getFormData();
  const bubble = getMainBubble(cardData);
  return [{
    type: 'flex',
    altText: cardData.card_alt_title || `${cardData.main_title_1 || defaultCard.main_title_1}/${cardData.display_name || defaultCard.display_name}`,
    contents: bubble
  }];
}

// 預覽區渲染
function renderPreview() {
  // **修復問題1：使用allCardsSortable渲染多卡片預覽**
  if (allCardsSortable && allCardsSortable.length > 1) {
    // **關鍵修復：重新生成主卡片的flex_json**
    const mainCardIndex = allCardsSortable.findIndex(c => c.type === 'main');
    if (mainCardIndex !== -1) {
      // 重新生成主卡片，使用最新的表單資料
      allCardsSortable[mainCardIndex].flex_json = getMainBubble({ ...getFormData(), page_id: 'M01001' });
      allCardsSortable[mainCardIndex].img = getFormData().main_image_url || defaultCard.main_image_url;
      console.log('🔄 即時預覽：已更新主卡片內容');
    }
    
    // 多卡片：使用排序後的結果渲染carousel
    const flexArr = allCardsSortable.map(c => c.flex_json);
    const flexJson = {
      type: 'flex',
      altText: getFormData().card_alt_title || getFormData().main_title_1 || defaultCard.main_title_1 || '我的會員卡',
      contents: {
        type: 'carousel',
        contents: flexArr
      }
    };
    
    // 🔧 修正：使用chatbox容器進行flex2html渲染
    const preview = document.getElementById('main-card-preview');
    let chatbox = preview.querySelector('.chatbox');
    if (!chatbox) {
      chatbox = document.createElement('div');
      chatbox.className = 'chatbox';
      preview.appendChild(chatbox);
    }
    chatbox.innerHTML = '';
    
    // 創建一個臨時ID並渲染
    const tempId = 'temp-chatbox-' + Date.now();
    chatbox.id = tempId;
    flex2html(tempId, flexJson);
    
  } else {
    // 單卡片：只渲染主卡片
    const bubble = getMainBubble(getFormData());
    const flexJson = {
      type: 'flex',
      altText: getFormData().card_alt_title || getFormData().main_title_1 || defaultCard.main_title_1 || '我的會員卡',
      contents: bubble
    };
    
    // 🔧 修正：使用chatbox容器進行flex2html渲染
    const preview = document.getElementById('main-card-preview');
    let chatbox = preview.querySelector('.chatbox');
    if (!chatbox) {
      chatbox = document.createElement('div');
      chatbox.className = 'chatbox';
      preview.appendChild(chatbox);
    }
    chatbox.innerHTML = '';
    
    // 創建一個臨時ID並渲染
    const tempId = 'temp-chatbox-' + Date.now();
    chatbox.id = tempId;
    flex2html(tempId, flexJson);
  }
  
  renderShareJsonBox();
}

// 分享按鈕上方顯示即將分享的Flex Message JSON
function renderShareJsonBox() {
  const box = document.getElementById('shareJsonBox');
  if (!box) return;
  
  // **修復問題1：使用allCardsSortable的排序結果生成JSON**
  let shareMsg;
  if (allCardsSortable && allCardsSortable.length > 1) {
    // **關鍵修復：重新生成主卡片的flex_json（如果還沒更新）**
    const mainCardIndex = allCardsSortable.findIndex(c => c.type === 'main');
    if (mainCardIndex !== -1) {
      // 重新生成主卡片，確保使用最新的表單資料
      allCardsSortable[mainCardIndex].flex_json = getMainBubble({ ...getFormData(), page_id: 'M01001' });
      allCardsSortable[mainCardIndex].img = getFormData().main_image_url || defaultCard.main_image_url;
      console.log('🔄 JSON更新：已更新主卡片內容');
    }
    
    // 多卡片：按照排序後的結果組成carousel
    const flexArr = allCardsSortable.map(c => c.flex_json);
    shareMsg = {
      type: 'flex',
      altText: getFormData().card_alt_title || getFormData().main_title_1 || defaultCard.main_title_1,
      contents: {
        type: 'carousel',
        contents: flexArr
      }
    };
  } else {
    // 單卡片：只有主卡片
    const mainCard = getMainBubble(getFormData());
    shareMsg = {
      type: 'flex',
      altText: getFormData().card_alt_title || getFormData().main_title_1 || defaultCard.main_title_1,
      contents: mainCard
    };
  }
  
  // **修復：使用CSS樣式中定義的h3標題結構**
  box.innerHTML = '';
  
  const title = document.createElement('h3');
  title.textContent = '📋 FLEX MESSAGE JSON';
  box.appendChild(title);
  
  const pre = document.createElement('pre');
  
  // **清理JSON顯示，移除自定義欄位**
  const cleanShareMsg = cleanFlexJsonForShare(shareMsg);
  pre.textContent = JSON.stringify(cleanShareMsg, null, 2);
  box.appendChild(pre);
  
  const copyBtn = document.createElement('button');
  copyBtn.textContent = '📋 複製JSON';
  copyBtn.style.cssText = 'margin:12px 0 0 0;padding:8px 16px;background:#4CAF50;color:#fff;border:none;border-radius:4px;cursor:pointer;font-size:14px;width:100%;';
  copyBtn.onclick = () => {
    navigator.clipboard.writeText(pre.textContent).then(() => {
      copyBtn.textContent = '✅ 已複製!';
      setTimeout(()=>{copyBtn.textContent='📋 複製JSON';},1500);
    });
  };
  box.appendChild(copyBtn);
}

function closeOrRedirect() {
  if (window.liff && typeof liff.closeWindow === 'function') {
    liff.closeWindow();
  } else {
    window.location.replace('/member-card-simple.html');
  }
}

// 修改 window.onload 函數
window.onload = async function() {
  const pageId = getQueryParam('pageId');
  const userIdParam = getQueryParam('userId');
  if (pageId) {
    // 自動分享模式
    const cardForm = document.getElementById('cardForm');
    if (cardForm) cardForm.style.display = 'none';
    const previewSection = document.querySelector('.preview-section');
    if (previewSection) previewSection.style.display = 'none';
    let loadingDiv = document.createElement('div');
    loadingDiv.className = 'loading';
    loadingDiv.innerHTML = '<div style="font-size:20px;color:#4caf50;margin-top:60px;">正在自動分享...</div>';
    document.body.appendChild(loadingDiv);
    let flexJson = null;
    let cardId = null;
    try {
      await liff.init({ liffId });
      if (!liff.isLoggedIn()) {
        liff.login();
        return;
      }
      if (userIdParam) {
        // 1. pageId+userId：查詢個人卡片
        const apiUrl = `/api/cards?pageId=${pageId}&userId=${userIdParam}`;
        const result = await safeFetchJson(apiUrl);
        flexJson = result?.data?.[0]?.flex_json;
        cardId = result?.data?.[0]?.id;
      } else {
        // 2. 只有 pageId：查詢初始卡片（user_id 為 null）
        const result = await safeFetchJson(`/api/cards?pageId=${pageId}`);
        // 選出 user_id 為 null 的那一筆
        const defaultCard = Array.isArray(result?.data)
          ? result.data.find(card => !card.line_user_id)
          : null;
        flexJson = defaultCard?.flex_json;
        cardId = defaultCard?.id;
      }
      if (!flexJson) {
        loadingDiv.innerHTML = '<div style="color:#c62828;font-size:18px;">查無卡片資料，無法分享</div>';
        return;
      }
      // **修復：自動分享時也要更新所有卡片的pageview**
      try {
        // **1. 建立要更新的卡片清單（主卡+宣傳卡）**
        let cardIdTypeArr = [{ id: cardId, type: 'main' }];
        
        // **2. 如果是carousel，還要包含宣傳卡片**
        if (flexJson.contents && flexJson.contents.type === 'carousel') {
          const carouselContents = flexJson.contents.contents;
          for (let i = 0; i < carouselContents.length; i++) {
            const content = carouselContents[i];
            // 如果不是主卡，就是宣傳卡片
            if (!isMainCard(content)) {
              // 嘗試從content中找到宣傳卡片的ID
              // 這裡可能需要從 _cardId 或其他方式識別
              if (content._cardId && content._cardId !== cardId) {
                cardIdTypeArr.push({ id: content._cardId, type: 'promo' });
                console.log('🎯 自動分享：加入宣傳卡片 pageview 更新:', content._cardId);
              }
            }
          }
        }
        
        console.log('📊 自動分享：準備更新的卡片清單:', cardIdTypeArr);
        
        // **3. 批次更新所有卡片的pageview**
        await fetch('/api/cards/pageview', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ cardIdTypeArr })
        });
        
        // **關鍵修復：pageview更新後重新取得最新資料**
        let updatedCardData = null;
        let latestPageview = 0;
        
        if (userIdParam) {
          // 有userId：重新查詢個人卡片取得最新pageview
          const updatedResult = await safeFetchJson(`/api/cards?pageId=${pageId}&userId=${userIdParam}`);
          if (updatedResult?.data?.[0]) {
            updatedCardData = updatedResult.data[0];
            latestPageview = updatedCardData.pageview;
            console.log('🔄 已取得最新個人卡片 pageview:', latestPageview);
          }
        } else {
          // 無userId：重新查詢初始卡片取得最新pageview
          const updatedResult = await safeFetchJson(`/api/cards?pageId=${pageId}`);
          const defaultCardUpdated = Array.isArray(updatedResult?.data)
            ? updatedResult.data.find(card => !card.line_user_id)
            : null;
          if (defaultCardUpdated) {
            updatedCardData = defaultCardUpdated;
            latestPageview = defaultCardUpdated.pageview;
            console.log('🔄 已取得最新初始卡片 pageview:', latestPageview);
          }
        }
        
        // 如果無法取得更新後的資料，使用原本的資料
        if (!updatedCardData) {
          updatedCardData = userIdParam 
            ? (result?.data?.[0] || defaultCard)
            : (defaultCard);
          latestPageview = updatedCardData.pageview || 0;
          console.log('⚠️ 使用原始資料，pageview:', latestPageview);
        }
        
        // **修復問題4：強化主卡識別與更新邏輯**
        if (flexJson.contents && flexJson.contents.type === 'carousel') {
          // **使用新的isMainCard函數精確識別主卡片位置**
          const originalContents = flexJson.contents.contents;
          let mainCardIndex = -1;
          let mainCardCount = 0;
          
          // **首先掃描所有卡片，統計主卡數量和位置**
          for (let i = 0; i < originalContents.length; i++) {
            const content = originalContents[i];
            if (isMainCard(content)) {
              if (mainCardIndex === -1) {
                mainCardIndex = i; // 記錄第一個找到的主卡位置
              }
              mainCardCount++;
              console.log(`🎯 找到主卡片位置: ${i}`);
            }
          }
          
          console.log(`📊 主卡統計: 總數=${mainCardCount}, 第一個位置=${mainCardIndex}`);
          
          // **產生新的主卡片（使用最新pageview）**
          const newMainCard = getMainBubble({ ...updatedCardData, pageview: latestPageview, page_id: pageId });
          
          if (mainCardCount === 1 && mainCardIndex >= 0) {
            // **理想情況：只有一張主卡，直接替換**
            originalContents[mainCardIndex] = newMainCard;
            console.log('✅ 自動分享模式：已更新唯一主卡片位置', mainCardIndex);
          } else if (mainCardCount > 1) {
            // **異常情況：多張主卡，移除多餘的主卡片，只保留第一張**
            console.log('⚠️ 發現多張主卡，進行清理');
            const filteredContents = [];
            let mainCardAdded = false;
            
            for (let i = 0; i < originalContents.length; i++) {
              const content = originalContents[i];
              if (isMainCard(content)) {
                if (!mainCardAdded) {
                  // 只保留第一張主卡並更新
                  filteredContents.push(newMainCard);
                  mainCardAdded = true;
                  console.log('✅ 保留並更新第一張主卡');
                } else {
                  console.log('🗑️ 移除多餘的主卡');
                }
              } else {
                // 保留非主卡片
                filteredContents.push(content);
              }
            }
            
            // 更新 carousel 內容
            flexJson.contents.contents = filteredContents;
            console.log('✅ 多主卡清理完成，剩餘卡片數:', filteredContents.length);
          } else {
            // **無主卡情況：將第一張卡片替換為主卡片**
            console.log('⚠️ 未找到主卡片，將第一張卡片設為主卡');
            if (originalContents.length > 0) {
              originalContents[0] = newMainCard;
              console.log('✅ 第一張卡片已設為主卡');
            } else {
              originalContents.push(newMainCard);
              console.log('🆕 添加主卡到空的carousel');
            }
          }
          
          // **重新組合 carousel flexJson**
          flexJson = {
            type: 'flex',
            altText: updatedCardData.card_alt_title || updatedCardData.main_title_1 || defaultCard.main_title_1,
            contents: {
              type: 'carousel',
              contents: originalContents // 使用原始陣列（已包含更新後的主卡）
            }
          };
        } else {
          // 單卡片：直接替換
          flexJson = {
            type: 'flex',
            altText: updatedCardData.card_alt_title || updatedCardData.main_title_1 || defaultCard.main_title_1,
            contents: getMainBubble({ ...updatedCardData, pageview: latestPageview, page_id: pageId })
          };
        }
        
        console.log('✅ 自動分享模式：已重新生成最新flexJson，pageview:', latestPageview);
      } catch (e) { 
        console.error('自動分享模式pageview更新失敗:', e);
      }
      // 自動分享
      const cleanFlexJson = cleanFlexJsonForShare(flexJson);
      console.log('📤 分享清理後的FLEX JSON');
      await liff.shareTargetPicker([cleanFlexJson])
        .then(closeOrRedirect)
        .catch(closeOrRedirect);
    } catch (e) {
      loadingDiv.innerHTML = '<div style="color:#c62828;font-size:18px;">自動分享失敗：' + (e.message || e) + '</div>';
    }
    return;
  }
  // 3. 無 pageId/userId，進入登入與編修
  const ok = await initLiffAndLogin();
  if (ok) {
    // 2. 取得 profile，確保 userId 可用
    let profile = null;
    if (window.liff && liff.getProfile) {
      try {
        profile = await liff.getProfile();
        liffProfile.displayName = profile.displayName;
        liffProfile.pictureUrl = profile.pictureUrl;
        liffProfile.userId = profile.userId;
        renderLiffUserInfo(profile);
      } catch (e) {}
    }
    // 3. 用 userId 查詢 API
    let userId = liffProfile.userId || getQueryParam('userId');
    let pageId = 'M01001';
    let apiUrl = `/api/cards?pageId=${pageId}`;
    if (userId) apiUrl += `&userId=${userId}`;
    let cardLoaded = false;
    let loadedFlexJson = null;
    let result = null; // **修復：確保result變數在正確作用域內**
    try {
      const res = await fetch(apiUrl);
      result = await res.json();
      if (result.success && result.data && result.data.length > 0) {
        const card = result.data[0];
        Object.keys(defaultCard).forEach(key => {
          if (document.getElementById(key) && card[key] !== undefined && card[key] !== null) {
            setInputDefaultStyle(document.getElementById(key), card[key]);
          }
        });
        cardLoaded = true;
        loadedFlexJson = card.flex_json;
      }
    } catch (e) {}
    // 4. 若沒資料則用 fillAllFieldsWithProfile
    if (!cardLoaded) {
      Object.keys(defaultCard).forEach(key => {
        if(document.getElementById(key)){
          setInputDefaultStyle(document.getElementById(key), defaultCard[key]);
        }
      });
      await fillAllFieldsWithProfile();
    } else {
      // 🎯 有卡片資料時也要初始化圖片預覽
      console.log('🎯 載入現有卡片資料，開始初始化圖片預覽...');
      initImagePreviews();
      
      // 🔧 強制觸發所有現有圖片的預覽顯示
      setTimeout(() => {
        const imageFields = [
          { urlId: 'main_image_url', previewId: 'main_image_preview' },
          { urlId: 'snow_image_url', previewId: 'snow_image_preview' },
          { urlId: 'calendar_image_url', previewId: 'calendar_image_preview' },
          { urlId: 'love_icon_url', previewId: 'love_icon_preview' },
          { urlId: 'member_image_url', previewId: 'member_image_preview' }
        ];
        
        imageFields.forEach(field => {
          const urlInput = document.getElementById(field.urlId);
          const preview = document.getElementById(field.previewId);
          
          if (urlInput && preview && urlInput.value && urlInput.value.trim() !== '') {
            console.log(`🎯 強制顯示載入的圖片預覽 [${field.urlId}]:`, urlInput.value);
            setImageUserStyle(preview, urlInput.value);
          }
        });
        
        console.log('✅ 載入卡片資料的圖片預覽初始化完成');
      }, 100); // 短暫延遲確保DOM更新
    }
    // 5. 掛 input 監聽 - 已移到DOMContentLoaded中統一處理
    // if(document.getElementById('display_name'))
    //   document.getElementById('display_name').addEventListener('input', updateCardAltTitle);
    // if(document.getElementById('main_title_1'))
    //   document.getElementById('main_title_1').addEventListener('input', updateCardAltTitle);
    // 6. 渲染預覽與 JSON
    renderPreview();
    renderShareJsonBox();
    // **修復問題2：正確處理card_order排序**
    if (cardLoaded && result && result.data && result.data[0]) {
      const cardData = result.data[0];
      
      // **暫存卡片資料，等宣傳卡片載入完成後再處理排序**
      window.pendingCardData = cardData;
      
      // 如果宣傳卡片已經載入完成，立即處理
      if (promoCardList.length > 0) {
        // 如果有儲存的card_order，按順序排列
        if (cardData.card_order && Array.isArray(cardData.card_order)) {
          const cardOrder = cardData.card_order;
          let newAllCards = [];
          let newSelectedPromo = [];
          
          console.log('按照card_order重建卡片:', cardOrder);
          
          // 按照card_order順序重建卡片陣列
          cardOrder.forEach(cardId => {
            if (cardId === 'main') {
              // 主卡片
              newAllCards.push({ 
                type: 'main', 
                id: 'main', 
                flex_json: getMainBubble(getFormData()), 
                img: getFormData().main_image_url || defaultCard.main_image_url 
              });
              console.log('加入主卡片');
            } else {
              // 宣傳卡片 - 從promoCardList中找到對應的卡片
              const found = promoCardList.find(c => c.id === cardId);
              if (found) {
                // **關鍵修復：為宣傳卡片的flex_json加入_cardId標識**
                const promoFlexJson = JSON.parse(JSON.stringify(found.flex_json)); // 深度複製
                promoFlexJson._cardId = found.id; // 加入宣傳卡片ID
                promoFlexJson._cardType = 'promo'; // 標示為宣傳卡片
                console.log('🏷️ card_order重建：為宣傳卡片加入標識:', found.id);
                
                newAllCards.push({ 
                  type: 'promo', 
                  id: found.id, 
                  flex_json: promoFlexJson, 
                  img: found.flex_json.body.contents[0].url 
                });
                newSelectedPromo.push(found.id);
                console.log('加入宣傳卡片:', found.id, found.main_title_1);
              } else {
                console.log('找不到宣傳卡片:', cardId);
              }
            }
          });
          
          console.log('最終卡片陣列:', newAllCards);
          console.log('最終選中的宣傳卡片:', newSelectedPromo);
          
          if (newAllCards.length > 0) {
            allCardsSortable = newAllCards;
            selectedPromoCards = newSelectedPromo;
            renderPromoCardSelector(); // **修復問題2-2：重新渲染選擇器以正確顯示狀態**
            renderPromoCardListSortable();
            console.log('卡片排序處理完成');
          }
        } else if (loadedFlexJson && loadedFlexJson.contents && loadedFlexJson.contents.type === 'carousel') {
          // 若沒有card_order但有carousel，還原排序（舊邏輯保留）
          const flexArr = loadedFlexJson.contents.contents;
          let newAllCards = [];
          let newSelectedPromo = [];
          flexArr.forEach(flex => {
            // 判斷是主卡還是宣傳卡
            if (flex.body && flex.body.contents && flex.body.contents.some && flex.body.contents.some(c => c.type === 'box' && c.contents && c.contents.some && c.contents.some(cc => cc.text === '主卡片'))) {
              // 主卡
              newAllCards.push({ type: 'main', id: 'main', flex_json: flex, img: getFormData().main_image_url || defaultCard.main_image_url });
            } else {
              // 宣傳卡
              const found = promoCardList.find(c => JSON.stringify(c.flex_json) === JSON.stringify(flex));
              if (found) {
                newAllCards.push({ type: 'promo', id: found.id, flex_json: found.flex_json, img: found.flex_json.body.contents[0].url });
                newSelectedPromo.push(found.id);
              }
            }
          });
          if (newAllCards.length > 0) {
            allCardsSortable = newAllCards;
            selectedPromoCards = newSelectedPromo;
          }
        }
        delete window.pendingCardData; // 處理完成後清除暫存資料
      }
    }
    renderPromoCardListSortable();
  }
  
  // **修復問題1：將分享按鈕移到正確位置，確保總是顯示**
  // 顯示分享按鈕後連結欄位（可複製）
  const sBtnUrlInput = document.getElementById('s_button_url');
  if(sBtnUrlInput && sBtnUrlInput.parentNode) {
    sBtnUrlInput.style.display = '';
    
    // **檢查是否已經有分享按鈕，避免重複添加**
    let existingShareBtn = sBtnUrlInput.parentNode.querySelector('button[onclick*="shareToLine"]');
    if (!existingShareBtn) {
      let shareBtn = document.createElement('button');
      shareBtn.type = 'button';
      shareBtn.textContent = '分享到LINE';
      shareBtn.style = 'margin-top:12px;background:#06C755;color:#fff;padding:10px 18px;border:none;border-radius:4px;font-size:16px;cursor:pointer;display:block;width:100%';
      shareBtn.onclick = shareToLine;
      sBtnUrlInput.parentNode.appendChild(shareBtn);
    }
    
    // 設定分享按鈕連結為帶 pageId 和 userId 的 LIFF 連結
    const pageId = 'M01001';
    const userIdParam = liffProfile.userId || getQueryParam('userId');
    const liffUrl = `https://liff.line.me/${liffId}?pageId=${pageId}${userIdParam ? `&userId=${userIdParam}` : ''}`;
    sBtnUrlInput.value = liffUrl;
    sBtnUrlInput.onclick = function() {
      window.open(liffUrl, '_blank');
    };
    sBtnUrlInput.style.cursor = 'pointer';
  }
};

// 主卡片與宣傳卡片拖曳排序功能
let allCardsSortable = [];

// 初始化排序區卡片陣列
function initAllCardsSortable() {
  // 先建立主卡片
  const mainCard = {
    type: 'main',
    id: 'main',
    flex_json: getMainBubble({ ...getFormData(), page_id: 'M01001' }),
    img: getFormData().main_image_url || defaultCard.main_image_url
  };

  // 如果有宣傳卡片，則加入主卡片和宣傳卡片
  if (selectedPromoCards.length > 0) {
    allCardsSortable = [
      mainCard,
      ...selectedPromoCards.map(id => {
        const card = promoCardList.find(c => c.id === id);
        if (card) {
          // **關鍵修復：為宣傳卡片的flex_json加入_cardId標識**
          const promoFlexJson = JSON.parse(JSON.stringify(card.flex_json)); // 深度複製
          promoFlexJson._cardId = card.id; // 加入宣傳卡片ID
          promoFlexJson._cardType = 'promo'; // 標示為宣傳卡片
          console.log('🏷️ 為宣傳卡片加入標識:', card.id);
          
          return { 
            type: 'promo', 
            id: card.id, 
            flex_json: promoFlexJson, 
            img: card.flex_json.body.contents[0].url 
          };
        }
        return null;
      }).filter(Boolean)
    ];
  } else {
    // 如果沒有宣傳卡片，只加入主卡片
    allCardsSortable = [mainCard];
  }
}

// renderPromoCardListSortable 箭頭寬度縮小，padding減少
function renderPromoCardListSortable() {
  const container = document.getElementById('promo-cards');
  if (!container) return;
  
  // 檢查是否需要初始化
  if (allCardsSortable.length === 0 || !allCardsSortable.some(card => card.type === 'main')) {
    initAllCardsSortable();
  }
  
  container.innerHTML = '';
  allCardsSortable.forEach((card, idx) => {
    const div = document.createElement('div');
    div.className = 'promo-card-thumb' + (card.type === 'main' ? ' main-card-thumb' : '');
    div.setAttribute('data-id', card.id);
    div.style.width = '120px';
    div.style.height = '180px';
    div.style.display = 'inline-block';
    div.style.margin = '0 8px 8px 0';
    div.innerHTML = `
      <div style="position:relative;width:120px;height:120px;display:flex;align-items:center;justify-content:center;">
        <img src="${card.img}" style="width:120px;height:120px;object-fit:cover;border-radius:8px;">
        <div class="sort-num" style="position:absolute;top:4px;left:4px;background:#A4924B;color:#fff;font-size:17px;font-weight:bold;padding:2px 10px;border-radius:50%;">${idx + 1}</div>
        ${card.type === 'main' ? '<div class="main-label" style="position:absolute;right:4px;top:4px;background:#4caf50;color:#fff;padding:2px 8px;border-radius:4px;font-size:15px;z-index:2;">主卡片</div>' : ''}
      </div>
      <div style="width:120px;text-align:center;margin-top:8px;display:flex;justify-content:center;gap:8px;">
        <button type="button" style="padding:4px 10px;font-size:20px;font-weight:bold;background:#A4924B;color:#fff;border:none;border-radius:6px;box-shadow:0 2px 8px #0002;cursor:pointer;min-width:36px;" onclick="moveCardLeft(${idx})">←</button>
        <button type="button" style="padding:4px 10px;font-size:20px;font-weight:bold;background:#A4924B;color:#fff;border:none;border-radius:6px;box-shadow:0 2px 8px #0002;cursor:pointer;min-width:36px;" onclick="moveCardRight(${idx})">→</button>
      </div>
    `;
    container.appendChild(div);
  });
  updatePreviewWithPromoSortable();
}

// 宣傳卡片選擇時初始化 allCardsSortable
function renderPromoCardSelector() {
  const selector = document.getElementById('promo-card-selector');
  if (!selector) return;
  selector.innerHTML = '';
  promoCardList.forEach(card => {
    const thumb = document.createElement('div');
    thumb.className = 'promo-card-thumb-select' + (selectedPromoCards.includes(card.id) ? ' selected' : '');
    thumb.style.width = '120px';
    thumb.style.height = '180px';
    thumb.style.display = 'inline-block';
    thumb.style.margin = '0 8px 8px 0';
    thumb.innerHTML = `
      <div style="width:120px;text-align:center;margin-bottom:8px;">
        <span style="display:inline-block;background:#fff;color:#222;font-size:15px;font-weight:bold;padding:2px 8px;border-radius:6px;max-width:110px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${card.main_title_1 || ''}</span>
      </div>
      <div style="position:relative;width:120px;height:120px;display:flex;align-items:center;justify-content:center;">
        <img src="${card.flex_json.body.contents[0].url}" style="width:120px;height:120px;object-fit:cover;border-radius:8px;">
      </div>
      <div style="width:120px;text-align:center;margin-top:2px;">
        <span style="display:inline-block;background:#222;color:#fff;font-size:13px;font-weight:bold;padding:2px 10px;border-radius:4px;">👁️${formatPageview(card.pageview)}</span>
      </div>
      <div class="select-label" style="text-align:center;margin-top:8px;font-size:13px;color:#4caf50;">${selectedPromoCards.includes(card.id) ? '已加入' : '點選加入'}</div>
    `;
    thumb.onclick = () => {
      const idx = selectedPromoCards.indexOf(card.id);
      if (idx === -1) {
        selectedPromoCards.push(card.id);
      } else {
        selectedPromoCards.splice(idx, 1);
      }
      initAllCardsSortable();
      renderPromoCardSelector();
      renderPromoCardListSortable();
    };
    selector.appendChild(thumb);
  });
}

// 左右移動排序函數
window.moveCardLeft = function(idx) {
  if (idx <= 0) return;
  const tmp = allCardsSortable[idx];
  allCardsSortable[idx] = allCardsSortable[idx - 1];
  allCardsSortable[idx - 1] = tmp;
  // 更新 selectedPromoCards 順序
  selectedPromoCards = allCardsSortable.filter(c => c.type === 'promo').map(c => c.id);
  renderPromoCardListSortable();
};
window.moveCardRight = function(idx) {
  if (idx >= allCardsSortable.length - 1) return;
  const tmp = allCardsSortable[idx];
  allCardsSortable[idx] = allCardsSortable[idx + 1];
  allCardsSortable[idx + 1] = tmp;
  // 更新 selectedPromoCards 順序
  selectedPromoCards = allCardsSortable.filter(c => c.type === 'promo').map(c => c.id);
  renderPromoCardListSortable();
};

// 重構 shareToLine
async function shareToLine() {
  if (!window.liff) return alert('LIFF 未載入');
  
  // 顯示分享準備提示
  alert('🚀 準備分享會員卡至LINE\n\n⚠️ 請勿封鎖跳出視窗');
  
  // 顯示載入動畫
  showShareLoading();
  
  try {
    await liff.init({ liffId });
    if (!liff.isLoggedIn()) {
      hideShareLoading();
      liff.login();
      return;
    }
    
    // **步驟1：準備分享資料並檢查點數**
    let mainCardId = null;
    let currentPoints = 0;
    try {
      const res = await fetch(`/api/cards?pageId=M01001&userId=${liffProfile.userId}`);
      const result = await res.json();
      if (result.success && result.data && result.data.length > 0) {
        mainCardId = result.data[0].id;
        currentPoints = result.data[0].user_points || 0;
      }
    } catch (e) {
      console.error('取得主卡資料失敗:', e);
    }
    
    // 建立卡片ID清單並加入位置資訊 (位置對應整體排列索引)
    const cardIdTypeArr = allCardsSortable.map((c, i) => ({ 
      id: c.id === 'main' ? mainCardId : c.id, 
      type: c.type,
      position: i // 位置就是在整體排列中的索引 (0,1,2,3,4 對應 A,B,C,D,E)
    })).filter(c => c.id);
    
    console.log('🎯 卡片位置資訊:', cardIdTypeArr.map(c => ({ type: c.type, position: c.position, id: c.id })));
    
    // 計算所需點數 (每張卡片10點)
    const requiredPoints = cardIdTypeArr.length * 10;
    
    // **點數檢查**
    if (currentPoints < requiredPoints) {
      hideShareLoading();
      alert(`❌ 點數不足無法分享\n\n目前點數: ${currentPoints}點\n需要點數: ${requiredPoints}點\n不足點數: ${requiredPoints - currentPoints}點`);
      return;
    }
    
    // **步驟2：執行分享交易 (包含pageview更新和點數處理)**
    let shareResult = null;
    if (cardIdTypeArr.length > 0) {
      try {
        const response = await fetch('/api/cards/pageview', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            cardIdTypeArr,
            includePointsTransaction: true,
            userId: liffProfile.userId
          })
        });
        
        const result = await response.json();
        if (!result.success) {
          throw new Error(result.error || '點數交易失敗');
        }
        
        shareResult = result.pointsTransaction;
        console.log('✅ 分享交易完成:', shareResult);
        
      } catch (e) {
        hideShareLoading();
        console.error('分享交易錯誤詳情:', e);
        
        // 🔧 改進錯誤訊息顯示
        let errorMessage = '❌ 分享交易失敗\n\n';
        if (e.message.includes('點數不足')) {
          errorMessage += '💰 ' + e.message + '\n\n請先儲值點數後再試。';
        } else if (e.message.includes('不存在')) {
          errorMessage += '🔍 ' + e.message + '\n\n請檢查卡片設定是否正確。';
        } else {
          errorMessage += '⚠️ ' + e.message;
        }
        
        alert(errorMessage);
        return;
      }
    }
    
    // **步驟3：使用交易結果更新資料，避免額外API調用**
    let latestPageview = getFormData().pageview;
    let latestPoints = currentPoints;
    
    if (shareResult && shareResult.pointsResults && shareResult.pointsResults.length > 0) {
      // 從交易結果中取得最新的主卡點數
      const mainCardResult = shareResult.pointsResults.find(r => r.type === 'main');
      if (mainCardResult) {
        latestPoints = mainCardResult.finalBalance;
        console.log('ShareToLine: 從交易結果取得最新點數:', latestPoints);
      }
      
      // pageview 增加 (每張卡片+1)
      latestPageview = (parseInt(getFormData().pageview) || 0) + cardIdTypeArr.length;
      console.log('ShareToLine: 計算最新pageview:', latestPageview);
    }
    
    // **步驟4：用最新資料重新生成flexJson**
    const mainIdx = allCardsSortable.findIndex(c => c.type === 'main');
    if (mainIdx !== -1) {
      allCardsSortable[mainIdx].flex_json = getMainBubble({ 
        ...getFormData(), 
        pageview: latestPageview, 
        user_points: latestPoints,
        page_id: 'M01001' 
      });
      allCardsSortable[mainIdx].img = getFormData().main_image_url || defaultCard.main_image_url;
    }
    
    const flexArr = allCardsSortable.map(c => c.flex_json);
    let flexJson;
    if (flexArr.length === 1) {
      flexJson = {
        type: 'flex',
        altText: getFormData().card_alt_title || getFormData().main_title_1 || defaultCard.main_title_1,
        contents: flexArr[0]
      };
    } else {
      flexJson = {
        type: 'flex',
        altText: getFormData().card_alt_title || getFormData().main_title_1 || defaultCard.main_title_1,
        contents: {
          type: 'carousel',
          contents: flexArr
        }
      };
    }
    
    console.log('ShareToLine: 重新生成flexJson，pageview:', latestPageview);
    
    // **清理FLEX JSON用於儲存**
    const cleanFlexJsonForSave = cleanFlexJsonForShare(flexJson);
    
    const formData = getFormData();
    const { pageview, ...formDataWithoutPageview } = formData;
    
    const response = await fetch('/api/cards', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        page_id: 'M01001',
        line_user_id: liffProfile.userId,
        ...formDataWithoutPageview,
        flex_json: cleanFlexJsonForSave,
        card_order: allCardsSortable.map(c => c.id)
      })
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || '儲存失敗');
    }
    
    // 步驟5：更新前端顯示
    if (document.getElementById('pageview')) {
      document.getElementById('pageview').value = formatPageview(latestPageview);
    }
    
    // **修復預覽更新問題：確保allCardsSortable陣列同步最新狀態**
    if (allCardsSortable && allCardsSortable.length > 0) {
      // 重新初始化allCardsSortable，確保包含最新的主卡片
      const mainCardIndex = allCardsSortable.findIndex(c => c.type === 'main');
      if (mainCardIndex !== -1) {
        // 更新主卡片的資料
        allCardsSortable[mainCardIndex] = {
          type: 'main',
          id: 'main',
          flex_json: getMainBubble({ ...getFormData(), pageview: latestPageview, page_id: 'M01001' }),
          img: getFormData().main_image_url || defaultCard.main_image_url
        };
        console.log('✅ 已更新allCardsSortable中的主卡片，pageview:', latestPageview);
      }
    }
    
    renderPreview();
    renderShareJsonBox();
    
    // **步驟6：清理FLEX JSON並分享**
    const cleanFlexJson = cleanFlexJsonForShare(flexJson);
    console.log('📤 分享清理後的FLEX JSON');
    await liff.shareTargetPicker([cleanFlexJson])
      .then(() => {
        hideShareLoading();
        window.shareConfirmed = false; // 🔧 重置確認標記
        
        // 顯示分享成功與點數交易結果
        let successMessage = '✅ 分享會員卡成功！\n\n';
        if (shareResult) {
          successMessage += '💰 分享結果：\n';
          successMessage += `• 分享卡扣除點數：10點\n`;
          
          // 詳細顯示各位置的回饋點數
          const promoCards = cardIdTypeArr.filter(c => c.type === 'promo');
          let totalReward = 0;
          
          // 🎯 新邏輯：根據主卡位置顯示回饋
          if (shareResult.rewardDetails && shareResult.rewardDetails.length > 0) {
            shareResult.rewardDetails.forEach((detail) => {
              successMessage += `• 賺取分享點(位${detail.position + 1})：${detail.reward.toFixed(1)}點\n`;
              totalReward += detail.reward;
            });
          } else if (shareResult.totalRewarded > 0) {
            totalReward = shareResult.totalRewarded;
            successMessage += `• 賺取分享點：${totalReward.toFixed(1)}點\n`;
          } else {
            // 找出主卡位置
            const mainCardPosition = cardIdTypeArr.findIndex(card => card.type === 'main');
            successMessage += `• 賺取分享點(位${mainCardPosition + 1})：0點\n`;
          }
          
          successMessage += `• 合計賺取：${totalReward.toFixed(1)}點\n`;
          successMessage += `• 分享卡目前餘點：${latestPoints}點\n\n`;
        }
        successMessage += '📝 請記得關閉本會員卡編修頁面';
        
        alert(successMessage);
        closeOrRedirect();
      })
      .catch((error) => {
        hideShareLoading();
        window.shareConfirmed = false; // 🔧 重置確認標記
        console.log('分享取消或失敗:', error);
        // 不顯示錯誤訊息，因為用戶可能主動取消分享
        closeOrRedirect();
      });
  } catch (err) {
    hideShareLoading();
    window.shareConfirmed = false; // 🔧 重置確認標記
    alert('儲存或分享失敗: ' + err.message);
  }
}

// LINE頭貼使用功能 - 簡化版本
function useLINEProfile(urlId, previewId, infoId) {
  const urlInput = document.getElementById(urlId);
  const preview = document.getElementById(previewId);
  const infoDiv = infoId ? document.getElementById(infoId) : null;
  
  if (liffProfile && liffProfile.pictureUrl) {
    // 直接將LINE頭貼URL設定到欄位
    urlInput.value = liffProfile.pictureUrl;
    setImageUserStyle(preview, liffProfile.pictureUrl);
    
    // 🆕 觸發input事件，啟動即時預覽系統
    const inputEvent = new Event('input', { bubbles: true });
    urlInput.dispatchEvent(inputEvent);
    
    // 顯示LINE頭貼資訊
    if (infoDiv) {
      infoDiv.innerHTML = `📱 LINE頭貼 | 👤 ${liffProfile.displayName}`;
      infoDiv.classList.add('show');
    }
    
    console.log('✅ 已設定LINE頭貼:', liffProfile.pictureUrl);
    
    // 🔧 修復：確保LINE頭貼被包含在表單資料中
    const formEvent = new Event('input', { bubbles: true });
    urlInput.dispatchEvent(formEvent);
    
    renderPreview();
    renderShareJsonBox();
  } else {
    alert('無法取得LINE頭貼，請確認已登入LINE');
  }
}

// 監聽 display_name、main_title_1 input 變動，自動更新 card_alt_title
function updateCardAltTitle() {
  const mainTitle = document.getElementById('main_title_1').value;
  const displayName = document.getElementById('display_name').value;
  if(document.getElementById('card_alt_title'))
    document.getElementById('card_alt_title').value = mainTitle + '/' + displayName;
  renderPreview();
  renderShareJsonBox();
}

// **統一的DOMContentLoaded初始化**
window.addEventListener('DOMContentLoaded', function() {
  console.log('🚀 DOMContentLoaded: 開始初始化...');
  
  // 1. 綁定主標題和名字的變動監聽
  if(document.getElementById('display_name'))
    document.getElementById('display_name').addEventListener('input', updateCardAltTitle);
  if(document.getElementById('main_title_1'))
    document.getElementById('main_title_1').addEventListener('input', updateCardAltTitle);
  
  // 2. 綁定所有表單欄位的即時預覽功能
  const formInputs = document.querySelectorAll('#cardForm input[type="text"], #cardForm input[type="url"], #cardForm input[type="color"]');
  console.log('🔧 綁定即時預覽，找到欄位數量:', formInputs.length);
  
  formInputs.forEach((input, index) => {
    console.log(`🔧 綁定欄位 ${index + 1}: ${input.id || input.name || 'unnamed'}`);
    input.addEventListener('input', function(e) {
      console.log('🔄 欄位變動觸發預覽更新:', e.target.id || e.target.name);
      renderPreview();
      renderShareJsonBox();
    });
  });

  // 3. 添加表單提交監聽器實現儲存功能
  const cardForm = document.getElementById('cardForm');
  if (cardForm) {
    cardForm.addEventListener('submit', async function(e) {
      e.preventDefault();
      console.log('📝 表單提交事件觸發，開始儲存...');
      
      // 檢查LIFF登入狀態
      if (!liffProfile.userId) {
        alert('請先登入 LINE');
        return;
      }
      
      try {
        // 顯示載入狀態
        const submitButton = cardForm.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        submitButton.textContent = '儲存中...';
        submitButton.disabled = true;
        
        const formData = getFormData();
        
        // 自動更新card_alt_title
        if (!formData.card_alt_title && formData.main_title_1 && formData.display_name) {
          formData.card_alt_title = `${formData.main_title_1}/${formData.display_name}`;
          document.getElementById('card_alt_title').value = formData.card_alt_title;
        }
        
        // 生成FLEX JSON
        let flexJson;
        if (allCardsSortable && allCardsSortable.length > 1) {
          // 多卡片模式：生成carousel
          const mainCardIndex = allCardsSortable.findIndex(c => c.type === 'main');
          if (mainCardIndex !== -1) {
            allCardsSortable[mainCardIndex].flex_json = getMainBubble({ ...formData, page_id: 'M01001' });
            allCardsSortable[mainCardIndex].img = formData.main_image_url || defaultCard.main_image_url;
          }
          
          const flexArr = allCardsSortable.map(c => c.flex_json);
          flexJson = {
            type: 'flex',
            altText: formData.card_alt_title || formData.main_title_1 || defaultCard.main_title_1,
            contents: {
              type: 'carousel',
              contents: flexArr
            }
          };
        } else {
          // 單卡片模式
          flexJson = {
            type: 'flex',
            altText: formData.card_alt_title || formData.main_title_1 || defaultCard.main_title_1,
            contents: getMainBubble({ ...formData, page_id: 'M01001' })
          };
        }
        
        // 清理FLEX JSON用於儲存
        const cleanFlexJsonForSave = cleanFlexJsonForShare(flexJson);
        
        // 準備儲存資料
        const saveData = {
          page_id: 'M01001',
          line_user_id: liffProfile.userId,
          ...formData,
          flex_json: cleanFlexJsonForSave,
          card_order: allCardsSortable ? allCardsSortable.map(c => c.id) : ['main']
        };
        
        console.log('💾 準備儲存資料:', saveData);
        
        // 發送API請求
        const response = await fetch('/api/cards', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(saveData)
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || '儲存失敗');
        }
        
        const result = await response.json();
        console.log('✅ 儲存成功:', result);
        
        // 顯示成功訊息
        alert('🎉 會員卡儲存成功！\n\n📝 請記得關閉本會員卡編修頁面');
        
        // 更新預覽
        renderPreview();
        renderShareJsonBox();
        
      } catch (error) {
        console.error('❌ 儲存失敗:', error);
        alert('儲存失敗：' + error.message);
      } finally {
        // 恢復按鈕狀態
        const submitButton = cardForm.querySelector('button[type="submit"]');
        submitButton.textContent = '儲存卡片';
        submitButton.disabled = false;
      }
    });
    
    console.log('✅ 表單提交監聽器已綁定');
  } else {
    console.error('❌ 找不到cardForm元素');
  }

  // 4. 綁定圖片上傳功能（包含資訊顯示）
  bindImageUpload('main_image_upload', 'main_image_upload_btn', 'main_image_preview', 'main_image_url', 'main_image_info');
  bindImageUpload('snow_image_upload', 'snow_image_upload_btn', 'snow_image_preview', 'snow_image_url', 'snow_image_info');
  bindImageUpload('calendar_image_upload', 'calendar_image_upload_btn', 'calendar_image_preview', 'calendar_image_url', 'calendar_image_info');
  bindImageUpload('love_icon_upload', 'love_icon_upload_btn', 'love_icon_preview', 'love_icon_url', 'love_icon_info');
  bindImageUpload('member_image_upload', 'member_image_upload_btn', 'member_image_preview', 'member_image_url', 'member_image_info');
  
  // 5. 綁定圖片選擇功能
  bindImageSelect('main_image_select_btn', 'main_image_url', 'main_image_preview');
  bindImageSelect('snow_image_select_btn', 'snow_image_url', 'snow_image_preview');
  bindImageSelect('calendar_image_select_btn', 'calendar_image_url', 'calendar_image_preview');
  bindImageSelect('love_icon_select_btn', 'love_icon_url', 'love_icon_preview');
  bindImageSelect('member_image_select_btn', 'member_image_url', 'member_image_preview');
  
  // 6. 綁定LINE頭貼功能（僅會員圖片）
  const lineProfileBtn = document.getElementById('member_line_profile_btn');
  if (lineProfileBtn) {
    lineProfileBtn.addEventListener('click', function() {
      useLINEProfile('member_image_url', 'member_image_preview', 'member_image_info');
    });
    console.log('✅ LINE頭貼按鈕已綁定');
  }

  // 5. 展開/收合宣傳卡片選擇區塊
  const toggleBtn = document.getElementById('toggle-promo-selector');
  const selector = document.getElementById('promo-card-selector');
  if (toggleBtn && selector) {
    toggleBtn.onclick = function() {
      if (selector.style.display === 'none') {
        selector.style.display = '';
        toggleBtn.textContent = '收合 <<';
      } else {
        selector.style.display = 'none';
        toggleBtn.textContent = '點選加入 >>';
      }
    };
  }

  // 6. 載入宣傳卡片
  loadPromoCards();
  
  // 7. 🎮 新增：初始化預覽區域左右滑動導航
  initPreviewNavigation();
  
  // 8. 初始化圖片庫模態框
  initImageLibraryModal();
  
  // 🔧 移除此處的圖片預覽初始化，移到表單資料填入後執行
  console.log('🔧 圖片預覽初始化將在表單資料填入後執行...');
  
  console.log('✅ DOMContentLoaded: 初始化完成');
});

// 圖片上傳功能
// 更新後的圖片上傳函數，支援檔案資訊顯示
function bindImageUpload(inputId, btnId, previewId, urlId, infoId) {
  const input = document.getElementById(inputId);
  const btn = document.getElementById(btnId);
  const preview = document.getElementById(previewId);
  const urlInput = document.getElementById(urlId);
  const infoDiv = infoId ? document.getElementById(infoId) : null;
  
  // 預設圖
  setImageDefaultStyle(preview, urlInput.value || preview.src);
  
  // 顯示圖片資訊
  function showImageInfo(fileName, width, height, fileSize) {
    if (!infoDiv) return;
    const fileSizeKB = Math.round(fileSize / 1024);
    const fileSizeMB = (fileSize / (1024 * 1024)).toFixed(2);
    const sizeText = fileSizeKB > 1024 ? `${fileSizeMB}MB` : `${fileSizeKB}KB`;
    
    infoDiv.innerHTML = `📁 ${fileName} | 📐 ${width}×${height} | 📦 ${sizeText}`;
    infoDiv.classList.add('show');
  }
  
  // 隱藏圖片資訊
  function hideImageInfo() {
    if (!infoDiv) return;
    infoDiv.classList.remove('show');
  }
  
  // 檔案選擇事件
  input.addEventListener('change', function() {
    if (input.files && input.files[0]) {
      const reader = new FileReader();
      reader.onload = function(e) {
        setImageUserStyle(preview, e.target.result);
        // 檔案選擇時暫時顯示基本資訊
        const file = input.files[0];
        if (infoDiv) {
          const fileSizeKB = Math.round(file.size / 1024);
          const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2);
          const sizeText = fileSizeKB > 1024 ? `${fileSizeMB}MB` : `${fileSizeKB}KB`;
          infoDiv.innerHTML = `📁 ${file.name} | 📦 ${sizeText} (準備上傳...)`;
          infoDiv.classList.add('show');
        }
      };
      reader.readAsDataURL(input.files[0]);
    } else {
      hideImageInfo();
    }
  });
  
  // 上傳按鈕點擊事件
  btn.addEventListener('click', async function() {
    if (!input.files || !input.files[0]) {
      alert('請選擇圖片');
      return;
    }
    const file = input.files[0];
    const reader = new FileReader();
    reader.onload = async function(e) {
      try {
        if (infoDiv) {
          infoDiv.innerHTML = '⏳ 正在上傳...';
        }
        
        const response = await fetch('/api/upload', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            file: e.target.result,
            fileName: file.name,
            fileType: file.type,
            userId: liffProfile?.userId || null,
          }),
        });
        const data = await response.json();
        if (!data.success) {
          throw new Error(data.error || '上傳失敗');
        }
        if (data.data?.url) {
          urlInput.value = data.data.url;
          setImageUserStyle(preview, data.data.url);
          
          // 🆕 觸發input事件，啟動即時預覽系統
          const inputEvent = new Event('input', { bubbles: true });
          urlInput.dispatchEvent(inputEvent);
          
          // 顯示完整的圖片資訊
          showImageInfo(
            data.data.fileName,
            data.data.width || 0,
            data.data.height || 0,
            data.data.fileSize
          );
          
          renderPreview();
        } else {
          throw new Error('未收到上傳 URL');
        }
      } catch (error) {
        console.error('Upload failed:', error);
        alert(error.message || '上傳失敗，請重試');
        hideImageInfo();
      }
    };
    reader.readAsDataURL(file);
  });
  
  // URL輸入框變化時隱藏資訊（因為可能是手動輸入的URL）
  urlInput.addEventListener('input', function() {
    if (!input.files || !input.files[0]) {
      hideImageInfo();
    }
  });
}

// 宣傳卡片功能
let promoCardList = [];
let selectedPromoCards = [];

// 載入宣傳卡片時同時渲染 selector
async function loadPromoCards() {
  try {
    const res = await fetch('/api/promo-cards');
    const result = await res.json();
    if (result.success && Array.isArray(result.data)) {
      promoCardList = result.data;
      renderPromoCardSelector();
      initAllCardsSortable();
      renderPromoCardListSortable();
      
      // **修復問題2：在宣傳卡片載入完成後處理card_order排序**
      if (window.pendingCardData) {
        const cardData = window.pendingCardData;
        console.log('處理暫存的卡片資料:', cardData);
        console.log('card_order:', cardData.card_order);
        
        // 處理已載入的卡片資料的排序
        if (cardData.card_order && Array.isArray(cardData.card_order)) {
          const cardOrder = cardData.card_order;
          let newAllCards = [];
          let newSelectedPromo = [];
          
          console.log('按照card_order重建卡片:', cardOrder);
          
          // 按照card_order順序重建卡片陣列
          cardOrder.forEach(cardId => {
            if (cardId === 'main') {
              // 主卡片
              newAllCards.push({ 
                type: 'main', 
                id: 'main', 
                flex_json: getMainBubble(getFormData()), 
                img: getFormData().main_image_url || defaultCard.main_image_url 
              });
              console.log('加入主卡片');
            } else {
              // 宣傳卡片 - 從promoCardList中找到對應的卡片
              const found = promoCardList.find(c => c.id === cardId);
              if (found) {
                // **關鍵修復：為宣傳卡片的flex_json加入_cardId標識**
                const promoFlexJson = JSON.parse(JSON.stringify(found.flex_json)); // 深度複製
                promoFlexJson._cardId = found.id; // 加入宣傳卡片ID
                promoFlexJson._cardType = 'promo'; // 標示為宣傳卡片
                console.log('🏷️ card_order重建：為宣傳卡片加入標識:', found.id);
                
                newAllCards.push({ 
                  type: 'promo', 
                  id: found.id, 
                  flex_json: promoFlexJson, 
                  img: found.flex_json.body.contents[0].url 
                });
                newSelectedPromo.push(found.id);
                console.log('加入宣傳卡片:', found.id, found.main_title_1);
              } else {
                console.log('找不到宣傳卡片:', cardId);
              }
            }
          });
          
          console.log('最終卡片陣列:', newAllCards);
          console.log('最終選中的宣傳卡片:', newSelectedPromo);
          
          if (newAllCards.length > 0) {
            allCardsSortable = newAllCards;
            selectedPromoCards = newSelectedPromo;
            renderPromoCardSelector(); // **修復問題2-2：重新渲染選擇器以正確顯示狀態**
            renderPromoCardListSortable();
            console.log('卡片排序處理完成');
          }
        } else {
          console.log('沒有有效的card_order數據');
        }
        delete window.pendingCardData; // 清除暫存資料
      } else {
        console.log('沒有找到暫存的卡片資料');
      }
    }
  } catch (e) {
    console.error('載入宣傳卡片失敗', e);
  }
}

function updatePreviewWithPromoSortable() {
  // 依照排序後的 allCardsSortable 組合 carousel
  const flexArr = allCardsSortable.map(c => c.flex_json);
  let flexJson;
  if (flexArr.length === 1) {
    flexJson = {
      type: 'flex',
      altText: getFormData().card_alt_title || getFormData().main_title_1 || defaultCard.main_title_1,
      contents: flexArr[0]
    };
  } else {
    flexJson = {
      type: 'flex',
      altText: getFormData().card_alt_title || getFormData().main_title_1 || defaultCard.main_title_1,
      contents: {
        type: 'carousel',
        contents: flexArr
      }
    };
  }
  
  // 🔧 修正：使用chatbox容器進行flex2html渲染
  const preview = document.getElementById('main-card-preview');
  let chatbox = preview.querySelector('.chatbox');
  if (!chatbox) {
    chatbox = document.createElement('div');
    chatbox.className = 'chatbox';
    preview.appendChild(chatbox);
  }
  chatbox.innerHTML = '';
  
  // 創建一個臨時ID並渲染
  const tempId = 'temp-chatbox-' + Date.now();
  chatbox.id = tempId;
  flex2html(tempId, flexJson);
  
  renderShareJsonBox();
}

function renderShareJsonBoxWithPromoSortable(flexJson) {
  const box = document.getElementById('shareJsonBox');
  if (!box) return;
  box.innerHTML = '';
  const title = document.createElement('div');
  title.textContent = '即將分享的 Flex Message JSON（可複製）';
  title.style.cssText = 'font-weight:bold;font-size:16px;margin-bottom:8px;';
  box.appendChild(title);
  const pre = document.createElement('pre');
  pre.textContent = JSON.stringify(flexJson, null, 2);
  pre.style.cssText = 'font-size:14px;line-height:1.5;user-select:text;white-space:pre-wrap;word-break:break-all;background:#fff;padding:10px;border-radius:4px;max-height:300px;overflow:auto;';
  box.appendChild(pre);
  const copyBtn = document.createElement('button');
  copyBtn.textContent = '一鍵複製';
  copyBtn.style.cssText = 'margin:8px 0 0 0;padding:6px 16px;background:#4CAF50;color:#fff;border:none;border-radius:4px;cursor:pointer;font-size:15px;';
  copyBtn.onclick = () => {
    navigator.clipboard.writeText(pre.textContent).then(() => {
      copyBtn.textContent = '已複製!';
      setTimeout(()=>{copyBtn.textContent='一鍵複製';},1200);
    });
  };
  box.appendChild(copyBtn);
}

// 在所有顯示 pageview 的地方補零
function formatPageview(val) {
  return String(val || 0).padStart(4, '0');
}

// 新增 safeFetchJson 函數
async function safeFetchJson(url) {
  const res = await fetch(url);
  const text = await res.text();
  try {
    return JSON.parse(text);
  } catch (e) {
    return { success: false, error: 'API 回傳非 JSON', raw: text };
  }
}

// 🎮 新增：預覽區域左右滑動導航功能
function initPreviewNavigation() {
  const previewContainer = document.querySelector('.preview-container');
  const previewElement = document.getElementById('main-card-preview');
  const leftBtn = document.getElementById('preview-nav-left');
  const rightBtn = document.getElementById('preview-nav-right');
  
  if (!previewContainer || !previewElement || !leftBtn || !rightBtn) {
    console.log('⚠️ 預覽導航元素未找到:', {
      previewContainer: !!previewContainer,
      previewElement: !!previewElement,
      leftBtn: !!leftBtn,
      rightBtn: !!rightBtn
    });
    return;
  }
  
  // 滑動距離
  const scrollAmount = 200;
  
  // 🔧 修復：強制按鈕始終可見
  function ensureButtonsVisible() {
    leftBtn.style.display = 'block';
    rightBtn.style.display = 'block';
    leftBtn.style.opacity = '0.8';
    rightBtn.style.opacity = '0.8';
    previewContainer.classList.add('scrollable');
    console.log('🎮 確保按鈕可見');
  }
  
  // 左滑按鈕點擊事件
  leftBtn.addEventListener('click', function() {
    console.log('🔄 左滑按鈕點擊');
    previewElement.scrollBy({
      left: -scrollAmount,
      behavior: 'smooth'
    });
    setTimeout(updateNavButtons, 100);
  });
  
  // 右滑按鈕點擊事件
  rightBtn.addEventListener('click', function() {
    console.log('🔄 右滑按鈕點擊');
    previewElement.scrollBy({
      left: scrollAmount,
      behavior: 'smooth'
    });
    setTimeout(updateNavButtons, 100);
  });
  
  // 🔧 修復：簡化按鈕狀態更新邏輯
  function updateNavButtons() {
    // 先確保按鈕可見
    ensureButtonsVisible();
    
    const { scrollLeft, scrollWidth, clientWidth } = previewElement;
    
    console.log('🎮 導航按鈕狀態檢查:', {
      scrollLeft,
      scrollWidth,
      clientWidth
    });
    
    // 簡化邏輯：只更新啟用/禁用狀態，不隱藏按鈕
    leftBtn.disabled = scrollLeft <= 5;
    rightBtn.disabled = scrollLeft >= scrollWidth - clientWidth - 5;
    
    console.log('🎮 按鈕狀態:', {
      leftDisabled: leftBtn.disabled,
      rightDisabled: rightBtn.disabled
    });
  }
  
  // 監聽滾動事件更新按鈕狀態
  previewElement.addEventListener('scroll', updateNavButtons);
  
  // 監聽窗口大小變化
  window.addEventListener('resize', () => {
    ensureButtonsVisible();
    setTimeout(updateNavButtons, 100);
  });
  
  // 監聽預覽內容變化（當渲染新內容時）
  const observer = new MutationObserver(function() {
    console.log('🔄 預覽內容變化，確保按鈕可見');
    setTimeout(() => {
      ensureButtonsVisible();
      updateNavButtons();
    }, 100);
  });
  
  observer.observe(previewElement, {
    childList: true,
    subtree: true
  });
  
  // 立即顯示按鈕
  ensureButtonsVisible();
  
  // 定期確保按鈕可見（防止被其他邏輯隱藏）
  setInterval(ensureButtonsVisible, 3000);
  
  console.log('🎮 預覽導航功能已初始化，按鈕應該始終可見');
}

// 💫 分享載入動畫功能
function showShareLoading() {
  // 創建載入遮罩
  let loadingOverlay = document.getElementById('shareLoadingOverlay');
  if (!loadingOverlay) {
    loadingOverlay = document.createElement('div');
    loadingOverlay.id = 'shareLoadingOverlay';
    loadingOverlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0,0,0,0.7);
      z-index: 9999;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      color: white;
      font-size: 18px;
    `;
    
    loadingOverlay.innerHTML = `
      <div style="text-align: center;">
        <div style="width: 60px; height: 60px; border: 6px solid #f3f3f3; border-top: 6px solid #4caf50; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto 20px;"></div>
        <div>🎨 卡片製作中...</div>
        <div style="font-size: 14px; margin-top: 10px; color: #ccc;">請稍候，正在準備您的會員卡</div>
      </div>
      <style>
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      </style>
    `;
    
    document.body.appendChild(loadingOverlay);
  }
  
  loadingOverlay.style.display = 'flex';
  console.log('✨ 顯示分享載入動畫');
}

function hideShareLoading() {
  const loadingOverlay = document.getElementById('shareLoadingOverlay');
  if (loadingOverlay) {
    loadingOverlay.style.display = 'none';
  }
  console.log('✨ 隱藏分享載入動畫');
}

// 📸 圖片庫選擇功能
let currentSelectTarget = null; // 當前要設定圖片的目標

function bindImageSelect(selectBtnId, urlInputId, previewId) {
  const selectBtn = document.getElementById(selectBtnId);
  const urlInput = document.getElementById(urlInputId);
  const preview = document.getElementById(previewId);
  
  console.log('🔍 綁定圖片選擇按鈕:', selectBtnId, '找到元素:', !!selectBtn);
  
  if (selectBtn) {
    selectBtn.addEventListener('click', function() {
      console.log('🔍 圖片選擇按鈕被點擊:', selectBtnId);
      
      // 記錄目標欄位
      currentSelectTarget = {
        urlInput: urlInput,
        preview: preview
      };
      
      console.log('🔍 設定目標欄位:', {
        urlInput: !!urlInput,
        preview: !!preview
      });
      
      // 顯示圖片庫模態框
      showImageLibrary();
    });
  } else {
    console.error('❌ 找不到圖片選擇按鈕:', selectBtnId);
  }
}

// 🔧 測試函數 - 手動觸發圖片庫
window.testImageLibrary = function() {
  console.log('🧪 手動測試圖片庫功能');
  console.log('🧪 當前liffProfile:', liffProfile);
  
  // 設定一個假的目標（測試用）
  currentSelectTarget = {
    urlInput: { value: '' },
    preview: { src: '' }
  };
  
  showImageLibrary();
};

function initImageLibraryModal() {
  const modal = document.getElementById('imageLibraryModal');
  const closeBtn = modal.querySelector('.close-modal');
  
  if (!modal || !closeBtn) {
    console.log('圖片庫模態框元素未找到');
    return;
  }
  
  // 關閉按鈕事件
  closeBtn.addEventListener('click', hideImageLibrary);
  
  // 點擊背景關閉
  modal.addEventListener('click', function(e) {
    if (e.target === modal) {
      hideImageLibrary();
    }
  });
  
  console.log('✅ 圖片庫模態框已初始化');
}

async function showImageLibrary() {
  console.log('=== 圖片庫調試開始 ===');
  
  const modal = document.getElementById('imageLibraryModal');
  const grid = document.getElementById('imageLibraryGrid');
  
  console.log('Modal元素存在:', !!modal);
  console.log('Grid元素存在:', !!grid);
  
  if (!modal || !grid) {
    console.error('找不到圖片庫元素');
    alert('錯誤: 找不到圖片庫元素');
    return;
  }

  // 顯示模態框
  modal.style.display = 'block';
  
  // 顯示載入中
  grid.innerHTML = '<div style="text-align:center;padding:20px;color:#666;">📸 載入圖片庫中...</div>';
  
  try {
    // 檢查登入狀態
    console.log('檢查登入狀態...');
    console.log('liffProfile:', liffProfile);
    
    if (!liffProfile || !liffProfile.userId) {
      console.error('用戶未登入');
      grid.innerHTML = '<div style="text-align:center;padding:20px;color:#f44336;">❌ 請先登入 LINE</div>';
      alert('錯誤: 請先登入LINE');
      return;
    }
    
    console.log('用戶ID:', liffProfile.userId);
    
    // 獲取用戶圖片列表
    const apiUrl = '/api/uploaded-images?userId=' + liffProfile.userId;
    console.log('API請求URL:', apiUrl);
    
    const response = await fetch(apiUrl);
    console.log('API響應狀態:', response.status, response.statusText);
    console.log('API響應Headers:', response.headers.get('content-type'));
    
    if (!response.ok) {
      const httpError = 'HTTP ' + response.status + ': ' + response.statusText;
      console.error('HTTP錯誤:', httpError);
      throw new Error(httpError);
    }
    
    const responseText = await response.text();
    console.log('原始響應前200字:', responseText.substring(0, 200));
    console.log('完整響應內容:', responseText);
    
    let result;
    try {
      result = JSON.parse(responseText);
      console.log('JSON解析成功');
    } catch (parseError) {
      console.error('JSON解析失敗:', parseError);
      throw new Error('JSON解析錯誤: ' + parseError.message);
    }
    
    if (!result.success) {
      console.error('API回傳失敗:', result.message);
      throw new Error(result.message || 'API操作失敗');
    }
    
    const images = result.data || [];
    
    if (images.length === 0) {
      grid.innerHTML = '<div style="text-align:center;padding:20px;color:#666;">📷 暫無已上傳的圖片<br><small>請先上傳圖片後再使用此功能</small></div>';
      return;
    }
    
    // 渲染圖片列表
    grid.innerHTML = images.map(function(img) {
      if (img.type === 'placeholder' || !img.url) {
        return '<div style="text-align:center;padding:20px;color:#666;grid-column:1/-1;">📷 ' + img.name + '<br><small>請先上傳並使用圖片，然後就可以在此重複選擇</small></div>';
      }
      
      // 處理檔案大小顯示
      let sizeText = '';
      if (img.file_size && img.file_size > 0) {
        const sizeKB = Math.round(img.file_size / 1024);
        const sizeMB = (img.file_size / (1024 * 1024)).toFixed(2);
        sizeText = sizeKB > 1024 ? `${sizeMB}MB` : `${sizeKB}KB`;
      }
      
      // 處理尺寸顯示
      let dimensionText = '';
      if (img.width && img.height && img.width > 0 && img.height > 0) {
        dimensionText = `${img.width}×${img.height}`;
      }
      
      // 組合資訊文字
      let infoText = '';
      if (dimensionText && sizeText) {
        infoText = `📐 ${dimensionText} | 📦 ${sizeText}`;
      } else if (dimensionText) {
        infoText = `📐 ${dimensionText}`;
      } else if (sizeText) {
        infoText = `📦 ${sizeText}`;
      }
      
      // 檢查是否為LINE頭貼
      const isLineProfile = img.name && img.name.includes('LINE_profile');
      const profileIcon = isLineProfile ? '📱 ' : '';
      
      return '<div class="image-library-item">' +
        '<div onclick="selectImage(\'' + img.url + '\')" style="cursor:pointer;">' +
        '<img src="' + img.url + '" alt="' + img.name + '" loading="lazy">' +
        '<div class="name" style="font-size:12px;margin-top:4px;text-align:center;">' + 
          profileIcon + img.name + 
          (infoText ? '<br><span style="color:#666;font-size:10px;">' + infoText + '</span>' : '') +
        '</div>' +
        '</div>' +
        '<button onclick="deleteImage(\'' + img.url + '\', event)" style="position:absolute;top:5px;right:5px;background:#f44336;color:white;border:none;border-radius:50%;width:24px;height:24px;font-size:12px;cursor:pointer;" title="刪除此圖片">×</button>' +
        '</div>';
    }).join('');
    
    console.log('載入了', images.length, '張圖片');
    
  } catch (error) {
    console.error('圖片庫載入失敗:', error);
    console.error('錯誤類型:', error.name);
    console.error('錯誤訊息:', error.message);
    
    alert('圖片庫載入失敗:\n\n' + error.message + '\n\n請查看F12 Console獲取詳細信息');
    
    let errorMessage = error.message;
    if (errorMessage.includes('HTTP 404')) {
      errorMessage = '圖片庫API未找到';
    } else if (errorMessage.includes('HTTP 500')) {
      errorMessage = '伺服器錯誤，請稍後再試';
    }
    
    grid.innerHTML = '<div style="text-align:center;padding:20px;color:#f44336;">' +
      '❌ 載入失敗<br>' +
      '<strong>錯誤:</strong> ' + errorMessage + '<br>' +
            '<button onclick="showImageLibrary()" style="margin-top:10px;padding:8px 16px;background:#4caf50;color:white;border:none;border-radius:4px;cursor:pointer;">重試</button>' +
      '</div>';
  }
}

function hideImageLibrary() {
  const modal = document.getElementById('imageLibraryModal');
  modal.style.display = 'none';
  currentSelectTarget = null;
}

function selectImage(imageUrl) {
  if (currentSelectTarget) {
    // 設定URL到目標欄位
    currentSelectTarget.urlInput.value = imageUrl;
    
    // 更新預覽圖片
    setImageUserStyle(currentSelectTarget.preview, imageUrl);
    
    // 🆕 觸發input事件，啟動即時預覽系統
    const inputEvent = new Event('input', { bubbles: true });
    currentSelectTarget.urlInput.dispatchEvent(inputEvent);
    
    // 觸發預覽更新
    renderPreview();
    renderShareJsonBox();
    
    // 關閉模態框
    hideImageLibrary();
    
    // 提示成功
    console.log('✅ 已選擇圖片:', imageUrl);
    alert('✅ 圖片選擇成功！');
  }
}

// 🗑️ 刪除圖片功能
async function deleteImage(imageUrl, event) {
  // 防止冒泡觸發選擇
  event.stopPropagation();
  
  if (!confirm('確定要刪除這張圖片嗎？\n\n這將從所有會員卡記錄中移除此圖片。')) {
    return;
  }
  
  console.log('🗑️ 準備刪除圖片:', imageUrl);
  
  try {
    // 檢查登入狀態
    if (!liffProfile.userId) {
      alert('請先登入 LINE');
      return;
    }
    
    // 調用刪除API
    const response = await fetch('/api/image-management', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        userId: liffProfile.userId,
        action: 'delete',
        imageUrl: imageUrl
      })
    });
    
    const result = await response.json();
    console.log('🔍 刪除API響應:', result);
    
    if (!response.ok || !result.success) {
      throw new Error(result.message || '刪除失敗');
    }
    
    alert(`✅ 圖片刪除成功！\n\n已從 ${result.updatedRecords} 個會員卡記錄中移除。`);
    
    // 重新載入圖片庫
    showImageLibrary();
    
  } catch (error) {
    console.error('❌ 刪除圖片失敗:', error);
    alert('刪除失敗: ' + error.message);
  }
}

// 🧪 測試函數 - 供用戶手動調試使用
function testImageLibrary() {
  console.log('=== 手動測試圖片庫功能 ===');
  alert('🧪 開始手動測試\n\n請在F12 Console觀察輸出信息');
  showImageLibrary();
}

// 🧪 深度診斷測試函數
async function testImageLibraryDeep() {
  console.log('=== 深度診斷測試開始 ===');
  alert('🔍 開始深度診斷\n\n請查看F12 Console獲取詳細信息');
  
  if (!liffProfile || !liffProfile.userId) {
    console.error('❌ 用戶未登入，無法進行測試');
    alert('❌ 錯誤：用戶未登入\n\n請先登入LINE後再測試');
    return;
  }
  
  try {
    console.log('🔍 開始調用診斷API...');
    const testUrl = '/api/test-uploaded-images?userId=' + liffProfile.userId;
    console.log('🔍 診斷API URL:', testUrl);
    
    const response = await fetch(testUrl);
    console.log('🔍 診斷API響應狀態:', response.status, response.statusText);
    
    const result = await response.json();
    console.log('🔍 診斷API結果:', result);
    
    if (result.success) {
      console.log('🔍 診斷測試完成！結果如下：');
      result.results.tests.forEach((test, index) => {
        console.log(`  測試${index + 1}: ${test.name}`);
        console.log(`    - 成功: ${test.success ? '✅' : '❌'}`);
        console.log(`    - 錯誤: ${test.error || '無'}`);
        if (test.count !== undefined) {
          console.log(`    - 資料筆數: ${test.count}`);
        }
      });
      
      alert('🔍 診斷測試完成！\n\n請查看F12 Console獲取詳細結果');
    } else {
      console.error('❌ 診斷測試失敗:', result.message);
      alert('❌ 診斷測試失敗\n\n' + result.message);
    }
    
  } catch (error) {
    console.error('❌ 診斷測試異常:', error);
    alert('❌ 診斷測試異常\n\n' + error.message);
  }
}

// 🧪 簡單API測試函數
async function testSimpleAPI() {
  console.log('=== 簡單API測試開始 ===');
  alert('🧪 測試基本API功能\n\n請查看F12 Console');
  
  try {
    console.log('🔍 調用簡單測試API...');
    const response = await fetch('/api/simple-test?test=123');
    console.log('🔍 簡單API響應狀態:', response.status, response.statusText);
    
    const result = await response.json();
    console.log('🔍 簡單API結果:', result);
    
    if (result.success) {
      console.log('✅ 簡單API測試成功！');
      console.log('環境變數狀態:', result.environment);
      alert('✅ 簡單API測試成功！\n\n請查看Console獲取詳細信息');
    } else {
      console.error('❌ 簡單API測試失敗:', result);
      alert('❌ 簡單API測試失敗\n\n' + (result.error || '未知錯誤'));
    }
    
  } catch (error) {
    console.error('❌ 簡單API測試異常:', error);
    alert('❌ 簡單API測試異常\n\n' + error.message);
  }
}

 