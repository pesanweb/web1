export const convertBase64ToUint8Array = (base64String) => {
  // Pad base64 string if required
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');
  const rawData = atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
};

export const registerServiceWorker = async () => {
    if ('serviceWorker' in navigator) {
        try {
            const registration = await navigator.serviceWorker.register('./sw.js');
            console.log('ServiceWorker registered');
        } catch (error) {
            console.error('ServiceWorker registration failed:', error);
        }
    }
};

export const initInstallPrompt = () => {
    const installButton = document.querySelector('#install-button');
    const installButtonMobile = document.querySelector('#install-button-mobile');
    let deferredPrompt;

    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;
        if (installButton) installButton.classList.remove('hidden');
        if (installButtonMobile) installButtonMobile.classList.remove('hidden');
    });

    const handleInstall = async () => {
        if (!deferredPrompt) return;
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        console.log(`User response to the install prompt: ${outcome}`);
        deferredPrompt = null;
        if (installButton) installButton.classList.add('hidden');
        if (installButtonMobile) installButtonMobile.classList.add('hidden');
    };

    if (installButton) installButton.addEventListener('click', handleInstall);
    if (installButtonMobile) installButtonMobile.addEventListener('click', handleInstall);
};
