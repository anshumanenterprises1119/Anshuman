@echo off
echo ====================================================
echo   ANSHUMAN ENTERPRISES - GIT PUSH NEW PRODUCTS
echo ====================================================
echo.
echo Staging all changes...
git add -A
echo.
echo Committing changes...
git commit -m "feat: add new hardware products (marble cutter blades, sds plus hammer drill bits, paras threaded rod, bosch wheels) with realistic generated images"
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
