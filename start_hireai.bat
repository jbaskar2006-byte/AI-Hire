@echo off
title HireAI One-Click Launcher Bot
color 0A

echo ========================================================
echo        HireAI One-Click Launcher Bot
echo        Intelligent AI Recruitment System
echo ========================================================
echo.

echo [1/4] Seeding Database (Admin & Demo Data)...
cd /d "%~dp0backend"
call "%~dp0backend\venv\Scripts\python.exe" "%~dp0backend\seed_admin.py"
call "%~dp0backend\venv\Scripts\python.exe" "%~dp0backend\seed_demo_data.py"
echo.

echo [2/4] Starting FastAPI Backend Server (Port 8000)...
start "HireAI Backend (FastAPI)" cmd /k "cd /d %~dp0backend && .\venv\Scripts\activate && uvicorn app.main:app --reload --host 0.0.0.0 --port 8000"

echo [3/4] Starting React Frontend Server (Port 5173)...
start "HireAI Frontend (React + Vite)" cmd /k "cd /d %~dp0frontend && npm run dev"

echo [4/4] Waiting for servers to start...
timeout /t 4 /nobreak > nul

echo.
echo Launching HireAI Application in your Web Browser...
start http://localhost:5173

echo.
echo ========================================================
echo  HireAI is now running! 
echo  - Web Application: http://localhost:5173
echo  - API Documentation: http://localhost:8000/docs
echo ========================================================
echo.
pause
