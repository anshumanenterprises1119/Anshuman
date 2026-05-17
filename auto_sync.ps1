# ============================================
#   ANSHUMAN ENTERPRISES - AUTO GITHUB SYNC
#   Koi bhi file change karo, automatic push!
# ============================================

$repoPath = "c:\Users\aditya tiwari\Downloads"
$checkIntervalSeconds = 30   # Har 30 second mein check karta hai

Write-Host "============================================" -ForegroundColor Cyan
Write-Host "  AUTO SYNC SHURU HO GAYA!" -ForegroundColor Green
Write-Host "  Har $checkIntervalSeconds second mein changes check hoga" -ForegroundColor Yellow
Write-Host "  Band karne ke liye: Ctrl+C dabao" -ForegroundColor Red
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

# Git config
git -C $repoPath config core.editor "echo" 2>$null
git -C $repoPath config user.email "aditya@anshumanenterprises.com" 2>$null
git -C $repoPath config user.name "Anshuman Enterprises" 2>$null

$lastCommitHash = git -C $repoPath rev-parse HEAD 2>$null

while ($true) {
    try {
        # Check karo ki koi changes hain
        $status = git -C $repoPath status --porcelain 2>$null
        
        if ($status) {
            $timestamp = Get-Date -Format "dd-MM-yyyy HH:mm:ss"
            Write-Host "[$timestamp] Changes mile! Push ho raha hai..." -ForegroundColor Yellow
            
            # Changed files dikhao
            $changedFiles = ($status -split "`n") | Where-Object { $_ -ne "" }
            foreach ($file in $changedFiles) {
                Write-Host "  → $($file.Trim())" -ForegroundColor DarkGray
            }
            
            # Add all changes
            git -C $repoPath add -A 2>$null
            
            # Commit with timestamp
            $commitMsg = "Auto-sync: $timestamp pe changes push hue"
            git -C $repoPath commit -m $commitMsg 2>$null
            
            # Push to GitHub
            $pushResult = git -C $repoPath push origin main 2>&1
            
            if ($LASTEXITCODE -eq 0) {
                Write-Host "  ✅ GitHub pe successfully push ho gaya!" -ForegroundColor Green
            } else {
                Write-Host "  ⚠️  Push mein problem:" -ForegroundColor Red
                Write-Host "  $pushResult" -ForegroundColor Red
                
                # Try to pull first then push
                Write-Host "  Pull karke dobara try kar raha hoon..." -ForegroundColor Yellow
                git -C $repoPath pull origin main --no-edit 2>$null
                git -C $repoPath push origin main 2>$null
                
                if ($LASTEXITCODE -eq 0) {
                    Write-Host "  ✅ Dobara try mein success!" -ForegroundColor Green
                }
            }
            Write-Host ""
        } else {
            $timestamp = Get-Date -Format "HH:mm:ss"
            Write-Host "[$timestamp] Koi change nahi mila. Wait kar raha hoon..." -ForegroundColor DarkGray
        }
        
    } catch {
        Write-Host "Error: $_" -ForegroundColor Red
    }
    
    # Wait before next check
    Start-Sleep -Seconds $checkIntervalSeconds
}
