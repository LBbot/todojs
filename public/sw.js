const CACHE_NAME = "todo-ls-v3";

const urlsToCache = [
    "/",
    "/todo.html",
    "/style.css",
    "/script.js"
];

// This is supposed to delete old serviceworker caches but it doesn't seem to work.
// Also it should probably be at the bottom of this file
self.addEventListener("activate", function (event) {
    "use strict";
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then(function (keyList) {
            return Promise.all(keyList.map(function (key) {
                if (cacheWhitelist.indexOf(key) === -1) {
                    return caches.delete(key);
                }
            }));
        })
    );
});

self.addEventListener("install", function (event) {
    "use strict";
    // Perform install steps
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(function (cache) {
                console.log("Opened cache");
                return cache.addAll(urlsToCache);
            })
    );
});

self.addEventListener("fetch", function (event) {
    "use strict";
    event.respondWith(
        caches.match(event.request)
            .then(function (response) {
                // Cache hit - return response
                if (response) {
                    return response;
                }
                return fetch(event.request);
            }
            )
    );
});


