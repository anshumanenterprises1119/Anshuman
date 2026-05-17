const fs = require('fs');
const path = require('path');

const directory = __dirname;

const excludeFiles = [
    'index.html', 'index_clean.html', 'about.html', 'contact.html', 
    'faq.html', 'products.html', 'services.html', 'projects.html', 
    'brands.html', 'blog.html'
];

const productFiles = [
    'biometrics-access-control.html', 'conduit-pipes.html', 'distribution-boards.html',
    'interior-lighting.html', 'led-lighting.html', 'modular-switches.html',
    'network-rack-setup.html', 'smart-door-locks.html', 'structured-cabling.html',
    'video-door-phones.html', 'wifi-access-points.html', 'wires-cables.html'
];

const serviceFiles = [
    'cctv-installation.html', 'commercial-electrical.html', 'electrical-contracting.html',
    'electrical-maintenance.html', 'society-electrical.html'
];

const relatedProductsHtml = `
  <!-- RELATED PRODUCTS FOR SEO -->
  <div style="background: var(--cream-dark); padding: 40px 5%; margin-top: 60px;">
    <div style="max-width: 1200px; margin: auto;">
      <h3 style="font-family: 'Cormorant Garamond', serif; font-size: 28px; color: var(--maroon-dark); margin-bottom: 20px; border-bottom: 2px solid var(--gold); padding-bottom: 10px; display: inline-block;">Related Products</h3>
      <div style="display: flex; gap: 15px; flex-wrap: wrap; margin-top: 15px;">
        <a href="wires-cables.html" style="background: #fff; border: 1px solid var(--border); padding: 10px 20px; border-radius: 50px; text-decoration: none; color: var(--maroon); font-weight: 600; font-size: 14px; box-shadow: 0 2px 10px rgba(0,0,0,0.05);">Wires & Cables</a>
        <a href="modular-switches.html" style="background: #fff; border: 1px solid var(--border); padding: 10px 20px; border-radius: 50px; text-decoration: none; color: var(--maroon); font-weight: 600; font-size: 14px; box-shadow: 0 2px 10px rgba(0,0,0,0.05);">Modular Switches</a>
        <a href="led-lighting.html" style="background: #fff; border: 1px solid var(--border); padding: 10px 20px; border-radius: 50px; text-decoration: none; color: var(--maroon); font-weight: 600; font-size: 14px; box-shadow: 0 2px 10px rgba(0,0,0,0.05);">LED Lighting</a>
        <a href="smart-door-locks.html" style="background: #fff; border: 1px solid var(--border); padding: 10px 20px; border-radius: 50px; text-decoration: none; color: var(--maroon); font-weight: 600; font-size: 14px; box-shadow: 0 2px 10px rgba(0,0,0,0.05);">Smart Locks</a>
        <a href="distribution-boards.html" style="background: #fff; border: 1px solid var(--border); padding: 10px 20px; border-radius: 50px; text-decoration: none; color: var(--maroon); font-weight: 600; font-size: 14px; box-shadow: 0 2px 10px rgba(0,0,0,0.05);">MCB & DBs</a>
      </div>
    </div>
  </div>
`;

const relatedServicesHtml = `
  <!-- RELATED SERVICES FOR SEO -->
  <div style="background: var(--cream-dark); padding: 40px 5%; margin-top: 60px;">
    <div style="max-width: 1200px; margin: auto;">
      <h3 style="font-family: 'Cormorant Garamond', serif; font-size: 28px; color: var(--maroon-dark); margin-bottom: 20px; border-bottom: 2px solid var(--gold); padding-bottom: 10px; display: inline-block;">Related Services</h3>
      <div style="display: flex; gap: 15px; flex-wrap: wrap; margin-top: 15px;">
        <a href="cctv-installation.html" style="background: #fff; border: 1px solid var(--border); padding: 10px 20px; border-radius: 50px; text-decoration: none; color: var(--maroon); font-weight: 600; font-size: 14px; box-shadow: 0 2px 10px rgba(0,0,0,0.05);">CCTV Installation</a>
        <a href="electrical-contracting.html" style="background: #fff; border: 1px solid var(--border); padding: 10px 20px; border-radius: 50px; text-decoration: none; color: var(--maroon); font-weight: 600; font-size: 14px; box-shadow: 0 2px 10px rgba(0,0,0,0.05);">House Wiring</a>
        <a href="commercial-electrical.html" style="background: #fff; border: 1px solid var(--border); padding: 10px 20px; border-radius: 50px; text-decoration: none; color: var(--maroon); font-weight: 600; font-size: 14px; box-shadow: 0 2px 10px rgba(0,0,0,0.05);">Commercial Setup</a>
        <a href="electrical-maintenance.html" style="background: #fff; border: 1px solid var(--border); padding: 10px 20px; border-radius: 50px; text-decoration: none; color: var(--maroon); font-weight: 600; font-size: 14px; box-shadow: 0 2px 10px rgba(0,0,0,0.05);">Maintenance & AMC</a>
      </div>
    </div>
  </div>
`;

let updateCount = 0;

fs.readdirSync(directory).forEach(file => {
    if (file.endsWith('.html') && !excludeFiles.includes(file)) {
        let content = fs.readFileSync(path.join(directory, file), 'utf8');
        
        // Ensure we don't add it twice
        if (content.includes('<!-- RELATED PRODUCTS FOR SEO -->') || content.includes('<!-- RELATED SERVICES FOR SEO -->')) {
            return;
        }

        let injectionHtml = '';
        if (productFiles.includes(file)) {
            injectionHtml = relatedProductsHtml;
        } else if (serviceFiles.includes(file)) {
            injectionHtml = relatedServicesHtml;
        }

        if (injectionHtml) {
            // Find the footer tag or comment and inject right before it
            if (content.includes('<!-- FOOTER -->')) {
                content = content.replace('<!-- FOOTER -->', injectionHtml + '\n  <!-- FOOTER -->');
            } else if (content.includes('<footer>')) {
                content = content.replace('<footer>', injectionHtml + '\n  <footer>');
            }
            
            fs.writeFileSync(path.join(directory, file), content, 'utf8');
            console.log(\`✅ Added internal links to: \${file}\`);
            updateCount++;
        }
    }
});

console.log(\`\\n🎉 Internal linking complete. Updated \${updateCount} files.\`);
