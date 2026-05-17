Write-Host "Updating Navigation Menus..." -ForegroundColor Cyan
node update_all_menus.js

Write-Host "Applying Internal Links..." -ForegroundColor Cyan
node add_internal_links.js

Write-Host "Pushing to GitHub..." -ForegroundColor Cyan
.\fix_404_deploy.ps1
