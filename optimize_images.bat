@echo off
echo ====================================================
echo Starting Image Optimization and Catalog Setup...
echo ====================================================

:: Try node command in PATH
node --version >nul 2>&1
if %errorlevel% equ 0 (
    echo Running with 'node' command...
    node "%~dp0process_catalog.js"
    goto end
)

echo.
echo [ERROR] Node.js was not found on your system.
echo Please install Node.js from https://nodejs.org/
echo.

:end
echo ====================================================
echo Execution completed. Press any key to exit.
echo ====================================================
pause
