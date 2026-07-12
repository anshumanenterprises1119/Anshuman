const { execSync } = require('child_process');

function run(cmd) {
  console.log(`> ${cmd}`);
  try {
    const stdout = execSync(cmd, { encoding: 'utf8', stdio: 'pipe' });
    console.log(stdout);
    return true;
  } catch (err) {
    console.error(`ERROR running "${cmd}":`);
    console.error(err.stdout || '');
    console.error(err.stderr || '');
    return false;
  }
}

console.log("=== Git Status ===");
run("git status");

console.log("=== Git Add ===");
run("git add -A");

console.log("=== Git Commit ===");
run("git commit -m \"feat: add new products and categories to products.html\"");

console.log("=== Git Push ===");
run("git push origin parallel-v2-safe-build");
