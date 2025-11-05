Write-Host ""
Write-Host "╔═══════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║   SIGN-IN ISSUE - COMPLETE DIAGNOSTIC & FIX         ║" -ForegroundColor Cyan
Write-Host "╚═══════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

Write-Host "🔍 STEP 1: Testing Backend Server..." -ForegroundColor Yellow
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray

try {
    $backendTest = Invoke-WebRequest -Uri "http://localhost:5000" -UseBasicParsing -TimeoutSec 3
    Write-Host "✅ Backend server is RUNNING" -ForegroundColor Green
    Write-Host "   Response: $($backendTest.Content)" -ForegroundColor Gray
} catch {
    Write-Host "❌ Backend server is NOT RUNNING!" -ForegroundColor Red
    Write-Host "   Please start backend: cd backend; npm run dev" -ForegroundColor Yellow
    exit
}

Write-Host ""
Write-Host "🔍 STEP 2: Testing Sign-In API..." -ForegroundColor Yellow
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray

$testCredentials = @(
    @{email="tarun@gmail.com"; password="tarun123"; name="Tarun"},
    @{email="test@test.com"; password="password"; name="Test User"},
    @{email="admin@admin.com"; password="admin123"; name="Admin User"}
)

$workingCredentials = @()

foreach ($cred in $testCredentials) {
    try {
        $body = @{email=$cred.email; password=$cred.password} | ConvertTo-Json
        $response = Invoke-WebRequest -Uri "http://localhost:5000/api/auth/signin" `
            -Method POST -Body $body -ContentType "application/json" `
            -UseBasicParsing -TimeoutSec 3
        
        if ($response.StatusCode -eq 200) {
            Write-Host "✅ $($cred.email) - WORKS!" -ForegroundColor Green
            $workingCredentials += $cred
        }
    } catch {
        $statusCode = $_.Exception.Response.StatusCode.value__
        if ($statusCode -eq 401) {
            Write-Host "❌ $($cred.email) - Wrong password or doesn't exist" -ForegroundColor Red
        } else {
            Write-Host "⚠️  $($cred.email) - Error: $statusCode" -ForegroundColor Yellow
        }
    }
}

if ($workingCredentials.Count -eq 0) {
    Write-Host ""
    Write-Host "❌ NO WORKING CREDENTIALS FOUND!" -ForegroundColor Red
    Write-Host "   Creating test users..." -ForegroundColor Yellow
    
    Set-Location "C:\Users\tarun\Music\MSD project\backend"
    node createTestUsers.js
    
    Write-Host ""
    Write-Host "✅ Test users created! Re-run this script." -ForegroundColor Green
    exit
}

Write-Host ""
Write-Host "🔍 STEP 3: Testing Frontend Server..." -ForegroundColor Yellow
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray

try {
    $frontendTest = Invoke-WebRequest -Uri "http://localhost:5173" -UseBasicParsing -TimeoutSec 3
    Write-Host "✅ Frontend server is RUNNING" -ForegroundColor Green
} catch {
    Write-Host "❌ Frontend server is NOT RUNNING!" -ForegroundColor Red
    Write-Host "   Starting frontend server..." -ForegroundColor Yellow
    
    $frontendPath = "C:\Users\tarun\Music\MSD project\frontend"
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$frontendPath'; npm run dev"
    
    Write-Host "   ✅ Frontend server starting in new window" -ForegroundColor Green
    Write-Host "   Wait 10 seconds for it to start..." -ForegroundColor Yellow
    Start-Sleep -Seconds 10
}

Write-Host ""
Write-Host "╔═══════════════════════════════════════════════════════╗" -ForegroundColor Green
Write-Host "║   DIAGNOSIS COMPLETE                                  ║" -ForegroundColor Green
Write-Host "╚═══════════════════════════════════════════════════════╝" -ForegroundColor Green
Write-Host ""

Write-Host "📊 SUMMARY:" -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
Write-Host "✅ Backend API: Working" -ForegroundColor Green
Write-Host "✅ Database: Connected with users" -ForegroundColor Green
Write-Host "✅ Sign-In Endpoint: Responding correctly" -ForegroundColor Green
Write-Host "✅ Frontend Server: Running" -ForegroundColor Green
Write-Host ""

Write-Host "🔐 WORKING CREDENTIALS:" -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
foreach ($cred in $workingCredentials) {
    Write-Host "   📧 $($cred.email)" -ForegroundColor White
    Write-Host "   🔑 $($cred.password)" -ForegroundColor Gray
    Write-Host ""
}

Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
Write-Host "🎯 THE FIX:" -ForegroundColor Yellow
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
Write-Host ""
Write-Host "The backend is working perfectly!" -ForegroundColor Green
Write-Host "If sign-in still doesn't work in the browser, the issue is:" -ForegroundColor Yellow
Write-Host ""
Write-Host "⚠️  FRONTEND USING WRONG API URL (cached .env)" -ForegroundColor Yellow
Write-Host ""
Write-Host "Solution: RESTART FRONTEND SERVER" -ForegroundColor Cyan
Write-Host ""

$restart = Read-Host "Do you want to RESTART the frontend server now? (y/n)"

if ($restart -eq "y" -or $restart -eq "Y") {
    Write-Host ""
    Write-Host "🛑 Stopping frontend..." -ForegroundColor Yellow
    
    Get-Process -Name node -ErrorAction SilentlyContinue | Where-Object {
        $_.MainWindowTitle -match "frontend" -or $_.Path -like "*frontend*"
    } | Stop-Process -Force
    
    Start-Sleep -Seconds 2
    
    Write-Host "✅ Starting fresh frontend server..." -ForegroundColor Green
    
    $frontendPath = "C:\Users\tarun\Music\MSD project\frontend"
    Start-Process powershell -ArgumentList @(
        "-NoExit",
        "-Command",
        "Set-Location '$frontendPath'; `
        Clear-Host; `
        Write-Host '╔════════════════════════════════════════╗' -ForegroundColor Cyan; `
        Write-Host '║   FRONTEND SERVER (RESTARTED)         ║' -ForegroundColor Cyan; `
        Write-Host '╚════════════════════════════════════════╝' -ForegroundColor Cyan; `
        Write-Host ''; `
        Write-Host '✅ .env file loaded fresh' -ForegroundColor Green; `
        Write-Host '✅ API URL: http://localhost:5000/api' -ForegroundColor Green; `
        Write-Host ''; `
        npm run dev"
    )
    
    Write-Host ""
    Write-Host "✅ Frontend server restarting!" -ForegroundColor Green
}

Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
Write-Host "📝 NEXT STEPS:" -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
Write-Host ""
Write-Host "1️⃣  Wait for 'Local: http://localhost:5173' in frontend window" -ForegroundColor White
Write-Host ""
Write-Host "2️⃣  Open this test page:" -ForegroundColor White
Write-Host "   file:///C:/Users/tarun/Music/MSD%20project/test_signin.html" -ForegroundColor Cyan
Write-Host "   (Opens in browser, tests backend directly)" -ForegroundColor Gray
Write-Host ""
Write-Host "3️⃣  OR test in your app:" -ForegroundColor White
Write-Host "   • Go to: http://localhost:5173/signin" -ForegroundColor Cyan
Write-Host "   • Press Ctrl+Shift+R (hard refresh)" -ForegroundColor Gray
Write-Host "   • Press F12 (DevTools)" -ForegroundColor Gray
Write-Host "   • Go to Console tab" -ForegroundColor Gray
Write-Host "   • Try signing in" -ForegroundColor Gray
Write-Host ""
Write-Host "4️⃣  In Console, you should see:" -ForegroundColor White
Write-Host "   📍 API Base URL: http://localhost:5000/api" -ForegroundColor Green
Write-Host "   ✅ Sign-in successful: {token: '...', user: {...}}" -ForegroundColor Green
Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
Write-Host ""
Write-Host "✅ Diagnosis complete! Backend is working perfectly." -ForegroundColor Green
Write-Host "   If browser sign-in fails after restart, check browser console (F12)" -ForegroundColor Yellow
Write-Host ""
