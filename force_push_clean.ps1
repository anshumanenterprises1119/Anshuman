# ================================================
#   CLEAN PUSH SCRIPT - Token history hataao
#   aur fresh GitHub upload karo
# ================================================

$repoPath = "c:\Users\aditya tiwari\Downloads"
$remote = "https://github.com/anshumanenterprises1119/Anshuman.git"

Write-Host "============================================" -ForegroundColor Cyan
Write-Host "  CLEAN GITHUB PUSH SHURU HO RAHA HAI..." -ForegroundColor Green
Write-Host "============================================" -ForegroundColor Cyan

# Step 1: Purani .git history hatao
Write-Host "`n[1/5] Purani git history hata raha hoon..." -ForegroundColor Yellow
Remove-Item -Path "$repoPath\.git" -Recurse -Force -ErrorAction SilentlyContinue
Write-Host "  Done!" -ForegroundColor Green

# Step 2: Fresh git init
Write-Host "`n[2/5] Fresh git repo bana raha hoon..." -ForegroundColor Yellow
git -C $repoPath init
git -C $repoPath config user.email "anshumanenterprises1119@gmail.com"
git -C $repoPath config user.name "Anshuman Enterprises"
Write-Host "  Done!" -ForegroundColor Green

# Step 3: Remote add karo
Write-Host "`n[3/5] GitHub remote connect kar raha hoon..." -ForegroundColor Yellow
git -C $repoPath remote add origin $remote
Write-Host "  Done!" -ForegroundColor Green

# Step 4: Saari files add karo
Write-Host "`n[4/5] Saari website files add kar raha hoon..." -ForegroundColor Yellow
git -C $repoPath add -A
git -C $repoPath commit -m "Full website: Anshuman Enterprises - fresh deployment"
git -C $repoPath branch -M main
Write-Host "  Done!" -ForegroundColor Green

# Step 5: Force push
Write-Host "`n[5/5] GitHub pe push kar raha hoon..." -ForegroundColor Yellow
git -C $repoPath push origin main --force

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n============================================" -ForegroundColor Green
    Write-Host "  SUCCESS! Saari files GitHub pe upload ho gayi!" -ForegroundColor Green
    Write-Host "  https://github.com/anshumanenterprises1119/Anshuman" -ForegroundColor Cyan
    Write-Host "============================================" -ForegroundColor Green
} else {
    Write-Host "`n[!] Push mein error aaya. Upar ka output dekho." -ForegroundColor Red
    Write-Host "    Mujhe screenshot bhejo, main fix kar doonga." -ForegroundColor Yellow
}
