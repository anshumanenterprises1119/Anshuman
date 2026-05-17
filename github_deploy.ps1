# ============================================
# GitHub Deploy Script - Anshuman Enterprises
# ============================================

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   GitHub Deploy Script" -ForegroundColor Yellow
Write-Host "   Anshuman Enterprises Website" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# MinGit path set karo
$env:PATH = "C:\Users\aditya tiwari\Downloads\mingit\bin;" + $env:PATH

# Downloads folder mein jao
Set-Location "C:\Users\aditya tiwari\Downloads"

# GitHub URL (hardcoded)
$githubUrl = "https://github.com/anshumanenterprises1119/Anshuman.git"

Write-Host "GitHub URL: $githubUrl" -ForegroundColor Cyan
Write-Host ""

# ----------------------------------------
Write-Host "[1/7] Git initialize kar raha hai..." -ForegroundColor Yellow
git init
Write-Host "OK - Git initialized!" -ForegroundColor Green
Write-Host ""

# ----------------------------------------
Write-Host "[2/7] Git user config set kar raha hai..." -ForegroundColor Yellow
git config user.email "anshumanenterprises1119@gmail.com"
git config user.name "Anshuman Enterprises"
Write-Host "OK - Config done!" -ForegroundColor Green
Write-Host ""

# ----------------------------------------
Write-Host "[3/7] .gitignore bana raha hai..." -ForegroundColor Yellow
$gitignore = @"
mingit/
mingit.zip
Antigravity.exe
Anshuman enterprises.zip
*.exe
*.zip
.gemini/
node_modules/
"@
$gitignore | Out-File -FilePath ".gitignore" -Encoding UTF8 -Force
Write-Host "OK - .gitignore created!" -ForegroundColor Green
Write-Host ""

# ----------------------------------------
Write-Host "[4/7] Saari website files add kar raha hai..." -ForegroundColor Yellow
git add .
Write-Host "OK - Files staged!" -ForegroundColor Green
Write-Host ""

# ----------------------------------------
Write-Host "[5/7] Commit kar raha hai..." -ForegroundColor Yellow
$commitMsg = "Update: about, gallery, products, services, update.js - WhatsApp & Review widgets - $(Get-Date -Format 'dd-MM-yyyy HH:mm')"
git commit -m $commitMsg
Write-Host "OK - Committed!" -ForegroundColor Green
Write-Host ""

# ----------------------------------------
Write-Host "[6/7] Branch main set aur GitHub connect kar raha hai..." -ForegroundColor Yellow
git branch -M main
git remote remove origin 2>$null
git remote add origin $githubUrl
Write-Host "OK - GitHub remote set!" -ForegroundColor Green
Write-Host ""

# ----------------------------------------
Write-Host "[7/7] GitHub pe PUSH kar raha hai..." -ForegroundColor Yellow
Write-Host "(Browser open hoga - GitHub login karo agar pehli baar hai)" -ForegroundColor Gray
Write-Host ""
git push -u origin main --force

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host " SUCCESSFULLY DEPLOYED TO GITHUB!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host " Repo URL:" -ForegroundColor White
Write-Host " https://github.com/anshumanenterprises1119/Anshuman" -ForegroundColor Cyan
Write-Host ""
Write-Host " NEXT STEP - GitHub Pages ON karo:" -ForegroundColor Yellow
Write-Host " 1. Upar wala repo link kholo" -ForegroundColor White
Write-Host " 2. Settings -> Pages" -ForegroundColor White
Write-Host " 3. Branch: main | Folder: / (root)" -ForegroundColor White
Write-Host " 4. Save -> 2-3 min mein LIVE!" -ForegroundColor White
Write-Host ""
pause
