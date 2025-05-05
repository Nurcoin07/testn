const cacheName = 'site-cache';
const filesToCache = [
  '/onlineshopping.com/',
  '/onlineshopping.com/index.html',
  '/onlineshopping.com/manifest.json',
  '/onlineshopping.com/icon-192.png',
  '/onlineshopping.com/icon-512.png',
];

self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(cacheName).then(cache => cache.addAll(filesToCache))
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.map(key => {
        if (key !== cacheName) return caches.delete(key);
      }))
    )
  );
  return self.clients.claim();
});

self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request)
      .then(response => {
        const resClone = response.clone();
        caches.open(cacheName).then(cache => cache.put(event.request, resClone));
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});
