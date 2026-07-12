@echo off
echo ====================================================
echo   ANSHUMAN ENTERPRISES - AUTOMATIC GIT PUSH SCRIPT
echo ====================================================
echo.
echo Staging changes...
git add -A
echo.
echo Committing changes...
git commit -m "feat: add Category 07 Hardware and 29 new products with SEO and search integration"
echo.
echo Pushing to branch parallel-v2-safe-build...
git push origin parallel-v2-safe-build
echo.
echo Cleaning up temporary scripts...
if exist run_git_push.js del run_git_push.js
echo ====================================================
echo   Push Complete! Press any key to exit.
echo ====================================================
pause
