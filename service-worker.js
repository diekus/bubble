importScripts('gallery-data.js');

const CACHE_NAME = '360viewer-cache-v4';
const SHARE_CACHE = 'bubble-share-target';
const OFFLINE_URL = 'offline.html';
const urlsToCache = [
  './',
  'index.html',
  'offline.html',
  'css/style.css',
  'css/dark.css',
  'css/light.css',
  'app.js',
  'gallery-data.js',
  'manifest.json',
  'images/favicon.png',
  'images/bubble-logo.png',
  'images/bubble-logo-dark.png',
  'images/icon-192.png',
  'images/icon-512.png',
  ...GALLERY_IMAGES.map(img => img.src)
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(key => key !== CACHE_NAME && key !== SHARE_CACHE)
          .map(key => caches.delete(key))
      )
    )
  );
});

// receives images shared from other apps via the OS share sheet (share_target in manifest.json)
async function handleShareTarget(event) {
  const formData = await event.request.formData();
  const file = formData.get('images');
  if (file) {
    const cache = await caches.open(SHARE_CACHE);
    await cache.put('shared-image', new Response(file));
  }
  return Response.redirect('./?shared=1', 303);
}

const SHARE_TARGET_URL = new URL('share-target/', self.registration.scope).href;

self.addEventListener('fetch', event => {
  if (event.request.method === 'POST' && event.request.url === SHARE_TARGET_URL) {
    event.respondWith(handleShareTarget(event));
    return;
  }

  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;
      return fetch(event.request).catch(() => {
        if (event.request.mode === 'navigate') {
          return caches.match(OFFLINE_URL);
        }
      });
    })
  );
});
