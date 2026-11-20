@echo off
title PrepAI - AI Interview Platform
cls
echo ====================================================================
echo                 PrepAI - AI Mock Interview Platform
echo ====================================================================
echo.
echo  Starting application and opening browser automatically...
echo.

:: Automatically open browser after 3 seconds (gives server time to spin up)
start "" cmd /c "timeout /t 3 /nobreak >nul && start http://localhost:3000"

:: Start Next.js development server
call npm.cmd run dev

pause
