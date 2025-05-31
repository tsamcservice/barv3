# Unity開發前置作業指南

## 📋 **概述**

本文檔為將 Unity 3D 功能整合到現有會員卡系統（Next.js + Supabase）的完整前置作業指南。Unity 將用於提供 3D 虛擬展覽館、3D 會員卡展示等進階功能。

---

## 🎯 **整合架構設計**

### 整體架構方案
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│                 │    │                 │    │                 │
│   Next.js Web   │◄──►│   Unity WebGL   │◄──►│   Supabase DB   │
│   會員卡系統      │    │   3D展覽功能      │    │   共用資料庫      │
│                 │    │                 │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│  LINE LIFF      │    │  Unity Native   │    │  Storage        │
│  整合介面        │    │  App (備選)      │    │  圖片/3D資源     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

---

## 🚀 **階段性開發計劃**

### 第一階段：環境建置與基礎整合
**時程**：2-3 週
**目標**：建立 Unity WebGL 與 Next.js 的基礎通訊

### 第二階段：3D 會員卡展示功能
**時程**：3-4 週  
**目標**：實現 3D 版本的會員卡展示

### 第三階段：虛擬展覽館功能
**時程**：4-6 週
**目標**：完整的 3D 虛擬展覽館體驗

---

## 🛠️ **技術選型與工具準備**

### Unity 版本建議
- **推薦版本**：Unity 2022.3 LTS（長期支援版）
- **備選版本**：Unity 2023.2（最新穩定版）
- **平台支援**：WebGL、Android、iOS

### 必要套件安裝

#### Unity 官方套件
```csharp
// Package Manager 中安裝
"com.unity.webgl": "1.0.0",           // WebGL 支援
"com.unity.addressables": "1.19.19",  // 資源管理
"com.unity.render-pipelines.universal": "14.0.8", // URP 渲染管線
"com.unity.netcode.gameobjects": "1.5.2", // 網路功能（選用）
```

#### 第三方推薦套件
```csharp
// 透過 Git URL 或 Asset Store 安裝
"GLTFUtility",           // 3D 模型載入
"SimpleJSON",            // JSON 處理
"UnityWebRequest"        // HTTP 請求（內建）
```

### 開發工具準備
- **IDE**：Visual Studio 2022 或 Visual Studio Code
- **版本控制**：Git（與現有專案統一）
- **3D 建模工具**：Blender（免費）或 Maya
- **圖片編輯**：Adobe Photoshop 或 GIMP

---

## 🔗 **系統整合方案**

### 方案A：Unity WebGL 嵌入（推薦）
**優點**：
- 與現有 Next.js 系統無縫整合
- 用戶無需安裝額外應用
- 可直接存取 Supabase 資料
- LINE LIFF 整合容易

**缺點**：
- 效能相對較低
- 檔案大小限制

**實作方式**：
```javascript
// Next.js 頁面中嵌入 Unity WebGL
export default function Unity3DGallery() {
  useEffect(() => {
    // 載入 Unity WebGL build
    const script = document.createElement('script');
    script.src = '/unity-builds/gallery.loader.js';
    document.body.appendChild(script);
  }, []);

  return (
    <div>
      <canvas id="unity-canvas"></canvas>
    </div>
  );
}
```

### 方案B：Unity 原生應用（進階選項）
**優點**：
- 最佳效能表現
- 完整 3D 功能支援
- 可利用裝置硬體加速

**缺點**：
- 需要額外下載安裝
- 與 Web 系統整合複雜
- 開發成本較高

---

## 📊 **資料庫整合策略**

### Supabase 資料結構擴展
```sql
-- 新增 3D 相關資料表
CREATE TABLE unity_scenes (
  id SERIAL PRIMARY KEY,
  scene_name VARCHAR(100) NOT NULL,
  scene_data JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE member_card_3d (
  id SERIAL PRIMARY KEY,
  member_card_id INTEGER REFERENCES member_cards(id),
  model_url TEXT,
  texture_urls JSONB,
  animation_data JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE gallery_assets (
  id SERIAL PRIMARY KEY,
  asset_type VARCHAR(50), -- 'model', 'texture', 'animation'
  asset_url TEXT NOT NULL,
  metadata JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Unity 與 Supabase 通訊
```csharp
// Unity 中的 Supabase 客戶端
public class SupabaseClient : MonoBehaviour 
{
    private string supabaseUrl = "YOUR_SUPABASE_URL";
    private string supabaseKey = "YOUR_SUPABASE_ANON_KEY";
    
    public async Task<List<MemberCard>> GetMemberCards()
    {
        var url = $"{supabaseUrl}/rest/v1/member_cards";
        var request = UnityWebRequest.Get(url);
        request.SetRequestHeader("apikey", supabaseKey);
        
        await request.SendWebRequest();
        
        if (request.result == UnityWebRequest.Result.Success)
        {
            return JsonUtility.FromJson<List<MemberCard>>(request.downloadHandler.text);
        }
        return null;
    }
}
```

---

## 🎨 **3D 資源規劃**

### 會員卡 3D 化設計
```
會員卡 3D 元素：
├── 基礎卡片模型 (Base Card Model)
├── 動態背景效果 (Dynamic Background)
├── 3D 文字元素 (3D Typography)
├── 粒子特效 (Particle Effects)
└── 互動動畫 (Interactive Animations)
```

### 虛擬展覽館設計
```
展覽館結構：
├── 大廳區域 (Main Hall)
│   ├── 歡迎入口
│   ├── 導覽指示
│   └── 會員卡展示牆
├── 展示區域 (Exhibition Areas)
│   ├── 個人會員卡展示間
│   ├── 熱門卡片區
│   └── 互動體驗區
└── 功能區域 (Functional Areas)
    ├── 設定選單
    ├── 分享功能
    └── 返回按鈕
```

---

## 🎴 **3D 會員卡詳細設計**

### **核心概念**
3D 會員卡是將現有的 2D Flex Message 會員卡升級為立體、互動的 3D 版本，在虛擬 3D 空間中展示，提供更沉浸式的體驗。

### **🌟 視覺特色與效果**

#### **立體卡片設計**
```
🎨 3D 卡片結構：
├── 📏 真實卡片厚度與材質（2-3mm 厚度感）
├── ✨ 光影效果與反射（金屬質感、磨砂效果）
├── 🌈 動態背景與粒子特效（雪花、光點飛舞）
├── 📱 浮動資訊標籤（懸浮顯示統計資料）
├── 🎭 個人化動畫效果（進場、待機、互動動畫）
└── 🔮 材質質感（透明、發光、金屬質感選擇）
```

#### **互動功能設計**
- **🖱️ 滑鼠/觸控互動**：
  - 點擊：選中卡片並顯示詳細資訊
  - 拖拉：360度旋轉檢視卡片
  - 縮放：雙擊或滾輪縮放
  - 長按：顯示快速操作選單

- **🔄 多角度展示**：
  - 正面：完整會員資訊展示
  - 背面：統計資料與分享歷史
  - 側面：厚度質感與邊緣裝飾
  - 俯視：整體設計與布局

- **📋 智能資訊展開**：
  - 點擊頭像：展開個人詳細資料
  - 點擊愛心：顯示分享統計圖表
  - 點擊按鈕：觸發對應功能
  - 點擊背景：展示主題資訊

#### **動態效果系統**
```
🎬 動畫效果分類：
├── 💫 進場動畫
│   ├── 從上方飄落並輕柔著陸
│   ├── 旋轉飛入並定位
│   ├── 透明度漸變顯現
│   └── 粒子聚合成形
├── 🌊 背景動態
│   ├── 雪花粒子系統（冬季主題）
│   ├── 光點螢火蟲效果（夏季主題）
│   ├── 櫻花飄落效果（春季主題）
│   └── 楓葉飛舞效果（秋季主題）
├── 💖 互動回饋
│   ├── 愛心跳動效果（pageview 更新時）
│   ├── 按鈕點擊波紋效果
│   ├── 卡片選中發光效果
│   └── 統計數字跳躍動畫
└── 🎪 展示循環
    ├── 定期自動旋轉展示
    ├── 呼吸燈效果（待機狀態）
    ├── 微妙浮動動畫
    └── 光線掃描效果
```

### **🏛️ 虛擬展覽館情境設計**

#### **個人展示間**
```
🏠 個人專屬 3D 空間：
├── 🖼️ 中央懸浮卡片展示台
│   ├── 主要 3D 會員卡居中展示
│   ├── 多張卡片時採用旋轉木馬式排列
│   ├── 自動聚光燈效果
│   └── 背景虛化突出主角
├── 🏆 成就與徽章展示牆
│   ├── 分享次數里程碑
│   ├── 瀏覽量成就徽章
│   ├── 特殊節日紀念徽章
│   └── 個人化成就收藏
├── 📊 3D 統計資訊面板
│   ├── 浮動式資料圖表
│   ├── 即時統計數據
│   ├── 趨勢分析圖形
│   └── 互動式資料探索
├── 🎨 個人化裝飾元素
│   ├── 自選主題背景（星空、海洋、森林等）
│   ├── 個人喜好顏色配置
│   ├── 3D 裝飾物品擺設
│   └── 環境光效調節
└── 🚪 訪客互動區域
    ├── 3D 留言球系統
    ├── 點讚愛心飛舞效果
    ├── 訪客足跡記錄
    └── 社交互動功能
```

#### **大廳共享展示區**
- **🌟 熱門卡片展示牆**：
  - 依 pageview 排行的 3D 排行榜
  - 動態更新的熱門度指示器
  - 點擊進入該用戶展示間
  - 即時統計資料顯示

- **🆕 最新創建區**：
  - 新會員卡的動態展示
  - 時間軸式排列
  - 創建時間顯示
  - 快速預覽功能

- **🎭 主題分類展區**：
  - 依卡片類型分類展示
  - 主題色彩配置
  - 分類導覽功能
  - 批次瀏覽模式

### **🔄 與現有系統深度整合**

#### **資料同步機制**
```
📊 雙向同步系統：
├── 📋 即時資料同步
│   ├── 2D 編輯器修改 → 3D 立即更新
│   ├── 表單欄位變更 → 3D 材質/文字更新
│   ├── 圖片上傳 → 3D 紋理即時替換
│   └── 顏色調整 → 3D 材質顏色同步
├── 🎨 視覺元素對應
│   ├── 主圖 → 3D 卡片正面高解析度紋理
│   ├── 雪花動畫 → 3D 粒子特效系統
│   ├── 會員頭像 → 3D 圓形頭像展示框
│   ├── 愛心圖示 → 發光 3D 愛心模型
│   ├── pageview 數字 → 動態 3D 發光文字
│   └── 背景顏色 → 3D 環境光照顏色
├── 📊 統計資料整合
│   ├── 分享次數 → 3D 統計圖表
│   ├── 瀏覽量 → 動態數字跳躍效果
│   ├── 互動記錄 → 3D 行為分析
│   └── 時間軸 → 3D 歷史軌跡
└── 🔧 功能行為同步
    ├── 按鈕點擊 → 3D 互動熱點
    ├── 分享功能 → 3D 分享動畫
    ├── 編輯模式 → 3D 編輯介面
    └── 預覽更新 → 3D 即時渲染
```

### **🎯 使用情境與體驗流程**

#### **個人使用情境**
1. **👤 進入個人 3D 展示間**：
   - 載入動畫：卡片從星空中飄落
   - 環境初始化：個人化主題環境載入
   - 歡迎效果：卡片自動旋轉展示

2. **🔄 互動體驗流程**：
   - 滑鼠懸停：卡片輕微發光提示
   - 點擊選中：卡片放大並居中展示
   - 拖拉旋轉：360度無死角檢視
   - 雙擊縮放：細節放大檢視模式

3. **📊 資訊查看體驗**：
   - 點擊愛心：3D 統計圖表浮現
   - 滑動查看：歷史資料時間軸
   - 互動探索：深度資料挖掘

#### **社交分享體驗**
1. **📤 3D 分享流程**：
   - 點擊分享按鈕：卡片開始旋轉展示
   - 自動錄製：3D 展示動畫
   - 一鍵分享：生成分享連結
   - 邀請參觀：朋友可進入 3D 展示間

2. **👥 訪客參觀體驗**：
   - 進入他人展示間：觀光客視角
   - 留言互動：投擲 3D 留言球
   - 點讚效果：愛心粒子飛舞
   - 統計貢獻：為主人增加人氣值

### **🚀 技術實現特色**

#### **跨平台優化**
- **🌐 WebGL 版本**：
  - 瀏覽器直接運行，無需安裝
  - 響應式設計，適配各種螢幕
  - 觸控手勢支援
  - 載入優化與漸進式渲染

- **📱 行動裝置優化**：
  - 手勢操作：捏合縮放、滑動旋轉
  - 效能調節：依裝置自動調整畫質
  - 電量友善：智能休眠機制
  - 網路優化：分層載入策略

#### **效能與使用者體驗**
```
⚡ 效能優化策略：
├── 🔧 漸進式載入
│   ├── 基礎模型優先載入
│   ├── 高解析度紋理延遲載入
│   ├── 特效按需啟用
│   └── 背景資源預載入
├── 🎮 智能品質調節
│   ├── 自動檢測裝置效能
│   ├── 動態調整渲染品質
│   ├── 電量狀態感知
│   └── 網路狀況適應
├── 💾 記憶體管理
│   ├── 定期垃圾回收
│   ├── 紋理壓縮優化
│   ├── 模型細節層次（LOD）
│   └── 不可見物件剔除
└── 🌐 網路優化
    ├── 資源 CDN 分發
    ├── 增量更新機制
    ├── 離線快取策略
    └── 斷線重連處理
```

### **💡 創新功能設想**

#### **AR 擴增實境整合**（未來發展）
- **📱 手機 AR 模式**：將 3D 會員卡投影到現實空間
- **🏠 家居展示**：在真實環境中展示虛擬會員卡
- **📷 AR 拍照分享**：與現實場景合成分享
- **🎯 定位展示**：特定地點觸發 AR 展示

#### **AI 智能互動**（進階功能）
- **🤖 虛擬助手**：3D 卡片專屬 AI 導覽員
- **💬 智能對話**：語音互動與問答系統
- **🎨 自動美化**：AI 推薦最佳展示效果
- **📊 行為分析**：智能推薦個人化設定

---

## 🔧 **開發環境設定**

### 專案結構建議
```
your-project/
├── web/                  (現有 Next.js 專案)
│   ├── pages/
│   ├── public/
│   └── ...
├── unity/                (新增 Unity 專案)
│   ├── Assets/
│   │   ├── Scripts/
│   │   ├── Models/
│   │   ├── Textures/
│   │   └── Scenes/
│   ├── ProjectSettings/
│   └── ...
├── shared/               (共用資源)
│   ├── 3d-models/
│   ├── textures/
│   └── animations/
└── docs/
    └── unity開發前置作業.md
```

### Unity 專案初始設定
```csharp
// PlayerSettings 建議配置
PlayerSettings.WebGL.compressionFormat = WebGLCompressionFormat.Gzip;
PlayerSettings.WebGL.dataCaching = true;
PlayerSettings.WebGL.debugSymbols = false;
PlayerSettings.runInBackground = true;
```

---

## 🌐 **WebGL 建置與部署**

### 建置設定
```csharp
// BuildSettings 配置
BuildPlayerOptions buildOptions = new BuildPlayerOptions();
buildOptions.scenes = new[] { "Assets/Scenes/MainScene.unity" };
buildOptions.locationPathName = "WebGL-Build";
buildOptions.target = BuildTarget.WebGL;
buildOptions.options = BuildOptions.None;
```

### Vercel 部署整合
```javascript
// vercel.json 配置
{
  "rewrites": [
    {
      "source": "/unity-gallery/(.*)",
      "destination": "/unity-builds/$1"
    }
  ],
  "headers": [
    {
      "source": "/unity-builds/(.*)",
      "headers": [
        {
          "key": "Cross-Origin-Embedder-Policy",
          "value": "require-corp"
        }
      ]
    }
  ]
}
```

---

## 📱 **LINE LIFF 整合**

### Unity WebGL 中的 LIFF 調用
```javascript
// Unity 中調用 JavaScript 函數
mergeInto(LibraryManager.library, {
  CallLiffShare: function(message) {
    var msg = UTF8ToString(message);
    if (window.liff && liff.isLoggedIn()) {
      liff.shareTargetPicker([JSON.parse(msg)]);
    }
  },
  
  GetLiffProfile: function() {
    if (window.liff && liff.isLoggedIn()) {
      liff.getProfile().then(profile => {
        // 傳回 Unity
        gameInstance.SendMessage('GameManager', 'OnProfileReceived', 
          JSON.stringify(profile));
      });
    }
  }
});
```

---

## 🔒 **安全性與效能考量**

### 安全性措施
- **API 金鑰管理**：環境變數存儲
- **資源存取控制**：Supabase RLS 政策
- **檔案上傳限制**：類型與大小限制

### 效能優化
- **資源壓縮**：紋理與模型優化
- **Loading 策略**：分階段載入
- **記憶體管理**：定期垃圾回收

---

## 📋 **開發檢查清單**

### 前置準備
- [ ] Unity 2022.3 LTS 安裝
- [ ] Visual Studio 或 VS Code 設定
- [ ] Git 版本控制設定
- [ ] Blender 或 3D 建模工具安裝

### 環境配置
- [ ] Unity 專案建立
- [ ] WebGL 平台支援設定
- [ ] Supabase 連接測試
- [ ] Next.js 整合測試

### 資料庫準備
- [ ] 3D 相關資料表建立
- [ ] 儲存空間規劃
- [ ] API 端點設計

### 開發里程碑
- [ ] 基礎 Unity WebGL 建置
- [ ] Supabase 資料讀取功能
- [ ] 簡單 3D 場景展示
- [ ] 會員卡 3D 化原型

---

## 🎯 **第一個原型目標**

### MVP（最小可行產品）功能
1. **基礎 3D 場景**：簡單的展覽館環境
2. **會員卡顯示**：將 2D 會員卡以 3D 方式呈現
3. **基礎互動**：點擊、旋轉、縮放
4. **資料同步**：從 Supabase 讀取會員卡資料

### 開發時程估算
- **環境建置**：3-5 天
- **基礎功能開發**：1-2 週
- **整合測試**：3-5 天
- **優化調整**：1 週

---

## 🤝 **協作建議**

### 技能分工
- **Unity 開發**：3D 場景、互動邏輯
- **Web 整合**：JavaScript 橋接、API 設計
- **UI/UX 設計**：3D 介面設計、使用者體驗
- **3D 美術**：模型製作、材質設計

### 溝通機制
- **日常同步**：每日進度回報
- **週會檢視**：功能展示與問題討論
- **版本管理**：統一的 Git 流程

---

## 📚 **學習資源**

### Unity 官方文檔
- [Unity WebGL 開發指南](https://docs.unity3d.com/Manual/webgl.html)
- [Unity Addressables 系統](https://docs.unity3d.com/Packages/com.unity.addressables@1.19/manual/index.html)

### 第三方教學
- [Unity WebGL 與 JavaScript 互動](https://learn.unity.com/)
- [3D Web 應用開發最佳實務](https://threejs.org/docs/)

---

## ❓ **常見問題 FAQ**

### Q1: Unity WebGL 的檔案大小限制？
**A**: 建議控制在 50MB 以內，可透過資源壓縮和分段載入優化。

### Q2: 如何處理不同裝置的效能差異？
**A**: 提供多個畫質等級選項，自動檢測裝置效能調整。

### Q3: Unity 與現有系統的資料同步如何實現？
**A**: 透過 JavaScript 橋接，Unity 可直接調用 Web API。

### Q4: 開發成本與時程如何控制？
**A**: 採用敏捷開發，先完成 MVP 再逐步增加功能。

---

**結論**：Unity 整合到現有系統具有很高的可行性，建議採用 Unity WebGL 方案，分階段開發，先實現基礎功能再逐步擴展。整個開發週期預估 8-12 週可完成基礎版本。

*文檔版本：v1.0*  
*創建日期：2025-05-31*  
*適用範圍：會員卡系統 Unity 3D 功能擴展* 