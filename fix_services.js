const fs = require('fs');
const path = require('path');

const cleanHtmlPath = path.join(__dirname, 'index_clean.html');
const indexHtmlPath = path.join(__dirname, 'index.html');

try {
  let content = fs.readFileSync(cleanHtmlPath, 'utf8');

  // Replace product placeholders with actual images
  content = content.replace(/src="placeholder\.webp"(\s+)alt="Wires & Cables"/g, 'src="20859.webp"$1alt="Wires & Cables"');
  content = content.replace(/src="placeholder\.webp"(\s+)alt="Switches & Accessories"/g, 'src="20860.webp"$1alt="Switches & Accessories"');
  content = content.replace(/src="placeholder\.webp"(\s+)alt="MCB DB Fittings"/g, 'src="20862.webp"$1alt="MCB DB Fittings"');
  content = content.replace(/src="placeholder\.webp"(\s+)alt="Conduit Pipes"/g, 'src="20864.webp"$1alt="Conduit Pipes"');
  content = content.replace(/src="placeholder\.webp"(\s+)alt="Electrical Hardware"/g, 'src="20865.webp"$1alt="Electrical Hardware"');

  // Replace founder photo placeholder
  content = content.replace(/src="placeholder\.webp"(\s+)alt="Aditya Tiwari/g, 'src="logo.webp"$1alt="Aditya Tiwari');

  // Also replace any remaining placeholder.webp with logo.webp just in case
  content = content.replace(/placeholder\.webp/g, 'logo.webp');

  // Insert Services Section
  const servicesHTML = `
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

  // Insert the Services HTML right before the "WHY CHOOSE US" section
  content = content.replace('  <!-- WHY CHOOSE US -->', servicesHTML + '  <!-- WHY CHOOSE US -->');

  fs.writeFileSync(indexHtmlPath, content, 'utf8');
  console.log('✅ Successfully added Services section and restored index.html!');
} catch (error) {
  console.error('❌ Error restoring index.html:', error.message);
}
