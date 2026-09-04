const CACHE_NAME = 'laddtnov-portfolio-v4';

const APP_SHELL = [
  '/',
  '/index.html',
  '/404.html',
  '/json/manifest.json',
  '/css/base.css',
  '/css/navbar.css',
  '/css/welcome.css',
  '/css/about.css',
  '/css/projects.css',
  '/css/skills.css',
  '/css/contact.css',
  '/css/components.css',
  '/css/responsive.css',
  '/css/print.css',
  '/css/agent.css',
  '/js/main.js',
  '/js/motion.js',
  '/js/ui.js',
  '/js/projects.js',
  '/js/settings.js',
  '/js/i18n.js',
  '/js/sounds.js',
  '/js/easter-egg.js',
  '/js/contact.js',
  '/js/agent.js',
  '/assets/favicon.png',
  '/assets/avatar.svg',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL))
  );
  globalThis.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))
    )
  );
  globalThis.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then((cached) => {
      const network = fetch(event.request)
        .then((response) => {
          if (response.ok) {
            const copy = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
          }
          return response;
        })
        .catch(() => cached || caches.match('/404.html'));

      return cached || network;
    })
  );
});
