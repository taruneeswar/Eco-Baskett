# Eco Basket - Server Startup Script
# Run this to start both backend and frontend servers

Write-Host "`n========================================" -ForegroundColor Green
Write-Host "  ECO BASKET - Starting Servers" -ForegroundColor Green
Write-Host "========================================`n" -ForegroundColor Green

# Stop any existing node processes
Write-Host "Stopping existing servers..." -ForegroundColor Yellow
Get-Process -Name node -ErrorAction SilentlyContinue | Stop-Process -Force
Start-Sleep -Seconds 2
Write-Host "✅ Cleaned up old processes`n" -ForegroundColor Green

# Get the script directory
$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path

# Start Backend
Write-Host "Starting Backend Server..." -ForegroundColor Cyan
$backendPath = Join-Path $scriptPath "backend"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$backendPath'; `$host.UI.RawUI.WindowTitle='🔧 BACKEND SERVER - Port 5000'; `$host.UI.RawUI.BackgroundColor='DarkBlue'; Clear-Host; Write-Host '`n========================================' -ForegroundColor Green; Write-Host '  BACKEND SERVER (Port 5000)' -ForegroundColor Green; Write-Host '========================================`n' -ForegroundColor Green; npm run dev" -WindowStyle Normal
Start-Sleep -Seconds 5

# Start Frontend
Write-Host "Starting Frontend Server..." -ForegroundColor Cyan
$frontendPath = Join-Path $scriptPath "frontend"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$frontendPath'; `$host.UI.RawUI.WindowTitle='🌐 FRONTEND SERVER - Port 5173'; `$host.UI.RawUI.BackgroundColor='DarkCyan'; Clear-Host; Write-Host '`n========================================' -ForegroundColor Cyan; Write-Host '  FRONTEND SERVER (Port 5173)' -ForegroundColor Cyan; Write-Host '========================================`n' -ForegroundColor Cyan; npm run dev" -WindowStyle Normal
Start-Sleep -Seconds 5

# Verify servers started
Write-Host "`nVerifying servers..." -ForegroundColor Yellow
Start-Sleep -Seconds 2

try {
    $backend = Invoke-WebRequest -Uri "http://localhost:5000" -TimeoutSec 3
    Write-Host "✅ Backend is running!" -ForegroundColor Green
} catch {
    Write-Host "⚠️  Backend may still be starting..." -ForegroundColor Yellow
}

try {
    $frontend = Invoke-WebRequest -Uri "http://localhost:5173" -TimeoutSec 3
    Write-Host "✅ Frontend is running!" -ForegroundColor Green
} catch {
    Write-Host "⚠️  Frontend may still be starting..." -ForegroundColor Yellow
}

Write-Host "`n========================================" -ForegroundColor Green
Write-Host "  SERVERS STARTED!" -ForegroundColor Green
Write-Host "========================================`n" -ForegroundColor Green

Write-Host "📱 Open in browser:" -ForegroundColor Cyan
Write-Host "   http://localhost:5173`n" -ForegroundColor White

Write-Host "🔑 Login credentials:" -ForegroundColor Cyan
Write-Host "   Email: tarun@gmail.com" -ForegroundColor White
Write-Host "   Password: tarun123`n" -ForegroundColor White

Write-Host "💡 Keep both server windows open!" -ForegroundColor Yellow
Write-Host "   Press any key to close this window..." -ForegroundColor Gray

$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
