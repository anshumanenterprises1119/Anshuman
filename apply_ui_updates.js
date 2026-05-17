const fs = require('fs');
const path = require('path');

const dir = 'c:\\Users\\aditya tiwari\\Downloads\\ANSHU';

// 1. Inject Services Strip into index.html
const indexFile = path.join(dir, 'index.html');
let indexContent = fs.readFileSync(indexFile, 'utf8');

const servicesStripHtml = `
  <!-- SERVICES STRIP (QUICK VIEW) -->
  <section class="section" style="background:var(--cream-dark);">
    <div class="section-inner">
      <div style="text-align:center;margin-bottom:8px;">
        <span class="label">Expert Services</span>
      </div>
      <h2 class="section-title section-center">Professional Installation & Contracting</h2>
      <p class="section-subtitle">Beyond wholesale products, we offer end-to-end installation services by certified experts.</p>
      
      <div class="why-grid" style="margin-top: 40px;">
        <a href="electrical-contracting.html" class="why-card" style="text-decoration:none; color:inherit; transition: transform 0.3s; display:block;">
          <div class="why-icon">⚡</div>
          <h3 style="color:var(--maroon-mid);">Electrical Contracting</h3>
          <p>Complete wiring and electrical setup for residential societies and commercial complexes.</p>
        </a>
        <a href="cctv-installation.html" class="why-card" style="text-decoration:none; color:inherit; transition: transform 0.3s; display:block;">
          <div class="why-icon">📸</div>
          <h3 style="color:var(--maroon-mid);">CCTV Installation</h3>
          <p>High-quality security camera setups for homes, shops, and large campuses.</p>
        </a>
        <a href="electrical-maintenance.html" class="why-card" style="text-decoration:none; color:inherit; transition: transform 0.3s; display:block;">
          <div class="why-icon">🔧</div>
          <h3 style="color:var(--maroon-mid);">Electrical Maintenance</h3>
          <p>Regular maintenance contracts and quick fault repairs for housing societies.</p>
        </a>
      </div>
      
      <div style="text-align:center;margin-top:40px;">
        <a href="services.html" class="btn-primary" style="display:inline-block;">View All Services →</a>
      </div>
    </div>
  </section>
`;

if (!indexContent.includes('<!-- SERVICES STRIP (QUICK VIEW) -->')) {
    indexContent = indexContent.replace('<!-- WHY CHOOSE US -->', servicesStripHtml + '\n  <!-- WHY CHOOSE US -->');
}

// 2. Add some backlinks (Internal Linking)
// Link "Top Brands" to products in index.html
indexContent = indexContent.replace('<div class="hero-stat-label">Top Brands</div>', '<a href="products.html" class="hero-stat-label" style="color:inherit; text-decoration:underline;">Top Brands</a>');
indexContent = indexContent.replace('<div class="hero-stat-label">Genuine Products</div>', '<a href="products.html" class="hero-stat-label" style="color:inherit; text-decoration:underline;">Genuine Products</a>');

// Write index.html back
fs.writeFileSync(indexFile, indexContent, 'utf8');
console.log("Injected Services Quick View into index.html and added internal links.");

// 3. Fix missing mojibake across all HTML files
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));
for (const file of files) {
    const filePath = path.join(dir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Fix stragglers
    let original = content;
    content = content.replace(/ðŸ¤ /g, '🤝');
    content = content.replace(/ðŸšš/g, '🚚');
    content = content.replace(/âœ…/g, '✅');
    content = content.replace(/ðŸ’°/g, '💰');
    content = content.replace(/ðŸ›¡/g, '🛡️');
    
    if (content !== original) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Fixed leftover emojis in ${file}`);
    }
}
