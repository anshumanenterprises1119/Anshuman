@echo off
echo ====================================================
echo   ANSHUMAN ENTERPRISES - DETECT AND FIX IMAGE LABELS
echo ====================================================
echo.

:: 1. Run Node script to check and fix image file extensions
node --version >nul 2>&1
if %errorlevel% equ 0 (
    echo Running extension checker...
    node "%~dp0fix_extensions.js"
    if exist "%~dp0fix_extensions.js" del "%~dp0fix_extensions.js"
) else (
    echo [ERROR] Node.js is required but not found in PATH.
    pause
    exit /b 1
)

echo.
echo ====================================================
echo   COMMITTING AND PUSHING DEPLOYMENT TO GITHUB MAIN
echo ====================================================
echo.

echo Staging all changes...
git add -A

echo.
echo Committing changes...
git commit -m "fix: resolve image extension issues and include missing gallery banner files to git"

echo.
echo Pushing local branch to GitHub main...
git push origin parallel-v2-safe-build:main

echo.
echo Pushing local branch to parallel-v2-safe-build branch...
git push origin parallel-v2-safe-build

echo.
echo Cleaning up temporary scripts...
if exist "%~dp0fix_and_push.bat" (
    echo [Note] You can manually delete fix_and_push.bat after this window closes.
)

echo.
echo ====================================================
echo   Optimization and Push Complete! Your site is live!
echo ====================================================
pause
