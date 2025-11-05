Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "  COMPLETE FIX - FORCE RESTART" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

Write-Host "Checking backend..." -ForegroundColor Yellow
try {
    $products = (Invoke-WebRequest -Uri "http://localhost:5000/api/products" -UseBasicParsing).Content | ConvertFrom-Json
    Write-Host "✅ Backend working: $($products.Count) products from Atlas`n" -ForegroundColor Green
} catch {
    Write-Host "❌ Backend not responding!`n" -ForegroundColor Red
    Write-Host "Start backend: cd backend; npm run dev`n" -ForegroundColor Yellow
    exit
}

Write-Host "Updating frontend .env..." -ForegroundColor Yellow
Set-Content "C:\Users\tarun\Music\MSD project\frontend\.env" "VITE_API_URL=http://localhost:5000/api`nVITE_RAZORPAY_KEY_ID=your_razorpay_key_id_here"
Write-Host "✅ Updated to: http://localhost:5000/api`n" -ForegroundColor Green

Write-Host "Stopping all Node processes..." -ForegroundColor Yellow
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force
Start-Sleep 3
Write-Host "✅ Stopped`n" -ForegroundColor Green

Write-Host "Starting BACKEND..." -ForegroundColor Yellow
$backendPath = "C:\Users\tarun\Music\MSD project\backend"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$backendPath'; Write-Host '=== BACKEND SERVER ===' -ForegroundColor Green; npm run dev"
Start-Sleep 5
Write-Host "✅ Backend started`n" -ForegroundColor Green

Write-Host "Starting FRONTEND..." -ForegroundColor Yellow
$frontendPath = "C:\Users\tarun\Music\MSD project\frontend"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$frontendPath'; Write-Host '=== FRONTEND SERVER ===' -ForegroundColor Cyan; npm run dev"
Start-Sleep 5
Write-Host "✅ Frontend started`n" -ForegroundColor Green

Write-Host "========================================" -ForegroundColor Green
Write-Host "  SERVERS RESTARTED!" -ForegroundColor Green
Write-Host "========================================`n" -ForegroundColor Green

Write-Host "NEXT STEPS:" -ForegroundColor Cyan
Write-Host "1. Wait 10 seconds for servers to fully start" -ForegroundColor White
Write-Host "2. Open browser: http://localhost:5173" -ForegroundColor White
Write-Host "3. Press Ctrl+Shift+Delete" -ForegroundColor Yellow
Write-Host "4. Clear 'Cached images and files'" -ForegroundColor Yellow
Write-Host "5. Press Ctrl+Shift+R (hard refresh)" -ForegroundColor Yellow
Write-Host "6. Products should load!`n" -ForegroundColor White

Write-Host "Test credentials:" -ForegroundColor Cyan
Write-Host "  tarun@gmail.com / tarun123" -ForegroundColor White
Write-Host "`n"
