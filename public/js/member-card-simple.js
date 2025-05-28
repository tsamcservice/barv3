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

// 加強 input 預設樣式
const style = document.createElement('style');
style.innerHTML = `
  input[data-default] { color: #bbb !important; }
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
  img.src = url;
  img.style.border = '2px solid #4caf50';
  img.style.display = 'block';
}

// 修改 fillAllFieldsWithProfile 與卡片資料填入流程
async function fillAllFieldsWithProfile() {
  // 先填入預設值
  Object.keys(defaultCard).forEach(key => {
    if(document.getElementById(key)){
      setInputDefaultStyle(document.getElementById(key), defaultCard[key]);
    }
  });
  // 再用 LINE 資訊覆蓋會員圖片與名字（不動 card_alt_title）
  if (window.liff && liff.getProfile) {
    try {
      const profile = await liff.getProfile();
      liffProfile.displayName = profile.displayName;
      liffProfile.pictureUrl = profile.pictureUrl;
      liffProfile.userId = profile.userId;
      if(document.getElementById('display_name')) setInputDefaultStyle(document.getElementById('display_name'), profile.displayName);
      if(document.getElementById('member_image_url')) setInputDefaultStyle(document.getElementById('member_image_url'), profile.pictureUrl);
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
  return {
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
                  text: formatPageview(cardData.pageview || defaultCard.pageview),
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
  const bubble = getMainBubble(getFormData());
  const flexJson = {
    type: 'flex',
    altText: getFormData().card_alt_title || getFormData().main_title_1 || defaultCard.main_title_1 || '我的會員卡',
    contents: bubble,
    pageview: formatPageview(getFormData().pageview)
  };
  const preview = document.getElementById('main-card-preview');
  preview.innerHTML = '';
  flex2html('main-card-preview', flexJson);
  renderShareJsonBoxWithPromo();
}

// 分享按鈕上方顯示即將分享的Flex Message JSON
function renderShareJsonBoxWithPromo() {
  const box = document.getElementById('shareJsonBox');
  if (!box) return;
  const mainCard = getMainBubble(getFormData());
  const promoCards = selectedPromoCards.map(id => {
    const card = promoCardList.find(c => c.id === id);
    return card ? card.flex_json : null;
  }).filter(Boolean);
  let shareMsg;
  if (promoCards.length === 0) {
    shareMsg = {
      type: 'flex',
      altText: getFormData().card_alt_title || getFormData().main_title_1 || defaultCard.main_title_1,
      contents: mainCard,
      pageview: formatPageview(getFormData().pageview)
    };
  } else {
    shareMsg = {
      type: 'flex',
      altText: getFormData().card_alt_title || getFormData().main_title_1 || defaultCard.main_title_1,
      contents: {
        type: 'carousel',
        contents: [mainCard, ...promoCards]
      },
      pageview: formatPageview(getFormData().pageview)
    };
  }
  box.innerHTML = '';
  const title = document.createElement('div');
  title.textContent = '即將分享的 Flex Message JSON（可複製）';
  title.style.cssText = 'font-weight:bold;font-size:16px;margin-bottom:8px;';
  box.appendChild(title);
  const pre = document.createElement('pre');
  pre.textContent = JSON.stringify(shareMsg, null, 2);
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

function closeOrRedirect() {
  if (window.liff && typeof liff.closeWindow === 'function') {
    liff.closeWindow();
  } else {
    window.location.replace('/member-card-simple.html');
  }
}

// 修改 window.onload 函數
window.onload = async function() {
  // 強制所有 input 一律黑字，移除殘留 CSS
  document.querySelectorAll('input').forEach(input => {
    input.style.color = '#222';
    input.className = '';
  });
  document.querySelectorAll('style').forEach(style => {
    if (style.innerHTML.includes('data-default')) style.remove();
  });

  // 檢查是否為分享模式
  const pageId = getQueryParam('pageId');
  const userIdParam = getQueryParam('userId');
  
  if (pageId && !userIdParam) {
    // DEMO模式：僅有 pageId，強制只查詢初始卡片，不登入 LIFF
    const cardForm = document.getElementById('cardForm');
    if (cardForm) cardForm.style.display = 'none';
    const previewSection = document.querySelector('.preview-section');
    if (previewSection) previewSection.style.display = 'none';
    let loadingDiv = document.createElement('div');
    loadingDiv.className = 'loading';
    loadingDiv.innerHTML = '<div style="font-size:20px;color:#4caf50;margin-top:60px;">正在自動分享...</div>';
    document.body.appendChild(loadingDiv);
    let flexJson = null;
    try {
      // 取代原本 fetch('/api/cards/default?pageId=' + pageId) 的用法：
      // const defRes = await fetch('/api/cards/default?pageId=' + pageId);
      // const defResult = await defRes.json();
      // 改為：
      const defResult = await safeFetchJson('/api/cards/default?pageId=' + pageId);
      if (!defResult.success) {
        loadingDiv.innerHTML = '<div style="color:#c62828;font-size:18px;">查無卡片資料或API錯誤，無法分享</div>';
        return;
      }
      // 先呼叫 pageview API +1
      try {
        await fetch('/api/cards/pageview', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ cardIdTypeArr: [{ id: defResult?.data?.id, type: 'main' }] })
        });
      } catch (e) { /* 忽略錯誤 */ }
      // 自動分享
      await liff.shareTargetPicker([defResult?.data?.flex_json])
        .then(() => {
          loadingDiv.remove();
          closeOrRedirect();
        })
        .catch(() => {
          loadingDiv.remove();
          closeOrRedirect();
        });
    } catch (e) {
      loadingDiv.innerHTML = '<div style="color:#c62828;font-size:18px;">自動分享失敗：' + (e.message || e) + '</div>';
    }
    return;
  }

  // 一般編輯模式
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
    try {
      const res = await fetch(apiUrl);
      const result = await res.json();
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
    }
    // 5. 掛 input 監聽
    if(document.getElementById('display_name'))
      document.getElementById('display_name').addEventListener('input', updateCardAltTitle);
    if(document.getElementById('main_title_1'))
      document.getElementById('main_title_1').addEventListener('input', updateCardAltTitle);
    // 6. 渲染預覽與 JSON
    renderPreview();
    renderShareJsonBoxWithPromo();
    // 若有儲存的carousel，還原排序
    if (loadedFlexJson && loadedFlexJson.contents && loadedFlexJson.contents.type === 'carousel') {
      // 取得主卡與宣傳卡 id 順序
      const flexArr = loadedFlexJson.contents.contents;
      // 取得主卡與宣傳卡的唯一key（主卡用main，宣傳卡用id）
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
    renderPromoCardListSortable();
  }
  // 顯示分享按鈕後連結欄位（可複製）
  const sBtnUrlInput = document.getElementById('s_button_url');
  if(sBtnUrlInput && sBtnUrlInput.parentNode) {
    sBtnUrlInput.style.display = '';
    let shareBtn = document.createElement('button');
    shareBtn.type = 'button';
    shareBtn.textContent = '分享到LINE';
    shareBtn.style = 'margin-top:12px;background:#06C755;color:#fff;padding:10px 18px;border:none;border-radius:4px;font-size:16px;cursor:pointer;display:block;width:100%';
    shareBtn.onclick = shareToLine;
    sBtnUrlInput.parentNode.appendChild(shareBtn);
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

// 展開/收合宣傳卡片選擇區塊
window.addEventListener('DOMContentLoaded', function() {
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
});

// 初始化排序區卡片陣列
function initAllCardsSortable() {
  // 先建立主卡片
  const mainCard = {
    type: 'main',
    id: 'main',
    flex_json: getMainBubble(getFormData()),
    img: getFormData().main_image_url || defaultCard.main_image_url
  };

  // 如果有宣傳卡片，則加入主卡片和宣傳卡片
  if (selectedPromoCards.length > 0) {
    allCardsSortable = [
      mainCard,
      ...selectedPromoCards.map(id => {
        const card = promoCardList.find(c => c.id === id);
        return card ? { type: 'promo', id: card.id, flex_json: card.flex_json, img: card.flex_json.body.contents[0].url } : null;
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

// 分享後不自動刷新排序區
async function shareToLine() {
  if (!window.liff) return alert('LIFF 未載入');
  try {
    await liff.init({ liffId });
    if (!liff.isLoggedIn()) {
      liff.login();
      return;
    }
    // 分享前主卡片內容即時更新
    const mainIdx = allCardsSortable.findIndex(c => c.type === 'main');
    if (mainIdx !== -1) {
      allCardsSortable[mainIdx].flex_json = getMainBubble(getFormData());
      allCardsSortable[mainIdx].img = getFormData().main_image_url || defaultCard.main_image_url;
    }
    // 依照排序後的 allCardsSortable 組合 carousel，取最新內容
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
    // 儲存主卡片（用最新內容）
    const formData = getFormData();
    const response = await fetch('/api/cards', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        page_id: 'M01001',
        line_user_id: liffProfile.userId,
        ...formData,
        flex_json: flexJson
      })
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || '儲存失敗');
    }
    // 分享時批次更新 pageview
    // 取得主卡片 id
    let mainCardId = null;
    try {
      const res = await fetch(`/api/cards?pageId=M01001&userId=${liffProfile.userId}`);
      const result = await res.json();
      if (result.success && result.data && result.data.length > 0) {
        mainCardId = result.data[0].id;
      }
    } catch (e) {}
    // 組合所有卡片 id 及型別
    const cardIdTypeArr = allCardsSortable.map((c, i) => ({ id: c.id === 'main' ? mainCardId : c.id, type: c.type })).filter(c => c.id);
    if (cardIdTypeArr.length > 0) {
      await fetch('/api/cards/pageview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cardIdTypeArr })
      });
    }
    if (!flexJson || typeof flexJson !== 'object') {
      loadingDiv.innerHTML = '<div style="color:#c62828;font-size:18px;">查無卡片資料或格式錯誤，無法分享</div>';
      return;
    }
    await liff.shareTargetPicker([flexJson])
      .then(closeOrRedirect)
      .catch(closeOrRedirect);
  } catch (err) {
    alert('儲存或分享失敗: ' + err.message);
  }
}

// 監聽 display_name、main_title_1 input 變動，自動更新 card_alt_title
function updateCardAltTitle() {
  const mainTitle = document.getElementById('main_title_1').value;
  const displayName = document.getElementById('display_name').value;
  if(document.getElementById('card_alt_title'))
    document.getElementById('card_alt_title').value = mainTitle + '/' + displayName;
  renderPreview();
  renderShareJsonBoxWithPromo();
}
window.addEventListener('DOMContentLoaded', function() {
  if(document.getElementById('display_name'))
    document.getElementById('display_name').addEventListener('input', updateCardAltTitle);
  if(document.getElementById('main_title_1'))
    document.getElementById('main_title_1').addEventListener('input', updateCardAltTitle);
});

// 欄位即時預覽
Array.from(document.querySelectorAll('#cardForm input')).forEach(input => {
  input.addEventListener('input', function(e) {
    renderPreview();
    renderShareJsonBoxWithPromo();
  });
});

// 儲存功能
document.getElementById('cardForm').onsubmit = async function(e) {
  e.preventDefault();
  if (!window.liff) return alert('LIFF 未載入');
  
  try {
    await liff.init({ liffId });
    if (!liff.isLoggedIn()) {
      liff.login();
      return;
    }

    const formData = getFormData();
    // 移除 pageview 欄位，避免覆蓋
    const { pageview, ...formDataWithoutPageview } = formData;
    // 取得 FLEX JSON
    const bubble = getMainBubble(formData);
    const flexJson = {
      type: 'flex',
      altText: formData.card_alt_title || formData.main_title_1 || defaultCard.main_title_1 || '我的會員卡',
      contents: bubble
    };
    const response = await fetch('/api/cards', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        page_id: 'M01001',
        line_user_id: liffProfile.userId,
        ...formDataWithoutPageview,
        flex_json: flexJson
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || '儲存失敗');
    }

    const result = await response.json();
    alert('儲存成功！');
  } catch (err) {
    alert('儲存失敗: ' + err.message);
  }
};

// 圖片上傳功能
function bindImageUpload(inputId, btnId, previewId, urlId) {
  const input = document.getElementById(inputId);
  const btn = document.getElementById(btnId);
  const preview = document.getElementById(previewId);
  const urlInput = document.getElementById(urlId);
  // 預設圖
  setImageDefaultStyle(preview, urlInput.value || preview.src);
  // 檔案選擇事件
  input.addEventListener('change', function() {
    if (input.files && input.files[0]) {
      const reader = new FileReader();
      reader.onload = function(e) {
        setImageUserStyle(preview, e.target.result);
      };
      reader.readAsDataURL(input.files[0]);
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
        const response = await fetch('/api/upload', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            file: e.target.result,
            fileName: file.name,
            fileType: file.type,
          }),
        });
        const data = await response.json();
        if (!data.success) {
          throw new Error(data.error || '上傳失敗');
        }
        if (data.data?.url) {
          urlInput.value = data.data.url;
          setImageUserStyle(preview, data.data.url);
          renderPreview();
        } else {
          throw new Error('未收到上傳 URL');
        }
      } catch (error) {
        console.error('Upload failed:', error);
        alert(error.message || '上傳失敗，請重試');
      }
    };
    reader.readAsDataURL(file);
  });
}

// 初始化圖片上傳功能
window.addEventListener('DOMContentLoaded', function() {
  // ... existing code ...
  
  // 綁定圖片上傳功能
  bindImageUpload('main_image_upload', 'main_image_upload_btn', 'main_image_preview', 'main_image_url');
  bindImageUpload('snow_image_upload', 'snow_image_upload_btn', 'snow_image_preview', 'snow_image_url');
  bindImageUpload('calendar_image_upload', 'calendar_image_upload_btn', 'calendar_image_preview', 'calendar_image_url');
  bindImageUpload('love_icon_upload', 'love_icon_upload_btn', 'love_icon_preview', 'love_icon_url');
  bindImageUpload('member_image_upload', 'member_image_upload_btn', 'member_image_preview', 'member_image_url');
});

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
    }
  } catch (e) {
    console.error('載入宣傳卡片失敗', e);
  }
}

// DOMContentLoaded 時初始化宣傳卡片功能
window.addEventListener('DOMContentLoaded', function() {
  loadPromoCards();
});

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
  const preview = document.getElementById('main-card-preview');
  preview.innerHTML = '';
  flex2html('main-card-preview', flexJson);
  renderShareJsonBoxWithPromoSortable(flexJson);
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