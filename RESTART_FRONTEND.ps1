Write-Host "`n================================" -ForegroundColor Cyan
Write-Host "FRONTEND SERVER RESTART" -ForegroundColor Cyan
Write-Host "================================`n" -ForegroundColor Cyan

Write-Host "🛑 Stopping any running frontend processes..." -ForegroundColor Yellow
Get-Process -Name node -ErrorAction SilentlyContinue | Where-Object { $_.MainWindowTitle -match "frontend" } | Stop-Process -Force
Start-Sleep -Seconds 1

Write-Host "✅ Starting fresh frontend server...`n" -ForegroundColor Green

$frontendPath = "C:\Users\tarun\Music\MSD project\frontend"
Set-Location $frontendPath

Write-Host "📂 Working directory: $frontendPath" -ForegroundColor Gray
Write-Host "🔧 Environment variables:" -ForegroundColor Gray
Write-Host "   VITE_API_URL = http://localhost:5000/api`n" -ForegroundColor Gray

Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$frontendPath'; Write-Host '🎨 FRONTEND SERVER' -ForegroundColor Cyan; npm run dev"

Write-Host "`n✅ Frontend server starting in new window!" -ForegroundColor Green
Write-Host "`n📝 Next steps:" -ForegroundColor Yellow
Write-Host "  1. Wait for 'Local: http://localhost:5173' message" -ForegroundColor White
Write-Host "  2. Open browser to http://localhost:5173/signin" -ForegroundColor White
Write-Host "  3. Press Ctrl+Shift+R to hard refresh" -ForegroundColor White
Write-Host "  4. Press F12 to open DevTools" -ForegroundColor White
Write-Host "  5. Try signing in with: test@test.com / password`n" -ForegroundColor White

Write-Host "🧪 Test users:" -ForegroundColor Cyan
Write-Host "  • test@test.com / password" -ForegroundColor White
Write-Host "  • admin@admin.com / admin123" -ForegroundColor White
Write-Host "  • tarun@gmail.com / tarun123`n" -ForegroundColor White
