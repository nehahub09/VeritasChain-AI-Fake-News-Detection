@echo off
title VeritasChain - AI Fake News Detection & Blockchain
echo ===================================================================
echo   VeritasChain - AI Fake News Detection System Using Blockchain
echo ===================================================================
echo [1/2] Launching Python Flask Backend on http://127.0.0.1:5000 ...
start "VeritasChain Backend" cmd /c "cd /d "%~dp0backend" && python app.py"

echo [2/2] Launching React Vite Frontend on http://localhost:5173 ...
start "VeritasChain Frontend" cmd /c "cd /d "%~dp0frontend" && npm run dev"

echo.
echo ===================================================================
echo System servers started in separate terminal windows!
echo Open your browser to: http://localhost:5173
echo ===================================================================
pause
