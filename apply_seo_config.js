const fs = require('fs');
const path = require('path');

const dir = 'd:\\Downloads\\ANSHU';
const configPath = path.join(dir, 'seo-config.json');

console.log("====================================================");
console.log("  ANSHUMAN ENTERPRISES - SEO CONFIG APPLIER");
console.log("====================================================");
console.log("");

if (!fs.existsSync(configPath)) {
  console.error("[ERROR] seo-config.json not found!");
  process.exit(1);
}

const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
const gaId = config.googleAnalyticsId;
const scId = config.googleSearchConsoleId;

if (gaId === "G-XXXXXXXXXX" || scId === "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX") {
  console.log("[INFO] Currently using default placeholder values in seo-config.json.");
  console.log("If you have your real keys, update seo-config.json and run this script again.");
  console.log("");
}

const files = fs.readdirSync(dir);
let updatedCount = 0;

files.forEach(file => {
  if (file.endsWith('.html')) {
    const filepath = path.join(dir, file);
    let content = fs.readFileSync(filepath, 'utf8');
    let original = content;

    // Replace Google Analytics placeholder
    if (content.includes('G-XXXXXXXXXX')) {
      content = content.split('G-XXXXXXXXXX').join(gaId);
    }
    // Replace Google Search Console placeholder
    if (content.includes('XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX')) {
      content = content.split('XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX').join(scId);
    }

    if (content !== original) {
      fs.writeFileSync(filepath, content, 'utf8');
      console.log(`[OK] Applied SEO config to ${file}`);
      updatedCount++;
    }
  }
});

console.log("");
console.log("====================================================");
console.log(`  Process complete. Updated ${updatedCount} HTML files.`);
console.log("====================================================");
