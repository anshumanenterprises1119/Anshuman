/**
 * Anshuman Enterprises PWA Super App Engine
 * Version: 2.5
 * Core Controller for Multi-Vertical Transitions, PWA Features, & DecorateNow Integration
 */

(function () {
  'use strict';

  // --- STATE MANAGEMENT ---
  const state = {
    activeVertical: 'home',
    cart: JSON.parse(localStorage.getItem('ae_decor_cart') || '[]'),
    wishlist: JSON.parse(localStorage.getItem('ae_decor_wishlist') || '[]'),
    deferredPrompt: null
  };

  const VERTICALS = {
    home: {
      title: 'Anshuman Enterprises | Corporate Luxury & Wholesale Leader',
      theme: 'home',
      searchPlaceholder: 'Search company info, founder, history, projects...',
      themeColor: '#3d0e14'
    },
    store: {
      title: 'Wholesale Electrical Store | Polycab, Havells, Anchor, L&T',
      theme: 'store',
      searchPlaceholder: 'Search wholesale cables, switches, MCBs, DB boxes...',
      themeColor: '#6b1c23'
    },
    services: {
      title: 'Engineering & CCTV Solutions | Anshuman Enterprises',
      theme: 'services',
      searchPlaceholder: 'Search CCTV installation, biometrics, AMC plans...',
      themeColor: '#121212'
    },
    decoratenow: {
      title: 'DecorateNow | Luxury Lighting & Home Decor E-Commerce',
      theme: 'decoratenow',
      searchPlaceholder: 'Search luxury lights, pendants, chandeliers, decor...',
      themeColor: '#1e293b'
    }
  };

  // --- INITIALIZATION ---
  document.addEventListener('DOMContentLoaded', () => {
    initPWA();
    initNavigation();
    initSearchEngine();
    initDecorateNowCart();
    detectInitialVertical();
  });

  // --- 1. PWA REGISTRATION & PROMPT ---
  function initPWA() {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
          .then((reg) => console.log('[PWA] Service Worker registered:', reg.scope))
          .catch((err) => console.warn('[PWA] SW registration failed:', err));
      });
    }

    // Capture install prompt
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      state.deferredPrompt = e;
      const installBtn = document.getElementById('pwaInstallBtn');
      if (installBtn) installBtn.style.display = 'inline-flex';
    });

    const installBtn = document.getElementById('pwaInstallBtn');
    if (installBtn) {
      installBtn.addEventListener('click', async () => {
        if (state.deferredPrompt) {
          state.deferredPrompt.prompt();
          const choice = await state.deferredPrompt.userChoice;
          if (choice.outcome === 'accepted') {
            console.log('[PWA] User accepted installation');
          }
          state.deferredPrompt = null;
          installBtn.style.display = 'none';
        }
      });
    }
  }

  // --- 2. MULTI-VERTICAL MODULE SWITCHER ---
  function detectInitialVertical() {
    const hash = window.location.hash.replace('#', '').toLowerCase();
    const path = window.location.pathname.toLowerCase();

    if (hash && VERTICALS[hash]) {
      switchVertical(hash, false);
    } else if (path.includes('products') || path.includes('wires') || path.includes('modular')) {
      switchVertical('store', false);
    } else if (path.includes('services') || path.includes('cctv') || path.includes('commercial')) {
      switchVertical('services', false);
    } else if (path.includes('decoratenow')) {
      switchVertical('decoratenow', false);
    } else {
      switchVertical('home', false);
    }
  }

  window.switchVertical = function (verticalId, updateHistory = true) {
    if (!VERTICALS[verticalId]) verticalId = 'home';
    state.activeVertical = verticalId;

    const config = VERTICALS[verticalId];

    // 1. Update Body Theme Attribute
    document.documentElement.setAttribute('data-vertical', verticalId);
    document.body.setAttribute('data-vertical', verticalId);

    // 2. Meta Theme Color
    let metaTheme = document.querySelector('meta[name="theme-color"]');
    if (!metaTheme) {
      metaTheme = document.createElement('meta');
      metaTheme.name = 'theme-color';
      document.head.appendChild(metaTheme);
    }
    metaTheme.content = config.themeColor;

    // 3. Document Title
    document.title = config.title;

    // 4. Smooth Section Fade/Slide Transition
    const sections = document.querySelectorAll('.superapp-vertical-section');
    sections.forEach((sec) => {
      if (sec.id === `vertical-${verticalId}`) {
        sec.style.display = 'block';
        setTimeout(() => {
          sec.classList.add('active-vertical');
          sec.style.opacity = '1';
        }, 30);
      } else {
        sec.classList.remove('active-vertical');
        sec.style.opacity = '0';
        setTimeout(() => {
          sec.style.display = 'none';
        }, 250);
      }
    });

    // 5. Update Search Input Placeholder & Context
    const searchInput = document.getElementById('globalAppSearch');
    if (searchInput) {
      searchInput.placeholder = config.searchPlaceholder;
      searchInput.setAttribute('data-context', verticalId);
    }

    // 6. Update Active State in Navigation Bars
    updateNavActiveStates(verticalId);

    // 7. Update Browser History URL hash if requested
    if (updateHistory) {
      history.pushState({ vertical: verticalId }, config.title, `#${verticalId}`);
    }

    // Scroll to top of app view smoothly
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  function updateNavActiveStates(verticalId) {
    // Desktop Nav
    document.querySelectorAll('.desktop-nav-link').forEach((el) => {
      const target = el.getAttribute('data-target');
      if (target === verticalId) {
        el.classList.add('active');
      } else {
        el.classList.remove('active');
      }
    });

    // Mobile Top Category Bar Pills
    document.querySelectorAll('.cat-pill').forEach((el) => {
      const target = el.getAttribute('data-target');
      if (target === verticalId) {
        el.classList.add('active');
        // Scroll pill into view
        el.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      } else {
        el.classList.remove('active');
      }
    });

    // Mobile Bottom Nav Items
    document.querySelectorAll('.bottom-nav-item').forEach((el) => {
      const target = el.getAttribute('data-target');
      if (target === verticalId) {
        el.classList.add('active');
      } else {
        el.classList.remove('active');
      }
    });
  }

  // Listen to browser Back/Forward navigation
  window.addEventListener('popstate', (e) => {
    if (e.state && e.state.vertical) {
      switchVertical(e.state.vertical, false);
    } else {
      detectInitialVertical();
    }
  });

  // --- 3. NAVIGATION BINDINGS ---
  function initNavigation() {
    // Top Nav Links
    document.addEventListener('click', (e) => {
      const targetLink = e.target.closest('[data-target]');
      if (targetLink) {
        const verticalId = targetLink.getAttribute('data-target');
        if (VERTICALS[verticalId]) {
          e.preventDefault();
          switchVertical(verticalId, true);
        }
      }
    });
  }

  // --- 4. DYNAMIC VERTICAL-AWARE SEARCH ---
  function initSearchEngine() {
    const searchInput = document.getElementById('globalAppSearch');
    const searchResultsBox = document.getElementById('globalSearchResults');

    if (!searchInput || !searchResultsBox) return;

    searchInput.addEventListener('input', (e) => {
      const query = e.target.value.trim().toLowerCase();
      const context = state.activeVertical;

      if (query.length < 2) {
        searchResultsBox.style.display = 'none';
        searchResultsBox.innerHTML = '';
        return;
      }

      // Filter search database if search_data.js loaded
      if (window.SITE_SEARCH_DATA) {
        const results = window.SITE_SEARCH_DATA.filter((item) => {
          const matchQuery = item.title.toLowerCase().includes(query) ||
            item.category.toLowerCase().includes(query) ||
            (item.description && item.description.toLowerCase().includes(query));
          
          if (context === 'store') {
            return matchQuery && (item.type === 'product' || item.brand);
          } else if (context === 'services') {
            return matchQuery && (item.type === 'service' || item.category.includes('cctv') || item.category.includes('electrical'));
          } else if (context === 'decoratenow') {
            return matchQuery && (item.category.includes('decor') || item.category.includes('light') || item.type === 'decor');
          }
          return matchQuery;
        }).slice(0, 6);

        renderSearchResults(results, searchResultsBox);
      }
    });
  }

  function renderSearchResults(results, container) {
    if (results.length === 0) {
      container.innerHTML = '<div class="search-no-results">No matches found. Try another search term.</div>';
    } else {
      container.innerHTML = results.map((item) => `
        <a href="${item.url || '#'}" class="search-result-item" onclick="if(this.getAttribute('href')==='#'){switchVertical('${item.vertical || 'store'}'); return false;}">
          <div class="search-item-badge">${item.category || item.brand || 'Item'}</div>
          <div class="search-item-info">
            <div class="search-item-title">${item.title}</div>
            <div class="search-item-sub">${item.price ? '₹' + item.price : item.description || ''}</div>
          </div>
        </a>
      `).join('');
    }
    container.style.display = 'block';
  }

  // --- 5. DECORATENOW SHOPPING CART & WISHLIST ---
  function initDecorateNowCart() {
    updateCartBadge();

    window.addToCart = function (id, title, price, img) {
      const existing = state.cart.find((i) => i.id === id);
      if (existing) {
        existing.qty += 1;
      } else {
        state.cart.push({ id, title, price, img, qty: 1 });
      }
      saveCart();
      openCartDrawer();
    };

    window.toggleWishlist = function (id, title, price, img) {
      const idx = state.wishlist.findIndex((w) => w.id === id);
      if (idx > -1) {
        state.wishlist.splice(idx, 1);
      } else {
        state.wishlist.push({ id, title, price, img });
      }
      localStorage.setItem('ae_decor_wishlist', JSON.stringify(state.wishlist));
      alert(`${title} added to Wishlist!`);
    };

    window.openCartDrawer = function () {
      const drawer = document.getElementById('cartDrawer');
      if (drawer) {
        renderCartItems();
        drawer.classList.add('open');
      }
    };

    window.closeCartDrawer = function () {
      const drawer = document.getElementById('cartDrawer');
      if (drawer) drawer.classList.remove('open');
    };
  }

  function saveCart() {
    localStorage.setItem('ae_decor_cart', JSON.stringify(state.cart));
    updateCartBadge();
  }

  function updateCartBadge() {
    const badges = document.querySelectorAll('.cart-badge');
    const count = state.cart.reduce((total, i) => total + i.qty, 0);
    badges.forEach((b) => {
      b.textContent = count;
      b.style.display = count > 0 ? 'inline-flex' : 'none';
    });
  }

  function renderCartItems() {
    const container = document.getElementById('cartItemsList');
    const totalEl = document.getElementById('cartTotalAmount');

    if (!container) return;

    if (state.cart.length === 0) {
      container.innerHTML = '<div class="empty-cart">Your cart is empty. Explore DecorateNow items!</div>';
      if (totalEl) totalEl.textContent = '₹0';
      return;
    }

    let grandTotal = 0;
    container.innerHTML = state.cart.map((item, idx) => {
      const itemTotal = item.price * item.qty;
      grandTotal += itemTotal;
      return `
        <div class="cart-item-row">
          <img src="${item.img}" alt="${item.title}" class="cart-item-img">
          <div class="cart-item-details">
            <div class="cart-item-title">${item.title}</div>
            <div class="cart-item-price">₹${item.price} x ${item.qty} = ₹${itemTotal}</div>
          </div>
          <button class="cart-item-remove" onclick="removeCartItem(${idx})">✕</button>
        </div>
      `;
    }).join('');

    if (totalEl) totalEl.textContent = '₹' + grandTotal;
  }

  window.removeCartItem = function (index) {
    state.cart.splice(index, 1);
    saveCart();
    renderCartItems();
  };

  window.triggerCheckout = function () {
    if (state.cart.length === 0) {
      alert('Your cart is empty!');
      return;
    }
    alert('Redirecting to Secure Checkout...');
    window.location.href = '/ecommerce-platform';
  };

})();
