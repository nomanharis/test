// Offline support for Alltag B1: cache the app shell and fonts.
// Bump VERSION whenever any shell file changes so installed copies update.
const VERSION = 'alltagb1-v2';
const SHELL = [
  './', 'index.html', 'styles.css', 'app.js', 'lessons-1.js', 'lessons-2.js', 'android-bridge.js', 'manifest.webmanifest',
  'icons/icon.svg', 'icons/icon-192.png', 'icons/icon-512.png', 'icons/apple-touch-icon.png',
];
const CACHE_HOSTS = ['fonts.googleapis.com', 'fonts.gstatic.com', 'cdn.jsdelivr.net'];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(VERSION).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== VERSION).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  const same = url.origin === self.location.origin;
  if (!same && !CACHE_HOSTS.includes(url.hostname)) return;

  if (!same) {
    // Fonts and the OCR library never change at a pinned version: cache first.
    event.respondWith(caches.match(req).then((hit) => hit || fetch(req).then((res) => {
      if (res.ok || res.type === 'opaque') { const copy = res.clone(); caches.open(VERSION).then((c) => c.put(req, copy)); }
      return res;
    })));
    return;
  }

  // App shell: answer from cache at once, refresh in the background.
  const key = req.mode === 'navigate' ? './' : req;
  const network = fetch(req).then((res) => {
    if (res.ok) { const copy = res.clone(); caches.open(VERSION).then((c) => c.put(key, copy)); }
    return res;
  });
  event.respondWith(caches.match(key, { ignoreSearch: true }).then((hit) => hit || network));
  event.waitUntil(network.then(() => {}, () => {}));
});
