const fs = require('fs');
const path = require('path');

const files = ['index.html', 'about.html', 'products.html', 'services.html', 'contact.html'];
const dir = __dirname;

const replacementIcon = `<div style="font-size:28px;display:flex;align-items:center;justify-content:center;background:#fff;border-radius:8px;width:48px;height:48px;color:var(--maroon-dark);box-shadow:0 2px 8px rgba(0,0,0,0.1);flex-shrink:0;">⚡</div>`;

files.forEach(f => {
  let filepath = path.join(dir, f);
  if (fs.existsSync(filepath)) {
    let content = fs.readFileSync(filepath, 'utf8');

    // Replace various img tags for the logo
    content = content.replace(/<img[^>]*src="logo\.jpg"[^>]*>/g, replacementIcon);
    
    // Also replace the placeholder icon in products.html just in case we left it as a raw div
    content = content.replace(/<div class="nav-logo-icon">⚡<\/div>/g, replacementIcon);

    fs.writeFileSync(filepath, content);
    console.log('Removed logo.jpg from ' + f);
  }
});
