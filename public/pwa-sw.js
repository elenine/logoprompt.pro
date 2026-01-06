// PWA Service Worker for LogoPrompt Pro
const CACHE_VERSION = 'v1';
const CACHE_NAMES = {
  static: `logoprompt-static-${CACHE_VERSION}`,
  dynamic: `logoprompt-dynamic-${CACHE_VERSION}`,
  images: `logoprompt-images-${CACHE_VERSION}`,
};

// Critical assets to precache on install
const STATIC_ASSETS = [
  '/',
  '/favicon.svg',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
];

// Install event - precache static assets
self.addEventListener('install', (event) => {
  console.log('[PWA SW] Installing service worker...');

  event.waitUntil(
    caches.open(CACHE_NAMES.static)
      .then(cache => {
        console.log('[PWA SW] Precaching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        console.log('[PWA SW] Installation complete');
        return self.skipWaiting();
      })
      .catch(error => {
        console.error('[PWA SW] Installation failed:', error);
      })
  );
});

// Activate event - cleanup old caches
self.addEventListener('activate', (event) => {
  console.log('[PWA SW] Activating service worker...');

  event.waitUntil(
    caches.keys()
      .then(keys => {
        const deletionPromises = keys
          .filter(key =>
            key.startsWith('logoprompt-') &&
            !Object.values(CACHE_NAMES).includes(key)
          )
          .map(key => {
            console.log('[PWA SW] Deleting old cache:', key);
            return caches.delete(key);
          });

        return Promise.all(deletionPromises);
      })
      .then(() => {
        console.log('[PWA SW] Activation complete');
        return self.clients.claim();
      })
  );
});

// Fetch strategy
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-HTTP/HTTPS requests
  if (!url.protocol.startsWith('http')) {
    return;
  }

  // API routes - Network only (auth, subscriptions, etc)
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(fetch(request));
    return;
  }

  // Images - Cache first with network fallback
  if (request.destination === 'image') {
    event.respondWith(
      caches.open(CACHE_NAMES.images).then(cache =>
        cache.match(request).then(cached => {
          if (cached) {
            return cached;
          }

          return fetch(request).then(response => {
            // Only cache successful responses
            if (response && response.status === 200) {
              cache.put(request, response.clone());
            }
            return response;
          }).catch(() => {
            // Return a fallback for images if offline and not cached
            return new Response('', { status: 404, statusText: 'Image not available offline' });
          });
        })
      )
    );
    return;
  }

  // Static assets (CSS, JS, fonts) - Cache first
  if (request.destination === 'style' ||
      request.destination === 'script' ||
      request.destination === 'font') {
    event.respondWith(
      caches.open(CACHE_NAMES.static).then(cache =>
        cache.match(request).then(cached => {
          if (cached) {
            return cached;
          }

          return fetch(request).then(response => {
            if (response && response.status === 200) {
              cache.put(request, response.clone());
            }
            return response;
          });
        })
      )
    );
    return;
  }

  // HTML pages - Network first with cache fallback (SSR freshness)
  if (request.destination === 'document') {
    event.respondWith(
      fetch(request)
        .then(response => {
          // Cache successful responses
          if (response && response.status === 200) {
            caches.open(CACHE_NAMES.dynamic).then(cache => {
              cache.put(request, response.clone());
            });
          }
          return response;
        })
        .catch(() => {
          // Try cache fallback
          return caches.match(request).then(cached => {
            if (cached) {
              return cached;
            }

            // If no cache, return offline page
            return caches.match('/offline.html');
          });
        })
    );
    return;
  }

  // Default - Network first with cache fallback
  event.respondWith(
    fetch(request)
      .then(response => {
        if (response && response.status === 200) {
          caches.open(CACHE_NAMES.dynamic).then(cache => {
            cache.put(request, response.clone());
          });
        }
        return response;
      })
      .catch(() => caches.match(request))
  );
});

// Handle messages from clients
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
