@echo off
echo ====================================================
echo   ANSHUMAN ENTERPRISES - GIT PUSH TO MAIN BRANCH
echo ====================================================
echo.
echo Pushing local branch parallel-v2-safe-build to main...
git push origin parallel-v2-safe-build:main
echo.
echo ====================================================
echo   If the push was blocked by Github Push Protection,
echo   look for a URL in the error message above to bypass
echo   the secret scan block, or disable Secret Scanning
echo   Push Protection in your repository Settings on GitHub.
echo ====================================================
pause
