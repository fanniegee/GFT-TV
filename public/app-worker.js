// Keep authentication, balances, health records and application pages network-only.
// No page, API response, password or personal record is stored in an offline cache.
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', event => event.waitUntil(self.clients.claim()));
self.addEventListener('fetch', event => {
  if (event.request.mode !== 'navigate') return;
  event.respondWith(fetch(event.request).catch(() => new Response(
    '<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Connection needed</title><body style="font:18px Arial;padding:40px;background:#10243b;color:white"><h1>You are offline</h1><p>Connect to the internet, then reopen or refresh the app to sign in safely.</p><button onclick="location.reload()">Try again</button></body></html>',
    {status:503,headers:{'Content-Type':'text/html; charset=utf-8','Cache-Control':'no-store'}}
  )));
});
