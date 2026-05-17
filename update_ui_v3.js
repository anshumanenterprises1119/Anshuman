const fs = require('fs');
const path = require('path');

const projectDir = 'c:\\Users\\aditya tiwari\\Downloads\\ANSHU';
const artifactsDir = 'C:\\Users\\aditya tiwari\\.gemini\\antigravity\\brain\\d272e68f-60da-4cda-ae74-64c46b55ce2a';
const brandsDir = path.join(projectDir, 'brands');

// 1. Copy the 5 latest logos
if (!fs.existsSync(brandsDir)) {
    fs.mkdirSync(brandsDir, { recursive: true });
}

// Get all media__.png files and sort by creation time (or just parse timestamp from filename)
const artifactFiles = fs.readdirSync(artifactsDir).filter(f => f.startsWith('media__') && f.endsWith('.png'));
artifactFiles.sort(); // Sorting alphabetically by timestamp will put the newest at the end

// Get the last 5 files
const latestLogos = artifactFiles.slice(-5);
let logoImagesHtml = '';

latestLogos.forEach((file, index) => {
    const src = path.join(artifactsDir, file);
    const destName = `brand_${index + 1}.png`;
    const dest = path.join(brandsDir, destName);
    fs.copyFileSync(src, dest);
    
    // Add to our HTML string with mix-blend-mode: multiply to remove white backgrounds
    logoImagesHtml += `
    <div style="background:#fff; padding:10px; border-radius:8px; display:flex; align-items:center; justify-content:center; box-shadow:0 2px 5px rgba(0,0,0,0.05);">
        <img src="brands/${destName}" alt="Brand Logo" style="max-width:100%; max-height:45px; object-fit:contain; mix-blend-mode:multiply;">
    </div>`;
});

console.log('Successfully copied brand logos to ANSHU/brands/');

// 2. Update all HTML files (Navigation + Social Links)
const newNavLogoHtml = `
      <a href="index.html" class="nav-logo" style="text-decoration: none; display: flex; align-items: center; gap: 12px;">
        <img src="logo.webp" alt="Anshuman Enterprises Logo" style="height: 50px; width: auto; object-fit: contain;">
        <span style="color: #c9a84c; font-family: 'Cormorant Garamond', serif; font-size: 22px; font-weight: 700; line-height: 1.1; display:flex; flex-direction:column; justify-content:center;">Anshuman<span style="font-size: 13px; color: #fff; font-family: 'DM Sans', sans-serif; font-weight:400; letter-spacing:1px;">ENTERPRISES</span></span>
      </a>`;

const socialLinksHtml = `
    <div style="display: flex; justify-content: center; gap: 15px; margin-top: 25px; padding-top: 15px; border-top: 1px solid rgba(61,14,20,0.1);">
      <a href="https://www.instagram.com/about.aaditya" target="_blank" style="text-decoration:none; font-size: 24px;">📸</a>
      <a href="https://youtube.com/@anshumanenterprises1119" target="_blank" style="text-decoration:none; font-size: 24px;">▶</a>
      <a href="https://www.linkedin.com/in/aditya-tiwari-18a1a2371?" target="_blank" style="text-decoration:none; font-size: 24px;">💼</a>
    </div>`;

const files = fs.readdirSync(projectDir).filter(f => f.endsWith('.html'));

for (const file of files) {
    const filePath = path.join(projectDir, file);
    let content = fs.readFileSync(filePath, 'utf8');

    // Add company text to Navbar
    content = content.replace(/<a href="index\.html" class="nav-logo" style="text-decoration: none; display: flex; align-items: center;">[\s\S]*?<\/a>/, newNavLogoHtml);

    // Add Social Links to the Side Menu (just before the end of the menu)
    if (content.includes('📞 Call Now') && !content.includes('📸</a>')) {
        content = content.replace(/(<a href="tel:\+917065815743"[^>]*>[\s\S]*?<\/a>\s*)(<\/div>\s*<\/div>)/, `$1\n${socialLinksHtml}\n$2`);
    }

    // 3. Specifically for index.html: Replace Brand Text Pills with the actual Image Logos
    if (file === 'index.html') {
        const brandGridRegex = /<div class="brand-grid">[\s\S]*?<\/div>/;
        const newBrandGrid = `
        <div class="brand-grid" style="display:grid; grid-template-columns:repeat(auto-fit, minmax(100px, 1fr)); gap:15px; margin-top:20px;">
            ${logoImagesHtml}
        </div>`;
        if (brandGridRegex.test(content) && !content.includes('mix-blend-mode:multiply')) {
             content = content.replace(brandGridRegex, newBrandGrid);
        }
    }

    fs.writeFileSync(filePath, content, 'utf8');
}

console.log('Successfully updated navigation text, social links, and brand logos on all pages!');
