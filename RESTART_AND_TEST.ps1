# Restart Servers and Test COD
Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host " RESTARTING SERVERS & TESTING COD" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

$projectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path

# Stop all node processes
Write-Host "1. Stopping all Node processes..." -ForegroundColor Yellow
Get-Process -Name node -ErrorAction SilentlyContinue | Stop-Process -Force
Start-Sleep -Seconds 2
Write-Host "   ✅ Stopped`n" -ForegroundColor Green

# Start Backend
Write-Host "2. Starting Backend..." -ForegroundColor Yellow
$backendPath = Join-Path $projectRoot "backend"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$backendPath'; `$host.UI.RawUI.WindowTitle='BACKEND - Port 5000'; npm run dev" -WindowStyle Normal
Start-Sleep -Seconds 6
Write-Host "   ✅ Backend started`n" -ForegroundColor Green

# Start Frontend
Write-Host "3. Starting Frontend..." -ForegroundColor Yellow
$frontendPath = Join-Path $projectRoot "frontend"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$frontendPath'; `$host.UI.RawUI.WindowTitle='FRONTEND - Port 5173'; npm run dev" -WindowStyle Normal
Start-Sleep -Seconds 6
Write-Host "   ✅ Frontend started`n" -ForegroundColor Green

# Test Backend
Write-Host "4. Testing Backend..." -ForegroundColor Yellow
Start-Sleep -Seconds 2
try {
    $backend = Invoke-WebRequest -Uri "http://localhost:5000" -TimeoutSec 5 -UseBasicParsing
    Write-Host "   ✅ Backend responding: $($backend.StatusCode)" -ForegroundColor Green
} catch {
    Write-Host "   ⚠️  Backend not responding yet (may need more time)" -ForegroundColor Yellow
}

# Test Frontend
try {
    $frontend = Invoke-WebRequest -Uri "http://localhost:5173" -TimeoutSec 5 -UseBasicParsing
    Write-Host "   ✅ Frontend responding: $($frontend.StatusCode)" -ForegroundColor Green
} catch {
    Write-Host "   ⚠️  Frontend not responding yet (may need more time)" -ForegroundColor Yellow
}

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host " SERVERS RUNNING!" -ForegroundColor Green
Write-Host "========================================`n" -ForegroundColor Cyan

Write-Host "📱 Open: http://localhost:5173" -ForegroundColor White
Write-Host "🔑 Login: tarun@gmail.com / tarun123" -ForegroundColor White

Write-Host "`nTest COD Feature:" -ForegroundColor Magenta
Write-Host "  1. Add products to cart"
Write-Host "  2. Go to Checkout"
Write-Host "  3. Select 'Cash on Delivery'"
Write-Host "  4. Fill address & phone"
Write-Host "  5. Click 'Place Order (COD)'"
Write-Host "  6. Order should place successfully! 🎉`n"

Write-Host "Press any key to close..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
