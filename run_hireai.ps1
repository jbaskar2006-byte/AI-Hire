Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "       HireAI One-Click Launcher Bot                    " -ForegroundColor Green
Write-Host "       Intelligent AI Recruitment System                " -ForegroundColor Cyan
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host ""

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path

Write-Host "[1/4] Seeding Database (Admin & Demo Data)..." -ForegroundColor Yellow
& "$scriptDir\backend\venv\Scripts\python.exe" "$scriptDir\backend\seed_admin.py"
& "$scriptDir\backend\venv\Scripts\python.exe" "$scriptDir\backend\seed_demo_data.py"

Write-Host "[2/4] Starting FastAPI Backend Server (Port 8000)..." -ForegroundColor Yellow
Start-Process cmd.exe -ArgumentList "/k cd /d `"$scriptDir\backend`" && .\venv\Scripts\activate && uvicorn app.main:app --reload --host 127.0.0.1 --port 8000"

Write-Host "[3/4] Starting React Frontend Server (Port 5173)..." -ForegroundColor Yellow
Start-Process cmd.exe -ArgumentList "/k cd /d `"$scriptDir\frontend`" && npm run dev"

Write-Host "[4/4] Waiting for servers to start..." -ForegroundColor Yellow
Start-Sleep -Seconds 4

Write-Host "Opening HireAI Application in default Browser..." -ForegroundColor Green
Start-Process "http://localhost:5173"

Write-Host ""
Write-Host "========================================================" -ForegroundColor Green
Write-Host "  HireAI is now running!                                " -ForegroundColor Green
Write-Host "  - Web App: http://localhost:5173                     " -ForegroundColor Cyan
Write-Host "  - API Docs: http://localhost:8000/docs                " -ForegroundColor Cyan
Write-Host "========================================================" -ForegroundColor Green
