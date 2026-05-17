# Step 1: Fix logo.jpg -> logo.jpeg in about.html
Write-Host "Fixing logo in about.html..." -ForegroundColor Yellow
$file = "c:\Users\aditya tiwari\Downloads\Anshuman Enterprises website\about.html"
$content = Get-Content $file -Raw -Encoding UTF8
$fixed = $content -replace '<img src="logo\.jpg" alt="Anshuman Enterprises">', '<img src="logo.jpeg" alt="Anshuman Enterprises">'
[System.IO.File]::WriteAllText($file, $fixed, [System.Text.Encoding]::UTF8)
Write-Host "about.html logo fixed!" -ForegroundColor Green

# Step 2: Git operations
$repoPath = "c:\Users\aditya tiwari\Downloads"

Write-Host "`nGit Status:" -ForegroundColor Cyan
git -C $repoPath status

Write-Host "`nAdding all files..." -ForegroundColor Yellow
git -C $repoPath add -A

Write-Host "`nCommitting changes..." -ForegroundColor Yellow
git -C $repoPath commit -m "Update: Fix logo references (jpg->jpeg), add WhatsApp & Google Review widgets on all pages"

Write-Host "`nPushing to GitHub..." -ForegroundColor Yellow
git -C $repoPath push origin main

Write-Host "`n✅ DONE! Saari changes GitHub pe push ho gayi!" -ForegroundColor Green
Write-Host "Website live hone mein 1-2 minute lag sakte hain." -ForegroundColor Cyan
