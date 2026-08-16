const fs = require('fs');
const path = require('path');

const rootDir = 'd:\\Downloads\\ANSHU';

function getAllHtmlFiles(dirPath, arrayOfFiles) {
  const files = fs.readdirSync(dirPath);
  arrayOfFiles = arrayOfFiles || [];

  files.forEach(function(file) {
    const fullPath = path.join(dirPath, file);
    if (fs.statSync(fullPath).isDirectory()) {
      if (!file.startsWith('.') && file !== 'node_modules' && file !== 'home page anshuman enterprises') {
        arrayOfFiles = getAllHtmlFiles(fullPath, arrayOfFiles);
      }
    } else {
      if (file.endsWith('.html')) {
        arrayOfFiles.push(fullPath);
      }
    }
  });

  return arrayOfFiles;
}

const htmlFiles = getAllHtmlFiles(rootDir);
console.log(`Updating specialized domain category menus across ${htmlFiles.length} HTML files...`);

let totalFixed = 0;

htmlFiles.forEach(filePath => {
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;

  const isDecorateNow = filePath.includes('\\decoratenow\\');
  const isContractor = filePath.includes('\\contractor\\');

  let hubLink, dnLink, acLink;
  let homeLink, aboutLink, productsLink, catalogueLink, contactLink, faqLink;
  let brandTitle, logoImg;
  let categoryPillsHTML = '';

  if (isDecorateNow) {
    brandTitle = 'DecorateNow';
    logoImg = '../decoratenow-logo.png';

    // Global Switcher Links from inside decoratenow/
    hubLink = '../index.html';
    dnLink = 'index.html';
    acLink = '../contractor/index.html';

    // Navbar & Mobile Drawer Links from inside decoratenow/
    homeLink = 'index.html';
    aboutLink = '../about.html';
    productsLink = 'products.html';
    catalogueLink = 'products.html';
    contactLink = 'contact.html';
    faqLink = 'faq.html';

    // DecorateNow-Specific Category Pills
    categoryPillsHTML = `
      <a href="products.html?cat=chandeliers" style="display:inline-flex;align-items:center;gap:4px;padding:5px 14px;border-radius:50px;text-decoration:none;font-size:12px;font-weight:700;white-space:nowrap;background:rgba(201,168,76,0.18);border:1px solid rgba(201,168,76,0.5);color:#C9A84C;">✨ Chandeliers</a>
      <a href="products.html?cat=wall-sconces" style="display:inline-flex;align-items:center;gap:4px;padding:5px 14px;border-radius:50px;text-decoration:none;font-size:12px;font-weight:700;white-space:nowrap;background:rgba(201,168,76,0.18);border:1px solid rgba(201,168,76,0.5);color:#C9A84C;">🕯 Wall Sconces</a>
      <a href="products.html?cat=pendants" style="display:inline-flex;align-items:center;gap:4px;padding:5px 14px;border-radius:50px;text-decoration:none;font-size:12px;font-weight:700;white-space:nowrap;background:rgba(201,168,76,0.18);border:1px solid rgba(201,168,76,0.5);color:#C9A84C;">🔆 Pendant Lights</a>
      <a href="products.html?cat=led-strips" style="display:inline-flex;align-items:center;gap:4px;padding:5px 14px;border-radius:50px;text-decoration:none;font-size:12px;font-weight:700;white-space:nowrap;background:rgba(201,168,76,0.18);border:1px solid rgba(201,168,76,0.5);color:#C9A84C;">💡 LED Strips</a>
      <a href="products.html?cat=ceiling" style="display:inline-flex;align-items:center;gap:4px;padding:5px 14px;border-radius:50px;text-decoration:none;font-size:12px;font-weight:700;white-space:nowrap;background:rgba(201,168,76,0.18);border:1px solid rgba(201,168,76,0.5);color:#C9A84C;">🏠 Ceiling Lights</a>
      <a href="products.html?cat=decorative" style="display:inline-flex;align-items:center;gap:4px;padding:5px 14px;border-radius:50px;text-decoration:none;font-size:12px;font-weight:700;white-space:nowrap;background:rgba(201,168,76,0.18);border:1px solid rgba(201,168,76,0.5);color:#C9A84C;">🎨 Decorative Lighting</a>
    `;
  } else if (isContractor) {
    brandTitle = 'Aditya Contractor';
    logoImg = '../aditya-contractor-logo.png';

    // Global Switcher Links from inside contractor/
    hubLink = '../index.html';
    dnLink = '../decoratenow/index.html';
    acLink = 'index.html';

    // Navbar & Mobile Drawer Links from inside contractor/
    homeLink = 'index.html';
    aboutLink = '../about.html';
    productsLink = '../products.html';
    catalogueLink = 'services.html';
    contactLink = 'contact.html';
    faqLink = 'faq.html';

    // Aditya Contractor-Specific Category Pills
    categoryPillsHTML = `
      <a href="services.html" style="display:inline-flex;align-items:center;gap:4px;padding:5px 14px;border-radius:50px;text-decoration:none;font-size:12px;font-weight:700;white-space:nowrap;background:rgba(201,168,76,0.18);border:1px solid rgba(201,168,76,0.5);color:#C9A84C;">⚡ Electrical Contracting</a>
      <a href="cctv-installation.html" style="display:inline-flex;align-items:center;gap:4px;padding:5px 14px;border-radius:50px;text-decoration:none;font-size:12px;font-weight:700;white-space:nowrap;background:rgba(201,168,76,0.18);border:1px solid rgba(201,168,76,0.5);color:#C9A84C;">📹 CCTV Setup</a>
      <a href="wires-cables.html" style="display:inline-flex;align-items:center;gap:4px;padding:5px 14px;border-radius:50px;text-decoration:none;font-size:12px;font-weight:700;white-space:nowrap;background:rgba(201,168,76,0.18);border:1px solid rgba(201,168,76,0.5);color:#C9A84C;">🔌 Wiring & Cabling</a>
      <a href="interior-lighting.html" style="display:inline-flex;align-items:center;gap:4px;padding:5px 14px;border-radius:50px;text-decoration:none;font-size:12px;font-weight:700;white-space:nowrap;background:rgba(201,168,76,0.18);border:1px solid rgba(201,168,76,0.5);color:#C9A84C;">💡 Interior Lighting</a>
      <a href="smart-door-locks.html" style="display:inline-flex;align-items:center;gap:4px;padding:5px 14px;border-radius:50px;text-decoration:none;font-size:12px;font-weight:700;white-space:nowrap;background:rgba(201,168,76,0.18);border:1px solid rgba(201,168,76,0.5);color:#C9A84C;">🔒 Smart Locks & Access</a>
      <a href="network-rack-setup.html" style="display:inline-flex;align-items:center;gap:4px;padding:5px 14px;border-radius:50px;text-decoration:none;font-size:12px;font-weight:700;white-space:nowrap;background:rgba(201,168,76,0.18);border:1px solid rgba(201,168,76,0.5);color:#C9A84C;">🌐 Network & Racks</a>
    `;
  } else {
    // Root Anshuman Hub
    brandTitle = 'Anshuman Enterprises';
    logoImg = 'logo.webp';

    // Global Switcher Links from root
    hubLink = 'index.html';
    dnLink = 'decoratenow/index.html';
    acLink = 'contractor/index.html';

    // Navbar & Mobile Drawer Links from root
    homeLink = 'index.html';
    aboutLink = 'about.html';
    productsLink = 'products.html';
    catalogueLink = 'our-catalogue.html';
    contactLink = 'contact.html';
    faqLink = 'faq.html';

    // Anshuman Hub Wholesale Categories
    categoryPillsHTML = `
      <a href="electrical-contracting.html" style="display:inline-flex;align-items:center;gap:4px;padding:5px 14px;border-radius:50px;text-decoration:none;font-size:12px;font-weight:700;white-space:nowrap;background:rgba(201,168,76,0.18);border:1px solid rgba(201,168,76,0.5);color:#C9A84C;">⚡ Electrical</a>
      <a href="cctv-installation.html" style="display:inline-flex;align-items:center;gap:4px;padding:5px 14px;border-radius:50px;text-decoration:none;font-size:12px;font-weight:700;white-space:nowrap;background:rgba(201,168,76,0.18);border:1px solid rgba(201,168,76,0.5);color:#C9A84C;">📹 CCTV & Security</a>
      <a href="wires-cables.html" style="display:inline-flex;align-items:center;gap:4px;padding:5px 14px;border-radius:50px;text-decoration:none;font-size:12px;font-weight:700;white-space:nowrap;background:rgba(201,168,76,0.18);border:1px solid rgba(201,168,76,0.5);color:#C9A84C;">🔌 Wires & Cables</a>
      <a href="led-lighting.html" style="display:inline-flex;align-items:center;gap:4px;padding:5px 14px;border-radius:50px;text-decoration:none;font-size:12px;font-weight:700;white-space:nowrap;background:rgba(201,168,76,0.18);border:1px solid rgba(201,168,76,0.5);color:#C9A84C;">💡 LED Lighting</a>
      <a href="smart-door-locks.html" style="display:inline-flex;align-items:center;gap:4px;padding:5px 14px;border-radius:50px;text-decoration:none;font-size:12px;font-weight:700;white-space:nowrap;background:rgba(201,168,76,0.18);border:1px solid rgba(201,168,76,0.5);color:#C9A84C;">🔒 Smart Security</a>
      <a href="network-rack-setup.html" style="display:inline-flex;align-items:center;gap:4px;padding:5px 14px;border-radius:50px;text-decoration:none;font-size:12px;font-weight:700;white-space:nowrap;background:rgba(201,168,76,0.18);border:1px solid rgba(201,168,76,0.5);color:#C9A84C;">🌐 Networking</a>
      <a href="${catalogueLink}" style="display:inline-flex;align-items:center;gap:4px;padding:5px 14px;border-radius:50px;text-decoration:none;font-size:12px;font-weight:700;white-space:nowrap;background:rgba(201,168,76,0.18);border:1px solid rgba(201,168,76,0.5);color:#C9A84C;">📋 Catalogue</a>
    `;
  }

  const cssPrefix = (isDecorateNow || isContractor) ? '../' : '';

  let activeHub = 'b2b';
  if (isDecorateNow) activeHub = 'dn';
  if (isContractor) activeHub = 'ac';

  const hubBg = (activeHub === 'b2b') ? '#f59e0b' : 'rgba(255,255,255,0.08)';
  const hubColor = (activeHub === 'b2b') ? '#111827' : '#e2e8f0';
  const dnBg = (activeHub === 'dn') ? '#f59e0b' : 'rgba(255,255,255,0.08)';
  const dnColor = (activeHub === 'dn') ? '#111827' : '#e2e8f0';
  const acBg = (activeHub === 'ac') ? '#f59e0b' : 'rgba(255,255,255,0.08)';
  const acColor = (activeHub === 'ac') ? '#111827' : '#e2e8f0';

  const newHeaderHTML = `
<!-- Unified Responsive Header Block -->
<div id="ae-sticky-wrap">
  <div id="ae-global-switcher" style="background:#0f172a;padding:8px 16px;border-bottom:1px solid rgba(255,255,255,0.1);font-family:'Montserrat',sans-serif;">
    <div style="max-width:1280px;margin:0 auto;display:flex;align-items:center;justify-content:space-between;gap:16px;">
      <div style="display:flex;align-items:center;gap:8px;overflow-x:auto;scrollbar-width:none;-ms-overflow-style:none;">
        <a href="${hubLink}" style="display:inline-flex;align-items:center;gap:6px;padding:5px 14px;border-radius:50px;text-decoration:none;font-weight:700;font-size:12px;white-space:nowrap;background:${hubBg};color:${hubColor};">🏢 Anshuman Hub</a>
        <a href="${dnLink}" style="display:inline-flex;align-items:center;gap:6px;padding:5px 14px;border-radius:50px;text-decoration:none;font-weight:700;font-size:12px;white-space:nowrap;background:${dnBg};color:${dnColor};">💡 DecorateNow</a>
        <a href="${acLink}" style="display:inline-flex;align-items:center;gap:6px;padding:5px 14px;border-radius:50px;text-decoration:none;font-weight:700;font-size:12px;white-space:nowrap;background:${acBg};color:${acColor};">🔧 Aditya Contractor</a>
      </div>
      <div class="ae-topbar-contact" style="display:flex;align-items:center;gap:16px;color:#cbd5e1;font-size:11px;font-weight:500;white-space:nowrap;">
        <span>📍 Greater Noida, UP</span>
        <span>📞 +91 70658 15743</span>
      </div>
    </div>
  </div>
  <header id="ae-hub-header" style="background:#FAF7F2;border-bottom:1px solid rgba(107,28,35,0.12);box-shadow:0 2px 12px rgba(61,14,20,0.06);">
    <div style="max-width:1280px;margin:0 auto;display:flex;align-items:center;justify-content:space-between;padding:10px 16px;">
      <a href="${homeLink}" style="display:flex;align-items:center;gap:10px;text-decoration:none;max-width:65%;overflow:hidden;">
        <img alt="${brandTitle}" src="${logoImg}" onerror="this.src='${cssPrefix}logo.webp';" style="height:38px;width:38px;border-radius:50%;object-fit:cover;border:2px solid #C9A84C;background:#f5ead5;flex-shrink:0;"/>
        <span style="font-family:'EB Garamond',serif;font-size:20px;font-weight:700;color:#3D0E14;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${brandTitle}</span>
      </a>

      <!-- Desktop Navigation Links -->
      <nav class="ae-nav-desktop-links">
        <a href="${homeLink}" style="font-family:'Montserrat',sans-serif;font-size:14px;font-weight:600;color:#524343;text-decoration:none;">Home</a>
        <a href="${aboutLink}" style="font-family:'Montserrat',sans-serif;font-size:14px;font-weight:600;color:#524343;text-decoration:none;">About Us</a>
        <a href="${productsLink}" style="font-family:'Montserrat',sans-serif;font-size:14px;font-weight:600;color:#524343;text-decoration:none;">Products</a>
        <a href="${catalogueLink}" style="font-family:'Montserrat',sans-serif;font-size:14px;font-weight:600;color:#524343;text-decoration:none;">Catalogue</a>
        <a href="${contactLink}" style="font-family:'Montserrat',sans-serif;font-size:14px;font-weight:600;color:#524343;text-decoration:none;">Contact Us</a>
        <a href="${faqLink}" style="font-family:'Montserrat',sans-serif;font-size:14px;font-weight:600;color:#524343;text-decoration:none;">FAQs</a>
      </nav>

      <div style="display:flex;align-items:center;gap:12px;color:#3D0E14;">
        <div class="ae-search-desktop" style="display:flex;align-items:center;background:#f0ede9;padding:6px 14px;border-radius:50px;border:1px solid rgba(215,193,194,0.5);">
          <span class="material-symbols-outlined" style="font-size:18px;color:#857373;margin-right:6px;">search</span>
          <input placeholder="Search..." type="text" onkeyup="if(event.key==='Enter') window.location.href='${cssPrefix}products.html?q='+encodeURIComponent(this.value)" style="background:transparent;border:none;outline:none;font-size:13px;width:130px;color:#1c1c19;font-family:inherit;"/>
        </div>
        <a href="https://wa.me/917065815743" target="_blank" title="WhatsApp" style="color:#3D0E14;text-decoration:none;display:flex;align-items:center;"><span class="material-symbols-outlined" style="font-size:22px;">chat</span></a>
        <a href="${cssPrefix}checkout.html" style="color:#3D0E14;text-decoration:none;display:flex;align-items:center;position:relative;" title="Cart">
          <span class="material-symbols-outlined" style="font-size:22px;">shopping_cart</span>
          <span style="position:absolute;top:-6px;right:-6px;background:#6b1c23;color:#fff;font-size:10px;font-weight:700;width:16px;height:16px;border-radius:50%;display:flex;align-items:center;justify-content:center;">0</span>
        </a>

        <!-- Mobile Hamburger Menu Button -->
        <button id="ae-mobile-toggle" onclick="window.aeToggleMobileMenu(event)" type="button" aria-label="Toggle Mobile Navigation Menu">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>
      </div>
    </div>
  </header>

  <!-- Category Pills Navigation -->
  <div id="ae-cat-nav" style="background:#FAF7F2;border-bottom:1px solid rgba(201,168,76,0.4);padding:8px 16px;overflow:hidden;">
    <div style="max-width:1280px;margin:0 auto;display:flex;align-items:center;gap:8px;overflow-x:auto;scrollbar-width:none;-ms-overflow-style:none;">
      ${categoryPillsHTML}
    </div>
  </div>
</div>

<!-- Mobile Navigation Overlay Drawer -->
<div id="ae-mobile-drawer">
  <div id="ae-mobile-backdrop" onclick="window.aeCloseMobileMenu(event)"></div>
  <div id="ae-mobile-panel">
    <div style="display:flex;align-items:center;justify-content:space-between;padding-bottom:16px;border-bottom:1px solid rgba(107,28,35,0.12);">
      <div style="display:flex;align-items:center;gap:8px;">
        <img src="${logoImg}" alt="${brandTitle}" style="height:32px;width:32px;border-radius:50%;"/>
        <span style="font-family:'EB Garamond',serif;font-weight:700;font-size:18px;color:#3D0E14;">${brandTitle}</span>
      </div>
      <button id="ae-mobile-close" onclick="window.aeCloseMobileMenu(event)" type="button" style="background:transparent;border:none;color:#3D0E14;cursor:pointer;padding:4px;" aria-label="Close Menu">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
    </div>

    <!-- Search Box in Mobile Drawer -->
    <div style="margin:16px 0;">
      <div style="display:flex;align-items:center;background:#fff;padding:8px 14px;border-radius:50px;border:1px solid rgba(107,28,35,0.2);">
        <span class="material-symbols-outlined" style="font-size:18px;color:#857373;margin-right:6px;">search</span>
        <input placeholder="Search inventory..." type="text" onkeyup="if(event.key==='Enter'){ window.aeCloseMobileMenu(); window.location.href='${cssPrefix}products.html?q='+encodeURIComponent(this.value); }" style="background:transparent;border:none;outline:none;font-size:14px;width:100%;color:#1c1c19;"/>
      </div>
    </div>

    <!-- Drawer Navigation Links -->
    <nav style="display:flex;flex-direction:column;gap:8px;flex:1;">
      <a href="${homeLink}" class="ae-mobile-nav-link"><span class="material-symbols-outlined">home</span> Home</a>
      <a href="${aboutLink}" class="ae-mobile-nav-link"><span class="material-symbols-outlined">info</span> About Us</a>
      <a href="${productsLink}" class="ae-mobile-nav-link"><span class="material-symbols-outlined">inventory_2</span> Products</a>
      <a href="${catalogueLink}" class="ae-mobile-nav-link"><span class="material-symbols-outlined">menu_book</span> Catalogue</a>
      <a href="${contactLink}" class="ae-mobile-nav-link"><span class="material-symbols-outlined">call</span> Contact Us</a>
      <a href="${faqLink}" class="ae-mobile-nav-link"><span class="material-symbols-outlined">help</span> FAQs</a>
    </nav>

    <!-- Drawer Footer Info & WhatsApp Quick Action -->
    <div style="padding-top:16px;border-top:1px solid rgba(107,28,35,0.12);display:flex;flex-direction:column;gap:10px;font-size:12px;color:#6b7280;">
      <div>📍 Greater Noida, UP</div>
      <div>📞 +91 70658 15743</div>
      <a href="https://wa.me/917065815743" target="_blank" style="display:inline-flex;align-items:center;justify-content:center;gap:6px;padding:12px;background:#25D366;color:#fff;border-radius:50px;text-decoration:none;font-weight:700;box-shadow:0 4px 12px rgba(37,211,102,0.3);">
        <span class="material-symbols-outlined">chat</span> Chat on WhatsApp
      </a>
    </div>
  </div>
</div>
`;

  if (content.includes('<div id="ae-sticky-wrap"')) {
    content = content.replace(/<div id="ae-sticky-wrap"[\s\S]*?(?=<!-- Hero|<body|<section|<main|<div class="container"|<div class="about-hero"|<div class="quick-links"|<div class="map-section")/i, newHeaderHTML + '\n');
  }

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    totalFixed++;
  }
});

console.log(`Specialized domain categories applied across ${totalFixed} HTML files!`);
