Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   Fixing 404 Error - Deploying from ANSHU folder" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Cyan

$env:PATH = "C:\Users\aditya tiwari\Downloads\mingit\cmd;C:\Users\aditya tiwari\Downloads\mingit\bin;" + $env:PATH

# YAHAN GADBAD THI: Pehle Downloads se push ho raha tha, isliye GitHub par folder ban gaya tha.
# Ab hum ANSHU folder ke andar se push karenge taaki index.html direct bahar aaye.
Set-Location "C:\Users\aditya tiwari\Downloads\ANSHU"

$githubUrl = "https://github.com/anshumanenterprises1119/Anshuman.git"

Write-Host "[1/5] Purana git data clean kar rahe hain (sirf local)..." -ForegroundColor Yellow
if (Test-Path ".git") {
    Remove-Item ".git" -Recurse -Force
}

Write-Host "[2/5] Git naya start kar rahe hain..." -ForegroundColor Yellow
git init
git config user.email "anshumanenterprises1119@gmail.com"
git config user.name "Anshuman Enterprises"

Write-Host "[3/5] Files add aur commit kar rahe hain..." -ForegroundColor Yellow
git add .
git commit -m "Fix 404 Error: Move site files to root of repository"

Write-Host "[4/5] GitHub se connect kar rahe hain..." -ForegroundColor Yellow
git branch -M main
git remote add origin $githubUrl

Write-Host "[5/5] GitHub par force push kar rahe hain (thoda time lag sakta hai)..." -ForegroundColor Yellow
git push -u origin main --force

Write-Host "========================================" -ForegroundColor Cyan
Write-Host " DONE! GitHub par files sahi jagah pahunch gayi hain." -ForegroundColor Green
Write-Host " 2-3 minute wait karein, 404 error theek ho jayega." -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Cyan
pause
