const CACHE_NAME = 'anshuman-pwa-v2.0';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/products.html',
  '/services.html',
  '/our-catalogue.html',
  '/about.html',
  '/contact.html',
  '/faq.html',
  '/google-stitch.css',
  '/app-engine.js',
  '/search.js',
  '/search_data.js',
  '/chatbot.js',
  '/chatbot_knowledge.js',
  '/manifest.webmanifest',
  '/logo.webp',
  '/primary-logo.webp',
  '/favicon.ico',
  '/favicon-192x192.png'
];

// Install Event
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[Service Worker] Caching App Shell & Core Assets');
      return cache.addAll(STATIC_ASSETS);
    }).then(() => self.skipWaiting())
  );
});

// Activate Event
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('[Service Worker] Clearing Old Cache:', cache);
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch Event - Stale While Revalidate Strategy for Shell, Cache First for Media/Fonts
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Skip cross-origin non-GET requests or external APIs
  if (event.request.method !== 'GET' || !url.origin.includes(self.location.hostname)) {
    return;
  }

  // Media & WebP Cache First
  if (url.pathname.endsWith('.webp') || url.pathname.endsWith('.png') || url.pathname.endsWith('.jpg') || url.pathname.endsWith('.woff2')) {
    event.respondWith(
      caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response) return response;
          return fetch(event.request).then((networkResponse) => {
            if (networkResponse.status === 200) {
              cache.put(event.request, networkResponse.clone());
            }
            return networkResponse;
          });
        });
      })
    );
    return;
  }

  // HTML / App Shell Stale While Revalidate
  event.respondWith(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.match(event.request).then((cachedResponse) => {
        const fetchPromise = fetch(event.request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            cache.put(event.request, networkResponse.clone());
          }
          return networkResponse;
        }).catch(() => cachedResponse);

        return cachedResponse || fetchPromise;
      });
    })
  );
});
