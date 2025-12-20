const CACHE_NAME = 'islam-app-v8'; // Setiap kali update, tukar nombor v9, v10, v11...
const urlsToCache = [
    './',
    './index.html',
    './icon-192x192.png',
    './yasin.html',
    './quran.html',
    './surah.html',
    './doa.html',
    './sirah.html',
    './solat.html',
    './tahlil.html',
    './style.css',
    './yasin.css',
    './quran.css',
    './doa.css',
    './solat.css',
    './tahlil-style.css',
    './app.js',
    './yasin.js',
    './quran.js',
    './surah.js',
    './doa.js',
    './sirah.js',
    './solat.js',
    './tahlil.js',
    './assets/quran-bg.jpg',
    './assets/masjid.jpg',
    './assets/sirah1.png',
    './assets/sirah2.png',
    './assets/sirah3.png',
    './assets/sirah4.png',
    './assets/masjid-hero.jpg',
    './manifest.json',
    'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css',
    'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
    'https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css'
];

// 1. INSTALL: Simpan semua fail statik
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Cache PWA Islam dibuka');
                return cache.addAll(urlsToCache);
            })
            .then(() => self.skipWaiting()) // Memaksa SW baru aktif
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
        }).then(() => self.clients.claim()) // Terus kawal client tanpa refresh manual
    );
});

// 3. FETCH: Strategi Cache
self.addEventListener('fetch', event => {
    if (event.request.url.includes('.mp3')) {
        return; // Jangan cache audio supaya jimat storage
    }

    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // Jika ada dalam cache, guna cache. Jika tiada, cari di internet.
                return response || fetch(event.request).then(networkResponse => {
                    // Simpan fail baru yang dijumpai ke dalam cache secara dinamik
                    if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
                        const responseToCache = networkResponse.clone();
                        caches.open(CACHE_NAME).then(cache => {
                            cache.put(event.request, responseToCache);
                        });
                    }
                    return networkResponse;
                });
            }).catch(() => {
                if (event.request.mode === 'navigate') {
                    return caches.match('./index.html');
                }
            })
    );
});

// TAMBAHAN: Dengar arahan untuk kemaskini segera
self.addEventListener('message', (event) => {
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
  }
});
