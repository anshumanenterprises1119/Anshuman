const fs = require('fs');
const path = require('path');

const aboutPath = path.join(__dirname, 'about.html');
const indexPath = path.join(__dirname, 'index.html');
const founderImgPath = path.join(__dirname, 'founder.jpg');

try {
  const content = fs.readFileSync(aboutPath, 'utf8');

  // Find the huge base64 image in about.html
  const imgRegex = /src="data:image\/(jpeg|png|webp);base64,([^"]+)"/;
  const match = content.match(imgRegex);
  
  if (match) {
    const ext = match[1];
    const base64Data = match[2];
    
    // Save the base64 string to a proper image file
    fs.writeFileSync(founderImgPath, Buffer.from(base64Data, 'base64'));
    console.log(`✅ Saved founder image to founder.jpg`);
    
    // Update index.html
    let indexContent = fs.readFileSync(indexPath, 'utf8');
    
    // Replace the wrong logo.webp with the correct founder.jpg for the founder photo
    indexContent = indexContent.replace(
      /src="logo\.webp"(\s+)alt="Aditya Tiwari/g, 
      `src="founder.jpg"$1alt="Aditya Tiwari`
    );

    fs.writeFileSync(indexPath, indexContent, 'utf8');
    console.log('✅ Successfully updated index.html to use founder.jpg for the founder section!');
  } else {
    console.error('❌ Could not find base64 image in about.html');
  }
} catch (error) {
  console.error('❌ Error:', error.message);
}
