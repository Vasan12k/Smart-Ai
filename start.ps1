# IPO Restaurant Management System - Startup Script
Write-Host "Starting IPO Restaurant System..." -ForegroundColor Green

# Start Backend
Write-Host "`nStarting Backend Server (port 4000)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList '-NoExit', '-Command', "cd '$PSScriptRoot\backend'; Write-Host 'Backend Server' -ForegroundColor Cyan; npm run dev"

# Wait a bit for backend to start
Start-Sleep -Seconds 3

# Start Frontend
Write-Host "Starting Frontend Server (port 3000)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList '-NoExit', '-Command', "cd '$PSScriptRoot\frontend'; Write-Host 'Frontend Server' -ForegroundColor Cyan; npm run dev"

# Wait for frontend to start
Start-Sleep -Seconds 5

Write-Host "`n✓ Both servers are starting!" -ForegroundColor Green
Write-Host "`nFrontend: http://localhost:3000" -ForegroundColor Cyan
Write-Host "Backend:  http://localhost:4000" -ForegroundColor Cyan
Write-Host "`nOpening browser..." -ForegroundColor Yellow

# Open browser
Start-Process "http://localhost:3000"

Write-Host "`nPress any key to stop all servers..." -ForegroundColor Red
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

# Stop servers
Get-Process | Where-Object { $_.MainWindowTitle -match "Backend Server|Frontend Server" } | Stop-Process -Force
Write-Host "`nServers stopped." -ForegroundColor Green
