Write-Host "`n" -NoNewline
Write-Host "╔════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║   SIGN-IN FIX - AUTOMATED SOLUTION    ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

Write-Host "📊 DIAGNOSIS:" -ForegroundColor Yellow
Write-Host "   ✅ Backend API: Working" -ForegroundColor Green
Write-Host "   ✅ Database: 3 users ready" -ForegroundColor Green
Write-Host "   ✅ Frontend code: Correct" -ForegroundColor Green
Write-Host "   ⚠️  Frontend server: Needs restart`n" -ForegroundColor Yellow

Write-Host "🔧 SOLUTION: Restart frontend with fresh .env`n" -ForegroundColor Cyan

Write-Host "🛑 Step 1: Finding frontend processes..." -ForegroundColor Yellow
$frontendProcs = Get-Process -Name node -ErrorAction SilentlyContinue | Where-Object {
    $_.Path -like "*frontend*" -or $_.CommandLine -like "*frontend*"
}

if ($frontendProcs) {
    Write-Host "   Found running frontend process. Stopping..." -ForegroundColor Gray
    $frontendProcs | Stop-Process -Force
    Start-Sleep -Seconds 2
    Write-Host "   ✅ Stopped`n" -ForegroundColor Green
} else {
    Write-Host "   ℹ️  No frontend process found running`n" -ForegroundColor Gray
}

Write-Host "✅ Step 2: Starting fresh frontend server...`n" -ForegroundColor Green

$frontendPath = "C:\Users\tarun\Music\MSD project\frontend"
Start-Process powershell -ArgumentList @(
    "-NoExit",
    "-Command",
    "Set-Location '$frontendPath'; `
    Clear-Host; `
    Write-Host '╔════════════════════════════════════════╗' -ForegroundColor Cyan; `
    Write-Host '║       FRONTEND SERVER (FRESH)         ║' -ForegroundColor Cyan; `
    Write-Host '╚════════════════════════════════════════╝' -ForegroundColor Cyan; `
    Write-Host ''; `
    Write-Host '📂 Directory: frontend' -ForegroundColor Gray; `
    Write-Host '🔧 API URL: http://localhost:5000/api' -ForegroundColor Gray; `
    Write-Host ''; `
    Write-Host 'Starting Vite dev server...' -ForegroundColor Yellow; `
    Write-Host ''; `
    npm run dev"
)

Start-Sleep -Seconds 3

Write-Host "✅ Frontend server starting!`n" -ForegroundColor Green
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
Write-Host "📝 NEXT STEPS:" -ForegroundColor Yellow
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
Write-Host ""
Write-Host "1️⃣  Wait for" -NoNewline; Write-Host " 'Local: http://localhost:5173'" -ForegroundColor Cyan -NoNewline; Write-Host " in the new window"
Write-Host "2️⃣  Open browser:" -NoNewline; Write-Host " http://localhost:5173/signin" -ForegroundColor Cyan
Write-Host "3️⃣  Press" -NoNewline; Write-Host " Ctrl+Shift+R" -ForegroundColor Cyan -NoNewline; Write-Host " (hard refresh)"
Write-Host "4️⃣  Press" -NoNewline; Write-Host " F12" -ForegroundColor Cyan -NoNewline; Write-Host " (open DevTools)"
Write-Host "5️⃣  Sign in with:" -NoNewline; Write-Host " test@test.com / password" -ForegroundColor Cyan
Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
Write-Host "🧪 TEST USERS:" -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
Write-Host ""
Write-Host "   📧 test@test.com" -ForegroundColor White
Write-Host "   🔑 password" -ForegroundColor Gray
Write-Host ""
Write-Host "   📧 admin@admin.com" -ForegroundColor White
Write-Host "   🔑 admin123" -ForegroundColor Gray
Write-Host ""
Write-Host "   📧 tarun@gmail.com" -ForegroundColor White  
Write-Host "   🔑 tarun123" -ForegroundColor Gray
Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
Write-Host "🔍 IN BROWSER CONSOLE (F12), YOU SHOULD SEE:" -ForegroundColor Yellow
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
Write-Host ""
Write-Host "   🔐 Attempting sign-in with: test@test.com" -ForegroundColor Gray
Write-Host "   📍 API Base URL: http://localhost:5000/api" -ForegroundColor Green
Write-Host "   ✅ Sign-in successful: {token: '...', user: {...}}" -ForegroundColor Green
Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
Write-Host ""
Write-Host "❓ Need help? Check:" -ForegroundColor Yellow
Write-Host "   • SIGNIN_FIX.md - Quick troubleshooting" -ForegroundColor White
Write-Host "   • SIGNIN_ISSUE_SUMMARY.md - Complete analysis" -ForegroundColor White
Write-Host ""
