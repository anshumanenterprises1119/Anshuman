@echo off
echo ====================================================
echo   ANSHUMAN ENTERPRISES - GIT PUSH LINK FIXES
echo ====================================================
echo.
echo Staging all changes...
git add -A
echo.
echo Committing changes...
git commit -m "fix: repair broken Knowledge Hub footer links, pointing them to valid subcategory pages and FAQs"
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
