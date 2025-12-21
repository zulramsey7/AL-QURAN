/**
 * Fail: service-worker.js
 * Kemaskini: Membolehkan cache audio untuk kegunaan offline
 * Versi Cache: v35
 */

const CACHE_NAME = 'islam-app-v38';
const urlsToCache = [
    './',
    './index.html',
    './Logo2.png',
    './Logo3.png',
    './icon-192x192.png',
    './icon-512x512.png',
    './screenshot1.png',
    './screenshot2.png',
    './yasin.html',
    './quran.html',
    './surah.html',
    './kiblat.html',
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
    './azan.mp3',
    './assets/quran-bg.jpg',
    './assets/masjid.jpg',
    './assets/sirah1.png',
    './assets/sirah2.png',
    './assets/sirah3.png',
    './assets/sirah4.png',
    './assets/masjid-hero.jpg',
    './assets/fonts/Uthman-Taha.ttf',
    './manifest.json',
    'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css',
    'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
    'https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css'
];

// --- 1. INSTALL ---
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('SW: Cache sedang dicipta...');
                // Gunakan addAll dengan berhati-hati. Jika satu fail gagal, semua gagal.
                return cache.addAll(urlsToCache);
            })
    );
});

// --- 2. ACTIVATE ---
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('SW: Memadam cache lama:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => self.clients.claim())
    );
});

// --- 3. FETCH: Strategi Stale-While-Revalidate ---
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request).then(response => {
            const fetchPromise = fetch(event.request).then(networkResponse => {
                if (networkResponse && networkResponse.status === 200) {
                    const responseToCache = networkResponse.clone();
                    caches.open(CACHE_NAME).then(cache => {
                        cache.put(event.request, responseToCache);
                    });
                }
                return networkResponse;
            }).catch(() => {
                if (event.request.mode === 'navigate') {
                    return caches.match('./index.html');
                }
            });

            return response || fetchPromise;
        })
    );
});

// --- 4. MESSAGE ---
self.addEventListener('message', event => {
    if (event.data === 'skipWaiting' || (event.data && event.data.action === 'skipWaiting')) {
        self.skipWaiting();
    }
});
