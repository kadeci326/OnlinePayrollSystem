  
const CACHE_NAME = "payroll-app-v3";

const FILES_TO_CACHE = [
    "./",
    "./index.html",
    "./style.css",
    "./script.js",
    "./manifest.json",
    "./payroll-icon-192.png",
    "./payroll-icon-512.png",
    "./supabase-config.js",
    "./register.html",
    "./register.js",
    "./company.html",
    "./company.js"
];

self.addEventListener("install", event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(FILES_TO_CACHE))
    );

    self.skipWaiting();
});

self.addEventListener("activate", event => {
    event.waitUntil(
        caches.keys().then(keys =>
            Promise.all(
                keys
                    .filter(key => key !== CACHE_NAME)
                    .map(key => caches.delete(key))
            )
        )
    );

    self.clients.claim();
});

self.addEventListener("fetch", event => {
    if (event.request.method !== "GET") return;

    event.respondWith(
        (async () => {
            try {
                const response = await fetch(event.request);
                return response;
            } catch (error) {
                const cachedFile = await caches.match(event.request);

                if (cachedFile) {
                    return cachedFile;
                }

                if (event.request.mode === "navigate") {
                    const offlinePage = await caches.match("./index.html");

                    if (offlinePage) {
                        return offlinePage;
                    }
                }

                return new Response("You are offline. Please try again.", {
                    status: 503,
                    headers: { "Content-Type": "text/plain" }
                });
            }
        })()
    );
});
