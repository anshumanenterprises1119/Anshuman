const fs = require('fs');
const path = require('path');

const srcDir = "d:\\Downloads\\ANSHU\\images\\products";
const destDir = "C:\\Users\\aditya tiwari\\.gemini\\antigravity-ide\\brain\\283195fb-30e4-40af-8c96-0f70ec6a9102\\browser\\images";

if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

if (fs.existsSync(srcDir)) {
  const files = fs.readdirSync(srcDir);
  console.log(`Copying ${files.length} images...`);
  let count = 0;
  files.forEach(file => {
    try {
      fs.copyFileSync(path.join(srcDir, file), path.join(destDir, file));
      count++;
    } catch (e) {
      console.error(`Failed to copy ${file}:`, e);
    }
  });
  console.log(`Successfully copied ${count} images to ${destDir}`);
} else {
  console.error(`Source directory does not exist: ${srcDir}`);
}
