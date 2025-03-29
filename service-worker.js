const CACHE_NAME = "buramart-cache-v0.32"; // Updated cache version
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
// sw.js (Service Worker)
self.addEventListener('install', (event) => {
  console.log('Service Worker Installed');
  event.waitUntil(self.skipWaiting()); // Force the service worker to activate
});

self.addEventListener('activate', (event) => {
  console.log('Service Worker Activated');
  event.waitUntil(self.clients.claim()); // Make sure it controls all pages
});
self.addEventListener("message", function(event) {
  console.log("Service Worker received message:", event.data);
  let data = event.data;

  // Log the received data (for debugging purposes)
  console.log("Service Worker received message:", data);

  if (data) {
    // Show the notification using the received data
    const productId = data.productId || "";

    self.registration.showNotification(data.title, {
      body: data.body,
      icon: data.icon, // Use the icon that was passed
      image: data.imageUrl || "", // Use the image URL if available
      vibrate: [200, 100, 200], // Vibration pattern
      badge: data.imageUrl, // Badge icon for the notification
      data: { url: `https://buramart.netlify.app/?id=${productId}` }
    });
  }
});
self.addEventListener("notificationclick", function (event) {
  event.notification.close(); // Close the notification

  if (event.notification.data && event.notification.data.url) {
      event.waitUntil(
          clients.openWindow(event.notification.data.url) // Open product URL
      );
  }
});
