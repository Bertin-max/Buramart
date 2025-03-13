const CACHE_NAME = "buramart-cache-v0.5"; // Updated cache version
const OFFLINE_PAGE = "/offline.html";
const urlsToCache = [
  "/index.html",
  "/index.js",
  "/seller.html",
  "/seller.js",
  "/auth.html",
  "/auth.js",
  "/cart.html",
  "/cart.js",
  "/user.js",
  "/settings.js",
  "/seller-registration.html",
  "/seller-registration.js",
  "/styles.css",
  "/icons/store.png",
  "/offline.html" // Ensure fallback page is cached
];

// Install event: Cache core assets
self.addEventListener("install", (event) => {
  self.skipWaiting(); // Force new service worker to activate immediately
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache))
  );
});

// Fetch event: Serve cached files & fallback if offline
self.addEventListener("fetch", (event) => {
  // Ignore non-GET requests (prevents errors)
  if (event.request.method !== "GET") {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((response) => {
      return (
        response ||
        fetch(event.request)
          .then((networkResponse) => {
            // Only cache GET requests from the same origin
            if (
              event.request.url.startsWith(self.location.origin) &&
              networkResponse.ok
            ) {
              return caches.open(CACHE_NAME).then((cache) => {
                cache.put(event.request, networkResponse.clone());
                return networkResponse;
              });
            }
            return networkResponse;
          })
          .catch(() => caches.match(OFFLINE_PAGE)) // Show fallback page when offline
      );
    })
  );
});

// Activate event: Remove old caches & claim clients immediately
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    })
  );
  self.clients.claim(); // Immediately take control of open tabs
});
