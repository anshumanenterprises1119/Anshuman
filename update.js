const fs = require('fs');
const path = require('path');

const files = ['index.html', 'about.html', 'products.html', 'services.html', 'contact.html', 'gallery.html', 'gallery-admin.html'];
const dir = __dirname;

const navLinks = `
      <div class="nav-links">
        <a href="index.html" class="[ACTIVE_INDEX]">Home</a>
        <a href="products.html" class="[ACTIVE_PRODUCTS]">Products</a>
        <a href="services.html" class="[ACTIVE_SERVICES]">Services</a>
        <a href="gallery.html" class="[ACTIVE_GALLERY]">Gallery</a>
        <a href="about.html" class="[ACTIVE_ABOUT]">About Us</a>
        <a href="contact.html" class="[ACTIVE_CONTACT]">Contact</a>
      </div>
`;

const navCTA = `
      <div class="nav-cta">
        <a href="contact.html" class="btn-nav-wa">
          <span>Inquiry Form</span>
        </a>
        <a href="tel:+917065815743" class="btn-nav-call">📞 Call Now</a>
      </div>`;


const footerContent = `
  <footer>
    <div class="footer-grid">
      <div class="footer-brand">
        <img src="logo.jpg" alt="Anshuman Enterprises">
        <div style="color:#fff;font-family:'Cormorant Garamond',serif;font-size:18px;font-weight:700;margin-top:10px;">
          Anshuman Enterprises</div>
        <p>Greater Noida's trusted electrical supplier — 100% branded products, honest pricing, and long-term
          relationships since 2025.</p>
        <div style="margin-top:16px;display:flex;gap:8px;">
          <a href="contact.html"
            style="display:inline-flex;align-items:center;gap:5px;background:#fff;color:var(--maroon-dark);border:1px solid var(--gold);padding:7px 14px;border-radius:50px;font-size:12px;font-weight:600;text-decoration:none;">📝
            Inquiry Form</a>
          <a href="tel:+917065815743"
            style="display:inline-flex;align-items:center;gap:5px;background:var(--gold);color:var(--maroon-dark);padding:7px 14px;border-radius:50px;font-size:12px;font-weight:600;text-decoration:none;">📞
            Call</a>
        </div>
        <div style="margin-top:12px;display:flex;gap:10px;flex-wrap:wrap;">
          <a href="https://www.instagram.com/about.aaditya" target="_blank"
            style="display:inline-flex;align-items:center;gap:5px;background:linear-gradient(45deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888);color:#fff;padding:7px 12px;border-radius:50px;font-size:12px;font-weight:600;text-decoration:none;">📸
            Instagram</a>
          <a href="https://youtube.com/@anshumanenterprises1119?si=NFaFo_glKpbk2WKX?sub_confirmation=1" target="_blank"
            style="display:inline-flex;align-items:center;gap:5px;background:#FF0000;color:#fff;padding:7px 12px;border-radius:50px;font-size:12px;font-weight:600;text-decoration:none;">▶
            YouTube</a>
          <a href="https://www.linkedin.com/in/aditya-tiwari-18a1a2371?" target="_blank"
            style="display:inline-flex;align-items:center;gap:5px;background:#0077B5;color:#fff;padding:7px 12px;border-radius:50px;font-size:12px;font-weight:600;text-decoration:none;">💼
            LinkedIn</a>
          <a href="https://g.page/r/CdZ99l9ezVvlEBE/review" target="_blank"
            style="display:inline-flex;align-items:center;gap:5px;background:#4285F4;color:#fff;padding:7px 12px;border-radius:50px;font-size:12px;font-weight:600;text-decoration:none;">⭐
            Review Us</a>
        </div>
      </div>
      <div class="footer-col">
        <h4>Quick Links</h4>
        <a href="index.html">Home</a>
        <a href="products.html">Our Products</a>
        <a href="services.html">Services</a>
        <a href="gallery.html">Gallery</a>
        <a href="about.html">About Us</a>
        <a href="contact.html">Contact</a>
      </div>
      <div class="footer-col">
        <h4>Products</h4>
        <a href="products.html#wires">Wires & Cables</a>
        <a href="products.html#switches">Switches & Accessories</a>
        <a href="products.html#mcb">MCB & DB Fittings</a>
        <a href="products.html#conduit">Conduit Pipes</a>
        <a href="products.html#hardware">Electrical Hardware</a>
      </div>
      <div class="footer-col">
        <h4>Contact</h4>
        <p>📍 Shop No.-2, KHS-722,<br>Near Adityanandan Hospital,<br>J S Roop Road, Aimnabad,<br>Sec-1, Greater Noida -
          201306</p>
        <a href="tel:+917065815743">📞 +91 70658 15743</a>
        <a href="mailto:anshumanenterprises1119@gmail.com">✉ anshumanenterprises1119<br>@gmail.com</a>
        <p style="margin-top:8px;font-size:11px;opacity:0.6;">GSTIN: 09AWTPT8270E12Q</p>
      </div>
    </div>
    <div class="footer-bottom">
      <span>© 2025 Anshuman Enterprises. All rights reserved. Founded by Aditya Tiwari.</span>
      <span>Shop No.-2, KHS-722, Greater Noida - 201306</span>
    </div>

    <!-- FLOATING CTA -->
    <div class="floating-cta">
      <a href="https://g.page/r/CdZ99l9ezVvlEBE/review" target="_blank" class="fab-review" title="Review Us on Google">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="28px" height="28px"><path fill="#fbc02d" d="M24 35.56l-11.75 6.18 2.25-13.09-9.5-9.26 13.14-1.91L24 5.5l5.86 11.98 13.14 1.91-9.5 9.26 2.25 13.09z"/></svg>
      </a>
      <a href="https://wa.me/917065815743?text=Hello%20Anshuman%20Enterprises,%20I%20have%20an%20inquiry." target="_blank" class="fab-wa" title="Chat on WhatsApp">
        <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" alt="WhatsApp" style="width:35px;height:35px;">
      </a>
    </div>
    <style>
      .floating-cta {
        position: fixed;
        bottom: 25px;
        right: 25px;
        display: flex;
        flex-direction: column;
        gap: 15px;
        z-index: 9999;
      }
      .fab-wa, .fab-review {
        width: 55px;
        height: 55px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        text-decoration: none;
      }
      .fab-wa:hover, .fab-review:hover {
        transform: scale(1.15);
      }
      .fab-wa {
        background-color: #25D366;
      }
      .fab-review {
        background-color: #fff;
        border: 2px solid #fbc02d;
      }
      @media(max-width: 600px) {
        .floating-cta {
          bottom: 15px;
          right: 15px;
        }
        .fab-wa, .fab-review {
          width: 48px;
          height: 48px;
        }
        .fab-wa img {
          width: 30px !important;
          height: 30px !important;
        }
        .fab-review svg {
          width: 24px !important;
          height: 24px !important;
        }
      }
    </style>
  </footer>
`;

const servicesCSS = `
    /* SUB-NAV */
    .sub-nav-wrapper {
      background: var(--maroon);
      padding: 10px 5%;
      position: sticky;
      top: 64px;
      z-index: 990;
      border-bottom: 2px solid var(--gold);
    }
    .sub-nav {
      max-width: 1200px;
      margin: auto;
      display: flex;
      gap: 16px;
      overflow-x: auto;
      scrollbar-width: none;
    }
    .sub-nav::-webkit-scrollbar { display: none; }
    .sub-nav a {
      color: #fff;
      text-decoration: none;
      font-size: 13px;
      font-weight: 500;
      white-space: nowrap;
      padding: 6px 12px;
      border-radius: 50px;
      background: rgba(255,255,255,0.1);
      transition: all 0.2s;
    }
    .sub-nav a:hover {
      background: var(--gold);
      color: var(--maroon-dark);
    }

    /* CATEGORY SECTIONS */
    .service-category {
      padding: 80px 5%;
      background-size: cover;
      background-position: center;
      background-attachment: fixed;
      color: #fff;
    }
    .category-inner {
      max-width: 1200px;
      margin: auto;
    }
    .category-header {
      text-align: center;
      margin-bottom: 50px;
    }
    .category-header h2 {
      font-family: 'Cormorant Garamond', serif;
      font-size: 36px;
      margin-bottom: 12px;
      color: #fff;
    }
    .category-header p {
      color: rgba(255,255,255,0.8);
      font-size: 16px;
    }
    .service-card.dark {
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(10px);
    }
    .service-card.dark:hover {
      background: rgba(255, 255, 255, 0.1);
      border-color: var(--gold);
    }
    .service-card.dark h3 {
      color: #fff;
    }
    .service-card.dark .service-features li {
      color: rgba(255,255,255,0.7);
    }
    .btn-sm {
      padding: 8px 20px;
      font-size: 13px;
    }
`;

const servicesHTML = `
  <!-- QUICK LINKS SUB-NAV -->
  <div class="sub-nav-wrapper">
    <div class="sub-nav">
      <a href="#electrical">⚡ Electrical</a>
      <a href="#cctv">📹 CCTV & Surveillance</a>
      <a href="#networking">🌐 Networking</a>
      <a href="#security">🔒 Smart Security</a>
    </div>
  </div>

  <!-- ELECTRICAL SERVICES -->
  <section id="electrical" class="service-category" style="background-image: linear-gradient(rgba(61, 14, 20, 0.8), rgba(61, 14, 20, 0.95)), url('images/electrical_bg.png');">
    <div class="category-inner">
      <div class="category-header">
        <span class="label" style="border-color:var(--gold);color:var(--gold);">Power & Wiring</span>
        <h2>Electrical Solutions</h2>
        <p>Comprehensive electrical services for residential and commercial spaces.</p>
      </div>
      <div class="services-grid dark-mode">
        <div class="service-card dark">
          <div class="service-icon">🔌</div>
          <h3>House Wiring & Rewiring</h3>
          <ul class="service-features">
            <li>Concealed & Open Wiring</li>
            <li>Heavy Load Point Allocation</li>
            <li>Earth Wire Installation</li>
            <li>Fault Diagnosis & Repair</li>
          </ul>
          <a href="https://wa.me/917065815743?text=Enquiry%20for%20House%20Wiring" class="btn-primary btn-sm" style="margin-top:16px;">Enquire Now</a>
        </div>
        <div class="service-card dark">
          <div class="service-icon">💡</div>
          <h3>Interior Lights Fitting</h3>
          <ul class="service-features">
            <li>Profile & LED Strip Lights</li>
            <li>Chandelier & Pendant Lights</li>
            <li>False Ceiling Light Fitting</li>
            <li>Outdoor & Garden Lighting</li>
          </ul>
          <a href="https://wa.me/917065815743?text=Enquiry%20for%20Light%20Fitting" class="btn-primary btn-sm" style="margin-top:16px;">Enquire Now</a>
        </div>
        <div class="service-card dark">
          <div class="service-icon">⚡</div>
          <h3>MCB & Distribution Board</h3>
          <ul class="service-features">
            <li>New DB Box Installation</li>
            <li>MCB, RCCB, and Isolator Fitting</li>
            <li>Load Balancing</li>
            <li>Short Circuit Protection Setup</li>
          </ul>
          <a href="https://wa.me/917065815743?text=Enquiry%20for%20MCB%20Fitting" class="btn-primary btn-sm" style="margin-top:16px;">Enquire Now</a>
        </div>
        <div class="service-card dark">
          <div class="service-icon">🎛</div>
          <h3>Switch & Socket Fitting</h3>
          <ul class="service-features">
            <li>Modular Switchboard Fitting</li>
            <li>AC & Geyser Point Setup</li>
            <li>Faulty Switch Replacement</li>
            <li>Dimmer & Regulator Installation</li>
          </ul>
          <a href="https://wa.me/917065815743?text=Enquiry%20for%20Switch%20Fitting" class="btn-primary btn-sm" style="margin-top:16px;">Enquire Now</a>
        </div>
      </div>
    </div>
  </section>

  <!-- CCTV & SURVEILLANCE -->
  <section id="cctv" class="service-category" style="background-image: linear-gradient(rgba(26, 26, 26, 0.85), rgba(26, 26, 26, 0.98)), url('images/cctv_bg.png');">
    <div class="category-inner">
      <div class="category-header">
        <span class="label" style="border-color:var(--gold);color:var(--gold);">Surveillance</span>
        <h2>CCTV & Surveillance</h2>
        <p>Advanced camera systems and maintenance for total peace of mind.</p>
      </div>
      <div class="services-grid dark-mode">
        <div class="service-card dark">
          <div class="service-icon">📹</div>
          <h3>CCTV Installation</h3>
          <ul class="service-features">
            <li>Complete DVR & NVR Setup</li>
            <li>IP & Analog Cameras</li>
            <li>Mobile Viewing Configuration</li>
            <li>Concealed Cable Routing</li>
          </ul>
          <a href="https://wa.me/917065815743?text=Enquiry%20for%20CCTV%20Installation" class="btn-primary btn-sm" style="margin-top:16px;">Enquire Now</a>
        </div>
        <div class="service-card dark">
          <div class="service-icon">🔧</div>
          <h3>CCTV AMC Services</h3>
          <ul class="service-features">
            <li>Annual Maintenance Contracts</li>
            <li>Regular Health Checks</li>
            <li>Priority Support</li>
            <li>Firmware Updates</li>
          </ul>
          <a href="https://wa.me/917065815743?text=Enquiry%20for%20CCTV%20AMC" class="btn-primary btn-sm" style="margin-top:16px;">Enquire Now</a>
        </div>
        <div class="service-card dark">
          <div class="service-icon">🔍</div>
          <h3>Troubleshooting & Repair</h3>
          <ul class="service-features">
            <li>Video Loss Troubleshooting</li>
            <li>Camera Cleaning & Adjustment</li>
            <li>DVR/NVR Hard Drive Replacement</li>
            <li>Wiring Fault Repair</li>
          </ul>
          <a href="https://wa.me/917065815743?text=Enquiry%20for%20CCTV%20Repair" class="btn-primary btn-sm" style="margin-top:16px;">Enquire Now</a>
        </div>
      </div>
    </div>
  </section>

  <!-- NETWORKING -->
  <section id="networking" class="service-category" style="background-image: linear-gradient(rgba(61, 14, 20, 0.8), rgba(61, 14, 20, 0.95)), url('images/network_bg.png');">
    <div class="category-inner">
      <div class="category-header">
        <span class="label" style="border-color:var(--gold);color:var(--gold);">Connectivity</span>
        <h2>Networking Solutions</h2>
        <p>Reliable wired and wireless network setups for homes and offices.</p>
      </div>
      <div class="services-grid dark-mode">
        <div class="service-card dark">
          <div class="service-icon">📶</div>
          <h3>WiFi & Access Points</h3>
          <ul class="service-features">
            <li>WiFi Router Installation</li>
            <li>Access Point Installation</li>
            <li>Range Extender Setup</li>
            <li>Seamless Roaming Configuration</li>
          </ul>
          <a href="https://wa.me/917065815743?text=Enquiry%20for%20WiFi%20Setup" class="btn-primary btn-sm" style="margin-top:16px;">Enquire Now</a>
        </div>
        <div class="service-card dark">
          <div class="service-icon">🖥️</div>
          <h3>Structured Cabling</h3>
          <ul class="service-features">
            <li>LAN Cable Installation</li>
            <li>Cat6 Wiring</li>
            <li>Internet Cable Management</li>
            <li>Fiber Cable Setup</li>
          </ul>
          <a href="https://wa.me/917065815743?text=Enquiry%20for%20LAN%20Wiring" class="btn-primary btn-sm" style="margin-top:16px;">Enquire Now</a>
        </div>
        <div class="service-card dark">
          <div class="service-icon">🗄️</div>
          <h3>Network Rack Setup</h3>
          <ul class="service-features">
            <li>Server Rack Installation</li>
            <li>Patch Panel Dressing</li>
            <li>Switch Configuration</li>
            <li>Cable Labeling</li>
          </ul>
          <a href="https://wa.me/917065815743?text=Enquiry%20for%20Rack%20Setup" class="btn-primary btn-sm" style="margin-top:16px;">Enquire Now</a>
        </div>
      </div>
    </div>
  </section>

  <!-- SMART SECURITY -->
  <section id="security" class="service-category" style="background-image: linear-gradient(rgba(26, 26, 26, 0.85), rgba(26, 26, 26, 0.98)), url('images/security_bg.png');">
    <div class="category-inner">
      <div class="category-header">
        <span class="label" style="border-color:var(--gold);color:var(--gold);">Automation</span>
        <h2>Smart Security Systems</h2>
        <p>Modernize your security with smart locks, VDPs, and biometrics.</p>
      </div>
      <div class="services-grid dark-mode">
        <div class="service-card dark">
          <div class="service-icon">🚪</div>
          <h3>Video Door Phones (VDP)</h3>
          <ul class="service-features">
            <li>Video Door Phone Installation</li>
            <li>Multi-screen Display Setup</li>
            <li>Electronic Lock Integration</li>
            <li>Mobile Access Configuration</li>
          </ul>
          <a href="https://wa.me/917065815743?text=Enquiry%20for%20VDP%20Installation" class="btn-primary btn-sm" style="margin-top:16px;">Enquire Now</a>
        </div>
        <div class="service-card dark">
          <div class="service-icon">👆</div>
          <h3>Biometric & Access Control</h3>
          <ul class="service-features">
            <li>Biometric Attendance System</li>
            <li>RFID Card Reader Setup</li>
            <li>Magnetic Lock Installation</li>
            <li>Door Closer Fitting</li>
          </ul>
          <a href="https://wa.me/917065815743?text=Enquiry%20for%20Biometrics" class="btn-primary btn-sm" style="margin-top:16px;">Enquire Now</a>
        </div>
        <div class="service-card dark">
          <div class="service-icon">🔐</div>
          <h3>Smart Door Locks</h3>
          <ul class="service-features">
            <li>Smart Door Lock Installation</li>
            <li>Fingerprint/Password Lock Setup</li>
            <li>Battery & Backup Keys</li>
            <li>App Integration</li>
          </ul>
          <a href="https://wa.me/917065815743?text=Enquiry%20for%20Smart%20Locks" class="btn-primary btn-sm" style="margin-top:16px;">Enquire Now</a>
        </div>
      </div>
    </div>
  </section>
`;

files.forEach(f => {
  let filepath = path.join(dir, f);
  if (fs.existsSync(filepath)) {
    let content = fs.readFileSync(filepath, 'utf8');

    // 1. Replace Footer
    content = content.replace(/<footer>[\s\S]*?<\/footer>/, footerContent);

    // 2. Replace Nav links
    // First, let's inject the dynamic classes for active
    let specificNav = navLinks;
    specificNav = specificNav.replace('[ACTIVE_INDEX]', f === 'index.html' ? 'active' : '');
    specificNav = specificNav.replace('[ACTIVE_PRODUCTS]', f === 'products.html' ? 'active' : '');
    specificNav = specificNav.replace('[ACTIVE_SERVICES]', f === 'services.html' ? 'active' : '');
    specificNav = specificNav.replace('[ACTIVE_GALLERY]', f === 'gallery.html' ? 'active' : '');
    specificNav = specificNav.replace('[ACTIVE_ABOUT]', f === 'about.html' ? 'active' : '');
    specificNav = specificNav.replace('[ACTIVE_CONTACT]', f === 'contact.html' ? 'active' : '');
    content = content.replace(/<div class="nav-links">[\s\S]*?<\/div>/, specificNav);

    // Replace Nav CTA to link to contact form
    content = content.replace(/<div class="nav-cta">[\s\S]*?<\/div>\s*<\/div>/, navCTA + '\n  </div>');

    // Replace brand link to be relative
    content = content.replace(/<a href=".*?index\.html" class="nav-logo">/, '<a href="index.html" class="nav-logo">');

    if (f === 'services.html') {
      // 3. Inject CSS
      if (!content.includes('.sub-nav-wrapper')) {
        content = content.replace(/<\/style>/, servicesCSS + '\n  </style>');
      }
      
      // 4. Inject Content
      content = content.replace(/<!-- SERVICES GRID -->[\s\S]*?(?=<!-- CALL TO ACTION -->)/, servicesHTML);
    }

    fs.writeFileSync(filepath, content);
    console.log('Updated ' + f);
  }
});
