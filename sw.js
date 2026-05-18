const CACHE_NAME = 'qa-flashcards-v14';
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
  self.skipWaiting(); // Оновлює SW без необхідності закривати вкладку
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(self.clients.claim()); // Захоплює контроль над усіма вкладками миттєво
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
