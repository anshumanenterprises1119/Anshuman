# ============================================
# SEO Deploy Script (Auto Git Download + Deploy)
# ============================================

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   Anshuman Enterprises SEO Deploy" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$userProfile = [System.Environment]::GetFolderPath('UserProfile')
$gitDir = "$userProfile\portablegit"
$gitExe = "$gitDir\cmd\git.exe"
$downloadsDir = "$userProfile\Downloads"

# Step 0: Download proper MinGit if not already there
if (-Not (Test-Path "$gitExe")) {
    Write-Host "[0] Downloading MinGit (one-time setup)..." -ForegroundColor Yellow
    $zipUrl = "https://github.com/git-for-windows/git/releases/download/v2.47.1.windows.1/MinGit-2.47.1-64-bit.zip"
    $zipPath = "$downloadsDir\mingit_download.zip"
    
    try {
        [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
        Write-Host "   Downloading... (please wait, ~50MB)" -ForegroundColor White
        Invoke-WebRequest -Uri $zipUrl -OutFile "$zipPath" -UseBasicParsing
        Write-Host "   Download complete!" -ForegroundColor Green
    }
    catch {
        Write-Host "   Download FAILED!" -ForegroundColor Red
        Write-Host "   Error: $_" -ForegroundColor Red
        pause
        exit
    }
    
    Write-Host "   Extracting to $gitDir..." -ForegroundColor White
    if (Test-Path "$gitDir") { Remove-Item "$gitDir" -Recurse -Force }
    New-Item -ItemType Directory -Path "$gitDir" -Force | Out-Null
    Expand-Archive -Path "$zipPath" -DestinationPath "$gitDir" -Force
    Remove-Item "$zipPath" -Force
    
    if (Test-Path "$gitExe") {
        Write-Host "   MinGit installed successfully!" -ForegroundColor Green
    }
    else {
        Write-Host "   ERROR: git.exe not found after extraction!" -ForegroundColor Red
        pause
        exit
    }
}

Write-Host "Git Found: $gitExe" -ForegroundColor Green

# Add to PATH
$env:PATH = "$gitDir\cmd;$gitDir\mingw64\bin;$gitDir\mingw64\libexec\git-core;" + $env:PATH

# Go to Downloads
Set-Location "$downloadsDir"

# GitHub URL
$githubUrl = "https://github.com/anshumanenterprises1119/Anshuman.git"

# ----------------------------------------
Write-Host "[1/5] Setting Git Config..." -ForegroundColor Yellow
& "$gitExe" config user.email "anshumanenterprises1119@gmail.com"
& "$gitExe" config user.name "Anshuman Enterprises"
Write-Host "OK - Config set!" -ForegroundColor Green

# ----------------------------------------
Write-Host "[2/5] Staging all files..." -ForegroundColor Yellow
& "$gitExe" add .
Write-Host "OK - Files staged!" -ForegroundColor Green

# ----------------------------------------
Write-Host "[3/5] Committing changes..." -ForegroundColor Yellow
$commitMsg = "Website optimization: CTA standardization, sitemap update, structural cleanup - $(Get-Date -Format 'dd-MM-yyyy HH:mm')"
& "$gitExe" commit -m "$commitMsg"
Write-Host "OK - Committed!" -ForegroundColor Green

# ----------------------------------------
Write-Host "[4/5] Setting remote origin..." -ForegroundColor Yellow
& "$gitExe" branch -M main
& "$gitExe" remote remove origin 2>$null
& "$gitExe" remote add origin "$githubUrl"
Write-Host "OK - Remote set!" -ForegroundColor Green

# ----------------------------------------
Write-Host "[5/5] Pushing to GitHub..." -ForegroundColor Yellow
Write-Host "GitHub login popup aaye toh login karein..." -ForegroundColor White
& "$gitExe" push -u origin main --force

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host "   SUCCESSFULLY UPLOADED TO GITHUB!" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Cyan
}
else {
    Write-Host ""
    Write-Host "!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!" -ForegroundColor Red
    Write-Host "   PUSH FAILED! Check login/network." -ForegroundColor Red
    Write-Host "!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!" -ForegroundColor Red
}

Write-Host ""
Write-Host " Website: https://anshumanenterprises.online/" -ForegroundColor Yellow
Write-Host ""
pause
