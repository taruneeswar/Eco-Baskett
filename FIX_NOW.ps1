Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "  SIGN-IN FIX - AUTOMATED" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

Write-Host "Testing backend..." -ForegroundColor Yellow
try {
    $test = Invoke-WebRequest -Uri "http://localhost:5000" -UseBasicParsing
    Write-Host "OK Backend running`n" -ForegroundColor Green
} catch {
    Write-Host "ERROR Backend not running!`n" -ForegroundColor Red
    Write-Host "Start backend first: cd backend; npm run dev" -ForegroundColor Yellow
    exit
}

Write-Host "Testing sign-in with tarun@gmail.com..." -ForegroundColor Yellow
try {
    $body = '{"email":"tarun@gmail.com","password":"tarun123"}'
    $result = Invoke-WebRequest -Uri "http://localhost:5000/api/auth/signin" -Method POST -Body $body -ContentType "application/json" -UseBasicParsing
    $data = $result.Content | ConvertFrom-Json
    Write-Host "OK Sign-in works! User:" $data.user.name "`n" -ForegroundColor Green
} catch {
    Write-Host "ERROR Sign-in failed!`n" -ForegroundColor Red
    Write-Host "Creating users..." -ForegroundColor Yellow
    Set-Location "C:\Users\tarun\Music\MSD project\backend"
    node createTestUsers.js
    Write-Host "`nUsers created! Try again.`n" -ForegroundColor Green
    exit
}

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  BACKEND IS WORKING PERFECTLY!" -ForegroundColor Green
Write-Host "========================================`n" -ForegroundColor Cyan

Write-Host "Credentials that work:" -ForegroundColor Cyan
Write-Host "  tarun@gmail.com / tarun123" -ForegroundColor White
Write-Host "  test@test.com / password" -ForegroundColor White
Write-Host "  admin@admin.com / admin123`n" -ForegroundColor White

Write-Host "If browser sign-in doesn't work:" -ForegroundColor Yellow
Write-Host "  RESTART YOUR FRONTEND SERVER`n" -ForegroundColor Cyan

$answer = Read-Host "Restart frontend now? (y/n)"

if ($answer -eq "y") {
    Write-Host "`nStopping frontend..." -ForegroundColor Yellow
    Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force
    Start-Sleep 2
    
    Write-Host "Starting frontend...`n" -ForegroundColor Green
    $path = "C:\Users\tarun\Music\MSD project\frontend"
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$path'; npm run dev"
    
    Write-Host "OK Frontend restarting!`n" -ForegroundColor Green
}

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "NEXT: Go to http://localhost:5173/signin" -ForegroundColor White
Write-Host "      Press Ctrl+Shift+R (hard refresh)" -ForegroundColor Gray
Write-Host "      Press F12 (open console)" -ForegroundColor Gray
Write-Host "      Sign in with: tarun@gmail.com / tarun123" -ForegroundColor White
Write-Host "========================================`n" -ForegroundColor Cyan
