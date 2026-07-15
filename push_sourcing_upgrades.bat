@echo off
echo ====================================================
echo   ANSHUMAN ENTERPRISES - GIT PUSH SOURCING UPGRADES
echo ====================================================
echo.
echo Staging all changes...
git add -A
echo.
echo Committing changes...
git commit -m "feat: restructure products catalog into a split layout, add sidebar filters, grid/table view toggle, and B2B WhatsApp RFQ quote cart"
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
