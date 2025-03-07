const CACHE_NAME = "buramart-cache-v2"; // Updated cache version
const OFFLINE_PAGE = "/offline.html"
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
  "/offline.html", // Ensure fallback page is cached
];

// Install event: Cache core assets
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
});

// Fetch event: Serve cached files & fallback if offline
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return (
        response ||
        fetch(event.request)
          .then((networkResponse) => {
            // Cache new requests dynamically (except external requests)
            if (!event.request.url.includes("http")) return networkResponse;
            return caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, networkResponse.clone());
              return networkResponse;
            });
          })
          .catch(() => caches.match(OFFLINE_PAGE)) // Show fallback page when offline
      );
    })
  );
});

// Activate event: Remove old caches
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
});
