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

## [2025-05-15] 最新檢查與補充

### 1. member-card-simple.html 結構
- 採用單欄設計，最大寬度800px。
- 主要分為「表單區塊」與「預覽區塊」。
- 表單欄位涵蓋主圖、雪花動畫、行事曆、愛心、標題、會員資訊、按鈕、分享等，與架構文件一致。
- 每個圖片欄位皆有 file input 與上傳按鈕，並有預覽圖。
- 預覽區塊以 flex2html 技術即時渲染卡片，並顯示即將分享的 Flex Message JSON。
- 右上角顯示 LINE 用戶資訊。
- 引用 js/flex2html.min.js、js/flex2html.css、js/member-card-simple.js 及 css/style.css。

### 2. member-card-simple.js 功能
- 預設卡片資料與欄位初始化，支援自動填入 LINE 用戶頭像與名稱。
- 監聽所有 input 欄位，變更時即時更新預覽與 JSON。
- getMainBubble() 依 LINE Flex 官方格式產生 bubble 結構。
- renderPreview() 以 flex2html 預覽卡片。
- renderShareJsonBox() 顯示即將分享的 Flex Message JSON，並提供一鍵複製。
- shareToLine() 使用 liff.shareTargetPicker 分享卡片，格式正確（bubble/carousel）。
- 儲存功能目前僅為示意，尚未串接 API。
- 初始化時自動登入 LIFF，並填入預設值與用戶資訊。
- 分享按鈕與分享連結欄位皆有設計。

### 3. 資源檔案現況
- public/uploads/vip/ 目錄下有：
  - TS-B1.png（主圖）
  - TS-LOGO.png（會員圖片）
  - APNG1.png（雪花動畫）
  - icon_calendar.png（行事曆圖示）
  - loveicon.png（愛心圖示）
- public/js/ 目錄下有：
  - member-card-simple.js（主邏輯）
  - flex2html.min.js（Flex 預覽技術）
  - flex2html.css（Flex 預覽樣式）
- public/css/ 目錄下有：
  - style.css（主樣式）
  - flex2html.css（Flex 預覽樣式，與 js 目錄重複）
- public/member-card-simple.html 為主頁面，已與上述結構一致。

### 如何回復到本版本（Git 操作說明）

1. **查詢本次提交的 commit id**
   
   ```bash
   git log --oneline -- docs/member-card-simple-architecture.md
   ```
   
   找到對應「2025-05-15」這次更新的 commit id（如：`abc1234`）。

2. **回復到此版本**
   
   - 若只回復此檔案：
     ```bash
     git checkout abc1234 -- docs/member-card-simple-architecture.md
     ```
   - 若要整個專案回復到此 commit：
     ```bash
     git reset --hard abc1234
     ```

3. **推送到遠端（如需同步 GitHub）**
   ```bash
   git push origin main --force
   ```

> 建議回復前先備份目前檔案，避免資料遺失。 

## 8. 部署與測試標準作業流程

### 8.1 部署流程
1. 程式碼修改完成後，確保所有變更已提交到 Git
2. 部署到 Vercel 正式網域
   - 使用 `vercel --prod` 指令
   - 確認部署到正式網域：https://barv2.vercel.app
   - 測試頁面連結：https://barv2.vercel.app/member-card-simple.html
3. 確認部署狀態和網域設定
4. 提供測試連結給使用者：
   ```
   正式網域：https://barv2.vercel.app
   測試頁面：https://barv2.vercel.app/member-card-simple.html
   ```

### 8.2 測試流程
1. 測試頁面連結格式：`https://barv2.vercel.app/member-card-simple.html`
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

### 8.6 正式網域部署步驟
1. 確保 Vercel CLI 已安裝並登入
2. 執行部署指令：
   ```bash
   vercel --prod
   ```
3. 確認部署到正式網域：https://barv2.vercel.app
4. 提供測試連結：https://barv2.vercel.app/member-card-simple.html
5. 驗證所有功能正常運作

### 8.7 每次修改後的標準作業流程
1. 修改程式碼
2. 提交變更到 Git
3. 部署到正式網域：
   ```bash
   vercel --prod
   ```
4. 提供以下連結給使用者：
   ```
   正式網域：https://barv2.vercel.app
   測試頁面：https://barv2.vercel.app/member-card-simple.html
   ```
5. 等待使用者確認功能正常 

## [2025-05-16-1] 功能穩定版本
### 1. 分享功能設定
- 分享按鈕連結：基本 LIFF 網址
- 分享按鈕功能：使用 `shareToLine()` 函數
- 分享按鈕連結格式：`https://liff.line.me/${liffId}`

### 2. 如何回復到此版本
1. 使用 Git 回復：
   ```bash
   git checkout 2025-05-16-1
   ```
2. 重新部署：
   ```bash
   vercel --prod
   ``` 

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

### 5. 2025-05-17 版本更新
- Flex 卡片分享按鈕帶 userId 參數
- LIFF 頁面自動觸發分享
- 頁面分享連結欄位顯示正確
- 架構文件同步更新 

## [2025-05-16-1S] 穩定版本時間截點
- 本版為 2025-05-16-1S 穩定版本，已完成：
  - Flex 卡片分享按鈕帶 userId 參數
  - LIFF 頁面自動觸發分享
  - 頁面分享連結欄位顯示正確
  - 架構文件同步更新
- 回復方式：
  1. 使用 Git 回復：
     ```bash
     git checkout 2025-05-16-1S
     ```
  2. 重新部署：
     ```bash
     vercel --prod
     ```

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

### 5. 版本回復方式
- 使用 Git 回復：
  ```bash
  git checkout 2025-05-16-f
  ```
- 重新部署：
  ```bash
  vercel --prod
  ```

## 會員卡欄位對照表（2025-05-18 更新）

| 頁面標題               | 欄位名稱              | 會員卡位置說明         | 初始值（defaultCard）                                   |
|------------------------|----------------------|------------------------|--------------------------------------------------------|
| 主圖連結               | main_image_url       | 卡片主圖               | https://barv2.vercel.app/uploads/vip/TS-B1.png         |
| 主圖前雪花動畫         | snow_image_url       | 主圖上動畫圖層         | https://barv2.vercel.app/uploads/vip/APNG1.png         |
| 主圖後連結             | main_image_link      | 點主圖/雪花動畫連結    | https://secure.smore.com/n/td1qc                       |
| 行事曆圖片             | calendar_image_url   | 左下角行事曆圖         | https://barv2.vercel.app/uploads/vip/icon_calendar.png |
| 行事曆圖片後連結       | calendar_image_link  | 左下角行事曆圖後連結    | https://lihi3.cc/ZWV2u                                 |
| 行事曆下會員編號       | amember_id           | 行事曆下方會員編號     | TSAMC                                                  |
| 愛心圖片               | love_icon_url        | 右下角愛心圖           | https://barv2.vercel.app/uploads/vip/loveicon.png      |
| 愛心圖片後連結         | love_icon_link       | 右下角愛心圖後連結      | https://lihi.cc/jl7Pw                                  |
| 愛心圖片下號碼         | pageview             | 愛心下方瀏覽數         | 0000                                                   |
| 主標題                 | main_title_1         | 卡片中央主標題         | 我在呈璽                                                |
| 主標題顏色             | main_title_1_color   | 主標題字色             | #000000                                                |
| 副標題                 | main_title_2         | 主標題下方副標題       | 我在呈璽，欣賞美好幸福！我在呈璽，喝茶喝咖啡很悠閒！！我不在呈璽，就是在前往呈璽的路上！！！ |
| 副標題顏色             | main_title_2_color   | 副標題字色             | #000000                                                |
| 會員圖片               | member_image_url     | 右下角會員頭像         | https://barv2.vercel.app/uploads/vip/TS-LOGO.png       |
| 會員圖片後連結         | mem_url              | 點會員頭像連結         | https://secure.smore.com/n/td1qc                       |
| 會員名字               | display_name         | 會員頭像下方名字       | 呈璽                                                   |
| 會員名字顏色           | name_color1          | 會員名字字色           | #A4924C                                                |
| 按鈕文字               | button_1             | 左側主按鈕文字         | 加呈璽好友                                              |
| 按鈕後連結             | button_1_url         | 左側主按鈕連結         | https://lin.ee/JLLIBlP                                 |
| 按鈕顏色               | button_1_color       | 左側主按鈕顏色         | #A4924A                                                |
| 分享按鈕文字           | s_button             | 右側分享按鈕文字       | 分享給好友                                              |
| 分享按鈕後連結         | s_button_url         | 右側分享按鈕連結       | https://liff.line.me/2007327814-BdWpj70m?pageId=M01001 |
| 分享按鈕顏色           | s_button_color       | 右側分享按鈕顏色       | #A4924B                                                |

### FLEX 對應欄位補充
- 行事曆圖片後連結：`calendar_image_link` → FLEX bubble 行事曆區塊 action.uri
- 愛心圖片後連結：`love_icon_link` → FLEX bubble 愛心區塊 action.uri
- 分享按鈕後連結：`s_button_url` → FLEX bubble 右側分享按鈕 action.uri 

## [2025-05-19] 資料庫與 API 規劃更新

### 1. 資料庫結構
```sql
-- 建立 users 會員資料表
create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  line_user_id text not null unique,
  email text,
  display_name text,
  avatar_url text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- 建立 member_cards 會員卡片表
create table if not exists member_cards (
  id uuid primary key default gen_random_uuid(),
  page_id text not null,
  line_user_id text,
  user_id uuid references users(id),
  card_title text,
  main_image_url text,
  main_image_link text,
  snow_image_url text,
  calendar_image_url text,
  amember_id text,
  pageview int default 0,
  main_title_1 text,
  main_title_1_color text,
  main_title_2 text,
  main_title_2_color text,
  member_image_url text,
  member_image_link text,
  display_name text,
  name_color1 text,
  name_color2 text,
  button_1_text text,
  button_1_url text,
  button_1_color text,
  s_button_text text,
  s_button_url text,
  s_button_color text,
  flex_json jsonb,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  CONSTRAINT unique_page_user UNIQUE (page_id, line_user_id)
);

-- 建立 promo_cards 宣傳卡片表
create table if not exists promo_cards (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id),
  card_id uuid references member_cards(id),
  json_content jsonb,
  sort_order int,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);
```

### 2. API 端點規劃
```
/api
  /cards
    GET /?pageId={pageId}&userId={userId}  # 取得卡片（支援未登入和已登入）
    POST /                                 # 新增卡片
    PUT /{cardId}                          # 更新卡片
    DELETE /{cardId}                       # 刪除卡片
    GET /types                             # 取得卡片類型列表

  /promo-cards
    GET /?cardId={cardId}                  # 取得宣傳卡片列表
    POST /                                 # 新增宣傳卡片
    PUT /{id}                              # 更新宣傳卡片
    DELETE /{id}                           # 刪除宣傳卡片
```

### 3. 資料查詢邏輯
1. **未登入狀態**：
   - 使用 `pageId` 查詢預設卡片
   - SQL: `SELECT * FROM member_cards WHERE page_id = $1 AND line_user_id IS NULL`

2. **已登入狀態**：
   - 使用 `pageId` 和 `line_user_id` 查詢個人化卡片
   - SQL: `SELECT * FROM member_cards WHERE page_id = $1 AND line_user_id = $2`

### 4. 初始資料
```sql
-- 插入預設卡片資料
INSERT INTO member_cards (
  page_id,
  card_title,
  main_image_url,
  main_image_link,
  snow_image_url,
  calendar_image_url,
  amember_id,
  pageview,
  main_title_1,
  main_title_1_color,
  main_title_2,
  main_title_2_color,
  member_image_url,
  member_image_link,
  display_name,
  name_color1,
  button_1_text,
  button_1_url,
  button_1_color,
  s_button_text,
  s_button_url,
  s_button_color
) VALUES (
  'M01001',
  '我在呈璽',
  'https://barv2.vercel.app/uploads/vip/TS-B1.png',
  'https://secure.smore.com/n/td1qc',
  'https://barv2.vercel.app/uploads/vip/APNG1.png',
  'https://barv2.vercel.app/uploads/vip/icon_calendar.png',
  'TSAMC',
  0,
  '我在呈璽',
  '#000000',
  '我在呈璽，欣賞美好幸福！我在呈璽，喝茶喝咖啡很悠閒！！我不在呈璽，就是在前往呈璽的路上！！！',
  '#000000',
  'https://barv2.vercel.app/uploads/vip/TS-LOGO.png',
  'https://secure.smore.com/n/td1qc',
  '呈璽',
  '#A4924C',
  '加呈璽好友',
  'https://lin.ee/JLLIBlP',
  '#A4924A',
  '分享給好友',
  'https://liff.line.me/2007327814-BdWpj70m?pageId=M01001',
  '#A4924B'
);
``` 

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

### 會員卡資料
```json
{
  "pageId": "string",
  "userId": "string",
  "cardTitle": "string",
  "cardSubtitle": "string",
  "cardImage": "string",
  "cardColor": "string",
  "flexJson": "object"
}
```

### Flex Message 結構
```json
{
  "type": "bubble",
  "body": {
    "type": "box",
    "layout": "vertical",
    "contents": [
      {
        "type": "text",
        "text": "會員卡標題"
      }
    ]
  }
}
```

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