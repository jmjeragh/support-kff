const CACHE = "support-launcher-v3";
const ASSETS = [
  "./manifest.webmanifest",
  "./SUPPORT_icon_180.png",
  "./SUPPORT_icon_512_launcher.png"
];

self.addEventListener("install", event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE).then(cache => cache.addAll(ASSETS))
  );
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", event => {
  if(event.request.method !== "GET") return;

  if(event.request.mode === "navigate"){
    event.respondWith(
      fetch(event.request)
        .then(response => response)
        .catch(() => caches.match("./"))
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then(hit => hit || fetch(event.request))
  );
});
