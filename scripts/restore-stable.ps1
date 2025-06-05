# 快速回復到穩定版本腳本
# 使用方法：在PowerShell中執行 .\scripts\restore-stable.ps1

Write-Host "🚨 準備回復到 v20250605-FINAL 穩定版本..." -ForegroundColor Yellow
Write-Host ""

# 顯示當前狀態
Write-Host "📊 當前狀態：" -ForegroundColor Cyan
git log --oneline -5

Write-Host ""
Read-Host "按 Enter 繼續，或 Ctrl+C 取消"

# 回復到穩定版本
Write-Host "🔄 回復到 v20250605-FINAL..." -ForegroundColor Green
git reset --hard v20250605-FINAL

# 強制推送（請謹慎使用）
Write-Host ""
$choice = Read-Host "是否要強制推送到遠端？(y/N)"
if ($choice -eq "y" -or $choice -eq "Y") {
    Write-Host "⚠️ 強制推送到遠端..." -ForegroundColor Red
    git push origin master --force
    Write-Host "✅ 強制推送完成" -ForegroundColor Green
} else {
    Write-Host "ℹ️ 跳過遠端推送，只在本地回復" -ForegroundColor Blue
}

Write-Host ""
Write-Host "✅ 回復完成！當前版本：" -ForegroundColor Green
git describe --tags

Write-Host ""
Write-Host "🔍 v20250605-FINAL 特色：" -ForegroundColor Cyan
Write-Host "  ✅ 預覽系統完全穩定，跨設備顯示一致"
Write-Host "  ✅ 550px固定寬度技術突破"
Write-Host "  ✅ JavaScript編碼問題修復"
Write-Host "  ✅ 響應式滑動設計完善"
Write-Host "  ✅ 生產環境超穩定" 