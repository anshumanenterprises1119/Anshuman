const fs = require('fs');
const path = require('path');

const dir = 'd:\\Downloads\\ANSHU';

console.log("====================================================");
console.log("  ANSHUMAN ENTERPRISES - SITE LINK AUDIT TOOL");
console.log("====================================================");
console.log("");

const files = fs.readdirSync(dir);
const htmlFiles = files.filter(f => f.endsWith('.html'));

const allBrokenLinks = {};

htmlFiles.forEach(file => {
  const filepath = path.join(dir, file);
  const content = fs.readFileSync(filepath, 'utf8');
  
  // Regex to match href attributes
  const hrefRegex = /href="([^"]+)"/g;
  let match;
  
  while ((match = hrefRegex.exec(content)) !== null) {
    const link = match[1];
    
    // Ignore external links, mailto, tel, anchors on the same page
    if (link.startsWith('http://') || link.startsWith('https://') || link.startsWith('tel:') || link.startsWith('mailto:') || link.startsWith('#')) {
      continue;
    }
    
    // Strip anchors or query parameters from link for checking file existence
    const cleanLink = link.split('#')[0].split('?')[0];
    
    if (cleanLink === "") continue;
    
    const targetPath = path.join(dir, cleanLink);
    if (!fs.existsSync(targetPath)) {
      if (!allBrokenLinks[link]) {
        allBrokenLinks[link] = [];
      }
      allBrokenLinks[link].push(file);
    }
  }
});

const keys = Object.keys(allBrokenLinks);
if (keys.length === 0) {
  console.log("[OK] No broken internal HTML links found!");
} else {
  console.log(`[WARNING] Found ${keys.length} broken link targets:`);
  keys.forEach(link => {
    console.log(` - "${link}" is broken. Found in:`);
    console.log(`     [${allBrokenLinks[link].join(', ')}]`);
  });
}
