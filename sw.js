self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const cacheKeys = await caches.keys();
    await Promise.all(cacheKeys.map((cacheKey) => caches.delete(cacheKey)));

    await self.clients.claim();

    const clients = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
    for (const client of clients) {
      client.navigate(client.url);
    }

    await self.registration.unregister();
  })());
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request).catch(() => new Response('Offline. Reconnect and reload this page.', {
      status: 503,
      headers: { 'Content-Type': 'text/plain; charset=utf-8' }
    }))
  );
});
