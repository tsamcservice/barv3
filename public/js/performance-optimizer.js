// 🚀 效能優化模組 - 降低載入時間和分享執行時間
// 建立日期: 2025-07-03
// 目標: 將載入時間從3-5秒降低到0.5-1秒

class PerformanceOptimizer {
  constructor() {
    this.cache = new Map();
    this.userProfile = null;
    this.defaultCard = null;
    this.isLiffReady = false;
    
    // 效能監控
    this.metrics = {
      loadStartTime: performance.now(),
      liffInitTime: null,
      firstRenderTime: null,
      shareStartTime: null,
      shareCompleteTime: null
    };
  }

  // 🔧 快取管理
  cacheManager = {
    set: (key, data, ttl = 3600000) => { // 預設1小時
      const item = {
        data,
        timestamp: Date.now(),
        ttl
      };
      localStorage.setItem(`cache_${key}`, JSON.stringify(item));
    },

    get: (key) => {
      const item = localStorage.getItem(`cache_${key}`);
      if (!item) return null;
      
      const parsed = JSON.parse(item);
      if (Date.now() - parsed.timestamp > parsed.ttl) {
        localStorage.removeItem(`cache_${key}`);
        return null;
      }
      return parsed.data;
    },

    clear: () => {
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith('cache_')) {
          localStorage.removeItem(key);
        }
      });
    }
  };

  // 🚀 快速載入初始化
  async fastInit() {
    console.log('🚀 開始快速載入模式...');
    
    // 1. 立即載入預設資料（不等待LIFF）
    this.loadDefaultCardData();
    
    // 2. 檢查快取的用戶資料
    const cachedProfile = this.cacheManager.get('userProfile');
    if (cachedProfile) {
      console.log('✅ 使用快取的用戶資料');
      this.userProfile = cachedProfile;
      this.fillFormWithProfile(cachedProfile);
    }
    
    // 3. 並行初始化LIFF（不阻塞UI）
    this.initLiffBackground();
    
    // 4. 立即渲染預覽
    this.renderFastPreview();
    
    this.metrics.firstRenderTime = performance.now();
    console.log(`⚡ 首次渲染完成: ${this.metrics.firstRenderTime - this.metrics.loadStartTime}ms`);
  }

  // 🔧 載入預設卡片資料
  loadDefaultCardData() {
    // 檢查是否已有快取
    const cachedDefault = this.cacheManager.get('defaultCard');
    if (cachedDefault) {
      this.defaultCard = cachedDefault;
      return;
    }

    // 使用內建預設資料
    this.defaultCard = {
      main_image_url: 'https://barv3.vercel.app/uploads/vip/TS-B1.png',
      snow_image_url: 'https://barv3.vercel.app/uploads/vip/APNG1.png',
      main_image_link: 'https://secure.smore.com/n/td1qc',
      calendar_image_url: 'https://barv3.vercel.app/uploads/vip/icon_calendar.png',
      calendar_image_link: 'https://lihi3.cc/ZWV2u',
      amember_id: '呈璽',
      love_icon_url: 'https://barv3.vercel.app/uploads/vip/loveicon.png',
      love_icon_link: 'https://lihi.cc/jl7Pw',
      pageview: '0000',
      main_title_1: '我在呈璽',
      main_title_1_color: '#000000',
      main_title_2: '我在呈璽，欣賞美好幸福！',
      main_title_2_color: '#000000',
      member_image_url: 'https://barv3.vercel.app/uploads/vip/TS-LOGO.png',
      member_image_link: 'https://secure.smore.com/n/td1qc',
      display_name: '呈璽',
      name_color1: '#A4924C',
      button_1_text: '加呈璽好友',
      button_1_url: 'https://lin.ee/JLLIBlP',
      button_1_color: '#A4924A',
      s_button_text: '分享給好友',
      s_button_url: 'https://liff.line.me/2007327814-OoJBbnwP?pageId=M01001',
      s_button_color: '#A4924B',
      card_alt_title: '我在呈璽/呈璽'
    };

    // 快取預設資料
    this.cacheManager.set('defaultCard', this.defaultCard, 86400000); // 24小時
  }

  // 🔧 背景初始化LIFF
  async initLiffBackground() {
    try {
      if (!window.liff) {
        console.log('⚠️ LIFF SDK未載入，跳過LIFF初始化');
        return;
      }

      await liff.init({ liffId: '2007327814-OoJBbnwP' });
      
      if (liff.isLoggedIn()) {
        const profile = await liff.getProfile();
        this.userProfile = profile;
        
        // 快取用戶資料
        this.cacheManager.set('userProfile', profile, 3600000); // 1小時
        
        // 更新表單（如果還沒有填入）
        if (!this.hasUserData()) {
          this.fillFormWithProfile(profile);
          this.renderFastPreview();
        }
        
        console.log('✅ LIFF背景初始化完成');
      }
      
      this.isLiffReady = true;
      this.metrics.liffInitTime = performance.now();
      
    } catch (error) {
      console.error('❌ LIFF背景初始化失敗:', error);
    }
  }

  // 🔧 快速預覽渲染
  renderFastPreview() {
    const formData = this.getFormData();
    const bubble = this.createBubble(formData);
    
    const flexJson = {
      type: 'flex',
      altText: formData.card_alt_title || formData.main_title_1 || '我的會員卡',
      contents: bubble
    };
    
    const preview = document.getElementById('main-card-preview');
    if (preview) {
      let chatbox = preview.querySelector('.chatbox');
      if (!chatbox) {
        chatbox = document.createElement('div');
        chatbox.className = 'chatbox';
        preview.appendChild(chatbox);
      }
      
      chatbox.innerHTML = '';
      const tempId = 'fast-preview-' + Date.now();
      chatbox.id = tempId;
      
      // 使用flex2html渲染
      if (window.flex2html) {
        flex2html(tempId, flexJson);
      }
    }
  }

  // 🚀 高速分享功能
  async fastShare() {
    this.metrics.shareStartTime = performance.now();
    
    try {
      // 1. 檢查LIFF是否準備好
      if (!this.isLiffReady) {
        console.log('⏳ LIFF尚未準備好，等待初始化...');
        await this.waitForLiff();
      }
      
      // 2. 快速生成分享內容
      const formData = this.getFormData();
      const flexJson = this.generateShareContent(formData);
      
      // 3. 立即分享（不等待點數處理）
      const result = await liff.shareTargetPicker([flexJson]);
      
      this.metrics.shareCompleteTime = performance.now();
      console.log(`⚡ 分享完成: ${this.metrics.shareCompleteTime - this.metrics.shareStartTime}ms`);
      
      // 4. 背景處理點數和資料儲存
      this.processBackgroundTasks(formData);
      
      return result;
      
    } catch (error) {
      console.error('❌ 快速分享失敗:', error);
      throw error;
    }
  }

  // 🔧 背景任務處理
  async processBackgroundTasks(formData) {
    try {
      // 並行處理點數和資料儲存
      const promises = [
        this.saveCardData(formData),
        this.processPointsTransaction(formData)
      ];
      
      await Promise.allSettled(promises);
      console.log('✅ 背景任務處理完成');
    } catch (error) {
      console.error('⚠️ 背景任務處理失敗:', error);
    }
  }

  // 🔧 等待LIFF準備
  async waitForLiff(timeout = 5000) {
    const startTime = Date.now();
    
    while (!this.isLiffReady && Date.now() - startTime < timeout) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    if (!this.isLiffReady) {
      throw new Error('LIFF初始化逾時');
    }
  }

  // 🔧 輔助方法
  hasUserData() {
    const nameInput = document.getElementById('display_name');
    return nameInput && nameInput.value && nameInput.value !== this.defaultCard.display_name;
  }

  fillFormWithProfile(profile) {
    if (document.getElementById('display_name')) {
      document.getElementById('display_name').value = profile.displayName;
    }
    if (document.getElementById('member_image_url')) {
      document.getElementById('member_image_url').value = profile.pictureUrl;
    }
  }

  getFormData() {
    // 從表單元素獲取資料
    const formData = {};
    Object.keys(this.defaultCard).forEach(key => {
      const element = document.getElementById(key);
      if (element) {
        formData[key] = element.value || this.defaultCard[key];
      } else {
        formData[key] = this.defaultCard[key];
      }
    });
    return formData;
  }

  createBubble(cardData) {
    // 簡化的bubble建立邏輯
    return {
      type: 'bubble',
      body: {
        type: 'box',
        layout: 'vertical',
        contents: [
          {
            type: 'text',
            text: cardData.main_title_1,
            weight: 'bold',
            size: 'xl'
          },
          {
            type: 'text',
            text: cardData.main_title_2,
            size: 'sm',
            color: '#666666',
            wrap: true
          }
        ]
      }
    };
  }

  generateShareContent(formData) {
    return {
      type: 'flex',
      altText: formData.card_alt_title || formData.main_title_1 || '我的會員卡',
      contents: this.createBubble(formData)
    };
  }

  async saveCardData(formData) {
    // 儲存卡片資料到資料庫
    const response = await fetch('/api/cards', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        page_id: 'M01001',
        line_user_id: this.userProfile?.userId,
        ...formData
      })
    });
    
    return response.json();
  }

  async processPointsTransaction(formData) {
    // 處理點數交易
    if (!this.userProfile?.userId) return;
    
    const response = await fetch('/api/cards/points', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: this.userProfile.userId,
        cardData: formData
      })
    });
    
    return response.json();
  }

  // 🔧 效能報告
  getPerformanceReport() {
    const report = {
      totalLoadTime: this.metrics.firstRenderTime - this.metrics.loadStartTime,
      liffInitTime: this.metrics.liffInitTime ? this.metrics.liffInitTime - this.metrics.loadStartTime : null,
      shareTime: this.metrics.shareCompleteTime && this.metrics.shareStartTime ? 
        this.metrics.shareCompleteTime - this.metrics.shareStartTime : null
    };
    
    console.log('📊 效能報告:', report);
    return report;
  }
}

// 🚀 全域實例
window.performanceOptimizer = new PerformanceOptimizer();

// 🔧 自動初始化
document.addEventListener('DOMContentLoaded', () => {
  console.log('🚀 啟動效能優化器...');
  window.performanceOptimizer.fastInit();
});

// 🔧 匯出供其他模組使用
if (typeof module !== 'undefined' && module.exports) {
  module.exports = PerformanceOptimizer;
} 