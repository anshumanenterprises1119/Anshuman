const fs = require('fs');
const path = require('path');

const cleanHtmlPath = path.join(__dirname, 'index_clean.html');
const indexHtmlPath = path.join(__dirname, 'index.html');

try {
  let content = fs.readFileSync(cleanHtmlPath, 'utf8');

  // Replace product placeholders with actual images
  content = content.replace(
    /src="placeholder\.webp"(\s+)alt="Wires & Cables"/g,
    'src="20859.webp"$1alt="Wires & Cables"'
  );
  
  content = content.replace(
    /src="placeholder\.webp"(\s+)alt="Switches & Accessories"/g,
    'src="20860.webp"$1alt="Switches & Accessories"'
  );
  
  content = content.replace(
    /src="placeholder\.webp"(\s+)alt="MCB DB Fittings"/g,
    'src="20862.webp"$1alt="MCB DB Fittings"'
  );
  
  content = content.replace(
    /src="placeholder\.webp"(\s+)alt="Conduit Pipes"/g,
    'src="20864.webp"$1alt="Conduit Pipes"'
  );
  
  content = content.replace(
    /src="placeholder\.webp"(\s+)alt="Electrical Hardware"/g,
    'src="20865.webp"$1alt="Electrical Hardware"'
  );

  // Replace founder photo placeholder
  content = content.replace(
    /src="placeholder\.webp"(\s+)alt="Aditya Tiwari/g,
    'src="logo.webp"$1alt="Aditya Tiwari'
  );

  // Also replace any remaining placeholder.webp with logo.webp just in case
  content = content.replace(/placeholder\.webp/g, 'logo.webp');

  fs.writeFileSync(indexHtmlPath, content, 'utf8');
  console.log('✅ Successfully restored index.html with correct images!');
} catch (error) {
  console.error('❌ Error restoring index.html:', error.message);
}
