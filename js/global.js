// DecorateNow - Global UI, Mega Menu, Search Suggestions, Toasts and Theme Toggle

document.addEventListener("DOMContentLoaded", () => {
    // 1. Initialise dark mode theme state
    initThemeManager();

    // 2. Inject Cart Drawer HTML structure
    injectCartDrawer();

    // 3. Inject Mobile Nav Drawer structure
    injectMobileNavDrawer();

    // 4. Inject Bottom Navigation Bar on Mobile
    injectBottomNavBar();

    // 5. Setup Dynamic Mega Menu details
    setupMegaMenu();

    // 6. Setup Navbar interactions: search suggestion events, mobile click events, etc.
    initNavbarInteractions();

    // 7. Highlight active menu links
    highlightActiveLinks();

    // 8. Initial sync of cart count bubble
    updateCartBubble();

    // Listen for cart modifications to trigger UI rerender
    window.addEventListener('cartUpdated', () => {
        updateCartBubble();
        renderCartDrawerItems();
    });
});

// Theme Toggle Manager (Light & Dark Luxury Modes)
function initThemeManager() {
    // Check local storage or default to light theme
    const activeTheme = localStorage.getItem('decoratenow_theme') || 'light';
    if (activeTheme === 'dark') {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }

    // Insert theme switcher button inside desktop and mobile header if not present
    const header = document.querySelector('header div.flex.items-center');
    if (header && !document.getElementById('theme-toggle-btn')) {
        const toggleBtn = document.createElement('button');
        toggleBtn.id = 'theme-toggle-btn';
        toggleBtn.className = 'text-on-surface hover:text-primary transition-colors flex items-center justify-center p-2 rounded-full hover:bg-surface-container-low';
        toggleBtn.setAttribute('aria-label', 'Toggle Dark Mode');
        toggleBtn.innerHTML = `
            <span class="material-symbols-outlined theme-icon-sun hidden">light_mode</span>
            <span class="material-symbols-outlined theme-icon-moon">dark_mode</span>
        `;
        
        // Put it right before profile or cart button
        const cartBtn = header.querySelector('[aria-label="Cart"]') || header.querySelector('button:nth-child(2)');
        if (cartBtn) {
            header.insertBefore(toggleBtn, cartBtn);
        } else {
            header.appendChild(toggleBtn);
        }

        updateThemeIcon();

        toggleBtn.addEventListener('click', () => {
            const isDark = document.documentElement.classList.toggle('dark');
            localStorage.setItem('decoratenow_theme', isDark ? 'dark' : 'light');
            updateThemeIcon();
            // Dispatch event so subpages can update if needed
            window.dispatchEvent(new CustomEvent('themeChanged', { detail: isDark ? 'dark' : 'light' }));
        });
    }
}

function updateThemeIcon() {
    const sunIcon = document.querySelector('.theme-icon-sun');
    const moonIcon = document.querySelector('.theme-icon-moon');
    if (!sunIcon || !moonIcon) return;

    if (document.documentElement.classList.contains('dark')) {
        sunIcon.classList.remove('hidden');
        moonIcon.classList.add('hidden');
    } else {
        sunIcon.classList.add('hidden');
        moonIcon.classList.remove('hidden');
    }
}

// Set up CSS dynamic Mega Menu
function setupMegaMenu() {
    const nav = document.querySelector('header nav');
    if (!nav) return;

    // Redraw the desktop navigation to use mega menu wrappers
    nav.className = 'hidden md:flex gap-lg h-full items-center';
    
    // We define categories and child menu items
    const menuData = {
        'Lighting': [
            { name: 'LED Wall Lamps', href: 'shop.html?category=wall-lamps' },
            { name: 'Ceiling Lamps', href: 'shop.html?category=ceiling-lamps' },
            { name: 'Chandeliers (Jhumar)', href: 'shop.html?category=chandeliers' },
            { name: 'Pendant Lights', href: 'shop.html?category=lighting' },
            { name: 'Table Lamps', href: 'shop.html?category=table-lamps' },
            { name: 'Floor Lamps', href: 'shop.html?category=floor-lamps' },
            { name: 'Outdoor Decorative Lights', href: 'shop.html?category=outdoor' }
        ],
        'Switches': [
            { name: 'Designer Switches', href: 'shop.html?category=switches' },
            { name: 'Brass Toggle Switches', href: 'shop.html?category=switches' },
            { name: 'Smart Dimmers', href: 'shop.html?category=smarthome' },
            { name: 'Switch Accessories', href: 'shop.html?category=switches' }
        ],
        'Smart Home': [
            { name: 'Smart Dimmer Panels', href: 'shop.html?category=smarthome' },
            { name: 'Accent LED Strips', href: 'shop.html?category=smarthome' },
            { name: 'Smart Motion Sensors', href: 'shop.html?category=smarthome' }
        ],
        'Decor': [
            { name: 'Wall Decor', href: 'shop.html?category=decor' },
            { name: 'Decorative Items', href: 'shop.html?category=decor' },
            { name: 'Minimalist Vases', href: 'shop.html?category=decor' }
        ]
    };

    nav.innerHTML = Object.keys(menuData).map(catName => {
        const subItems = menuData[catName];
        return `
            <div class="relative h-full flex items-center mega-menu-trigger group/menu">
                <button class="text-secondary group-hover/menu:text-primary transition-colors flex items-center gap-1 font-semibold py-4 focus:outline-none">
                    ${catName}
                    <span class="material-symbols-outlined text-sm transition-transform group-hover/menu:rotate-180">expand_more</span>
                </button>
                <!-- Mega Dropdown Panel -->
                <div class="mega-menu-panel absolute top-full left-1/2 transform -translate-x-1/2 w-[320px] bg-surface-container-lowest border border-outline-variant rounded-lg shadow-xl p-4 z-50 text-left">
                    <div class="grid grid-cols-1 gap-2">
                        <div class="font-label-md text-label-md text-outline uppercase tracking-wider mb-1">${catName} Collections</div>
                        ${subItems.map(item => `
                            <a href="${item.href}" class="font-body-md text-body-md text-on-surface hover:text-primary hover:bg-surface-container px-3 py-2 rounded-DEFAULT transition-all flex justify-between items-center group/item">
                                <span>${item.name}</span>
                                <span class="material-symbols-outlined text-sm opacity-0 group-hover/item:opacity-100 transition-opacity">arrow_forward</span>
                            </a>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

// Navbar Interactions: mobile menus, search panel, search autocompletes
function initNavbarInteractions() {
    const buttons = document.querySelectorAll('header button, header a');
    buttons.forEach(btn => {
        if (btn.innerHTML.includes('shopping_cart') || btn.getAttribute('aria-label') === 'Cart') {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                openCartDrawer();
            });
        }
        if (btn.innerHTML.includes('menu') || btn.getAttribute('aria-label') === 'Menu') {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                openMobileNav();
            });
        }
        if (btn.innerHTML.includes('search') || btn.getAttribute('aria-label') === 'Search') {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                toggleSearchBar();
            });
        }
    });
}

// Smart Search Dropdown panel
function toggleSearchBar() {
    let searchContainer = document.getElementById('global-search-container');
    if (!searchContainer) {
        searchContainer = document.createElement('div');
        searchContainer.id = 'global-search-container';
        searchContainer.className = 'max-w-container-max mx-auto px-gutter py-3 bg-surface-container border-b border-outline-variant hidden relative z-40';
        searchContainer.innerHTML = `
            <div class="flex items-center border border-outline rounded-DEFAULT bg-surface-container-lowest px-3 py-2">
                <span class="material-symbols-outlined text-secondary mr-2">search</span>
                <input id="global-search-field" type="text" placeholder="Search LED Wall Lamps, Chandeliers, Smart Switches..." class="w-full bg-transparent border-none focus:ring-0 text-on-surface font-body-md" />
                <button id="close-search-btn" class="text-secondary hover:text-primary transition-colors flex items-center">
                    <span class="material-symbols-outlined text-lg">close</span>
                </button>
            </div>
            <!-- Search Suggestions Dropdown Panel -->
            <div id="search-suggestions" class="absolute left-gutter right-gutter mt-2 bg-surface-container-lowest border border-outline-variant rounded-lg shadow-xl z-50 p-4 hidden max-h-[300px] overflow-y-auto">
                <!-- suggestions lists -->
            </div>
        `;
        const header = document.querySelector('header');
        header.insertAdjacentElement('afterend', searchContainer);

        // Bind events
        document.getElementById('close-search-btn').addEventListener('click', () => {
            searchContainer.classList.add('hidden');
        });

        const field = document.getElementById('global-search-field');
        field.addEventListener('input', (e) => {
            renderSearchSuggestions(e.target.value);
        });

        field.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const query = e.target.value.trim();
                if (query) {
                    searchContainer.classList.add('hidden');
                    window.location.href = `shop.html?q=${encodeURIComponent(query)}`;
                }
            }
        });
    }

    searchContainer.classList.toggle('hidden');
    if (!searchContainer.classList.contains('hidden')) {
        document.getElementById('global-search-field').focus();
    }
}

// Generate smart search suggestion dropdown content
function renderSearchSuggestions(val) {
    const panel = document.getElementById('search-suggestions');
    if (!panel) return;

    const query = val.toLowerCase().trim();
    if (!query) {
        panel.classList.add('hidden');
        return;
    }

    // Mock search matching databases
    const categories = [
        { name: 'LED Wall Lamps', href: 'shop.html?category=wall-lamps' },
        { name: 'Ceiling Lamps', href: 'shop.html?category=ceiling-lamps' },
        { name: 'Chandeliers (Jhumar)', href: 'shop.html?category=chandeliers' },
        { name: 'Pendant Lights', href: 'shop.html?category=lighting' },
        { name: 'Table Lamps', href: 'shop.html?category=table-lamps' },
        { name: 'Floor Lamps', href: 'shop.html?category=floor-lamps' },
        { name: 'Outdoor Decorative Lights', href: 'shop.html?category=outdoor' },
        { name: 'Smart Home Switches', href: 'shop.html?category=smarthome' },
        { name: 'Designer Switches', href: 'shop.html?category=switches' }
    ];

    const products = [
        { name: 'Amber Pendant Light', price: '$245.00', id: 'modern-amber-pendant' },
        { name: 'Aura Minimalist Pendant', price: '$189.00', id: 'aura-minimalist-pendant' },
        { name: 'Lumina Brass Sconce', price: '$125.00', id: 'lumina-brass-sconce' },
        { name: 'Axis Industrial Chandelier', price: '$345.00', id: 'axis-industrial-chandelier' },
        { name: 'Vectra Floor Lamp', price: '$199.00', id: 'vectra-floor-lamp' },
        { name: 'Designer Matte Charcoal Switch', price: '$45.00', id: 'brushed-charcoal-switch' },
        { name: 'Brushed Brass Toggle Switch', price: '$55.00', id: 'brushed-brass-switch' },
        { name: 'Smart Dimmer Switch Panel', price: '$79.00', id: 'smart-dimmer-switch' },
        { name: 'Ceramic Vase (Amber accent)', price: '$49.00', id: 'minimalist-ceramic-vase' }
    ];

    const matchedCats = categories.filter(c => c.name.toLowerCase().includes(query));
    const matchedProducts = products.filter(p => p.name.toLowerCase().includes(query));

    if (matchedCats.length === 0 && matchedProducts.length === 0) {
        panel.innerHTML = `
            <div class="text-on-surface-variant text-body-md py-2 px-3">No matching categories or products found for "${val}"</div>
        `;
    } else {
        panel.innerHTML = `
            <div class="space-y-3">
                ${matchedCats.length > 0 ? `
                    <div>
                        <div class="font-label-md text-label-sm text-outline uppercase tracking-wider px-3 mb-1">Categories</div>
                        ${matchedCats.map(c => `
                            <a href="${c.href}" class="block text-on-surface hover:text-primary hover:bg-surface-container px-3 py-1.5 rounded text-body-md transition-colors">${c.name}</a>
                        `).join('')}
                    </div>
                ` : ''}
                
                ${matchedProducts.length > 0 ? `
                    <div>
                        <div class="font-label-md text-label-sm text-outline uppercase tracking-wider px-3 mb-1">Products</div>
                        ${matchedProducts.map(p => `
                            <a href="product.html?id=${p.id}" class="flex justify-between items-center text-on-surface hover:text-primary hover:bg-surface-container px-3 py-1.5 rounded text-body-md transition-colors">
                                <span>${p.name}</span>
                                <span class="font-label-md text-primary font-bold text-sm">${p.price}</span>
                            </a>
                        `).join('')}
                    </div>
                ` : ''}
            </div>
        `;
    }

    panel.classList.remove('hidden');
}

// Premium Toast Notification UI Handler
function showToast(message, type = 'success') {
    let container = document.getElementById('toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        // Responsive placements: top-right on desktop, bottom-center on mobile
        container.className = 'fixed top-4 right-4 md:top-6 md:right-6 z-50 flex flex-col gap-3 pointer-events-none w-full max-w-sm px-4 md:px-0';
        document.body.appendChild(container);
    }

    // Type details: colors, icons
    let typeConfig = {
        success: { color: 'bg-emerald-600 text-white', icon: 'check_circle' },
        error: { color: 'bg-rose-600 text-white', icon: 'error' },
        warning: { color: 'bg-amber-500 text-white', icon: 'warning' },
        info: { color: 'bg-blue-600 text-white', icon: 'info' }
    };

    const config = typeConfig[type] || typeConfig.success;

    const toast = document.createElement('div');
    // Slide-in for desktop and mobile slide-in-mobile
    toast.className = 'animate-slide-in md:animate-slide-in pointer-events-auto bg-surface-container-lowest border border-outline-variant shadow-2xl rounded-lg overflow-hidden flex flex-col w-full border-l-4 ' + 
                      (type === 'success' ? 'border-l-emerald-500' : type === 'error' ? 'border-l-rose-500' : type === 'warning' ? 'border-l-amber-500' : 'border-l-blue-500');

    toast.innerHTML = `
        <div class="px-5 py-4 flex items-start gap-3">
            <span class="material-symbols-outlined text-2xl ${type === 'success' ? 'text-emerald-500' : type === 'error' ? 'text-rose-500' : type === 'warning' ? 'text-amber-500' : 'text-blue-500'}">${config.icon}</span>
            <div class="flex-grow flex flex-col">
                <span class="font-label-md text-on-surface text-base">${message}</span>
            </div>
            <button class="text-secondary hover:text-on-surface transition-colors flex items-center p-1" onclick="this.closest('.animate-slide-in').remove()">
                <span class="material-symbols-outlined text-sm font-bold">close</span>
            </button>
        </div>
        <!-- Progress Bar -->
        <div class="toast-progress-bar"></div>
    `;

    container.appendChild(toast);

    // Adjust progress bar color
    const progress = toast.querySelector('.toast-progress-bar');
    if (type === 'success') progress.style.backgroundColor = '#10b981';
    else if (type === 'error') progress.style.backgroundColor = '#f43f5e';
    else if (type === 'warning') progress.style.backgroundColor = '#f59e0b';
    else progress.style.backgroundColor = '#3b82f6';

    // Auto remove toast after 3.5s
    setTimeout(() => {
        toast.classList.remove('animate-slide-in');
        toast.classList.add('animate-fade-out');
        toast.addEventListener('animationend', () => {
            toast.remove();
        });
    }, 3500);
}

// Expose showToast globally
window.showToast = showToast;
// Re-bind Cart engine's showToast to global showToast
if (window.Cart) {
    window.Cart.showToast = (msg) => showToast(msg, 'success');
}

// Side Cart Drawer panel structure injection
function injectCartDrawer() {
    if (document.getElementById('cart-drawer-wrapper')) return;

    const wrapper = document.createElement('div');
    wrapper.id = 'cart-drawer-wrapper';
    wrapper.className = 'fixed inset-0 z-50 pointer-events-none transition-opacity duration-300 opacity-0 hidden';
    wrapper.innerHTML = `
        <!-- Backdrop -->
        <div id="cart-drawer-backdrop" class="absolute inset-0 bg-inverse-surface/40 backdrop-blur-sm transition-opacity duration-300"></div>
        
        <!-- Drawer Panel -->
        <div id="cart-drawer-panel" class="fixed inset-y-0 right-0 pl-10 max-w-full flex transition-transform duration-300 ease-in-out transform translate-x-full pointer-events-auto">
            <div class="w-screen max-w-md bg-surface border-l border-outline-variant shadow-2xl flex flex-col h-full transition-theme">
                <!-- Header -->
                <div class="px-6 py-5 border-b border-outline-variant bg-surface-container flex items-center justify-between transition-theme">
                    <h3 class="font-headline-md text-headline-md text-on-surface flex items-center gap-2">
                        <span class="material-symbols-outlined">shopping_basket</span>
                        Your Cart
                    </h3>
                    <button id="close-cart-btn" class="text-secondary hover:text-primary transition-colors flex items-center p-1 rounded-full hover:bg-surface-container-high" aria-label="Close cart">
                        <span class="material-symbols-outlined">close</span>
                    </button>
                </div>

                <!-- Scrollable Item list -->
                <div id="cart-drawer-items" class="flex-1 overflow-y-auto p-6 space-y-4">
                    <!-- Dynamic Cart Items here -->
                </div>

                <!-- Footer Summary / Checkout actions -->
                <div class="border-t border-outline-variant p-6 bg-surface-container flex flex-col gap-4 transition-theme">
                    <!-- Loyalty Points display -->
                    <div id="loyalty-display" class="flex justify-between items-center text-sm font-label-sm bg-primary-container/10 text-on-primary-container p-3 rounded-DEFAULT hidden">
                        <span>Your Loyalty Points: <strong id="loyalty-points-val">0</strong></span>
                        <span class="text-xs text-outline">Redeemable at Checkout</span>
                    </div>

                    <!-- Coupon/Promo Code -->
                    <div class="flex gap-2">
                        <input id="cart-coupon-input" type="text" placeholder="Promo Code (DECOR20)" class="w-full bg-surface-container-lowest border border-outline rounded-DEFAULT px-3 py-2 text-on-surface font-body-md focus:ring-1 focus:ring-primary focus:border-primary transition-theme" />
                        <button id="apply-coupon-btn" class="bg-primary text-on-primary font-label-md px-4 py-2 rounded-DEFAULT hover:opacity-90 transition-opacity whitespace-nowrap">
                            Apply
                        </button>
                    </div>
                    <div id="applied-coupon-tag" class="hidden justify-between items-center bg-primary-container/20 text-on-primary-container px-3 py-2 rounded-DEFAULT text-sm font-label-sm">
                        <span class="flex items-center gap-1">
                            <span class="material-symbols-outlined text-sm">sell</span>
                            Code: <strong id="applied-coupon-code"></strong>
                        </span>
                        <button id="remove-coupon-btn" class="text-error hover:text-red-700 font-bold">Remove</button>
                    </div>

                    <!-- Pricing Summaries -->
                    <div class="flex flex-col gap-2 font-body-md text-body-md text-on-surface-variant">
                        <div class="flex justify-between">
                            <span>Subtotal</span>
                            <span id="drawer-subtotal">$0.00</span>
                        </div>
                        <div id="drawer-discount-row" class="flex justify-between text-primary font-semibold hidden">
                            <span>Discount</span>
                            <span id="drawer-discount">-$0.00</span>
                        </div>
                        <div class="flex justify-between">
                            <span>Est. Taxes (GST 18%)</span>
                            <span id="drawer-tax">$0.00</span>
                        </div>
                        <div class="flex justify-between">
                            <span>Shipping</span>
                            <span id="drawer-shipping">$0.00</span>
                        </div>
                        <div class="border-t border-outline-variant my-2 transition-theme"></div>
                        <div class="flex justify-between font-headline-md text-headline-md text-on-surface">
                            <span>Total</span>
                            <span id="drawer-total">$0.00</span>
                        </div>
                    </div>

                    <!-- Checkout Redirect buttons -->
                    <a id="checkout-btn" href="checkout.html" class="block w-full text-center bg-primary-container text-on-primary-container font-label-md text-label-md py-4 rounded-DEFAULT hover:bg-yellow-500 transition-colors shadow-sm font-bold mt-2">
                        Proceed to Checkout
                    </a>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(wrapper);

    document.getElementById('close-cart-btn').addEventListener('click', closeCartDrawer);
    document.getElementById('cart-drawer-backdrop').addEventListener('click', closeCartDrawer);

    document.getElementById('apply-coupon-btn').addEventListener('click', () => {
        const input = document.getElementById('cart-coupon-input');
        if (input.value.trim()) {
            const res = window.Cart.applyCoupon(input.value);
            if (!res.success) {
                showToast(res.message, 'error');
            }
            input.value = '';
        }
    });

    document.getElementById('remove-coupon-btn').addEventListener('click', () => {
        window.Cart.removeCoupon();
    });

    renderCartDrawerItems();
}

// Mobile Nav Drawer layout injection
function injectMobileNavDrawer() {
    if (document.getElementById('mobile-nav-wrapper')) return;

    const wrapper = document.createElement('div');
    wrapper.id = 'mobile-nav-wrapper';
    wrapper.className = 'fixed inset-0 z-50 pointer-events-none transition-opacity duration-300 opacity-0 hidden';
    wrapper.innerHTML = `
        <!-- Backdrop -->
        <div id="mobile-nav-backdrop" class="absolute inset-0 bg-inverse-surface/40 backdrop-blur-sm transition-opacity duration-300"></div>
        
        <!-- Drawer Panel -->
        <div id="mobile-nav-panel" class="fixed inset-y-0 left-0 pr-10 max-w-full flex transition-transform duration-300 ease-in-out transform -translate-x-full pointer-events-auto">
            <div class="w-screen max-w-xs md:max-w-sm bg-surface border-r border-outline-variant shadow-2xl flex flex-col h-full transition-theme">
                <!-- Header -->
                <div class="px-6 py-5 border-b border-outline-variant bg-surface-container flex items-center justify-between transition-theme">
                    <span class="font-headline-md text-headline-md text-on-surface">Menu</span>
                    <button id="close-mobile-btn" class="text-secondary hover:text-primary transition-colors flex items-center p-1 rounded-full hover:bg-surface-container-high" aria-label="Close menu">
                        <span class="material-symbols-outlined">close</span>
                    </button>
                </div>

                <!-- Mobile Navigation List -->
                <nav class="flex-1 p-6 flex flex-col gap-2 overflow-y-auto">
                    <div class="font-label-md text-label-sm text-outline uppercase tracking-wider mb-2">Categories</div>
                    
                    <a class="py-2.5 px-3 rounded hover:bg-surface-container text-on-surface hover:text-primary transition-all flex justify-between items-center" href="shop.html?category=wall-lamps">
                        <span>LED Wall Lamps</span>
                        <span class="material-symbols-outlined text-sm">chevron_right</span>
                    </a>
                    <a class="py-2.5 px-3 rounded hover:bg-surface-container text-on-surface hover:text-primary transition-all flex justify-between items-center" href="shop.html?category=ceiling-lamps">
                        <span>Ceiling Lamps</span>
                        <span class="material-symbols-outlined text-sm">chevron_right</span>
                    </a>
                    <a class="py-2.5 px-3 rounded hover:bg-surface-container text-on-surface hover:text-primary transition-all flex justify-between items-center" href="shop.html?category=chandeliers">
                        <span>Chandeliers (Jhumar)</span>
                        <span class="material-symbols-outlined text-sm">chevron_right</span>
                    </a>
                    <a class="py-2.5 px-3 rounded hover:bg-surface-container text-on-surface hover:text-primary transition-all flex justify-between items-center" href="shop.html?category=lighting">
                        <span>Pendant Lights</span>
                        <span class="material-symbols-outlined text-sm">chevron_right</span>
                    </a>
                    <a class="py-2.5 px-3 rounded hover:bg-surface-container text-on-surface hover:text-primary transition-all flex justify-between items-center" href="shop.html?category=table-lamps">
                        <span>Table Lamps</span>
                        <span class="material-symbols-outlined text-sm">chevron_right</span>
                    </a>
                    <a class="py-2.5 px-3 rounded hover:bg-surface-container text-on-surface hover:text-primary transition-all flex justify-between items-center" href="shop.html?category=floor-lamps">
                        <span>Floor Lamps</span>
                        <span class="material-symbols-outlined text-sm">chevron_right</span>
                    </a>
                    <a class="py-2.5 px-3 rounded hover:bg-surface-container text-on-surface hover:text-primary transition-all flex justify-between items-center" href="shop.html?category=switches">
                        <span>Switches & Accessories</span>
                        <span class="material-symbols-outlined text-sm">chevron_right</span>
                    </a>
                    <a class="py-2.5 px-3 rounded hover:bg-surface-container text-on-surface hover:text-primary transition-all flex justify-between items-center" href="shop.html?category=smarthome">
                        <span>Smart Home Solutions</span>
                        <span class="material-symbols-outlined text-sm">chevron_right</span>
                    </a>
                    <a class="py-2.5 px-3 rounded hover:bg-surface-container text-on-surface hover:text-primary transition-all flex justify-between items-center" href="shop.html?category=decor">
                        <span>Wall Decor & Vases</span>
                        <span class="material-symbols-outlined text-sm">chevron_right</span>
                    </a>
                    <a class="py-2.5 px-3 rounded hover:bg-surface-container text-on-surface hover:text-primary transition-all flex justify-between items-center" href="shop.html?category=outdoor">
                        <span>Outdoor Decorative Lights</span>
                        <span class="material-symbols-outlined text-sm">chevron_right</span>
                    </a>
                </nav>

                <!-- Customer options -->
                <div class="p-6 border-t border-outline-variant bg-surface-container-low flex flex-col gap-3 font-body-md text-body-md text-on-surface-variant transition-theme">
                    <a class="hover:text-primary flex items-center gap-2" href="dashboard.html">
                        <span class="material-symbols-outlined text-lg">dashboard</span>
                        My Dashboard / Orders
                    </a>
                    <a class="hover:text-primary flex items-center gap-2" href="checkout.html">
                        <span class="material-symbols-outlined text-lg">credit_card</span>
                        Checkout
                    </a>
                    <p class="text-sm mt-2 text-outline">© 2024 DecorateNow</p>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(wrapper);

    document.getElementById('close-mobile-btn').addEventListener('click', closeMobileNav);
    document.getElementById('mobile-nav-backdrop').addEventListener('click', closeMobileNav);
}

// Drawer Open/Close Helpers
function openCartDrawer() {
    const wrapper = document.getElementById('cart-drawer-wrapper');
    const panel = document.getElementById('cart-drawer-panel');
    
    wrapper.classList.remove('hidden');
    setTimeout(() => {
        wrapper.classList.remove('opacity-0');
        wrapper.classList.add('pointer-events-auto');
        panel.classList.remove('translate-x-full');
    }, 10);

    renderCartDrawerItems();
}

function closeCartDrawer() {
    const wrapper = document.getElementById('cart-drawer-wrapper');
    const panel = document.getElementById('cart-drawer-panel');

    panel.classList.add('translate-x-full');
    wrapper.classList.remove('pointer-events-auto');
    wrapper.classList.add('opacity-0');
    
    setTimeout(() => {
        wrapper.classList.add('hidden');
    }, 300);
}

function openMobileNav() {
    const wrapper = document.getElementById('mobile-nav-wrapper');
    const panel = document.getElementById('mobile-nav-panel');

    wrapper.classList.remove('hidden');
    setTimeout(() => {
        wrapper.classList.remove('opacity-0');
        wrapper.classList.add('pointer-events-auto');
        panel.classList.remove('-translate-x-full');
    }, 10);
}

function closeMobileNav() {
    const wrapper = document.getElementById('mobile-nav-wrapper');
    const panel = document.getElementById('mobile-nav-panel');

    panel.classList.add('-translate-x-full');
    wrapper.classList.remove('pointer-events-auto');
    wrapper.classList.add('opacity-0');

    setTimeout(() => {
        wrapper.classList.add('hidden');
    }, 300);
}

// Sync cart counter values
function updateCartBubble() {
    const bubbles = document.querySelectorAll('header span.absolute.bg-primary-container, header span.rounded-full, header span[style*="absolute"], .bottom-cart-badge');
    const count = window.Cart ? window.Cart.getCount() : 0;
    
    bubbles.forEach(bubble => {
        bubble.textContent = count;
        if (count === 0) {
            bubble.classList.add('hidden');
        } else {
            bubble.classList.remove('hidden');
        }
    });
}

// Render dynamic elements inside Cart drawer
function renderCartDrawerItems() {
    const container = document.getElementById('cart-drawer-items');
    if (!container) return;

    if (!window.Cart) return;

    const items = window.Cart.get();
    
    // Sync points display
    const loyaltyDisplay = document.getElementById('loyalty-display');
    const pointsVal = document.getElementById('loyalty-points-val');
    if (loyaltyDisplay && pointsVal) {
        const pts = window.Cart.getLoyaltyPoints ? window.Cart.getLoyaltyPoints() : 0;
        pointsVal.textContent = pts;
        if (pts > 0 && items.length > 0) {
            loyaltyDisplay.classList.remove('hidden');
        } else {
            loyaltyDisplay.classList.add('hidden');
        }
    }

    if (items.length === 0) {
        container.innerHTML = `
            <div class="flex flex-col items-center justify-center py-12 text-center h-full">
                <span class="material-symbols-outlined text-outline text-6xl mb-4" style="font-variation-settings: 'FILL' 0;">shopping_cart</span>
                <p class="font-headline-md text-headline-md text-on-surface mb-2">Your cart is empty</p>
                <p class="font-body-md text-body-md text-on-surface-variant max-w-xs mb-6">Explore our curated collections to find beautiful home designs.</p>
                <a href="shop.html" class="bg-primary text-on-primary font-label-md px-6 py-3 rounded-DEFAULT hover:opacity-90 transition-opacity">
                    Shop Products
                </a>
            </div>
        `;
        document.getElementById('checkout-btn').classList.add('opacity-50', 'pointer-events-none');
        document.getElementById('applied-coupon-tag').classList.add('hidden');
        document.getElementById('drawer-discount-row').classList.add('hidden');
        
        document.getElementById('drawer-subtotal').textContent = '$0.00';
        document.getElementById('drawer-tax').textContent = '$0.00';
        document.getElementById('drawer-shipping').textContent = '$0.00';
        document.getElementById('drawer-total').textContent = '$0.00';
        return;
    }

    document.getElementById('checkout-btn').classList.remove('opacity-50', 'pointer-events-none');

    container.innerHTML = items.map(item => `
        <div class="flex gap-4 bg-surface-container-lowest border border-outline-variant p-4 rounded-lg items-center relative group transition-theme">
            <img src="${item.image}" alt="${item.name}" class="h-20 w-16 object-cover bg-surface-container rounded-sm flex-shrink-0" />
            <div class="flex-grow flex flex-col">
                <h4 class="font-label-md text-on-surface text-base line-clamp-1">${item.name}</h4>
                <p class="text-xs text-on-surface-variant mb-2">${item.details || 'Standard Finish'}</p>
                <div class="flex items-center gap-3">
                    <div class="flex items-center border border-outline rounded-DEFAULT bg-surface transition-theme">
                        <button class="px-2 py-0.5 hover:text-primary text-secondary transition-colors" onclick="window.Cart.updateQuantity('${item.id}', ${item.quantity - 1})">-</button>
                        <span class="px-3 text-sm font-label-sm font-semibold">${item.quantity}</span>
                        <button class="px-2 py-0.5 hover:text-primary text-secondary transition-colors" onclick="window.Cart.updateQuantity('${item.id}', ${item.quantity + 1})">+</button>
                    </div>
                    <span class="font-label-md text-primary">$${(item.price * item.quantity).toFixed(2)}</span>
                </div>
            </div>
            <button class="absolute top-3 right-3 text-secondary hover:text-error transition-colors" onclick="window.Cart.updateQuantity('${item.id}', 0)" aria-label="Remove item">
                <span class="material-symbols-outlined text-lg">delete</span>
            </button>
        </div>
    `).join('');

    // Update prices (using Indian GST rate 18% as requested)
    const subtotal = window.Cart.getSubtotal();
    const discount = window.Cart.getDiscount();
    const tax = window.Cart.getTax(); // Tax helper in cart.js will calculate properly
    const shipping = window.Cart.getShipping();
    const total = window.Cart.getTotal();

    document.getElementById('drawer-subtotal').textContent = `$${subtotal.toFixed(2)}`;
    
    const coupon = window.Cart.getCoupon();
    if (coupon) {
        document.getElementById('applied-coupon-tag').classList.remove('hidden');
        document.getElementById('applied-coupon-tag').classList.add('flex');
        document.getElementById('applied-coupon-code').textContent = `${coupon.code} (${coupon.type === 'percent' ? coupon.value + '%' : '$' + coupon.value} Off)`;
        document.getElementById('drawer-discount-row').classList.remove('hidden');
        document.getElementById('drawer-discount').textContent = `-$${discount.toFixed(2)}`;
        document.getElementById('cart-coupon-input').classList.add('hidden');
        document.getElementById('apply-coupon-btn').classList.add('hidden');
    } else {
        document.getElementById('applied-coupon-tag').classList.add('hidden');
        document.getElementById('applied-coupon-tag').classList.remove('flex');
        document.getElementById('drawer-discount-row').classList.add('hidden');
        document.getElementById('cart-coupon-input').classList.remove('hidden');
        document.getElementById('apply-coupon-btn').classList.remove('hidden');
    }

    document.getElementById('drawer-tax').textContent = `$${tax.toFixed(2)}`;
    document.getElementById('drawer-shipping').textContent = shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`;
    document.getElementById('drawer-total').textContent = `$${total.toFixed(2)}`;
}

// Active link highlighting
function highlightActiveLinks() {
    const navLinks = document.querySelectorAll('header nav a, #mobile-nav-panel nav a');
    const path = window.location.pathname;

    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (!href) return;

        link.classList.remove('text-primary', 'font-bold', 'border-b-2', 'border-primary');
        link.classList.add('text-secondary');

        if (
            (path.endsWith('/') || path.endsWith('index.html')) && (href.includes('index.html')) ||
            (path.includes('shop.html') && href.includes('shop.html')) ||
            (path.includes('product.html') && href.includes('shop.html'))
        ) {
            link.classList.remove('text-secondary');
            link.classList.add('text-primary', 'font-bold', 'border-b-2', 'border-primary');
        }
    });
}

function injectBottomNavBar() {
    if (document.getElementById('bottom-navigation-bar')) return;

    const navBar = document.createElement('div');
    navBar.id = 'bottom-navigation-bar';
    navBar.className = 'md:hidden fixed bottom-0 left-0 right-0 bg-surface border-t border-outline-variant z-50 flex justify-around py-2 transition-theme shadow-[0_-4px_10px_rgba(0,0,0,0.05)]';
    
    const path = window.location.pathname;
    const isHome = path.endsWith('index.html') || path.endsWith('/');
    const isShop = path.includes('shop.html');
    const isDashboard = path.includes('dashboard.html');

    navBar.innerHTML = `
        <a href="index.html" class="flex flex-col items-center gap-0.5 text-xs ${isHome ? 'text-primary font-bold' : 'text-secondary hover:text-primary'}">
            <span class="material-symbols-outlined text-[24px]">home</span>
            <span class="text-[10px] font-label-md">Home</span>
        </a>
        <a href="shop.html" class="flex flex-col items-center gap-0.5 text-xs ${isShop ? 'text-primary font-bold' : 'text-secondary hover:text-primary'}">
            <span class="material-symbols-outlined text-[24px]">storefront</span>
            <span class="text-[10px] font-label-md">Shop</span>
        </a>
        <button id="bottom-nav-menu-btn" class="flex flex-col items-center gap-0.5 text-xs text-secondary hover:text-primary">
            <span class="material-symbols-outlined text-[24px]">category</span>
            <span class="text-[10px] font-label-md">Categories</span>
        </button>
        <a href="dashboard.html" class="flex flex-col items-center gap-0.5 text-xs ${isDashboard ? 'text-primary font-bold' : 'text-secondary hover:text-primary'}">
            <span class="material-symbols-outlined text-[24px]">person</span>
            <span class="text-[10px] font-label-md">Account</span>
        </a>
        <button id="bottom-nav-cart-btn" class="flex flex-col items-center gap-0.5 text-xs text-secondary hover:text-primary relative">
            <span class="material-symbols-outlined text-[24px]">shopping_cart</span>
            <span class="absolute top-0 right-3 bg-primary-container text-on-primary-container text-[9px] font-bold h-3.5 w-3.5 rounded-full flex items-center justify-center hidden bottom-cart-badge">0</span>
            <span class="text-[10px] font-label-md">Cart</span>
        </button>
    `;
    document.body.appendChild(navBar);
    document.body.classList.add('pb-16', 'md:pb-0');

    // Bind event listeners
    document.getElementById('bottom-nav-menu-btn').addEventListener('click', (e) => {
        e.preventDefault();
        openMobileNav();
    });
    document.getElementById('bottom-nav-cart-btn').addEventListener('click', (e) => {
        e.preventDefault();
        openCartDrawer();
    });
}
