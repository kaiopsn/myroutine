/* ============================================================
   Minha Rotina — Service Worker
   Deploy: GitHub Pages (funciona em subpasta, ex.: /minha-rotina/)

   Estratégia:
   • HTML principal → Network-first com fallback para cache.
     O usuário sempre recebe a versão mais nova quando online,
     sem precisar limpar cache manualmente.
   • Demais assets → Cache-first (app funciona 100% offline).
   • Ao ativar uma nova versão, avisa o app via postMessage para
     exibir o banner "Atualizar" — sem perder nada do localStorage.

   Todos os caminhos são RELATIVOS (./) para funcionar tanto na
   raiz do domínio quanto em subpasta de projeto do GitHub Pages.
   ============================================================ */
const CACHE = 'minha-rotina-v12';

// Precache do essencial (tolerante a falhas individuais)
const PRECACHE = [
  './',
  './index.html',
  './manifest.webmanifest',
  './icon.svg',
  './icon-192.png',
  './icon-512.png',
  './icon-maskable-512.png',
  './apple-touch-icon.png',
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE)
      .then(c => Promise.all(PRECACHE.map(u => c.add(u).catch(() => {}))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.matchAll({ type: 'window', includeUncontrolled: true }))
      .then(clients => clients.forEach(c => c.postMessage({ type: 'SW_UPDATED', cache: CACHE })))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;

  // Requisições externas: fontes do Google (Fraunces) são cacheadas
  // (cache-first) para o app manter a tipografia offline; demais externas
  // (CDN xlsx etc.) passam direto pela rede.
  if (!req.url.startsWith(self.location.origin)) {
    const isFont = /fonts\.(googleapis|gstatic)\.com/.test(req.url);
    if (isFont) {
      e.respondWith(
        caches.match(req).then(cached => {
          if (cached) return cached;
          return fetch(req).then(res => {
            if (res && (res.ok || res.type === 'opaque')) {
              const clone = res.clone();
              caches.open(CACHE).then(c => c.put(req, clone));
            }
            return res;
          }).catch(() => new Response('', { status: 408 }));
        })
      );
    } else {
      e.respondWith(fetch(req).catch(() => new Response('', { status: 408 })));
    }
    return;
  }

  const isHTML =
    req.mode === 'navigate' ||
    (req.headers.get('accept') || '').includes('text/html');

  if (isHTML) {
    // ── HTML: Network-first (cai para o cache offline) ──
    e.respondWith(
      fetch(req)
        .then(res => {
          if (res && res.status === 200) {
            const clone = res.clone();
            caches.open(CACHE).then(c => c.put(req, clone));
          }
          return res;
        })
        .catch(() =>
          caches.match(req).then(r => r || caches.match('./index.html')).then(r => r || caches.match('./'))
        )
    );
  } else {
    // ── Assets: Cache-first ──
    e.respondWith(
      caches.match(req).then(cached => {
        if (cached) return cached;
        return fetch(req).then(res => {
          if (res && res.status === 200) {
            const clone = res.clone();
            caches.open(CACHE).then(c => c.put(req, clone));
          }
          return res;
        }).catch(() => new Response('', { status: 408 }));
      })
    );
  }
});
