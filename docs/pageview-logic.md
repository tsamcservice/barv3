# PAGEVIEW 邏輯設計文檔

## 概述
本文檔整理會員卡系統中 PAGEVIEW 的分享及增加邏輯，包含分享次數統計、瀏覽次數統計的設計考量。

## 當前實現狀態

### 1. 編輯模式分享【分享至LINE】
**觸發方式**：用戶在編輯頁面點擊【分享至LINE】按鈕

**執行流程**：
1. 批次更新所有卡片的 pageview（主卡+宣傳卡）
2. 重新查詢資料庫取得最新 pageview 數值
3. 用最新 pageview 重新生成 FLEX JSON
4. 更新前端顯示（表單欄位、預覽區、JSON區）
5. 儲存完整卡片資料到資料庫（包含更新後的 FLEX JSON）
6. 執行分享

**結果**：
- ✅ 資料庫 pageview 欄位 +1
- ✅ 資料庫 flex_json 包含最新 pageview
- ✅ 分享出去的卡片顯示最新 pageview
- ✅ 前端預覽同步更新

### 2. 自動分享模式（卡片上的分享按鈕）
**觸發方式**：用戶點擊已分享卡片上的【分享給好友】按鈕

**最終執行流程**：
1. 查詢現有的 FLEX JSON 資料
2. **批次更新所有卡片的 pageview（主卡+宣傳卡）**
3. 重新查詢主卡取得最新 pageview 數值（僅用於識別和日誌）
4. 識別並更新 carousel 中的主卡片位置
5. 保留所有宣傳卡片的原始順序和內容
6. 執行分享（使用原始JSON，不更新其中的pageview數字）

**最終結果**：
- ✅ 資料庫 pageview 欄位 +1（主卡+宣傳卡）
- ✅ 資料庫 flex_json 保持原始內容（不更新）
- ✅ 分享出去的卡片保持一致性（顯示原始pageview）
- ✅ 所有卡片統計數據正確更新

**設計優勢**：
- **內容一致性**：所有用戶看到相同的分享內容
- **統計完整性**：主卡和宣傳卡的瀏覽統計都正確累計
- **效能最佳化**：避免即時更新JSON帶來的複雜性
- **避免競態條件**：不會因為並發分享造成數據不一致

**技術實現**：
```javascript
// 建立要更新的卡片清單
let cardIdTypeArr = [{ id: cardId, type: 'main' }];

// 如果是carousel，包含所有宣傳卡片
if (flexJson.contents && flexJson.contents.type === 'carousel') {
  const carouselContents = flexJson.contents.contents;
  carouselContents.forEach(content => {
    if (!isMainCard(content) && content._cardId) {
      cardIdTypeArr.push({ id: content._cardId, type: 'promo' });
    }
  });
}

// 批次更新pageview
await fetch('/api/cards/pageview', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ cardIdTypeArr })
});
```

## 核心技術實現

### 主卡片識別機制
使用5重識別方法確保準確識別主卡片：

1. **零寬度字符標識**（最穩定）
   ```javascript
   text: formatPageview(cardData.pageview) + '\u200B'
   ```

2. **自定義欄位識別**
   ```javascript
   _cardType: 'main'
   _cardId: 'M01001'
   ```

3. **Footer URI參數識別**
   ```javascript
   uri: "https://lihi3.cc/LY5qf?cardType=main&pageId=M01001"
   ```

4. **Footer文字特徵識別**
   ```javascript
   text: '呈璽元宇宙3D展覽館'
   ```

5. **Pageview數字格式識別**
   ```javascript
   /^\d{4}$/.test(text.replace('\u200B', ''))
   ```

### API端點
```javascript
POST /api/cards/pageview
Body: { 
  cardIdTypeArr: [
    { id: 'cardId', type: 'main' },
    { id: 'promoId', type: 'promo' }
  ]
}
```

## 數據統計設計

### 分享次數 vs 瀏覽次數

#### 當前：分享次數統計
- **觸發時機**：用戶主動點擊分享按鈕
- **統計對象**：主卡片 + 宣傳卡片
- **數據意義**：反映分享行為的頻率

#### 未來：瀏覽次數統計（TODO）
- **觸發時機**：圖片載入時
- **實現方式**：在圖片 URL 中加入統計參數
- **技術方案**：
  ```javascript
  // 在圖片URL中加入追蹤參數
  imageUrl = `${baseUrl}?track=view&cardId=${cardId}&timestamp=${Date.now()}`
  
  // 後端API記錄瀏覽
  POST /api/cards/view-tracking
  Body: { cardId, viewType: 'image_load', timestamp }
  ```

### 統計邏輯設計考量

#### 1. 分享次數（Share Count）
- **目的**：追蹤內容傳播效果
- **特性**：用戶主動行為，數量相對較少但精準
- **應用**：熱門內容分析、分享激勵機制

#### 2. 瀏覽次數（View Count）  
- **目的**：追蹤內容實際觀看量
- **特性**：被動觸發，數量大但可能有重複
- **應用**：內容曝光分析、用戶興趣追蹤

#### 3. 混合統計策略
```javascript
// 建議的數據結構
{
  shareCount: 10,     // 分享次數
  viewCount: 156,     // 瀏覽次數  
  uniqueViews: 89,    // 去重瀏覽次數
  lastShared: '2025-05-31T10:30:00Z',
  lastViewed: '2025-05-31T11:45:00Z'
}
```

## 自動分享邏輯的最佳化選項

### 選項1：保持現狀（推薦）
**邏輯**：分享出去的內容保持一致，只有資料庫統計+1

**優點**：
- 確保所有人看到相同內容
- 避免即時更新造成的不一致
- 技術實現簡單穩定

**適用場景**：重視內容一致性的場合

### 選項2：即時更新
**邏輯**：每次分享都更新pageview並儲存到資料庫

**優點**：
- 數據即時性
- 視覺反饋明確

**缺點**：
- 可能造成不同用戶看到不同數字
- 增加技術複雜度

**適用場景**：重視即時反饋的場合

### 選項3：延遲更新
**邏輯**：定期批次更新資料庫中的JSON

**優點**：
- 平衡一致性和即時性
- 減少資料庫寫入壓力

**實現**：
- 設定定時任務（如每小時更新一次）
- 或達到一定閾值時更新

## TODO 清單

### 高優先級
- [ ] 修復編輯模式預覽更新問題 ✅（已完成）
- [ ] 確認自動分享邏輯的最終決策

### 中優先級  
- [ ] 實現圖片瀏覽統計功能
- [ ] 設計分享次數與瀏覽次數的整合策略
- [ ] 建立統計數據分析儀表板

### 低優先級
- [ ] A/B測試不同統計策略的效果
- [ ] 用戶行為分析報告
- [ ] 統計數據導出功能

## 技術規範

### 版本控制
- 當前版本：v20250531-O
- 主要特性：編輯模式即時預覽修復、自動分享宣傳卡pageview更新、宣傳卡片標識機制
- 下一版本：新功能開發與優化

### 性能考量
- pageview更新操作應該異步執行
- 避免在分享流程中進行大量資料庫操作
- 考慮使用快取機制減少查詢次數

### 安全性
- 防止pageview刷量攻擊
- 限制單一用戶的頻繁操作
- 記錄操作日誌用於監控

---

*最後更新：2025-05-31*
*文檔版本：1.2* 