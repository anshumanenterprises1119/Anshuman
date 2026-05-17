@echo off
echo ==========================================
echo   Syncing with GitHub and Pushing Updates
echo ==========================================
cd /d "%~dp0"

echo.
echo Step 1: Committing your latest local changes...
git add .
git commit -m "Applying manual SEO content updates and syncing"

echo.
echo Step 2: Pulling latest changes from GitHub...
git pull origin main --rebase

echo.
echo Step 3: Pushing all changes to GitHub...
git push origin main

echo.
echo Done! If you see any errors above, please copy them.
pause
