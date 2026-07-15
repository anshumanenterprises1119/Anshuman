const fs = require('fs');
const path = require('path');

const dir = 'd:\\Downloads\\ANSHU';
const productsFilePath = path.join(dir, 'products.html');

console.log("====================================================");
console.log("  ANSHUMAN ENTERPRISES - CATALOG RESTRUCTURING UTILITY");
console.log("====================================================");
console.log("");

if (!fs.existsSync(productsFilePath)) {
  console.error("[ERROR] products.html not found!");
  process.exit(1);
}

let content = fs.readFileSync(productsFilePath, 'utf8');

// 1. ADD CSS STYLES FOR THE SPLIT LAYOUT, TABLE VIEW, AND QUOTE CART
const customStyles = `
    /* ──€─€ B2B CATALOG SIDEBAR & TABLE STYLES ──€─€ */
    .catalog-split-wrapper {
      display: flex;
      gap: 32px;
      margin-top: 30px;
      align-items: flex-start;
    }
    .catalog-sidebar {
      width: 280px;
      flex-shrink: 0;
      background: #faf7f2;
      border: 1px solid rgba(107,28,35,0.12);
      border-radius: 16px;
      padding: 24px;
      position: sticky;
      top: 90px;
      box-shadow: 0 4px 20px rgba(61,14,20,0.03);
    }
    .catalog-main-content {
      flex-grow: 1;
    }
    .filter-group {
      margin-bottom: 24px;
      border-bottom: 1px solid rgba(107,28,35,0.08);
      padding-bottom: 18px;
    }
    .filter-group:last-child {
      border-bottom: none;
      margin-bottom: 0;
      padding-bottom: 0;
    }
    .filter-group-title {
      font-family: 'DM Sans', sans-serif;
      font-size: 14px;
      font-weight: 700;
      color: var(--maroon-dark);
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 12px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .filter-option {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 8px;
      font-size: 13.5px;
      color: var(--text-mid);
      cursor: pointer;
      user-select: none;
    }
    .filter-option input[type="checkbox"] {
      accent-color: var(--maroon);
      width: 16px;
      height: 16px;
      cursor: pointer;
    }
    
    /* Toolbar Controls */
    .catalog-toolbar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
      flex-wrap: wrap;
      gap: 16px;
    }
    .catalog-search-wrap {
      position: relative;
      flex-grow: 1;
      max-width: 480px;
    }
    .catalog-search-input {
      width: 100%;
      padding: 12px 16px 12px 42px;
      border: 1px solid var(--border);
      border-radius: 50px;
      font-size: 14px;
      font-family: 'DM Sans', sans-serif;
      background: #fff;
      color: var(--text);
      outline: none;
      transition: all 0.2s;
    }
    .catalog-search-input:focus {
      border-color: var(--maroon);
      box-shadow: 0 0 0 3px rgba(107,28,35,0.08);
    }
    .catalog-search-icon {
      position: absolute;
      left: 16px;
      top: 50%;
      transform: translateY(-50%);
      color: var(--text-light);
      pointer-events: none;
    }
    .view-toggles {
      display: flex;
      gap: 8px;
    }
    .view-toggle-btn {
      background: #fff;
      border: 1px solid var(--border);
      border-radius: 8px;
      padding: 8px 12px;
      font-size: 13px;
      font-weight: 600;
      color: var(--text-mid);
      cursor: pointer;
      transition: all 0.2s;
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .view-toggle-btn.active {
      background: var(--maroon-dark);
      border-color: var(--maroon-dark);
      color: #fff;
    }
    
    /* Compact Table Styles */
    .catalog-table-container {
      background: #fff;
      border: 1px solid var(--border);
      border-radius: 12px;
      overflow-x: auto;
      box-shadow: var(--shadow-sm);
    }
    .catalog-table {
      width: 100%;
      border-collapse: collapse;
      text-align: left;
      font-size: 13.5px;
    }
    .catalog-table th {
      background: #faf7f2;
      color: var(--maroon-dark);
      font-weight: 700;
      padding: 14px 18px;
      border-bottom: 2px solid var(--border);
      font-family: 'DM Sans', sans-serif;
      text-transform: uppercase;
      font-size: 11px;
      letter-spacing: 0.5px;
    }
    .catalog-table td {
      padding: 14px 18px;
      border-bottom: 1px solid var(--border);
      vertical-align: middle;
      color: var(--text-mid);
    }
    .catalog-table tr:last-child td {
      border-bottom: none;
    }
    .catalog-table tr:hover td {
      background: rgba(201,168,76,0.03);
    }
    
    /* B2B Quote Cart floating widget */
    .floating-quote-badge {
      position: fixed;
      bottom: 30px;
      right: 30px;
      background: var(--maroon-dark);
      color: #fff;
      border-radius: 50px;
      padding: 14px 28px;
      display: flex;
      align-items: center;
      gap: 12px;
      box-shadow: var(--shadow-lg);
      cursor: pointer;
      z-index: 9999;
      transition: all 0.3s cubic-bezier(0.2, 0.8, 0.2, 1);
      border: 1px solid rgba(201,168,76,0.3);
      font-family: 'DM Sans', sans-serif;
      font-weight: 700;
      font-size: 14px;
      letter-spacing: 0.5px;
    }
    .floating-quote-badge:hover {
      transform: translateY(-4px) scale(1.02);
      box-shadow: 0 12px 40px rgba(61,14,20,0.3);
      border-color: var(--gold-light);
    }
    .quote-cart-panel {
      position: fixed;
      bottom: 95px;
      right: 30px;
      width: 380px;
      max-width: calc(100vw - 60px);
      max-height: 520px;
      background: #fff;
      border-radius: 16px;
      border: 1px solid var(--border);
      box-shadow: var(--shadow-lg);
      z-index: 9999;
      display: none;
      flex-direction: column;
      overflow: hidden;
      transition: all 0.3s ease;
    }
    .quote-cart-header {
      background: var(--maroon-dark);
      color: #fff;
      padding: 16px 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .quote-cart-header h3 {
      font-family: 'Cormorant Garamond', serif;
      font-size: 20px;
      color: var(--gold-light);
      margin: 0;
    }
    .quote-cart-items-list {
      padding: 16px;
      overflow-y: auto;
      flex-grow: 1;
      max-height: 320px;
    }
    .quote-cart-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-bottom: 12px;
      margin-bottom: 12px;
      border-bottom: 1px solid rgba(107,28,35,0.06);
    }
    .quote-cart-item-info {
      flex-grow: 1;
      padding-right: 12px;
    }
    .quote-cart-item-name {
      font-size: 13px;
      font-weight: 700;
      color: var(--maroon-dark);
      margin-bottom: 2px;
    }
    .quote-cart-item-desc {
      font-size: 11px;
      color: var(--text-light);
    }
    .quote-cart-item-qty {
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .quote-cart-qty-btn {
      width: 22px;
      height: 22px;
      border-radius: 50%;
      border: 1px solid var(--border);
      background: #fff;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      color: var(--maroon);
    }
    .quote-cart-qty-val {
      font-size: 13px;
      font-weight: 600;
      min-width: 20px;
      text-align: center;
    }
    .quote-cart-item-remove {
      color: #d62027;
      cursor: pointer;
      font-size: 16px;
      margin-left: 8px;
    }
    .quote-cart-footer {
      padding: 16px 20px;
      background: #faf7f2;
      border-top: 1px solid var(--border);
    }
    .btn-send-rfq-whatsapp {
      background: #25D366;
      color: #fff;
      text-decoration: none;
      width: 100%;
      padding: 12px;
      border-radius: 8px;
      font-weight: 700;
      font-size: 14px;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      box-shadow: 0 4px 12px rgba(37,211,102,0.25);
      border: none;
      cursor: pointer;
    }
    .btn-send-rfq-whatsapp:hover {
      background: #20ba5a;
    }
    
    .btn-card-rfq {
      background: var(--cream-dark);
      border: 1px solid var(--border);
      color: var(--maroon-dark);
      font-weight: 700;
      font-size: 12.5px;
      padding: 8px 12px;
      border-radius: 6px;
      cursor: pointer;
      transition: all 0.2s;
    }
    .btn-card-rfq:hover {
      background: var(--maroon-dark);
      color: #fff;
      border-color: var(--maroon-dark);
    }
    
    @media (max-width: 991px) {
      .catalog-split-wrapper {
        flex-direction: column;
      }
      .catalog-sidebar {
        width: 100%;
        position: relative;
        top: 0;
        margin-bottom: 24px;
      }
    }
`;

// Insert the custom CSS styles inside the main `<style>` tag in products.html
const styleInsertionTarget = `    /* ─€─€ STANDARDIZED PRODUCT CARDS ─€─€ */`;
if (content.includes(styleInsertionTarget)) {
  content = content.replace(styleInsertionTarget, customStyles + `\n` + styleInsertionTarget);
  console.log("[OK] Integrated B2B styles inside <style> block.");
} else {
  console.error("[ERROR] Style target not found!");
  process.exit(1);
}

// 2. REPLACE THE UNIFIED FILTERED RESULTS HTML WITH THE SIDEBAR + MAIN AREA SPLIT LAYOUT
const oldSectionHtml = `<section class="section" id="filtered-products-section" style="display: none; background: var(--cream); padding: 80px 5%; border-bottom: 1px solid var(--border);">
  <div class="section-inner" style="max-width: 1200px; margin: auto;">
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 40px; border-bottom: 2px solid var(--border); padding-bottom: 20px; flex-wrap: wrap; gap: 16px;">
      <div>
        <span class="section-label" style="margin-bottom: 8px;">Filtered Results</span>
        <h2 id="filtered-section-title" style="font-family: 'Cormorant Garamond', serif; font-size: 32px; font-weight: 700; color: var(--maroon-dark);">Filtered Products</h2>
      </div>
      <button onclick="resetFilter()" style="background: var(--maroon-dark); color: #fff; border: 2px solid var(--maroon-dark); padding: 10px 24px; border-radius: 50px; font-size: 13px; font-weight: 700; cursor: pointer; transition: all 0.2s; box-shadow: var(--shadow-sm);" onmouseover="this.style.background='var(--maroon-mid)';this.style.borderColor='var(--maroon-mid)'" onmouseout="this.style.background='var(--maroon-dark)';this.style.borderColor='var(--maroon-dark)'">Reset Filters & Show All</button>
    </div>
    
    <div class="category-products-grid" id="grid-filtered">
      <!-- Filtered products dynamically rendered here -->
    </div>
  </div>
</section>`;

const newSectionHtml = `<section class="section" id="filtered-products-section" style="display: none; background: var(--cream); padding: 60px 5%; border-bottom: 1px solid var(--border);">
  <div class="section-inner" style="max-width: 1200px; margin: auto;">
    
    <div class="catalog-split-wrapper">
      
      <!-- Sticky Sidebar Filters -->
      <aside class="catalog-sidebar">
        <div class="filter-group">
          <div class="filter-group-title">Filter by Category</div>
          <div id="sidebar-categories">
            <!-- Rendered dynamically -->
          </div>
        </div>
        
        <div class="filter-group">
          <div class="filter-group-title">Filter by Brand</div>
          <div id="sidebar-brands">
            <!-- Rendered dynamically -->
          </div>
        </div>
        
        <button onclick="resetFilter()" style="background: var(--maroon-dark); color: #fff; width: 100%; border: none; padding: 12px; border-radius: 8px; font-size: 13px; font-weight: 700; cursor: pointer; transition: all 0.2s; margin-top: 10px;">Clear All Filters</button>
      </aside>
      
      <!-- Main Content Area -->
      <div class="catalog-main-content">
        
        <!-- Toolbar with Search and View Toggles -->
        <div class="catalog-toolbar">
          <div class="catalog-search-wrap">
            <span class="material-symbols-outlined catalog-search-icon">search</span>
            <input type="text" id="catalog-search-bar" placeholder="Search wires, switches, blades, MCB panels..." class="catalog-search-input" oninput="handleSearch(this.value)" />
          </div>
          
          <div class="view-toggles">
            <button onclick="setCatalogView('grid')" id="btn-view-grid" class="view-toggle-btn active">
              <span class="material-symbols-outlined" style="font-size:18px;">grid_view</span> Grid
            </button>
            <button onclick="setCatalogView('table')" id="btn-view-table" class="view-toggle-btn">
              <span class="material-symbols-outlined" style="font-size:18px;">table_rows</span> Table
            </button>
          </div>
        </div>
        
        <div style="margin-bottom: 20px;">
          <span class="section-label" style="margin-bottom: 4px;">Sourcing Catalog</span>
          <h2 id="filtered-section-title" style="font-family: 'Cormorant Garamond', serif; font-size: 28px; font-weight: 700; color: var(--maroon-dark);">Filtered Products</h2>
        </div>
        
        <!-- Grid View container -->
        <div class="category-products-grid" id="grid-filtered" style="margin-top: 0; padding: 0;">
          <!-- Rendered dynamically -->
        </div>
        
        <!-- Table View container -->
        <div class="catalog-table-container" id="table-filtered" style="display: none;">
          <table class="catalog-table">
            <thead>
              <tr>
                <th>Brand</th>
                <th>Product Description</th>
                <th>Specifications</th>
                <th>Wholesale Unit Price</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody id="table-filtered-body">
              <!-- Rendered dynamically -->
            </tbody>
          </table>
        </div>
        
      </div>
      
    </div>
  </div>
</section>`;

if (content.includes(oldSectionHtml)) {
  content = content.replace(oldSectionHtml, newSectionHtml);
  console.log("[OK] Updated HTML filtered-products-section to Split Sidebar layout.");
} else if (content.includes(oldSectionHtml.replace(/\n/g, '\r\n'))) {
  content = content.replace(oldSectionHtml.replace(/\n/g, '\r\n'), newSectionHtml.replace(/\n/g, '\r\n'));
  console.log("[OK] Updated HTML filtered-products-section (CRLF format) to Split Sidebar layout.");
} else {
  console.warn("[WARN] Could not match exact old section HTML. Performing regex replacement...");
  // Regex fallback
  content = content.replace(/<section class="section" id="filtered-products-section"[\s\S]*?<\/section>/, newSectionHtml);
}

// 3. APPEND FLOATING RFQ BASKET / QUOTE CART HTML AND DETAILED SPECDRAWER
const quoteCartHtml = `
  <!-- FLOATING RFQ CART WIDGET -->
  <div id="quote-cart-badge" class="floating-quote-badge" style="display: none;" onclick="toggleQuoteCartPanel()">
    <span class="material-symbols-outlined">request_quote</span>
    <span>RFQ List (<span id="quote-cart-count">0</span>)</span>
  </div>
  
  <div id="quote-cart-panel" class="quote-cart-panel">
    <div class="quote-cart-header">
      <h3>Request for Quote (RFQ)</h3>
      <button onclick="toggleQuoteCartPanel()" style="background:none; border:none; color:#fff; font-size:24px; cursor:pointer;">&times;</button>
    </div>
    <div class="quote-cart-items-list" id="quote-cart-items-container">
      <!-- Items dynamically added here -->
    </div>
    <div class="quote-cart-footer">
      <button class="btn-send-rfq-whatsapp" onclick="sendRfqToWhatsapp()">
        <svg viewBox="0 0 24 24" width="18" height="18" style="fill: currentColor;"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.727-1.458L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.42 9.864-9.864.002-2.637-1.03-5.114-2.905-6.99C16.458 1.875 13.985 1.83 11.35 1.83 5.91 1.83 1.488 6.252 1.484 11.696c-.001 1.702.46 3.36 1.332 4.793l-.991 3.616 3.708-.973.114.068zm9.19-7.98c-.282-.141-1.67-.824-1.929-.918-.258-.094-.446-.141-.635.141-.188.281-.728.918-.892 1.106-.164.188-.328.211-.61.07-2.227-1.115-3.666-2.036-5.02-4.36-.188-.318.188-.295.539-.993.113-.223.056-.417-.028-.582-.085-.164-.636-1.532-.871-2.1-.23-.55-.465-.475-.635-.483-.16-.007-.348-.008-.536-.008-.188 0-.493.07-.752.352-.259.282-.99 1.071-.99 2.612 0 1.54 1.129 3.029 1.282 3.24.153.211 2.221 3.391 5.378 4.754.752.325 1.337.518 1.794.663.755.24 1.442.206 1.986.125.606-.09 1.67-.682 1.905-1.34.235-.658.235-1.22.164-1.34-.07-.12-.258-.188-.54-.329z"/></svg>
        <span>Send Quote List to WhatsApp</span>
      </button>
    </div>
  </div>
`;

content = content.split('</body>').join(quoteCartHtml + '\n</body>');
console.log("[OK] Appended Floating RFQ Quote Cart HTML to body.");

// 4. OVERWRITE JAVASCRIPT STATE CONTROLLER WITH REFACTORED B2B SIDEBAR, SEARCH AND CART LOGIC
// Let's locate where the initDynamicCatalog is defined to insert our upgraded rendering scripts.
// We will view lines 3901 to 3950 first. We did this earlier, let's look at the replacement logic:
const originalJsLogic = `  // INITIALIZE DYNAMIC CATALOG
  function initDynamicCatalog() {
    renderAllDefaultGrids();
  }

  // RENDER DOCK GRIDS (DEFAULT VIEW)
  function renderAllDefaultGrids() {
    const categories = ["lighting", "wires", "switches", "cctv", "mcb", "conduit", "hardware"];
    categories.forEach(cat => {
      const grid = document.getElementById(\`grid-\${cat}\`);
      if (grid) {
        const filteredList = productsData.filter(p => p.category === cat);
        grid.innerHTML = generateProductsHtml(filteredList);
        grid.style.display = "grid"; // Ensure it is shown
      }
    });
  }

  // GENERATE HTML CARDS STRING
  function generateProductsHtml(list) {
    if (list.length === 0) {
      return \`
        <div style="grid-column: 1/-1; text-align: center; padding: 40px; color: var(--text-light); font-size: 14px;">
          No matching products found. Please request a quote for direct sourcing.
        </div>
      \`;
    }
    return list.map(prod => {
      const brandTags = prod.brands.map(b => \`<span class="prod-card-brand-tag">\${b}</span>\`).join('');
      const firstSpecKey = Object.keys(prod.specs)[0] || '';
      const firstSpecVal = prod.specs[firstSpecKey] || '';
      const secondSpecKey = Object.keys(prod.specs)[1] || '';
      const secondSpecVal = prod.specs[secondSpecKey] || '';
      
      return \`
        <div class="prod-static-card">
          <span class="prod-card-badge">\${prod.badge}</span>
          <div class="prod-card-img-wrap">
            <img class="prod-card-img" src="\${prod.image}" alt="\${prod.title}" onerror="this.src='images/gallery/pvc-conduit-pipes-fittings.webp';">
          </div>
          <div class="prod-card-brand-tags">\${brandTags}</div>
          <h4 class="prod-card-title">\${prod.title}</h4>
          <p class="prod-card-desc">\${prod.desc}</p>
          
          <ul class="prod-card-specs">
            \${firstSpecKey ? \`<li><span>\${firstSpecKey}:</span> <span>\${firstSpecVal}</span></li>\` : ''}
            \${secondSpecKey ? \`<li><span>\${secondSpecKey}:</span> <span>\${secondSpecVal}</span></li>\` : ''}
          </ul>
          
          <div class="prod-card-footer">`;

// Let's replace the script logic inside products.html
const upgradedJsLogic = `  // B2B CATALOG STATE VARIABLES
  let catalogViewMode = 'grid'; // 'grid' or 'table'
  let catalogSearchQuery = '';
  let selectedCategoryFilter = 'All';
  let selectedBrandFilter = 'All';
  let rfqCart = {}; // key: prod.id, value: { prod, quantity }

  // INITIALIZE DYNAMIC CATALOG WITH UPGRADED SIDEBAR & CART
  function initDynamicCatalog() {
    renderAllDefaultGrids();
    renderSidebarFilters();
    syncCartUi();
  }

  // RENDER DOCK GRIDS (DEFAULT VIEW)
  function renderAllDefaultGrids() {
    const categories = ["lighting", "wires", "switches", "cctv", "mcb", "conduit", "hardware"];
    categories.forEach(cat => {
      const grid = document.getElementById(\`grid-\${cat}\`);
      if (grid) {
        const filteredList = productsData.filter(p => p.category === cat);
        grid.innerHTML = generateProductsHtml(filteredList);
        grid.style.display = "grid"; // Ensure it is shown
      }
    });
  }

  // RENDER SIDEBAR FILTER CONTROLS DYNAMICALLY
  function renderSidebarFilters() {
    // Generate Categories Filter Checkboxes
    const sidebarCats = document.getElementById("sidebar-categories");
    const uniqueCategories = ['All', ...new Set(productsData.map(p => p.category))];
    
    const categoryLabels = {
      All: 'All Categories',
      lighting: '💡 Lighting',
      wires: '⚡ Wires & Cables',
      switches: '💠 Modular Switches',
      cctv: '📹 CCTV & Security',
      mcb: '🛡️ MCB & DB Panels',
      conduit: '🧰 PVC & Conduits',
      hardware: '🔧 Hardware & Tools'
    };

    sidebarCats.innerHTML = uniqueCategories.map(cat => {
      const isChecked = selectedCategoryFilter === cat ? 'checked' : '';
      return \`
        <label class="filter-option">
          <input type="radio" name="filter-cat" value="\${cat}" \${isChecked} onchange="setCategoryFilter('\${cat}')" style="accent-color:var(--maroon);" />
          <span>\${categoryLabels[cat] || cat}</span>
        </label>
      \`;
    }).join('');

    // Generate Brand Filter Checkboxes
    const sidebarBrands = document.getElementById("sidebar-brands");
    const allBrands = [];
    productsData.forEach(p => p.brands.forEach(b => allBrands.push(b)));
    const uniqueBrands = ['All', ...new Set(allBrands)];

    sidebarBrands.innerHTML = uniqueBrands.map(brand => {
      const isChecked = selectedBrandFilter === brand ? 'checked' : '';
      return \`
        <label class="filter-option">
          <input type="radio" name="filter-brand" value="\${brand}" \${isChecked} onchange="setBrandFilter('\${brand}')" style="accent-color:var(--maroon);" />
          <span>\${brand}</span>
        </label>
      \`;
    }).join('');
  }

  // SET CATEGORY FILTER
  window.setCategoryFilter = function(cat) {
    selectedCategoryFilter = cat;
    applyDynamicFiltering();
  };

  // SET BRAND FILTER
  window.setBrandFilter = function(brand) {
    selectedBrandFilter = brand;
    applyDynamicFiltering();
  };

  // HANDLE SEARCH BAR INPUT
  window.handleSearch = function(query) {
    catalogSearchQuery = query.toLowerCase().trim();
    applyDynamicFiltering();
  };

  // RESET ALL FILTERS
  window.resetFilter = function() {
    selectedCategoryFilter = 'All';
    selectedBrandFilter = 'All';
    catalogSearchQuery = '';
    
    // Reset search inputs
    const searchBar = document.getElementById("catalog-search-bar");
    if (searchBar) searchBar.value = '';
    
    renderSidebarFilters();
    applyDynamicFiltering();
  };

  // APPLY FILTERS & SEARCH DYNAMICALLY
  window.applyDynamicFiltering = function() {
    let filtered = productsData;

    // Filter by Category
    if (selectedCategoryFilter !== 'All') {
      filtered = filtered.filter(p => p.category === selectedCategoryFilter);
    }

    // Filter by Brand
    if (selectedBrandFilter !== 'All') {
      filtered = filtered.filter(p => p.brands.includes(selectedBrandFilter));
    }

    // Filter by Search Query
    if (catalogSearchQuery) {
      filtered = filtered.filter(p => 
        p.title.toLowerCase().includes(catalogSearchQuery) || 
        p.desc.toLowerCase().includes(catalogSearchQuery) || 
        p.subcategory.toLowerCase().includes(catalogSearchQuery) || 
        p.brands.some(b => b.toLowerCase().includes(catalogSearchQuery))
      );
    }

    // Render Filtered Results
    renderFilteredResults(filtered);
  };

  // RENDER DYNAMIC FILTERED RESULTS (GRID OR TABLE)
  function renderFilteredResults(list) {
    const gridContainer = document.getElementById("grid-filtered");
    const tableContainer = document.getElementById("table-filtered");
    const tableBody = document.getElementById("table-filtered-body");
    const filteredSection = document.getElementById("filtered-products-section");

    // Make section visible
    filteredSection.style.display = "block";
    document.getElementById("filtered-section-title").textContent = 
      selectedCategoryFilter === 'All' ? 'All Sourcing Catalog' : \`Catalog · \${selectedCategoryFilter.toUpperCase()}\`;

    if (catalogViewMode === 'grid') {
      gridContainer.style.display = "grid";
      tableContainer.style.display = "none";
      gridContainer.innerHTML = generateProductsHtml(list);
    } else {
      gridContainer.style.display = "none";
      tableContainer.style.display = "block";
      tableBody.innerHTML = generateProductsTableHtml(list);
    }
  }

  // GENERATE HTML CARDS STRING (GRID VIEW)
  function generateProductsHtml(list) {
    if (list.length === 0) {
      return \`
        <div style="grid-column: 1/-1; text-align: center; padding: 40px; color: var(--text-light); font-size: 14px;">
          No matching products found. Adjust filters or search terms.
        </div>
      \`;
    }
    return list.map(prod => {
      const brandTags = prod.brands.map(b => \`<span class="prod-card-brand-tag">\${b}</span>\`).join('');
      const firstSpecKey = Object.keys(prod.specs)[0] || '';
      const firstSpecVal = prod.specs[firstSpecKey] || '';
      const secondSpecKey = Object.keys(prod.specs)[1] || '';
      const secondSpecVal = prod.specs[secondSpecKey] || '';
      
      const inCart = rfqCart[prod.id] ? 'In RFQ List' : 'Add to RFQ';
      const btnClass = rfqCart[prod.id] ? 'btn-card-rfq' : 'btn-card-rfq';
      const btnStyle = rfqCart[prod.id] ? 'background:var(--maroon-dark); color:#fff;' : '';

      return \`
        <div class="prod-static-card">
          <span class="prod-card-badge">\${prod.badge}</span>
          <div class="prod-card-img-wrap">
            <img class="prod-card-img" src="\${prod.image}" alt="\${prod.title}" onerror="this.style.display='none'; this.nextElementSibling.style.display='inline-block';">
            <span style="display:none; font-family:'DM Sans', sans-serif; font-weight:800; font-size:15px; color:var(--maroon-mid); text-transform:uppercase;">\${prod.title.split(' ')[0]}</span>
          </div>
          <div class="prod-card-brand-tags">\${brandTags}</div>
          <h4 class="prod-card-title" style="min-height: 48px;">\${prod.title}</h4>
          <p class="prod-card-desc" style="min-height: 60px; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; margin-bottom: 12px;">\${prod.desc}</p>
          
          <ul class="prod-card-specs" style="margin-bottom: 18px;">
            \${firstSpecKey ? \`<li><span>\${firstSpecKey}:</span> <span>\${firstSpecVal}</span></li>\` : ''}
            \${secondSpecKey ? \`<li><span>\${secondSpecKey}:</span> <span>\${secondSpecVal}</span></li>\` : ''}
          </ul>
          
          <div class="prod-card-footer" style="margin-top: auto;">
            <div class="prod-card-price-row" style="margin-bottom: 12px;">
              <span class="prod-card-price-label">Wholesale Price</span>
              <span class="prod-card-price-val" style="color:var(--maroon); font-weight:700;">\${prod.price}</span>
            </div>
            <div style="display:grid; grid-template-columns: 1fr 1fr; gap: 8px;">
              <button onclick="addToRfq('\${prod.id}')" id="btn-rfq-\${prod.id}" class="\${btnClass}" style="\${btnStyle}">\${inCart}</button>
              <button onclick="openProductDetailsModal('\${prod.id}')" class="btn-card-view">Specs</button>
            </div>
          </div>
        </div>
      \`;
    }).join('');
  }

  // GENERATE COMPACT TABLE HTML ROW STRING (TABLE VIEW)
  function generateProductsTableHtml(list) {
    if (list.length === 0) {
      return \`
        <tr>
          <td colspan="5" style="text-align: center; padding: 40px; color: var(--text-light);">
            No matching products found. Adjust filters or search terms.
          </td>
        </tr>
      \`;
    }
    return list.map(prod => {
      const brandTags = prod.brands.map(b => \`<span class="prod-card-brand-tag" style="margin-right:4px;">\${b}</span>\`).join('');
      const specList = Object.entries(prod.specs).map(([k, v]) => \`\${k}: \${v}\`).join(' | ');
      
      const inCart = rfqCart[prod.id] ? 'In RFQ' : 'Add RFQ';
      const btnStyle = rfqCart[prod.id] ? 'background:var(--maroon-dark); color:#fff; border-color:var(--maroon-dark);' : '';

      return \`
        <tr>
          <td>\${brandTags}</td>
          <td>
            <div style="font-weight: 700; color: var(--maroon-dark);">\${prod.title}</div>
            <div style="font-size: 11.5px; color: var(--text-light); margin-top: 4px;">\${prod.desc}</div>
          </td>
          <td style="font-size: 12px; max-width: 320px; word-break: break-word;">\${specList}</td>
          <td style="font-weight: 700; color: var(--maroon);">\${prod.price}</td>
          <td>
            <div style="display: flex; gap: 6px;">
              <button onclick="addToRfq('\${prod.id}')" id="btn-tbl-rfq-\${prod.id}" class="btn-card-rfq" style="padding: 6px 10px; font-size:11px; \${btnStyle}">\${inCart}</button>
              <button onclick="openProductDetailsModal('\${prod.id}')" class="btn-card-view" style="padding: 6px 10px; font-size:11px;">Specs</button>
            </div>
          </td>
        </tr>
      \`;
    }).join('');
  }

  // SET CATALOG VIEW MODE (GRID OR TABLE)
  window.setCatalogView = function(mode) {
    catalogViewMode = mode;
    document.getElementById("btn-view-grid").classList.toggle("active", mode === 'grid');
    document.getElementById("btn-view-table").classList.toggle("active", mode === 'table');
    applyDynamicFiltering();
  };

  // ADD TO RFQ CART
  window.addToRfq = function(prodId) {
    const prod = productsData.find(p => p.id === prodId);
    if (!prod) return;

    if (rfqCart[prodId]) {
      // Toggle off / remove if already in cart
      delete rfqCart[prodId];
      console.log(\`Removed \${prod.title} from RFQ list.\`);
    } else {
      // Add to cart
      rfqCart[prodId] = { prod, quantity: 1 };
      console.log(\`Added \${prod.title} to RFQ list.\`);
    }

    // Refresh buttons state in UI
    const gridBtn = document.getElementById(\`btn-rfq-\${prodId}\`);
    const tblBtn = document.getElementById(\`btn-tbl-rfq-\${prodId}\`);
    
    if (gridBtn) {
      gridBtn.textContent = rfqCart[prodId] ? 'In RFQ List' : 'Add to RFQ';
      gridBtn.style.background = rfqCart[prodId] ? 'var(--maroon-dark)' : '';
      gridBtn.style.color = rfqCart[prodId] ? '#fff' : '';
    }
    if (tblBtn) {
      tblBtn.textContent = rfqCart[prodId] ? 'In RFQ' : 'Add RFQ';
      tblBtn.style.background = rfqCart[prodId] ? 'var(--maroon-dark)' : '';
      tblBtn.style.color = rfqCart[prodId] ? '#fff' : '';
      tblBtn.style.borderColor = rfqCart[prodId] ? 'var(--maroon-dark)' : '';
    }

    syncCartUi();
  };

  // SYNC CART COMPILATION UI & BADGE VISIBILITY
  function syncCartUi() {
    const count = Object.keys(rfqCart).length;
    const badge = document.getElementById("quote-cart-badge");
    const countSpan = document.getElementById("quote-cart-count");
    
    if (badge && countSpan) {
      countSpan.textContent = count;
      badge.style.display = count > 0 ? 'flex' : 'none';
      if (count === 0) {
        document.getElementById("quote-cart-panel").style.display = 'none';
      }
    }

    // Render cart items inside dropdown panel
    const container = document.getElementById("quote-cart-items-container");
    if (!container) return;

    if (count === 0) {
      container.innerHTML = \`<div style="text-align:center; color:var(--text-light); padding:20px; font-size:13px;">Your quote list is empty.</div>\`;
      return;
    }

    container.innerHTML = Object.entries(rfqCart).map(([id, item]) => {
      return \`
        <div class="quote-cart-item">
          <div class="quote-cart-item-info">
            <div class="quote-cart-item-name">\${item.prod.title}</div>
            <div class="quote-cart-item-desc">\${item.prod.price}</div>
          </div>
          <div class="quote-cart-qty">
            <button class="quote-cart-qty-btn" onclick="updateCartQty('\${id}', -1)">-</button>
            <span class="quote-cart-qty-val">\${item.quantity}</span>
            <button class="quote-cart-qty-btn" onclick="updateCartQty('\${id}', 1)">+</button>
            <span class="quote-cart-item-remove" onclick="addToRfq('\${id}')">&times;</span>
          </div>
        </div>
      \`;
    }).join('');
  }

  // UPDATE CART ITEM QUANTITY
  window.updateCartQty = function(id, delta) {
    if (rfqCart[id]) {
      rfqCart[id].quantity += delta;
      if (rfqCart[id].quantity <= 0) {
        delete rfqCart[id];
        // reset buttons in grids
        const gridBtn = document.getElementById(\`btn-rfq-\${id}\`);
        const tblBtn = document.getElementById(\`btn-tbl-rfq-\${id}\`);
        if (gridBtn) {
          gridBtn.textContent = 'Add to RFQ';
          gridBtn.style.background = '';
          gridBtn.style.color = '';
        }
        if (tblBtn) {
          tblBtn.textContent = 'Add RFQ';
          tblBtn.style.background = '';
          tblBtn.style.color = '';
          tblBtn.style.borderColor = '';
        }
      }
      syncCartUi();
    }
  };

  // TOGGLE CART PANEL VISIBILITY
  window.toggleQuoteCartPanel = function() {
    const panel = document.getElementById("quote-cart-panel");
    if (panel) {
      panel.style.display = panel.style.display === 'flex' ? 'none' : 'flex';
    }
  };

  // COMPILE AND SEND RFQ LIST TO WHATSAPP
  window.sendRfqToWhatsapp = function() {
    const items = Object.values(rfqCart);
    if (items.length === 0) return;

    let message = "Hello Anshuman Enterprises, I would like to request a wholesale quote for the following materials:\\n\\n";
    items.forEach((item, idx) => {
      message += \`\${idx + 1}. \${item.prod.title}\\n   • Quantity: \${item.quantity}\\n   • Brands: \${item.prod.brands.join(', ')}\\n   • Unit Price: \${item.prod.price}\\n\\n\`;
    });
    
    message += "Please review and send the quotation at your earliest convenience. Thank you!";
    const url = \`https://wa.me/917065815743?text=\${encodeURIComponent(message)}\`;
    window.open(url, '_blank');
  };

  // OVERWRITE SUBCATEGORY POPUP SELECT EVENT TO AUTOMATICALLY ACTIVATE SPLIT CATALOG VIEW
  window.applySubcategoryFilter = function(categoryKey, subcategoryName) {
    const config = categoryMap[categoryKey];
    if (!config) return;
    
    activeSubcategoryName = subcategoryName;
    closeSubcategoryPopup();
    
    // Set internal state filters
    selectedCategoryFilter = categoryKey;
    selectedBrandFilter = 'All';
    catalogSearchQuery = '';
    
    // Reset search inputs in sidebar
    const searchBar = document.getElementById("catalog-search-bar");
    if (searchBar) searchBar.value = '';
    
    renderSidebarFilters();
    applyDynamicFiltering();
    
    // Smooth scroll to the results section
    const targetSection = document.getElementById("filtered-products-section");
    if (targetSection) {
      targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };
`;

// Replace original initialization scripts in products.html
const jsSearchTarget = `  // INITIALIZE DYNAMIC CATALOG\n  function initDynamicCatalog() {\n    renderAllDefaultGrids();\n  }`;
if (content.includes(jsSearchTarget)) {
  content = content.replace(jsSearchTarget, upgradedJsLogic);
  console.log("[OK] Injected upgraded dynamic JavaScript state controllers.");
} else {
  // Let's do a replace of the block from `// INITIALIZE DYNAMIC CATALOG` up to the end of `generateProductsHtml`
  const fallbackJsRegex = /\/\/ INITIALIZE DYNAMIC CATALOG[\s\S]*?return `\s*<div class="prod-static-card">/;
  // We can do a simpler replacement of the function headers:
  const searchStart = `  // INITIALIZE DYNAMIC CATALOG`;
  const searchEnd = `  // OPEN SUBCATEGORY POPUP`;
  
  const startIndex = content.indexOf(searchStart);
  const endIndex = content.indexOf(searchEnd);
  
  if (startIndex !== -1 && endIndex !== -1) {
    content = content.substring(0, startIndex) + upgradedJsLogic + `\n\n` + content.substring(endIndex);
    console.log("[OK] Injected dynamic state controllers (fallback substring method).");
  } else {
    console.error("[ERROR] Could not find JS replacement bounds!");
    process.exit(1);
  }
}

fs.writeFileSync(productsFilePath, content, 'utf8');
console.log("");
console.log("====================================================");
console.log("  RESTOCKING & RESTRUCTURING COMPLETE!");
console.log("====================================================");
