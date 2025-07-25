// 🚀 輕量級分享專用LIFF頁面 - v20250717
// LIFF ID: 2007327814-BdWpj70m (Share-Only專用)
// 更新日期: 2025-07-17

// 版本標識
const VERSION_TAG = 'SHARE-ONLY-v20250717';
const liffId = '2007327814-BdWpj70m'; // 新的分享專用LIFF ID

// 輕量化功能開關
const SHARE_FEATURES = {
  editing: false,           // 關閉編輯功能
  preview: true,           // 保留預覽功能
  sharing: true,           // 核心分享功能
  pointsCalculation: true, // 點數計算
  fastLoad: true,          // 快速載入模式
  debugMode: true          // 調試模式
};

// 全域變數
let liffProfile = null;
let cardData = null;
let shareData = null;

console.log(`🚀 啟動輕量級分享系統 ${VERSION_TAG}`);
console.log('📱 LIFF ID:', liffId);

// 工具函數
function getQueryParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

function showSection(sectionId) {
  // 隱藏所有區域
  document.getElementById('loadingSection').style.display = 'none';
  document.getElementById('previewSection').style.display = 'none';
  document.getElementById('shareSection').style.display = 'none';
  document.getElementById('errorSection').style.display = 'none';
  
  // 顯示指定區域
  const section = document.getElementById(sectionId);
  if (section) {
    section.style.display = 'block';
  }
}

function showError(message) {
  document.getElementById('errorMessage').textContent = message;
  showSection('errorSection');
}

// URL參數解析
function parseURLParams() {
  const pageId = getQueryParam('pageId');
  const userId = getQueryParam('userId');
  const code = getQueryParam('code');
  const shareDataParam = getQueryParam('shareData');
  
  console.log('📋 URL參數:', { pageId, userId, code, shareData: !!shareDataParam });
  
  return { pageId, userId, code, shareDataParam };
}

// 直接從資料庫載入卡片資料
async function loadCardDataDirect(pageId, userId) {
  try {
    let apiUrl;
    
    if (userId) {
      // 載入特定用戶的卡片
      apiUrl = `/api/cards?pageId=${pageId}&userId=${userId}`;
    } else {
      // 載入預設卡片
      apiUrl = `/api/cards?pageId=${pageId}`;
    }
    
    console.log('🔍 API請求:', apiUrl);
    
    const response = await fetch(apiUrl);
    
    // 檢查HTTP狀態
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    // 檢查回應是否為JSON
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      const text = await response.text();
      throw new Error(`API回應不是JSON格式: ${text.substring(0, 100)}`);
    }
    
    const result = await response.json();
    
    if (result.success && result.data && result.data.length > 0) {
      let card;
      if (userId) {
        card = result.data[0];
      } else {
        // 選擇預設卡片（line_user_id為null的）
        card = result.data.find(c => !c.line_user_id) || result.data[0];
      }
      
      console.log('✅ 成功載入卡片資料:', card.id);
      return card;
    } else {
      throw new Error('找不到卡片資料');
    }
  } catch (error) {
    console.error('❌ 載入卡片資料失敗:', error);
    throw error;
  }
}

// 從簡短代碼載入資料
async function loadFromShortCode(code) {
  try {
    console.log('🔍 解析簡短代碼:', code);
    
    // 解析 pageId_userId 格式
    const parts = code.split('_');
    if (parts.length >= 2) {
      const pageId = parts[0];
      const userId = parts.slice(1).join('_'); // 支援userId中包含下劃線
      
      console.log('📋 解析結果:', { pageId, userId });
      return await loadCardDataDirect(pageId, userId);
    } else {
      throw new Error('簡短代碼格式錯誤');
    }
  } catch (error) {
    console.error('❌ 簡短代碼載入失敗:', error);
    throw error;
  }
}

// 從分享資料載入
async function loadFromShareData(shareDataParam) {
  try {
    console.log('🔍 解析分享資料...');
    
    // 嘗試多種解碼方式
    let decodedData;
    try {
      decodedData = decodeURIComponent(shareDataParam);
    } catch (e) {
      decodedData = shareDataParam;
    }
    
    try {
      const parsedData = JSON.parse(atob(decodedData));
      console.log('✅ 成功解析分享資料');
      return parsedData;
    } catch (e) {
      // 嘗試直接解析
      const parsedData = JSON.parse(decodedData);
      console.log('✅ 成功解析分享資料（直接）');
      return parsedData;
    }
  } catch (error) {
    console.error('❌ 分享資料解析失敗:', error);
    throw error;
  }
}

// 渲染卡片預覽 - 使用與其他頁面相同的邏輯
function renderCardPreview(flexJson) {
  try {
    if (!flexJson) {
      throw new Error('無效的卡片資料');
    }
    
    console.log('🎨 渲染卡片預覽...');
    console.log('📋 原始 Flex JSON:', flexJson);
    
    // 檢查flex_json是否為字串需要解析
    let parsedFlexJson = flexJson;
    if (typeof flexJson === 'string') {
      try {
        parsedFlexJson = JSON.parse(flexJson);
        console.log('📋 解析後的 Flex JSON:', parsedFlexJson);
      } catch (e) {
        console.error('❌ Flex JSON 解析失敗:', e);
        throw new Error('Flex JSON 格式錯誤');
      }
    }
    
    // 構建完整的flex消息格式（與其他頁面相同）
    const flexMessage = {
      type: 'flex',
      altText: cardData.card_alt_title || cardData.main_title_1 || '專屬會員卡',
      contents: parsedFlexJson
    };
    
    console.log('📤 準備渲染的完整消息:', flexMessage);
    
    // 使用與其他頁面相同的渲染邏輯
    const preview = document.getElementById('main-card-preview');
    if (!preview) {
      throw new Error('找不到預覽容器');
    }
    
    let chatbox = preview.querySelector('.chatbox');
    if (!chatbox) {
      chatbox = document.createElement('div');
      chatbox.className = 'chatbox';
      preview.appendChild(chatbox);
    }
    chatbox.innerHTML = '';
    
    // 創建臨時ID並渲染（與其他頁面相同的方式）
    const tempId = 'temp-chatbox-' + Date.now();
    chatbox.id = tempId;
    
    // 使用全域flex2html函數渲染
    if (typeof flex2html === 'function') {
      flex2html(tempId, flexMessage);
      console.log('✅ 卡片預覽渲染完成 (使用flex2html全域函數)');
    } else if (typeof window.flex2html === 'function') {
      window.flex2html(tempId, flexMessage);
      console.log('✅ 卡片預覽渲染完成 (使用window.flex2html)');
    } else {
      // 備用方案：使用基本HTML結構
      chatbox.innerHTML = `
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                    color: white; padding: 20px; border-radius: 15px; text-align: center;">
          <h3>🎯 專屬會員卡</h3>
          <p style="margin: 10px 0;">呈璽元宇宙</p>
          <p style="font-size: 14px; margin: 10px 0;">預覽準備完成</p>
          <div style="background: rgba(255,255,255,0.2); padding: 8px; border-radius: 8px; font-size: 12px;">
            flex2html載入中...
          </div>
        </div>
      `;
      console.warn('⚠️ flex2html未載入，使用備用HTML方案');
    }
    
  } catch (error) {
    console.error('❌ 卡片預覽渲染失敗:', error);
    throw error;
  }
}

// 更新統計資訊
function updateStatsInfo(data) {
  const statsInfo = document.getElementById('statsInfo');
  if (statsInfo && data) {
    const pageview = data.pageview || 0;
    const points = data.user_points || 0;
    
    statsInfo.innerHTML = `
      📊 總瀏覽: ${pageview.toString().padStart(4, '0')} | 
      💎 點數: ${points.toString().padStart(4, '0')}
    `;
  }
}

// LIFF初始化
async function initLiff() {
  try {
    console.log('🔧 初始化LIFF...');
    
    if (!window.liff) {
      throw new Error('LIFF SDK未載入');
    }
    
    await liff.init({ liffId });
    
    if (!liff.isLoggedIn()) {
      console.log('📱 需要登入，跳轉到登入頁面');
      liff.login();
      return false;
    }
    
    // 取得用戶資料
    liffProfile = await liff.getProfile();
    console.log('✅ LIFF初始化完成，用戶:', liffProfile.displayName);
    
    return true;
  } catch (error) {
    console.error('❌ LIFF初始化失敗:', error);
    return false;
  }
}

// 計算分享點數
async function calculateSharePoints() {
  try {
    if (!liffProfile || !cardData) {
      console.warn('⚠️ 缺少用戶資料或卡片資料，跳過點數計算');
      return;
    }
    
    console.log('💎 開始計算分享點數...');
    
    const pointsData = {
      cardId: cardData.id,
      userId: liffProfile.userId,
      source: 'share_only'
    };
    
    console.log('💎 點數計算參數:', pointsData);
    
    const response = await fetch('/api/cards/auto-share-reward', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(pointsData)
    });
    
    if (response.ok) {
      const result = await response.json();
      console.log('✅ 點數計算完成:', result);
      
      // 更新統計資訊
      if (result.new_points !== undefined) {
        const oldPoints = cardData.user_points || 0;
        const newPoints = result.new_points;
        const pointsGained = newPoints - oldPoints;
        
        updateStatsInfo({
          ...cardData,
          user_points: newPoints
        });
        
        // 顯示點數增加提示
        if (pointsGained > 0) {
          console.log(`🎉 恭喜！獲得 ${pointsGained} 點數！總點數：${newPoints}`);
          
          // 立即更新按鈕顯示點數增加
          const shareButton = document.getElementById('shareButton');
          if (shareButton) {
            shareButton.disabled = false;
            shareButton.innerHTML = `<span>🎉</span><span>+${pointsGained} 點數！</span>`;
            shareButton.style.background = '#28a745';
            shareButton.style.color = 'white';
            
            console.log('✅ 按鈕已更新為點數提示');
            
            // 2秒後顯示分享成功
            setTimeout(() => {
              shareButton.innerHTML = '<span>✅</span><span>分享成功</span>';
              shareButton.style.background = '#6c757d';
              console.log('✅ 按鈕已更新為分享成功');
            }, 2000);
          }
        } else {
          console.log('💡 沒有獲得點數或點數計算失敗');
        }
      }
    } else {
      console.warn('⚠️ 點數計算失敗:', response.status);
    }
    
  } catch (error) {
    console.error('❌ 點數計算錯誤:', error);
  }
}

// 執行分享
async function executeShare() {
  try {
    if (!cardData || !cardData.flex_json) {
      throw new Error('無效的卡片資料');
    }
    
    console.log('📤 開始分享流程...');
    
    // 更新分享按鈕狀態
    const shareButton = document.getElementById('shareButton');
    shareButton.disabled = true;
    shareButton.innerHTML = '<span>⏳</span><span>分享中...</span>';
    
    // 準備分享資料
    let parsedFlexJson = cardData.flex_json;
    if (typeof cardData.flex_json === 'string') {
      try {
        parsedFlexJson = JSON.parse(cardData.flex_json);
      } catch (e) {
        console.error('❌ 分享資料解析失敗:', e);
        throw new Error('分享資料格式錯誤');
      }
    }
    
    const shareContent = {
      type: 'flex',
      altText: cardData.card_alt_title || cardData.main_title_1 || '專屬會員卡',
      contents: parsedFlexJson
    };
    
    // 執行分享
    if (liff.isApiAvailable('shareTargetPicker')) {
      console.log('📤 準備分享內容:', shareContent);
      await liff.shareTargetPicker([shareContent]);
      console.log('✅ 分享完成');
      
      // 計算分享點數
      console.log('💎 開始計算點數...');
      await calculateSharePoints();
      
      // 延遲後關閉視窗（等待點數提示顯示完成）
      setTimeout(() => {
        if (liff.isInClient()) {
          liff.closeWindow();
        }
      }, 4000); // 延長到4秒，讓用戶看到點數增加提示
      
    } else {
      throw new Error('分享功能不可用');
    }
    
  } catch (error) {
    console.error('❌ 分享失敗:', error);
    
    // 恢復分享按鈕
    const shareButton = document.getElementById('shareButton');
    shareButton.disabled = false;
    shareButton.innerHTML = '<span>📱</span><span>分享到LINE</span>';
    
    alert('分享失敗：' + error.message);
  }
}

// 主要初始化函數
async function initShareOnlyPage() {
  try {
    console.log('🚀 開始初始化分享頁面...');
    
    // 1. 解析URL參數
    const { pageId, userId, code, shareDataParam } = parseURLParams();
    
    // 2. 初始化LIFF
    const liffReady = await initLiff();
    if (!liffReady) {
      return; // LIFF初始化失敗或需要登入
    }
    
    // 3. 載入卡片資料
    let loadedData = null;
    
    if (shareDataParam) {
      // 從分享資料載入
      loadedData = await loadFromShareData(shareDataParam);
    } else if (code) {
      // 從簡短代碼載入
      loadedData = await loadFromShortCode(code);
    } else if (pageId) {
      // 從API載入
      loadedData = await loadCardDataDirect(pageId, userId);
    } else {
      throw new Error('缺少必要的URL參數');
    }
    
    if (!loadedData) {
      throw new Error('無法載入卡片資料');
    }
    
    cardData = loadedData;
    console.log('✅ 卡片資料載入完成:', cardData);
    console.log('📋 卡片ID:', cardData.id);
    console.log('📋 Flex JSON 存在:', !!cardData.flex_json);
    
    // 4. 渲染預覽
    renderCardPreview(cardData.flex_json);
    
    // 5. 更新統計資訊
    updateStatsInfo(cardData);
    
    // 6. 顯示預覽和分享區域
    showSection('previewSection');
    document.getElementById('shareSection').style.display = 'block';
    
    // 7. 綁定分享按鈕事件
    document.getElementById('shareButton').addEventListener('click', executeShare);
    
    console.log('🎉 分享頁面初始化完成');
    
  } catch (error) {
    console.error('❌ 初始化失敗:', error);
    showError(error.message || '載入失敗，請稍後再試');
  }
}

// 檢查資源載入狀態
function checkResourcesLoaded() {
  console.log('🔍 檢查資源載入狀態:');
  console.log('- LIFF SDK:', typeof window.liff !== 'undefined' ? '✅' : '❌');
  console.log('- flex2html (全域):', typeof flex2html === 'function' ? '✅' : '❌');
  console.log('- flex2html (window):', typeof window.flex2html === 'function' ? '✅' : '❌');
  console.log('- renderFlexMessage:', typeof renderFlexMessage !== 'undefined' ? '✅' : '❌');
  
  // flex2html載入檢查（優先使用全域函數）
  const hasFlexRenderer = typeof flex2html === 'function' || 
                          typeof window.flex2html === 'function' || 
                          typeof renderFlexMessage !== 'undefined';
  
  if (!hasFlexRenderer) {
    console.log('⏳ flex2html尚未載入，等待中...');
    return false;
  }
  
  console.log('✅ 渲染函數已就緒');
  return true;
}

// 頁面載入完成後執行
window.addEventListener('DOMContentLoaded', () => {
  console.log('📄 DOM載入完成，開始初始化...');
  
  // 檢查資源載入狀態
  if (!checkResourcesLoaded()) {
    // 延遲重試
    setTimeout(() => {
      console.log('🔄 重新檢查資源載入狀態...');
      checkResourcesLoaded();
      initShareOnlyPage();
    }, 1000);
  } else {
    initShareOnlyPage();
  }
});

// 錯誤處理
window.addEventListener('error', (event) => {
  console.error('❌ 全域錯誤:', event.error);
  showError('系統錯誤，請重新整理頁面');
});

// 工具函數：安全的JSON解析
function safeJSONParse(str, fallback = null) {
  try {
    return JSON.parse(str);
  } catch (e) {
    console.warn('JSON解析失敗:', e);
    return fallback;
  }
}

// 工具函數：格式化數字
function formatNumber(num, digits = 4) {
  return num.toString().padStart(digits, '0');
}

console.log('📜 輕量級分享系統載入完成'); 