$repoPath = "c:\Users\aditya tiwari\Downloads"

# Set git editor to nothing (avoid vim opening)
git -C $repoPath config core.editor "echo"

Write-Host "Step 1: Pulling from GitHub..." -ForegroundColor Yellow
git -C $repoPath pull origin main --no-edit

Write-Host "Step 2: Adding all files..." -ForegroundColor Yellow
git -C $repoPath add -A

Write-Host "Step 3: Committing..." -ForegroundColor Yellow
git -C $repoPath commit -m "Fix logo references and add engagement widgets"

Write-Host "Step 4: Pushing to GitHub..." -ForegroundColor Yellow
git -C $repoPath push origin main

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  DONE! Website GitHub pe update ho gayi!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
