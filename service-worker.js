const CACHE_NAME = 'islam-app-v4'; // Naikkan versi ke v3
const urlsToCache = [
    './',
    './index.html',
    './yasin.html',
    './quran.html',    /* Tambah ini */
    './surah.html',    /* Tambah ini */
    './doa.html',      /* Tambah ini */
    './style.css',
    './yasin.css',
    './quran.css',    /* Tambah ini */
    './doa.css',      /* Tambah ini */
    './app.js',
    './yasin.js',
    './quran.js',    /* Tambah ini */
    './surah.js',    /* Tambah ini */
    './doa.js',      /* Tambah ini */
    './tahli.html',
    './tahli.js',
    './tahlil-style.css',
    './sirah.html',
    './sirah.js',
    './solat.html',
    './solat.js',
    './solat.css',
    './quran.html',
    './quran.js',
    './quran.css',
    './manifest.json',
    'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css',
    'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
    'https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css'
];
// ... kod install, activate, fetch dikekalkan ...
// 1. INSTALL: Simpan semua fail statik
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Cache PWA Islam dibuka');
                return cache.addAll(urlsToCache);
            })
            .then(() => self.skipWaiting())
    );
});

// 2. ACTIVATE: Buang cache lama
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('Memadam cache lama:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => self.clients.claim())
    );
});

// 3. FETCH: Strategi Cache
self.addEventListener('fetch', event => {
    // Abaikan permintaan untuk audio (biarkan browser kendali streaming secara normal)
    if (event.request.url.includes('.mp3')) {
        return;
    }

    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // Jika ada dalam cache, hantar dari cache
                if (response) {
                    return response;
                }
                
                // Jika tiada, ambil dari network
                return fetch(event.request).then(networkResponse => {
                    // Simpan salinan ke cache secara dinamik untuk fail baru
                    if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
                        return networkResponse;
                    }
                    
                    const responseToCache = networkResponse.clone();
                    caches.open(CACHE_NAME).then(cache => {
                        cache.put(event.request, responseToCache);
                    });
                    
                    return networkResponse;
                });
            }).catch(() => {
                // Jika network gagal & tiada cache (fallback)
                if (event.request.mode === 'navigate') {
                    return caches.match('./index.html');
                }
            })
    );
});