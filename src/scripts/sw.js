const CACHE_NAME = 'story-app-v1';
const urlsToCache = [
    '/',
    '/index.html',
    '/app.bundle.js',
    '/favicon.png',
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(urlsToCache);
        })
    );
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request);
        })
    );
});

self.addEventListener('push', (event) => {

    console.log('[Service Worker] Push Received.');

    const notificationData = {
        title: 'Story Baru 🎉',
        options: {
            body: 'Ada story baru yang ditambahkan',
            icon: '/images/logo.png',
            badge: '/favicon.png',
        },
    };

    if (event.data) {
        const data = JSON.parse(event.data.text());
        notificationData.title = data.title || notificationData.title;
        notificationData.options.body = data.body || notificationData.options.body;
        notificationData.options.icon = data.icon || notificationData.options.icon;
    }

    async function chainPromise() {
        await self.registration.showNotification(notificationData.title, notificationData.options);
    }

    event.waitUntil(
        chainPromise()
    );
});