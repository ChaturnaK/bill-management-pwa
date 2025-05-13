// public/service-worker.js

const CACHE_NAME = "my-app-cache-v1";
const PRECACHE_URLS = [
    "/",
    "/index.html",
    // Add additional resources you want to precache
];

// Install event: Precache static assets
self.addEventListener("install", (event) => {
    console.log("[Service Worker] Install");
    event.waitUntil(
        caches
            .open(CACHE_NAME)
            .then((cache) => {
                console.log("[Service Worker] Pre-caching offline page");
                return cache.addAll(PRECACHE_URLS);
            })
            .catch((error) => {
                console.error("[Service Worker] Precache failed:", error);
            }),
    );
    self.skipWaiting();
});

// Activate event: Clean up old caches if needed
self.addEventListener("activate", (event) => {
    console.log("[Service Worker] Activate");
    event.waitUntil(
        caches
            .keys()
            .then((cacheNames) =>
                Promise.all(
                    cacheNames.map((cache) => {
                        if (cache !== CACHE_NAME) {
                            console.log(
                                "[Service Worker] Removing old cache",
                                cache,
                            );
                            return caches.delete(cache);
                        }
                    }),
                ),
            )
            .catch((error) => {
                console.error("[Service Worker] Activation failed:", error);
            }),
    );
    self.clients.claim();
});

// Fetch event: Serve cached content when offline
self.addEventListener("fetch", (event) => {
    if (event.request.method !== "GET") return;

    event.respondWith(
        caches
            .match(event.request)
            .then((response) => {
                return response || fetch(event.request);
            })
            .catch((error) => {
                console.error("[Service Worker] Fetch failed:", error);
            }),
    );
});
