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