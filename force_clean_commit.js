const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log("Starting secure rebuild of commit history...");

try {
  // 1. Hard reset to the clean commit 1d567cd
  console.log("Resetting repository history to clean commit 1d567cd...");
  execSync('git reset --hard 1d567cd', { stdio: 'inherit' });

  // 2. Checkout all static files from d067640
  console.log("Restoring static files from d067640...");
  execSync('git checkout d067640 -- .', { stdio: 'inherit' });

  // 3. Remove only the unwanted folders
  console.log("Cleaning unwanted directories...");
  const rootDir = __dirname;
  const directoriesToDelete = [
    'anshuman-platform-v2',
    'workspace-v2',
    'appsmith',
    'backup',
    '.venv',
    'futurewithai',
    '__pycache__'
  ];
  directoriesToDelete.forEach(dir => {
    const p = path.join(rootDir, dir);
    if (fs.existsSync(p)) {
      fs.rmSync(p, { recursive: true, force: true });
    }
  });

  const filesToDelete = [
    'requirements.txt',
    'website_check_report.txt',
    'anshuman_enterprises_seo_content_blueprint.docx',
    'aditya adhaar.pdf'
  ];
  filesToDelete.forEach(file => {
    const p = path.join(rootDir, file);
    if (fs.existsSync(p)) {
      fs.unlinkSync(p);
    }
  });

  // 4. Securely replace secrets with placeholders
  console.log("Securing configurations (replacing secrets with placeholders)...");

  // check_db.js
  const dbPath = path.join(rootDir, 'ecommerce-platform', 'check_db.js');
  if (fs.existsSync(dbPath)) {
    let content = fs.readFileSync(dbPath, 'utf8');
    content = content.replace(
      /const supabaseServiceKey = "sb_secret_[a-zA-Z0-9_]+";/g,
      'const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "YOUR_SUPABASE_SERVICE_ROLE_KEY";'
    );
    fs.writeFileSync(dbPath, content, 'utf8');
  }

  // .env.development
  const devEnvPath = path.join(rootDir, 'ecommerce-platform', '.env.development');
  if (fs.existsSync(devEnvPath)) {
    let content = fs.readFileSync(devEnvPath, 'utf8');
    content = content.replace(/SUPABASE_SERVICE_ROLE_KEY=sb_secret_[a-zA-Z0-9_]+/g, 'SUPABASE_SERVICE_ROLE_KEY=YOUR_SUPABASE_SERVICE_ROLE_KEY');
    content = content.replace(/FAST2SMS_API_KEY=[a-zA-Z0-9]+/g, 'FAST2SMS_API_KEY=YOUR_FAST2SMS_API_KEY');
    content = content.replace(/PHONEPE_SALT_KEY=[a-zA-Z0-9-]+/g, 'PHONEPE_SALT_KEY=YOUR_PHONEPE_SALT_KEY');
    fs.writeFileSync(devEnvPath, content, 'utf8');
  }

  // .env.production
  const prodEnvPath = path.join(rootDir, 'ecommerce-platform', '.env.production');
  if (fs.existsSync(prodEnvPath)) {
    let content = fs.readFileSync(prodEnvPath, 'utf8');
    content = content.replace(/SUPABASE_SERVICE_ROLE_KEY=sb_secret_[a-zA-Z0-9_]+/g, 'SUPABASE_SERVICE_ROLE_KEY=YOUR_SUPABASE_SERVICE_ROLE_KEY');
    content = content.replace(/FAST2SMS_API_KEY=[a-zA-Z0-9]+/g, 'FAST2SMS_API_KEY=YOUR_FAST2SMS_API_KEY');
    fs.writeFileSync(prodEnvPath, content, 'utf8');
  }

  // 5. Commit changes locally
  console.log("Committing clean static files securely...");
  execSync('git add -A', { stdio: 'inherit' });
  execSync('git commit -m "feat: Restore static website files and update configuration securely"', { stdio: 'inherit' });

  // 6. Push to main
  console.log("Pushing directly to GitHub main branch...");
  execSync('git push -f origin HEAD:main', { stdio: 'inherit' });

  console.log("\nSUCCESS! All static files are restored, secrets are cleaned, and main branch has been successfully updated on GitHub!");

} catch (err) {
  console.error("Execution failed:", err.message);
}

// Self destruct
try {
  fs.unlinkSync(__filename);
} catch (e) {}
