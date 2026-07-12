document.addEventListener("DOMContentLoaded", () => {
  // Search index lazy loading helper
  let searchDataPromise = null;
  function loadSearchData() {
    if (typeof globalSearchData !== 'undefined') return Promise.resolve();
    if (searchDataPromise) return searchDataPromise;
    
    searchDataPromise = new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'search_data.js';
      script.defer = true;
      script.onload = () => {
        console.log('Search database loaded dynamically.');
        resolve();
      };
      script.onerror = (err) => {
        console.error('Failed to load search database:', err);
        searchDataPromise = null;
        reject(err);
      };
      document.body.appendChild(script);
    });
    return searchDataPromise;
  }

  // Pre-load search database on idle page load (after 5 seconds)
  setTimeout(loadSearchData, 5000);

  // Inject Premium Search & Upgrade UI Styles
  const style = document.createElement('style');
  style.textContent = `
    #global-search-btn {
      background: none; border: none; color: #fff; font-size: 20px; cursor: pointer; padding: 5px; margin-left: 15px; transition: color 0.3s;
    }
    #global-search-btn:hover { color: #c9a84c; }
    
    #global-search-modal {
      position: fixed; top: 0; left: 0; width: 100%; height: 100vh; background: rgba(15, 6, 8, 0.85); backdrop-filter: blur(10px);
      z-index: 10000; display: none; opacity: 0; transition: opacity 0.3s ease; justify-content: center; align-items: flex-start; padding-top: 100px;
    }
    .search-modal-content {
      width: 90%; max-width: 700px; background: #fff; border-radius: 20px; overflow: hidden; box-shadow: 0 25px 70px rgba(0,0,0,0.5);
      transform: translateY(-30px); transition: transform 0.3s ease; border: 1px solid rgba(201, 168, 76, 0.2);
    }
    .search-modal-header {
      display: flex; align-items: center; padding: 22px 28px; border-bottom: 1px solid #f0e6d2; background: #faf7f2;
    }
    .search-modal-header input {
      flex: 1; border: none; outline: none; font-size: 20px; font-family: 'Poppins', 'Inter', sans-serif; padding-left: 15px; background: transparent; color: #3d0e14;
    }
    .search-modal-header input::placeholder {
      color: #8a7a7a;
    }
    .search-modal-close {
      background: none; border: none; font-size: 28px; color: #8a7a7a; cursor: pointer; line-height: 1; transition: color 0.2s;
    }
    .search-modal-close:hover { color: #3d0e14; }
    
    .search-results {
      max-height: 420px; overflow-y: auto; padding: 10px 0; background: #fff;
    }
    .search-result-item {
      display: flex; align-items: center; padding: 16px 28px; text-decoration: none; border-bottom: 1px solid #f9f6f0; transition: all 0.25s ease; border-left: 4px solid transparent;
    }
    .search-result-item:hover, .search-result-item.active {
      background: #faf7f2; border-left: 4px solid #c9a84c; padding-left: 32px;
    }
    .search-result-info { flex: 1; margin-right: 15px; }
    .search-result-title { font-size: 16px; color: #3d0e14; font-weight: 600; margin-bottom: 4px; font-family: 'Poppins', sans-serif; }
    .search-result-snippet { font-size: 13px; color: #5a4a4a; line-height: 1.5; margin-bottom: 4px; }
    .search-result-url { font-size: 11px; color: #c9a84c; font-family: 'Inter', sans-serif; font-weight: 500; text-transform: lowercase; }
    .search-result-type { font-size: 11px; background: #3d0e14; color: #c9a84c; padding: 4px 12px; border-radius: 20px; font-weight: 600; white-space: nowrap; font-family: 'Poppins', sans-serif; }
    
    .search-highlight {
      background: rgba(201, 168, 76, 0.25);
      color: #3d0e14;
      padding: 1px 3px;
      border-radius: 3px;
      font-weight: 600;
    }
    
    .search-no-results { padding: 40px 30px; text-align: center; color: #8a7a7a; font-size: 16px; display: none; font-family: 'Poppins', sans-serif; }
    
    /* Popular Suggestions UI */
    .search-suggestions-container {
      padding: 25px 28px;
      background: #fff;
      border-top: 1px solid #faf7f2;
    }
    .search-suggestions-title {
      font-size: 13px;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: #8a7a7a;
      font-weight: 600;
      margin-bottom: 12px;
      font-family: 'Poppins', sans-serif;
    }
    .popular-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
    }
    .popular-tag {
      background: #faf7f2;
      color: #3d0e14;
      padding: 8px 16px;
      border-radius: 25px;
      font-size: 13px;
      cursor: pointer;
      transition: all 0.25s ease;
      border: 1px solid #f0e6d2;
      font-family: 'Poppins', sans-serif;
      font-weight: 500;
    }
    .popular-tag:hover {
      background: #3d0e14;
      color: #c9a84c;
      border-color: #3d0e14;
      transform: translateY(-2px);
      box-shadow: 0 4px 10px rgba(61, 14, 20, 0.15);
    }
    
    @media(max-width: 768px) {
      #global-search-modal { padding-top: 50px; }
      .search-modal-content { width: 95%; }
      .search-result-item { padding: 12px 20px; }
      .search-result-item:hover, .search-result-item.active { padding-left: 24px; }
      .search-suggestions-container { padding: 20px; }
    }

    /* --- THEME TOGGLE STYLES --- */
    #theme-toggle-btn {
      position: fixed; bottom: 25px; left: 25px; width: 50px; height: 50px; border-radius: 50%;
      background: rgba(255, 255, 255, 0.15); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
      border: 1px solid rgba(201, 168, 76, 0.3); color: #c9a84c; display: flex; align-items: center; justify-content: center;
      font-size: 20px; cursor: pointer; z-index: 99999; box-shadow: 0 4px 15px rgba(0,0,0,0.2);
      transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }
    #theme-toggle-btn:hover {
      transform: scale(1.1) rotate(15deg);
      box-shadow: 0 8px 25px rgba(201, 168, 76, 0.4);
      border-color: #e8c96a;
      background: rgba(255, 255, 255, 0.25);
    }
    .dark-theme #theme-toggle-btn {
      background: rgba(26, 16, 18, 0.6);
      border-color: rgba(201, 168, 76, 0.4);
      color: #e8c96a;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
    }
    .dark-theme #theme-toggle-btn:hover {
      box-shadow: 0 8px 30px rgba(201, 168, 76, 0.6);
      background: rgba(26, 16, 18, 0.8);
    }

    /* --- DARK MODE TRANSITION --- */
    body, nav, .ae-nav, .why-card, .product-card, .project-card, .prod-card, .brand-pill, .founder-strip, .alt-section, .search-modal-content, .search-results, .popular-tag, .estimator-card {
      transition: background-color 0.4s ease, border-color 0.4s ease, color 0.4s ease, box-shadow 0.4s ease;
    }

    /* --- DARK MODE VARIABLES --- */
    :root.dark-theme {
      --cream: #0c0708 !important;
      --cream-dark: #160e10 !important;
      --white: #1a1012 !important;
      --text: #f5ead5 !important;
      --text-mid: #d6c8ca !important;
      --text-light: #a89799 !important;
      --border: rgba(201, 168, 76, 0.22) !important;
      --shadow-sm: 0 2px 12px rgba(0, 0, 0, 0.4) !important;
      --shadow-md: 0 8px 32px rgba(0, 0, 0, 0.6) !important;
      --shadow-lg: 0 20px 60px rgba(0, 0, 0, 0.8) !important;
    }
    
    .dark-theme body { background: var(--cream) !important; color: var(--text) !important; }
    .dark-theme nav, .dark-theme .ae-nav { background: #100608 !important; border-bottom: 1px solid rgba(201, 168, 76, 0.2) !important; }
    .dark-theme .why-card, .dark-theme .product-card, .dark-theme .project-card { background: #180e10 !important; border-color: var(--border) !important; }
    .dark-theme .why-card h3, .dark-theme .product-card h3, .dark-theme .project-card h3, .dark-theme .product-card h3 a { color: #e8c96a !important; }
    .dark-theme .why-card p, .dark-theme .product-card p, .dark-theme .project-card p { color: var(--text-mid) !important; }
    .dark-theme .brand-pill { background: #1d1215 !important; border-color: var(--border) !important; color: #e8c96a !important; }
    .dark-theme .brand-pill:hover { background: #c9a84c !important; color: #3d0e14 !important; }
    .dark-theme .founder-strip { background: #130c0e !important; border-top-color: var(--border) !important; border-bottom-color: var(--border) !important; }
    .dark-theme .founder-quote { color: #f5ead5 !important; }
    .dark-theme .alt-section.alt-dark { background: #130c0e !important; }
    .dark-theme .section-title { color: #e8c96a !important; }
    .dark-theme .section-subtitle { color: var(--text-mid) !important; }
    .dark-theme .nav-brand, .dark-theme .ae-nav-brand-wrap { color: #e8c96a !important; }
    .dark-theme .ae-nav-brand-sub { color: #fff !important; }
    .dark-theme .ae-nav-links-desktop a { color: #fff !important; }
    .dark-theme .ae-nav-links-desktop a:hover { color: #c9a84c !important; }
    .dark-theme #side-menu { background: #160e10 !important; box-shadow: -5px 0 25px rgba(0,0,0,0.5) !important; }
    .dark-theme #side-menu a { color: #f5ead5 !important; border-bottom-color: rgba(201,168,76,0.15) !important; }
    .dark-theme #close-menu-btn { color: #e8c96a !important; }
    .dark-theme .project-card { background: #180e10 !important; border-color: var(--border) !important; }
    .dark-theme .project-card h3 { color: #e8c96a !important; }
    .dark-theme .project-card p { color: var(--text-mid) !important; }
    .dark-theme .faq-item { background: #180e10 !important; border-color: var(--border) !important; }
    .dark-theme .faq-answer { color: var(--text-mid) !important; }
    .dark-theme .blog-card { background: #180e10 !important; border-color: var(--border) !important; }
    .dark-theme .cta-section { border-top: 1px solid var(--border) !important; }
    
    /* --- SCROLL PROGRESS BUTTON --- */
    #scroll-progress-btn {
      position: fixed; bottom: 95px; right: 25px; width: 50px; height: 50px; border-radius: 50%;
      background: rgba(255, 255, 255, 0.15); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
      border: 1px solid rgba(201, 168, 76, 0.3); color: #c9a84c; display: flex; align-items: center; justify-content: center;
      cursor: pointer; z-index: 9999; opacity: 0; transform: translateY(20px) scale(0.8);
      transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); pointer-events: none;
    }
    #scroll-progress-btn.visible {
      opacity: 1; transform: translateY(0) scale(1); pointer-events: auto;
    }
    #scroll-progress-btn:hover {
      background: rgba(255, 255, 255, 0.25);
      border-color: #e8c96a;
      transform: scale(1.08) translateY(-3px);
    }
    .dark-theme #scroll-progress-btn {
      background: rgba(26, 16, 18, 0.6);
      border-color: rgba(201, 168, 76, 0.4);
    }
    #scroll-progress-btn svg {
      position: absolute; top: 0; left: 0; width: 100%; height: 100%; transform: rotate(-90deg);
    }
    #scroll-progress-btn svg path {
      fill: none; stroke: #c9a84c; stroke-width: 4; stroke-linecap: round;
      transition: stroke-dashoffset 10ms linear;
    }
    .dark-theme #scroll-progress-btn svg path {
      stroke: #e8c96a;
    }
    #scroll-progress-btn .arrow-up {
      font-size: 18px; font-weight: bold; color: #6b1c23; transition: transform 0.3s;
    }
    .dark-theme #scroll-progress-btn .arrow-up {
      color: #e8c96a;
    }
    #scroll-progress-btn:hover .arrow-up {
      transform: translateY(-2px);
    }

    /* --- 3D TILT EFFECT --- */
    .tilt-card {
      transform-style: preserve-3d;
      transition: transform 0.1s ease, box-shadow 0.3s ease;
    }

    /* --- SCROLL REVEALS --- */
    .reveal-item {
      opacity: 0; transform: translateY(25px);
      transition: opacity 0.7s ease, transform 0.7s cubic-bezier(0.165, 0.84, 0.44, 1);
    }
    .reveal-item.reveal-active {
      opacity: 1; transform: translateY(0);
    }

    /* --- DYNAMIC ESTIMATOR WIDGET STYLES --- */
    .estimator-container {
      max-width: 900px; margin: 40px auto; padding: 0 15px;
    }
    .estimator-card {
      background: #fff; border: 1px solid var(--border); border-radius: 24px;
      box-shadow: var(--shadow-md); padding: 40px; position: relative; overflow: hidden;
    }
    .estimator-card::before {
      content: ''; position: absolute; top: 0; left: 0; right: 0; height: 5px;
      background: linear-gradient(90deg, #6b1c23, #c9a84c);
    }
    .dark-theme .estimator-card {
      background: #180e10 !important;
    }
    .estimator-tabs {
      display: flex; gap: 10px; margin-bottom: 30px; border-bottom: 1px solid var(--border); padding-bottom: 15px;
      overflow-x: auto; scrollbar-width: none;
    }
    .estimator-tabs::-webkit-scrollbar { display: none; }
    .estimator-tab {
      padding: 10px 20px; border-radius: 50px; border: 1px solid var(--border); background: transparent;
      color: var(--text-mid); font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 600;
      cursor: pointer; white-space: nowrap; transition: all 0.25s;
    }
    .estimator-tab.active {
      background: #6b1c23; border-color: #6b1c23; color: #fff;
    }
    .dark-theme .estimator-tab.active {
      background: #c9a84c !important; border-color: #c9a84c !important; color: #3d0e14 !important;
    }
    .dark-theme .estimator-tab {
      color: var(--text-mid) !important;
    }
    .estimator-grid {
      display: grid; grid-template-columns: 1fr 1fr; gap: 30px;
    }
    @media(max-width: 768px) {
      .estimator-grid { grid-template-columns: 1fr; }
      .estimator-card { padding: 25px 20px; }
    }
    .estimator-field {
      display: flex; flex-direction: column; gap: 8px; margin-bottom: 20px;
    }
    .estimator-field label {
      font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; color: #6b1c23;
      font-family: 'DM Mono', monospace;
    }
    .dark-theme .estimator-field label {
      color: #e8c96a !important;
    }
    .estimator-field select, .estimator-field input {
      padding: 12px 16px; border-radius: 10px; border: 1px solid var(--border); background: var(--cream);
      color: var(--text); font-family: 'DM Sans', sans-serif; font-size: 15px; outline: none; transition: border-color 0.2s;
    }
    .estimator-field select:focus, .estimator-field input:focus {
      border-color: #c9a84c;
    }
    .dark-theme .estimator-field select, .dark-theme .estimator-field input {
      background: #100608 !important; border-color: rgba(201, 168, 76, 0.2) !important;
    }
    .estimator-result-card {
      background: var(--cream-dark); border-radius: 16px; padding: 24px; border: 1px dashed var(--border);
      display: flex; flex-direction: column; justify-content: space-between;
    }
    .dark-theme .estimator-result-card {
      background: #100608 !important; border-color: rgba(201,168,76,0.3) !important;
    }
    .est-res-title {
      font-size: 14px; font-weight: 600; color: var(--text-mid); text-transform: uppercase; letter-spacing: 1.5px;
      margin-bottom: 12px; font-family: 'DM Mono', monospace; border-bottom: 1px solid var(--border); padding-bottom: 8px;
    }
    .est-res-val {
      font-family: 'Cormorant Garamond', serif; font-size: 32px; font-weight: 700; color: #3d0e14;
      margin-bottom: 15px; line-height: 1;
    }
    .dark-theme .est-res-val {
      color: #fff !important;
    }
    .est-res-list {
      list-style: none; display: flex; flex-direction: column; gap: 8px; font-size: 13px; color: var(--text-mid);
      margin-bottom: 20px;
    }
    .est-res-list li {
      display: flex; justify-content: space-between; align-items: center;
    }
    .est-res-list li span:last-child {
      font-weight: 600; color: var(--text);
    }
  `;
  document.head.appendChild(style);

  // Inject Search Button into Nav
  const navInner = document.querySelector('.ae-nav-inner');
  if (navInner) {
    const searchBtn = document.createElement('button');
    searchBtn.id = 'global-search-btn';
    searchBtn.innerHTML = '&#128269;'; // Magnifying glass icon
    searchBtn.title = "Search Website";
    searchBtn.setAttribute('aria-label', 'Search Website');
    
    const mobileBtn = document.getElementById('mobile-menu-btn');
    if (mobileBtn) {
      navInner.insertBefore(searchBtn, mobileBtn);
    } else {
      navInner.appendChild(searchBtn);
    }
  }

  // Inject Search Modal into Body (with full accessibility labels)
  const modalHTML = `
    <div id="global-search-modal">
      <div class="search-modal-content">
        <div class="search-modal-header">
          <span style="font-size: 24px; color: #c9a84c;">&#128269;</span>
          <input type="text" id="global-search-input" placeholder="Search for wiring, CCTV, products..." autocomplete="off" aria-label="Search site content">
          <button class="search-modal-close" id="global-search-close" aria-label="Close Search">&times;</button>
        </div>
        <div class="search-results" id="global-search-results"></div>
        <div class="search-no-results" id="global-search-empty">
          <div style="font-size: 40px; margin-bottom: 10px;">🔍</div>
          No results found for your query. Try searching another term.
        </div>
        <div class="search-suggestions-container" id="global-search-suggestions">
          <div class="search-suggestions-title">Popular Searches (लोकप्रिय खोजें)</div>
          <div class="popular-tags">
            <span class="popular-tag">House Wiring</span>
            <span class="popular-tag">CCTV Camera</span>
            <span class="popular-tag">Havells Fans Price List</span>
            <span class="popular-tag">Crabtree Switches</span>
            <span class="popular-tag">Polycab Wires List</span>
            <span class="popular-tag">CONA MCB & Wires</span>
            <span class="popular-tag">Panasonic Lighting</span>
            <span class="popular-tag">Orient Fans Catalog</span>
            <span class="popular-tag">RR Signature LED</span>
          </div>
        </div>
      </div>
    </div>
  `;
  document.body.insertAdjacentHTML('beforeend', modalHTML);

  const modal = document.getElementById('global-search-modal');
  const modalContent = document.querySelector('.search-modal-content');
  const searchInput = document.getElementById('global-search-input');
  const resultsContainer = document.getElementById('global-search-results');
  const emptyState = document.getElementById('global-search-empty');
  const suggestionsContainer = document.getElementById('global-search-suggestions');
  const searchBtn = document.getElementById('global-search-btn');
  const closeBtn = document.getElementById('global-search-close');

  let activeIndex = -1;
  let currentResults = [];

  function openSearch() {
    modal.style.display = 'flex';
    setTimeout(() => {
      modal.style.opacity = '1';
      modalContent.style.transform = 'translateY(0)';
      searchInput.focus();
    }, 10);
    document.body.style.overflow = 'hidden';
    
    // Reset state
    searchInput.value = '';
    resultsContainer.innerHTML = '';
    emptyState.style.display = 'none';
    suggestionsContainer.style.display = 'block';
    activeIndex = -1;
    currentResults = [];
  }

  function closeSearch() {
    modal.style.opacity = '0';
    modalContent.style.transform = 'translateY(-30px)';
    setTimeout(() => {
      modal.style.display = 'none';
      searchInput.value = '';
      resultsContainer.innerHTML = '';
      emptyState.style.display = 'none';
      suggestionsContainer.style.display = 'block';
    }, 300);
    document.body.style.overflow = 'auto';
  }

  if (searchBtn) {
    searchBtn.addEventListener('click', () => {
      loadSearchData().then(openSearch).catch(openSearch);
    });
    searchBtn.addEventListener('mouseenter', loadSearchData);
    searchBtn.addEventListener('touchstart', loadSearchData, { passive: true });
  }
  searchInput.addEventListener('focus', loadSearchData);
  closeBtn.addEventListener('click', closeSearch);
  modal.addEventListener('click', (e) => { if (e.target === modal) closeSearch(); });

  // Escape to close
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.style.display === 'flex') {
      closeSearch();
    }
  });

  // Popular Tag Clicks
  document.querySelectorAll('.popular-tag').forEach(tag => {
    tag.addEventListener('click', () => {
      const term = tag.textContent;
      searchInput.value = term;
      performSearch(term);
      searchInput.focus();
    });
  });

  // Safe Regexp escaping
  function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  // Highlight matches
  function highlightText(text, words) {
    if (!words || words.length === 0) return text;
    const escapedWords = words.map(escapeRegExp).filter(w => w.length > 0);
    if (escapedWords.length === 0) return text;
    
    // Sort words by length descending to prevent shorter words within longer ones from matching first
    escapedWords.sort((a, b) => b.length - a.length);
    
    const regex = new RegExp(`\\b(${escapedWords.join('|')})`, 'gi');
    return text.replace(regex, '<mark class="search-highlight">$1</mark>');
  }

  // Real Search Implementation
  function performSearch(query) {
    resultsContainer.innerHTML = '';
    activeIndex = -1;
    
    const cleanQuery = query.toLowerCase().trim();
    if (cleanQuery.length < 2) {
      emptyState.style.display = 'none';
      resultsContainer.innerHTML = '';
      suggestionsContainer.style.display = 'block';
      currentResults = [];
      return;
    }

    suggestionsContainer.style.display = 'none';

    // Verify search index is available
    if (typeof globalSearchData === 'undefined') {
      resultsContainer.innerHTML = '<div style="padding:20px; text-align:center; color:#888;">Search database is loading... please wait.</div>';
      return;
    }

    const queryWords = cleanQuery.split(/\s+/).filter(Boolean);
    const results = [];

    globalSearchData.forEach(item => {
      let score = 0;
      const lowerTitle = item.title.toLowerCase();
      const lowerContent = item.content.toLowerCase();

      // Check exact phrase matches
      if (lowerTitle.includes(cleanQuery)) {
        score += 150;
      }
      if (lowerContent.includes(cleanQuery)) {
        score += 50;
      }

      // Check individual word matches
      queryWords.forEach(word => {
        if (lowerTitle.includes(word)) {
          score += 30;
        }
        
        // Count content word matches (max out to avoid spamming weight)
        const wordCount = (lowerContent.match(new RegExp(escapeRegExp(word), 'g')) || []).length;
        score += Math.min(10, wordCount) * 5;
      });

      if (score > 0) {
        // Extract snippet
        let snippet = '';
        let matchIndex = lowerContent.indexOf(cleanQuery);
        
        if (matchIndex === -1 && queryWords.length > 0) {
          // Find the index of the first matching word
          for (let i = 0; i < queryWords.length; i++) {
            const idx = lowerContent.indexOf(queryWords[i]);
            if (idx !== -1) {
              matchIndex = idx;
              break;
            }
          }
        }

        if (matchIndex !== -1) {
          const start = Math.max(0, matchIndex - 45);
          const end = Math.min(item.content.length, matchIndex + cleanQuery.length + 65);
          snippet = item.content.substring(start, end).trim();
          
          if (start > 0) snippet = '...' + snippet;
          if (end < item.content.length) snippet = snippet + '...';
        } else {
          // Default to beginning of the page
          snippet = item.content.substring(0, 110).trim() + '...';
        }

        results.push({
          url: item.url,
          title: item.title,
          type: item.type || 'Page',
          snippet: snippet,
          score: score
        });
      }
    });

    // Sort by score descending
    results.sort((a, b) => b.score - a.score);

    currentResults = results.slice(0, 15); // limit to top 15 results

    if (currentResults.length === 0) {
      emptyState.style.display = 'block';
    } else {
      emptyState.style.display = 'none';
      currentResults.forEach((item, index) => {
        const a = document.createElement('a');
        a.href = item.url;
        a.className = 'search-result-item';
        a.dataset.index = index;
        
        const highlightedTitle = highlightText(item.title, queryWords);
        const highlightedSnippet = highlightText(item.snippet, queryWords);

        a.innerHTML = `
          <div class="search-result-info">
            <div class="search-result-title">${highlightedTitle}</div>
            <div class="search-result-snippet">${highlightedSnippet}</div>
            <div class="search-result-url">${item.url}</div>
          </div>
          <div class="search-result-type">${item.type}</div>
        `;
        
        a.addEventListener('click', (e) => {
          // Smooth closing tracking
          setTimeout(closeSearch, 100);
        });

        resultsContainer.appendChild(a);
      });
    }
  }

  // Listen to input changes
  searchInput.addEventListener('input', (e) => {
    performSearch(e.target.value);
  });

  // Keyboard navigation
  searchInput.addEventListener('keydown', (e) => {
    if (currentResults.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      activeIndex = (activeIndex + 1) % currentResults.length;
      updateActiveItem();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      activeIndex = (activeIndex - 1 + currentResults.length) % currentResults.length;
      updateActiveItem();
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const targetIndex = activeIndex >= 0 ? activeIndex : 0;
      const targetItem = resultsContainer.children[targetIndex];
      if (targetItem) {
        targetItem.click();
        window.location.href = targetItem.href;
      }
    }
  });

  function updateActiveItem() {
    const items = resultsContainer.querySelectorAll('.search-result-item');
    items.forEach((item, idx) => {
      if (idx === activeIndex) {
        item.classList.add('active');
        // Scroll into view
        item.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      } else {
        item.classList.remove('active');
      }
    });
  }

  // Global exposure for external inputs (like blog hero search)
  window.openGlobalSearch = function(initialQuery = '') {
    openSearch();
    if (initialQuery) {
      searchInput.value = initialQuery;
      performSearch(initialQuery);
    }
  }

  /* ==========================================================================
     NEW PREMIUM UPGRADES: DARK MODE, SCROLL PROGRESS, 3D TILT, SCROLL REVEAL, ESTIMATOR
     ========================================================================== */

  // 1. DYNAMIC DARK/LIGHT MODE SYSTEM REMOVED PER USER REQUEST

  // 2. SCROLL PROGRESS INDICATOR & SCROLL TO TOP REMOVED PER USER REQUEST

  // 3. 3D CARD PARALLAX TILT HOVER EFFECTS
  function initCardParallax() {
    const cards = document.querySelectorAll('.why-card, .product-card, .project-card, .prod-card, .brand-logo-card, .estimator-card');
    
    cards.forEach(card => {
      card.classList.add('tilt-card');
      
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left; // x coordinate within element
        const y = e.clientY - rect.top;  // y coordinate within element
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        // Max tilt angle (degrees)
        const maxTilt = 8;
        const tiltX = ((centerY - y) / centerY) * maxTilt;
        const tiltY = ((x - centerX) / centerX) * maxTilt;
        
        card.style.transform = `perspective(800px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(1.02, 1.02, 1.02)`;
        card.style.boxShadow = '0 15px 35px rgba(61, 14, 20, 0.18)';
      });
      
      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
        card.style.boxShadow = '';
      });
    });
  }
  initCardParallax();

  // 4. SCROLL ENTRANCE REVEAL ANIMATIONS
  function initScrollReveals() {
    const revealElements = document.querySelectorAll('.why-card, .product-card, .project-card, .prod-card, .brand-pill, .brand-logo-card, .section-title, .section-subtitle, .founder-inner');
    
    revealElements.forEach(el => {
      el.classList.add('reveal-item');
    });
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal-active');
          observer.unobserve(entry.target); // Animates once
        }
      });
    }, {
      threshold: 0.05,
      rootMargin: '0px 0px -40px 0px'
    });
    
    revealElements.forEach(el => {
      observer.observe(el);
    });
  }
  initScrollReveals();

  // 5. PROJECT MATERIAL & COST ESTIMATOR WIDGET LOGIC
  function initProjectEstimator() {
    const card = document.querySelector('.estimator-card');
    if (!card) return;

    const tabs = card.querySelectorAll('.estimator-tab');
    const formFields = document.getElementById('estimator-form-fields');
    const resultBox = document.getElementById('estimator-results');

    let currentProject = 'wiring'; // wiring, cctv, lighting

    const projectData = {
      wiring: {
        title: '🏠 House Wiring Estimation (घर की वायरिंग)',
        fields: `
          <div class="estimator-field">
            <label>Project Floor Area (Sq. Ft.)</label>
            <input type="number" id="est-wiring-area" value="1000" min="100" max="10000" step="50">
          </div>
          <div class="estimator-field">
            <label>Wire Quality / Safety Grade</label>
            <select id="est-wiring-grade">
              <option value="fr" selected>FR (Flame Retardant) Wires - Standard</option>
              <option value="frls">FRLS (Flame Retardant Low Smoke) - Recommended</option>
              <option value="zhfr">ZHFR (Zero Halogen - Premium Safety)</option>
            </select>
          </div>
          <div class="estimator-field">
            <label>Preferred Brand</label>
            <select id="est-wiring-brand">
              <option value="polycab" selected>Polycab India</option>
              <option value="havells">Havells India</option>
              <option value="anchor">Anchor by Panasonic</option>
              <option value="kei">KEI Wires & Cables</option>
            </select>
          </div>
        `,
        calculate: () => {
          const area = parseFloat(document.getElementById('est-wiring-area').value) || 1000;
          const grade = document.getElementById('est-wiring-grade').value;
          const brand = document.getElementById('est-wiring-brand').value;

          // Wire rolls (Math.ceil(area / 120) total, split between sizes)
          const wireRolls = Math.ceil(area / 120);
          const switchPlates = Math.ceil(area / 20);
          const pvcPipes = Math.ceil(area * 1.4 / 3); // 3m length conduits
          const mcbs = Math.ceil(area / 300) + 2;

          let baseRate = 30; // ₹ per sq ft
          if (brand === 'polycab') baseRate = 35;
          if (brand === 'havells') baseRate = 34;
          if (brand === 'kei') baseRate = 29;

          let mult = 1.0;
          if (grade === 'frls') mult = 1.25;
          if (grade === 'zhfr') mult = 1.45;

          const materialCost = Math.round(area * baseRate * mult);
          const gst = Math.round(materialCost * 0.18);
          const totalCost = materialCost + gst;

          const textBreakdown = `Project Area: ${area} Sq.Ft.\nBrand: ${brand.toUpperCase()}\nQuality: ${grade.toUpperCase()}\nEstimated Cost: ₹${totalCost.toLocaleString('en-IN')}`;

          return {
            price: totalCost,
            items: [
              `Copper FR Wires: <strong>${wireRolls} Rolls</strong> (Mixed sizes)`,
              `Modular Switches & Plates: <strong>${switchPlates} Sets</strong>`,
              `Heavy PVC Conduits (3m): <strong>${pvcPipes} Pipes</strong>`,
              `MCB Protection (SP/DP): <strong>${mcbs} units</strong>`,
              `Wholesale Material Estimate: <strong>₹${materialCost.toLocaleString('en-IN')}</strong>`,
              `GST (18% standard): <strong>₹${gst.toLocaleString('en-IN')}</strong>`
            ],
            whatsappMsg: encodeURIComponent(`Hi Anshuman Enterprises, I calculated my project estimate using your Website Calculator:\n\n*${textBreakdown}*\n\nPlease provide a final wholesale quotation.`)
          };
        }
      },
      cctv: {
        title: '📹 CCTV Surveillance Estimation (कैमरा सेटअप)',
        fields: `
          <div class="estimator-field">
            <label>Number of Cameras Needed</label>
            <select id="est-cctv-cameras">
              <option value="4" selected>4 Cameras (Home/Small Shop)</option>
              <option value="8">8 Cameras (Villa/Showroom)</option>
              <option value="16">16 Cameras (Office/Warehouse)</option>
              <option value="32">32 Cameras (Industrial Campus)</option>
            </select>
          </div>
          <div class="estimator-field">
            <label>Technology Level</label>
            <select id="est-cctv-tech">
              <option value="analog" selected>Analog HD Surveillance (Standard)</option>
              <option value="ip">Modern IP CCTV (PoE - Superior Clarity)</option>
            </select>
          </div>
          <div class="estimator-field">
            <label>Storage Retention</label>
            <select id="est-cctv-storage">
              <option value="15">15 Days Recording</option>
              <option value="30" selected>30 Days Recording (Recommended)</option>
              <option value="60">60 Days Continuous Archive</option>
            </select>
          </div>
        `,
        calculate: () => {
          const cams = parseInt(document.getElementById('est-cctv-cameras').value);
          const tech = document.getElementById('est-cctv-tech').value;
          const days = parseInt(document.getElementById('est-cctv-storage').value);

          let recorder = tech === 'ip' ? `${cams} Ch NVR (Network Recorder)` : `${cams} Ch DVR (Digital Recorder)`;
          let cableLength = cams * 20; // 20m per cam
          let cableType = tech === 'ip' ? 'Cat6 Pure Copper' : '3+1 Coaxial Cable';

          // HDD Storage
          let hdd = '1 TB Surveillance Grade';
          let hddPrice = 3800;
          const totalTB = cams * days * 0.015;
          if (totalTB > 1) { hdd = '2 TB Surveillance Grade'; hddPrice = 5800; }
          if (totalTB > 2) { hdd = '4 TB Surveillance Grade'; hddPrice = 8800; }
          if (totalTB > 4) { hdd = '8 TB Surveillance Grade'; hddPrice = 15500; }

          let basePrice = tech === 'ip' ? (12000 + cams * 2400) : (7000 + cams * 1400);
          const materialCost = Math.round(basePrice + hddPrice);
          const gst = Math.round(materialCost * 0.18);
          const totalCost = materialCost + gst;

          const textBreakdown = `CCTV System: ${cams} Cameras\nTech: ${tech.toUpperCase()}\nBackup: ${days} Days (${hdd})\nEstimated Cost: ₹${totalCost.toLocaleString('en-IN')}`;

          return {
            price: totalCost,
            items: [
              `Recording Hub: <strong>${recorder}</strong>`,
              `Cameras (HD Dome/Bullet): <strong>${cams} Units</strong>`,
              `Surveillance Storage: <strong>${hdd}</strong>`,
              `Specialized Cabling: <strong>${cableLength} meters (${cableType})</strong>`,
              `Wholesale Hardware Cost: <strong>₹${materialCost.toLocaleString('en-IN')}</strong>`,
              `GST (18% standard): <strong>₹${gst.toLocaleString('en-IN')}</strong>`
            ],
            whatsappMsg: encodeURIComponent(`Hi Anshuman Enterprises, I calculated my CCTV estimate using your Website Calculator:\n\n*${textBreakdown}*\n\nPlease contact me for scheduling a free site survey.`)
          };
        }
      },
      lighting: {
        title: '💡 LED Lighting Estimation (लाइटिंग फिटिंग्स)',
        fields: `
          <div class="estimator-field">
            <label>Project Area (Sq. Ft.)</label>
            <input type="number" id="est-light-area" value="1000" min="100" max="10000" step="50">
          </div>
          <div class="estimator-field">
            <label>Lighting Premium Design</label>
            <select id="est-light-premium">
              <option value="standard" selected>Standard Panels & Spotlights (Batten/Panel)</option>
              <option value="cove">Cove Strip Lights & Panels (Modern)</option>
              <option value="luxury">Luxury Profile Lights, Strips & COBs (Designer)</option>
            </select>
          </div>
        `,
        calculate: () => {
          const area = parseFloat(document.getElementById('est-light-area').value) || 1000;
          const premium = document.getElementById('est-light-premium').value;

          let panels = Math.ceil(area / 90);
          let cobs = Math.ceil(area / 120);
          let strips = 0;
          let profileAlum = 0;

          let baseRate = 12; // ₹ per sq ft
          if (premium === 'cove') {
            baseRate = 22;
            strips = Math.ceil(area / 50) * 5; // meters
          } else if (premium === 'luxury') {
            baseRate = 42;
            strips = Math.ceil(area / 30) * 5; // meters
            cobs = Math.ceil(area / 60);
            profileAlum = Math.ceil(area / 80) * 3; // meters
          }

          const materialCost = Math.round(area * baseRate);
          const gst = Math.round(materialCost * 0.18);
          const totalCost = materialCost + gst;

          const textBreakdown = `Lighting Area: ${area} Sq.Ft.\nDesign: ${premium.toUpperCase()}\nEstimated Cost: ₹${totalCost.toLocaleString('en-IN')}`;

          const items = [
            `LED Panel Downlights: <strong>${panels} units</strong>`,
            `COB Focus Spotlights: <strong>${cobs} units</strong>`
          ];
          if (strips > 0) items.push(`Flexible LED Strip Lights: <strong>${strips} meters</strong>`);
          if (profileAlum > 0) items.push(`Aluminium Profile Channels (3m): <strong>${profileAlum} tracks</strong>`);
          items.push(`Wholesale Material Cost: <strong>₹${materialCost.toLocaleString('en-IN')}</strong>`);
          items.push(`GST (18% standard): <strong>₹${gst.toLocaleString('en-IN')}</strong>`);

          return {
            price: totalCost,
            items: items,
            whatsappMsg: encodeURIComponent(`Hi Anshuman Enterprises, I calculated my LED lighting estimate using your Website Calculator:\n\n*${textBreakdown}*\n\nPlease suggest suitable brand options.`)
          };
        }
      }
    };

    function renderFields() {
      const data = projectData[currentProject];
      formFields.innerHTML = `
        <h3 style="font-family:'Cormorant Garamond',serif;font-size:22px;color:var(--maroon-dark);margin-bottom:20px;font-weight:700;">${data.title}</h3>
        ${data.fields}
      `;
      // Attach listeners to input changes
      formFields.querySelectorAll('input, select').forEach(input => {
        input.addEventListener('change', updateResults);
        input.addEventListener('input', updateResults);
      });
      updateResults();
    }

    function updateResults() {
      const calcResult = projectData[currentProject].calculate();
      let listHTML = '';
      calcResult.items.forEach(item => {
        listHTML += `<li><span>${item.split(': ')[0]}</span><span>${item.split(': ')[1]}</span></li>`;
      });

      resultBox.innerHTML = `
        <div class="est-res-title">Estimated Requirements (अनुमानित सामग्री)</div>
        <div style="font-size:12px;color:var(--text-light);margin-bottom:4px;font-family:'DM Mono',monospace;text-transform:uppercase;letter-spacing:0.5px;">Estimated Cost (₹)</div>
        <div class="est-res-val">₹${calcResult.price.toLocaleString('en-IN')}*</div>
        <ul class="est-res-list">${listHTML}</ul>
        <div style="font-size:11px;color:var(--text-light);margin-bottom:15px;line-height:1.4;">*Estimates are calculated at average wholesale list price. Actual price might be lower depending on brand discounts!</div>
        <a href="https://wa.me/917065815743?text=${calcResult.whatsappMsg}" target="_blank" style="background:#25D366;color:#fff;text-align:center;padding:12px 18px;border-radius:50px;text-decoration:none;font-weight:700;font-size:14px;box-shadow:0 4px 12px rgba(37,211,102,0.3);display:flex;align-items:center;justify-content:center;gap:8px;transition:all 0.25s;" onmouseover="this.style.transform='translateY(-2px)';" onmouseout="this.style.transform='none';">
          <svg viewBox="0 0 24 24" width="18" height="18" style="fill:currentColor;"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.727-1.458L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.42 9.864-9.864.002-2.637-1.03-5.114-2.905-6.99C16.458 1.875 13.985 1.83 11.35 1.83 5.91 1.83 1.488 6.252 1.484 11.696c-.001 1.702.46 3.36 1.332 4.793l-.991 3.616 3.708-.973.114.068zm9.19-7.98c-.282-.141-1.67-.824-1.929-.918-.258-.094-.446-.141-.635.141-.188.281-.728.918-.892 1.106-.164.188-.328.211-.61.07-2.227-1.115-3.666-2.036-5.02-4.36-.188-.318.188-.295.539-.993.113-.223.056-.417-.028-.582-.085-.164-.636-1.532-.871-2.1-.23-.55-.465-.475-.635-.483-.16-.007-.348-.008-.536-.008-.188 0-.493.07-.752.352-.259.282-.99 1.071-.99 2.612 0 1.54 1.129 3.029 1.282 3.24.153.211 2.221 3.391 5.378 4.754.752.325 1.337.518 1.794.663.755.24 1.442.206 1.986.125.606-.09 1.67-.682 1.905-1.34.235-.658.235-1.22.164-1.34-.07-.12-.258-.188-.54-.329z"/></svg>
          <span>💬 Get Wholesale Quote on WhatsApp</span>
        </a>
      `;
    }

    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        currentProject = tab.dataset.project;
        renderFields();
      });
    });

    renderFields();
  }

  // Active upgrades dynamically
  initProjectEstimator();
  initCardParallax();
});
