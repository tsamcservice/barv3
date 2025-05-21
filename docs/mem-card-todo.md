# 會員卡功能開發待辦（2025-05-17）

## 1. 資料庫與 API 基礎建置
- [ ] 建立主表 `member_cards`，欄位：
  - id（PK，自動流水號）
  - page_id（VARCHAR(6)）
  - user_id（VARCHAR(50)）
  - card_type（VARCHAR(20)）
  - flex_json（TEXT）
  - 其他分欄位（title, image_url, ...）
  - created_at, updated_at（DATETIME）
  - UNIQUE(page_id, user_id)
- [ ] API 設計：
  - GET `/api/cards/get?pageId=M01001&userId=xxx`（查詢會員卡）
  - GET `/api/cards/get?pageId=M01001`（查詢初始卡片）
  - POST `/api/cards/save`（儲存/更新卡片）
  - GET `/api/cards/types`（查詢所有卡片分類）
- [ ] API 回傳格式、錯誤處理、權限驗證（如需）

## 2. 前端欄位與圖片上傳
- [ ] 確認所有欄位（含 calendar_image_link、love_icon_link）在表單正確顯示、可編輯
- [ ] 圖片上傳功能（含預覽），可將圖片上傳並取得URL，並能正確存入資料庫
- [ ] 欄位即時預覽、FLEX JSON 顯示，與資料庫欄位同步

## 3. 分享連結與 FLEX 產生邏輯
- [ ] 產生正確的分享連結（同時帶 pageId+userId），FLEX 內按鈕 action.uri 正確顯示
- [ ] LIFF 自動分享流程，根據網址參數自動取得資料並分享

## 4. 附加卡片/多卡片管理
- [ ] 設計多卡片/附加卡片資料結構（如一個 userId 可有多個 pageId）
- [ ] 前端 UI 支援切換/管理多卡片（如卡片列表、切換、編輯、刪除）
- [ ] API 支援多卡片查詢/儲存/刪除
- [ ] FLEX JSON 結構支援多卡片（如 carousel）

## 5. 進階功能與優化
- [ ] 權限控管、後台管理、卡片分類管理
- [ ] 操作體驗優化、錯誤提示、資料驗證
- [ ] 效能優化、快取、日誌

## 6. 會員專屬圖片功能（待開發）
- [ ] 上傳時以 userId 作為路徑前綴（如 user-12345/xxx.jpg）。
- [ ] 設計 API 查詢該會員的所有圖片，前端顯示。
- [ ] Storage Policy 可進一步限制只有本人能讀取/刪除自己檔案。
- [ ] 會員端僅能取得自己上傳時回傳的圖片連結，無法直接瀏覽 bucket 內所有圖片。

---

### 技術建議
- **資料庫**：建議 MySQL/MariaDB/PostgreSQL，欄位型態依實際需求調整。
- **API**：RESTful 設計，回傳 JSON，錯誤訊息明確。
- **前端**：欄位與資料庫同步，圖片上傳可用 base64 或雲端儲存（如 S3），預覽與 FLEX JSON 實時渲染。
- **多卡片管理**：可用 pageId+userId 組合查詢，UI 支援卡片列表與切換。
- **FLEX**：每張卡片一份 JSON，支援 carousel 結構。
- **安全性**：API 權限驗證，避免未授權存取。

---

> 請依此順序逐步開發、測試，確保每階段功能獨立可驗證，方便日後擴充與維護。

# 明日開發待辦（2025-05-19）

1. 多卡片管理
   - 支援同一 userId 綁定多個 pageId
   - 前端 UI 支援卡片切換、列表、刪除
   - API 查詢/儲存/刪除多卡片

2. 圖片上傳優化
   - 支援圖片即時預覽、壓縮、上傳進度
   - 上傳至雲端（如 S3）並自動填入 URL

3. 後台管理介面
   - 會員卡列表、搜尋、編輯、刪除
   - 權限控管（僅管理員可操作）

4. 權限控管
   - API 權限驗證，避免未授權存取
   - 前端登入狀態判斷

5. API 錯誤處理與日誌
   - 完善錯誤訊息回傳
   - 伺服器端日誌記錄

6. UI/UX 優化
   - 表單驗證、操作提示
   - 響應式設計、載入動畫

--- 