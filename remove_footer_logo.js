const fs = require('fs');
const path = require('path');

const dir = 'c:\\Users\\aditya tiwari\\Downloads\\ANSHU';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

let updatedCount = 0;

for (const file of files) {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // We are looking for something like:
  // <img loading="lazy" src="logo.webp" alt="Anshuman Enterprises">
  // inside the <div class="footer-brand">
  
  // Use regex to remove any <img> tag that immediately follows <div class="footer-brand">
  const originalContent = content;
  content = content.replace(/(<div class="footer-brand"[^>]*>\s*)<img[^>]+src=["']?logo\.webp["']?[^>]*>/i, '$1');
  // Also try catching if it lacks loading="lazy" or has different formatting
  content = content.replace(/(<div class="footer-brand"[^>]*>\s*)<img[^>]+alt=["']?Anshuman Enterprises["']?[^>]*>/i, '$1');

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Removed footer logo from: ${file}`);
    updatedCount++;
  }
}

console.log(`\nSuccessfully removed the extra footer logo from ${updatedCount} pages!`);
