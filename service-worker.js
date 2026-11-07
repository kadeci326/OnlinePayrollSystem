 const CACHE_NAME = "payroll-app-v2";

const FILES_TO_CACHE = [
    "./",
    "./index.html",
    "./style.css",
    "./script.js",
    "./manifest.json",
    "./payroll-icon-192.png",
    "./payroll-icon-512.png"
];

self.addEventListener("install", event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            return cache.addAll(FILES_TO_CACHE);
        })
    );

    self.skipWaiting();
});

self.addEventListener("activate", event => {
    event.waitUntil(
        caches.keys().then(keys => {
            return Promise.all(
                keys
                    .filter(key => key !== CACHE_NAME)
                    .map(key => caches.delete(key))
            );
        })
    );

    self.clients.claim();
});

self.addEventListener("fetch", event => {
    if (event.request.method !== "GET") return;

    event.respondWith(
        caches.match(event.request).then(cachedFile => {
            if (cachedFile) {
                return cachedFile;
            }

            return fetch(event.request);
        })
    );
});