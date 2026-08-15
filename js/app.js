/* =========================================================
   DecorateNow — app.js
   Product data, rendering, background-removal processing,
   and all interactive behaviour.
   Vanilla JS only.
   ========================================================= */

(function () {
  'use strict';

  /* =======================================================
     0. CLIENT-SIDE TRANSPARENT LOGO PROCESSOR
     Removes solid yellow/gold background from user images.
     ======================================================= */
  function removeYellowBackgroundFromImages() {
    var targets = document.querySelectorAll('.remove-bg-yellow');
    targets.forEach(function(imgEl) {
      if (imgEl.dataset.processed === "true") return;
      
      var img = new Image();
      img.crossOrigin = "Anonymous";
      img.onload = function() {
        var canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        var ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        
        var imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        var data = imgData.data;
        
        for (var i = 0; i < data.length; i += 4) {
          var r = data[i];
          var g = data[i + 1];
          var b = data[i + 2];
          
          // Yellow/gold background range check (high Red, high Green, low Blue)
          if (r > 140 && g > 90 && b < 100 && (r - b) > 50 && (g - b) > 30) {
            data[i + 3] = 0; // Make pixel completely transparent
          }
        }
        
        ctx.putImageData(imgData, 0, 0);
        imgEl.src = canvas.toDataURL('image/png');
        imgEl.dataset.processed = "true";
        imgEl.style.opacity = '1';
      };
      img.src = imgEl.src;
    });
  }

  /* =======================================================
     1. PRODUCT DATA
     ======================================================= */
  var IMG = {
    chandelier1: 'https://images.unsplash.com/photo-1524484485831-a92ffc0de03f',
    chandelier2: 'https://images.unsplash.com/photo-1540574163026-643ea20ade25',
    pendant1: 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15',
    pendant2: 'https://images.unsplash.com/photo-1567016376408-0226e4d0c1ea',
    tablelamp1: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c',
    tablelamp2: 'https://images.unsplash.com/photo-1565538810643-b5bdb714032a',
    walllight1: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd',
    walllight2: 'https://images.unsplash.com/photo-1517705008128-361805f42e86',
    ceiling1: 'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e',
    ceiling2: 'https://images.unsplash.com/photo-1560185127-6ed189bf02f4',
    smart1: 'https://images.unsplash.com/photo-1517991104123-1d56a6e81ed9',
    smart2: 'https://images.unsplash.com/photo-1543198126-5e30a2b12b7e',
    strip1: 'https://images.unsplash.com/photo-1615529162924-f8605388461d',
    bulb1: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d',
    bulb2: 'https://images.unsplash.com/photo-1476362174823-3103b48d3159',
    outdoor1: 'https://images.unsplash.com/photo-1519677100203-a0e668c92439',
    outdoor2: 'https://images.unsplash.com/photo-1558882224-dda166733046',
    garden1: 'https://images.unsplash.com/photo-1441849648488-e106b57df4d2',
    switch1: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64',
    decor1: 'https://images.unsplash.com/photo-1540932239986-30128078f3c5',
    decor2: 'https://images.unsplash.com/photo-1571066811602-716837d681de',
    profile1: 'https://images.unsplash.com/photo-1542728928-1413d1894ed1',
    interior1: 'https://images.unsplash.com/photo-1473177104440-ffee2f376098'
  };

  function imgUrl(key, w) {
    return IMG[key] + '?w=' + (w || 600) + '&q=75&auto=format&fit=crop';
  }

  var BRANDS = ['Luminaire Co.', 'Casa Glow', 'Verona Lights', 'NordicLume', 'Solaris Home',
    'ChandelierCraft', 'SwitchArt', 'GreenGlow Outdoor', 'MoodLite', 'Heritage Brass'];

  var FINISHES = ['Antique Brass', 'Matte Black', 'Champagne Gold', 'Brushed Nickel', 'Warm Bronze', 'Ivory White'];

  var TEMPLATES = [
    { cat: 'Chandeliers', img: 'chandelier1', img2: 'chandelier2', base: 2499, desc: 'A statement centrepiece with hand-finished arms and warm-white glow.', rooms: ['Living Room', 'Dining'], collections: ['premium', 'luxury'], names: ['Aurelia Tiered Chandelier', 'Marchetti Crystal Chandelier', 'Windsor Brass Chandelier', 'Empress Drum Chandelier'] },
    { cat: 'Pendant Lights', img: 'pendant1', img2: 'pendant2', base: 1299, desc: 'Sculptural single-drop pendant that anchors a table or island.', rooms: ['Dining', 'Kitchen', 'Living Room'], collections: ['trending', 'new'], names: ['Orbit Glass Pendant', 'Cocoon Rattan Pendant', 'Halo Ring Pendant', 'Amber Globe Pendant'] },
    { cat: 'Table Lamps', img: 'tablelamp1', img2: 'tablelamp2', base: 899, desc: 'Bedside-friendly lamp with a soft, diffused throw of light.', rooms: ['Bedroom', 'Office', 'Living Room'], collections: ['bestseller'], names: ['Linen Shade Table Lamp', 'Ceramic Base Table Lamp', 'Rattan Weave Table Lamp', 'Brass Stem Task Lamp'] },
    { cat: 'Wall Lights', img: 'walllight1', img2: 'walllight2', base: 749, desc: 'Directional wall wash that flatters hallways and reading corners.', rooms: ['Bedroom', 'Living Room', 'Office'], collections: ['trending'], names: ['Arc Reading Wall Light', 'Cylinder Up-Down Wall Light', 'Fluted Glass Wall Sconce', 'Miro Adjustable Wall Light'] },
    { cat: 'Ceiling Lights', img: 'ceiling1', img2: 'ceiling2', base: 1099, desc: 'Flush-mount fitting that spreads clean, even light room-wide.', rooms: ['Living Room', 'Kitchen', 'Office'], collections: ['bestseller', 'new'], names: ['Nimbus Flush Ceiling Light', 'Halcyon Disc Ceiling Light', 'Faceted Dome Ceiling Light', 'Studio Grid Ceiling Light'] },
    { cat: 'Smart Lighting', img: 'smart1', img2: 'smart2', base: 1499, desc: 'App and voice-controlled fitting with 16 million colour scenes.', rooms: ['Living Room', 'Bedroom', 'Office'], collections: ['smart', 'new', 'trending'], names: ['Nova Smart LED Bulb', 'Aura Smart Ceiling Panel', 'Pulse Smart Strip Controller', 'Beacon Smart Table Lamp'] },
    { cat: 'Strip Lights', img: 'strip1', img2: 'strip1', base: 499, desc: 'Flexible RGB strip for coves, cabinets and TV backlighting.', rooms: ['Living Room', 'Kitchen', 'Bedroom'], collections: ['smart'], names: ['ColorFlow LED Strip 5M', 'GlowLine Cabinet Strip', 'Spectra RGB+W Strip', 'Under-Shelf LED Strip Kit'] },
    { cat: 'Profile Lights', img: 'profile1', img2: 'profile1', base: 599, desc: 'Recessed aluminium profile for a seamless architectural line of light.', rooms: ['Living Room', 'Kitchen', 'Office'], collections: [], names: ['Linear Aluminium Profile Light', 'False-Ceiling Cove Profile', 'Wall-Wash Profile Channel', 'Corner Edge Profile Light'] },
    { cat: 'Outdoor Lights', img: 'outdoor1', img2: 'outdoor2', base: 899, desc: 'Weatherproof fitting rated for facades, porches and gates.', rooms: ['Balcony', 'Garden'], collections: ['outdoor'], names: ['Lantern Post Outdoor Light', 'IP65 Wall Spotlight', 'Facade Grazing Light', 'Courtyard Bollard Light'] },
    { cat: 'Garden Lights', img: 'garden1', img2: 'garden1', base: 449, desc: 'Solar or low-voltage light built for lawns, pathways and pots.', rooms: ['Garden', 'Balcony'], collections: ['outdoor'], names: ['Solar Pathway Garden Light', 'In-Ground Uplighter', 'String Fairy Garden Lights', 'Stake Spotlight Set of 4'] },
    { cat: 'Decorative Switches', img: 'switch1', img2: 'switch1', base: 349, desc: 'Designer switch plate that upgrades the smallest details of a room.', rooms: ['Living Room', 'Bedroom', 'Office'], collections: [], names: ['Marble-Finish Switch Plate', 'Glass Touch Switch Panel', 'Brushed Gold Switch Plate', 'Piano Black Switch Set'] },
    { cat: 'Modular Switches', img: 'switch1', img2: 'switch1', base: 299, desc: 'Fire-retardant modular switch built for daily reliability.', rooms: ['Kitchen', 'Office', 'Living Room'], collections: [], names: ['6A Modular Switch Module', '16A Modular Socket Combo', 'Fan Regulator Switch Module', 'USB-Charging Switch Plate'] },
    { cat: 'Home Decor', img: 'decor1', img2: 'decor2', base: 599, desc: 'Curated decor accent designed to sit alongside your lighting.', rooms: ['Living Room', 'Temple', 'Bedroom'], collections: ['festival'], names: ['Brass Diya Set of 5', 'Handwoven Wall Hanging', 'Ceramic Vase Duo', 'Temple Brass Lamp'] }
  ];

  var products = [
    {
      id: 'DN-WALL-01',
      name: 'Aditya Wallchiere Wall Lamp (Without Bulb)',
      desc: 'Handcrafted luxury wallchiere sconce with metallic body and warm ambience, ideal for living room & hallway accents.',
      category: 'Wall Lights',
      rooms: ['Living Room', 'Bedroom', 'Office'],
      brand: 'DecorateNow Luxury',
      price: 499,
      mrp: 1499,
      discount: 67,
      rating: '4.9',
      reviews: 128,
      stock: 'in',
      tags: ['trending', 'bestseller', 'new', 'flash', 'deal', 'luxury', 'premium'],
      img: 'images/products/aditya-wallchiere-wall-lamp-without-bulb-1.webp',
      imgLarge: 'images/products/aditya-wallchiere-wall-lamp-without-bulb-1.webp'
    },
    {
      id: 'DN-WALL-02',
      name: 'Ansh Wallchiere Wall Lamp (Without Bulb)',
      desc: 'Modern sleek decorative wall sconce with antique brass finish and soft architectural glow.',
      category: 'Wall Lights',
      rooms: ['Living Room', 'Dining', 'Bedroom'],
      brand: 'DecorateNow Luxury',
      price: 499,
      mrp: 1499,
      discount: 67,
      rating: '4.8',
      reviews: 94,
      stock: 'in',
      tags: ['trending', 'bestseller', 'new', 'flash', 'deal', 'luxury', 'premium'],
      img: 'images/products/ansh-wallchiere-wall-lamp-without-bulb.webp',
      imgLarge: 'images/products/ansh-wallchiere-wall-lamp-without-bulb.webp'
    },
    {
      id: 'DN-WALL-03',
      name: 'DecorateNow Premium Gold Crystal Square Wallchiere Pendant Lamp (With Warm LED Bulb)',
      seoTitle: 'DecorateNow Gold Crystal Wallchiere Pendant Lamp | Warm LED Included',
      desc: 'Handcrafted luxury gold electroplated square pendant lamp featuring high-refraction optical oval crystals, intricate geometric lattice pattern, adjustable cord, & energy-efficient warm LED bulb included.',
      category: 'Wall Lights',
      rooms: ['Living Room', 'Bedroom', 'Dining', 'Office'],
      brand: 'DecorateNow Luxury',
      price: 699,
      mrp: 2999,
      discount: 77,
      rating: '5.0',
      reviews: 215,
      stock: 'in',
      tags: ['trending', 'bestseller', 'new', 'flash', 'deal', 'luxury', 'premium'],
      img: 'images/products/decoratenow-wallchiere-wall-lamp-with-bulb-1.webp',
      imgLarge: 'images/products/decoratenow-wallchiere-wall-lamp-with-bulb-1.webp',
      gallery: [
        'images/products/decoratenow-wallchiere-wall-lamp-with-bulb-1.webp',
        'images/products/decoratenow-wallchiere-wall-lamp-with-bulb-2.webp',
        'images/products/decoratenow-wallchiere-wall-lamp-with-bulb-3.webp',
        'images/products/decoratenow-wallchiere-wall-lamp-with-bulb-4.webp',
        'images/products/decoratenow-wallchiere-wall-lamp-with-bulb-5.webp',
        'images/products/decoratenow-wallchiere-wall-lamp-with-bulb-6.webp',
        'images/products/decoratenow-wallchiere-wall-lamp-with-bulb-7.webp',
        'images/products/decoratenow-wallchiere-wall-lamp-with-bulb-8.webp',
        'images/products/decoratenow-wallchiere-wall-lamp-with-bulb-9.webp'
      ],
      features: [
        'Premium Gold Finish: Glossy electroplated brass-gold metallic body',
        'Elegant Pattern Design: Intricate double-ring lattice textured pattern',
        'High Quality Crystal: Faceted optical oval glass lens for dazzling light refraction',
        'Adjustable Cord: Heavy-duty black suspension cord with brass canopy top',
        'Sturdy Metal Construction: Durable square alloy frame built for long life',
        'Warm LED Bulb Included: Pre-fitted energy-saving warm white LED light'
      ]
    },
    {
      id: 'DN-WALL-04',
      name: 'Swing Arm Wall Light / Wall Lamp (With Bulb)',
      desc: 'Adjustable dual-pivot swing arm wall lamp for reading corners, bedside tables, and study desks.',
      category: 'Wall Lights',
      rooms: ['Bedroom', 'Office', 'Living Room'],
      brand: 'DecorateNow Luxury',
      price: 499,
      mrp: 1499,
      discount: 67,
      rating: '4.9',
      reviews: 168,
      stock: 'in',
      tags: ['trending', 'bestseller', 'new', 'flash', 'deal', 'luxury', 'premium'],
      img: 'images/products/swing-arm-wall-light-wall-lamp-with-bulb.webp',
      imgLarge: 'images/products/swing-arm-wall-light-wall-lamp-with-bulb.webp'
    },
    {
      id: 'DN-WALL-05',
      name: 'Luxury Wallchiere Wall Lamp (With Bulb)',
      desc: 'High-end premium wallchiere sconce with crystal glass accents and warm diffused lighting.',
      category: 'Wall Lights',
      rooms: ['Living Room', 'Dining', 'Bedroom'],
      brand: 'DecorateNow Luxury',
      price: 499,
      mrp: 1499,
      discount: 67,
      rating: '4.9',
      reviews: 180,
      stock: 'in',
      tags: ['trending', 'bestseller', 'new', 'flash', 'deal', 'luxury', 'premium'],
      img: 'images/products/wallchiere-wall-lamp-with-bulb.webp',
      imgLarge: 'images/products/wallchiere-wall-lamp-with-bulb.webp'
    }
  ];
  // Dummy product generator disabled to keep ONLY the 5 actual products
  // (function generateProducts() { ... })();

  var CATEGORY_META = TEMPLATES.map(function (t) {
    return { name: t.cat, img: imgUrl(t.img, 300) };
  });

  var ROOM_META = [
    { name: 'Living Room', img: imgUrl('decor1', 400) },
    { name: 'Bedroom', img: imgUrl('tablelamp2', 400) },
    { name: 'Dining', img: imgUrl('pendant1', 400) },
    { name: 'Kitchen', img: imgUrl('ceiling2', 400) },
    { name: 'Temple', img: imgUrl('decor2', 400) },
    { name: 'Office', img: imgUrl('walllight2', 400) },
    { name: 'Balcony', img: imgUrl('outdoor2', 400) },
    { name: 'Garden', img: imgUrl('garden1', 400) }
  ];

  var REVIEWS = [
    { name: 'Priya S.', city: 'Greater Noida', rating: 5, text: 'The chandelier looks even better in person. Packaging was excellent and installation was quick.' },
    { name: 'Rohit M.', city: 'Pune', rating: 5, text: 'Ordered the smart ceiling panel — pairing with the app took two minutes. Genuinely premium build.' },
    { name: 'Ayesha K.', city: 'Hyderabad', rating: 4, text: 'Beautiful pendant light for our dining table. Slightly smaller than expected but the quality is lovely.' },
    { name: 'Karan V.', city: 'Delhi', rating: 5, text: 'Bought table lamps for the whole house. Consistent quality across every piece, very happy.' },
    { name: 'Meera J.', city: 'Bengaluru', rating: 5, text: 'Their outdoor lights survived a full monsoon without any issue. Exactly as promised.' },
    { name: 'Arjun T.', city: 'Noida', rating: 4, text: 'Great customer support when I needed a replacement switch plate. Sorted within a day.' },
    { name: 'Sanya R.', city: 'Mumbai', rating: 5, text: 'The festival diya set made our Diwali decor look straight out of a magazine.' },
    { name: 'Devansh P.', city: 'Lucknow', rating: 5, text: 'Wall lights transformed our hallway completely. Warm, even light and a very clean finish.' }
  ];

  var INSTA_IMAGES = ['chandelier1', 'pendant2', 'tablelamp1', 'ceiling2', 'decor1', 'outdoor1', 'walllight1', 'garden1', 'smart2', 'decor2'];
  var POPULAR_SEARCHES = ['Chandeliers', 'Smart bulbs', 'LED strip lights', 'Wall lights', 'Modular switches', 'Table lamps'];

  /* =======================================================
     2. STATE & HELPERS
     ======================================================= */
  var state = {
    wishlist: new Set(),
    cart: new Map(),
    recentSearches: [],
    recentlyViewed: []
  };

  function rupee(n) {
    return '₹' + Number(n).toLocaleString('en-IN');
  }

  function el(html) {
    var t = document.createElement('template');
    t.innerHTML = html.trim();
    return t.content.firstElementChild;
  }

  function showToast(msg) {
    var toast = document.getElementById('toast');
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add('is-visible');
    clearTimeout(showToast._t);
    showToast._t = setTimeout(function () {
      toast.classList.remove('is-visible');
    }, 2200);
  }

  function bump(elm) {
    if (!elm) return;
    elm.classList.remove('is-bumping');
    void elm.offsetWidth;
    elm.classList.add('is-bumping');
  }

  /* =======================================================
     3. RENDER CARD HELPERS
     ======================================================= */
  function renderCard(p) {
    var isWished = state.wishlist.has(p.id);
    var cardHtml = '<article class="product-card" data-id="' + p.id + '">' +
      '<div class="pc-media">' +
        '<img src="' + p.img + '" alt="' + p.name + '" loading="lazy">' +
        (p.discount > 25 ? '<span class="pc-badge">' + p.discount + '% OFF</span>' : '') +
        '<button class="pc-wishlist ' + (isWished ? 'is-active' : '') + '" aria-label="Add to wishlist" data-action="wishlist">' +
          '<svg viewBox="0 0 24 24" width="16" height="16" fill="' + (isWished ? 'currentColor' : 'none') + '" stroke="currentColor" stroke-width="2"><path d="M12 21s-7.5-4.6-10-9.1C.5 8.2 2.3 4.5 6 4c2.2-.3 4 .9 6 3.4C14 4.9 15.8 3.7 18 4c3.7.5 5.5 4.2 4 7.9C19.5 16.4 12 21 12 21z"/></svg>' +
        '</button>' +
        '<button class="pc-quickview" data-action="quickview">Quick View</button>' +
      '</div>' +
      '<div class="pc-content">' +
        '<div class="pc-brand">' + p.brand + '</div>' +
        '<h3 class="pc-title">' + p.name + '</h3>' +
        '<div class="pc-rating">★ ' + p.rating + ' <span>(' + p.reviews + ')</span></div>' +
        '<div class="pc-price-row">' +
          '<span class="pc-price">' + rupee(p.price) + '</span>' +
          '<span class="pc-mrp">' + rupee(p.mrp) + '</span>' +
          '<span class="pc-discount">' + p.discount + '% off</span>' +
        '</div>' +
        '<button class="btn btn-gold btn-sm pc-add ripple" data-action="add-cart">Add to Cart</button>' +
      '</div>' +
    '</article>';
    return el(cardHtml);
  }

  function populateRail(containerId, productList) {
    var container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = '';
    productList.forEach(function (p) {
      container.appendChild(renderCard(p));
    });
  }

  /* =======================================================
     4. COMPONENT INITIALIZERS
     ======================================================= */
  function initHero() {
    var slider = document.getElementById('heroSlider');
    if (!slider) return;
    var slides = slider.querySelectorAll('.hero-slide');
    var dotsContainer = document.getElementById('heroDots');
    var prevBtn = document.getElementById('heroPrev');
    var nextBtn = document.getElementById('heroNext');
    var current = 0;
    var timer = null;

    if (dotsContainer) {
      dotsContainer.innerHTML = '';
      slides.forEach(function (_, i) {
        var dot = document.createElement('button');
        dot.ariaLabel = 'Go to slide ' + (i + 1);
        if (i === 0) dot.classList.add('is-active');
        dot.addEventListener('click', function () { goTo(i); });
        dotsContainer.appendChild(dot);
      });
    }

    function goTo(index) {
      slides[current].classList.remove('is-active');
      if (dotsContainer && dotsContainer.children[current]) {
        dotsContainer.children[current].classList.remove('is-active');
      }
      current = (index + slides.length) % slides.length;
      slides[current].classList.add('is-active');
      if (dotsContainer && dotsContainer.children[current]) {
        dotsContainer.children[current].classList.add('is-active');
      }
    }

    function startTimer() {
      stopTimer();
      timer = setInterval(function () { goTo(current + 1); }, 5500);
    }
    function stopTimer() { clearInterval(timer); }

    if (prevBtn) prevBtn.addEventListener('click', function () { goTo(current - 1); startTimer(); });
    if (nextBtn) nextBtn.addEventListener('click', function () { goTo(current + 1); startTimer(); });

    slider.addEventListener('mouseenter', stopTimer);
    slider.addEventListener('mouseleave', startTimer);
    startTimer();
  }

  function initCountdown() {
    var h = document.getElementById('cdHours');
    var m = document.getElementById('cdMinutes');
    var s = document.getElementById('cdSeconds');
    if (!h || !m || !s) return;

    var endTime = Date.now() + (7 * 3600 + 42 * 60 + 15) * 1000;

    function update() {
      var diff = Math.max(0, Math.floor((endTime - Date.now()) / 1000));
      var hrs = Math.floor(diff / 3600);
      var mins = Math.floor((diff % 3600) / 60);
      var secs = diff % 60;

      h.textContent = String(hrs).padStart(2, '0');
      m.textContent = String(mins).padStart(2, '0');
      s.textContent = String(secs).padStart(2, '0');
    }
    update();
    setInterval(update, 1000);
  }

  function initCategories() {
    var grid = document.getElementById('categoryGrid');
    if (!grid) return;
    grid.innerHTML = '';
    CATEGORY_META.forEach(function (c) {
      var html = '<a href="#categories" class="category-card">' +
        '<div class="category-thumb"><img src="' + c.img + '" alt="' + c.name + '" loading="lazy"></div>' +
        '<span class="category-name">' + c.name + '</span>' +
      '</a>';
      grid.appendChild(el(html));
    });
  }

  function initRooms() {
    var scroll = document.getElementById('roomScroll');
    if (!scroll) return;
    scroll.innerHTML = '';
    ROOM_META.forEach(function (r) {
      var html = '<a href="#shop-by-room" class="room-card">' +
        '<img src="' + r.img + '" alt="' + r.name + '" loading="lazy">' +
        '<span class="room-name">' + r.name + '</span>' +
      '</a>';
      scroll.appendChild(el(html));
    });
  }

  function initDealOfDay() {
    var banner = document.getElementById('dealBanner');
    if (!banner) return;
    var p = products.filter(function (x) { return x.tags.indexOf('deal') !== -1; })[0] || products[0];
    banner.innerHTML = '<div class="deal-media"><img src="' + p.imgLarge + '" alt="' + p.name + '"></div>' +
      '<div class="deal-info">' +
        '<p class="eyebrow eyebrow-light">Deal of the Day</p>' +
        '<h3>' + p.name + '</h3>' +
        '<p>' + p.desc + '</p>' +
        '<div class="deal-pricing">' +
          '<span class="deal-price">' + rupee(p.price) + '</span>' +
          '<span class="deal-mrp">' + rupee(p.mrp) + '</span>' +
        '</div>' +
        '<button class="btn btn-gold ripple" data-action="add-cart" data-id="' + p.id + '">Claim Deal Now</button>' +
      '</div>';
  }

  function initBrands() {
    var strip = document.getElementById('brandStrip');
    if (!strip) return;
    strip.innerHTML = '';
    BRANDS.slice(0, 5).forEach(function (b) {
      strip.appendChild(el('<div class="brand-chip">' + b + '</div>'));
    });
  }

  function initReviews() {
    var scroll = document.getElementById('reviewScroll');
    if (!scroll) return;
    scroll.innerHTML = '';
    REVIEWS.forEach(function (r) {
      var stars = '★'.repeat(r.rating) + '☆'.repeat(5 - r.rating);
      var html = '<div class="review-card">' +
        '<div class="rc-stars">' + stars + '</div>' +
        '<p class="rc-text">“' + r.text + '”</p>' +
        '<div class="rc-author">' + r.name + '</div>' +
        '<div class="rc-city">' + r.city + '</div>' +
      '</div>';
      scroll.appendChild(el(html));
    });
  }

  function initInsta() {
    var grid = document.getElementById('instaGrid');
    if (!grid) return;
    grid.innerHTML = '';
    INSTA_IMAGES.slice(0, 6).forEach(function (k) {
      var html = '<div class="insta-item"><img src="' + imgUrl(k, 400) + '" alt="Instagram post" loading="lazy"></div>';
      grid.appendChild(el(html));
    });
  }

  function initSearchOverlay() {
    var overlay = document.getElementById('searchOverlay');
    var openBtns = [document.getElementById('searchOpenBtn'), document.getElementById('searchOpenBtnMobile')];
    var closeBtn = document.getElementById('searchCloseBtn');
    var input = document.getElementById('searchInput');
    var popularRow = document.getElementById('popularSearchesRow');
    var resultsBlock = document.getElementById('searchResultsBlock');
    var resultsList = document.getElementById('searchResultsList');

    if (!overlay) return;

    openBtns.forEach(function (btn) {
      if (btn) btn.addEventListener('click', function () {
        overlay.classList.add('is-open');
        if (input) input.focus();
      });
    });

    if (closeBtn) closeBtn.addEventListener('click', function () { overlay.classList.remove('is-open'); });

    if (popularRow) {
      popularRow.innerHTML = '';
      POPULAR_SEARCHES.forEach(function (s) {
        var chip = el('<button class="chip">' + s + '</button>');
        chip.addEventListener('click', function () {
          if (input) { input.value = s; doSearch(s); }
        });
        popularRow.appendChild(chip);
      });
    }

    function doSearch(q) {
      if (!q.trim()) {
        resultsBlock.hidden = true;
        return;
      }
      resultsBlock.hidden = false;
      var matches = products.filter(function (p) {
        return p.name.toLowerCase().indexOf(q.toLowerCase()) !== -1 || p.category.toLowerCase().indexOf(q.toLowerCase()) !== -1;
      }).slice(0, 6);

      if (matches.length === 0) {
        resultsList.innerHTML = '<div class="search-empty">No matching lighting or decor found.</div>';
      } else {
        resultsList.innerHTML = '';
        matches.forEach(function (m) {
          var row = el('<a href="#product" class="search-result-row">' +
            '<img src="' + m.img + '" alt="' + m.name + '">' +
            '<div><div class="srr-name">' + m.name + '</div><div class="srr-price">' + rupee(m.price) + '</div></div>' +
          '</a>');
          resultsList.appendChild(row);
        });
      }
    }

    if (input) {
      input.addEventListener('input', function (e) { doSearch(e.target.value); });
    }
  }

  function initMobileMenu() {
    var btn = document.getElementById('hamburgerBtn');
    var menu = document.getElementById('mobileMenu');
    var backdrop = document.getElementById('drawerBackdrop');
    var close = document.getElementById('mobileMenuClose');

    if (!menu) return;
    function openMenu() {
      menu.classList.add('is-open');
      if (backdrop) backdrop.classList.add('is-open');
      if (btn) btn.setAttribute('aria-expanded', 'true');
    }
    function closeMenu() {
      menu.classList.remove('is-open');
      if (backdrop) backdrop.classList.remove('is-open');
      if (btn) btn.setAttribute('aria-expanded', 'false');
    }

    if (btn) btn.addEventListener('click', openMenu);
    if (close) close.addEventListener('click', closeMenu);
    if (backdrop) backdrop.addEventListener('click', closeMenu);
  }

  function initGlobalListeners() {
    document.addEventListener('click', function (e) {
      var target = e.target.closest('[data-action]');
      if (!target) return;

      var action = target.dataset.action;
      var card = target.closest('[data-id]');
      var pId = card ? card.dataset.id : target.dataset.id;
      var p = products.filter(function (x) { return x.id === pId; })[0];

      if (action === 'add-cart') {
        var cartBtn = document.getElementById('cartBtn');
        var bottomCart = document.getElementById('bottomCart');
        var countEl = document.getElementById('cartCount');
        var bCountEl = document.getElementById('bottomCartCount');

        var cur = state.cart.get(pId) || 0;
        state.cart.set(pId, cur + 1);
        var total = 0;
        state.cart.forEach(function (v) { total += v; });

        if (countEl) countEl.textContent = total;
        if (bCountEl) bCountEl.textContent = total;
        bump(cartBtn);
        bump(bottomCart);
        showToast('Added ' + (p ? p.name : 'item') + ' to cart!');
      }

      if (action === 'wishlist') {
        var wishBtn = document.getElementById('wishlistBtn');
        var wCountEl = document.getElementById('wishlistCount');
        var bWCountEl = document.getElementById('bottomWishlistCount');

        if (state.wishlist.has(pId)) {
          state.wishlist.delete(pId);
          target.classList.remove('is-active');
          showToast('Removed from wishlist');
        } else {
          state.wishlist.add(pId);
          target.classList.add('is-active');
          showToast('Saved to wishlist!');
        }
        if (wCountEl) wCountEl.textContent = state.wishlist.size;
        if (bWCountEl) bWCountEl.textContent = state.wishlist.size;
        bump(wishBtn);
      }

      if (action === 'quickview' && p) {
        openQuickView(p);
      }
    });

    var announceClose = document.getElementById('announceClose');
    if (announceClose) {
      announceClose.addEventListener('click', function () {
        var bar = document.getElementById('announceBar');
        if (bar) bar.style.display = 'none';
      });
    }

    var backToTop = document.getElementById('backToTop');
    window.addEventListener('scroll', function () {
      if (backToTop) {
        if (window.scrollY > 400) backToTop.classList.add('is-shown');
        else backToTop.classList.remove('is-shown');
      }
    });
    if (backToTop) {
      backToTop.addEventListener('click', function () {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }

    var footerYear = document.getElementById('footerYear');
    if (footerYear) footerYear.textContent = new Date().getFullYear();
  }

  function openQuickView(p) {
    var modal = document.getElementById('quickView');
    var backdrop = document.getElementById('quickViewBackdrop');
    var body = document.getElementById('quickViewBody');
    var close = document.getElementById('quickViewClose');

    if (!modal || !body) return;

    body.innerHTML = '<div class="qv-media"><img src="' + p.imgLarge + '" alt="' + p.name + '"></div>' +
      '<div class="qv-details">' +
        '<div class="eyebrow">' + p.brand + '</div>' +
        '<h2 class="qv-title">' + p.name + '</h2>' +
        '<div class="qv-price">' + rupee(p.price) + ' <small style="font-size:14px;color:#726F66;text-decoration:line-through">' + rupee(p.mrp) + '</small></div>' +
        '<p class="qv-desc">' + p.desc + '</p>' +
        '<button class="btn btn-gold btn-block ripple" data-action="add-cart" data-id="' + p.id + '">Add to Cart</button>' +
      '</div>';

    modal.classList.add('is-open');
    if (backdrop) backdrop.classList.add('is-open');

    function closeQV() {
      modal.classList.remove('is-open');
      if (backdrop) backdrop.classList.remove('is-open');
    }

    if (close) close.onclick = closeQV;
    if (backdrop) backdrop.onclick = closeQV;
  }

  /* =======================================================
     5. INITIALIZATION ON DOM READY
     ======================================================= */
  document.addEventListener('DOMContentLoaded', function () {
    // Process logo background removal dynamically
    removeYellowBackgroundFromImages();

    initHero();
    initCountdown();
    initCategories();
    initRooms();

    populateRail('flashSaleRail', products.filter(function (p) { return p.tags.indexOf('flash') !== -1; }));
    populateRail('trendingRail', products.filter(function (p) { return p.tags.indexOf('trending') !== -1; }));
    populateRail('bestSellersRail', products.filter(function (p) { return p.tags.indexOf('bestseller') !== -1; }));
    populateRail('premiumRail', products.filter(function (p) { return p.tags.indexOf('premium') !== -1; }));
    populateRail('smartRail', products.filter(function (p) { return p.tags.indexOf('smart') !== -1; }));
    populateRail('outdoorRail', products.filter(function (p) { return p.tags.indexOf('outdoor') !== -1; }));
    populateRail('festivalRail', products.filter(function (p) { return p.tags.indexOf('festival') !== -1; }));
    populateRail('newArrivalsRail', products.filter(function (p) { return p.tags.indexOf('new') !== -1; }));
    populateRail('recommendedRail', products.slice(0, 10));

    var luxuryGrid = document.getElementById('luxuryGrid');
    if (luxuryGrid) {
      luxuryGrid.innerHTML = '';
      products.filter(function (p) { return p.tags.indexOf('luxury') !== -1; }).slice(0, 6).forEach(function (p) {
        luxuryGrid.appendChild(renderCard(p));
      });
    }

    initDealOfDay();
    initBrands();
    initReviews();
    initInsta();
    initSearchOverlay();
    initMobileMenu();
    initGlobalListeners();
  });

})();
