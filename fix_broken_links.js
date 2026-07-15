const fs = require('fs');
const path = require('path');

const dir = 'd:\\Downloads\\ANSHU';

console.log("====================================================");
console.log("  ANSHUMAN ENTERPRISES - SITE LINK REPAIR UTILITY");
console.log("====================================================");
console.log("");

const files = fs.readdirSync(dir);
const htmlFiles = files.filter(f => f.endsWith('.html'));

let modifiedCount = 0;

const replacements = [
  ['href="wire-buying-guide.html"', 'href="wires-cables.html"'],
  ['href="modular-switch-guide.html"', 'href="modular-switches.html"'],
  ['href="mcb-selection-guide.html"', 'href="distribution-boards.html"'],
  ['href="branded-vs-local-electrical.html"', 'href="faq.html"'],
  ['href="electrical-safety-basics.html"', 'href="faq.html"']
];

htmlFiles.forEach(file => {
  const filepath = path.join(dir, file);
  let content = fs.readFileSync(filepath, 'utf8');
  let original = content;
  
  replacements.forEach(([target, replacement]) => {
    if (content.includes(target)) {
      content = content.split(target).join(replacement);
    }
  });
  
  if (content !== original) {
    fs.writeFileSync(filepath, content, 'utf8');
    console.log(`[OK] Fixed broken footer links in: ${file}`);
    modifiedCount++;
  }
});

console.log("");
console.log("====================================================");
console.log(`  Link repair process complete. Updated ${modifiedCount} files.`);
console.log("====================================================");
