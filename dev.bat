@echo off
cd /d "%~dp0"
if not exist "node_modules" (
    echo Installing root dependencies...
    npm install
)
echo Starting HRIS AMM (Backend + Frontend)...
start "HRIS AMM" cmd /c "npm run dev & pause"
timeout /t 3 /nobreak >nul
start http://localhost:3000
