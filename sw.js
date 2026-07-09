/* ================================================
   ZEYTUN RESTORAN — Service Worker (PWA Offline)
   Cache-first strategy for full offline support
   ================================================ */

var CACHE_NAME = 'zeytun-v3';
var ASSETS = [
  './',
  './index.html',
  './style.css',
  './app.js',
  './manifest.json',
  './icons/icon-192.png',
  './icons/icon-512.png'
];

// ===== INSTALL: Cache all assets =====
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.addAll(ASSETS);
    }).then(function() {
      return self.skipWaiting();
    })
  );
});

// ===== ACTIVATE: Clean old caches =====
self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(
        keys.filter(function(key) {
          return key !== CACHE_NAME;
        }).map(function(key) {
          return caches.delete(key);
        })
      );
    }).then(function() {
      return self.clients.claim();
    })
  );
});

// ===== FETCH: Cache-first, fallback to network =====
self.addEventListener('fetch', function(event) {
  // Only handle GET requests
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then(function(cached) {
      if (cached) {
        return cached;
      }
      // Not in cache — try network then cache it
      return fetch(event.request).then(function(response) {
        // Only cache valid responses
        if (!response || response.status !== 200 || response.type === 'opaque') {
          return response;
        }
        var cloned = response.clone();
        caches.open(CACHE_NAME).then(function(cache) {
          cache.put(event.request, cloned);
        });
        return response;
      }).catch(function() {
        // Network failed and not in cache — return offline page
        return caches.match('./index.html');
      });
    })
  );
});
