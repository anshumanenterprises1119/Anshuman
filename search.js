const searchIndex = [
  // Guides
  { title: "Complete House Wiring Guide", url: "house-wiring-guide.html", type: "Guide", keywords: "house wiring, wire gauge, havells, polycab, frls, mcb, rccb" },
  { title: "Complete CCTV Installation Guide", url: "cctv-installation-guide.html", type: "Guide", keywords: "cctv, camera, dvr, nvr, poe, hikvision, cp plus, security" },
  { title: "Top LED Lighting Solutions for Warehouses", url: "warehouse-led-lighting.html", type: "Guide", keywords: "led lighting, warehouse, high bay, low bay, lux, lumens, industrial" },
  { title: "Why is My MCB Tripping Continuously?", url: "mcb-tripping-solution.html", type: "Guide", keywords: "mcb, tripping, short circuit, overload, electrical fault, troubleshooting" },
  { title: "The Future of Office Access Control Systems", url: "smart-office-security.html", type: "Guide", keywords: "access control, biometric, rfid, smart lock, office security, door lock" },
  { title: "Maintaining Heavy Duty Electrical Panels", url: "industrial-panel-maintenance.html", type: "Guide", keywords: "electrical panel, maintenance, acb, mccb, thermography, industrial, switchgear" },
  { title: "How to Read Architectural Blueprints for Wiring", url: "contractor-blueprint-guide.html", type: "Guide", keywords: "blueprint, contractor, sld, single line diagram, conduit, slab, layout" },
  { title: "5 Must-Have Safety Tools for Electricians", url: "electrician-safety-tools.html", type: "Guide", keywords: "safety, tools, ppe, gloves, tester, loto, arc flash, electrician" },
  { title: "Planning CCTV Placement in Large Offices", url: "cctv-placement-guide.html", type: "Guide", keywords: "cctv placement, camera angle, blind spot, office security, wdr, lens" },
  
  // Main Pages
  { title: "Home", url: "index.html", type: "Page", keywords: "home, anshuman enterprises, greater noida" },
  { title: "Products Catalog", url: "products.html", type: "Page", keywords: "products, materials, switchgear, wires, lighting, wholesale" },
  { title: "Services", url: "services.html", type: "Page", keywords: "services, installation, contracting, maintenance, repair" },
  { title: "Knowledge Hub (Blog)", url: "blog.html", type: "Page", keywords: "blog, guides, articles, knowledge hub, tips" },
  { title: "Contact Us", url: "contact.html", type: "Page", keywords: "contact, phone, address, map, location, whatsapp" },
  { title: "About Us", url: "about.html", type: "Page", keywords: "about, company, history, mission, founder" },
  { title: "FAQ", url: "faq.html", type: "Page", keywords: "faq, questions, support, help" },
  { title: "Projects & Gallery", url: "projects.html", type: "Page", keywords: "projects, gallery, portfolio, work" },
  { title: "Brands We Trust", url: "brands.html", type: "Page", keywords: "brands, havells, polycab, l&t, hikvision, cp plus" },

  // Products/Services
  { title: "Biometric Access Control", url: "biometrics-access-control.html", type: "Service", keywords: "biometric, access control, fingerprint, attendance" },
  { title: "CCTV Installation Services", url: "cctv-installation.html", type: "Service", keywords: "cctv installation, security cameras, setup" },
  { title: "Commercial Electrical Work", url: "commercial-electrical.html", type: "Service", keywords: "commercial, electrical, office, building" },
  { title: "Conduit Pipes & Fittings", url: "conduit-pipes.html", type: "Product", keywords: "conduit, pipes, pvc, fittings" },
  { title: "Distribution Boards (DB)", url: "distribution-boards.html", type: "Product", keywords: "distribution board, db, mcb box" },
  { title: "Electrical Contracting", url: "electrical-contracting.html", type: "Service", keywords: "electrical contracting, projects, large scale" },
  { title: "Electrical Maintenance", url: "electrical-maintenance.html", type: "Service", keywords: "electrical maintenance, amc, repair" },
  { title: "Interior Lighting", url: "interior-lighting.html", type: "Product", keywords: "interior lighting, decorative, lights" },
  { title: "LED Lighting", url: "led-lighting.html", type: "Product", keywords: "led lighting, bulbs, panels, commercial" },
  { title: "Modular Switches", url: "modular-switches.html", type: "Product", keywords: "modular switches, sockets, plates, anchor" },
  { title: "Network Rack Setup", url: "network-rack-setup.html", type: "Service", keywords: "network rack, server room, patch panel" },
  { title: "Smart Door Locks", url: "smart-door-locks.html", type: "Product", keywords: "smart lock, digital lock, keyless" },
  { title: "Society Electrical Works", url: "society-electrical.html", type: "Service", keywords: "society, residential complex, electrical" },
  { title: "Structured Cabling", url: "structured-cabling.html", type: "Service", keywords: "structured cabling, lan, networking, cat6" },
  { title: "Video Door Phones", url: "video-door-phones.html", type: "Product", keywords: "video door phone, vdp, intercom" },
  { title: "WiFi Access Points", url: "wifi-access-points.html", type: "Product", keywords: "wifi, access point, wireless, networking" },
  { title: "Wires & Cables", url: "wires-cables.html", type: "Product", keywords: "wires, cables, frls, polycab, havells" }
];

document.addEventListener("DOMContentLoaded", () => {
  // Inject Search UI Styles
  const style = document.createElement('style');
  style.textContent = `
    #global-search-btn {
      background: none; border: none; color: #fff; font-size: 20px; cursor: pointer; padding: 5px; margin-left: 15px; transition: color 0.3s;
    }
    #global-search-btn:hover { color: #c9a84c; }
    
    #global-search-modal {
      position: fixed; top: 0; left: 0; width: 100%; height: 100vh; background: rgba(0,0,0,0.8); backdrop-filter: blur(5px);
      z-index: 10000; display: none; opacity: 0; transition: opacity 0.3s ease; justify-content: center; align-items: flex-start; padding-top: 100px;
    }
    .search-modal-content {
      width: 90%; max-width: 700px; background: #fff; border-radius: 16px; overflow: hidden; box-shadow: 0 20px 60px rgba(0,0,0,0.4);
      transform: translateY(-20px); transition: transform 0.3s ease;
    }
    .search-modal-header {
      display: flex; align-items: center; padding: 20px 25px; border-bottom: 1px solid #eee;
    }
    .search-modal-header input {
      flex: 1; border: none; outline: none; font-size: 20px; font-family: 'Inter', sans-serif; padding-left: 15px;
    }
    .search-modal-close {
      background: none; border: none; font-size: 28px; color: #888; cursor: pointer; line-height: 1;
    }
    .search-results {
      max-height: 400px; overflow-y: auto; padding: 10px 0;
    }
    .search-result-item {
      display: flex; align-items: center; padding: 15px 25px; text-decoration: none; border-bottom: 1px solid #f5f5f5; transition: background 0.2s;
    }
    .search-result-item:hover { background: #faf7f2; }
    .search-result-info { flex: 1; }
    .search-result-title { font-size: 16px; color: #3d0e14; font-weight: 600; margin-bottom: 4px; font-family: 'Poppins', sans-serif; }
    .search-result-url { font-size: 13px; color: #8a7a7a; }
    .search-result-type { font-size: 12px; background: #3d0e14; color: #c9a84c; padding: 3px 10px; border-radius: 20px; font-weight: 600; }
    .search-no-results { padding: 30px; text-align: center; color: #888; font-size: 16px; display: none; }
    
    @media(max-width: 768px) {
      #global-search-modal { padding-top: 50px; }
      .search-modal-content { width: 95%; }
    }
  `;
  document.head.appendChild(style);

  // Inject Search Button into Nav
  const navInner = document.querySelector('.nav-inner');
  if (navInner) {
    const searchBtn = document.createElement('button');
    searchBtn.id = 'global-search-btn';
    searchBtn.innerHTML = '&#128269;'; // Magnifying glass icon
    // Insert before the mobile menu button if it exists, otherwise append
    const mobileBtn = document.getElementById('mobile-menu-btn');
    if (mobileBtn) {
      navInner.insertBefore(searchBtn, mobileBtn);
    } else {
      navInner.appendChild(searchBtn);
    }
  }

  // Inject Search Modal into Body
  const modalHTML = `
    <div id="global-search-modal">
      <div class="search-modal-content">
        <div class="search-modal-header">
          <span style="font-size: 24px; color: #888;">&#128269;</span>
          <input type="text" id="global-search-input" placeholder="Search for wiring, CCTV, products..." autocomplete="off">
          <button class="search-modal-close" id="global-search-close">&times;</button>
        </div>
        <div class="search-results" id="global-search-results"></div>
        <div class="search-no-results" id="global-search-empty">No results found for your query.</div>
      </div>
    </div>
  `;
  document.body.insertAdjacentHTML('beforeend', modalHTML);

  const modal = document.getElementById('global-search-modal');
  const modalContent = document.querySelector('.search-modal-content');
  const searchInput = document.getElementById('global-search-input');
  const resultsContainer = document.getElementById('global-search-results');
  const emptyState = document.getElementById('global-search-empty');
  const searchBtn = document.getElementById('global-search-btn');
  const closeBtn = document.getElementById('global-search-close');

  function openSearch() {
    modal.style.display = 'flex';
    setTimeout(() => {
      modal.style.opacity = '1';
      modalContent.style.transform = 'translateY(0)';
      searchInput.focus();
    }, 10);
    document.body.style.overflow = 'hidden';
  }

  function closeSearch() {
    modal.style.opacity = '0';
    modalContent.style.transform = 'translateY(-20px)';
    setTimeout(() => {
      modal.style.display = 'none';
      searchInput.value = '';
      resultsContainer.innerHTML = '';
      emptyState.style.display = 'none';
    }, 300);
    document.body.style.overflow = 'auto';
  }

  if (searchBtn) searchBtn.addEventListener('click', openSearch);
  closeBtn.addEventListener('click', closeSearch);
  modal.addEventListener('click', (e) => { if (e.target === modal) closeSearch(); });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.style.display === 'flex') closeSearch();
  });

  searchInput.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase().trim();
    resultsContainer.innerHTML = '';
    
    if (query.length < 2) {
      emptyState.style.display = 'none';
      return;
    }

    const results = searchIndex.filter(item => 
      item.title.toLowerCase().includes(query) || 
      item.keywords.toLowerCase().includes(query)
    );

    if (results.length === 0) {
      emptyState.style.display = 'block';
    } else {
      emptyState.style.display = 'none';
      results.forEach(item => {
        const a = document.createElement('a');
        a.href = item.url;
        a.className = 'search-result-item';
        a.innerHTML = `
          <div class="search-result-info">
            <div class="search-result-title">${item.title}</div>
            <div class="search-result-url">${item.url}</div>
          </div>
          <div class="search-result-type">${item.type}</div>
        `;
        resultsContainer.appendChild(a);
      });
    }
  });

  // Global exposure for external inputs (like blog hero search)
  window.openGlobalSearch = function(initialQuery = '') {
    openSearch();
    if(initialQuery) {
      searchInput.value = initialQuery;
      searchInput.dispatchEvent(new Event('input'));
    }
  }
});
