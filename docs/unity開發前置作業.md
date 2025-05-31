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