// 📱 手機版會員卡專用JS - 基於member-card-simple.js優化
// 🔧 使用相同的資料庫和API，但針對手機版介面優化

// 預設卡片資料
const defaultCard = {
  main_image_url: 'https://barv3.vercel.app/uploads/vip/TS-VIP.png',
  snow_image_url: 'https://barv3.vercel.app/uploads/vip/APNG1.png',
  main_image_link: 'https://lin.ee/JLLIBlP',
  calendar_image_url: 'https://barv3.vercel.app/uploads/vip/icon_calendar.png',
  calendar_image_link: 'https://lin.ee/JLLIBlP',
  amember_id: 'M01001',
  love_icon_url: 'https://barv3.vercel.app/uploads/vip/loveicon.png',
  love_icon_link: 'https://lin.ee/JLLIBlP',
  pageview: 888,
  main_title_1: '我在呈璽/呈璽',
  main_title_1_color: '#000000',
  main_title_2: '我是呈璽VIP會員',
  main_title_2_color: '#000000',
  member_image_url: 'https://barv3.vercel.app/uploads/vip/202506A01.jpg',
  member_image_link: 'https://lin.ee/JLLIBlP',
  display_name: '呈璽VIP會員',
  name_color1: '#A4924C',
  button_1_text: '加呈璽好友',
  button_1_url: 'https://lin.ee/JLLIBlP',
  button_1_color: '#A4924A',
  s_button_text: '分享給好友',
  s_button_url: 'https://liff.line.me/2007327814-DGly5XNk?pageId=M01001', // 🔧 使用手機版LIFF ID
  s_button_color: '#A4924B',
  card_alt_title: '我在呈璽/呈璽'
};

// 取得 LINE 頭像與名字
let liffProfile = { displayName: '', pictureUrl: '', userId: '' };
const liffId = '2007327814-DGly5XNk'; // 🔧 手機版專用LIFF ID

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

// 🔧 手機版優化：設定輸入欄位預設值（簡化版）
function setInputDefault(inputId, value) {
  const input = document.getElementById(inputId);
  if (input) {
    setInputDefaultStyle(input, value);
  }
}

// 🔧 手機版優化：填入所有預設值
function fillAllFieldsWithDefault() {
  console.log('📱 手機版：填入預設卡片資料');
  
  // 基本欄位
  setInputDefault('card_alt_title', defaultCard.card_alt_title);
  setInputDefault('main_image_url', defaultCard.main_image_url);
  setInputDefault('main_image_link', defaultCard.main_image_link);
  setInputDefault('main_title_1', defaultCard.main_title_1);
  setInputDefault('main_title_2', defaultCard.main_title_2);
  setInputDefault('member_image_url', defaultCard.member_image_url);
  setInputDefault('member_image_link', defaultCard.member_image_link);
  setInputDefault('display_name', defaultCard.display_name);
  setInputDefault('button_1_text', defaultCard.button_1_text);
  setInputDefault('button_1_url', defaultCard.button_1_url);
  setInputDefault('s_button_text', defaultCard.s_button_text);
  setInputDefault('s_button_url', defaultCard.s_button_url);
  
  // 顏色欄位
  document.getElementById('main_title_1_color').value = defaultCard.main_title_1_color;
  document.getElementById('main_title_2_color').value = defaultCard.main_title_2_color;
  document.getElementById('name_color1').value = defaultCard.name_color1;
  document.getElementById('button_1_color').value = defaultCard.button_1_color;
  document.getElementById('s_button_color').value = defaultCard.s_button_color;
  
  // 更新圖片預覽
  updateImagePreview('main_image_url', 'main_image_preview');
  updateImagePreview('member_image_url', 'member_image_preview');
  
  console.log('✅ 手機版：預設資料填入完成');
}

// 🔧 手機版優化：更新圖片預覽
function updateImagePreview(urlInputId, previewId) {
  const urlInput = document.getElementById(urlInputId);
  const preview = document.getElementById(previewId);
  
  if (urlInput && preview && urlInput.value) {
    preview.src = urlInput.value;
    preview.style.display = 'block';
    preview.style.maxWidth = '100px';
    preview.style.maxHeight = '100px';
    preview.style.borderRadius = '8px';
    preview.style.objectFit = 'cover';
    preview.style.border = '2px solid #4CAF50';
    preview.style.margin = '8px 0';
  }
}

// 🔧 手機版優化：使用LINE頭貼
function useLINEProfile(urlId, previewId, infoId) {
  console.log('📱 手機版：使用LINE頭貼');
  
  if (!liffProfile.pictureUrl) {
    alert('請先登入LINE以獲取頭貼');
    return;
  }
  
  const urlInput = document.getElementById(urlId);
  const preview = document.getElementById(previewId);
  const info = document.getElementById(infoId);
  
  if (urlInput) {
    urlInput.value = liffProfile.pictureUrl;
    urlInput.dispatchEvent(new Event('input'));
  }
  
  if (preview) {
    preview.src = liffProfile.pictureUrl;
    preview.style.display = 'block';
    preview.style.maxWidth = '100px';
    preview.style.maxHeight = '100px';
    preview.style.borderRadius = '50%'; // 圓形頭貼
    preview.style.objectFit = 'cover';
    preview.style.border = '2px solid #00C300';
    preview.style.margin = '8px 0';
  }
  
  if (info) {
    info.textContent = 'LINE頭貼已套用';
    info.classList.add('show');
  }
  
  console.log('✅ LINE頭貼套用完成');
}

// 🔧 手機版優化：分頁切換功能
function switchTab(tabName) {
  console.log('📱 切換到分頁:', tabName);
  
  // 隱藏所有分頁內容
  const tabs = ['text-images', 'promo-cards', 'preview'];
  tabs.forEach(tab => {
    const content = document.getElementById(tab + '-content');
    const btn = document.getElementById(tab + '-tab');
    
    if (content) content.style.display = 'none';
    if (btn) btn.classList.remove('active');
  });
  
  // 顯示選中的分頁
  const activeContent = document.getElementById(tabName + '-content');
  const activeBtn = document.getElementById(tabName + '-tab');
  
  if (activeContent) activeContent.style.display = 'block';
  if (activeBtn) activeBtn.classList.add('active');
  
  // 如果切換到預覽頁，更新預覽
  if (tabName === 'preview') {
    setTimeout(() => {
      renderPreview();
    }, 100);
  }
}

// 🔧 手機版優化：獲取表單資料
function getFormData() {
  const formData = {};
  const form = document.getElementById('cardForm');
  
  if (form) {
    const inputs = form.querySelectorAll('input');
    inputs.forEach(input => {
      formData[input.name || input.id] = input.value;
    });
  }
  
  return formData;
}

// 🔧 手機版優化：渲染預覽（簡化版）
function renderPreview() {
  console.log('📱 手機版：渲染預覽');
  
  const formData = getFormData();
  const previewContainer = document.getElementById('main-card-preview');
  
  if (!previewContainer) return;
  
  // 簡化的預覽HTML
  const previewHTML = `
    <div class="mobile-card-preview" style="
      width: 320px;
      background: #849ebf;
      border-radius: 8px;
      padding: 16px;
      margin: 0 auto;
      color: white;
      font-family: -apple-system, BlinkMacSystemFont, sans-serif;
    ">
      <div style="text-align: center; margin-bottom: 16px;">
        <img src="${formData.main_image_url || defaultCard.main_image_url}" 
             style="width: 120px; height: 120px; border-radius: 8px; object-fit: cover;">
      </div>
      
      <div style="text-align: center; margin-bottom: 16px;">
        <h3 style="margin: 0; color: ${formData.main_title_1_color || '#000000'}; font-size: 16px;">
          ${formData.main_title_1 || defaultCard.main_title_1}
        </h3>
        <p style="margin: 4px 0; color: ${formData.main_title_2_color || '#000000'}; font-size: 14px;">
          ${formData.main_title_2 || defaultCard.main_title_2}
        </p>
      </div>
      
      <div style="display: flex; align-items: center; justify-content: center; margin-bottom: 16px;">
        <img src="${formData.member_image_url || defaultCard.member_image_url}" 
             style="width: 40px; height: 40px; border-radius: 50%; object-fit: cover; margin-right: 8px;">
        <span style="color: ${formData.name_color1 || '#A4924C'}; font-weight: bold;">
          ${formData.display_name || defaultCard.display_name}
        </span>
      </div>
      
      <div style="text-align: center;">
        <button style="
          background: ${formData.button_1_color || '#A4924A'};
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 4px;
          margin: 4px;
          font-size: 14px;
        ">
          ${formData.button_1_text || defaultCard.button_1_text}
        </button>
        
        <button style="
          background: ${formData.s_button_color || '#A4924B'};
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 4px;
          margin: 4px;
          font-size: 14px;
        ">
          ${formData.s_button_text || defaultCard.s_button_text}
        </button>
      </div>
    </div>
  `;
  
  previewContainer.innerHTML = previewHTML;
  console.log('✅ 手機版預覽更新完成');
}

// 🔧 手機版優化：儲存卡片
async function saveCard() {
  console.log('📱 手機版：儲存卡片');
  
  const formData = getFormData();
  
  try {
    const response = await fetch('/api/cards/save', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...formData,
        userId: liffProfile.userId || 'mobile-user',
        source: 'mobile'
      })
    });
    
    const result = await response.json();
    
    if (result.success) {
      alert('✅ 卡片儲存成功！');
      // 可以選擇跳轉或重新載入
    } else {
      alert('❌ 儲存失敗：' + (result.error || '未知錯誤'));
    }
  } catch (error) {
    console.error('儲存錯誤:', error);
    alert('❌ 儲存失敗：' + error.message);
  }
}

// 格式化pageview數字
function formatPageview(val) {
  if (!val) return '888';
  return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

// 🔧 手機版優化：初始化所有功能
function initMobileCard() {
  console.log('📱 手機版會員卡初始化開始');
  
  // 預設顯示第一個分頁
  switchTab('text-images');
  
  // 填入預設資料
  fillAllFieldsWithDefault();
  
  // 綁定表單事件
  const form = document.getElementById('cardForm');
  if (form) {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      saveCard();
    });
    
    // 綁定輸入事件，即時更新預覽
    const inputs = form.querySelectorAll('input');
    inputs.forEach(input => {
      input.addEventListener('input', function() {
        if (document.getElementById('preview-content').style.display === 'block') {
          renderPreview();
        }
      });
    });
  }
  
  // 綁定LINE頭貼按鈕
  const lineProfileBtn = document.getElementById('member_line_profile_btn');
  if (lineProfileBtn) {
    lineProfileBtn.addEventListener('click', function() {
      useLINEProfile('member_image_url', 'member_image_preview', 'member_image_info');
    });
  }
  
  console.log('✅ 手機版會員卡初始化完成');
}

// 🔧 手機版優化：等待DOM載入完成後初始化
document.addEventListener('DOMContentLoaded', function() {
  console.log('📱 手機版DOM載入完成，開始初始化');
  
  // 延遲初始化，確保所有元素都已載入
  setTimeout(() => {
    initMobileCard();
  }, 500);
});

// 🔧 全域函數導出（供HTML調用）
window.switchTab = switchTab;
window.useLINEProfile = useLINEProfile;
window.saveCard = saveCard;
window.renderPreview = renderPreview; 