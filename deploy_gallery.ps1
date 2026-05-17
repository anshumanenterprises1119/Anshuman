# Automated Deployment Script for Anshuman Enterprises Gallery
Write-Host "Starting Gallery & Website Deployment..." -ForegroundColor Cyan

# 1. Organize Media Assets
$sourceDir = "c:\Users\aditya tiwari\Downloads\Anshuman enterprises"
$targetDir = "c:\Users\aditya tiwari\Downloads\images\gallery"

if (Test-Path $sourceDir) {
    Write-Host "Organizing media assets..." -ForegroundColor Yellow
    if (!(Test-Path $targetDir)) { New-Item -ItemType Directory -Path $targetDir -Force }
    Copy-Item "$sourceDir\*" $targetDir -Recurse -Force
    Write-Host "✅ Media organized in images/gallery/" -ForegroundColor Green
} else {
    Write-Host "⚠️ Source media folder not found at $sourceDir. Skipping asset move." -ForegroundColor Red
}

# 2. Git Operations
$repoPath = "c:\Users\aditya tiwari\Downloads"
Set-Location $repoPath

Write-Host "`nPreparing Git Commit..." -ForegroundColor Yellow
git add -A

$commitMsg = "Gallery Migration: Migrated to static JSON architecture and added new media assets"
git commit -m $commitMsg

Write-Host "`nPushing to GitHub..." -ForegroundColor Yellow
git push origin main

Write-Host "`n✅ SUCCESS! Everything is now uploaded to GitHub." -ForegroundColor Green
Write-Host "Your website will be updated in 1-2 minutes." -ForegroundColor Cyan
