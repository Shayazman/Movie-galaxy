const CACHE = "movie-galaxy-v2";

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) =>
      cache.addAll([
        "/",
        "/home",
        "/galaxy-picks",
        "/favicon.ico",
        "/manifest.webmanifest",
      ])
    )
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.map((k) => (k !== CACHE ? caches.delete(k) : null)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const req = event.request;

  if (req.method !== "GET" || !req.url.startsWith(self.location.origin)) return;

  // Network-first for navigation to avoid stale HTML hydration mismatch
  if (req.mode === "navigate") {
    event.respondWith(
      fetch(req).catch(() => caches.match(req).then((c) => c || caches.match("/home")))
    );
    return;
  }

  // Cache-first for static assets
  event.respondWith(
    caches
      .match(req)
      .then((cached) =>
        cached ||
        fetch(req)
          .then((res) => {
            const copy = res.clone();
            caches.open(CACHE).then((cache) => cache.put(req, copy));
            return res;
          })
          .catch(() => cached)
      )
  );
});
