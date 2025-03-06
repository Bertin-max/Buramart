// This event is triggered when the service worker is installed
self.addEventListener("install", (event) => {
    event.waitUntil(
      caches.open("buramart-cache").then((cache) => {
        // Files to cache during installation
        return cache.addAll([
                                   // Root page (index.html)
        "/index.html",                // Main page
        "/index.js",                  // Main JavaScript for the homepage
        "/seller.html",               // Seller page
        "/seller.js",                 // Seller page JavaScript
        "/auth.html",                 // Authentication page
        "/auth.js",                   // Authentication page JavaScript
        "/cart.html",                 // Cart page
        "/cart.js", 
        "/user.js" ,                 // Cart page JavaScript
        "/settings.js",               // Settings JavaScript
        "/seller-registration.html", // Seller registration page
        "/seller-registration.js",   // Seller registration JavaScript
        "/styles.css",                // Stylesheet
        "/icons/store.png",
              
        ]);
      })
    );
  });
  
  // This event is triggered whenever a fetch request is made
  self.addEventListener("fetch", (event) => {
    event.respondWith(
      caches.match(event.request).then((response) => {
        // If there's a cached file, return it; otherwise, fetch it from the network
        return response || fetch(event.request);
      })
    );
  });
  
  // Optional: Event listener to handle the activation of the service worker
  self.addEventListener("activate", (event) => {
    const cacheWhitelist = ["buramart-cache"];
    event.waitUntil(
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            // Delete old caches that are not in the whitelist
            if (!cacheWhitelist.includes(cacheName)) {
              return caches.delete(cacheName);
            }
          })
        );
      })
    );
  });
  