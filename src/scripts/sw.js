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
    let notificationData;
    try {
        // Try to parse payload as JSON
        notificationData = event.data.json();
    } catch (error) {
        // Fallback for plain‑text payloads
        notificationData = {
            title: 'Notifikasi Default',
            body: event.data ? event.data.text() : 'Ada story baru yang ditambahkan',
            icon: '/images/logo.png',
            badge: '/favicon.png',
        };
    }
    // Ensure required fields exist
    const title = notificationData.title || 'Notifikasi Default';
    const options = {
        body: notificationData.body || 'Ada story baru yang ditambahkan',
        icon: notificationData.icon || '/images/logo.png',
        badge: notificationData.badge || '/favicon.png',
    };
    async function chainPromise() {
        await self.registration.showNotification(title, options);
    }
    event.waitUntil(chainPromise());
});