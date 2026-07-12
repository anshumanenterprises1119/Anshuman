@echo off
echo Preparing clean orphan branch...
git checkout --orphan temp_branch

echo Running repository cleanup script...
node cleanup.js

echo Committing clean files and configuration...
git add -A
git commit -m "feat: Cleanup repository and update codebase configuration"

echo Preparing local branches...
git branch -D parallel-v2-safe-build 2>nul
git branch -m parallel-v2-safe-build

echo Pushing clean codebase to GitHub...
git push -f origin parallel-v2-safe-build

echo Cleaning up temporary scripts...
del cleanup.js
echo Done!
pause
