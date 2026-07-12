const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '../../');
const platformDir = path.join(__dirname, '../');
const backupDir = path.join(rootDir, 'backup');
const migrationsSource = path.join(rootDir, 'supabase/migrations');
const migrationsBackup = path.join(backupDir, 'migrations');
const configBackup = path.join(backupDir, 'config');

function createDirIfMissing(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function copyFile(src, dest) {
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, dest);
    console.log(`  📁 Copied: ${path.basename(src)} -> ${path.basename(dest)}`);
  }
}

function runBackup() {
  console.log('📦 Initializing Pre-Production Backup Suite...');
  
  // 1. Create directory structure
  createDirIfMissing(backupDir);
  createDirIfMissing(migrationsBackup);
  createDirIfMissing(configBackup);

  // 2. Backup Database Migrations
  if (fs.existsSync(migrationsSource)) {
    console.log('  🗄️ Backing up database migrations...');
    fs.readdirSync(migrationsSource).forEach(file => {
      if (file.endsWith('.sql')) {
        copyFile(path.join(migrationsSource, file), path.join(migrationsBackup, file));
      }
    });
  } else {
    console.warn('  ⚠️ Migrations folder not found under supabase/migrations');
  }

  // 3. Backup Configuration files
  console.log('  ⚙️ Backing up system configuration files...');
  copyFile(path.join(platformDir, 'package.json'), path.join(configBackup, 'package.json'));
  copyFile(path.join(platformDir, 'tsconfig.json'), path.join(configBackup, 'tsconfig.json'));
  copyFile(path.join(platformDir, '.env.development'), path.join(configBackup, '.env.development'));
  copyFile(path.join(platformDir, '.env.staging'), path.join(configBackup, '.env.staging'));
  copyFile(path.join(platformDir, '.env.production'), path.join(configBackup, '.env.production'));

  // 4. Generate Rollback Guide
  console.log('  📝 Compiling Recovery & Rollback Guide...');
  writeRollbackGuide();
  console.log('✅ Backup operation finished successfully!');
}

function writeRollbackGuide() {
  const guidePath = path.join(backupDir, 'ROLLBACK_GUIDE.md');
  const markdown = `
# Pre-Production Backup & Rollback Operations Guide
This document details standard procedures to restore configurations, schemas, and assets in the event of deployment degradation.

---

## 💾 1. Database Restoration
Database changes are versioned using Supabase Migrations located in \`backup/migrations/\`.

### A. Reset Local Database Schema
If local development schema is corrupted:
\`\`\`bash
npx supabase db reset
\`\`\`
This pulls migration SQLs in sequence and recreates the tables from scratch.

### B. Restore Staging/Production Schema
If a migration fails on staging:
1. Log in to the Supabase SQL Editor.
2. If RLS recursion or schema error occurred, execute rollback commands (e.g. dropping policies or functions) or run the previous migration file.
3. Re-run migration SQL scripts in alphabetical order:
   - \`20260623000000_init_schema.sql\`
   - \`20260623000001_create_support_table.sql\`
   - \`20260623000002_fix_rls_recursion.sql\`
   - \`20260623000003_customer_features.sql\`
   - \`20260623000004_phase3_tables.sql\`
   - \`20260623000005_phase4_tables.sql\`
   - \`20260623000006_seed_production_data.sql\`
   - \`20260623000007_phase6_tables.sql\`

### C. Re-Populate Staging Data
Run the programmatic seed engine to clean and reset test records:
\`\`\`bash
cd ecommerce-platform
node seed/generator.js
\`\`\`

---

## 🪣 2. Storage & Cloud Assets Rollback
Static assets are stored under \`ecommerce-platform/public/\` and Cloudflare R2 bucket.

### A. Local public assets recovery
If public assets are deleted, pull them from backup or restore from the repository main branch:
\`\`\`bash
git checkout HEAD -- ecommerce-platform/public/
\`\`\`

### B. Cloudflare R2 bucket recovery
Sync current files using wrangler:
\`\`\`bash
wrangler r2 object put my-bucket/vault --file ./public/logo.webp
\`\`\`

---

## ⚙️ 3. Configuration & Dependency Restore
Backed up environment configs are located in \`backup/config/\`.

### A. Revert Configurations
Copy configuration files to \`ecommerce-platform/\`:
\`\`\`bash
copy backup\\config\\.env.staging ecommerce-platform\\.env.local
copy backup\\config\\package.json ecommerce-platform\\package.json
cd ecommerce-platform
npm install
\`\`\`

### B. Deployment Code rollback
To revert code build to previous stable release candidate:
\`\`\`bash
git log -n 5 --oneline
# Reset to the last stable release commit hash
git reset --hard <STABLE_COMMIT_HASH>
git push origin <BRANCH_NAME> --force
\`\`\`
`;

  fs.writeFileSync(guidePath, markdown, 'utf8');
}

runBackup();
