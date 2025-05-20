// LIFF 初始化與會員資料帶入
const liffId = '2007327814-BdWpj70m';
let userProfile = {};
let isLoading = false;

// 顯示載入中狀態
function showLoading() {
  isLoading = true;
  document.body.style.cursor = 'wait';
  document.querySelectorAll('input, button').forEach(el => el.disabled = true);
}

// 隱藏載入中狀態
function hideLoading() {
  isLoading = false;
  document.body.style.cursor = 'default';
  document.querySelectorAll('input, button').forEach(el => el.disabled = false);
}

// 顯示錯誤訊息
function showError(message) {
  alert(message);
}

async function initLiff() {
  try {
    showLoading();
    await liff.init({ liffId });
    if (!liff.isLoggedIn()) {
      liff.login();
      return;
    }
    const profile = await liff.getProfile();
    userProfile = profile;
    document.getElementById('liffUser').innerHTML = `
      <img src="${profile.pictureUrl}" style="width:48px;height:48px;border-radius:50%;vertical-align:middle;"> 
      <span style="font-weight:bold;">${profile.displayName}</span>
    `;
    document.getElementById('display_name').value = profile.displayName;
    document.getElementById('member_image_url').value = profile.pictureUrl;
    
    // 載入會員卡片資料
    await loadMemberCard();
  } catch (error) {
    showError('初始化失敗：' + error.message);
  } finally {
    hideLoading();
  }
}

// 初始卡片資料（可擴充多型態）
const defaultCards = {
  member: {
    main_image_url: '/uploads/vip/TS-B1.png',
    main_image_link: 'https://secure.smore.com/n/td1qc',
    snow_image_url: '/uploads/vip/APNG1.png',
    calendar_image_url: '/uploads/vip/icon_calendar.png',
    amember_id: 'Tsamc',
    pageview: 0,
    main_title_1: '我在呈璽....',
    main_title_1_color: '#000000',
    main_title_2: '我在呈璽，欣賞美好幸福！我在呈璽，喝茶喝咖啡很悠閒！！我不在呈璽，就是在前往呈璽的路上！！！',
    main_title_2_color: '#000000',
    member_image_url: '/uploads/vip/TS-LOGO.png',
    member_image_link: 'https://secure.smore.com/n/td1qc',
    display_name: '呈璽',
    name_color1: '#A4924C',
    name_color2: '#A4924C',
    button_1_text: '加呈璽好友',
    button_1_url: 'https://lin.ee/JLLIBlP',
    button_1_color: '#A4924A',
    s_button_text: '分享給好友',
    s_button_url: '', // 分享功能由前端處理
    s_button_color: '#A4924B'
  },
  // 未來可擴充其他型態
};

// 載入會員卡片資料
async function loadMemberCard() {
  try {
    showLoading();
    const userId = userProfile.userId;
    let res, data;
    try {
      res = await fetch(`/api/cards/list?userId=${encodeURIComponent(userId)}`);
      if (!res.ok) throw new Error('API 回應失敗');
      const contentType = res.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) throw new Error('API 非 JSON 回應');
      data = await res.json();
    } catch (err) {
      showError('會員卡片 API 錯誤：' + err.message);
      return;
    }
    if (data.success && data.cards && data.cards.length > 0) {
      // 有資料，自動帶入第一筆
      const card = data.cards[0];
      Object.entries(card).forEach(([key, value]) => {
        const input = document.getElementById(key);
        if (input) input.value = value;
      });
      await loadPromoCards(card.id);
    } else {
      // 無資料，自動建立初始卡片
      const initCard = {
        ...defaultCards.member,
        user_id: userId,
        member_image_url: userProfile.pictureUrl,
        display_name: userProfile.displayName
      };
      let saveRes, saveData;
      try {
        saveRes = await fetch('/api/cards/save', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(initCard)
        });
        if (!saveRes.ok) throw new Error('API 回應失敗');
        const contentType = saveRes.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) throw new Error('API 非 JSON 回應');
        saveData = await saveRes.json();
      } catch (err) {
        showError('建立初始卡片失敗：' + err.message);
        return;
      }
      if (saveData.success && saveData.card) {
        Object.entries(saveData.card).forEach(([key, value]) => {
          const input = document.getElementById(key);
          if (input) input.value = value;
        });
        await createDefaultPromos(userId, saveData.card.id);
        await loadPromoCards(saveData.card.id);
      }
    }
    renderPromoList();
    renderPreview();
  } catch (error) {
    showError('載入資料失敗：' + error.message);
  } finally {
    hideLoading();
  }
}

// 查詢宣傳卡片
async function loadPromoCards(cardId) {
  selectedPromos = [];
  const res = await fetch(`/api/promo_cards/list?cardId=${encodeURIComponent(cardId)}`);
  const data = await res.json();
  if (data.success && data.promos) {
    selectedPromos = data.promos.map(p => ({ id: p.id, json: p.json_content }));
  }
}

// 建立預設宣傳卡片
async function createDefaultPromos(userId, cardId) {
  const defaultPromos = [
    {
      user_id: userId,
      card_id: cardId,
      json_content: promoCards[0].json,
      sort_order: 0
    },
    {
      user_id: userId,
      card_id: cardId,
      json_content: promoCards[1].json,
      sort_order: 1
    }
  ];
  for (const promo of defaultPromos) {
    await fetch('/api/promo_cards/save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(promo)
    });
  }
}

// 儲存會員卡片資料
async function saveMemberCard() {
  try {
    showLoading();
    const cardData = {
      user_id: userProfile.userId,
      main_image_url: getVal('main_image_url'),
      main_image_link: getVal('main_image_link'),
      main_title_1: getVal('main_title_1'),
      main_title_1_color: getVal('main_title_1_color'),
      main_title_2: getVal('main_title_2'),
      main_title_2_color: getVal('main_title_2_color'),
      member_image_url: getVal('member_image_url'),
      member_image_link: getVal('member_image_link'),
      display_name: getVal('display_name'),
      name_color1: getVal('name_color1'),
      name_color2: getVal('name_color2'),
      button_1_text: getVal('button_1_text'),
      button_1_url: getVal('button_1_url'),
      button_1_color: getVal('button_1_color'),
      s_button_text: getVal('s_button_text'),
      s_button_url: getVal('s_button_url'),
      s_button_color: getVal('s_button_color'),
      promos: selectedPromos.map((promo, idx) => ({
        id: promo.id,
        sort_order: idx
      }))
    };
    
    // TODO: 儲存到後端 API
    // const response = await fetch('/api/cards/save', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(cardData)
    // });
    // const result = await response.json();
    // if (result.success) {
    //   alert('儲存成功！');
    // } else {
    //   throw new Error(result.message);
    // }
    
    alert('儲存成功！');
  } catch (error) {
    showError('儲存失敗：' + error.message);
  } finally {
    hideLoading();
  }
}

// 宣傳卡片範例（可從後端載入，這裡先寫死）
const promoCards = [
  // 卡片一
  {
    id: 'promo1',
    json: {
      "type": "bubble",
      "size": "mega",
      "body": {
        "type": "box",
        "layout": "vertical",
        "contents": [
          {
            "type": "image",
            "url": "/uploads/vip/TS-B1.png",
            "size": "full",
            "aspectRatio": "10:12",
            "aspectMode": "cover",
            "margin": "15px"
          },
          {
            "type": "image",
            "url": "/uploads/vip/APNG1.png",
            "position": "absolute",
            "size": "300px",
            "margin": "none",
            "animated": true,
            "aspectMode": "fit",
            "aspectRatio": "20:2"
          },
          {
            "type": "image",
            "url": "/uploads/vip/APNG1.png",
            "size": "300px",
            "aspectRatio": "100:125",
            "animated": true,
            "aspectMode": "cover",
            "position": "absolute"
          },
          {
            "type": "box",
            "layout": "horizontal",
            "spacing": "none",
            "contents": [],
            "offsetTop": "250px",
            "offsetStart": "10px"
          },
          {
            "size": "xl",
            "text": "英文小旅行X心靈大冒險",
            "type": "text",
            "align": "center",
            "weight": "bold",
            "margin": "md"
          },
          {
            "type": "text",
            "text": "5/19(一)10:00~12:00",
            "align": "center",
            "margin": "sm",
            "size": "xl"
          },
          {
            "type": "box",
            "layout": "vertical",
            "contents": [],
            "paddingEnd": "65px",
            "paddingStart": "5px"
          },
          {
            "type": "box",
            "layout": "horizontal",
            "contents": [
              {
                "type": "button",
                "color": "#A4924A",
                "style": "primary",
                "height": "sm",
                "offsetEnd": "1px",
                "action": {
                  "type": "uri",
                  "label": "報名玩玩",
                  "uri": "https://forms.gle/hWKgry37mAmQRpDr8"
                }
              },
              {
                "type": "button",
                "color": "#A4924B",
                "style": "primary",
                "height": "sm",
                "offsetStart": "1px",
                "action": {
                  "type": "uri",
                  "label": "分享好友",
                  "uri": "SSSS"
                }
              }
            ],
            "margin": "md"
          }
        ],
        "backgroundColor": "#E1E6E0",
        "paddingAll": "none"
      },
      "footer": {
        "type": "box",
        "layout": "horizontal",
        "spacing": "none",
        "contents": [
          {
            "type": "text",
            "text": "呈璽元宇宙3D展覽館",
            "wrap": true,
            "color": "#00000050",
            "align": "center",
            "action": {
              "type": "uri",
              "label": "action",
              "uri": "https://lihi3.cc/LY5qf"
            },
            "size": "sm",
            "margin": "none"
          }
        ],
        "backgroundColor": "#E1E6E0",
        "height": "30px",
        "margin": "none",
        "paddingAll": "2px"
      },
      "styles": {
        "footer": {
          "separatorColor": "#000000",
          "separator": true
        }
      }
    }
  },
  // 卡片二
  {
    id: 'promo2',
    json: {
      "type": "bubble",
      "size": "mega",
      "body": {
        "type": "box",
        "layout": "vertical",
        "contents": [
          {
            "type": "image",
            "url": "/uploads/vip/TS-LOGO.png",
            "size": "full",
            "aspectRatio": "10:12",
            "aspectMode": "cover",
            "margin": "15px"
          },
          {
            "type": "image",
            "url": "/uploads/vip/APNG1.png",
            "position": "absolute",
            "size": "300px",
            "margin": "none",
            "animated": true,
            "aspectMode": "fit",
            "aspectRatio": "20:2"
          },
          {
            "type": "image",
            "url": "/uploads/vip/APNG1.png",
            "size": "300px",
            "aspectRatio": "100:125",
            "animated": true,
            "aspectMode": "cover",
            "position": "absolute"
          },
          {
            "type": "box",
            "layout": "horizontal",
            "spacing": "none",
            "contents": [],
            "offsetTop": "250px",
            "offsetStart": "10px"
          },
          {
            "size": "xl",
            "text": "人類圖桌遊",
            "type": "text",
            "align": "center",
            "weight": "bold",
            "margin": "md"
          },
          {
            "type": "text",
            "text": "5/19(一)14:00~17:00",
            "align": "center",
            "margin": "sm",
            "size": "xl"
          },
          {
            "type": "box",
            "layout": "vertical",
            "contents": [],
            "paddingEnd": "65px",
            "paddingStart": "5px"
          },
          {
            "type": "box",
            "layout": "horizontal",
            "contents": [
              {
                "type": "button",
                "color": "#A4924A",
                "style": "primary",
                "height": "sm",
                "offsetEnd": "1px",
                "action": {
                  "type": "uri",
                  "label": "報名玩玩",
                  "uri": "https://forms.gle/hWKgry37mAmQRpDr8"
                }
              },
              {
                "type": "button",
                "color": "#A4924B",
                "style": "primary",
                "height": "sm",
                "offsetStart": "1px",
                "action": {
                  "type": "uri",
                  "label": "分享好友",
                  "uri": "SSSS"
                }
              }
            ],
            "margin": "md"
          }
        ],
        "backgroundColor": "#E1E6E0",
        "paddingAll": "none"
      },
      "footer": {
        "type": "box",
        "layout": "horizontal",
        "spacing": "none",
        "contents": [
          {
            "type": "text",
            "text": "呈璽元宇宙3D展覽館",
            "wrap": true,
            "color": "#00000050",
            "align": "center",
            "action": {
              "type": "uri",
              "label": "action",
              "uri": "https://lihi3.cc/LY5qf"
            },
            "size": "sm",
            "margin": "none"
          }
        ],
        "backgroundColor": "#E1E6E0",
        "height": "30px",
        "margin": "none",
        "paddingAll": "2px"
      },
      "styles": {
        "footer": {
          "separatorColor": "#000000",
          "separator": true
        }
      }
    }
  }
];
let selectedPromos = [];

function renderPromoList() {
  const promoList = document.getElementById('promoList');
  promoList.innerHTML = '';
  selectedPromos.forEach((promo, idx) => {
    const div = document.createElement('div');
    div.className = 'promo-card-thumb selected';
    div.innerHTML = `
      <div class="sort-buttons">
        <button class="sort-btn" onclick="movePromo(${idx},-1)" ${idx === 0 ? 'disabled' : ''}>←</button>
        <button class="sort-btn" onclick="movePromo(${idx},1)" ${idx === selectedPromos.length-1 ? 'disabled' : ''}>→</button>
      </div>
    `;
    const preview = document.createElement('div');
    preview.id = `promo-preview-${promo.id}`;
    div.appendChild(preview);
    promoList.appendChild(div);
    setTimeout(() => flex2html(`promo-preview-${promo.id}`, promo.json), 0);
  });
  // 未選的
  promoCards.filter(p=>!selectedPromos.find(sp=>sp.id===p.id)).forEach((promo) => {
    const div = document.createElement('div');
    div.className = 'promo-card-thumb';
    div.onclick = () => { selectedPromos.push(promo); renderPromoList(); renderPreview(); };
    const preview = document.createElement('div');
    preview.id = `promo-preview-${promo.id}`;
    div.appendChild(preview);
    promoList.appendChild(div);
    setTimeout(() => flex2html(`promo-preview-${promo.id}`, promo.json), 0);
  });
}
function movePromo(idx, dir) {
  if (dir === -1 && idx > 0) {
    [selectedPromos[idx-1], selectedPromos[idx]] = [selectedPromos[idx], selectedPromos[idx-1]];
  } else if (dir === 1 && idx < selectedPromos.length-1) {
    [selectedPromos[idx+1], selectedPromos[idx]] = [selectedPromos[idx], selectedPromos[idx+1]];
  }
  renderPromoList();
  renderPreview();
}

// 會員卡片 JSON 結構（完整依 line會員卡-json.txt 動態組裝）
function getMemberCardJson() {
  return {
    type: 'bubble',
    size: 'mega',
    body: {
      type: 'box',
      layout: 'vertical',
      contents: [
        { type: 'image', size: 'full', aspectRatio: '1:1', aspectMode: 'cover', url: getVal('main_image_url') },
        { type: 'image', url: getVal('snow_image_url'), size: 'full', aspectRatio: '1:1', animated: true, aspectMode: 'cover', position: 'absolute', action: { type: 'uri', label: 'action', uri: getVal('main_image_link') } },
        { type: 'box', width: '90px', layout: 'horizontal', spacing: 'none', contents: [
          { type: 'box', action: { uri: 'https://lihi3.cc/ZWV2u', type: 'uri', label: 'VIP會員號碼' }, layout: 'vertical', contents: [
            { url: getVal('calendar_image_url'), type: 'image', action: { uri: 'https://lihi3.cc/ZWV2u', type: 'uri', label: 'action' }, size: '35px' },
            { type: 'text', text: getVal('amember_id'), size: '10px', align: 'center', gravity: 'center', offsetTop: '30px', position: 'absolute', offsetStart: '12px', color: '#FFFFFF' }
          ], cornerRadius: '30px', backgroundColor: '#A4924A' },
          { type: 'box', action: { uri: getVal('main_image_link'), type: 'uri', label: '愛心會員號碼' }, layout: 'vertical', contents: [
            { url: getVal('love_icon_url'), type: 'image', action: { uri: getVal('main_image_link'), type: 'uri', label: 'action' }, size: '32px' },
            { type: 'text', size: '10px', align: 'center', gravity: 'center', position: 'absolute', offsetTop: '30px', offsetStart: '12px', text: getVal('pageview'), color: '#FFFFFF' }
          ], cornerRadius: '30px', backgroundColor: '#d00308' }
        ], offsetTop: '250px', offsetStart: '10px', height: '45px', position: 'absolute' },
        { size: '20px', text: getVal('main_title_1'), type: 'text', align: 'center', color: getVal('main_title_1_color'), weight: 'bold', margin: 'md' },
        { type: 'box', layout: 'vertical', contents: [
          { type: 'text', text: getVal('main_title_2'), wrap: true, size: '16px', margin: 'sm', color: getVal('main_title_2_color') }
        ], paddingEnd: '65px', paddingStart: '5px', height: '95px' },
        { type: 'box', width: '65px', layout: 'vertical', spacing: 'none', contents: [
          { type: 'box', action: { uri: getVal('member_image_link'), type: 'uri', label: 'action' }, layout: 'vertical', contents: [
            { url: getVal('member_image_url'), type: 'image', action: { uri: getVal('member_image_link'), type: 'uri', label: '官網' }, aspectRatio: '1:1', aspectMode: 'cover', backgroundColor: '#E1E6E0' }
          ], cornerRadius: '35px', borderWidth: 'semi-bold', borderColor: getVal('name_color2') },
          { type: 'box', layout: 'horizontal', contents: [
            { type: 'text', size: '14px', text: getVal('display_name'), style: 'italic', color: getVal('name_color1'), align: 'center', weight: 'bold', wrap: true, margin: 'none' }
          ], paddingAll: 'none', cornerRadius: 'none', margin: 'none', spacing: 'none' }
        ], position: 'absolute', offsetEnd: '5px', margin: 'md', offsetTop: '315px' },
        { type: 'box', layout: 'horizontal', contents: [
          { type: 'button', action: { type: 'uri', label: getVal('button_1_text'), uri: getVal('button_1_url') }, color: getVal('button_1_color'), style: 'primary', height: 'sm', offsetEnd: '1px' },
          { type: 'button', action: { type: 'uri', label: getVal('s_button_text'), uri: getVal('s_button_url') }, color: getVal('s_button_color'), style: 'primary', height: 'sm', offsetStart: '1px' }
        ], margin: 'md' }
      ],
      backgroundColor: '#E1E6E0',
      paddingAll: '10px'
    },
    footer: {
      type: 'box',
      layout: 'horizontal',
      spacing: 'none',
      contents: [
        { type: 'text', text: '呈璽元宇宙3D展覽館', wrap: true, color: '#00000050', align: 'center', action: { type: 'uri', label: 'action', uri: 'https://lihi3.cc/LY5qf' }, size: 'sm', margin: 'none' }
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
}
function getVal(id) { return document.getElementById(id).value || ''; }

function renderPreview() {
  const mainCard = getMemberCardJson();
  const previewDiv = document.getElementById('flexPreview');
  previewDiv.innerHTML = '';
  // 主卡片
  const mainDiv = document.createElement('div');
  mainDiv.id = 'main-card-preview';
  previewDiv.appendChild(mainDiv);
  flex2html('main-card-preview', mainCard);
  // 宣傳卡片
  selectedPromos.forEach((promo, idx) => {
    const div = document.createElement('div');
    div.id = `promo-preview-main-${promo.id}`;
    div.style.marginTop = '16px';
    previewDiv.appendChild(div);
    flex2html(div.id, promo.json);
  });
}

// 欄位即時同步預覽
function bindFormEvents() {
  document.querySelectorAll('#cardForm input').forEach(input => {
    input.addEventListener('input', () => {
      if (!isLoading) {
        renderPreview();
      }
    });
  });
  
  // 添加儲存按鈕
  const saveButton = document.createElement('button');
  saveButton.textContent = '儲存卡片';
  saveButton.style.cssText = `
    display: block;
    width: 100%;
    padding: 12px;
    background: #4caf50;
    color: white;
    border: none;
    border-radius: 4px;
    font-size: 16px;
    cursor: pointer;
    margin-top: 24px;
  `;
  saveButton.onclick = (e) => {
    e.preventDefault();
    saveMemberCard();
  };
  document.getElementById('cardForm').appendChild(saveButton);
}

window.onload = async function() {
  try {
    await initLiff();
    renderPromoList();
    bindFormEvents();
    renderPreview();
    // 主圖
    bindImageUpload('main_image_upload', 'main_image_upload_btn', 'main_image_preview', 'main_image_url', 'main', userProfile);
    // 雪花動畫
    bindImageUpload('snow_image_upload', 'snow_image_upload_btn', 'snow_image_preview', 'snow_image_url', 'snow', userProfile);
    // 行事曆
    bindImageUpload('calendar_image_upload', 'calendar_image_upload_btn', 'calendar_image_preview', 'calendar_image_url', 'calendar', userProfile);
    // 愛心
    bindImageUpload('love_icon_upload', 'love_icon_upload_btn', 'love_icon_preview', 'love_icon_url', 'love', userProfile);
    // 會員圖片
    bindImageUpload('member_image_upload', 'member_image_upload_btn', 'member_image_preview', 'member_image_url', 'member', userProfile);
  } catch (error) {
    showError('初始化失敗：' + error.message);
  }
};

function bindImageUpload(inputId, btnId, previewId, urlId, type, userProfile) {
  const input = document.getElementById(inputId);
  const btn = document.getElementById(btnId);
  const preview = document.getElementById(previewId);
  input.addEventListener('change', function() {
    if (input.files && input.files[0]) {
      const reader = new FileReader();
      reader.onload = function(e) {
        preview.src = e.target.result;
        preview.style.display = 'block';
      };
      reader.readAsDataURL(input.files[0]);
    }
  });
  btn.addEventListener('click', function() {
    if (!input.files || !input.files[0]) return alert('請選擇圖片');
    const reader = new FileReader();
    reader.onload = function(e) {
      document.getElementById(urlId).value = e.target.result;
      preview.src = e.target.result;
      preview.style.display = 'block';
      renderPreview();
    };
    reader.readAsDataURL(input.files[0]);
  });
} 