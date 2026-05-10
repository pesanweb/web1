import { defaultConfig as CONFIG } from '../config';

const NotificationHelper = {
    async _checkAvailability() {
        return 'serviceWorker' in navigator && 'PushManager' in window;
    },

    async _checkPermission() {
        if (Notification.permission === 'granted') return true;
        if (Notification.permission === 'denied') return false;

        const permission = await Notification.requestPermission();
        return permission === 'granted';
    },

    async _getSubscription() {
        const registration = await navigator.serviceWorker.ready;
        return registration.pushManager.getSubscription();
    },

    async _subscribeUser() {
        const registration = await navigator.serviceWorker.ready;
        return registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: this._urlBase64ToUint8Array(CONFIG.VAPID_PUBLIC_KEY),
        });
    },

    async _unsubscribeUser() {
        const subscription = await this._getSubscription();
        if (subscription) {
            await subscription.unsubscribe();
        }
    },

    _urlBase64ToUint8Array(base64String) {
        const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
        const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
        const rawData = window.atob(base64);
        const outputArray = new Uint8Array(rawData.length);
        for (let i = 0; i < rawData.length; ++i) {
            outputArray[i] = rawData.charCodeAt(i);
        }
        return outputArray;
    },

    async init(container) {
        if (!(await this._checkAvailability())) {
            console.warn('Push notification is not supported in this browser');
            return;
        }

        console.log('NotificationHelper initialized');
        this._container = container;
        await this._render();
    },

    async _render() {
        try {
            this._container.innerHTML = ''; // Clear container before rendering
            const subscription = await this._getSubscription();
            const isSubscribed = !!subscription;
            console.log('Current subscription status:', isSubscribed);

            this._container.innerHTML = `
        <button id="subscribe-button" class="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors text-sm">
          ${isSubscribed ? 'Unsubscribe' : 'Subscribe'}
        </button>
      `;

            const button = this._container.querySelector('#subscribe-button');
            button.onclick = async (e) => {
                e.preventDefault();
                console.log('Subscribe button clicked');
                button.disabled = true;
                button.innerText = 'Processing...';

                try {
                    if (isSubscribed) {
                        console.log('Unsubscribing user...');
                        await this._unsubscribeUser();
                    } else {
                        console.log('Checking permission...');
                        const permission = await this._checkPermission();
                        if (permission) {
                            console.log('Subscribing user...');
                            await this._subscribeUser();
                        } else {
                            alert('Izin notifikasi ditolak');
                        }
                    }
                    await this._render();
                } catch (error) {
                    console.error('Failed to update subscription:', error);
                    alert('Gagal mengupdate status langganan. Cek console.');
                } finally {
                    button.disabled = false;
                }
            };
        } catch (error) {
            console.error('Error during NotificationHelper render:', error);
        }
    }
};

export default NotificationHelper;
