document.addEventListener("DOMContentLoaded", () => {
  // Inject Search UI Styles
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
  `;
  document.head.appendChild(style);

  // Inject Search Button into Nav
  const navInner = document.querySelector('.nav-inner');
  if (navInner) {
    const searchBtn = document.createElement('button');
    searchBtn.id = 'global-search-btn';
    searchBtn.innerHTML = '&#128269;'; // Magnifying glass icon
    searchBtn.title = "Search Website";
    
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
          <span style="font-size: 24px; color: #c9a84c;">&#128269;</span>
          <input type="text" id="global-search-input" placeholder="Search for wiring, CCTV, products..." autocomplete="off">
          <button class="search-modal-close" id="global-search-close">&times;</button>
        </div>
        <div class="search-results" id="global-search-results"></div>
        <div class="search-no-results" id="global-search-empty">
          <div style="font-size: 40px; margin-bottom: 10px;">🔍</div>
          No results found for your query. Try searching another term.
        </div>
        <div class="search-suggestions-container" id="global-search-suggestions">
          <div class="search-suggestions-title">Popular Searches</div>
          <div class="popular-tags">
            <span class="popular-tag">House Wiring</span>
            <span class="popular-tag">CCTV Camera</span>
            <span class="popular-tag">MCB Tripping</span>
            <span class="popular-tag">LED Lighting</span>
            <span class="popular-tag">Biometric Access</span>
            <span class="popular-tag">Smart Locks</span>
            <span class="popular-tag">Conduit Pipes</span>
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

  if (searchBtn) searchBtn.addEventListener('click', openSearch);
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
});
