// ?ˆæœ¬æ¨™è??½æ•¸
function createVersionTag() {
  return 'v20250531-O';
}

// ?ƒå“¡?¡å?å§‹è???
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
  main_title_1: '?‘åœ¨?ˆç’½',
  main_title_1_color: '#000000',
  main_title_2: '?‘åœ¨?ˆç’½ï¼Œæ¬£è³ç?å¥½å¹¸ç¦ï??‘åœ¨?ˆç’½ï¼Œå??¶å??–å•¡å¾ˆæ??’ï?ï¼æ?ä¸åœ¨?ˆç’½ï¼Œå°±?¯åœ¨?å??ˆç’½?„è·¯ä¸Šï?ï¼ï?',
  main_title_2_color: '#000000',
  member_image_url: 'https://barv3.vercel.app/uploads/vip/TS-LOGO.png',
  member_image_link: 'https://secure.smore.com/n/td1qc',
  display_name: '?ˆç’½',
  name_color1: '#A4924C', // ?å?é¡è‰² 
  button_1_text: '? å??½å¥½??,
  button_1_url: 'https://lin.ee/JLLIBlP',
  button_1_color: '#A4924A', // ?‰é?é¡è‰² 
  s_button_text: '?†äº«çµ¦å¥½??,
  s_button_url: 'https://liff.line.me/2007327814-BdWpj70m?pageId=M01001', // ?å??¼ç‚º LIFF+?é¢ID
  s_button_color: '#A4924B',
  card_alt_title: '?‘åœ¨?ˆç’½/?ˆç’½'
};

// ?–å? LINE ?­å??‡å?å­?
let liffProfile = { displayName: '', pictureUrl: '', userId: '' };
const liffId = '2007327814-BdWpj70m';

// LIFF ?å??–è??»å…¥
async function initLiffAndLogin() {
  if (!window.liff) return;
  await liff.init({ liffId });
  if (!liff.isLoggedIn()) {
    liff.login();
    return false;
  }
  return true;
}

// ?¼å³ä¸Šè?é¡¯ç¤ºLINE?­å??å??è?ç¶ è‰²LINE?–ç¤º
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

// è§??ç¶²å??ƒæ•¸
function getQueryParam(name) {
  const url = new URL(window.location.href);
  return url.searchParams.get(name);
}

// ç§»é™¤ input[data-default] ?°è‰²æ¨??ï¼Œå¼·?¶é???
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

// å·¥å…·?½æ•¸ï¼šè¨­ç½®å??‡é?è¨­æ¨£å¼?
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

// **?°å?ï¼šæ??†FLEX JSON?¨æ–¼?†äº«ï¼Œç§»?¤è‡ªå®šç¾©æ¬„ä?ç¢ºä?ç¬¦å?LINEæ¨™æ?**
function cleanFlexJsonForShare(flexJson) {
  const cleanedJson = JSON.parse(JSON.stringify(flexJson)); // æ·±åº¦è¤‡è£½
  
  function removeCustomFields(obj) {
    if (typeof obj !== 'object' || obj === null) return;
    
    // ç§»é™¤?ªå?ç¾©æ?ä½?
    delete obj._cardId;
    delete obj._cardType;
    
    // ?è¿´æ¸…ç?å­ç‰©ä»?
    if (Array.isArray(obj)) {
      obj.forEach(removeCustomFields);
    } else {
      Object.values(obj).forEach(removeCustomFields);
    }
  }
  
  removeCustomFields(cleanedJson);
  console.log('?§¹ æ¸…ç?FLEX JSONï¼Œç§»?¤è‡ªå®šç¾©æ¬„ä?');
  return cleanedJson;
}

// ä¸»å¡?‡è??¥å‡½??- ä½¿ç”¨pageIdç²¾ç¢ºè­˜åˆ¥ä¸»å¡??
function isMainCard(bubbleContent) {
  if (!bubbleContent) return false;
  
  // **?¹æ?1ï¼šæª¢?¥pageview?‡å?ä¸­ç??±è?æ¨™è?ï¼ˆæ?ç©©å?ï¼?*
  let isMainByPageviewMarker = false;
  if (bubbleContent.body && bubbleContent.body.contents) {
    // ?è¿´?œå??€?‰æ?å­—å…§å®?
    function findPageviewMarker(contents) {
      if (!Array.isArray(contents)) return false;
      for (const item of contents) {
        if (item.type === 'text' && item.text && item.text.includes('\u200B')) {
          return true; // ?¾åˆ°?¶å¯¬åº¦ç©º?¼æ?è­?
        }
        if (item.contents && Array.isArray(item.contents)) {
          if (findPageviewMarker(item.contents)) return true;
        }
      }
      return false;
    }
    isMainByPageviewMarker = findPageviewMarker(bubbleContent.body.contents);
  }
  
  // **?¹æ?2ï¼šä½¿?¨è‡ªå®šç¾©æ¬„ä?è­˜åˆ¥ï¼ˆå…§?¨ä½¿?¨ï?**
  const isMainByCardType = bubbleContent._cardType === 'main';
  const isMainByCardId = bubbleContent._cardId && bubbleContent._cardId.startsWith('M');
  
  // **?¹æ?3ï¼šä½¿?¨footer action URIä¸­ç??ƒæ•¸è­˜åˆ¥ï¼ˆLINEè¦ç??§ï?**
  let isMainByFooterUri = false;
  if (bubbleContent.footer && bubbleContent.footer.contents && bubbleContent.footer.contents[0] && bubbleContent.footer.contents[0].action) {
    const uri = bubbleContent.footer.contents[0].action.uri || '';
    isMainByFooterUri = uri.includes('cardType=main') || uri.includes('pageId=M');
  }
  
  // **?¹æ?4ï¼šä½¿?¨footer?‡å??¹å¾µè­˜åˆ¥ï¼ˆå??™æ–¹æ¡ˆï?**
  const isMainByFooterText = bubbleContent.footer && 
    bubbleContent.footer.contents && 
    bubbleContent.footer.contents[0] && 
    bubbleContent.footer.contents[0].text === '?ˆç’½?ƒå?å®?Då±•è¦½é¤?;
  
  // **?°å??¹æ?5ï¼šæª¢?¥æ?å¿ƒå??‡ä??¹ç?pageview?¸å??¼å?**
  let isMainByPageviewFormat = false;
  if (bubbleContent.body && bubbleContent.body.contents) {
    function findPageviewText(contents) {
      if (!Array.isArray(contents)) return false;
      for (const item of contents) {
        if (item.type === 'text' && item.text) {
          // æª¢æŸ¥?¯å¦??ä½æ•¸å­—æ ¼å¼ï?pageviewï¼?
          const text = item.text.replace('\u200B', ''); // ç§»é™¤?¶å¯¬åº¦å?ç¬¦å?æª¢æŸ¥
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
  
  console.log('?? ä¸»å¡?‡å??è???', {
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

// ä¿®æ”¹ fillAllFieldsWithProfile ?‡å¡?‡è??™å¡«?¥æ?ç¨?
async function fillAllFieldsWithProfile() {
  // ?ˆå¡«?¥é?è¨­å€?
  Object.keys(defaultCard).forEach(key => {
    if(document.getElementById(key)){
      setInputDefaultStyle(document.getElementById(key), defaultCard[key]);
    }
  });
  // ?ç”¨ LINE è³‡è?è¦†è??ƒå“¡?–ç??‡å?å­—ï?ä¸å? card_alt_titleï¼?
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
  // ?†äº«?‰é?å¾Œé€???ªå?å¸¶å…¥ LIFF ???ï¼ˆå« pageId ??userIdï¼?
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

// ?–å?ä¸»å¡??bubble
function getMainBubble(cardData) {
  // ?¢ç? s_button_urlï¼Œå„ª?ˆç”¨ userId
  const pageId = 'M01001';
  let s_button_url = `https://liff.line.me/${liffId}?pageId=${pageId}`;
  if (liffProfile.userId) {
    s_button_url += `&userId=${liffProfile.userId}`;
  } else if (getQueryParam('userId')) {
    s_button_url += `&userId=${getQueryParam('userId')}`;
  }
  // ä¾?line?ƒå“¡??json.txt çµæ?çµ„è?
  const bubble = {
    type: 'bubble',
    size: 'mega',
    body: {
      type: 'box',
      layout: 'vertical',
      contents: [
        // ä¸»å?
        {
          type: 'image',
          size: 'full',
          aspectRatio: '1:1',
          aspectMode: 'cover',
          url: cardData.main_image_url || defaultCard.main_image_url
        },
        // ?ªèŠ±?•ç•«?–å±¤
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
        // è¡Œä??†è??›å??€å¡?
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
                label: 'VIP?ƒå“¡?Ÿç¢¼'
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
                label: '?›å??ƒå“¡?Ÿç¢¼'
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
        // ä¸»æ?é¡?
        {
          size: '20px',
          text: String(cardData.main_title_1 || defaultCard.main_title_1),
          type: 'text',
          align: 'center',
          color: cardData.main_title_1_color || defaultCard.main_title_1_color,
          weight: 'bold',
          margin: 'md'
        },
        // ?¯æ?é¡?
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
        // ?ƒå“¡?­å??‡å?å­?
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
                    uri: cardData.member_image_link, type: 'uri', label: 'å®˜ç¶²'
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
        // ?‰é?
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
          text: '?ˆç’½?ƒå?å®?Då±•è¦½é¤?,
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
  
  // **?œéµä¿®å¾©ï¼šç‚ºä¸»å¡?‡å??¥pageIdæ¨™è?**
  bubble._cardId = cardData.page_id || pageId; // ä½¿ç”¨å¯¦é??„pageId
  bubble._cardType = 'main'; // æ¨™ç¤º?ºä¸»?¡ç?
  
  // **?°æ–¹æ¡ˆï??¨footer?„actionä¸­å??¥éš±?ç?ä¸»å¡æ¨™è?ï¼ˆLINEè¦ç??§ï?**
  if (bubble.footer && bubble.footer.contents && bubble.footer.contents[0]) {
    // ?¨footer?„actionä¸­å??¥pageId?ƒæ•¸ï¼ŒLINE?¥å??™ç¨®?¼å?
    const originalUri = bubble.footer.contents[0].action.uri;
    bubble.footer.contents[0].action.uri = originalUri + `?cardType=main&pageId=${pageId}`;
  }
  
  console.log('?·ï¸??Ÿæ?ä¸»å¡?‡ï?? å…¥æ¨™è?:', {
    _cardId: bubble._cardId,
    _cardType: bubble._cardType,
    footerUri: bubble.footer?.contents?.[0]?.action?.uri
  });
  
  return bubble;
}

// ?–å??€?‰è??†äº«?„å¡?‡ï??®å??…ä¸»?¡ç?ï¼Œæœªä¾†å¯?´å?å¤šå¡ï¼?
function getShareBubbles() {
  const cardData = getFormData();
  const bubble = getMainBubble(cardData);
  return [{
    type: 'flex',
    altText: cardData.card_alt_title || `${cardData.main_title_1 || defaultCard.main_title_1}/${cardData.display_name || defaultCard.display_name}`,
    contents: bubble
  }];
}

// ?è¦½?€æ¸²æ?
function renderPreview() {
  // **ä¿®å¾©?é?1ï¼šä½¿?¨allCardsSortableæ¸²æ?å¤šå¡?‡é?è¦?*
  if (allCardsSortable && allCardsSortable.length > 1) {
    // **?œéµä¿®å¾©ï¼šé??°ç??ä¸»?¡ç??„flex_json**
    const mainCardIndex = allCardsSortable.findIndex(c => c.type === 'main');
    if (mainCardIndex !== -1) {
      // ?æ–°?Ÿæ?ä¸»å¡?‡ï?ä½¿ç”¨?€?°ç?è¡¨å–®è³‡æ?
      allCardsSortable[mainCardIndex].flex_json = getMainBubble({ ...getFormData(), page_id: 'M01001' });
      allCardsSortable[mainCardIndex].img = getFormData().main_image_url || defaultCard.main_image_url;
      console.log('?? ?³æ??è¦½ï¼šå·²?´æ–°ä¸»å¡?‡å…§å®?);
    }
    
    // å¤šå¡?‡ï?ä½¿ç”¨?’å?å¾Œç?çµæ?æ¸²æ?carousel
    const flexArr = allCardsSortable.map(c => c.flex_json);
    const flexJson = {
      type: 'flex',
      altText: getFormData().card_alt_title || getFormData().main_title_1 || defaultCard.main_title_1 || '?‘ç??ƒå“¡??,
      contents: {
        type: 'carousel',
        contents: flexArr
      }
    };
    
    // ?”§ ä¿®æ­£ï¼šä½¿?¨chatboxå®¹å™¨?²è?flex2htmlæ¸²æ?
    const preview = document.getElementById('main-card-preview');
    let chatbox = preview.querySelector('.chatbox');
    if (!chatbox) {
      chatbox = document.createElement('div');
      chatbox.className = 'chatbox';
      preview.appendChild(chatbox);
    }
    chatbox.innerHTML = '';
    
    // ?µå»ºä¸€?‹è‡¨?‚IDä¸¦æ¸²??
    const tempId = 'temp-chatbox-' + Date.now();
    chatbox.id = tempId;
    flex2html(tempId, flexJson);
    
  } else {
    // ?®å¡?‡ï??ªæ¸²?“ä¸»?¡ç?
    const bubble = getMainBubble(getFormData());
    const flexJson = {
      type: 'flex',
      altText: getFormData().card_alt_title || getFormData().main_title_1 || defaultCard.main_title_1 || '?‘ç??ƒå“¡??,
      contents: bubble
    };
    
    // ?”§ ä¿®æ­£ï¼šä½¿?¨chatboxå®¹å™¨?²è?flex2htmlæ¸²æ?
    const preview = document.getElementById('main-card-preview');
    let chatbox = preview.querySelector('.chatbox');
    if (!chatbox) {
      chatbox = document.createElement('div');
      chatbox.className = 'chatbox';
      preview.appendChild(chatbox);
    }
    chatbox.innerHTML = '';
    
    // ?µå»ºä¸€?‹è‡¨?‚IDä¸¦æ¸²??
    const tempId = 'temp-chatbox-' + Date.now();
    chatbox.id = tempId;
    flex2html(tempId, flexJson);
  }
  
  renderShareJsonBox();
}

// ?†äº«?‰é?ä¸Šæ–¹é¡¯ç¤º?³å??†äº«?„Flex Message JSON
function renderShareJsonBox() {
  const box = document.getElementById('shareJsonBox');
  if (!box) return;
  
  // **ä¿®å¾©?é?1ï¼šä½¿?¨allCardsSortable?„æ?åºç??œç??JSON**
  let shareMsg;
  if (allCardsSortable && allCardsSortable.length > 1) {
    // **?œéµä¿®å¾©ï¼šé??°ç??ä¸»?¡ç??„flex_jsonï¼ˆå??œé?æ²’æ›´?°ï?**
    const mainCardIndex = allCardsSortable.findIndex(c => c.type === 'main');
    if (mainCardIndex !== -1) {
      // ?æ–°?Ÿæ?ä¸»å¡?‡ï?ç¢ºä?ä½¿ç”¨?€?°ç?è¡¨å–®è³‡æ?
      allCardsSortable[mainCardIndex].flex_json = getMainBubble({ ...getFormData(), page_id: 'M01001' });
      allCardsSortable[mainCardIndex].img = getFormData().main_image_url || defaultCard.main_image_url;
      console.log('?? JSON?´æ–°ï¼šå·²?´æ–°ä¸»å¡?‡å…§å®?);
    }
    
    // å¤šå¡?‡ï??‰ç…§?’å?å¾Œç?çµæ?çµ„æ?carousel
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
    // ?®å¡?‡ï??ªæ?ä¸»å¡??
    const mainCard = getMainBubble(getFormData());
    shareMsg = {
      type: 'flex',
      altText: getFormData().card_alt_title || getFormData().main_title_1 || defaultCard.main_title_1,
      contents: mainCard
    };
  }
  
  // **ä¿®å¾©ï¼šä½¿?¨CSSæ¨??ä¸­å?ç¾©ç?h3æ¨™é?çµæ?**
  box.innerHTML = '';
  
  const title = document.createElement('h3');
  title.textContent = '?? FLEX MESSAGE JSON';
  box.appendChild(title);
  
  const pre = document.createElement('pre');
  
  // **æ¸…ç?JSONé¡¯ç¤ºï¼Œç§»?¤è‡ªå®šç¾©æ¬„ä?**
  const cleanShareMsg = cleanFlexJsonForShare(shareMsg);
  pre.textContent = JSON.stringify(cleanShareMsg, null, 2);
  box.appendChild(pre);
  
  const copyBtn = document.createElement('button');
  copyBtn.textContent = '?? è¤‡è£½JSON';
  copyBtn.style.cssText = 'margin:12px 0 0 0;padding:8px 16px;background:#4CAF50;color:#fff;border:none;border-radius:4px;cursor:pointer;font-size:14px;width:100%;';
  copyBtn.onclick = () => {
    navigator.clipboard.writeText(pre.textContent).then(() => {
      copyBtn.textContent = '??å·²è?è£?';
      setTimeout(()=>{copyBtn.textContent='?? è¤‡è£½JSON';},1500);
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

// ä¿®æ”¹ window.onload ?½æ•¸
window.onload = async function() {
  const pageId = getQueryParam('pageId');
  const userIdParam = getQueryParam('userId');
  if (pageId) {
    // ?ªå??†äº«æ¨¡å?
    const cardForm = document.getElementById('cardForm');
    if (cardForm) cardForm.style.display = 'none';
    const previewSection = document.querySelector('.preview-section');
    if (previewSection) previewSection.style.display = 'none';
    let loadingDiv = document.createElement('div');
    loadingDiv.className = 'loading';
    loadingDiv.innerHTML = '<div style="font-size:20px;color:#4caf50;margin-top:60px;">æ­?œ¨?ªå??†äº«...</div>';
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
        // 1. pageId+userIdï¼šæŸ¥è©¢å€‹äºº?¡ç?
        const apiUrl = `/api/cards?pageId=${pageId}&userId=${userIdParam}`;
        const result = await safeFetchJson(apiUrl);
        flexJson = result?.data?.[0]?.flex_json;
        cardId = result?.data?.[0]?.id;
      } else {
        // 2. ?ªæ? pageIdï¼šæŸ¥è©¢å?å§‹å¡?‡ï?user_id ??nullï¼?
        const result = await safeFetchJson(`/api/cards?pageId=${pageId}`);
        // ?¸å‡º user_id ??null ?„é‚£ä¸€ç­?
        const defaultCard = Array.isArray(result?.data)
          ? result.data.find(card => !card.line_user_id)
          : null;
        flexJson = defaultCard?.flex_json;
        cardId = defaultCard?.id;
      }
      if (!flexJson) {
        loadingDiv.innerHTML = '<div style="color:#c62828;font-size:18px;">?¥ç„¡?¡ç?è³‡æ?ï¼Œç„¡æ³•å?äº?/div>';
        return;
      }
      // **ä¿®å¾©ï¼šè‡ª?•å?äº«æ?ä¹Ÿè??´æ–°?€?‰å¡?‡ç?pageview**
      try {
        // **1. å»ºç?è¦æ›´?°ç??¡ç?æ¸…å–®ï¼ˆä¸»??å®?‚³?¡ï?**
        let cardIdTypeArr = [{ id: cardId, type: 'main' }];
        
        // **2. å¦‚æ??¯carouselï¼Œé?è¦å??«å®£?³å¡??*
        if (flexJson.contents && flexJson.contents.type === 'carousel') {
          const carouselContents = flexJson.contents.contents;
          for (let i = 0; i < carouselContents.length; i++) {
            const content = carouselContents[i];
            // å¦‚æ?ä¸æ˜¯ä¸»å¡ï¼Œå°±?¯å®£?³å¡??
            if (!isMainCard(content)) {
              // ?—è©¦å¾contentä¸­æ‰¾?°å®£?³å¡?‡ç?ID
              // ?™è£¡?¯èƒ½?€è¦å? _cardId ?–å…¶ä»–æ–¹å¼è???
              if (content._cardId && content._cardId !== cardId) {
                cardIdTypeArr.push({ id: content._cardId, type: 'promo' });
                console.log('?¯ ?ªå??†äº«ï¼šå??¥å®£?³å¡??pageview ?´æ–°:', content._cardId);
              }
            }
          }
        }
        
        console.log('?? ?ªå??†äº«ï¼šæ??™æ›´?°ç??¡ç?æ¸…å–®:', cardIdTypeArr);
        
        // **3. ?¹æ¬¡?´æ–°?€?‰å¡?‡ç?pageview**
        await fetch('/api/cards/pageview', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ cardIdTypeArr })
        });
        
        // **?œéµä¿®å¾©ï¼špageview?´æ–°å¾Œé??°å?å¾—æ??°è???*
        let updatedCardData = null;
        let latestPageview = 0;
        
        if (userIdParam) {
          // ?‰userIdï¼šé??°æŸ¥è©¢å€‹äºº?¡ç??–å??€?°pageview
          const updatedResult = await safeFetchJson(`/api/cards?pageId=${pageId}&userId=${userIdParam}`);
          if (updatedResult?.data?.[0]) {
            updatedCardData = updatedResult.data[0];
            latestPageview = updatedCardData.pageview;
            console.log('?? å·²å?å¾—æ??°å€‹äºº?¡ç? pageview:', latestPageview);
          }
        } else {
          // ?¡userIdï¼šé??°æŸ¥è©¢å?å§‹å¡?‡å?å¾—æ??°pageview
          const updatedResult = await safeFetchJson(`/api/cards?pageId=${pageId}`);
          const defaultCardUpdated = Array.isArray(updatedResult?.data)
            ? updatedResult.data.find(card => !card.line_user_id)
            : null;
          if (defaultCardUpdated) {
            updatedCardData = defaultCardUpdated;
            latestPageview = defaultCardUpdated.pageview;
            console.log('?? å·²å?å¾—æ??°å?å§‹å¡??pageview:', latestPageview);
          }
        }
        
        // å¦‚æ??¡æ??–å??´æ–°å¾Œç?è³‡æ?ï¼Œä½¿?¨å??¬ç?è³‡æ?
        if (!updatedCardData) {
          updatedCardData = userIdParam 
            ? (result?.data?.[0] || defaultCard)
            : (defaultCard);
          latestPageview = updatedCardData.pageview || 0;
          console.log('? ï? ä½¿ç”¨?Ÿå?è³‡æ?ï¼Œpageview:', latestPageview);
        }
        
        // **ä¿®å¾©?é?4ï¼šå¼·?–ä¸»?¡è??¥è??´æ–°?è¼¯**
        if (flexJson.contents && flexJson.contents.type === 'carousel') {
          // **ä½¿ç”¨?°ç?isMainCard?½æ•¸ç²¾ç¢ºè­˜åˆ¥ä¸»å¡?‡ä?ç½?*
          const originalContents = flexJson.contents.contents;
          let mainCardIndex = -1;
          let mainCardCount = 0;
          
          // **é¦–å??ƒæ??€?‰å¡?‡ï?çµ±è?ä¸»å¡?¸é??Œä?ç½?*
          for (let i = 0; i < originalContents.length; i++) {
            const content = originalContents[i];
            if (isMainCard(content)) {
              if (mainCardIndex === -1) {
                mainCardIndex = i; // è¨˜é?ç¬¬ä??‹æ‰¾?°ç?ä¸»å¡ä½ç½®
              }
              mainCardCount++;
              console.log(`?¯ ?¾åˆ°ä¸»å¡?‡ä?ç½? ${i}`);
            }
          }
          
          console.log(`?? ä¸»å¡çµ±è?: ç¸½æ•¸=${mainCardCount}, ç¬¬ä??‹ä?ç½?${mainCardIndex}`);
          
          // **?¢ç??°ç?ä¸»å¡?‡ï?ä½¿ç”¨?€?°pageviewï¼?*
          const newMainCard = getMainBubble({ ...updatedCardData, pageview: latestPageview, page_id: pageId });
          
          if (mainCardCount === 1 && mainCardIndex >= 0) {
            // **?†æƒ³?…æ?ï¼šåª?‰ä?å¼µä¸»?¡ï??´æ¥?¿æ?**
            originalContents[mainCardIndex] = newMainCard;
            console.log('???ªå??†äº«æ¨¡å?ï¼šå·²?´æ–°?¯ä?ä¸»å¡?‡ä?ç½?, mainCardIndex);
          } else if (mainCardCount > 1) {
            // **?°å¸¸?…æ?ï¼šå?å¼µä¸»?¡ï?ç§»é™¤å¤šé??„ä¸»?¡ç?ï¼Œåªä¿ç?ç¬¬ä?å¼?*
            console.log('? ï? ?¼ç¾å¤šå¼µä¸»å¡ï¼Œé€²è?æ¸…ç?');
            const filteredContents = [];
            let mainCardAdded = false;
            
            for (let i = 0; i < originalContents.length; i++) {
              const content = originalContents[i];
              if (isMainCard(content)) {
                if (!mainCardAdded) {
                  // ?ªä??™ç¬¬ä¸€å¼µä¸»?¡ä¸¦?´æ–°
                  filteredContents.push(newMainCard);
                  mainCardAdded = true;
                  console.log('??ä¿ç?ä¸¦æ›´?°ç¬¬ä¸€å¼µä¸»??);
                } else {
                  console.log('??ï¸?ç§»é™¤å¤šé??„ä¸»??);
                }
              } else {
                // ä¿ç??ä¸»?¡ç?
                filteredContents.push(content);
              }
            }
            
            // ?´æ–° carousel ?§å®¹
            flexJson.contents.contents = filteredContents;
            console.log('??å¤šä¸»?¡æ??†å??ï??©é??¡ç???', filteredContents.length);
          } else {
            // **?¡ä¸»?¡æ?æ³ï?å°‡ç¬¬ä¸€å¼µå¡?‡æ›¿?›ç‚ºä¸»å¡??*
            console.log('? ï? ?ªæ‰¾?°ä¸»?¡ç?ï¼Œå?ç¬¬ä?å¼µå¡?‡è¨­?ºä¸»??);
            if (originalContents.length > 0) {
              originalContents[0] = newMainCard;
              console.log('??ç¬¬ä?å¼µå¡?‡å·²è¨­ç‚ºä¸»å¡');
            } else {
              originalContents.push(newMainCard);
              console.log('?? æ·»å?ä¸»å¡?°ç©º?„carousel');
            }
          }
          
          // **?æ–°çµ„å? carousel flexJson**
          flexJson = {
            type: 'flex',
            altText: updatedCardData.card_alt_title || updatedCardData.main_title_1 || defaultCard.main_title_1,
            contents: {
              type: 'carousel',
              contents: originalContents // ä½¿ç”¨?Ÿå????ï¼ˆå·²?…å«?´æ–°å¾Œç?ä¸»å¡ï¼?
            }
          };
        } else {
          // ?®å¡?‡ï??´æ¥?¿æ?
          flexJson = {
            type: 'flex',
            altText: updatedCardData.card_alt_title || updatedCardData.main_title_1 || defaultCard.main_title_1,
            contents: getMainBubble({ ...updatedCardData, pageview: latestPageview, page_id: pageId })
          };
        }
        
        console.log('???ªå??†äº«æ¨¡å?ï¼šå·²?æ–°?Ÿæ??€?°flexJsonï¼Œpageview:', latestPageview);
      } catch (e) { 
        console.error('?ªå??†äº«æ¨¡å?pageview?´æ–°å¤±æ?:', e);
      }
      // ?ªå??†äº«
      const cleanFlexJson = cleanFlexJsonForShare(flexJson);
      console.log('?“¤ ?†äº«æ¸…ç?å¾Œç?FLEX JSON');
      await liff.shareTargetPicker([cleanFlexJson])
        .then(closeOrRedirect)
        .catch(closeOrRedirect);
    } catch (e) {
      loadingDiv.innerHTML = '<div style="color:#c62828;font-size:18px;">?ªå??†äº«å¤±æ?ï¼? + (e.message || e) + '</div>';
    }
    return;
  }
  // 3. ??pageId/userIdï¼Œé€²å…¥?»å…¥?‡ç·¨ä¿?
  const ok = await initLiffAndLogin();
  if (ok) {
    // 2. ?–å? profileï¼Œç¢ºä¿?userId ?¯ç”¨
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
    // 3. ??userId ?¥è©¢ API
    let userId = liffProfile.userId || getQueryParam('userId');
    let pageId = 'M01001';
    let apiUrl = `/api/cards?pageId=${pageId}`;
    if (userId) apiUrl += `&userId=${userId}`;
    let cardLoaded = false;
    let loadedFlexJson = null;
    let result = null; // **ä¿®å¾©ï¼šç¢ºä¿resultè®Šæ•¸?¨æ­£ç¢ºä??¨å???*
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
    // 4. ?¥æ?è³‡æ??‡ç”¨ fillAllFieldsWithProfile
    if (!cardLoaded) {
      Object.keys(defaultCard).forEach(key => {
        if(document.getElementById(key)){
          setInputDefaultStyle(document.getElementById(key), defaultCard[key]);
        }
      });
      await fillAllFieldsWithProfile();
    }
    // 5. ??input ??½ - å·²ç§»?°DOMContentLoadedä¸­çµ±ä¸€?•ç?
    // if(document.getElementById('display_name'))
    //   document.getElementById('display_name').addEventListener('input', updateCardAltTitle);
    // if(document.getElementById('main_title_1'))
    //   document.getElementById('main_title_1').addEventListener('input', updateCardAltTitle);
    // 6. æ¸²æ??è¦½??JSON
    renderPreview();
    renderShareJsonBox();
    // **ä¿®å¾©?é?2ï¼šæ­£ç¢ºè??†card_order?’å?**
    if (cardLoaded && result && result.data && result.data[0]) {
      const cardData = result.data[0];
      
      // **?«å??¡ç?è³‡æ?ï¼Œç?å®?‚³?¡ç?è¼‰å…¥å®Œæ?å¾Œå??•ç??’å?**
      window.pendingCardData = cardData;
      
      // å¦‚æ?å®?‚³?¡ç?å·²ç?è¼‰å…¥å®Œæ?ï¼Œç??³è???
      if (promoCardList.length > 0) {
        // å¦‚æ??‰å„²å­˜ç?card_orderï¼Œæ??†å??’å?
        if (cardData.card_order && Array.isArray(cardData.card_order)) {
          const cardOrder = cardData.card_order;
          let newAllCards = [];
          let newSelectedPromo = [];
          
          console.log('?‰ç…§card_order?å»º?¡ç?:', cardOrder);
          
          // ?‰ç…§card_order?†å??å»º?¡ç????
          cardOrder.forEach(cardId => {
            if (cardId === 'main') {
              // ä¸»å¡??
              newAllCards.push({ 
                type: 'main', 
                id: 'main', 
                flex_json: getMainBubble(getFormData()), 
                img: getFormData().main_image_url || defaultCard.main_image_url 
              });
              console.log('? å…¥ä¸»å¡??);
            } else {
              // å®?‚³?¡ç? - å¾promoCardListä¸­æ‰¾?°å??‰ç??¡ç?
              const found = promoCardList.find(c => c.id === cardId);
              if (found) {
                // **?œéµä¿®å¾©ï¼šç‚ºå®?‚³?¡ç??„flex_json? å…¥_cardIdæ¨™è?**
                const promoFlexJson = JSON.parse(JSON.stringify(found.flex_json)); // æ·±åº¦è¤‡è£½
                promoFlexJson._cardId = found.id; // ? å…¥å®?‚³?¡ç?ID
                promoFlexJson._cardType = 'promo'; // æ¨™ç¤º?ºå®£?³å¡??
                console.log('?·ï¸?card_order?å»ºï¼šç‚ºå®?‚³?¡ç?? å…¥æ¨™è?:', found.id);
                
                newAllCards.push({ 
                  type: 'promo', 
                  id: found.id, 
                  flex_json: promoFlexJson, 
                  img: found.flex_json.body.contents[0].url 
                });
                newSelectedPromo.push(found.id);
                console.log('? å…¥å®?‚³?¡ç?:', found.id, found.main_title_1);
              } else {
                console.log('?¾ä??°å®£?³å¡??', cardId);
              }
            }
          });
          
          console.log('?€çµ‚å¡?‡é™£??', newAllCards);
          console.log('?€çµ‚é¸ä¸­ç?å®?‚³?¡ç?:', newSelectedPromo);
          
          if (newAllCards.length > 0) {
            allCardsSortable = newAllCards;
            selectedPromoCards = newSelectedPromo;
            renderPromoCardSelector(); // **ä¿®å¾©?é?2-2ï¼šé??°æ¸²?“é¸?‡å™¨ä»¥æ­£ç¢ºé¡¯ç¤ºç???*
            renderPromoCardListSortable();
            console.log('?¡ç??’å??•ç?å®Œæ?');
          }
        } else if (loadedFlexJson && loadedFlexJson.contents && loadedFlexJson.contents.type === 'carousel') {
          // ?¥æ??‰card_orderä½†æ?carouselï¼Œé??Ÿæ?åºï??Šé?è¼¯ä??™ï?
          const flexArr = loadedFlexJson.contents.contents;
          let newAllCards = [];
          let newSelectedPromo = [];
          flexArr.forEach(flex => {
            // ?¤æ–·?¯ä¸»?¡é??¯å®£?³å¡
            if (flex.body && flex.body.contents && flex.body.contents.some && flex.body.contents.some(c => c.type === 'box' && c.contents && c.contents.some && c.contents.some(cc => cc.text === 'ä¸»å¡??))) {
              // ä¸»å¡
              newAllCards.push({ type: 'main', id: 'main', flex_json: flex, img: getFormData().main_image_url || defaultCard.main_image_url });
            } else {
              // å®?‚³??
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
        delete window.pendingCardData; // ?•ç?å®Œæ?å¾Œæ??¤æš«å­˜è???
      }
    }
    renderPromoCardListSortable();
  }
  
  // **ä¿®å¾©?é?1ï¼šå??†äº«?‰é?ç§»åˆ°æ­?¢ºä½ç½®ï¼Œç¢ºä¿ç¸½?¯é¡¯ç¤?*
  // é¡¯ç¤º?†äº«?‰é?å¾Œé€??æ¬„ä?ï¼ˆå¯è¤‡è£½ï¼?
  const sBtnUrlInput = document.getElementById('s_button_url');
  if(sBtnUrlInput && sBtnUrlInput.parentNode) {
    sBtnUrlInput.style.display = '';
    
    // **æª¢æŸ¥?¯å¦å·²ç??‰å?äº«æ??•ï??¿å??è?æ·»å?**
    let existingShareBtn = sBtnUrlInput.parentNode.querySelector('button[onclick*="shareToLine"]');
    if (!existingShareBtn) {
      let shareBtn = document.createElement('button');
      shareBtn.type = 'button';
      shareBtn.textContent = '?†äº«?°LINE';
      shareBtn.style = 'margin-top:12px;background:#06C755;color:#fff;padding:10px 18px;border:none;border-radius:4px;font-size:16px;cursor:pointer;display:block;width:100%';
      shareBtn.onclick = shareToLine;
      sBtnUrlInput.parentNode.appendChild(shareBtn);
    }
    
    // è¨­å??†äº«?‰é?????ºå¸¶ pageId ??userId ??LIFF ???
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

// ä¸»å¡?‡è?å®?‚³?¡ç??–æ›³?’å??Ÿèƒ½
let allCardsSortable = [];

// ?å??–æ?åºå??¡ç????
function initAllCardsSortable() {
  // ?ˆå»ºç«‹ä¸»?¡ç?
  const mainCard = {
    type: 'main',
    id: 'main',
    flex_json: getMainBubble({ ...getFormData(), page_id: 'M01001' }),
    img: getFormData().main_image_url || defaultCard.main_image_url
  };

  // å¦‚æ??‰å®£?³å¡?‡ï??‡å??¥ä¸»?¡ç??Œå®£?³å¡??
  if (selectedPromoCards.length > 0) {
    allCardsSortable = [
      mainCard,
      ...selectedPromoCards.map(id => {
        const card = promoCardList.find(c => c.id === id);
        if (card) {
          // **?œéµä¿®å¾©ï¼šç‚ºå®?‚³?¡ç??„flex_json? å…¥_cardIdæ¨™è?**
          const promoFlexJson = JSON.parse(JSON.stringify(card.flex_json)); // æ·±åº¦è¤‡è£½
          promoFlexJson._cardId = card.id; // ? å…¥å®?‚³?¡ç?ID
          promoFlexJson._cardType = 'promo'; // æ¨™ç¤º?ºå®£?³å¡??
          console.log('?·ï¸??ºå®£?³å¡?‡å??¥æ?è­?', card.id);
          
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
    // å¦‚æ?æ²’æ?å®?‚³?¡ç?ï¼Œåª? å…¥ä¸»å¡??
    allCardsSortable = [mainCard];
  }
}

// renderPromoCardListSortable ç®­é ­å¯¬åº¦ç¸®å?ï¼Œpaddingæ¸›å?
function renderPromoCardListSortable() {
  const container = document.getElementById('promo-cards');
  if (!container) return;
  
  // æª¢æŸ¥?¯å¦?€è¦å?å§‹å?
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
        ${card.type === 'main' ? '<div class="main-label" style="position:absolute;right:4px;top:4px;background:#4caf50;color:#fff;padding:2px 8px;border-radius:4px;font-size:15px;z-index:2;">ä¸»å¡??/div>' : ''}
      </div>
      <div style="width:120px;text-align:center;margin-top:8px;display:flex;justify-content:center;gap:8px;">
        <button type="button" style="padding:4px 10px;font-size:20px;font-weight:bold;background:#A4924B;color:#fff;border:none;border-radius:6px;box-shadow:0 2px 8px #0002;cursor:pointer;min-width:36px;" onclick="moveCardLeft(${idx})">??/button>
        <button type="button" style="padding:4px 10px;font-size:20px;font-weight:bold;background:#A4924B;color:#fff;border:none;border-radius:6px;box-shadow:0 2px 8px #0002;cursor:pointer;min-width:36px;" onclick="moveCardRight(${idx})">??/button>
      </div>
    `;
    container.appendChild(div);
  });
  updatePreviewWithPromoSortable();
}

// å®?‚³?¡ç??¸æ??‚å?å§‹å? allCardsSortable
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
        <span style="display:inline-block;background:#222;color:#fff;font-size:13px;font-weight:bold;padding:2px 10px;border-radius:4px;">??ï¸?{formatPageview(card.pageview)}</span>
      </div>
      <div class="select-label" style="text-align:center;margin-top:8px;font-size:13px;color:#4caf50;">${selectedPromoCards.includes(card.id) ? 'å·²å??? : 'é»é¸? å…¥'}</div>
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

// å·¦å³ç§»å??’å??½æ•¸
window.moveCardLeft = function(idx) {
  if (idx <= 0) return;
  const tmp = allCardsSortable[idx];
  allCardsSortable[idx] = allCardsSortable[idx - 1];
  allCardsSortable[idx - 1] = tmp;
  // ?´æ–° selectedPromoCards ?†å?
  selectedPromoCards = allCardsSortable.filter(c => c.type === 'promo').map(c => c.id);
  renderPromoCardListSortable();
};
window.moveCardRight = function(idx) {
  if (idx >= allCardsSortable.length - 1) return;
  const tmp = allCardsSortable[idx];
  allCardsSortable[idx] = allCardsSortable[idx + 1];
  allCardsSortable[idx + 1] = tmp;
  // ?´æ–° selectedPromoCards ?†å?
  selectedPromoCards = allCardsSortable.filter(c => c.type === 'promo').map(c => c.id);
  renderPromoCardListSortable();
};

// ?æ? shareToLine
async function shareToLine() {
  if (!window.liff) return alert('LIFF ?ªè???);
  try {
    await liff.init({ liffId });
    if (!liff.isLoggedIn()) {
      liff.login();
      return;
    }
    
    // **ä¿®å¾©?é?3ï¼šå??¹æ¬¡?´æ–°pageviewï¼Œå??Ÿæ?flexJson**
    // æ­¥é?1ï¼šå?äº«æ??¹æ¬¡?´æ–° pageview
    let mainCardId = null;
    try {
      const res = await fetch(`/api/cards?pageId=M01001&userId=${liffProfile.userId}`);
      const result = await res.json();
      if (result.success && result.data && result.data.length > 0) {
        mainCardId = result.data[0].id;
      }
    } catch (e) {}
    
    const cardIdTypeArr = allCardsSortable.map((c, i) => ({ id: c.id === 'main' ? mainCardId : c.id, type: c.type })).filter(c => c.id);
    if (cardIdTypeArr.length > 0) {
      await fetch('/api/cards/pageview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cardIdTypeArr })
      });
    }
    
    // æ­¥é?2ï¼šå?å¾—æ???pageviewï¼ˆæ›´?°å??„ï?
    let latestPageview = getFormData().pageview;
    try {
      const res = await fetch(`/api/cards?pageId=M01001&userId=${liffProfile.userId}`);
      const result = await res.json();
      if (result.success && result.data && result.data.length > 0) {
        latestPageview = result.data[0].pageview;
        console.log('ShareToLine: ?–å??´æ–°å¾Œç?pageview:', latestPageview);
      }
    } catch (e) {}
    
    // æ­¥é?3ï¼šç”¨?€?°pageview?æ–°?Ÿæ?flexJson
    const mainIdx = allCardsSortable.findIndex(c => c.type === 'main');
    if (mainIdx !== -1) {
      allCardsSortable[mainIdx].flex_json = getMainBubble({ ...getFormData(), pageview: latestPageview, page_id: 'M01001' });
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
    
    console.log('ShareToLine: ?æ–°?Ÿæ?flexJsonï¼Œpageview:', latestPageview);
    
    // **æ¸…ç?FLEX JSON?¨æ–¼?²å?**
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
      throw new Error(errorData.message || '?²å?å¤±æ?');
    }
    
    // æ­¥é?5ï¼šæ›´?°å?ç«¯é¡¯ç¤?
    if (document.getElementById('pageview')) {
      document.getElementById('pageview').value = formatPageview(latestPageview);
    }
    
    // **ä¿®å¾©?è¦½?´æ–°?é?ï¼šç¢ºä¿allCardsSortable????Œæ­¥?€?°ç???*
    if (allCardsSortable && allCardsSortable.length > 0) {
      // ?æ–°?å??–allCardsSortableï¼Œç¢ºä¿å??«æ??°ç?ä¸»å¡??
      const mainCardIndex = allCardsSortable.findIndex(c => c.type === 'main');
      if (mainCardIndex !== -1) {
        // ?´æ–°ä¸»å¡?‡ç?è³‡æ?
        allCardsSortable[mainCardIndex] = {
          type: 'main',
          id: 'main',
          flex_json: getMainBubble({ ...getFormData(), pageview: latestPageview, page_id: 'M01001' }),
          img: getFormData().main_image_url || defaultCard.main_image_url
        };
        console.log('??å·²æ›´?°allCardsSortableä¸­ç?ä¸»å¡?‡ï?pageview:', latestPageview);
      }
    }
    
    renderPreview();
    renderShareJsonBox();
    
    // **æ­¥é?6ï¼šæ??†FLEX JSONä¸¦å?äº?*
    const cleanFlexJson = cleanFlexJsonForShare(flexJson);
    console.log('?“¤ ?†äº«æ¸…ç?å¾Œç?FLEX JSON');
    await liff.shareTargetPicker([cleanFlexJson])
      .then(closeOrRedirect)
      .catch(closeOrRedirect);
  } catch (err) {
    alert('?²å??–å?äº«å¤±?? ' + err.message);
  }
}

// ??½ display_name?main_title_1 input è®Šå?ï¼Œè‡ª?•æ›´??card_alt_title
function updateCardAltTitle() {
  const mainTitle = document.getElementById('main_title_1').value;
  const displayName = document.getElementById('display_name').value;
  if(document.getElementById('card_alt_title'))
    document.getElementById('card_alt_title').value = mainTitle + '/' + displayName;
  renderPreview();
  renderShareJsonBox();
}

// **çµ±ä??„DOMContentLoaded?å???*
window.addEventListener('DOMContentLoaded', function() {
  console.log('?? DOMContentLoaded: ?‹å??å???..');
  
  // 1. ç¶å?ä¸»æ?é¡Œå??å??„è??•ç›£??
  if(document.getElementById('display_name'))
    document.getElementById('display_name').addEventListener('input', updateCardAltTitle);
  if(document.getElementById('main_title_1'))
    document.getElementById('main_title_1').addEventListener('input', updateCardAltTitle);
  
  // 2. ç¶å??€?‰è¡¨?®æ?ä½ç??³æ??è¦½?Ÿèƒ½
  const formInputs = document.querySelectorAll('#cardForm input[type="text"], #cardForm input[type="url"], #cardForm input[type="color"]');
  console.log('?”§ ç¶å??³æ??è¦½ï¼Œæ‰¾?°æ?ä½æ•¸??', formInputs.length);
  
  formInputs.forEach((input, index) => {
    console.log(`?”§ ç¶å?æ¬„ä? ${index + 1}: ${input.id || input.name || 'unnamed'}`);
    input.addEventListener('input', function(e) {
      console.log('?? æ¬„ä?è®Šå?è§¸ç™¼?è¦½?´æ–°:', e.target.id || e.target.name);
      renderPreview();
      renderShareJsonBox();
    });
  });

  // 3. æ·»å?è¡¨å–®?äº¤??½?¨å¯¦?¾å„²å­˜å???
  const cardForm = document.getElementById('cardForm');
  if (cardForm) {
    cardForm.addEventListener('submit', async function(e) {
      e.preventDefault();
      console.log('?? è¡¨å–®?äº¤äº‹ä»¶è§¸ç™¼ï¼Œé?å§‹å„²å­?..');
      
      // æª¢æŸ¥LIFF?»å…¥?€??
      if (!liffProfile.userId) {
        alert('è«‹å??»å…¥ LINE');
        return;
      }
      
      try {
        // é¡¯ç¤ºè¼‰å…¥?€??
        const submitButton = cardForm.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        submitButton.textContent = '?²å?ä¸?..';
        submitButton.disabled = true;
        
        const formData = getFormData();
        
        // ?ªå??´æ–°card_alt_title
        if (!formData.card_alt_title && formData.main_title_1 && formData.display_name) {
          formData.card_alt_title = `${formData.main_title_1}/${formData.display_name}`;
          document.getElementById('card_alt_title').value = formData.card_alt_title;
        }
        
        // ?Ÿæ?FLEX JSON
        let flexJson;
        if (allCardsSortable && allCardsSortable.length > 1) {
          // å¤šå¡?‡æ¨¡å¼ï??Ÿæ?carousel
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
          // ?®å¡?‡æ¨¡å¼?
          flexJson = {
            type: 'flex',
            altText: formData.card_alt_title || formData.main_title_1 || defaultCard.main_title_1,
            contents: getMainBubble({ ...formData, page_id: 'M01001' })
          };
        }
        
        // æ¸…ç?FLEX JSON?¨æ–¼?²å?
        const cleanFlexJsonForSave = cleanFlexJsonForShare(flexJson);
        
        // æº–å??²å?è³‡æ?
        const saveData = {
          page_id: 'M01001',
          line_user_id: liffProfile.userId,
          ...formData,
          flex_json: cleanFlexJsonForSave,
          card_order: allCardsSortable ? allCardsSortable.map(c => c.id) : ['main']
        };
        
        console.log('?’¾ æº–å??²å?è³‡æ?:', saveData);
        
        // ?¼é€APIè«‹æ?
        const response = await fetch('/api/cards', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(saveData)
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || '?²å?å¤±æ?');
        }
        
        const result = await response.json();
        console.log('???²å??å?:', result);
        
        // é¡¯ç¤º?å?è¨Šæ¯
        alert('?? ?ƒå“¡?¡å„²å­˜æ??Ÿï?');
        
        // ?´æ–°?è¦½
        renderPreview();
        renderShareJsonBox();
        
      } catch (error) {
        console.error('???²å?å¤±æ?:', error);
        alert('?²å?å¤±æ?ï¼? + error.message);
      } finally {
        // ?¢å¾©?‰é??€??
        const submitButton = cardForm.querySelector('button[type="submit"]');
        submitButton.textContent = '?²å??¡ç?';
        submitButton.disabled = false;
      }
    });
    
    console.log('??è¡¨å–®?äº¤??½?¨å·²ç¶å?');
  } else {
    console.error('???¾ä??°cardForm?ƒç?');
  }

  // 4. ç¶å??–ç?ä¸Šå‚³?Ÿèƒ½
  bindImageUpload('main_image_upload', 'main_image_upload_btn', 'main_image_preview', 'main_image_url');
  bindImageUpload('snow_image_upload', 'snow_image_upload_btn', 'snow_image_preview', 'snow_image_url');
  bindImageUpload('calendar_image_upload', 'calendar_image_upload_btn', 'calendar_image_preview', 'calendar_image_url');
  bindImageUpload('love_icon_upload', 'love_icon_upload_btn', 'love_icon_preview', 'love_icon_url');
  bindImageUpload('member_image_upload', 'member_image_upload_btn', 'member_image_preview', 'member_image_url');

  // 5. å±•é?/?¶å?å®?‚³?¡ç??¸æ??€å¡?
  const toggleBtn = document.getElementById('toggle-promo-selector');
  const selector = document.getElementById('promo-card-selector');
  if (toggleBtn && selector) {
    toggleBtn.onclick = function() {
      if (selector.style.display === 'none') {
        selector.style.display = '';
        toggleBtn.textContent = '?¶å? <<';
      } else {
        selector.style.display = 'none';
        toggleBtn.textContent = 'é»é¸? å…¥ >>';
      }
    };
  }

  // 6. è¼‰å…¥å®?‚³?¡ç?
  loadPromoCards();
  
  console.log('??DOMContentLoaded: ?å??–å???);
});

// ?–ç?ä¸Šå‚³?Ÿèƒ½
function bindImageUpload(inputId, btnId, previewId, urlId) {
  const input = document.getElementById(inputId);
  const btn = document.getElementById(btnId);
  const preview = document.getElementById(previewId);
  const urlInput = document.getElementById(urlId);
  // ?è¨­??
  setImageDefaultStyle(preview, urlInput.value || preview.src);
  // æª”æ??¸æ?äº‹ä»¶
  input.addEventListener('change', function() {
    if (input.files && input.files[0]) {
      const reader = new FileReader();
      reader.onload = function(e) {
        setImageUserStyle(preview, e.target.result);
      };
      reader.readAsDataURL(input.files[0]);
    }
  });
  // ä¸Šå‚³?‰é?é»æ?äº‹ä»¶
  btn.addEventListener('click', async function() {
    if (!input.files || !input.files[0]) {
      alert('è«‹é¸?‡å???);
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
          throw new Error(data.error || 'ä¸Šå‚³å¤±æ?');
        }
        if (data.data?.url) {
          urlInput.value = data.data.url;
          setImageUserStyle(preview, data.data.url);
          renderPreview();
        } else {
          throw new Error('?ªæ”¶?°ä???URL');
        }
      } catch (error) {
        console.error('Upload failed:', error);
        alert(error.message || 'ä¸Šå‚³å¤±æ?ï¼Œè??è©¦');
      }
    };
    reader.readAsDataURL(file);
  });
}

// å®?‚³?¡ç??Ÿèƒ½
let promoCardList = [];
let selectedPromoCards = [];

// è¼‰å…¥å®?‚³?¡ç??‚å??‚æ¸²??selector
async function loadPromoCards() {
  try {
    const res = await fetch('/api/promo-cards');
    const result = await res.json();
    if (result.success && Array.isArray(result.data)) {
      promoCardList = result.data;
      renderPromoCardSelector();
      initAllCardsSortable();
      renderPromoCardListSortable();
      
      // **ä¿®å¾©?é?2ï¼šåœ¨å®?‚³?¡ç?è¼‰å…¥å®Œæ?å¾Œè??†card_order?’å?**
      if (window.pendingCardData) {
        const cardData = window.pendingCardData;
        console.log('?•ç??«å??„å¡?‡è???', cardData);
        console.log('card_order:', cardData.card_order);
        
        // ?•ç?å·²è??¥ç??¡ç?è³‡æ??„æ?åº?
        if (cardData.card_order && Array.isArray(cardData.card_order)) {
          const cardOrder = cardData.card_order;
          let newAllCards = [];
          let newSelectedPromo = [];
          
          console.log('?‰ç…§card_order?å»º?¡ç?:', cardOrder);
          
          // ?‰ç…§card_order?†å??å»º?¡ç????
          cardOrder.forEach(cardId => {
            if (cardId === 'main') {
              // ä¸»å¡??
              newAllCards.push({ 
                type: 'main', 
                id: 'main', 
                flex_json: getMainBubble(getFormData()), 
                img: getFormData().main_image_url || defaultCard.main_image_url 
              });
              console.log('? å…¥ä¸»å¡??);
            } else {
              // å®?‚³?¡ç? - å¾promoCardListä¸­æ‰¾?°å??‰ç??¡ç?
              const found = promoCardList.find(c => c.id === cardId);
              if (found) {
                // **?œéµä¿®å¾©ï¼šç‚ºå®?‚³?¡ç??„flex_json? å…¥_cardIdæ¨™è?**
                const promoFlexJson = JSON.parse(JSON.stringify(found.flex_json)); // æ·±åº¦è¤‡è£½
                promoFlexJson._cardId = found.id; // ? å…¥å®?‚³?¡ç?ID
                promoFlexJson._cardType = 'promo'; // æ¨™ç¤º?ºå®£?³å¡??
                console.log('?·ï¸?card_order?å»ºï¼šç‚ºå®?‚³?¡ç?? å…¥æ¨™è?:', found.id);
                
                newAllCards.push({ 
                  type: 'promo', 
                  id: found.id, 
                  flex_json: promoFlexJson, 
                  img: found.flex_json.body.contents[0].url 
                });
                newSelectedPromo.push(found.id);
                console.log('? å…¥å®?‚³?¡ç?:', found.id, found.main_title_1);
              } else {
                console.log('?¾ä??°å®£?³å¡??', cardId);
              }
            }
          });
          
          console.log('?€çµ‚å¡?‡é™£??', newAllCards);
          console.log('?€çµ‚é¸ä¸­ç?å®?‚³?¡ç?:', newSelectedPromo);
          
          if (newAllCards.length > 0) {
            allCardsSortable = newAllCards;
            selectedPromoCards = newSelectedPromo;
            renderPromoCardSelector(); // **ä¿®å¾©?é?2-2ï¼šé??°æ¸²?“é¸?‡å™¨ä»¥æ­£ç¢ºé¡¯ç¤ºç???*
            renderPromoCardListSortable();
            console.log('?¡ç??’å??•ç?å®Œæ?');
          }
        } else {
          console.log('æ²’æ??‰æ??„card_order?¸æ?');
        }
        delete window.pendingCardData; // æ¸…é™¤?«å?è³‡æ?
      } else {
        console.log('æ²’æ??¾åˆ°?«å??„å¡?‡è???);
      }
    }
  } catch (e) {
    console.error('è¼‰å…¥å®?‚³?¡ç?å¤±æ?', e);
  }
}

function updatePreviewWithPromoSortable() {
  // ä¾ç…§?’å?å¾Œç? allCardsSortable çµ„å? carousel
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
  
  // ?”§ ä¿®æ­£ï¼šä½¿?¨chatboxå®¹å™¨?²è?flex2htmlæ¸²æ?
  const preview = document.getElementById('main-card-preview');
  let chatbox = preview.querySelector('.chatbox');
  if (!chatbox) {
    chatbox = document.createElement('div');
    chatbox.className = 'chatbox';
    preview.appendChild(chatbox);
  }
  chatbox.innerHTML = '';
  
  // ?µå»ºä¸€?‹è‡¨?‚IDä¸¦æ¸²??
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
  title.textContent = '?³å??†äº«??Flex Message JSONï¼ˆå¯è¤‡è£½ï¼?;
  title.style.cssText = 'font-weight:bold;font-size:16px;margin-bottom:8px;';
  box.appendChild(title);
  const pre = document.createElement('pre');
  pre.textContent = JSON.stringify(flexJson, null, 2);
  pre.style.cssText = 'font-size:14px;line-height:1.5;user-select:text;white-space:pre-wrap;word-break:break-all;background:#fff;padding:10px;border-radius:4px;max-height:300px;overflow:auto;';
  box.appendChild(pre);
  const copyBtn = document.createElement('button');
  copyBtn.textContent = 'ä¸€?µè?è£?;
  copyBtn.style.cssText = 'margin:8px 0 0 0;padding:6px 16px;background:#4CAF50;color:#fff;border:none;border-radius:4px;cursor:pointer;font-size:15px;';
  copyBtn.onclick = () => {
    navigator.clipboard.writeText(pre.textContent).then(() => {
      copyBtn.textContent = 'å·²è?è£?';
      setTimeout(()=>{copyBtn.textContent='ä¸€?µè?è£?;},1200);
    });
  };
  box.appendChild(copyBtn);
}

// ?¨æ??‰é¡¯ç¤?pageview ?„åœ°?¹è???
function formatPageview(val) {
  return String(val || 0).padStart(4, '0');
}

// ?°å? safeFetchJson ?½æ•¸
async function safeFetchJson(url) {
  const res = await fetch(url);
  const text = await res.text();
  try {
    return JSON.parse(text);
  } catch (e) {
    return { success: false, error: 'API ?å‚³??JSON', raw: text };
