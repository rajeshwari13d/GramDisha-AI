@echo off
title GramDisha AI - Firebase Deployment
echo =========================================
echo   GramDisha AI - Firebase Deploy Helper
echo =========================================
echo.
echo [1/3] Checking Firebase login...
call firebase login
echo.
echo [2/3] Building frontend...
cd /d "%~dp0frontend"
call npm run build
cd /d "%~dp0"
echo.
echo [3/3] Deploying to Firebase Hosting (gramdishaai)...
call firebase deploy --only hosting --project gramdishaai
echo.
echo Done! Open https://gramdishaai.web.app
pause
