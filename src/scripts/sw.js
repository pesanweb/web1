import { precacheAndRoute } from 'workbox-precaching';

// Workbox will inject the manifest here
precacheAndRoute(self.__WB_MANIFEST);

self.addEventListener('install', () => {
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        clients.claim()
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