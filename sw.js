// sw.js — минимальный, безопасный кэш
const CACHE = 'bw-cache-v5'; // меняй v1 → v2 при каждом релизе

const ASSETS = [
  './',
  './index.html',
  './manifest.webmanifest',
  './icons/bw-192.png',
  './icons/bw-512.png'
];

self.addEventListener('install', (event) => {
  self.skipWaiting(); // сразу активируем новую версию
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(ASSETS))
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

// Простой cache-first: если файла нет в кэше — берём из сети (и он подтянется уже свежим)
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cached) => cached || fetch(event.request))
  );
});
