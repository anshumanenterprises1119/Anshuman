const fs = require('fs');
const path = require('path');

const rootDir = 'd:\\Downloads\\ANSHU';

function getAllHtmlFiles(dirPath, arrayOfFiles) {
  const files = fs.readdirSync(dirPath);
  arrayOfFiles = arrayOfFiles || [];

  files.forEach(function(file) {
    const fullPath = path.join(dirPath, file);
    if (fs.statSync(fullPath).isDirectory()) {
      if (!file.startsWith('.') && file !== 'node_modules' && file !== 'home page anshuman enterprises') {
        arrayOfFiles = getAllHtmlFiles(fullPath, arrayOfFiles);
      }
    } else {
      if (file.endsWith('.html')) {
        arrayOfFiles.push(fullPath);
      }
    }
  });

  return arrayOfFiles;
}

const files = getAllHtmlFiles(rootDir);
let issuesFound = 0;
let validHeaders = 0;

files.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');

  // Check 1: Duplicate headers
  const headerCount = (content.match(/<header id="ae-hub-header"/g) || []).length;
  if (headerCount > 1) {
    console.error(`[ERROR] Duplicate header in ${file}`);
    issuesFound++;
  } else if (headerCount === 1) {
    validHeaders++;
  }

  // Check 2: Broken Google CDN links
  if (content.includes('lh3.googleusercontent.com')) {
    console.error(`[WARNING] Broken Google CDN link found in ${file}`);
    issuesFound++;
  }

  // Check 3: CSS and JS presence
  if (!content.includes('ae-responsive.css')) {
    console.error(`[MISSING] ae-responsive.css missing in ${file}`);
    issuesFound++;
  }
  if (!content.includes('ae-mobile-nav.js')) {
    console.error(`[MISSING] ae-mobile-nav.js missing in ${file}`);
    issuesFound++;
  }
});

console.log(`\n--- AUDIT SUMMARY ---`);
console.log(`Total HTML Files Audited: ${files.length}`);
console.log(`Valid Responsive Headers: ${validHeaders}`);
console.log(`Total Issues Detected: ${issuesFound}`);

if (issuesFound === 0) {
  console.log(`SUCCESS: All pages are clean, responsive, and free of duplicate headers or broken links!`);
}
