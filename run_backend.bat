@echo off
title VeritasChain - Flask AI Backend
echo ========================================================
echo Starting AI Fake News Detection Backend (Port 5000)...
echo ========================================================
cd /d "%~dp0backend"
python app.py
pause
