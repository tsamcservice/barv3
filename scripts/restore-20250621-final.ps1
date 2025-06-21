# 🎯 回復到 20250621-FINAL 穩定版本
# 日期: 2025年6月21日
# 版本: v20250621-FINAL
# 說明: 分享點數系統完整修復版本

Write-Host "🎯 準備回復到 20250621-FINAL 穩定版本..." -ForegroundColor Green
Write-Host ""

# 顯示當前狀態
Write-Host "📊 當前Git狀態:" -ForegroundColor Yellow
git status --short

Write-Host ""
Write-Host "🔄 可用的版本標籤:" -ForegroundColor Yellow
git tag --list "v20250621*" | Sort-Object

Write-Host ""
Write-Host "⚠️  警告: 此操作將會丟失當前未提交的變更!" -ForegroundColor Red
$confirm = Read-Host "是否確定要回復到 v20250621-FINAL 版本? (y/N)"

if ($confirm -eq 'y' -or $confirm -eq 'Y') {
    Write-Host ""
    Write-Host "🔄 正在回復到 v20250621-FINAL..." -ForegroundColor Green
    
    # 停止可能正在運行的開發服務器
    Write-Host "🛑 停止開發服務器..." -ForegroundColor Yellow
    taskkill /F /IM node.exe 2>$null
    Start-Sleep -Seconds 2
    
    # 清理工作區
    Write-Host "🧹 清理工作區..." -ForegroundColor Yellow
    git reset --hard HEAD
    git clean -fd
    
    # 回復到指定標籤
    Write-Host "⏪ 回復到 v20250621-FINAL..." -ForegroundColor Yellow
    git checkout v20250621-FINAL
    
    # 顯示版本資訊
    Write-Host ""
    Write-Host "✅ 成功回復到 v20250621-FINAL!" -ForegroundColor Green
    Write-Host ""
    Write-Host "📋 版本資訊:" -ForegroundColor Cyan
    git show --no-patch --format="提交: %H%n作者: %an%n日期: %ad%n訊息: %s" v20250621-FINAL
    
    Write-Host ""
    Write-Host "🎯 此版本包含的主要功能:" -ForegroundColor Cyan
    Write-Host "  ✅ 分享卡專屬回饋機制" -ForegroundColor White
    Write-Host "  ✅ 5位置排列系統 (A:80% B:50% C:10% D:10% E:10%)" -ForegroundColor White
    Write-Host "  ✅ 臨時主卡支援" -ForegroundColor White
    Write-Host "  ✅ 完整交易記錄系統" -ForegroundColor White
    Write-Host "  ✅ 簡化分享流程" -ForegroundColor White
    Write-Host "  ✅ 名詞統一 (分享卡/活動卡)" -ForegroundColor White
    Write-Host "  ✅ 詳細回饋顯示" -ForegroundColor White
    Write-Host "  ✅ 錯誤處理改進" -ForegroundColor White
    
    Write-Host ""
    Write-Host "🚀 如需啟動開發服務器，請執行:" -ForegroundColor Yellow
    Write-Host "   npm run dev" -ForegroundColor White
    
    Write-Host ""
    Write-Host "📚 相關文件:" -ForegroundColor Yellow
    Write-Host "   docs/20250621-development-summary.md - 開發總結" -ForegroundColor White
    Write-Host "   docs/分享卡功能說明與行銷文件.md - 用戶指南" -ForegroundColor White
    Write-Host "   docs/mem-card-todo.md - TODO清單" -ForegroundColor White
    
} else {
    Write-Host ""
    Write-Host "❌ 操作已取消" -ForegroundColor Red
}

Write-Host ""
Write-Host "💡 提示: 如需切換回最新開發版本，請執行:" -ForegroundColor Yellow
Write-Host "   git checkout master" -ForegroundColor White 

# 2025年6月21日 - 分享點數系統修復 - 最終備份腳本
# 此腳本包含本次修復工作的所有重要檔案備份

Write-Host "🔄 開始執行 2025年6月21日 分享點數系統修復最終備份..." -ForegroundColor Green

# 檢查是否在正確的目錄
if (!(Test-Path "package.json")) {
    Write-Host "❌ 錯誤：請在專案根目錄執行此腳本" -ForegroundColor Red
    exit 1
}

# 創建備份目錄
$backupDir = "backup-20250621-final"
if (!(Test-Path $backupDir)) {
    New-Item -ItemType Directory -Path $backupDir -Force
    Write-Host "📁 創建備份目錄：$backupDir" -ForegroundColor Yellow
}

Write-Host "📋 備份檔案清單：" -ForegroundColor Cyan

# 1. 核心API檔案
Write-Host "  🔧 API檔案：" -ForegroundColor White
$apiFiles = @(
    "pages/api/cards/pageview.js",
    "pages/api/cards/points.js", 
    "pages/api/points-history.js",
    "pages/api/points-settings.js",
    "pages/api/cards/list.js",
    "pages/api/simple-test.js"
)

foreach ($file in $apiFiles) {
    if (Test-Path $file) {
        $destPath = Join-Path $backupDir $file
        $destDir = Split-Path $destPath -Parent
        if (!(Test-Path $destDir)) {
            New-Item -ItemType Directory -Path $destDir -Force | Out-Null
        }
        Copy-Item $file $destPath -Force
        Write-Host "    ✅ $file" -ForegroundColor Green
    } else {
        Write-Host "    ❌ $file (檔案不存在)" -ForegroundColor Red
    }
}

# 2. 前端檔案
Write-Host "  🎨 前端檔案：" -ForegroundColor White
$frontendFiles = @(
    "pages/index.js",
    "public/index.html",
    "public/member-card-simple.html",
    "public/points-history.html",
    "public/js/member-card-simple.js",
    "public/js/editor.js"
)

foreach ($file in $frontendFiles) {
    if (Test-Path $file) {
        $destPath = Join-Path $backupDir $file
        $destDir = Split-Path $destPath -Parent
        if (!(Test-Path $destDir)) {
            New-Item -ItemType Directory -Path $destDir -Force | Out-Null
        }
        Copy-Item $file $destPath -Force
        Write-Host "    ✅ $file" -ForegroundColor Green
    } else {
        Write-Host "    ❌ $file (檔案不存在)" -ForegroundColor Red
    }
}

# 3. 資料庫腳本
Write-Host "  🗄️ 資料庫腳本：" -ForegroundColor White
$dbFiles = @(
    "supabase/fix-promo-cards-points.sql",
    "supabase/add-share-points-system.sql",
    "supabase/execute-share-points-only.sql",
    "supabase/supabase-init.sql"
)

foreach ($file in $dbFiles) {
    if (Test-Path $file) {
        $destPath = Join-Path $backupDir $file
        $destDir = Split-Path $destPath -Parent
        if (!(Test-Path $destDir)) {
            New-Item -ItemType Directory -Path $destDir -Force | Out-Null
        }
        Copy-Item $file $destPath -Force
        Write-Host "    ✅ $file" -ForegroundColor Green
    } else {
        Write-Host "    ❌ $file (檔案不存在)" -ForegroundColor Red
    }
}

# 4. 配置檔案
Write-Host "  ⚙️ 配置檔案：" -ForegroundColor White
$configFiles = @(
    "package.json",
    "next.config.ts",
    "tsconfig.json"
)

foreach ($file in $configFiles) {
    if (Test-Path $file) {
        $destPath = Join-Path $backupDir $file
        Copy-Item $file $destPath -Force
        Write-Host "    ✅ $file" -ForegroundColor Green
    } else {
        Write-Host "    ❌ $file (檔案不存在)" -ForegroundColor Red
    }
}

# 5. 文件檔案
Write-Host "  📚 文件檔案：" -ForegroundColor White
$docFiles = @(
    "docs/20250621-development-summary.md",
    "docs/api-documentation.md",
    "docs/system-architecture.md",
    "docs/performance-analysis.md",
    "README.md"
)

foreach ($file in $docFiles) {
    if (Test-Path $file) {
        $destPath = Join-Path $backupDir $file
        $destDir = Split-Path $destPath -Parent
        if (!(Test-Path $destDir)) {
            New-Item -ItemType Directory -Path $destDir -Force | Out-Null
        }
        Copy-Item $file $destPath -Force
        Write-Host "    ✅ $file" -ForegroundColor Green
    } else {
        Write-Host "    ❌ $file (檔案不存在)" -ForegroundColor Red
    }
}

# 創建備份資訊檔案
$backupInfo = @"
# 2025年6月21日 - 分享點數系統修復最終備份

## 備份時間
$(Get-Date -Format "yyyy-MM-dd HH:mm:ss")

## 備份內容
本備份包含2025年6月21日分享點數系統修復工作的所有相關檔案：

### 主要修復功能
1. 分享卡專屬回饋系統
2. 臨時主卡支援機制
3. 前端分享流程優化
4. 點數交易記錄系統
5. 錯誤處理改進

### 核心技術實現
- 5位置排列回饋系統 (80%-50%-10%-10%-10%)
- 所有位置回饋統一給分享卡
- 活動卡只扣點不獲得回饋
- 完整的交易記錄追蹤

### 備份檔案結構
- pages/api/：核心API邏輯
- public/：前端頁面和腳本
- supabase/：資料庫腳本
- docs/：技術文件
- 配置檔案：package.json, next.config.ts等

### 還原方法
1. 將備份檔案複製回對應位置
2. 執行 npm install 安裝依賴
3. 執行資料庫腳本更新結構
4. 重啟開發伺服器

### 版本標記
v20250621-FINAL-BACKUP

### 重要提醒
- 還原前請備份當前檔案
- 確保資料庫連線正常
- 檢查環境變數設定
"@

$backupInfo | Out-File -FilePath (Join-Path $backupDir "BACKUP_INFO.md") -Encoding UTF8

# 創建快速還原腳本
$restoreScript = @"
# 快速還原腳本 - 2025年6月21日分享點數系統修復

Write-Host "🔄 開始還原 2025年6月21日 分享點數系統修復..." -ForegroundColor Green

# 檢查備份目錄
if (!(Test-Path "backup-20250621-final")) {
    Write-Host "❌ 錯誤：找不到備份目錄 backup-20250621-final" -ForegroundColor Red
    exit 1
}

# 還原檔案
Write-Host "📋 還原檔案..." -ForegroundColor Yellow

# 還原所有檔案
Get-ChildItem -Path "backup-20250621-final" -Recurse -File | ForEach-Object {
    `$relativePath = `$_.FullName.Substring((Get-Location).Path.Length + "backup-20250621-final".Length + 2)
    `$destDir = Split-Path `$relativePath -Parent
    
    if (`$destDir -and !(Test-Path `$destDir)) {
        New-Item -ItemType Directory -Path `$destDir -Force | Out-Null
    }
    
    Copy-Item `$_.FullName `$relativePath -Force
    Write-Host "  ✅ `$relativePath" -ForegroundColor Green
}

Write-Host "🎉 還原完成！" -ForegroundColor Green
Write-Host "💡 建議執行：" -ForegroundColor Yellow
Write-Host "   1. npm install" -ForegroundColor White
Write-Host "   2. 檢查資料庫連線" -ForegroundColor White
Write-Host "   3. npm run dev" -ForegroundColor White
"@

$restoreScript | Out-File -FilePath (Join-Path $backupDir "RESTORE.ps1") -Encoding UTF8

# 壓縮備份（如果有7zip）
if (Get-Command "7z" -ErrorAction SilentlyContinue) {
    Write-Host "📦 壓縮備份檔案..." -ForegroundColor Yellow
    & 7z a -tzip "backup-20250621-final.zip" "$backupDir/*" -r
    if ($LASTEXITCODE -eq 0) {
        Write-Host "  ✅ 壓縮完成：backup-20250621-final.zip" -ForegroundColor Green
    }
}

Write-Host "🎉 備份完成！" -ForegroundColor Green
Write-Host "📁 備份位置：$backupDir" -ForegroundColor Yellow
Write-Host "📄 備份資訊：$backupDir/BACKUP_INFO.md" -ForegroundColor Yellow
Write-Host "🔄 還原腳本：$backupDir/RESTORE.ps1" -ForegroundColor Yellow

# 顯示備份統計
$totalFiles = (Get-ChildItem -Path $backupDir -Recurse -File).Count
$totalSize = (Get-ChildItem -Path $backupDir -Recurse -File | Measure-Object -Property Length -Sum).Sum
$sizeInMB = [math]::Round($totalSize / 1MB, 2)

Write-Host "📊 備份統計：" -ForegroundColor Cyan
Write-Host "  檔案數量：$totalFiles" -ForegroundColor White
Write-Host "  總大小：$sizeInMB MB" -ForegroundColor White

Write-Host "✨ 2025年6月21日 分享點數系統修復備份完成！" -ForegroundColor Green 