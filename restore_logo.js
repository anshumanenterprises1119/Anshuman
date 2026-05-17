const fs = require('fs');
const path = require('path');

const files = ['index.html', 'about.html', 'products.html', 'services.html', 'contact.html'];
const dir = __dirname;

const oldIcon = `<div style="font-size:28px;display:flex;align-items:center;justify-content:center;background:#fff;border-radius:8px;width:48px;height:48px;color:var(--maroon-dark);box-shadow:0 2px 8px rgba(0,0,0,0.1);flex-shrink:0;">⚡</div>`;
const newLogo = `<img src="logo.jpg" alt="Anshuman Enterprises" style="height:48px;width:auto;max-width:180px;object-fit:contain;border-radius:8px;background:transparent;">`;

files.forEach(f => {
  let filepath = path.join(dir, f);
  if (fs.existsSync(filepath)) {
    let content = fs.readFileSync(filepath, 'utf8');

    // Replace all occurrences of the lightning bolt with the new logo
    // Using split and join is a safe way to replace all occurrences of a multi-line or exact string
    content = content.split(oldIcon).join(newLogo);

    fs.writeFileSync(filepath, content);
    console.log('Added logo.jpg back to ' + f);
  }
});
