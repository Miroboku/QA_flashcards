const CACHE_NAME = 'qa-flashcards-v15';
const urlsToCache = [
  './',
  './index.html',
  './css/style.css',
  './js/app.js',
  './data/flashcards.json',
  './data/quiz.json',
  './icon.svg'
];

self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

// Network-first: завжди тягне свіжу версію, кеш — лише офлайн-fallback
self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request)
      .then(response => {
        // Зберігаємо свіжу версію в кеш
        const responseClone = response.clone();
        caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, responseClone);
        });
        return response;
      })
      .catch(() => {
        // Якщо офлайн — повертаємо з кешу
        return caches.match(event.request);
      })
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(self.clients.claim());
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames =>
      Promise.all(
        cacheNames.map(cacheName => {
          if (!cacheWhitelist.includes(cacheName)) {
            return caches.delete(cacheName);
          }
        })
      )
    )
  );
});
