const fs = require('fs');
const path = require('path');

const dir = 'd:\\Downloads\\ANSHU';

console.log("====================================================");
console.log("  ANSHUMAN ENTERPRISES - HTML BRAND UPDATE UTILITY v3");
console.log("====================================================");
console.log("");

// Detailed fallback style properties for each brand to render a premium text logo
const brandStyles = {
  polycab: { text: 'POLYCAB', color: '#e31e24', weight: '900', spacing: '1px' },
  havells: { text: 'HAVELLS', color: '#000000', weight: '900', spacing: '0.5px' },
  kei: { text: 'KEI', color: '#0054a6', weight: '900', spacing: '0.5px' },
  greatwhite: { text: 'GreatWhite', color: '#d62027', weight: '800', spacing: '0px' },
  anchor: { text: 'ANCHOR', color: '#000000', weight: '900', spacing: '0.5px' },
  orient: { text: 'ORIENT', color: '#f05a28', weight: '900', spacing: '0.5px' },
  bosch: { text: 'BOSCH', color: '#1d252d', weight: '900', spacing: '1px' },
  araldite: { text: 'Araldite', color: '#0071bc', weight: '800', spacing: '0px' },
  paras: { text: 'PARAS', color: '#1a1a1a', weight: '900', spacing: '1px' },
  legrand: { text: 'Legrand', color: '#e21a22', weight: '800', spacing: '0px' },
  hikvision: { text: 'HIKVISION', color: '#e20613', weight: '900', spacing: '0.5px' },
  surya: { text: 'SURYA', color: '#f26522', weight: '900', spacing: '0.5px' }
};

// Helper function to generate hybrid image-with-styled-text-fallback HTML
function getLogoImgTag(key, alt) {
  const brand = brandStyles[key] || { text: alt.toUpperCase(), color: '#1a1a1a', weight: '800', spacing: '0.5px' };
  
  // We check if the file exists on disk to set default display. Even if it doesn't, error handler handles it.
  const pngPath = path.join(dir, 'images', 'brands', `${key}.png`);
  const svgPath = path.join(dir, 'images', 'brands', `${key}.svg`);
  
  let src = `images/brands/${key}.png`;
  let hasFile = fs.existsSync(pngPath);
  
  if (fs.existsSync(svgPath)) {
    src = `images/brands/${key}.svg`;
    hasFile = true;
  }
  
  const imgStyle = hasFile ? 'max-height:100%; max-width:100%; object-fit:contain;' : 'display:none; max-height:100%; max-width:100%; object-fit:contain;';
  const spanStyle = hasFile ? 'display:none;' : 'display:inline-block;';

  return `<div class="brand-chip" style="background:#fff; padding:6px 12px; height:42px; display:flex; align-items:center; justify-content:center; border-radius:8px; box-shadow: 0 2px 8px rgba(0,0,0,0.06);">` +
    `<img src="${src}" alt="${alt}" style="${imgStyle}" onerror="this.style.display='none'; this.nextElementSibling.style.display='inline-block';" />` +
    `<span style="${spanStyle} font-family:'DM Sans', sans-serif; font-weight:${brand.weight}; font-size:15px; color:${brand.color}; letter-spacing:${brand.spacing}; text-transform:uppercase;">${brand.text}</span>` +
    `</div>`;
}

// 1. UPDATE INDEX.HTML HERO BRANDS GRID & TEXT FIELDS
const indexPath = path.join(dir, 'index.html');
if (fs.existsSync(indexPath)) {
  let indexContent = fs.readFileSync(indexPath, 'utf8');
  
  // Construct dynamic hero brands grid HTML
  const replacementHeroBrands = `<div class="hero-card-title">Authorized Electrical & Hardware Brands</div>
          <div class="brand-grid">
            ${getLogoImgTag('polycab', 'Polycab')}
            ${getLogoImgTag('havells', 'Havells')}
            ${getLogoImgTag('kei', 'KEI')}
            ${getLogoImgTag('greatwhite', 'GreatWhite')}
            ${getLogoImgTag('anchor', 'Anchor Panasonic')}
            ${getLogoImgTag('orient', 'Orient')}
            ${getLogoImgTag('bosch', 'Bosch')}
            ${getLogoImgTag('araldite', 'Araldite')}
            ${getLogoImgTag('paras', 'Paras')}
          </div>`;

  // Replace old grid structure
  indexContent = indexContent.replace(/<div class="hero-card-title">[\s\S]*?<\/div>\s*<div class="brand-grid">[\s\S]*?<\/div>/, replacementHeroBrands);

  // Text edits in index.html for Electrical & Hardware Optimization
  indexContent = indexContent.split('Direct Wholesale Electrical<br>Distributor in Greater Noida')
                             .join('Direct Wholesale Electrical & Hardware<br>Distributor in Greater Noida');
  indexContent = indexContent.split('low-grade electrical components cause costly repairs')
                             .join('low-grade electrical & hardware components cause costly repairs');
  indexContent = indexContent.split('From <a href="products.html#wires" style="color:var(--gold-light);">certified wiring systems</a> to comprehensive industrial project installations, we supply exactly what you require.')
                             .join('From <a href="products.html#wires" style="color:var(--gold-light);">certified wiring systems</a> to professional construction hardware and tools, we supply exactly what you require.');
  indexContent = indexContent.split('Get the Best Electrical Products<br>at Wholesale Pricing')
                             .join('Get the Best Electrical & Hardware Products<br>at Wholesale Pricing');
  indexContent = indexContent.split('<div class="prod-name">Electrical Hardware</div>')
                             .join('<div class="prod-name">Electrical & Construction Hardware</div>');

  fs.writeFileSync(indexPath, indexContent, 'utf8');
  console.log("[OK] Fully optimized copy & brands in index.html");
}

// 2. UPDATE PRODUCTS.HTML BRAND SLIDER
const productsPath = path.join(dir, 'products.html');
if (fs.existsSync(productsPath)) {
  let productsContent = fs.readFileSync(productsPath, 'utf8');
  
  function getSliderCardHtml(key, alt, tag) {
    const brand = brandStyles[key] || { text: alt.toUpperCase(), color: '#1a1a1a', weight: '800', spacing: '0.5px' };
    const pngPath = path.join(dir, 'images', 'brands', `${key}.png`);
    const svgPath = path.join(dir, 'images', 'brands', `${key}.svg`);
    
    let src = `images/brands/${key}.png`;
    let hasFile = fs.existsSync(pngPath);
    if (fs.existsSync(svgPath)) {
      src = `images/brands/${key}.svg`;
      hasFile = true;
    }
    
    const imgStyle = hasFile ? 'max-height:100%; max-width:100%; object-fit:contain;' : 'display:none; max-height:100%; max-width:100%; object-fit:contain;';
    const spanStyle = hasFile ? 'display:none;' : 'display:inline-block;';

    return `      <div class="brand-logo-card">` +
      `<div style="height:40px; display:flex; align-items:center; justify-content:center; margin-bottom:8px;">` +
      `<img src="${src}" alt="${alt}" style="${imgStyle}" onerror="this.style.display='none'; this.nextElementSibling.style.display='inline-block';" />` +
      `<span style="${spanStyle} font-family:'DM Sans', sans-serif; font-weight:${brand.weight}; font-size:15px; color:${brand.color}; letter-spacing:${brand.spacing}; text-transform:uppercase;">${brand.text}</span>` +
      `</div>` +
      `<div class="brand-logo-tag">${tag}</div>` +
      `</div>`;
  }

  const singleSliderGroup = [
    getSliderCardHtml('polycab', 'Polycab', 'Wires & Cables'),
    getSliderCardHtml('havells', 'Havells', 'Wires · MCB · Switches'),
    getSliderCardHtml('kei', 'KEI', 'Wires & Cables'),
    getSliderCardHtml('greatwhite', 'GreatWhite', 'Modular Switches'),
    getSliderCardHtml('anchor', 'Anchor Panasonic', 'Switches & Accessories'),
    getSliderCardHtml('orient', 'Orient', 'Fans & Switches'),
    getSliderCardHtml('legrand', 'Legrand', 'MCB & Distribution'),
    getSliderCardHtml('hikvision', 'Hikvision', 'CCTV & NVR'),
    getSliderCardHtml('surya', 'Surya', 'Lighting Solutions'),
    getSliderCardHtml('bosch', 'Bosch', 'Blades & Tools'),
    getSliderCardHtml('araldite', 'Araldite', 'Epoxies & Adhesives'),
    getSliderCardHtml('paras', 'Paras', 'Support Rods')
  ].join('\n');

  const newSliderContent = `<div class="slider-track" id="sliderTrack">
${singleSliderGroup}
      <!-- duplicate for seamless loop -->
${singleSliderGroup}
    </div>`;

  const targetSliderTrack = /<div class="slider-track" id="sliderTrack">[\s\S]*?<\/div>\s*<\/div>\s*<\/div>\s*<\/section>/;
  
  productsContent = productsContent.replace(targetSliderTrack, `${newSliderContent}\n  </div>\n</section>`);
  fs.writeFileSync(productsPath, productsContent, 'utf8');
  console.log("[OK] Updated slider brand cards with correct extensions & fallback in products.html");
}

console.log("");
console.log("====================================================");
console.log("  Brand Logo Integration Complete!");
console.log("====================================================");
