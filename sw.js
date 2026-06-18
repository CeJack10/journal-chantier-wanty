// Service Worker — Journal WANTY
// Cache auto-invalidé par numéro de version — incrémenter à chaque déploiement
const CACHE = 'journal-wanty-v16';

const STATIC_ASSETS = [
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
  './icon-180.png',
];

// Installation : mise en cache des assets statiques uniquement
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE).then(cache => cache.addAll(STATIC_ASSETS))
  );
  self.skipWaiting();
});

// Activation : suppression de tous les anciens caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(key => key !== CACHE).map(key => {
          console.log('[SW] Suppression ancien cache:', key);
          return caches.delete(key);
        })
      )
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;

  const url = event.request.url;

  // Météo — réseau uniquement, pas de cache
  if (url.includes('open-meteo.com')) {
    event.respondWith(
      fetch(event.request).catch(() =>
        new Response(JSON.stringify({ current: null }), {
          headers: { 'Content-Type': 'application/json' }
        })
      )
    );
    return;
  }

  // index.html — RÉSEAU EN PRIORITÉ (toujours la version fraîche)
  if (url.endsWith('/') || url.endsWith('index.html') || url.endsWith('journal-wanty/')) {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          // Mettre à jour le cache avec la version fraîche
          const clone = response.clone();
          caches.open(CACHE).then(cache => cache.put(event.request, clone));
          return response;
        })
        .catch(() => caches.match(event.request)) // Fallback cache si hors-ligne
    );
    return;
  }

  // Assets statiques — cache en priorité (icons, manifest)
  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;
      return fetch(event.request).then(response => {
        const clone = response.clone();
        caches.open(CACHE).then(cache => cache.put(event.request, clone));
        return response;
      });
    })
  );
});
