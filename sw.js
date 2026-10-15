// Offline support: keep the app shell (and fonts) cached so Box File opens with no network.
// Bump VERSION whenever any shell file changes so phones pick up the update.
const VERSION = 'boxfile-v1';
const SHELL = [
  './',
  'index.html',
  'styles.css',
  'app.js',
  'db.js',
  'manifest.webmanifest',
  'icons/icon.svg',
  'icons/icon-192.png',
  'icons/icon-512.png',
  'icons/apple-touch-icon.png',
];
const FONT_HOSTS = ['fonts.googleapis.com', 'fonts.gstatic.com'];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(VERSION).then((cache) => cache.addAll(SHELL)).then(() => self.skipWaiting()));
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
  const sameOrigin = url.origin === self.location.origin;
  if (!sameOrigin && !FONT_HOSTS.includes(url.hostname)) return;

  // Fonts never change: cache first.
  if (!sameOrigin) {
    event.respondWith(
      caches.match(req).then((hit) => hit || fetch(req).then((res) => {
        if (res.ok || res.type === 'opaque') {
          const copy = res.clone();
          caches.open(VERSION).then((cache) => cache.put(req, copy));
        }
        return res;
      }))
    );
    return;
  }

  // App shell: serve from cache straight away, refresh it in the background.
  const lookup = req.mode === 'navigate' ? caches.match('./') : caches.match(req, { ignoreSearch: true });
  const network = fetch(req).then((res) => {
    if (res.ok) {
      const copy = res.clone();
      caches.open(VERSION).then((cache) => cache.put(req.mode === 'navigate' ? './' : req, copy));
    }
    return res;
  });
  event.respondWith(lookup.then((hit) => hit || network));
  event.waitUntil(network.then(() => {}, () => {}));
});
