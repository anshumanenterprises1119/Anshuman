@echo off
echo ====================================================
echo   ANSHUMAN ENTERPRISES - GIT PUSH SEO UPDATES
echo ====================================================
echo.
echo Staging all changes...
git add -A
echo.
echo Committing changes...
git commit -m "feat: resolve products rendering by adding items to productsData, globally optimize title/description/headings for Electrical & Hardware supplier SEO keywords"
echo.
echo Pushing local branch to GitHub main...
git push origin parallel-v2-safe-build:main
echo.
echo Pushing local branch to parallel-v2-safe-build branch...
git push origin parallel-v2-safe-build
echo.
echo ====================================================
echo   Git Push Complete! You can delete this script.
echo ====================================================
pause
