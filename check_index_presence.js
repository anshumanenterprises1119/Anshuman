const { execSync } = require('child_process');
try {
  const files = execSync('git ls-tree -r --name-only bb2a2f8', { encoding: 'utf-8' });
  console.log("Files in commit bb2a2f8:");
  const hasIndex = files.split('\n').filter(f => f.includes('index.html'));
  console.log(hasIndex.length > 0 ? "index.html is PRESENT in the commit!" : "index.html is MISSING from the commit!");
} catch (e) {
  console.error("Failed:", e.message);
}

try {
  const fs = require('fs');
  fs.unlinkSync(__filename);
} catch (e) {}
