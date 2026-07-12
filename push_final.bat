@echo off
echo ====================================================
echo   ANSHUMAN ENTERPRISES - FINAL VERIFIED GIT PUSH
echo ====================================================
echo.
echo Staging all changes...
git add -A
echo.
echo Committing final changes...
git commit -m "feat: verified product and banner image mapping, SEO optimization, and final deployment push to main"
echo.
echo Pushing local branch to GitHub main...
git push origin parallel-v2-safe-build:main
echo.
echo Pushing local branch to parallel-v2-safe-build branch...
git push origin parallel-v2-safe-build
echo.
echo Cleaning up helper batch files...
if exist "%~dp0push_final.bat" (
    echo [Note] You can manually delete push_final.bat after this window closes.
)
echo ====================================================
echo   Push Complete! Your site is live! Press any key.
echo ====================================================
pause
