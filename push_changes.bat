@echo off
echo ====================================================
echo   ANSHUMAN ENTERPRISES - AUTOMATIC GIT PUSH SCRIPT
echo ====================================================
echo.
echo Staging changes...
git add -A
echo.
echo Committing changes...
git commit -m "feat: optimize product and banner images for SEO, update page references, and cleanup catalog"
echo.
echo Pushing to branch parallel-v2-safe-build...
git push origin parallel-v2-safe-build
echo.
echo Cleaning up temporary utility scripts...
if exist "%~dp0process_images_and_catalog.py" del "%~dp0process_images_and_catalog.py"
if exist "%~dp0process_catalog.js" del "%~dp0process_catalog.js"
if exist "%~dp0optimize_images.bat" del "%~dp0optimize_images.bat"
if exist "%~dp0search_images.py" del "%~dp0search_images.py"
echo ====================================================
echo   Push Complete! Press any key to exit.
echo ====================================================
pause
