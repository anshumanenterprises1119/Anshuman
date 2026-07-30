/**
 * Run this script ONCE after getting your Web3Forms Access Key.
 * 
 * Steps:
 * 1. Go to https://web3forms.com
 * 2. Enter: anshumanenterprises1119@gmail.com
 * 3. Click "Create Access Key"
 * 4. Copy the key and paste it below
 * 5. Run: node replace_web3forms_key.js
 */

const fs = require('fs');
const path = require('path');

// ✏️ PASTE YOUR KEY HERE:
const NEW_KEY = 'PASTE_YOUR_KEY_HERE';

const ROOT = 'd:\\Downloads\\ANSHU';
const dirs = [ROOT, path.join(ROOT, 'decoratenow'), path.join(ROOT, 'contractor')];

if (NEW_KEY === 'PASTE_YOUR_KEY_HERE') {
  console.error('❌ Please edit this file and paste your Web3Forms access key first!');
  process.exit(1);
}

let count = 0;
dirs.forEach(dir => {
  fs.readdirSync(dir).filter(f => f.endsWith('.html')).forEach(file => {
    const fp = path.join(dir, file);
    let html = fs.readFileSync(fp, 'utf8');
    if (html.includes('YOUR_WEB3FORMS_ACCESS_KEY')) {
      html = html.replace(/YOUR_WEB3FORMS_ACCESS_KEY/g, NEW_KEY);
      fs.writeFileSync(fp, html, 'utf8');
      count++;
      console.log(`  ✓ ${path.relative(ROOT, fp)}`);
    }
  });
});

console.log(`\n✅ Done! Replaced key in ${count} files.`);
console.log('Now run: git add -A && git commit -m "chore: add web3forms key" && git push');
