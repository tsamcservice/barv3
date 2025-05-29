# Member Card Simple 架構文件

## 1. 檔案結構

### 1.1 主要檔案
- `public/member-card-simple.html` - 主頁面
- `public/js/member-card-simple.js` - 主要邏輯
- `public/js/flex2html.min.js` - Flex Message 預覽技術
- `public/js/flex2html.css` - Flex Message 預覽樣式

### 1.2 資源檔案
- `public/uploads/vip/`
  - `TS-B1.png` - 主圖
  - `TS-LOGO.png` - 會員圖片
  - `APNG1.png` - 雪花動畫
  - `icon_calendar.png` - 行事曆圖示
  - `loveicon.png` - 愛心圖示

## 2. 前端架構

### 2.1 頁面布局
- 單欄設計（800px 寬度）
- 表單區塊（form-section）
- 預覽區塊（preview-section）
- 右上角 LINE 用戶資訊

### 2.2 表單欄位
1. 主圖相關
   - 主圖連結（main_image_url）
   - 主圖後連結（main_image_link）
   - 雪花動畫（snow_image_url）

2. 標題相關
   - 主標題（main_title_1）
   - 主標題顏色（main_title_1_color）
   - 副標題（main_title_2）
   - 副標題顏色（main_title_2_color）

3. 會員資訊
   - 會員圖片（member_image_url）
   - 會員名字（display_name）
   - 會員名字顏色（name_color1）
   - 會員圖片後連結（mem_url）

4. 功能按鈕
   - 按鈕文字（button_1）
   - 按鈕後連結（button_1_url）
   - 按鈕顏色（button_1_color）
   - 分享按鈕文字（s_button）
   - 分享按鈕後連結（s_button_url）
   - 分享按鈕顏色（s_button_color）

5. 額外功能
   - 行事曆圖片（calendar_image_url）
   - 會員編號（amember_id）
   - 愛心圖片（love_icon_url）
   - 瀏覽數（pageview）

### 2.3 預覽功能
- 使用 flex2html 技術
- 即時預覽
- JSON 顯示與複製功能

## 3. 後端整合

### 3.1 LINE LIFF
- LIFF ID: 2007327814-BdWpj70m
- 功能：
  - 用戶登入
  - 取得用戶資訊
  - 分享功能（shareTargetPicker）

### 3.2 API 端點
- 儲存功能（待實作）
  - 端點：/api/cards/save
  - 方法：POST
  - 資料格式：JSON

## 4. 資料流程

### 4.1 初始化流程
1. LIFF 初始化
2. 檢查登入狀態
3. 載入預設值
4. 取得用戶資訊
5. 渲染預覽

### 4.2 資料更新流程
1. 表單輸入變更
2. 即時更新預覽
3. 更新 JSON 顯示
4. 準備分享資料

### 4.3 分享流程
1. 點擊分享按鈕
2. 檢查 LIFF 狀態
3. 準備 Flex Message
4. 呼叫 shareTargetPicker
5. 處理分享結果

## 5. 待優化項目

### 5.1 功能優化
- 圖片上傳功能完善
- 儲存功能實作
- 錯誤處理機制
- 載入狀態顯示

### 5.2 效能優化
- 圖片預載入
- 預覽效能優化
- 程式碼模組化

### 5.3 使用者體驗
- 表單驗證
- 操作提示
- 錯誤訊息
- 載入動畫

## 6. 技術依賴

### 6.1 核心技術
- LINE LIFF SDK
- Flex Message 格式
- flex2html 預覽技術

### 6.2 外部資源
- LINE 官方圖示
- 預設圖片資源
- 字體與樣式

## 7. 注意事項

### 7.1 開發規範
- 保持單欄設計
- 符合 LINE Flex 官方規範
- 維持程式碼可讀性

### 7.2 部署注意
- 確保資源檔案完整性
- 檢查 API 端點可用性
- 驗證 LIFF 設定

### 7.3 維護建議
- 定期更新 LIFF SDK
- 監控 API 效能
- 備份重要資源


## 8. 部署與測試標準作業流程

### 8.1 部署流程
1. 程式碼修改完成後，確保所有變更已提交到 Git
2. 部署到 Vercel 正式網域
   - 使用 `vercel --prod` 指令
   - 確認部署到正式網域：https://barv3.vercel.app
   - 測試頁面連結：https://barv3.vercel.app/member-card-simple.html
3. 確認部署狀態和網域設定
4. 提供測試連結給使用者：
   ```
   正式網域：https://barv3.vercel.app
   測試頁面：https://barv3.vercel.app/member-card-simple.html
   ```

### 8.2 測試流程
1. 測試頁面連結格式：`https://barv3.vercel.app/member-card-simple.html`
2. 測試項目：
   - 基本功能測試
     - 表單欄位輸入與預覽
     - 圖片上傳功能
     - 顏色選擇器
   - 分享功能測試
     - 分享按鈕點擊
     - 分享到 LINE 功能
     - Flex Message 格式驗證
   - LIFF 整合測試
     - 登入狀態
     - 用戶資訊顯示
     - 權限驗證

### 8.3 驗收標準
1. 所有功能正常運作
2. 分享功能正確執行
3. 無 JavaScript 錯誤
4. 頁面載入速度正常
5. 響應式設計正常

### 8.4 回滾機制
1. 如發現問題，可立即回滾到上一個穩定版本
2. 使用 Git 版本控制進行回滾
3. 重新部署到 Vercel 正式網域

### 8.5 監控與維護
1. 定期檢查 Vercel 部署狀態
2. 監控錯誤日誌
3. 追蹤使用者回饋
4. 定期更新依賴套件



## [2025-05-17] Flex 分享優化與自動分享機制

### 1. Flex 卡片分享按鈕帶 userId 參數
- Flex Message 內「分享給好友」按鈕，連結格式為：
  `https://liff.line.me/${liffId}?userId=xxxx`
- userId 來源為分享者的 LINE userId，可作為資料庫查詢索引。

### 2. LIFF 頁面自動觸發分享
- 若網址帶有 userId 參數，頁面 onload 時自動執行 shareToLine()，彈出分享視窗。
- 若需縮短預覽→分享的時間差，可將 shareToLine() 觸發時機提前（如 DOMContentLoaded），或優化頁面渲染流程。

### 3. 根據 userId 取得個人化卡片內容
- LIFF 頁面 onload 時，若偵測到 userId 參數，建議：
  1. 先用 userId 向後端 API 查詢該用戶儲存的卡片資料。
  2. 若有資料則渲染該用戶專屬卡片，並用於分享。
  3. 若無資料則顯示預設卡片。
- API 範例：
  `/api/cards/list?userId=xxxx`

### 4. shareToLine() 與 shareTargetPicker 差異
- `shareToLine()`：本專案自訂的 JS 函數，內部呼叫 `liff.shareTargetPicker()`。
- `liff.shareTargetPicker()`：LINE 官方 LIFF API，可彈出分享視窗，讓用戶選擇好友或群組分享 Flex Message。
- Flex Message 內的按鈕（type: uri）**無法直接觸發 shareTargetPicker**，只能導向 LIFF 頁面，由 JS 觸發分享。
- 目前無法直接將卡片一鍵分享到「按卡片時的對話視窗」；用戶需在分享視窗中選擇對象。



## Q&A 與最佳實務建議

### Q1. 是否能直接將卡片/訊息分享至所在群組？
- 目前 LINE 官方 LIFF API（liff.shareTargetPicker）**無法直接指定群組或好友**，只能彈出選擇視窗讓用戶自行選擇。
- 某些特殊 LIFF 應用（如官方範例）可在特定情境下（如在群組聊天室內開啟 LIFF）自動帶入群組 ID，並直接傳送訊息，但這需配合 LINE 官方帳號、LIFF 設定及權限。
- 目前本專案未支援直接指定群組自動傳送，僅能由用戶選擇對象。
- 參考連結（如您提供的 send-2xtdpmzkt）多為官方帳號/特定 LIFF 應用，需有完整權限與設定。

### Q2. FLEX 存資料庫方式效能建議
- **分欄位存**：
  - 優點：方便後續查詢、統計、個別欄位修改、資料分析。
  - 缺點：組裝 FLEX 時需多一次欄位合成，程式稍複雜。
- **合成一筆存（JSON 或字串）**：
  - 優點：存取簡單，直接取出即用於渲染或傳送。
  - 缺點：不利於後續查詢、分析、欄位單獨修改。
- **效能差異**：
  - 若資料量不大，兩者差異極小。
  - 若需大量查詢/分析，建議分欄位存，並可額外存一份合成 JSON 以利直接傳送。
- **建議**：
  - 可「分欄位存」+「同步存一份完整 FLEX JSON」欄位，查詢時直接取 JSON 傳送，維持彈性與效能。

### Q3. userId 參數下可否直接傳送 FLEX？
- 若網址帶有 userId 參數，且後端可直接查出該 userId 的 FLEX JSON，前端可**略過預覽渲染階段**，直接呼叫 shareToLine() 傳送 FLEX。
- 這樣可大幅縮短等待時間，提升體驗。
- 建議：
  1. onload 檢查 userId 參數
  2. 直接 fetch FLEX JSON
  3. 取得後直接呼叫分享，不需再渲染預覽

## [2025-05-16-f] 功能規劃與資料庫設計重點截點

### 1. 卡片分類與 pageId+userId 邏輯
- 每張卡片唯一由 pageId（卡片分類+流水號，如 M01001）+ userId（LINE用戶ID）組合標示。
- pageId 第一碼為卡片分類（M=會員卡，A/C/E=活動卡...），後五碼為流水號。
- 分享連結、資料查詢、儲存皆以 pageId+userId 為主索引。
- 初始卡片（未登入）僅有 pageId，登入後自動升級為 pageId+userId 專屬卡片。

### 2. 資料庫設計建議
- 主表建議：`member_cards`
- 主要欄位：
  - id（自動流水號，PK）
  - page_id（VARCHAR(6)）
  - user_id（VARCHAR(50)）
  - card_type（VARCHAR(20)，如會員/活動）
  - flex_json（TEXT，完整FLEX內容）
  - 其他分欄位（title, image_url, ...，依需求擴充）
  - created_at, updated_at（DATETIME）
- 唯一索引：UNIQUE(page_id, user_id)
- 查詢建議：WHERE page_id=? AND user_id=?

### 3. API 設計建議
- 查詢卡片：GET /api/cards/get?pageId=M01001&userId=xxx
- 查詢初始卡片：GET /api/cards/get?pageId=M01001
- 儲存/更新卡片：POST /api/cards/save
- 取得所有卡片分類：GET /api/cards/types

### 4. 前端邏輯重點
- 進入頁面時解析 pageId、userId，依據參數查詢卡片資料。
- 分享連結、FLEX 內按鈕 action.uri 必須同時帶 pageId 與 userId。
- 圖片上傳、欄位編輯、預覽、FLEX JSON 顯示等功能需與資料庫欄位同步。



### FLEX 對應欄位補充
- 行事曆圖片後連結：`calendar_image_link` → FLEX bubble 行事曆區塊 action.uri
- 愛心圖片後連結：`love_icon_link` → FLEX bubble 愛心區塊 action.uri
- 分享按鈕後連結：`s_button_url` → FLEX bubble 右側分享按鈕 action.uri 



# 會員卡頁面 onload 流程與關鍵點（2025-05-18）

## 1. 頁面初始化（window.onload）
1. 初始化 LIFF 並登入
2. 取得 LINE profile，取得 userId、displayName、pictureUrl，並顯示於右上角
3. 用 userId 查詢 `/api/cards?pageId=M01001&userId=xxx` 取得個人化卡片資料
   - 有資料：自動填入所有 input 欄位
   - 無資料：用 defaultCard 預設值 + LIFF profile 填入
4. 掛 input 監聽（主標題、名字變動時自動更新 card_alt_title）
5. 自動渲染預覽區塊與 FLEX JSON 區塊

## 2. 欄位自動帶入與覆蓋邏輯
- 右上角顯示 LINE 頭像與名字（renderLiffUserInfo）
- display_name、member_image_url 會被 LINE profile 覆蓋
- 其他欄位以資料庫資料為主，無資料時用 defaultCard

## 3. 預覽與分享
- 只要主標題或名字變動，card_alt_title 會自動變成「主標題/名字」
- 預覽區塊、FLEX JSON 區塊即時更新
- 分享與儲存都會用最新資料

## 4. 儲存與查詢
- 儲存時會 upsert 到資料庫，並自動補齊 user_id
- 查詢時依 pageId+userId 唯一索引取得個人化卡片

## 5. UX 補充
- 第一次進入時若 card_alt_title 為空，需用戶編輯主標題或名字後才會自動補齊
- 之後分享、儲存都會是新資料

---
（本段已同步於 2025-05-18-f 時間截點） 

## 版本資訊
- 當前版本：20250520-f
- 部署狀態：自動部署已啟用
- 最後更新：2024-05-20

## 功能架構

### 前端功能
- 會員卡編輯器
- Flex Message 預覽
- 即時預覽
- 分享功能
- JSON 複製

### 後端功能
- 卡片資料儲存
- 使用者認證
- API 路由處理
- 資料庫操作

## 資料結構

## API 端點

### 卡片操作
- GET /api/cards：查詢卡片
- POST /api/cards：更新/新增卡片
- GET /api/cards/list：列出所有卡片
- DELETE /api/cards：刪除卡片

## 部署資訊
- 平台：Vercel
- 自動部署：已啟用
- 環境變數：已設定
- 監控：Vercel Dashboard

## 版本控制
- 主分支：master
- 功能分支：feature/*
- 修復分支：hotfix/*
- 版本標籤：v{日期}-{功能}

## 開發流程
1. 功能開發
2. 本地測試
3. 提交程式碼
4. 自動部署
5. 生產環境測試

## 維護指南
- 定期檢查部署狀態
- 監控錯誤日誌
- 更新環境變數
- 備份資料庫 

## 專案型態說明
- 本專案為 Next.js 專案，所有 API 路由請放在 pages/api 目錄下，首頁與靜態頁面請以 Next.js 標準結構為主。
- 請勿隨意加入 vercel.json 或更改專案型態，以免影響 Vercel 部署與 API 運作。 

## 圖片儲存與讀取說明
- 所有圖片上傳後會儲存在 Supabase Storage 的 member-cards bucket。
- 管理員可在 Supabase 後台直接查看所有圖片。
- 會員端僅能取得自己上傳時回傳的圖片連結，無法直接瀏覽 bucket 內所有圖片。

## TODO
- 未來可開發「會員只看到自己圖片」功能：
  - 上傳時以 userId 作為路徑前綴（如 user-12345/xxx.jpg）。
  - 設計 API 查詢該會員的所有圖片，前端顯示。
  - Storage Policy 可進一步限制只有本人能讀取/刪除自己檔案。

---

## [20250530-F] Bug修復與功能優化總結

### 🎯 **本次修復成果**

#### ✅ **已完全解決的問題**
1. **頁面載入與排序**
   - 頁面正常顯示 ✅
   - 排序區正確排序 ✅
   - 預覽區多卡片正確顯示 ✅
   - JSON區顯示正確排序 ✅
   - 資料庫JSON正確排序 ✅

2. **編輯模式分享功能**
   - 【按分享到LINE】功能完全正常 ✅
   - pageview 正確 +1 ✅
   - 分享出去的卡片pageview正確更新 ✅
   - **重要修復**：整包FLEX的pageview欄位正確+1 ✅

#### 🔄 **仍需改善的問題**
3. **自動分享功能（卡片上的分享按鈕）**
   - pageview 有正確 +1 ✅
   - 但主卡取代其他卡片，出現2張主卡 ❌
   - 需要更精確的主卡識別機制

### 🔧 **核心技術修復**

#### **1. 執行順序優化**
**問題**：編輯模式分享時 FLEX pageview 欄位是舊的
**解決**：調整 `shareToLine()` 執行順序
```javascript
// 修復前：儲存JSON → 更新pageview → 分享（舊數據）
// 修復後：更新pageview → 重新生成JSON → 儲存 → 分享（新數據）
```

#### **2. JSON排序統一**
**問題**：預覽區底下的JSON排序與排序區不一致
**解決**：重構 `renderShareJsonBox()` 使用 `allCardsSortable`
```javascript
// 統一使用 allCardsSortable 的排序結果
const flexArr = allCardsSortable.map(c => c.flex_json);
```

#### **3. 預覽區多卡片支援**
**問題**：預覽區只顯示主卡片
**解決**：修改 `renderPreview()` 智能判斷單卡片/多卡片
```javascript
if (allCardsSortable && allCardsSortable.length > 1) {
  // 渲染 carousel
} else {
  // 渲染單卡片
}
```

### 🚀 **明天開發計劃**

#### **優先任務**
1. **自動分享功能優化**
   - 在 FLEX JSON 中加入卡片ID辨別（pageId + LINE userId）
   - 改進主卡識別邏輯，避免誤判
   - 確保不會出現2張主卡

2. **OG預覽頁面強化**
   - 優化分享時的預覽圖片
   - 改善社群媒體分享體驗
   - Meta tags 優化

#### **技術改進方向**
3. **卡片識別機制**
   ```javascript
   // 建議加入卡片元數據
   {
     type: 'flex',
     contents: {...},
     cardMeta: {
       cardId: 'main',
       pageId: 'M01001', 
       userId: 'line_user_id',
       cardType: 'main' // 'main' | 'promo'
     }
   }
   ```

4. **自動分享邏輯重構**
   - 統整分享功能邏輯
   - 建立統一的分享處理函數
   - 簡化程式碼結構

### 📊 **功能狀態總覽**

| 功能 | 狀態 | 說明 |
|------|------|------|
| 頁面載入 | ✅ | 完全正常 |
| 卡片排序 | ✅ | 所有區域一致 |
| 編輯模式分享 | ✅ | 包括pageview更新 |
| 自動分享功能 | 🔄 | 主卡識別待改善 |
| 預覽功能 | ✅ | 多卡片支援 |
| JSON顯示 | ✅ | 正確排序 |

### 💡 **技術債務與改善建議**

1. **程式碼結構**
   - 分享邏輯可進一步模組化
   - 卡片識別可抽象成獨立函數

2. **錯誤處理**
   - 加強自動分享失敗的處理機制
   - 優化用戶體驗

3. **效能優化**
   - 減少重複的API查詢
   - 快取機制改善

---

### 🏷️ **版本標記**
- **版本**：20250530-F
- **主要成就**：編輯模式分享功能完全修復
- **待改善**：自動分享主卡識別
- **下次重點**：OG預覽頁面 + 自動分享優化 